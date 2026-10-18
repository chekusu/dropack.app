// Renders the neutral sample film in media/sample/ (checked in, so a clean clone builds without
// it): plain tiles drop one by one into an open box, the box closes and slides away, and the
// loop starts again. Every frame is drawn here from rectangles and circles — no photographs,
// fonts, voices or recordings — and the film has no audio track. Needs FFmpeg with libx264;
// `npm run build` does not run this.
//   node scripts/sample-media.mjs                 writes media/sample/*.mp4, *.jpg, media.json
//   FFMPEG=/path/to/ffmpeg node scripts/sample-media.mjs
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const W = 640, H = 360, FPS = 12, SECONDS = 36;
const out = fileURLToPath(new URL('../media/sample/', import.meta.url));
const ffmpeg = process.env.FFMPEG || 'ffmpeg';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const PAPER = hex('#f2ece1'), KRAFT = hex('#c9a77c'), KRAFT_DARK = hex('#a8875e'), INK = hex('#1f4a3d'), MINT = hex('#9fcdb6');
const TILES = ['#e9b872', '#8fb8c9', '#d98e73', '#a6c48a', '#c7a3c9', '#7fa7a0', '#e3c567', '#9aa7d6'].map(hex);

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a, b, t) => a + (b - a) * t;

function frame(t) {
  const px = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) px.set(PAPER, i * 3);
  const rect = (x, y, w, h, c) => {
    for (let yy = Math.max(0, Math.round(y)); yy < Math.min(H, Math.round(y + h)); yy++)
      for (let xx = Math.max(0, Math.round(x)); xx < Math.min(W, Math.round(x + w)); xx++) px.set(c, (yy * W + xx) * 3);
  };
  const circle = (cx, cy, r, c) => {
    for (let yy = Math.max(0, Math.floor(cy - r)); yy < Math.min(H, Math.ceil(cy + r)); yy++)
      for (let xx = Math.max(0, Math.floor(cx - r)); xx < Math.min(W, Math.ceil(cx + r)); xx++)
        if ((xx - cx) ** 2 + (yy - cy) ** 2 <= r * r) px.set(c, (yy * W + xx) * 3);
  };

  // One 12-second cycle, three times: tiles drop in (0–7 s), the box closes (7–8.5 s), a check
  // appears (8.5–10 s), the box slides out to the right (10–12 s).
  const c = t % 12;
  const slide = ease((c - 10) / 2) * (W * 0.75);
  const bx = 200 + slide, by = 200, bw = 240, bh = 120;
  const dropped = [];
  TILES.forEach((col, i) => {
    const start = 0.4 + i * 0.8;
    const k = ease((c - start) / 0.9);
    if (k <= 0) return;
    const tx = bx + 24 + (i % 4) * 50, ty = by - 18 - Math.floor(i / 4) * 16;
    const sx = 40 + ((i * 97) % 560), sy = -60;
    dropped.push([lerp(sx, tx, k), lerp(sy, ty, k), col]);
  });
  rect(bx - 6, by + bh, bw + 12, 6, KRAFT_DARK); // shadow line
  for (const [x, y, col] of dropped) { rect(x - 2, y - 2, 44, 34, [250, 248, 242]); rect(x, y, 40, 30, col); }
  rect(bx, by, bw, bh, KRAFT);
  const close = ease((c - 7) / 1.5);
  if (close > 0) rect(bx, by - 16 * close, bw, 22 * close + 2, KRAFT_DARK);
  rect(bx, by + 16, bw, 10, MINT);
  const check = ease((c - 8.5) / 0.8);
  if (check > 0) {
    circle(bx + bw / 2, by + bh / 2 + 10, 26 * check, INK);
    if (check > 0.6) for (let s = 0; s < 14; s++) { circle(bx + bw / 2 - 12 + s * 0.6, by + bh / 2 + 10 + s * 0.6, 3, PAPER); circle(bx + bw / 2 - 4 + s * 1.2, by + bh / 2 + 18 - s * 1.4, 3, PAPER); }
  }
  return px;
}

function run(args, frames) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-', ...args], { stdio: ['pipe', 'inherit', 'inherit'] });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
    (async () => {
      for (const f of frames()) if (!p.stdin.write(f)) await new Promise((r) => p.stdin.once('drain', r));
      p.stdin.end();
    })();
  });
}

const BITEXACT = ['-map_metadata', '-1', '-fflags', '+bitexact', '-flags', '+bitexact'];
await run(['-an', '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'animation', '-crf', '30', '-pix_fmt', 'yuv420p', '-g', String(FPS * 4),
  '-x264-params', 'threads=1', '-bsf:v', 'filter_units=remove_types=6', '-movflags', '+faststart', ...BITEXACT, `${out}sample-film.mp4`],
function* () { for (let i = 0; i < FPS * SECONDS; i++) yield frame(i / FPS); });
await run(['-frames:v', '1', '-q:v', '3', ...BITEXACT, `${out}sample-poster.jpg`], function* () { yield frame(9.6); });

const sha = async (f) => createHash('sha256').update(await readFile(`${out}${f}`)).digest('hex');
const manifest = {
  about: 'Neutral sample media for local builds: an original animation drawn by scripts/sample-media.mjs (no audio, no photographs, no people). Replace it with your own media through DROPACK_MEDIA_MANIFEST; see README.md.',
  default: { video: 'sample-film.mp4', poster: 'sample-poster.jpg', width: W, height: H, duration: SECONDS },
  sha256: { 'sample-film.mp4': await sha('sample-film.mp4'), 'sample-poster.jpg': await sha('sample-poster.jpg') },
};
await writeFile(`${out}media.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote media/sample/ (${W}×${H}, ${SECONDS} s at ${FPS} fps)`);
