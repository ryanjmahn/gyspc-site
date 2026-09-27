/**
 * Renders the Open Graph image (1200×630) and the Apple touch icon (180×180) to /public,
 * using the hero's edited headline on paper. Re-run after changing the headline in site.ts:
 *   node scripts/og-image.mjs
 */
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

// Pull the headline straight from the content file so the image never drifts from the site.
const site = readFileSync(new URL('../src/content/site.ts', import.meta.url), 'utf8')
const pick = (key) => site.match(new RegExp(`${key}: '([^']+)'`))[1]
const lead = pick('lead')
const struck = pick('struck')
const inserted = pick('inserted')

const fonts =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400&family=JetBrains+Mono:wght@400&display=block'

const og = `<!doctype html><html><head><link rel="stylesheet" href="${fonts}"><style>
  body { margin: 0; width: 1200px; height: 630px; background: #f7f9fc; color: #0b1f3a; font-family: Fraunces, serif; }
  .wrap { padding: 64px 80px; position: relative; height: 100%; box-sizing: border-box; }
  .label { font-family: 'JetBrains Mono', monospace; font-size: 20px; letter-spacing: .1em; color: #4a5a70; text-transform: uppercase; }
  h1 { margin: 36px 0 0; font-weight: 400; font-size: 104px; line-height: 1.02; letter-spacing: -0.03em; font-variation-settings: 'opsz' 144; }
  .s { position: relative; display: inline-block; color: #4a5a70; }
  .s svg { position: absolute; left: -6px; top: 0; width: calc(100% + 12px); height: 100%; overflow: visible; }
  .i { position: relative; display: inline-block; font-style: italic; color: #0069b4; padding-left: 36px; }
  .i svg { position: absolute; left: -8px; bottom: 2px; width: 44px; height: 38px; overflow: visible; }
  .foot { position: absolute; left: 80px; right: 80px; bottom: 56px; display: flex; justify-content: space-between;
          border-top: 1px solid rgb(11 31 58 / .18); padding-top: 20px; }
</style></head><body><div class="wrap">
  <div class="label">GYSPC — Global Youth Science &amp; Policy Competition</div>
  <h1>${lead}<br>
    <span class="s">${struck}<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 60 C22 55 55 62 100 50" fill="none" stroke="#0069b4" stroke-width="7" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg></span><br>
    <span class="i"><svg viewBox="0 0 44 38"><path d="M4 36 L22 4 L40 36" fill="none" stroke="#0069b4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>${inserted}</span>
  </h1>
  <div class="foot label"><span>Hosted by IES × STEMise</span><span>4 tracks · hybrid</span></div>
</div></body></html>`

const icon = `<!doctype html><html><head><link rel="stylesheet" href="${fonts}"><style>
  body { margin: 0; width: 180px; height: 180px; background: #f7f9fc; display: grid; place-items: center; }
  .g { font-family: Fraunces, serif; font-weight: 600; font-size: 136px; line-height: 1; color: #0b1f3a; position: relative; top: -6px; left: -10px; }
  svg { position: absolute; right: 22px; bottom: 22px; }
</style></head><body><span class="g">G</span>
  <svg width="40" height="40" viewBox="0 0 40 40"><path d="M4 36 L20 6 L36 36" fill="none" stroke="#0069b4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>
</body></html>`

const browser = await chromium.launch()
for (const [html, w, h, out] of [
  [og, 1200, 630, 'public/og-image.png'],
  [icon, 180, 180, 'public/apple-touch-icon.png'],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out })
  console.log(`wrote ${out}`)
}
await browser.close()
