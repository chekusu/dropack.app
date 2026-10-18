# dropack.app

Source of the official [Dropack](https://dropack.app) website.

This repository is the website only. The Dropack iOS app is open source too:
**https://github.com/chekusu/dropack**.

## About Dropack

Dropack is an iPhone and iPad app (iOS 17 or later) for sending a large batch of original photos
and videos in one go. It packs your selection into a single `.dropack` package (or an ordinary
ZIP), you send that file with the system AirDrop, and on the receiving device Dropack saves the
items into Photos one by one. Saving can be paused and continued item by item, and items that
were already saved are recognised, so an interrupted import does not start over.

Packing, unpacking and saving all happen on the device; there is no account and no Dropack
server. The transfer itself is Apple's AirDrop: Dropack does not speed it up, resume it, or
send to other platforms.

## What this site is

A small static site, built with Node.js built-ins only (no framework, no runtime dependencies):

- 16 short landing pages, one per language, each with an inline film, captions and a few
  questions: English (`/en/`), Simplified Chinese (`/`), Traditional Chinese (`/zh-tw/`),
  Japanese (`/ja/`), Korean (`/ko/`), Spanish (`/es/`), French (`/fr/`), German (`/de/`),
  Italian (`/it/`), Brazilian Portuguese (`/pt-br/`), Dutch (`/nl/`), Polish (`/pl/`),
  Turkish (`/tr/`), Arabic (`/ar/`, right to left), Hindi (`/hi/`) and Indonesian (`/id/`)
- privacy notes in Simplified Chinese and English, a bilingual support page and a 404 page
- accessible inline video controls (sound, play/pause, replay) with captions drawn from the
  page's WebVTT track, reduced-motion support, and a no-JavaScript fallback
- no web fonts, analytics, cookies, forms or third-party requests; a strict Content Security
  Policy in `public/_headers`
- an optional Cloudflare Worker (`worker/`) that adds HTTP byte ranges to MP4 files so browsers
  can seek

```
src/landing.mjs           landing page copy, 16 languages
src/content.mjs           privacy pages and 404 (Chinese and English); the site origin
src/support.mjs           the bilingual support page
scripts/build.mjs         builds dist/ (pages, sitemap, robots.txt, hashed media)
scripts/serve.mjs         local preview server for dist/ (with byte ranges)
scripts/screens.mjs       optional browser QA and screenshots (Playwright)
scripts/sample-media.mjs  re-renders the sample film (FFmpeg; not needed to build)
public/                   stylesheets, scripts, icons, wordmark, watercolor art, headers
media/sample/             the neutral sample film, poster and media manifest
worker/                   the Cloudflare Worker for /media/*
tests/                    node:test suites: built pages, player script, Worker
wrangler.example.jsonc    example Cloudflare configuration
```

## Build, test and preview

Requirements: Node.js 22 (tested with 22.22.1). Nothing else is needed for the build, the tests
or the preview server; they work offline from a fresh clone.

```sh
git clone https://github.com/chekusu/dropack.app.git
cd dropack.app
npm test          # builds dist/ and runs the tests
npm run preview   # serves dist/ at http://127.0.0.1:4321/ (PORT and HOST to change)
```

`npm run build` builds without testing. No `npm install` is required for any of these.

Optional browser checks (every page at phone and desktop sizes, light and dark, reduced motion;
fails on console errors, failed requests, horizontal overflow or a wrong first tab stop):

```sh
npm ci                                  # installs Playwright from package-lock.json
npx playwright install chromium         # downloads the browser
npm run screens                         # screenshots go to screenshots/
```

## Media: public sample vs. the production site

A clean clone builds with **neutral sample media**: `media/sample/` holds an original
placeholder animation (plain shapes, no audio), its poster and a `media.json` manifest. Every
language page plays that sample, and the build writes sample captions for each language from
the page's own copy (the three steps, then the slogan).

The film on dropack.app is different. Its promotional films, narration, presenter video and
production records are private and **intentionally not in this repository**, nor is any link
that would download them. The official site is built from a private repository that keeps its
own private media pipeline. This public build instead supports the generic manifest described
below, for media you own. The deployment history of the official site is likewise not
published.

### Using your own media

Write a manifest next to your media files, outside the repository or in the ignored
`media/local/` folder, and point `DROPACK_MEDIA_MANIFEST` at it:

```json
{
  "default": { "video": "film.mp4", "poster": "poster.jpg", "width": 1920, "height": 1080, "duration": 36 },
  "locales": {
    "ja": { "video": "film-ja.mp4", "captions": "film-ja.vtt" },
    "en": { "captions": "film-en.vtt" }
  },
  "sha256": { "film.mp4": "<optional SHA-256, checked at build time>" }
}
```

```sh
DROPACK_MEDIA_MANIFEST=media/local/media.json npm test
```

- Paths are relative to the manifest's folder. Each language uses its `locales` entry over
  `default`; locale keys are the language tags in `src/landing.mjs` (`en`, `zh-CN`, `pt-BR` …).
- `captions` is a WebVTT file. Without one, the build writes sample captions spread over
  `duration` seconds.
- `"presenter": true` marks a film with a presenter inset at the lower right; the captions
  then stay clear of it on small screens.
- Files listed under `sha256` must match, or the build stops.
- Each file is published under a content-hashed name in `/media/` and cached for a year.

The landing copy describes the official 36-second film (for example the video's accessible
label). If your film is different, change `videoLabel` in `src/landing.mjs`.

## Deploying your own copy

The site is plain static files in `dist/`, so any static host works; the Worker only adds
byte ranges for seeking in MP4s. To deploy on Cloudflare Workers with an account you control:

```sh
cp wrangler.example.jsonc wrangler.jsonc   # set the name; add your own domain if you have one
DROPACK_SITE_URL=https://example.com npm test
npx wrangler deploy                        # uses your own Cloudflare login
```

`DROPACK_SITE_URL` sets the origin used in canonical links, hreflang, the sitemap and Open
Graph tags (default `https://dropack.app`). You need your own Cloudflare account, and your own
domain if you do not want a `workers.dev` address. This repository contains no account
identifiers, credentials or production routes. If you publish a modified site, use your own
name, logo and icon (see [NOTICE.md](NOTICE.md)).

## Editing copy

The pages are short on purpose, and the tests enforce some content rules. Keep claims within
what the app does: Dropack packs and saves on the device, Apple's AirDrop does the transfer,
and pausing and continuing apply to saving into Photos. The tests reject the most likely slips,
such as speed or capacity numbers, App Store download wording, testimonials or "coming soon"
prose. The two privacy pages describe the official site and app; review them if you deploy a
changed copy.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

The code is released under the [MIT License](LICENSE), © 2026 chekusu Inc. Project art, the
sample media and trademarks are explained in [NOTICE.md](NOTICE.md). `"private": true` in
`package.json` only stops accidental publishing to npm; it has nothing to do with the
visibility of this repository.
