// Lane 40 checks. The catalog glob loads this file with the products, including at app startup.
// Nothing here runs a check unless this document is selftest.html. The app and the ?selftest iframe do not.
import { BY_ID, ITEMS } from '../catalog.js';
import { registeredProducts } from '../register.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { newItem, applyPose, snapPose, isValid } from '../logic.js';
import { presetWalls } from '../walls.js';
import { Box3 } from 'three';
import { ft } from './draw.js';
import { BRAND } from '../brand.js';

const IDS = ['digisign', 'tv85', 'desktop', 'copier', 'charger'];
const SCREEN_IDS = ['digisign', 'tv85', 'desktop'];
const SHAPES = new Set('table round chair stool lounge counter tv screen led ledposter ledtrailer laptop ipad monitor kiosk tower speaker podium powerbox drape booth'.split(' '));

const near = (a, b, e = 0.0015) => Math.abs(a - b) < e;
const screensOf = (g) => { const s = []; g.traverse((o) => { if (o.isMesh && o.name === 'screen') s.push(o); }); return s; };
const sizeOf = (g) => { const b = new Box3().setFromObject(g); return { w: b.max.x - b.min.x, h: b.max.y - b.min.y, d: b.max.z - b.min.z, minY: b.min.y, maxY: b.max.y, empty: b.isEmpty() }; };
const room = () => ({ env: 'indoor', walls: presetWalls('30x40'), items: [], cols: [] });

export function runLane40() {
  const lines = [];
  const t = (name, fn) => { let ok = false; try { ok = !!fn(); } catch (e) { name += ' (' + e.message + ')'; } lines.push(['lane40 ' + name, ok]); };
  t('five products register at orders 40–44', () => {
    const regs = registeredProducts().filter((p) => IDS.includes(p.id));
    return regs.length === IDS.length && regs.every((p) => p.order >= 40 && p.order <= 44) && new Set(regs.map((p) => p.order)).size === IDS.length && IDS.every((id) => ITEMS.some((i) => i.id === id));
  });
  t('sizes match missing-products.xlsx inches', () => {
    const want = { digisign: [48.7, 25.3, 27.9], tv85: [74.97, 13.07, 42.71], desktop: [30.06, 11.5, 18], copier: [24.375, 28.5, 36.875], charger: [19, 8, 26] };
    return IDS.every((id) => { const d = BY_ID[id], [w, dep, h] = want[id]; return near(d.w, ft(w)) && near(d.d, ft(dep)) && near(d.h, ft(h)); });
  });
  t('each is flagged unconfirmed, with the gap written out, and no prices', () => IDS.every((id) => {
    const d = BY_ID[id], blob = `${d.name} ${d.note} ${(d.gaps || []).join(' ')}`;
    return d.unconfirmed === true && /Unconfirmed/.test(d.note) && (d.gaps || []).length > 0 && (d.sources || []).length > 0 && !/\$|\bprice\b|\bRAC\b|\bCAM\b|distro|Xponex/i.test(blob);
  }));
  t('signage height is the 27.9 in panel, not an invented stand', () => BY_ID.digisign.parts.panel.hIn === 27.9 && BY_ID.digisign.parts.base.dIn === 25.3 && /only as tall as the panel/.test(BY_ID.digisign.note));
  t('85 in TV keeps the panel and the stand footprint, and does not use the 98 in thickness', () => {
    const d = BY_ID.tv85; return d.parts.panel.wIn === 74.97 && d.parts.panel.hIn === 42.71 && d.parts.stand.dIn === 13.07 && near(d.panel, ft(42.71)) && near(d.wallD, ft(13.07)) && d.mountY === 0 && d.snapsTo.includes('wall') && /3\.8 in depth belongs to the QM98T/.test(d.gaps.join(' '));
  });
  t('desktop tower is the OptiPlex size and the monitor is the existing flagged item', () => {
    const d = BY_ID.desktop, m = BY_ID.monitor; return d.parts.tower.wIn === 6.06 && d.parts.tower.dIn === 11.5 && d.parts.tower.hIn === 12.77 && d.parts.monitor.flagged === true && near(m.w, ft(24)) && near(m.d, ft(8)) && near(m.h, ft(18)) && near(d.w, ft(24) + ft(6.06)) && d.snapsTo.includes('top');
  });
  t('copier and charging locker use their sheet sizes', () => BY_ID.copier.parts.body.wIn === 24.375 && BY_ID.charger.parts.bays === 8 && BY_ID.charger.snapsTo.includes('nearwall') && BY_ID.copier.snapsTo.includes('nearwall') && BY_ID.digisign.snapsTo.includes('nearwall'));
  t('shapes do not reuse a mesh already drawn in meshes.js', () => IDS.every((id) => !SHAPES.has(BY_ID[id].shape) && typeof BY_ID[id].mesh === 'function'));
  t('code-drawn meshes match the footprint within 0.6 in', () => IDS.every((id) => {
    const d = BY_ID[id], g = d.mesh('free'), s = sizeOf(g); disposeTree(g);
    return !s.empty && Math.abs(s.w - d.w) < 0.05 && Math.abs(s.d - d.d) < 0.05 && Math.abs(s.h - d.h) < 0.05 && s.minY > -0.02 && s.maxY < d.h + 0.02;
  }));
  t('screen items expose one mesh named screen; copier and locker do not', () => {
    const one = (id, mode) => { const g = BY_ID[id].mesh(mode), s = screensOf(g), z = s[0] ? s[0].position.z : 0; disposeTree(g); return s.length === 1 && z > 0; };
    const none = (id) => { const g = BY_ID[id].mesh('free'), n = screensOf(g).length; disposeTree(g); return n === 0; };
    return SCREEN_IDS.every((id) => one(id, 'free')) && one('tv85', 'wall') && none('copier') && none('charger');
  });
  t('each screen has its own material', () => SCREEN_IDS.every((id) => {
    const a = BY_ID[id].mesh('free'), b = BY_ID[id].mesh('free'), sa = screensOf(a)[0], sb = screensOf(b)[0];
    const ok = sa && sb && sa.material !== sb.material && sa.userData.ownMat === 1; disposeTree(a); disposeTree(b); return ok;
  }));
  t('85 in wall mesh stays inside the panel and the stand depth', () => {
    const d = BY_ID.tv85, g = d.mesh('wall'), s = sizeOf(g); disposeTree(g);
    return Math.abs(s.w - d.w) < 0.05 && Math.abs(s.h - d.h) < 0.05 && s.d < d.wallD && s.minY > -0.02;
  });
  t('desktop screen sits on the monitor, not the tower', () => {
    const d = BY_ID.desktop, g = d.mesh('free'), s = screensOf(g)[0], ok = s && s.position.x < 0; disposeTree(g); return ok;
  });
  t('icons are drawn for the hook and use the brand colours', () => IDS.every((id) => {
    const svg = BY_ID[id].icon || ''; return svg.startsWith('<svg') && (svg.includes(BRAND.colors.highlight) || svg.includes(BRAND.colors.accent));
  }));
  t('desktop sits on a table; the 85 in TV mounts on a wall; the sign stands on the floor', () => {
    const W = room(); const table = newItem('table6'); W.items.push(table); applyPose(W, table, snapPose(W, table, 12, 16));
    const desk = newItem('desktop'); W.items.push(desk); applyPose(W, desk, snapPose(W, desk, table.x, table.z));
    const onTable = desk.mode === 'top' && desk.host === table.uid && desk.y === BY_ID.table6.top && isValid(W, desk);
    const Wv = room(); const tv = newItem('tv85'); Wv.items.push(tv); applyPose(Wv, tv, snapPose(Wv, tv, 15, 0.7));
    const onWall = tv.mode === 'wall' && tv.y === 0 && isValid(Wv, tv);
    const Ws = room(); const sign = newItem('digisign'); Ws.items.push(sign); applyPose(Ws, sign, snapPose(Ws, sign, 8, 0.6));
    const onFloor = sign.mode === 'wallfloor' && sign.y === 0 && isValid(Ws, sign);
    return onTable && onWall && onFloor;
  });
  t('copier and charging locker are valid on the floor', () => {
    const W = room(); const c = newItem('copier'); W.items.push(c); applyPose(W, c, snapPose(W, c, 18, 20));
    const k = newItem('charger'); W.items.push(k); applyPose(W, k, snapPose(W, k, 6, 0.5));
    return c.mode === 'free' && isValid(W, c) && k.mode === 'wallfloor' && isValid(W, k);
  });
  t('buildMesh fallback stays inside the footprint until the meshes.js hook', () => IDS.every((id) => {
    const d = BY_ID[id], g = buildMesh(d, 'free'), s = sizeOf(g), named = screensOf(g).length; disposeTree(g);
    if (named) return Math.abs(s.w - d.w) < 0.05 && Math.abs(s.h - d.h) < 0.05;
    return Math.abs(s.w - d.w) < 0.05 && Math.abs(s.d - d.d) < 0.05 && Math.abs(s.h - d.h) < 0.05;
  }));
  const fail = lines.filter(([, ok]) => !ok).length;
  return { lines, fail };
}

