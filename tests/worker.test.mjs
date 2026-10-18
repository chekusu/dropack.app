// The /media/ Worker: byte ranges, HEAD and If-Range on top of an unchanged asset response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';
import { ifRangeMatches, parseRange } from '../worker/range.mjs';

const BYTES = new Uint8Array(1000).map((_, i) => i % 251);
const ETAG = '"abc123"';
const LAST = 'Mon, 12 Oct 2026 00:00:00 GMT';
const env = {
  ASSETS: {
    async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname.endsWith('missing.mp4')) return new Response('nope', { status: 404 });
      if (req.headers.get('If-None-Match') === ETAG) return new Response(null, { status: 304, headers: { ETag: ETAG } });
      // Like static assets, this fake ignores Range and always returns the whole file.
      return new Response(BYTES, { status: 200, headers: { 'Content-Type': url.pathname.endsWith('.mp4') ? 'video/mp4' : 'text/vtt', 'Content-Length': String(BYTES.length), ETag: ETAG, 'Last-Modified': LAST, 'Cache-Control': 'public, max-age=31536000, immutable' } });
    },
  },
};
const call = (path, init = {}) => worker.fetch(new Request(`https://dropack.app${path}`, init), env);
const bytes = async (res) => new Uint8Array(await res.arrayBuffer());

test('parseRange follows RFC 9110', () => {
  assert.deepEqual(parseRange('bytes=0-99', 1000), { start: 0, end: 99 });
  assert.deepEqual(parseRange('bytes=900-', 1000), { start: 900, end: 999 });
  assert.deepEqual(parseRange('bytes=-100', 1000), { start: 900, end: 999 });
  assert.deepEqual(parseRange('bytes=990-5000', 1000), { start: 990, end: 999 });
  assert.equal(parseRange('bytes=1000-', 1000), 'unsatisfiable');
  assert.equal(parseRange('bytes=-0', 1000), 'unsatisfiable');
  assert.equal(parseRange('bytes=0-1,5-6', 1000), null);
  assert.equal(parseRange('items=0-1', 1000), null);
  assert.equal(parseRange('bytes=abc', 1000), null);
  assert.equal(parseRange('bytes=50-10', 1000), null);
  assert.equal(ifRangeMatches(ETAG, ETAG, LAST), true);
  assert.equal(ifRangeMatches('"other"', ETAG, LAST), false);
  assert.equal(ifRangeMatches(`W/${ETAG}`, ETAG, LAST), false);
  assert.equal(ifRangeMatches(LAST, ETAG, LAST), true);
});

test('MP4 range requests get 206 with the exact bytes', async () => {
  for (const [range, start, end] of [['bytes=0-1', 0, 1], ['bytes=100-299', 100, 299], ['bytes=-10', 990, 999], ['bytes=995-', 995, 999]]) {
    const res = await call('/media/dropack-film.0123456789.mp4', { headers: { Range: range } });
    assert.equal(res.status, 206, range);
    assert.equal(res.headers.get('Content-Range'), `bytes ${start}-${end}/1000`);
    assert.equal(res.headers.get('Content-Length'), String(end - start + 1));
    assert.equal(res.headers.get('Accept-Ranges'), 'bytes');
    assert.equal(res.headers.get('Content-Type'), 'video/mp4');
    assert.equal(res.headers.get('ETag'), ETAG);
    assert.deepEqual(await bytes(res), BYTES.slice(start, end + 1));
  }
});

test('unsatisfiable ranges get 416; a full GET and HEAD get 200 with the length', async () => {
  const bad = await call('/media/dl/dropack-film-en.0123456789.mp4', { headers: { Range: 'bytes=5000-' } });
  assert.equal(bad.status, 416);
  assert.equal(bad.headers.get('Content-Range'), 'bytes */1000');
  const full = await call('/media/dropack-film.0123456789.mp4');
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('Accept-Ranges'), 'bytes');
  assert.deepEqual(await bytes(full), BYTES);
  const head = await call('/media/dropack-film.0123456789.mp4', { method: 'HEAD', headers: { Range: 'bytes=0-1' } });
  assert.equal(head.status, 200, 'Range is ignored for HEAD');
  assert.equal(head.headers.get('Content-Length'), '1000');
  assert.equal((await bytes(head)).length, 0);
});

test('If-Range: matching validator gets the range, a changed one gets the whole file', async () => {
  const same = await call('/media/dropack-film.0123456789.mp4', { headers: { Range: 'bytes=0-9', 'If-Range': ETAG } });
  assert.equal(same.status, 206);
  const other = await call('/media/dropack-film.0123456789.mp4', { headers: { Range: 'bytes=0-9', 'If-Range': '"changed"' } });
  assert.equal(other.status, 200);
  assert.equal((await bytes(other)).length, 1000);
});

test('other media and non-200 answers pass through unchanged', async () => {
  const vtt = await call('/media/captions/dropack-film.en.0123456789.vtt', { headers: { Range: 'bytes=0-1' } });
  assert.equal(vtt.status, 200, 'non-MP4 files are left to static assets');
  assert.equal(vtt.headers.get('Accept-Ranges'), null);
  assert.equal((await call('/media/missing.mp4')).status, 404);
  assert.equal((await call('/media/dropack-film.0123456789.mp4', { headers: { 'If-None-Match': ETAG } })).status, 304);
});
