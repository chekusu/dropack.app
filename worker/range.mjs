// Byte-range parsing for worker/index.mjs (RFC 9110 §14). Kept separate so it can be tested
// without the Workers runtime.

/**
 * Parses a Range header for a resource of `size` bytes.
 * Returns null (serve the whole resource), { start, end } (inclusive), or 'unsatisfiable'.
 */
export function parseRange(header, size) {
  const m = /^\s*bytes\s*=\s*(.+)$/i.exec(header ?? '');
  if (!m) return null; // absent, or a unit other than bytes: ignore
  const specs = m[1].split(',');
  if (specs.length > 1) return null; // several ranges would need multipart; the whole file is valid
  const spec = /^\s*(\d*)\s*-\s*(\d*)\s*$/.exec(specs[0]);
  if (!spec || (spec[1] === '' && spec[2] === '')) return null; // malformed: ignore the header
  if (spec[1] === '') {
    const n = Number(spec[2]); // suffix: the last n bytes
    if (n === 0 || size === 0) return 'unsatisfiable';
    return { start: Math.max(0, size - n), end: size - 1 };
  }
  const start = Number(spec[1]);
  if (start >= size) return 'unsatisfiable';
  if (spec[2] !== '' && Number(spec[2]) < start) return null; // invalid range-spec: ignore
  const end = spec[2] === '' ? size - 1 : Math.min(Number(spec[2]), size - 1);
  return { start, end };
}

/** If-Range: a strong ETag must match exactly, or an HTTP date must equal Last-Modified. */
export function ifRangeMatches(value, etag, lastModified) {
  if (!value) return true;
  const v = value.trim();
  if (v.startsWith('"') || v.startsWith('W/')) return Boolean(etag) && !v.startsWith('W/') && !etag.startsWith('W/') && v === etag;
  return Boolean(lastModified) && v === lastModified;
}
