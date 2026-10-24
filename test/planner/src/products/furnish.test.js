// Product tests for LED furniture, pedestals, bars, and the vending placeholder.
// Runs only when the selftest calls runFurnishTests. Importing this file does not run it.
// Not shipped: catalog.js globs src/products/*.js and skips *.test.js.
//
// Hook lines for src/tests.js (shared file; not edited in this change):
//   import { runFurnishTests } from './products/furnish.test.js';
//   for (const row of runFurnishTests()) R.push(row);
import { BY_ID, ITEMS } from '../catalog.js';
import { registeredProducts } from '../register.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { itemIcon } from '../icons.js';
import { BRAND } from '../brand.js';
import { Box3 } from 'three';
import { SCREEN_H_IN, SCREEN_W_IN } from './vending.js';

const ft = (i) => Math.round((i / 12) * 1000) / 1000;
const near = (a, b, e = 0.001) => Math.abs(a - b) <= e;
const IN = 1 / 12;

const IDS = ['glowcube', 'glowbar', 'pedestal', 'displaycube', 'eventbar', 'backbar', 'vending'];

function meshOf(d) {
  const g = buildMesh(d, 'free');
  const b = new Box3().setFromObject(g);
  const names = [];
  let emissive = false;
  g.traverse((m) => {
    if (m.name) names.push(m.name);
    const e = m.material && m.material.emissive;
    if (e && e.getHex && e.getHex() !== 0) emissive = true;
  });
  const sz = { x: b.max.x - b.min.x, y: b.max.y - b.min.y, z: b.max.z - b.min.z, minY: b.min.y };
  disposeTree(g);
  return { sz, names, emissive };
}

export function runFurnishTests() {
  const R = [];
  const t = (name, fn) => { let ok = false; try { ok = !!fn(); } catch (e) { name += ' (' + e.message + ')'; } R.push([name, ok]); };
  const item = (id) => BY_ID[id];

  t('furnish products use orders 60-69 and existing categories', () => {
    const reg = Object.fromEntries(registeredProducts().map((p) => [p.id, p]));
    return IDS.every((id) => {
      const d = item(id), r = reg[id];
      return d && r && r.order >= 60 && r.order <= 69 && ['decor', 'counters'].includes(d.cat) && d.unconfirmed && typeof d.draw === 'function';
    }) && new Set(IDS.map((id) => reg[id].order)).size === IDS.length;
  });

  t('glow cube is the spreadsheet 16 in cube, flagged', () => {
    const d = item('glowcube');
    return d.cat === 'decor' && near(d.w, ft(16)) && near(d.d, ft(16)) && near(d.h, ft(16)) && /UNCONFIRMED/.test(d.note) && /16 × 16 × 16/.test(d.note) && /which LED furniture/.test(d.note);
  });
  t('glow bar is a flagged 72 × 24 × 42 placeholder, not the cube size', () => {
    const d = item('glowbar');
    return near(d.w, ft(72)) && near(d.d, ft(24)) && near(d.h, ft(42)) && /UNCONFIRMED/.test(d.note) && /72 × 24 × 42/.test(d.note) && /72 × 12 × 42/.test(d.note) && /16 in cube/.test(d.note);
  });
  t('pedestal is the spreadsheet 12 × 12 × 42, flagged', () => {
    const d = item('pedestal');
    return near(d.w, ft(12)) && near(d.d, ft(12)) && near(d.h, ft(42)) && d.snapsTo.includes('backwall') && /UNCONFIRMED/.test(d.note) && /12 × 12 × 42/.test(d.note);
  });
  t('display cube is a separate flagged 24 in cube', () => {
    const d = item('displaycube');
    return near(d.w, ft(24)) && near(d.d, ft(24)) && near(d.h, ft(24)) && /UNCONFIRMED/.test(d.note) && /24 × 24 × 24/.test(d.note) && /12 × 12 × 42/.test(d.note);
  });
  t('event bar is the CORT Posh candidate and says bars are not confirmed', () => {
    const d = item('eventbar');
    return d.cat === 'counters' && near(d.w, ft(72)) && near(d.d, ft(30)) && near(d.h, ft(40.25)) && /Bob has not confirmed/.test(d.note) && /rents bars/.test(d.note) && /72 × 30 × 40\.25/.test(d.note);
  });
  t('backbar is a flagged placeholder and says bars are not confirmed', () => {
    const d = item('backbar');
    return d.cat === 'counters' && near(d.w, ft(72)) && near(d.d, ft(18)) && near(d.h, ft(84)) && /Bob has not confirmed/.test(d.note) && /rents bars/.test(d.note) && /72 × 18 × 84/.test(d.note) && /front bar/.test(d.note);
  });
  t('vending machine is an AMS placeholder, not a Crane average', () => {
    const d = item('vending');
    return d.placeholder && near(d.w, ft(39)) && near(d.d, ft(35)) && near(d.h, ft(72)) && /PLACEHOLDER/.test(d.note) && /AMS Classic Snack/.test(d.note) && /Crane/.test(d.note) && /not a shared standard/.test(d.note) && /Screen size is UNCONFIRMED/.test(d.note) && new RegExp(SCREEN_W_IN + ' × ' + SCREEN_H_IN).test(d.note);
  });
  t('social media display is omitted: published envelopes do not agree', () => !BY_ID.social && !BY_ID.socialdisplay && !ITEMS.some((i) => /social media/i.test(i.name)));

  t('each new mesh fills its envelope within 1 in and sits on the floor', () => IDS.every((id) => {
    const d = item(id), { sz } = meshOf(d);
    return [sz.x - d.w, sz.y - d.h, sz.z - d.d].every((v) => v > -IN && v < IN) && sz.minY > -0.02 && sz.minY < 0.04;
  }));
  t('glow cube and glow bar light up', () => {
    const cube = meshOf(item('glowcube')), bar = meshOf(item('glowbar'));
    return cube.names.includes('glowFace') && bar.names.includes('glowBarFace') && cube.emissive && bar.emissive;
  });
  t('vending exposes one portrait screen on the front, with its own material', () => {
    const d = item('vending');
    const screensOf = (g) => { const out = []; g.traverse((m) => { if (m.isMesh && m.name === 'screen') out.push(m); }); return out; };
    const g = buildMesh(d, 'free'), s = screensOf(g);
    const p = s[0] && s[0].geometry.parameters;
    const fit = s.length === 1 && s[0].userData.screen === 1 && s[0].userData.ownMat === 1 && s[0].material && s[0].material.map === null
      && near(p.width, SCREEN_W_IN / 12) && near(p.height, SCREEN_H_IN / 12) && p.height > p.width && p.depth < 0.05
      && s[0].position.z > d.d / 2 - 0.02 && p.width < d.w && p.height < d.h;
    const g2 = buildMesh(d, 'free'), other = screensOf(g2)[0];
    s[0].material.color.set(0xff00aa);
    const own = other.material !== s[0].material && other.material.color.getHex() !== 0xff00aa;
    disposeTree(g); disposeTree(g2);
    return fit && own;
  });
  t('new icons use Rentacomputer.com colours', () => IDS.every((id) => {
    const svg = itemIcon(item(id));
    return svg.startsWith('<svg') && svg.includes(BRAND.colors.highlight) && svg.includes(BRAND.colors.accent);
  }));
  t('a 6 ft table is unchanged', () => item('table6') && item('table6').w === 6 && item('table6').h === 2.5 && !item('table6').unconfirmed);
  return R;
}
