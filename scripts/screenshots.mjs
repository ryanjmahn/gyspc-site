/**
 * Full-page screenshots at 375 / 768 / 1440 px.
 * Usage: npm run build && npm run preview  (in another terminal), then  node scripts/screenshots.mjs [url] [outDir]
 * Reduced motion is emulated so every animation shows its final state.
 */
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:4173/'
const out = process.argv[3] ?? 'docs/screenshots'
const widths = [375, 768, 1440]

const browser = await chromium.launch()
for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({
    path: `${out}/gyspc-${width}.jpg`,
    fullPage: true,
    type: 'jpeg',
    quality: 78,
  })
  console.log(`saved ${out}/gyspc-${width}.jpg`)
  await page.close()
}
await browser.close()
