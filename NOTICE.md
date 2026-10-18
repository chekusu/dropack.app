# Notices

The source code in this repository is licensed under the MIT License (see [LICENSE](LICENSE)).
This file explains the non-code assets, and what the code license does not cover.

## Project art

These images were made for the Dropack project and are included so the site builds and looks
as it does on dropack.app. They were created under the project's direction with an AI image
generator and then exported for the web (scaled, converted, metadata removed). They are
provided under the same MIT terms, to the extent chekusu Inc. holds rights in them.

| Files | What |
|---|---|
| `public/brand/dropack-wordmark-v3-{168,336,504}.png` | the Dropack wordmark (header and footer) |
| `public/brand/dropack-icon-{32,64,96,192,512}.png`, `public/apple-touch-icon.png`, `public/favicon.ico` | the Dropack app icon ("Folded D") |
| `public/art/watercolor-{desktop,mobile}.webp` | the decorative watercolor layers behind the film |
| `public/og-zh.png`, `public/og-en.png` | Open Graph cards: the wordmark and the page slogan, text rendered with system fonts (no font files are included) |

The high-resolution masters, generation prompts and production records are not part of this
repository.

## Sample media

`media/sample/sample-film.mp4` and `media/sample/sample-poster.jpg` are an original placeholder
animation drawn from plain shapes by `scripts/sample-media.mjs` (no photographs, people, voices,
fonts or recordings; no audio track). They are covered by the MIT License like the code. They
are not the film shown on dropack.app.

The production films, narration, presenter video, photographs and fonts used to make them are
not included and are not licensed by this repository.

## Trademarks

The MIT License covers copyright only. It does not grant any right to use the names "Dropack"
or "CHEKUSU", the Dropack wordmark or app icon as trademarks, for example to name or brand
another app, website or service in a way that suggests it comes from or is endorsed by
chekusu Inc. If you publish a modified copy of this site, replace the name, wordmark and icon
with your own.

iPhone, iOS, AirDrop, iCloud and TestFlight are trademarks of Apple Inc., registered in the U.S.
and other countries. Dropack is not affiliated with Apple. GitHub is a trademark of GitHub, Inc.

## Third-party software

The site itself has no runtime dependencies: the build, tests and preview server use Node.js
built-ins only. The optional browser checks (`npm run screens`) use Playwright
(Apache License 2.0), installed from npm as a development dependency and not included here.
