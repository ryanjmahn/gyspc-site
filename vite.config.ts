import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { seo } from './src/content/site.ts'

/** Fills the SEO placeholders in index.html from src/content/site.ts, so copy lives in one file. */
function seoFromContent(): Plugin {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'seo-from-content',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%SEO_TITLE%', escape(seo.title))
        .replaceAll('%SEO_DESCRIPTION%', escape(seo.description)),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoFromContent()],
  // Build day, so prerendered HTML and first client render agree on timeline status.
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
})
