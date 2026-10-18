// Loads Playwright for the optional browser scripts without making it a dependency.
// Uses the `playwright` dev dependency (npm ci, then npx playwright install chromium), or the
// module directory named by PLAYWRIGHT_MODULE.
import { createRequire } from 'node:module';

export async function loadChromium() {
  const require = createRequire(import.meta.url);
  const id = process.env.PLAYWRIGHT_MODULE || 'playwright';
  try {
    return require(id).chromium;
  } catch {
    throw new Error('Playwright not found: run `npm ci && npx playwright install chromium`, or set PLAYWRIGHT_MODULE.');
  }
}
