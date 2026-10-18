# Contributing

Thanks for helping with the Dropack website. Issues and pull requests are welcome, especially
for translation fixes, accessibility and browser compatibility.

- For the iOS app itself, use https://github.com/chekusu/dropack.
- Run `npm test` before you open a pull request; it builds the site and runs every check.
  For layout changes, `npm run screens` (see README.md) catches overflow and console errors.
- Keep the site dependency-free at runtime: Node.js built-ins for the build, no third-party
  scripts, fonts, analytics or embeds. `public/_headers` sets a strict Content Security Policy.
- Copy changes should stay within what the app actually does (see "Editing copy" in README.md).
  For a translation, change only that language and say what you corrected.
- Do not commit personal photos, videos, voice recordings, credentials, `.env` files or your
  own `wrangler.jsonc`. Use your own media through `DROPACK_MEDIA_MANIFEST`.

By contributing, you agree that your contribution is licensed under the MIT License of this
repository.
