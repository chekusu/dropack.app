// Builds the static site into dist/ using Node.js built-ins only.
// Pages: 16 film-language landing pages (/ is Simplified Chinese, /en/, /ja/ …),
// /privacy/ and /en/privacy/, the bilingual /support/, /404.html. Film media (from the media manifest)
// is copied in under /media/.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, UPDATED, locales } from '../src/content.mjs';
import { LANDING, ORDER, SOURCE, TESTFLIGHT } from '../src/landing.mjs';
import { SUPPORT } from '../src/support.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Public asset URL with a content hash, so a changed file is never served from a stale cache.
const asset = (path) =>
  `${path}?v=${createHash('sha256').update(readFileSync(join(root, 'public', path))).digest('hex').slice(0, 10)}`;

// /support/ is one bilingual page, so every language points at the same URL.
const pagePath = (loc, page) => (page === 'support' ? SUPPORT.path : locales[loc].base + (page === 'privacy' ? 'privacy/' : ''));

// ——— Illustrations (inline SVG, styled by styles.css) ———

// The logo: one approved transparent image (a folded D followed by "ropack", read once
// as "Dropack"), used in both themes; dark mode applies the approved CSS filter.
// alt is the link's only name, so "Dropack" is read once.
const brandLogo = (cls) =>
  `<img class="${cls}" src="${asset('/brand/dropack-wordmark-v3-168.png')}" srcset="${asset('/brand/dropack-wordmark-v3-336.png')} 2x, ${asset('/brand/dropack-wordmark-v3-504.png')} 3x" width="168" height="56" alt="Dropack">`;

const frame = (x, y, w, h, kind, i) => {
  const inner =
    kind === 'video'
      ? `<path class="f-play" d="M${x + w / 2 - 7} ${y + h / 2 - 9}v18l15-9z"/>`
      : `<path class="f-hill" d="M${x + 8} ${y + h - 8}l${w * 0.3} ${-h * 0.42} ${w * 0.18} ${h * 0.2} ${w * 0.14} ${-h * 0.12} ${w * 0.38 - 16} ${h * 0.34}z"/>
      <circle class="f-sun" cx="${x + w * 0.74}" cy="${y + h * 0.3}" r="${Math.min(w, h) * 0.09}"/>`;
  return `<g class="frame frame-${i}">
      <rect class="f-paper" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>
      ${inner}
    </g>`;
};

const heroArt = (t) => `<figure class="hero-art">
  <svg viewBox="0 0 440 380" role="img" aria-labelledby="hero-art-title">
    <title id="hero-art-title">${esc(t.hero.figure)}</title>
    <path class="box-back" d="M92 196h256l-22-36H114z"/>
    ${frame(118, 74, 104, 140, 'photo', 1)}
    ${frame(206, 46, 128, 86, 'video', 2)}
    ${frame(232, 120, 86, 112, 'photo', 3)}
    ${frame(150, 128, 120, 80, 'photo', 4)}
    <path class="flap flap-l" d="M92 196 50 152l64 8z"/>
    <path class="flap flap-r" d="M348 196l42-44-64 8z"/>
    <path class="box-front" d="M92 196h256v150H92z"/>
    <path class="box-tape" d="M92 196h256v24H92z"/>
    <path class="box-seam" d="M100 208h240"/>
    <g class="box-label">
      <rect x="250" y="262" width="76" height="54" rx="3"/>
      <path d="M260 280h56M260 292h40M260 304h48"/>
    </g>
  </svg>
</figure>`;

// ——— Page shell ———

// The footer's links to the open-source repositories: "GitHub" (the iOS app) and the website's own.
const sourceLinks = (siteLabel) =>
  `<a href="${SOURCE.app}">GitHub</a><a href="${SOURCE.site}">${esc(siteLabel)}</a>`;

