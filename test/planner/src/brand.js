// ======================================================================================
// BRAND CONFIG: the only place brand details live. To rebrand, change BRAND_ID or add a
// new entry to BRANDS (logo files go in public/brand/). Everything else (header, splash,
// page title and meta, manifest and icons, share image, colours, fonts, copy) reads from here.
// Previous brand, kept here as a comment so swapping back is easy (logo file kept in brand-assets/rentourav-logo.webp; copy it into public/brand/ to use it):
//   rentourav: { name: 'RentOurAV.com', siteUrl: 'https://www.rentourav.com', logo: './rentourav-logo.webp',
//     colors: { bg: '#081018', surface: '#102033', fg: '#f4efe6', muted: '#c9c2b4', action: '#ff6a1a', actionHover: '#e85a0c',
//       onAction: '#081018', accent: '#2ce0c6', highlight: '#ff6a1a', navy: '#0b1f3a', strip: '#081018', stripText: '#f4efe6' },
//     fonts: { body: 'Outfit, Inter, system-ui, sans-serif', heading: 'Inter, Outfit, sans-serif' } }
// ======================================================================================
export const BRANDS = {
  rentacomputer: {
    id: 'rentacomputer',
    name: 'Rentacomputer.com', // always written exactly like this
    appName: 'Event Space Planner',
    siteUrl: 'https://www.rentacomputer.com',
    logo: './brand/rentacomputer-logo.png', logoW: 400, logoH: 84, // official logo from rentacomputer.com (company asset)
    icon: './brand/rentacomputer-icon-192.png', icon512: './brand/rentacomputer-icon-512.png', favicon: './brand/rentacomputer-icon-64.png',
    // Colours taken from rentacomputer.com's public CSS (navy #062a50, blue #1d4a8d, electric #2f7ed8, cyan #5fd4ff, deep #03192f, logo blue #003399)
    colors: { bg: '#03192f', surface: '#0b2e55', fg: '#f4f8fc', muted: '#b9c6d8', action: '#2f7ed8', actionHover: '#1d6fc4', onAction: '#ffffff',
      accent: '#5fd4ff', highlight: '#2f7ed8', navy: '#062a50', strip: '#ffffff', stripText: '#062a50', stripSub: '#1d4a8d' },
    // rentacomputer.com uses the system font stack
    fonts: { body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    copy: { lead: 'Draw your room wall by wall and see it in 3D. Free to use.', repNote: 'Sizes are typical. Your Rentacomputer.com rep confirms exact items.',
      shareTitle: 'My event layout', shareText: 'Planned with the Rentacomputer.com Event Space Planner', description: 'Plan your event space in 3D with the Rentacomputer.com Event Space Planner. Draw your room, place tables, screens and tech, and share the layout.' },
    // Quote endpoint: NOT wired yet. rentacomputer.com's own quote form (/quote) POSTs JSON to /api/quote with a reCAPTCHA token,
    // and its bundle already accepts an optional eventPlan { imageDataUrl, summary, planJson }. Needs a CORS/recaptcha plan before use.
    quote: { url: 'https://www.rentacomputer.com/api/quote', page: 'https://www.rentacomputer.com/quote', wired: false },
  },
};
export const BRAND_ID = 'rentacomputer';
export const BRAND = BRANDS[BRAND_ID];
export const hex = (c) => parseInt(c.slice(1), 16); // '#2f7ed8' -> 0x2f7ed8 for three.js
// Apply colours and fonts as CSS variables (style.css only uses the variables).
export function applyBrandCss(root = document.documentElement) { const c = BRAND.colors, s = root.style;
  for (const [k, v] of Object.entries({ bg: c.bg, surface: c.surface, fg: c.fg, muted: c.muted, action: c.action, 'action-h': c.actionHover, 'on-action': c.onAction, accent: c.accent, hl: c.highlight, navy: c.navy })) s.setProperty('--' + k, v);
  s.setProperty('--font', BRAND.fonts.body); s.setProperty('--font-h', BRAND.fonts.heading); }