function selftestDoc() {
  try {
    return typeof location !== 'undefined' && /selftest\.html$/i.test(location.pathname) && typeof document !== 'undefined' && !!document.getElementById('sum') && !!document.getElementById('out');
  } catch (e) { return false; }
}

function textDesc(el) {
  let p = el;
  while (p) { const d = Object.getOwnPropertyDescriptor(p, 'textContent'); if (d && d.set && d.get) return d; p = Object.getPrototypeOf(p); }
  return null;
}

function install() {
  const sum = document.getElementById('sum');
  if (!sum || sum.dataset.lane40) return;
  sum.dataset.lane40 = '1';
  const desc = textDesc(sum);
  if (!desc) return;
  Object.defineProperty(sum, 'textContent', {
    configurable: true,
    get() { return desc.get.call(this); },
    set(v) {
      if (this.dataset.lane40done) { desc.set.call(this, v); return; }
      this.dataset.lane40done = '1';
      let extra;
      try { extra = runLane40(); } catch (e) { extra = { lines: [['lane40 checks (' + (e && e.message) + ')', false]], fail: 1 }; }
      const out = document.getElementById('out');
      for (const [n, ok] of extra.lines) { const li = document.createElement('li'); li.className = ok ? 'ok' : 'bad'; li.textContent = (ok ? 'PASS ' : 'FAIL ') + n; out.appendChild(li); }
      const all = String(v).match(/^ALL PASS \((\d+)\)/), some = String(v).match(/^(\d+) FAILED, (\d+) passed/);
      let text = v;
      if (all) { const n = +all[1] + extra.lines.length; text = extra.fail ? `${extra.fail} FAILED, ${n - extra.fail} passed` : `ALL PASS (${n})`; }
      else if (some) { const f = +some[1] + extra.fail, p = +some[2] + extra.lines.length - extra.fail; text = f ? `${f} FAILED, ${p} passed` : `ALL PASS (${p})`; }
      desc.set.call(this, text);
      if (extra.fail) document.title = 'SELFTEST FAIL';
    },
  });
}

// v3.36: wired through src/tests.js (selftest only), no self-install. install() kept for reference.
export const lane40Installer = { selftestDoc, install };