function head(loc, page, { title, description, noindex = false, styles = [] }) {
  const t = locales[loc];
  const path = page === '404' ? '/404.html' : pagePath(loc, page);
  const alt = page === '404' ? '' : Object.keys(locales)
    .map((l) => `<link rel="alternate" hreflang="${locales[l].lang}" href="${SITE}${pagePath(l, page)}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${SITE}${pagePath('zh', page)}">`)
    .join('\n  ');
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}${path}">\n  ${alt}`}
  <meta name="theme-color" content="#f2ece1">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Dropack">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${SITE}${path}">
  <meta property="og:locale" content="${t.ogLocale}">
  <meta property="og:image" content="${SITE}${asset(`/og-${loc}.png`)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(t.hero.title.join(t.lang === 'en' ? ' ' : ''))}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${asset('/favicon.ico')}" sizes="16x16 32x32 48x48">
  <link rel="icon" href="${asset('/brand/dropack-icon-192.png')}" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="${asset('/apple-touch-icon.png')}">
  <link rel="stylesheet" href="${asset('/styles.css')}">${styles.map((s) => `\n  <link rel="stylesheet" href="${asset(s)}">`).join('')}
</head>`;
}

function header(loc, page) {
  const t = locales[loc];
  const o = locales[t.other];
  const home = t.base;
  return `<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="${home}">${brandLogo('logo')}</a>
    <nav aria-label="${esc(t.navAria)}">
      <ul class="nav-list">
        <li><a href="${pagePath(loc, 'privacy')}"${page === 'privacy' ? ' aria-current="page"' : ''}>${esc(t.nav.privacy)}</a></li>
        <li><a class="lang" href="${pagePath(t.other, page === '404' ? 'home' : page)}" hreflang="${o.lang}" lang="${o.lang}" aria-label="${esc(t.switchAria)}">${esc(t.switchLabel)}</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

function footer(loc) {
  const t = locales[loc];
  return `<footer class="site-footer">
  <div class="wrap footer-row">
    <p class="footer-brand">${brandLogo('logo logo-footer')}</p>
    <p class="footer-links"><a href="${pagePath(loc, 'privacy')}">${esc(t.footer.privacy)}</a><a href="${pagePath(t.other, 'home')}" hreflang="${locales[t.other].lang}" lang="${locales[t.other].lang}">${esc(t.switchLabel)}</a>${sourceLinks(t.footer.siteSource)}<a href="#top">${esc(t.footer.top)}</a></p>
    <p class="fine">${esc(t.footer.trademark)}</p>
    <p class="fine">© 2026 Dropack</p>
  </div>
</footer>`;
}

