import { resolve } from 'path';
import { BRAND } from './src/brand.js';
// Brand tokens (%BRAND_*%) in the HTML come from src/brand.js; the web app manifest is generated from it too.
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const css = () => { const c = BRAND.colors; return `:root{--bg:${c.bg};--surface:${c.surface};--fg:${c.fg};--muted:${c.muted};--action:${c.action};--action-h:${c.actionHover};--on-action:${c.onAction};--accent:${c.accent};--hl:${c.highlight};--navy:${c.navy};--font:${BRAND.fonts.body};--font-h:${BRAND.fonts.heading}}`; };
const tokens = () => ({ BRAND_NAME: BRAND.name, BRAND_APP: BRAND.appName, BRAND_BG: BRAND.colors.bg, BRAND_DESC: BRAND.copy.description, BRAND_ICON: BRAND.icon, BRAND_ICON512: BRAND.icon512, BRAND_FAVICON: BRAND.favicon, BRAND_LOGO: BRAND.logo, BRAND_LOGO_W: BRAND.logoW, BRAND_LOGO_H: BRAND.logoH, BRAND_LEAD: BRAND.copy.lead, BRAND_REPNOTE: BRAND.copy.repNote });
const brandPlugin = { name: 'brand', transformIndexHtml: { order: 'pre', handler(html) { let out = html.replace('%BRAND_CSS%', css()); for (const [k, v] of Object.entries(tokens())) out = out.split(`%${k}%`).join(esc(v)); return out; } },
  generateBundle() { this.emitFile({ type: 'asset', fileName: 'manifest.webmanifest', source: JSON.stringify({ name: `${BRAND.appName} | ${BRAND.name}`, short_name: BRAND.appName, start_url: './index.html', display: 'standalone', background_color: BRAND.colors.bg, theme_color: BRAND.colors.bg, icons: [{ src: BRAND.icon, sizes: '192x192', type: 'image/png' }, { src: BRAND.icon512, sizes: '512x512', type: 'image/png' }] }, null, 2) }); } };
export default { base: './', plugins: [brandPlugin], build: { rollupOptions: { input: { main: resolve(__dirname, 'index.html') } } } };
