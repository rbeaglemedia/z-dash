// v3.34: product tests for the touchscreen kiosk and table; src/tests.js runs them in the selftest.
import './touchkiosk.js';
import './touchtable.js';
import './kiosk.js';
import { buildSavedSlabKioskMesh } from './kiosk.js';
import './table6.js';
import { registeredProducts } from '../register.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { Box3, Vector3 } from 'three';
import { itemIcon } from '../icons.js';
import { BRAND } from '../brand.js';
import { DIAG_IN } from './screenface.js';

const ft = (i) => Math.round((i / 12) * 1000) / 1000;
const byId = () => Object.fromEntries(registeredProducts().map((p) => [p.id, p]));
const screens = (g) => { const out = []; g.traverse((m) => { if (m.isMesh && m.name === 'screen') out.push(m); }); return out; };
const diagIn = (mesh) => { const p = mesh.geometry.parameters, dims = [p.width, p.height, p.depth].sort((a, b) => b - a); return Math.hypot(dims[0], dims[1]) * 12; };

export function runTouchscreenTests() {
  const R = [];
  const t = (name, fn) => { let ok = false, err = ''; try { ok = !!fn(); } catch (e) { err = e.message; } R.push([name, ok, err]); };
  const k = byId().touchkiosk, tb = byId().touchtable;
  t('both register in Kiosks', () => k && tb && k.cat === 'kiosks' && tb.cat === 'kiosks' && k.shape === 'touchkiosk' && tb.shape === 'touchtable');
  t('kiosk envelope is the KIPICT2555 spec', () => k.w === ft(34) && k.d === ft(19) && k.h === ft(75.06));
  t('table envelope is the Visionair-e 71 x 35.6 x 29 in line', () => tb.w === ft(71) && tb.d === ft(35.6) && tb.h === ft(29));
  t('unconfirmed items stay flagged', () => k.flags.length >= 3 && tb.flags.length >= 3 && /not confirmed/i.test(k.note) && /not confirmed/i.test(tb.note));
  for (const d of [k, tb]) {
    t(d.id + ' fills its published envelope within 1 in', () => {
      const g = buildMesh(d, 'free'), b = new Box3().setFromObject(g);
      const sz = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z];
      const ok = [sz[0] - d.w, sz[1] - d.h, sz[2] - d.d].every((v) => v > -1 / 12 && v < 1 / 12) && b.min.y > -0.02 && b.min.y < 0.04;
      disposeTree(g);
      return ok;
    });
    t(d.id + ' exposes one video-ready screen mesh', () => {
      const g = buildMesh(d, 'free'), s = screens(g);
      const ok = s.length === 1 && s[0].userData.screen === 1 && s[0].userData.ownMat === 1 && s[0].material && s[0].material.map === null && Math.abs(diagIn(s[0]) - DIAG_IN) < 0.05;
      disposeTree(g);
      return ok;
    });
  }
  t('each screen keeps its own material', () => {
    const a = buildMesh(k), b = buildMesh(k), c = buildMesh(tb);
    const sa = screens(a)[0], sb = screens(b)[0], sc = screens(c)[0];
    sa.material.color.set(0xff00aa);
    const ok = sb.material.color.getHex() !== 0xff00aa && sa.material !== sb.material && sa.material !== sc.material;
    disposeTree(a); disposeTree(b); disposeTree(c);
    return ok;
  });
  t('kiosk glass is portrait on the front', () => {
    const g = buildMesh(k), s = screens(g)[0], p = s.geometry.parameters;
    const ok = p.height > p.width && p.depth < 0.05 && s.position.z > k.d / 2 - 0.02 && p.width < k.w && p.height < k.h;
    disposeTree(g);
    return ok;
  });
  t('table glass lies on the top, landscape', () => {
    const g = buildMesh(tb), s = screens(g)[0], p = s.geometry.parameters;
    const ok = p.width > p.depth && p.height < 0.05 && s.position.y > tb.h - 0.02 && p.width < tb.w && p.depth < tb.d;
    disposeTree(g);
    return ok;
  });
  t('icons use brand colours', () => [k, tb].every((d) => { const svg = itemIcon(d); return svg.includes(BRAND.colors.highlight) && svg.includes(BRAND.colors.accent) && svg.includes('<svg'); }));
  t('a banquet table is left alone', () => {
    const tab = byId().table6;
    const gt = buildMesh(tab, 'free'), bt = new Box3().setFromObject(gt), ht = bt.max.y - bt.min.y;
    const ok = screens(gt).length === 0 && Math.abs(ht - tab.h) < 0.2;
    disposeTree(gt);
    return ok;
  });
  t('iPad kiosk is a pedestal with a base, angled screen and front reader', () => {
    const ipad = byId().kiosk;
    const g = buildMesh(ipad, 'free');
    const named = {};
    g.traverse((o) => { if (o.name) named[o.name] = o; });
    const s = screens(g);
    const b = new Box3().setFromObject(g);
    const hi = b.max.y - b.min.y, wi = b.max.x - b.min.x, di = b.max.z - b.min.z;
    const col = named.kioskPedestal, base = named.kioskBase, reader = named.kioskReader, bracket = named.kioskReaderBracket;
    const tilt = s[0] && s[0].parent && s[0].parent.rotation.x;
    const deg = tilt * 180 / Math.PI;
    const at = (o) => o.getWorldPosition(new Vector3());
    const panel = s[0] && s[0].material && s[0].material.color.getHex() === 0x1b3a55 && s[0].material.emissive.getHex() === 0x0e2a44;
    const landscape = s[0] && s[0].geometry.parameters.width > s[0].geometry.parameters.height && s[0].geometry.parameters.depth < 0.05;
    const pedestal = col && col.geometry.parameters.width > ft(8) - 0.02 && col.geometry.parameters.width < ft(10) + 0.02
      && col.geometry.parameters.depth > ft(4) - 0.02 && col.geometry.parameters.depth < ft(5) + 0.02
      && base && col.geometry.parameters.width < base.geometry.parameters.width * 0.7;
    const front = reader && bracket && at(reader).z > at(col).z + 0.05 && Math.abs(at(reader).x) < 0.2;
    const fit = hi > 3 && hi < ipad.h + 0.15 && wi <= ipad.w + 0.15 && di <= ipad.d + 0.35 && b.min.y > -0.02;
    const ok = ipad.shape === 'kiosk' && s.length === 1 && s[0].userData.isScreenFace === true && s[0].userData.screen === 1 && s[0].userData.ownMat === 1
      && panel && landscape && deg < -35 && deg > -45 && pedestal && front && fit && named.kioskHead && named.kioskSensor;
    disposeTree(g);
    return ok;
  });
  t('saved slab kiosk stays wide, and the meshes.js slab case is still there', () => {
    const ipad = byId().kiosk;
    const slab = buildSavedSlabKioskMesh(ipad.w, ipad.h, ipad.d);
    const legacy = buildMesh({ id: 'slab-check', shape: 'kiosk', w: ipad.w, h: ipad.h, d: ipad.d }, 'free');
    const live = buildMesh(ipad, 'free');
    const wide = (g) => {
      let hit = false;
      g.traverse((o) => {
        if (!o.isMesh) return;
        const b = new Box3().setFromObject(o);
        const mw = b.max.x - b.min.x, mh = b.max.y - b.min.y;
        if (mh > 2 && mw > ipad.w * 0.6) hit = true;
      });
      return hit;
    };
    const col = [];
    live.traverse((o) => { if (o.name === 'kioskPedestal') col.push(o); });
    const body = [];
    slab.traverse((o) => { if (o.name === 'slabBody') body.push(o); });
    const narrow = col.length === 1 && col[0].geometry.parameters.width < ipad.w * 0.6;
    const saved = body.length === 1 && body[0].geometry.parameters.width > ipad.w * 0.65 && body[0].geometry.parameters.width > col[0].geometry.parameters.width;
    const ok = wide(slab) && wide(legacy) && !wide(live) && narrow && saved && !live.getObjectByName('slabBody');
    disposeTree(slab); disposeTree(legacy); disposeTree(live);
    return ok;
  });
  return R; // v3.34: run by the selftest (src/tests.js), no longer at app startup
}