// ——— Film media (video, poster, captions) ———
// The film comes from a media manifest (JSON). This repository ships neutral sample media in
// media/sample/ (an original placeholder animation drawn by scripts/sample-media.mjs). To build
// with your own media, point DROPACK_MEDIA_MANIFEST at a manifest kept outside Git (or in the
// ignored media/local/). Paths in a manifest are relative to the manifest's folder:
//   {
//     "default": { "video": "film.mp4", "poster": "poster.jpg", "width": 1920, "height": 1080, "duration": 36 },
//     "locales": { "ja": { "video": "film-ja.mp4", "captions": "film-ja.vtt" }, "en": { "presenter": true } },
//     "sha256": { "film.mp4": "<hex>" }
//   }
// A language takes its "locales" entry over "default". "presenter": true marks a film with a
// presenter inset at the lower right (styles.css keeps the captions clear of it). Files listed
// under "sha256" are checked, and the build stops if one differs. Without a "captions" file the
// build writes a sample WebVTT track from the page's own copy: the three steps, then the slogan.
// Every media file is published under a content-hashed name, so it can be cached for a year.
const MANIFEST = resolve(process.env.DROPACK_MEDIA_MANIFEST || join(root, 'media', 'sample', 'media.json'));
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const hash10 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);
const mediaFiles = {}; // published path → Buffer
const publish = (dir, base, ext, buf) => {
  const p = `/media/${dir ? `${dir}/` : ''}${base}.${hash10(buf)}.${ext}`;
  mediaFiles[p] = buf;
  return p;
};
const readMedia = (name) => {
  let buf;
  try { buf = readFileSync(resolve(dirname(MANIFEST), name)); } catch { throw new Error(`missing media ${name} next to ${MANIFEST} (set DROPACK_MEDIA_MANIFEST)`); }
  const want = manifest.sha256?.[name];
  if (want && createHash('sha256').update(buf).digest('hex') !== want) throw new Error(`${name}: SHA-256 differs from ${MANIFEST}`);
  return buf;
};
const publishMedia = (dir, name) => publish(dir, basename(name, extname(name)), extname(name).slice(1).toLowerCase(), readMedia(name));
const vttStamp = (s) => {
  const ms = Math.round(s * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};
const vttText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Sample captions: four equal windows over the film, each with a short pause at both ends.
const sampleVtt = (t, duration) => {
  const lines = [...t.steps, t.h1];
  const slot = duration / lines.length;
  return `WEBVTT\n\n${lines.map((line, i) => `${vttStamp(i * slot + 0.3)} --> ${vttStamp((i + 1) * slot - 0.3)}\n${vttText(line)}`).join('\n\n')}\n`;
};
const MEDIA = {};
for (const tag of ORDER) {
  const m = { ...manifest.default, ...manifest.locales?.[tag] };
  for (const k of ['video', 'poster', 'width', 'height']) if (!m[k]) throw new Error(`${MANIFEST}: no "${k}" for ${tag}`);
  if (!m.captions && !(m.duration > 0)) throw new Error(`${MANIFEST}: ${tag} needs "captions" or a "duration" for sample captions`);
  MEDIA[tag] = {
    video: publishMedia('', m.video),
    poster: publishMedia('', m.poster),
    vtt: m.captions ? publishMedia('captions', m.captions) : publish('captions', `sample.${tag}`, 'vtt', Buffer.from(sampleVtt(LANDING[tag], m.duration))),
    width: m.width,
    height: m.height,
    presenter: Boolean(m.presenter),
  };
}

// ——— Landing pages (16 languages) ———

const ICON = {
  // demo controls (two icons per toggle; CSS shows the one matching data-state)
  soundOn: '<svg class="i-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5m0-5-5 5"/></svg>',
  soundOff: '<svg class="i-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  play: '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/></svg>',
  pause: '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5.5" width="3.2" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.8" y="5.5" width="3.2" height="13" rx="1" fill="currentColor" stroke="none"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5"/><path d="M4.5 4.5v4h4"/></svg>',
  zip: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="3" width="13" height="18" rx="2.6"/><path d="M12 3v1.6M12 6.2h-1.4M12 7.8h1.4M12 9.4h-1.4M12 11h1.4"/><rect x="10.4" y="12.6" width="3.2" height="4" rx="1"/></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11M8.2 7.2 12 3.5l3.8 3.7M8 10.5H6.5v9.5h11v-9.5H16"/></svg>',
  photos: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7" width="14" height="12" rx="2.2"/><path d="M7 4.5h11.5a2 2 0 0 1 2 2V15"/><path d="m5.5 17 3.6-3.8 2.6 2.6 1.8-1.8 2.5 3"/><circle cx="13.5" cy="10.6" r="1.1"/></svg>',
};

function landingHead(tag) {
  const t = LANDING[tag];
  const alt = ORDER.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${LANDING[l].path}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${SITE}/">`).join('\n  ');
  return `<!doctype html>
<html lang="${tag}"${t.dir ? ` dir="${t.dir}"` : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(t.title)}</title>
  <meta name="description" content="${esc(t.description)}">
  <link rel="canonical" href="${SITE}${t.path}">
  ${alt}
  <meta name="theme-color" content="#f2ece1">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="video.other">
  <meta property="og:site_name" content="Dropack">
  <meta property="og:title" content="${esc(t.title)}">
  <meta property="og:description" content="${esc(t.description)}">
  <meta property="og:url" content="${SITE}${t.path}">
  <meta property="og:locale" content="${t.ogLocale}">
  <meta property="og:image" content="${SITE}${asset(`/og-${t.og}.png`)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:video" content="${SITE}${MEDIA[tag].video}">
  <meta property="og:video:type" content="video/mp4">
  <meta property="og:video:width" content="${MEDIA[tag].width}">
  <meta property="og:video:height" content="${MEDIA[tag].height}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${asset('/favicon.ico')}" sizes="16x16 32x32 48x48">
  <link rel="icon" href="${asset('/brand/dropack-icon-192.png')}" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="${asset('/apple-touch-icon.png')}">
  <link rel="stylesheet" href="${asset('/styles.css')}">
  <script src="${asset('/lang.js')}" defer></script>
</head>`;
}

function landingPage(tag) {
  const t = LANDING[tag];
  const options = ORDER.map((l) => `<option value="${LANDING[l].path}" lang="${l}"${l === tag ? ' selected' : ''}>${esc(LANDING[l].name)}</option>`).join('');
  const fallback = ORDER.map((l) => `<a href="${LANDING[l].path}" lang="${l}" hreflang="${l}">${esc(LANDING[l].name)}</a>`).join(' ');
  const steps = t.steps.map((s, i) => `<li><span class="step-icon">${[ICON.zip, ICON.send, ICON.photos][i]}</span><span>${esc(s)}</span></li>`).join('');
  const faq = t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ');
  const privacyLang = t.privacyLang ?? (t.privacyPath ? tag : 'en');
  const privacyHref = t.privacyPath ?? '/en/privacy/';
  return `${landingHead(tag)}
<body id="top" class="page-landing">
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="${t.path}">${brandLogo('logo')}</a>
    <div class="lang-pick">
      <label for="lang">${esc(t.language)}</label>
      <select id="lang" name="lang">${options}</select>
      <noscript><p class="lang-fallback">${fallback}</p></noscript>
    </div>
  </div>
</header>
<main id="main">
  <section class="film" aria-labelledby="film-title">
    <div class="wrap">
      <h1 id="film-title">${esc(t.h1)}</h1>
      <figure class="player demo${MEDIA[tag].presenter ? ' demo-presenter' : ''}" data-labels="${esc(JSON.stringify(t.controls))}">
        <div class="demo-stage">
          <video controls controlslist="nodownload" muted playsinline preload="metadata" width="${MEDIA[tag].width}" height="${MEDIA[tag].height}" poster="${MEDIA[tag].poster}" aria-label="${esc(t.videoLabel)}">
            <source src="${MEDIA[tag].video}" type="video/mp4">
            <track kind="captions" srclang="${tag}" label="${esc(t.name)}" src="${MEDIA[tag].vtt}" default>
          </video>
          <p class="demo-captions" aria-hidden="true" hidden></p>
        </div>
        <div class="demo-controls" role="group" aria-label="${esc(t.controls.group)}" hidden>
          <button type="button" class="demo-btn" data-action="sound" aria-pressed="false" aria-label="${esc(t.controls.soundOn)}">${ICON.soundOn}${ICON.soundOff}</button>
          <button type="button" class="demo-btn" data-action="play" aria-label="${esc(t.controls.play)}">${ICON.play}${ICON.pause}</button>
          <button type="button" class="demo-btn" data-action="replay" aria-label="${esc(t.controls.replay)}">${ICON.replay}</button>
        </div>
      </figure>
      <script src="${asset('/demo.js')}"></script>
      <ol class="steps-row">${steps}</ol>
      <p class="get"><a class="get-btn" href="${TESTFLIGHT}">${esc(t.get)}</a></p>
      <p class="status-line">${esc(t.status)}</p>
    </div>
  </section>
  <section class="usecase" aria-labelledby="usecase-title">
    <div class="wrap usecase-wrap">
      <h2 id="usecase-title">${esc(t.useCase.title)}</h2>
      <p>${esc(t.useCase.body)}</p>
    </div>
  </section>
  <section class="faq" aria-labelledby="faq-title">
    <div class="wrap faq-wrap">
      <h2 id="faq-title">${esc(t.faqTitle)}</h2>
      <div class="faq-list">
        ${faq}
      </div>
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="wrap footer-row">
    <p class="footer-brand">${brandLogo('logo logo-footer')}</p>
    <p class="footer-links"><a href="${privacyHref}" hreflang="${privacyLang}">${esc(t.privacy)}</a>${sourceLinks(t.siteSource)}</p>
    <p class="fine">${esc(t.trademark)}</p>
    <p class="fine">© 2026 Dropack</p>
  </div>
</footer>
</body>
</html>
`;
}

function privacyPage(loc) {
  const t = locales[loc];
  const p = t.privacyPage;
  const sections = p.sections
    .map(
      (s, i) => `<section aria-labelledby="pv-${i}">
        <h2 id="pv-${i}">${esc(s.title)}</h2>
        <ul>
          ${s.items.map((x) => `<li>${esc(x)}</li>`).join('\n          ')}
        </ul>
      </section>`,
    )
    .join('\n      ');
  return `${head(loc, 'privacy', { title: p.title, description: p.description })}
<body id="top" class="page-doc">
${header(loc, 'privacy')}
<main id="main" class="doc">
  <div class="wrap doc-wrap">
    <p class="kicker"><time datetime="${UPDATED}">${esc(p.updated)}</time></p>
    <h1>${esc(p.heading)}</h1>
    <p class="lede">${esc(p.intro)}</p>
      ${sections}
    <p class="doc-end">${esc(p.changes)}</p>
    <p><a class="band-link" href="${t.base}"><span aria-hidden="true">← </span>${esc(p.back)}</a></p>
  </div>
</main>
${footer(loc)}
</body>
</html>
`;
}

// One bilingual page: Chinese first, each block followed by its English (lang="en"). Its own
// small stylesheet (support.css) keeps styles.css, and so every other page, byte-identical.
function supportPage() {
  const s = SUPPORT;
  const c = s.contact;
  const faq = s.faq
    .map(
      (f, i) => `<section class="sp-q" aria-labelledby="q-${i + 1}">
          <h3 id="q-${i + 1}">${esc(f.q.zh)}<span class="sp-en" lang="en">${esc(f.q.en)}</span></h3>
          <p>${esc(f.a.zh)}</p>
          <p lang="en">${esc(f.a.en)}</p>
        </section>`,
    )
    .join('\n        ');
  return `${head('zh', 'support', { title: s.title, description: s.description, styles: ['/support.css'] })}
<body id="top" class="page-doc page-support">
<a class="skip" href="#main">${esc(s.skip)}</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/">${brandLogo('logo')}</a>
    <nav aria-label="${esc(s.navAria)}">
      <ul class="nav-list">
        <li><a href="/">${esc(s.nav.home)}</a></li>
        <li><a href="/privacy/">${esc(s.nav.privacy)}</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main" class="doc">
  <div class="wrap doc-wrap">
    <h1>${esc(s.heading.zh)}<span class="sp-en" lang="en">${esc(s.heading.en)}</span></h1>
    <p class="lede">${esc(s.intro.zh)}</p>
    <p class="lede" lang="en">${esc(s.intro.en)}</p>
    <section class="sp-contact" aria-labelledby="contact">
      <h2 id="contact">${esc(c.title.zh)}<span class="sp-en" lang="en">${esc(c.title.en)}</span></h2>
      <p><a class="sp-cta" href="${c.url}" aria-describedby="contact-note">${esc(c.cta)}</a></p>
      <p class="sp-note" id="contact-note">${esc(c.note.zh)} <span lang="en">${esc(c.note.en)}</span></p>
      <p>${esc(c.context.zh)}</p>
      <p lang="en">${esc(c.context.en)}</p>
      <p>${esc(c.company)}</p>
    </section>
    <section class="sp-faq" aria-labelledby="faq">
      <h2 id="faq">${esc(s.faqTitle.zh)}<span class="sp-en" lang="en">${esc(s.faqTitle.en)}</span></h2>
        ${faq}
    </section>
    <div class="doc-end sp-privacy">
      <p>${esc(s.privacy.zh.text)}<a href="${s.privacy.zh.href}">${esc(s.privacy.zh.link)}</a></p>
      <p lang="en">${esc(s.privacy.en.text)} <a href="${s.privacy.en.href}" hreflang="en">${esc(s.privacy.en.link)}</a></p>
    </div>
    <p class="sp-back"><a class="band-link" href="/"><span aria-hidden="true">← </span>${esc(s.back.zh)}</a><a class="band-link" href="/en/" hreflang="en" lang="en"><span aria-hidden="true">← </span>${esc(s.back.en)}</a></p>
  </div>
</main>
<footer class="site-footer">
  <div class="wrap footer-row">
    <p class="footer-brand">${brandLogo('logo logo-footer')}</p>
    <p class="footer-links"><a href="/privacy/">${esc(locales.zh.footer.privacy)}</a><a href="/en/privacy/" hreflang="en" lang="en">${esc(locales.en.footer.privacy)}</a>${sourceLinks(s.footer.siteSource)}<a href="#top">${esc(s.footer.top)}</a></p>
    <p class="fine">${esc(s.footer.trademark.zh)}</p>
    <p class="fine" lang="en">${esc(s.footer.trademark.en)}</p>
    <p class="fine">© 2026 Dropack</p>
  </div>
</footer>
</body>
</html>
`;
}

function notFoundPage() {
  const z = locales.zh.notFound;
  const e = locales.en.notFound;
  return `${head('zh', '404', { title: z.title, description: `${z.body} ${e.body}`, noindex: true })}
<body id="top" class="page-doc">
${header('zh', '404')}
<main id="main" class="doc">
  <div class="wrap doc-wrap not-found">
    ${heroArt(locales.zh).replace('class="hero-art"', 'class="hero-art empty-box"')}
    <h1>${esc(z.heading)}</h1>
    <p class="lede">${esc(z.body)} <a href="/">${esc(z.home)}</a></p>
    <p class="lede" lang="en">${esc(e.body)} <a href="/en/">${esc(e.home)}</a></p>
  </div>
</main>
${footer('zh')}
</body>
</html>
`;
}

// ——— Write ———

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, 'public'), out, { recursive: true });

