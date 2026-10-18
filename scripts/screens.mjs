// Browser QA: loads each page at desktop and mobile sizes, fails on console errors,
// failed requests, horizontal overflow or broken in-page anchors, and saves
// full-page screenshots to screenshots/ (or SCREENS_DIR). Needs Playwright (see scripts/playwright.mjs).
//   npm run screens                                    local dist/ (built first)
//   BASE_URL=https://example.com/ npm run screens      a deployed copy
import { mkdir } from 'node:fs/promises';
import { loadChromium } from './playwright.mjs';
import { serve } from './serve.mjs';

const remote = process.env.BASE_URL;
let server;
let base = remote;
if (!remote) {
  server = await serve(0);
  base = `http://127.0.0.1:${server.address().port}/`;
}
const tag = process.env.SCREENS_TAG || (remote ? 'prod' : 'local');
const LANDING = ['', 'en/', 'zh-tw/', 'ja/', 'ko/', 'es/', 'fr/', 'de/', 'it/', 'pt-br/', 'nl/', 'pl/', 'tr/', 'ar/', 'hi/', 'id/'];
const ONLY = process.env.SCREENS_ONLY?.split(',');
const pages = [
  ...LANDING.map((p) => [p === '' ? 'zh' : p.slice(0, -1), p]),
  ['zh-privacy', 'privacy/'], ['en-privacy', 'en/privacy/'], ['404', 'no-such-page'],
].filter(([name]) => !ONLY || ONLY.includes(name)); // SCREENS_ONLY=zh,ar for a focused run
// Full-page screenshots for these (every page is still checked).
const SHOOT = new Set(['zh', 'en', 'ar', 'de', 'hi', 'ja', 'zh-privacy', '404']);
const viewports = [['desktop', { width: 1440, height: 900 }, 1], ['mobile', { width: 390, height: 844 }, 3]];

const dir = process.env.SCREENS_DIR || 'screenshots';
await mkdir(dir, { recursive: true });
const chromium = await loadChromium();
const browser = await chromium.launch();
const problems = [];

for (const [vpName, viewport, dpr] of viewports) {
  for (const [reduced, scheme] of [[false, 'light'], [false, 'dark'], [true, 'light']]) {
    if (reduced && vpName === 'desktop') continue;
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, colorScheme: scheme, reducedMotion: reduced ? 'reduce' : 'no-preference', isMobile: vpName === 'mobile', hasTouch: vpName === 'mobile' });
    for (const [name, path] of pages) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && !(name === '404' && m.location().url.endsWith(path)) && errors.push(`console: ${m.text()}`));
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
      // A media element cancels its own metadata fetch once it has enough (or the page closes).
      page.on('requestfailed', (r) => !(r.resourceType() === 'media' && /ERR_ABORTED/.test(r.failure()?.errorText ?? '')) && errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
      page.on('response', (r) => r.status() >= 400 && !(name === '404' && r.url().endsWith('no-such-page')) && errors.push(`http ${r.status()}: ${r.url()}`));
      const res = await page.goto(base + path, { waitUntil: 'networkidle' });
      const expected = name === '404' ? 404 : 200;
      if (res.status() !== expected) errors.push(`status ${res.status()} (expected ${expected})`);
      await page.waitForTimeout(300);
      const check = await page.evaluate(() => {
        const doc = document.documentElement;
        const missing = [...document.querySelectorAll('a[href*="#"]')]
          .map((a) => new URL(a.href))
          .filter((u) => u.pathname === location.pathname && u.hash && !document.getElementById(decodeURIComponent(u.hash.slice(1))))
          .map((u) => u.hash);
        return { overflow: doc.scrollWidth - doc.clientWidth, missing, h1: document.querySelectorAll('h1').length };
      });
      if (check.overflow > 0) errors.push(`horizontal overflow ${check.overflow}px`);
      if (check.missing.length) errors.push(`missing anchors ${check.missing.join(' ')}`);
      if (check.h1 !== 1) errors.push(`${check.h1} h1 elements`);
      // Keyboard: the first Tab lands on the skip link.
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => document.activeElement?.className);
      if (first !== 'skip') errors.push(`first tab stop is "${first}", not the skip link`);
      await page.evaluate(() => document.activeElement?.blur());
      // The inline film: no native UI, never audible on its own; muted it may loop while visible,
      // but with reduced motion it stays paused until the visitor presses play.
      const film = await page.evaluate(() => { const v = document.querySelector('video'); return v ? { paused: v.paused, muted: v.muted, controls: v.hasAttribute('controls'), autoplay: v.autoplay } : null; });
      if (film && (film.controls || film.autoplay)) errors.push('native video controls or autoplay attribute');
      if (film && !film.paused && !film.muted) errors.push('film played audibly without the user');
      if (film && reduced && !film.paused) errors.push('film moved despite reduced motion');
      if ((SHOOT.has(name) && !reduced) || (reduced && name === 'zh')) {
        await page.screenshot({ path: `${dir}/${tag}-${name}-${vpName}${scheme === 'dark' ? '-dark' : ''}${reduced ? '-reduced' : ''}.png`, fullPage: true });
      }
      for (const e of errors) problems.push(`${name} ${vpName} ${scheme}${reduced ? ' reduced' : ''}: ${e}`);
      await page.close();
    }
    await ctx.close();
  }
}

await browser.close();
server?.close();
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`screens: ${pages.length} pages × desktop/mobile × light/dark (+ reduced motion) clean at ${base}; screenshots in ${dir}/${tag}-*.png`);
