// Minimal static server for dist/, mirroring the production behaviour:
// /path/ serves /path/index.html, /path redirects to /path/, misses get 404.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.js': 'text/javascript; charset=utf-8', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.vtt': 'text/vtt; charset=utf-8',
  '.srt': 'application/x-subrip', '.webp': 'image/webp',
};

export function serve(port = Number(process.env.PORT) || 4321, host = process.env.HOST || '127.0.0.1') {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(dist, rel);
    try {
      const s = await stat(file);
      if (s.isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          res.writeHead(307, { Location: url.pathname + '/' + url.search }).end();
          return;
        }
        file = join(file, 'index.html');
      }
      const body = await readFile(file);
      const type = types[extname(file)] || 'application/octet-stream';
      // Byte ranges for the film, like the production Worker (worker/index.mjs).
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (m && extname(file) === '.mp4') {
        const start = m[1] === '' ? body.length - Number(m[2]) : Number(m[1]);
        const end = m[1] === '' || m[2] === '' ? body.length - 1 : Math.min(Number(m[2]), body.length - 1);
        if (start >= body.length || start < 0) { res.writeHead(416, { 'Content-Range': `bytes */${body.length}` }).end(); return; }
        res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 }).end(body.subarray(start, end + 1));
        return;
      }
      res.writeHead(200, { 'Content-Type': type, ...(extname(file) === '.mp4' ? { 'Accept-Ranges': 'bytes' } : {}) }).end(body);
    } catch {
      const body = await readFile(join(dist, '404.html'));
      res.writeHead(404, { 'Content-Type': types['.html'] }).end(body);
    }
  });
  return new Promise((resolve) => server.listen(port, host, () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = await serve();
  const { address, port } = server.address();
  console.log(`serving dist/ at http://${address}:${port}/`);
}