const files = {
  ...Object.fromEntries(ORDER.map((tag) => [`${LANDING[tag].path.slice(1)}index.html`, landingPage(tag)])),
  'privacy/index.html': privacyPage('zh'),
  'en/privacy/index.html': privacyPage('en'),
  'support/index.html': supportPage(),
  '404.html': notFoundPage(),
  'robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ORDER.map((tag) => `  <url>
    <loc>${SITE}${LANDING[tag].path}</loc>
    <lastmod>${UPDATED}</lastmod>
${ORDER.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${LANDING[l].path}"/>`).join('\n')}
  </url>`).join('\n')}
${Object.keys(locales).map((loc) => `  <url>
    <loc>${SITE}${pagePath(loc, 'privacy')}</loc>
    <lastmod>${UPDATED}</lastmod>
  </url>`).join('\n')}
  <url>
    <loc>${SITE}${SUPPORT.path}</loc>
  </url>
</urlset>
`,
};

for (const [p, buf] of Object.entries(mediaFiles)) files[p.slice(1)] = buf;

for (const [rel, body] of Object.entries(files)) {
  const file = join(out, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body);
}

console.log(`built ${Object.keys(files).length} files into dist/ (media: ${MANIFEST.startsWith(root) ? MANIFEST.slice(root.length + 1) : 'DROPACK_MEDIA_MANIFEST'})`);
