/**
 * Injects the server-rendered page into dist/index.html so content paints before JS loads.
 * Run by `npm run build` after the client and SSR builds.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const { render } = await import('../dist-ssr/entry-server.js')
const file = new URL('../dist/index.html', import.meta.url)
let html = readFileSync(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)

// The stylesheet is small; inlining it removes the only render-blocking request.
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(new URL(`../dist${href}`, import.meta.url), 'utf8')
  return `<style>${css}</style>`
})
// The page is fully readable before JS runs, so let fonts and HTML win the bandwidth race.
html = html.replace(
  '<script type="module" crossorigin',
  '<script type="module" fetchpriority="low" crossorigin',
)
writeFileSync(file, html)
rmSync(new URL('../dist-ssr', import.meta.url), { recursive: true, force: true })
console.log('prerendered dist/index.html')
