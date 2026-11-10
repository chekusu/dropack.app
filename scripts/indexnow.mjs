// Tells IndexNow search engines (Bing, Yandex, Naver, Seznam and others) that pages changed.
// Run after a deploy: `node scripts/indexnow.mjs` submits every URL in the live sitemap, or pass
// URLs as arguments. The key file (public/<key>.txt) proves the site owns the key; it has to be
// live on the site before a submission is accepted. Uses Node.js built-ins only.
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from '../src/content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const key = readdirSync(join(root, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.slice(0, -4);
if (!key) throw new Error('no IndexNow key file in public/');

let urls = process.argv.slice(2);
if (!urls.length) {
  const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const live = await fetch(`${SITE}/${key}.txt`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`${SITE}/${key}.txt is not live yet; deploy first`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (res.status >= 400) process.exit(1);
