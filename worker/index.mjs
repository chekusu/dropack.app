// dropack.app Worker. Static assets answer everything; this script runs first only for
// /media/* (wrangler.jsonc run_worker_first) and changes nothing except MP4 responses:
// static assets reply to a Range request with the whole file, which leaves browsers unable
// to seek, so MP4s get byte ranges (206/416), Accept-Ranges and correct HEAD replies on top of
// the unchanged asset response (same bytes, type, ETag, cache and download headers).
import { ifRangeMatches, parseRange } from './range.mjs';

const MP4 = /^\/media\/(?:dl\/)?[\w.-]+\.mp4$/;

// Streams bytes [start, end] of a body without buffering the file.
function slice(body, start, end) {
  let offset = 0;
  return body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const from = Math.max(start - offset, 0);
      const to = Math.min(end + 1 - offset, chunk.byteLength);
      if (from < to) controller.enqueue(chunk.subarray(from, to));
      offset += chunk.byteLength;
      if (offset > end) controller.terminate();
    },
  }));
}

// The runtime sends Content-Length for a stream only through a FixedLengthStream.
function sized(stream, length) {
  if (typeof FixedLengthStream !== 'function') return stream;
  const fixed = new FixedLengthStream(length);
  stream.pipeTo(fixed.writable).catch(() => {});
  return fixed.readable;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const method = request.method;
    if (!MP4.test(pathname) || (method !== 'GET' && method !== 'HEAD')) return env.ASSETS.fetch(request);

    // Ask static assets for the whole, uncompressed file, keeping conditional headers.
    const headers = new Headers(request.headers);
    headers.delete('Range');
    headers.delete('If-Range');
    headers.set('Accept-Encoding', 'identity');
    const full = await env.ASSETS.fetch(new Request(request.url, { method: 'GET', headers }));
    if (full.status !== 200) {
      if (method === 'GET') return full; // 304, 404 … unchanged
      await full.body?.cancel().catch(() => {});
      return new Response(null, { status: full.status, headers: full.headers });
    }
    const out = new Headers(full.headers);
    out.set('Accept-Ranges', 'bytes');
    let body = full.body;
    let size = Number(full.headers.get('Content-Length'));
    if (!Number.isFinite(size) || full.headers.get('Content-Length') === null) {
      const bytes = new Uint8Array(await full.arrayBuffer());
      size = bytes.byteLength;
      body = new Blob([bytes]).stream();
    }
    // Range is defined for GET only (RFC 9110 §14.2); HEAD reports the whole resource.
    const range = method === 'GET' ? request.headers.get('Range') : null;
    const span = range && ifRangeMatches(request.headers.get('If-Range'), full.headers.get('ETag'), full.headers.get('Last-Modified'))
      ? parseRange(range, size) : null;

    if (span === 'unsatisfiable') {
      await body?.cancel().catch(() => {});
      out.set('Content-Range', `bytes */${size}`);
      out.set('Content-Length', '0');
      out.delete('Content-Type');
      return new Response(null, { status: 416, headers: out });
    }
    if (span === null) {
      out.set('Content-Length', String(size));
      if (method === 'HEAD') { await body?.cancel().catch(() => {}); return new Response(null, { status: 200, headers: out }); }
      return new Response(sized(body, size), { status: 200, headers: out });
    }
    const length = span.end - span.start + 1;
    out.set('Content-Range', `bytes ${span.start}-${span.end}/${size}`);
    out.set('Content-Length', String(length));
    return new Response(sized(slice(body, span.start, span.end), length), { status: 206, headers: out });
  },
};
