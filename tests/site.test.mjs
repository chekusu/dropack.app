// Static checks on the built dist/ (run `npm test`, which builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const read = (rel) => readFileSync(join(dist, rel), 'utf8');
const LANDING_PATHS = {
  en: 'en/', 'zh-CN': '', 'zh-TW': 'zh-tw/', ja: 'ja/', ko: 'ko/', es: 'es/', fr: 'fr/', de: 'de/',
  it: 'it/', 'pt-BR': 'pt-br/', nl: 'nl/', pl: 'pl/', tr: 'tr/', ar: 'ar/', hi: 'hi/', id: 'id/',
};
const landing = Object.fromEntries(Object.entries(LANDING_PATHS).map(([tag, p]) => [`${p}index.html`, tag]));
const pages = {
  ...landing,
  'privacy/index.html': 'zh-CN',
  'en/privacy/index.html': 'en',
  'support/index.html': 'zh-CN',
  '404.html': 'zh-CN',
};
// The one link that leaves dropack.app: the support page's CHEKUSU contact form.
const CONTACT = 'https://chekusu.com/#contact';
// The verified public TestFlight invitation, the landing pages' only external link (written out
// here, not imported, so a changed link in the source fails the tests).
const TESTFLIGHT_JOIN = 'https://testflight.apple.com/join/yjrwM4vT';
// The open-source repositories, linked from every footer (written out, not imported).
const APP_SOURCE = 'https://github.com/chekusu/dropack';
const SITE_SOURCE = 'https://github.com/chekusu/dropack.app';
// The media manifest the build used (the checked-in sample unless DROPACK_MEDIA_MANIFEST is set).
const MANIFEST = process.env.DROPACK_MEDIA_MANIFEST || fileURLToPath(new URL('../media/sample/media.json', import.meta.url));
const MEDIA = JSON.parse(readFileSync(MANIFEST, 'utf8'));
// The site's origin (DROPACK_SITE_URL, default https://dropack.app), as a regular expression.
const { SITE } = await import('../src/content.mjs');
const ORIGIN = SITE.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const text = (html) =>
  html
    .replace(/<head>[\s\S]*?<\/head>/, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ');
// Visible text plus the metadata people see in search results and link previews.
const allCopy = (html) => text(html) + ' ' + [...html.matchAll(/content="([^"]*)"/g)].map((m) => m[1]).join(' ');
const file = (url) => join(dist, url.replace(/^\//, '').replace(/\?.*$/, ''));

test('every page exists with its language, title and description', () => {
  for (const [rel, lang] of Object.entries(pages)) {
    const html = read(rel);
    assert.match(html, new RegExp(`<html lang="${lang}"${lang === 'ar' ? ' dir="rtl"' : ''}>`), rel);
    assert.match(html, /<title>[^<]{10,}<\/title>/, rel);
    assert.match(html, /<meta name="description" content="[^"]{20,}">/, rel);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${rel}: one h1`);
    assert.match(html, /<main id="main"/, rel);
    assert.match(html, /class="skip" href="#main"/, rel);
  }
});

test('canonical, hreflang and Open Graph point at the site origin and real files', () => {
  for (const rel of Object.keys(pages).filter((r) => r !== '404.html')) {
    const html = read(rel);
    assert.match(html, new RegExp(`<link rel="canonical" href="${ORIGIN}/`), rel);
    const langs = rel in landing ? [...Object.keys(LANDING_PATHS), 'x-default'] : ['zh-CN', 'en', 'x-default'];
    for (const lang of langs) assert.match(html, new RegExp(`hreflang="${lang}" href="${ORIGIN}/`), `${rel}: ${lang}`);
    const og = html.match(new RegExp(`property="og:image" content="${ORIGIN}/([^"?]+)\\?v=[0-9a-f]{10}"`));
    assert.ok(og && existsSync(join(dist, og[1])), `${rel}: og:image file`);
  }
  assert.match(read('404.html'), /<meta name="robots" content="noindex">/);
  for (const f of ['favicon.ico', 'apple-touch-icon.png', 'styles.css', 'lang.js', 'robots.txt', 'sitemap.xml', '_headers']) {
    assert.ok(existsSync(join(dist, f)), f);
  }
  assert.equal((read('sitemap.xml').match(/<loc>/g) || []).length, 19);
});

test('only the self-hosted language script; no third-party resources or forms', () => {
  for (const rel of Object.keys(pages)) {
    const html = read(rel);
    const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
    if (rel in landing) assert.deepEqual(scripts.map((s) => s.replace(/\?v=[0-9a-f]{10}/, '')), ['<script src="/lang.js" defer>', '<script src="/demo.js">'], rel);
    else assert.equal(scripts.length, 0, rel);
    assert.doesNotMatch(html, /<script>|\son[a-z]+="|<iframe|<form|<input|<embed|<object/i, rel);
    for (const [, url] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      if (rel === 'support/index.html' && url === CONTACT) continue;
      if (rel in landing && url === TESTFLIGHT_JOIN) continue;
      if (url === APP_SOURCE || url === SITE_SOURCE) continue;
      if (/^https?:/.test(url)) assert.match(url, new RegExp(`^${ORIGIN}/`), `${rel}: ${url}`);
    }
    assert.doesNotMatch(html, /apps\.apple\.com/, `${rel}: no App Store links`);
    const tf = [...html.matchAll(/testflight\.apple\.com[^"'\s<]*/g)].map((m) => `https://${m[0]}`);
    assert.deepEqual(tf, rel in landing ? [TESTFLIGHT_JOIN] : [], `${rel}: TestFlight links`);
  }
  const headers = read('_headers');
  assert.match(headers, /Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self';/);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval|https?:\/\//);
  assert.match(headers, /no-transform/);
  assert.match(headers, /\/media\/\*\n  ! Cache-Control\n  Cache-Control: public, max-age=31536000, immutable, no-transform/);
  assert.match(headers, /\/media\/dl\/\*\n  Content-Disposition: attachment/);
  // The stylesheet imports nothing and loads only the two self-hosted watercolor layers.
  const css = read('styles.css');
  assert.doesNotMatch(css, /@import/);
  const urls = [...css.matchAll(/url\(\s*["']?([^"')]+)/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(urls)].sort(), ['/art/watercolor-desktop.webp', '/art/watercolor-mobile.webp']);
  for (const u of urls) assert.ok(existsSync(join(dist, u)), u);
});

test('internal links and in-page anchors resolve', () => {
  for (const rel of Object.keys(pages)) {
    const html = read(rel);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${rel}: unique ids`);
    for (const [, url] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      if (/^https?:/.test(url)) continue;
      const [path, hash] = url.split('#');
      const target = path === '' ? rel : path.replace(/^\//, '').replace(/\?.*$/, '');
      const f = target === '' || target.endsWith('/') ? `${target}index.html` : target;
      assert.ok(existsSync(join(dist, f)), `${rel}: ${url} -> ${f}`);
      if (hash) assert.match(read(f), new RegExp(`id="${hash}"`), `${rel}: ${url} anchor`);
    }
  }
  // Every language option opens a real page.
  for (const [, url] of read('index.html').matchAll(/<option value="([^"]+)"/g)) assert.ok(existsSync(join(dist, url, 'index.html')), url);
});

test('each landing page shows the manifest film as an inline animation with one caption track', () => {
  const stamp = /(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})/g;
  const sha = (buf) => createHash('sha256').update(buf).digest('hex');
  const source = (name) => readFileSync(join(MANIFEST, '..', name));
  for (const [rel, tag] of Object.entries(landing)) {
    const html = read(rel);
    const m = { ...MEDIA.default, ...MEDIA.locales?.[tag] };
    const videos = html.match(/<video\b[^>]*>/g) || [];
    assert.equal(videos.length, 1, `${rel}: one video`);
    const v = videos[0];
    // Muted and inline; demo.js plays it only while visible (never with reduced motion) and removes
    // the native controls, which stay in the markup only as the no-JavaScript fallback.
    for (const a of ['muted', 'playsinline', 'preload="metadata"', 'controlslist="nodownload"', `width="${m.width}" height="${m.height}"`]) assert.ok(v.includes(a), `${rel}: ${a}`);
    assert.doesNotMatch(v, /autoplay|\sloop/, `${rel}: no autoplay attribute; looping is decided by demo.js`);
    // Localized icon buttons (sound, play/pause, replay) and the caption layer.
    const figure = html.match(/<figure class="(player demo(?: demo-presenter)?)" data-labels="([^"]+)">/);
    assert.equal(figure[1], m.presenter ? 'player demo demo-presenter' : 'player demo', `${rel}: presenter class only where the manifest says`);
    const labels = JSON.parse(figure[2].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'));
    for (const k of ['play', 'pause', 'soundOn', 'soundOff', 'replay', 'group']) assert.ok(labels[k], `${rel}: label ${k}`);
    for (const a of ['sound', 'play', 'replay']) assert.match(html, new RegExp(`<button type="button" class="demo-btn" data-action="${a}"[^>]*aria-label="[^"]+"`), `${rel}: ${a} button`);
    assert.match(html, /<div class="demo-controls" role="group" aria-label="[^"]+" hidden>/, `${rel}: control group (shown by demo.js)`);
    assert.match(html, /<p class="demo-captions" aria-hidden="true" hidden><\/p>/, `${rel}: caption layer`);
    // The video and poster are the manifest's files, byte for byte, under content-hashed names.
    const src = html.match(/<source src="(\/media\/[\w.-]+\.[0-9a-f]{10}\.mp4)" type="video\/mp4">/)[1];
    const poster = v.match(/poster="([^"]+)"/)[1];
    assert.equal(sha(readFileSync(file(src))), sha(source(m.video)), `${rel}: video bytes`);
    assert.equal(sha(readFileSync(file(poster))), sha(source(m.poster)), `${rel}: poster bytes`);
    assert.match(html, new RegExp(`property="og:video" content="${ORIGIN}${src.replace(/\./g, '\\.')}"`), `${rel}: og:video is the page film`);
    // One WebVTT track in the page's language; the HTML layer draws it, so captions never double.
    const tracks = [...html.matchAll(/<track kind="captions" srclang="([^"]+)" label="[^"]+" src="([^"]+)" default>/g)];
    assert.equal(tracks.length, 1, `${rel}: one caption track`);
    assert.equal(tracks[0][1], tag, `${rel}: track language`);
    const vtt = readFileSync(file(tracks[0][2]), 'utf8');
    assert.match(vtt, /^WEBVTT\n/);
    if (!m.captions) {
      // Sample captions: the three steps, then the slogan, inside the film's duration.
      const h1 = html.match(/<h1 id="film-title">([^<]+)<\/h1>/)[1];
      assert.equal(vtt.trim().split('\n').at(-1), h1.replace(/&#39;/g, "'"), `${rel}: last cue is the slogan`);
      const windows = [...vtt.matchAll(stamp)];
      assert.equal(windows.length, 4, `${rel}: four sample cues`);
      const secs = (x) => x.split(':').reduce((acc, n) => acc * 60 + Number(n), 0);
      assert.ok(secs(windows.at(-1)[2]) <= m.duration, `${rel}: cues end inside the film`);
    }
    assert.doesNotMatch(html, /\/media\/dl\/|\sdownload[=\s>]/, `${rel}: no download links`);
    for (const [, p, h] of html.matchAll(/"(\/media\/[^"]+?\.([0-9a-f]{10})\.(?:mp4|jpg|vtt))"/g)) {
      assert.equal(sha(readFileSync(file(p))).slice(0, 10), h, p);
    }
  }
});

test('the sample media is the checked-in placeholder, unchanged', { skip: Boolean(process.env.DROPACK_MEDIA_MANIFEST) }, () => {
  for (const [name, want] of Object.entries(MEDIA.sha256)) {
    assert.equal(createHash('sha256').update(readFileSync(join(MANIFEST, '..', name))).digest('hex'), want, name);
  }
  assert.deepEqual(Object.keys(MEDIA.sha256).sort(), ['sample-film.mp4', 'sample-poster.jpg']);
});

test('every footer links the app source ("GitHub") and the website source, after the page links', async () => {
  const { LANDING } = await import('../src/landing.mjs');
  const label = { 'privacy/index.html': '网站源代码', 'en/privacy/index.html': 'Website source', 'support/index.html': '网站源代码 / Website source', '404.html': '网站源代码' };
  for (const [rel, tag] of Object.entries(pages)) {
    const html = read(rel);
    const footer = html.match(/<footer class="site-footer">[\s\S]*<\/footer>/)[0];
    const site = label[rel] ?? LANDING[tag].siteSource;
    assert.ok(site && [...site].length <= 32, `${rel}: short website-source label`);
    assert.ok(footer.includes(`<a href="${APP_SOURCE}">GitHub</a><a href="${SITE_SOURCE}">${site}</a>`), `${rel}: source links in the footer`);
    // Only in the footer, once each, and never opened as a download or in a frame.
    assert.equal(html.split(APP_SOURCE + '"').length - 1, 1, `${rel}: one app-source link`);
    assert.equal(html.split(SITE_SOURCE + '"').length - 1, 1, `${rel}: one website-source link`);
  }
  const labels = new Set(Object.values(landing).map((tag) => LANDING[tag].siteSource));
  assert.equal(labels.size, 16, 'every language has its own website-source label');
});

test('landing pages stay short: slogan, film, three steps, iOS requirement, FAQ collapsed', () => {
  for (const [rel, tag] of Object.entries(landing)) {
    const html = read(rel);
    assert.equal((html.match(/<li><span class="step-icon">/g) || []).length, 3, `${rel}: three steps`);
    assert.equal((html.match(/<details>/g) || []).length, 3, `${rel}: three FAQ items`);
    assert.doesNotMatch(html, /<details open/, `${rel}: FAQ starts collapsed`);
    assert.equal((html.match(/<section\b/g) || []).length, 3, `${rel}: film, use case and FAQ only`);
    assert.doesNotMatch(html, /<figcaption/, `${rel}: no caption line under the film`);
    assert.match(text(html), /iOS 17/, rel);
    const h1 = html.match(/<h1 id="film-title">([^<]+)<\/h1>/)[1];
    assert.ok([...h1].length <= 36, `${rel}: slogan is short (${h1})`);
    assert.match(html, new RegExp(`<title>Dropack — [^<]*AirDrop`), `${rel}: title carries the slogan`);
  }
  const main = read('index.html').match(/<main[\s\S]*<\/main>/)[0].replace(/<details>\s*<summary>([\s\S]*?)<\/summary>[\s\S]*?<\/details>/g, '$1');
  const visible = text(main).replace(/\s/g, '').length;
  assert.ok(visible <= 200, `zh main visible characters: ${visible}`);
  assert.ok(text(read('en/index.html')).includes('Pause and continue apply to saving into Photos'));
  for (const rel of ['privacy/index.html', 'en/privacy/index.html']) {
    const p = text(read(rel));
    assert.match(p, /Cloudflare/);
    assert.match(p, /HTTP/);
    assert.match(p, /iCloud/);
  }
});

test('one TestFlight invitation button on every landing page, under the steps, above the iOS requirement', () => {
  for (const [rel, tag] of Object.entries(landing)) {
    const html = read(rel);
    const m = html.match(/<\/ol>\s*<p class="get"><a class="get-btn" href="([^"]+)">([^<]+)<\/a><\/p>\s*<p class="status-line">[^<]*iOS 17[^<]*<\/p>/);
    assert.ok(m, `${rel}: button between the steps and the iOS requirement`);
    assert.equal(m[1], TESTFLIGHT_JOIN, `${rel}: exact public invitation`);
    assert.match(m[2], /TestFlight/, `${rel}: label names TestFlight`);
    assert.ok([...m[2]].length <= 28, `${rel}: short label (${m[2]})`);
    assert.doesNotMatch(m[2], /App Store|Store/i, `${rel}: not called an App Store download`);
    assert.equal((html.match(/class="get-btn"/g) || []).length, 1, `${rel}: one button`);
  }
  assert.match(read('index.html'), />通过 TestFlight 下载</);
  assert.match(read('en/index.html'), />Get it on TestFlight</);
  assert.doesNotMatch(read('styles.css'), /\.get-btn[^{]*\{[^}]*(position:\s*fixed|position:\s*sticky)/, 'the button sits in the page flow');
});

test('one short external-storage use case, neutral package wording and the .dropack note in every language', async () => {
  const { LANDING } = await import('../src/landing.mjs');
  const titles = new Set();
  for (const [rel, tag] of Object.entries(landing)) {
    const html = read(rel);
    const t = LANDING[tag];
    // Exactly one use-case section, between the film and the FAQ, with a heading and one paragraph.
    const sec = html.match(/<section class="usecase" aria-labelledby="usecase-title">\s*<div class="wrap usecase-wrap">\s*<h2 id="usecase-title">([^<]+)<\/h2>\s*<p>([^<]+)<\/p>\s*<\/div>\s*<\/section>/);
    assert.ok(sec, `${rel}: use-case section`);
    assert.equal((html.match(/class="usecase"/g) || []).length, 1, `${rel}: one use case`);
    assert.ok(html.indexOf('class="film"') < html.indexOf('class="usecase"') && html.indexOf('class="usecase"') < html.indexOf('class="faq"'), `${rel}: between film and FAQ`);
    const esc = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    assert.equal(sec[1], esc(t.useCase.title), `${rel}: heading`);
    assert.equal(sec[2], esc(t.useCase.body), `${rel}: sentence`);
    assert.ok([...t.useCase.title].length <= 40 && [...t.useCase.body].length <= 170, `${rel}: short use case`);
    titles.add(t.useCase.title);
    // The destination is the photo library; nothing about extracting to a drive, formats, sizes or resume.
    assert.doesNotMatch(t.useCase.body + t.useCase.title, /RAW|ProRes|H\.?26[45]|HEVC|\b\d+\s?(GB|TB)\b|resume|热插拔|hot-?plug|Android|Windows|macOS|Linux/i, `${rel}: no format/size/platform claims`);
    // Step 1 and the description no longer name ZIP; the FAQ says .dropack is the default and ZIP remains.
    assert.doesNotMatch(t.steps[0], /ZIP/i, `${rel}: neutral first step`);
    assert.doesNotMatch(t.description, /ZIP/i, `${rel}: neutral description`);
    assert.match(t.faq[2][1], /\.dropack/, `${rel}: .dropack default noted`);
    assert.match(t.faq[2][1], /ZIP/i, `${rel}: ordinary ZIP still available`);
  }
  assert.equal(titles.size, 16, 'every language has its own use-case heading');
});

test('the bilingual support page: verified help, the CHEKUSU contact form and address, no email or form', async () => {
  const { SUPPORT: s } = await import('../src/support.mjs');
  const html = read('support/index.html');
  const copy = text(html);
  assert.match(html, /<title>支持与帮助 \/ Support — Dropack<\/title>/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${ORIGIN}/support/">`));
  assert.match(html, /<link rel="stylesheet" href="\/support\.css\?v=[0-9a-f]{10}">/);
  assert.match(read('sitemap.xml'), new RegExp(`<loc>${ORIGIN}/support/</loc>`));
  // Every fact appears exactly as written, Chinese and English.
  const facts = [s.intro.zh, s.intro.en, s.contact.context.zh, s.contact.context.en, s.contact.company,
    s.contact.address.ja, s.contact.address.en, s.privacy.zh.text, s.privacy.en.text, ...s.faq.flatMap((f) => [f.a.zh, f.a.en])];
  for (const f of facts) assert.ok(copy.includes(f.replace(/\s+/g, ' ')), `support copy: ${f.slice(0, 30)}`);
  assert.equal(s.faq.length, 7);
  // Headings: one h1, two h2, one h3 per question; English parts are marked lang="en".
  assert.equal((html.match(/<h2 /g) || []).length, 2);
  assert.equal((html.match(/<h3 /g) || []).length, 7);
  assert.equal((html.match(/<span class="sp-en" lang="en">/g) || []).length, 10);
  assert.match(html, /<span lang="ja">〒106-0044 東京都港区東麻布2-35-1 KCビル 6F 19号室<\/span>/);
  // The contact link: the verified company form, described, and the only external URL.
  assert.match(html, /<a class="sp-cta" href="https:\/\/chekusu\.com\/#contact" aria-describedby="contact-note">联系支持 \/ Contact support<\/a>/);
  assert.match(html, /id="contact-note"/);
  const external = [...html.matchAll(/(?:href|src)="(https?:[^"]+)"/g)].map((m) => m[1]).filter((u) => !u.startsWith(`${SITE}/`));
  assert.deepEqual(external, [CONTACT, APP_SOURCE, SITE_SOURCE]);
  // Links home and to both privacy pages.
  for (const href of ['/', '/en/', '/privacy/', '/en/privacy/']) assert.match(html, new RegExp(`<a (class="[^"]+" )?href="${href}"`), href);
  // No email, form, reply-time promise, download link or absolute no-network claim.
  assert.doesNotMatch(html, /mailto:|@[a-z0-9-]+\.[a-z]{2,}|<form|<input|<textarea/i);
  assert.doesNotMatch(copy, /小时内|工作日内|within \d+|business days?|24 ?h|回复时间|reply within|download|下载/i);
  assert.doesNotMatch(copy, /不联网|无需网络|离线|no internet|offline|never leaves/i);
  // Its stylesheet is self-contained and light: no imports, URLs, filters or dark scheme.
  const css = read('support.css');
  assert.doesNotMatch(css, /@import|url\(|(?<![-\w])filter:|prefers-color-scheme/);
});

test('no release-state prose in landing pages or captions, and no demo disclaimers', () => {
  // The localized "condensed illustration" tags the film release used; none may appear.
  const labels = ['Condensed illustration', '示意演示，时长经过压缩', '示意演示，時間經過壓縮', '時間を短縮したイメージ映像', '시간을 압축한 예시 영상', 'Ilustración condensada', 'Illustration condensée', 'Verkürzte Illustration', 'Illustrazione condensata', 'Ilustração condensada', 'Verkorte illustratie', 'Skrócona ilustracja', 'Kısaltılmış temsilî gösterim', 'عرض توضيحي مختصر', 'संक्षिप्त उदाहरण प्रस्तुति', 'Ilustrasi yang dipersingkat'];
  const status = /TestFlight|App Store|内部测试|內部測試|内部テスト|내부 테스트|internal test|pruebas internas|test interne|internen Test|test interno|teste interno|interne test|testach wewnętrznych|iç test|الاختبار الداخلي|आंतरिक परीक्षण|uji internal|示意演示|condensed illustration/i;
  for (const rel of Object.keys(pages)) {
    const copy = allCopy(read(rel));
    // Support and privacy explain manual App Store/TestFlight update checks.
    // Landing pages still contain no release status or store promotion.
    // The one exception is the TestFlight button's own label.
    if (Object.hasOwn(landing, rel)) {
      const label = read(rel).match(/<a class="get-btn"[^>]*>([^<]+)<\/a>/)[1];
      assert.doesNotMatch(copy.replace(label, ''), status, rel);
    }
    for (const l of labels) assert.ok(!copy.includes(l), `${rel}: "${l}"`);
  }
  for (const f of readdirSync(join(dist, 'media/captions'))) {
    const vtt = readFileSync(join(dist, 'media/captions', f), 'utf8');
    const current = Object.entries(landing).some(([rel]) => read(rel).includes(`/media/captions/${f}`));
    if (current) assert.doesNotMatch(vtt, status, `${f}: page captions state no release status`);
  }
});

test('copy makes none of the claims the product cannot back', () => {
  const banned = [
    /立即下载|免费下载|前往 App Store|App Store 下载/,
    /download now|download on the app store|get it on (?!TestFlight)|available on the app store/i,
    /sign ?up (now|today|for|to)|subscribe|waitlist|join the beta|候补|预约|订阅/i,
    /testimonial|用户评价|好评|\d[\d,.]*\s*(万|k\+?)\s*(用户|users)/i,
    /\d+(\.\d+)?\s?(GB|TB|MB\/s|GB\/s)|\b\d{2,3},000\b|十万|10 ?万/i,
    /更快的 ?AirDrop|AirDrop 更快了|faster airdrop|speeds up airdrop|断点续传/i,
    /后台自动完成|在后台完成|completes? in the background|runs? in the background/i,
    /Live Photo|实况照片/i,
    /构建|\bbuilds?\b|\bcompiles?\b|tests? pass/i,
    /零流量|不产生任何网络|no network traffic|zero network|never leaves your (phone|device)/i,
    /coming soon|即将上线|上线日期[:：]|launch(es|ing)? (on|in) \d/i,
  ];
  for (const rel of Object.keys(pages)) {
    const copy = allCopy(read(rel));
    for (const re of banned) assert.doesNotMatch(copy, re, `${rel}: ${re}`);
  }
});

// ——— Brand: the approved "Folded D" app icon everywhere ———

const png = (rel) => {
  const b = readFileSync(join(dist, rel));
  assert.equal(b.toString('latin1', 1, 4), 'PNG', `${rel} is a PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

test('brand icons have the right pixel sizes', () => {
  for (const px of [32, 64, 96, 192, 512]) assert.deepEqual(png(`brand/dropack-icon-${px}.png`), [px, px]);
  assert.deepEqual(png('apple-touch-icon.png'), [180, 180]);
  for (const loc of ['zh', 'en']) assert.deepEqual(png(`og-${loc}.png`), [1200, 630]);
  const ico = readFileSync(join(dist, 'favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1, 'ICO type');
  const sizes = [];
  for (let i = 0; i < ico.readUInt16LE(4); i++) {
    const o = 6 + 16 * i;
    const len = ico.readUInt32LE(o + 8);
    const at = ico.readUInt32LE(o + 12);
    const entry = ico.subarray(at, at + len);
    assert.equal(entry.toString('latin1', 1, 4), 'PNG');
    sizes.push([ico.readUInt8(o), entry.readUInt32BE(16)]);
  }
  assert.deepEqual(sizes, [[16, 16], [32, 32], [48, 48]]);
});

test('every page shows the full logo image in the header and footer, and no old mark remains', () => {
  assert.ok(!existsSync(join(dist, 'favicon.svg')), 'old favicon.svg is gone');
  for (const rel of Object.keys(pages)) {
    const html = read(rel);
    assert.doesNotMatch(html, /favicon\.svg|class="mark|ph-mark|<span>Dropack<\/span>/, rel);
    const logo = (cls) =>
      `<img class="${cls}" src="/brand/dropack-wordmark-v3-168\\.png\\?v=[0-9a-f]{10}" srcset="/brand/dropack-wordmark-v3-336\\.png\\?v=[0-9a-f]{10} 2x, /brand/dropack-wordmark-v3-504\\.png\\?v=[0-9a-f]{10} 3x" width="168" height="56" alt="Dropack">`;
    assert.match(html, new RegExp(`<a class="brand" href="/([a-z-]+/)?">${logo('logo')}</a>`), `${rel}: header logo is the link's only content`);
    assert.match(html, new RegExp(`<p class="footer-brand">${logo('logo logo-footer')}</p>`), `${rel}: footer logo`);
    assert.equal((html.match(/alt="Dropack"/g) || []).length, 2, `${rel}: one named logo each in header and footer`);
    assert.doesNotMatch(html, /<picture|<source srcset|dropack-logo-/, `${rel}: no separate dark or old logo`);
    assert.match(html, /<link rel="icon" href="\/favicon\.ico\?v=[0-9a-f]{10}"/, rel);
    assert.match(html, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png\?v=[0-9a-f]{10}">/, rel);
    for (const [, url] of html.matchAll(/(?:src|href|srcset)="(\/[^"?]+)\?v=/g)) assert.ok(existsSync(join(dist, url)), `${rel}: ${url}`);
  }
});

test('logo exports keep the master’s true alpha: transparent edges, antialiased lettering', async () => {
  const { inflateSync } = await import('node:zlib');
  for (const [w, h] of [[168, 56], [336, 112], [504, 168]]) {
    const rel = `brand/dropack-wordmark-v3-${w}.png`;
    assert.deepEqual(png(rel), [w, h], rel);
    const b = readFileSync(join(dist, rel));
    assert.equal(b[25], 6, `${rel}: colour type RGBA`);
    const idat = [];
    for (let o = 8; o < b.length; ) {
      const len = b.readUInt32BE(o);
      if (b.toString('latin1', o + 4, o + 8) === 'IDAT') idat.push(b.subarray(o + 8, o + 8 + len));
      o += 12 + len;
    }
    const raw = inflateSync(Buffer.concat(idat));
    // Undo the PNG row filters, then read every alpha value.
    const stride = w * 4;
    const alpha = [];
    let prev = Buffer.alloc(stride);
    for (let y = 0; y < h; y++) {
      const f = raw[y * (stride + 1)];
      const row = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
      for (let i = 0; i < stride; i++) {
        const a = i >= 4 ? row[i - 4] : 0;
        const up = prev[i];
        const c = i >= 4 ? prev[i - 4] : 0;
        const p = a + up - c;
        const pr = Math.abs(p - a) <= Math.abs(p - up) && Math.abs(p - a) <= Math.abs(p - c) ? a : Math.abs(p - up) <= Math.abs(p - c) ? up : c;
        row[i] = (row[i] + [0, a, up, (a + up) >> 1, pr][f]) & 255;
      }
      alpha.push([...row].filter((_, i) => i % 4 === 3));
      prev = row;
    }
    const edges = [...alpha[0], ...alpha[h - 1], ...alpha.map((r) => r[0]), ...alpha.map((r) => r[w - 1])];
    assert.equal(Math.max(...edges), 0, `${rel}: every edge pixel is fully transparent`);
    const all = alpha.flat();
    const clear = all.filter((a) => a === 0).length / all.length;
    assert.ok(clear > 0.6 && clear < 0.9, `${rel}: background transparent (${(clear * 100).toFixed(1)}% alpha 0)`);
    assert.ok(Math.max(...all) >= 250, `${rel}: lettering is solid`);
    assert.ok(all.some((a) => a > 0 && a < 200), `${rel}: lettering edges are antialiased`);
  }
});

test('the page stays light in every colour scheme; the deep-green wordmark is never filtered', () => {
  const css = read('styles.css');
  assert.doesNotMatch(css, /prefers-color-scheme/, 'no dark-scheme overrides');
  assert.match(css, /color-scheme: light;/);
  assert.doesNotMatch(css, /(?<![-\w])filter:/, 'no filter on the logo (or anything else)');
  assert.doesNotMatch(css, /\.logo[^{]*\{[^}]*background/, 'no plate behind the logo');
  assert.ok(!existsSync(join(dist, 'brand/dropack-logo-dark-168.png')), 'no opaque dark logo is published');
  for (const rel of Object.keys(pages)) {
    const html = read(rel);
    assert.match(html, /<meta name="color-scheme" content="light">/, rel);
    assert.doesNotMatch(html, /prefers-color-scheme: dark/, rel);
  }
});

test('watercolor layers: true-alpha WebP, decorative and behind the content', () => {
  for (const name of ['watercolor-desktop', 'watercolor-mobile']) {
    const b = readFileSync(join(dist, `art/${name}.webp`));
    assert.equal(b.toString('latin1', 0, 4), 'RIFF');
    assert.equal(b.toString('latin1', 8, 12), 'WEBP');
    assert.equal(b.toString('latin1', 12, 16), 'VP8X', `${name}: extended WebP`);
    assert.ok(b[20] & 0x10, `${name}: has an alpha channel`);
    assert.ok(b.length < 300000, `${name}: ${b.length} bytes`);
  }
  // Painted only on a pseudo-element under the content: never interactive, never in the accessibility tree.
  const css = read('styles.css');
  const layer = css.match(/\.film::before \{[^}]*\}/)[0];
  assert.match(layer, /pointer-events: none/);
  assert.match(layer, /z-index: -1/);
  for (const rel of Object.keys(landing)) assert.doesNotMatch(read(rel), /watercolor/, `${rel}: no decorative markup in the page`);
});

test('the standalone app icon files are unchanged', async () => {
  const { createHash } = await import('node:crypto');
  const pinned = {
    'brand/dropack-icon-32.png': 'afa06532ccf938e205eaa88463940baef2a95aab64a59d36c7ca33d6ecc8be39',
    'brand/dropack-icon-64.png': '21bfd2771f957f15881e471d64a63293f18f4d86f6170cde424fc1dca18664da',
    'brand/dropack-icon-96.png': '6574f78034b1028d4d3dcf5fe4779641ee80535b291ec5d0fbe1a14abe90114e',
    'brand/dropack-icon-192.png': 'd563700533d151485e0ca71f7663d43e5c2445b2a7039a642611afa14dd56dd6',
    'brand/dropack-icon-512.png': '9163b8962d9a3aad4850b533b29f053f01c05f0e4ce24618cc3ce8edc6a6d48c',
    'apple-touch-icon.png': '29bc526b42065189acac3dacc967a1236da390a45f8e0bce8dd057154b70a310',
    'favicon.ico': '2363a4859757591fac4102578c7112299bb2742d71a953875cd812b80febb413',
  };
  for (const [rel, sha] of Object.entries(pinned)) {
    assert.equal(createHash('sha256').update(readFileSync(join(dist, rel))).digest('hex'), sha, rel);
  }
});

test('cache-busting hashes match the files they point at', async () => {
  const { createHash } = await import('node:crypto');
  const html = read('index.html');
  for (const [, path, v] of html.matchAll(/="(\/[^"?]+)\?v=([0-9a-f]{10})"/g)) {
    const hash = createHash('sha256').update(readFileSync(join(dist, path))).digest('hex');
    assert.equal(hash.slice(0, 10), v, path);
  }
});
