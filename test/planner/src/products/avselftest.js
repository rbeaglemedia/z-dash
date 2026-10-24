// Audio, camera, and hotspot checks. This file loads with the other product files.
// runAvTests() runs only from the selftest page (#sum). The app has no #sum, so the
// checks do not run at startup.
//
// Shared files were not edited. These lines already exist on master and are what the
// meshes and icons use (not added in this change):
//   src/meshes.js default: if (typeof d.draw === 'function') d.draw(g, d, mode, opt); else box(...)
//   src/icons.js: export const itemIcon = (d) => d.icon || ICON[d.id] || ...
//   src/catalog.js glob skips ./products/*.test.js
// If you would rather call the checks from src/tests.js, add the lines below and delete
// the attach block at the bottom of this file (otherwise each check is listed twice):
//   import { runAvTests } from './products/avselftest.js';
//   for (const row of runAvTests()) R.push(row);
import { Box3 } from 'three';
import { BY_ID } from '../catalog.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { itemIcon } from '../icons.js';
import { BRAND } from '../brand.js';
import { newItem, snapPose, applyPose, isValid } from '../logic.js';
import { presetWalls } from '../walls.js';
import { registeredProducts } from '../register.js';
import { MICSET_IN } from './micset.js';
import { UPLIGHT } from './uplight.js';
import { STAGELIGHT } from './stagelight.js';

const ft = (i) => Math.round((i / 12) * 1000) / 1000;
const near = (a, b, e = 0.001) => Math.abs(a - b) <= e;
const INCH = 1 / 12;
let calls = 0;

function envelope(d) {
  const g = buildMesh(d, 'free');
  const b = new Box3().setFromObject(g);
  const names = [];
  g.traverse((m) => { if (m.name) names.push(m.name); });
  const sz = { x: b.max.x - b.min.x, y: b.max.y - b.min.y, z: b.max.z - b.min.z, minY: b.min.y };
  disposeTree(g);
  return { sz, names };
}

function fills(d) {
  const { sz } = envelope(d);
  return [sz.x - d.w, sz.y - d.h, sz.z - d.d].every((v) => Math.abs(v) < INCH) && sz.minY > -0.02 && sz.minY < 0.04;
}

function room() { return { env: 'indoor', walls: presetWalls('30x40'), items: [] }; }

function place(W, type, x, z) {
  const it = newItem(type);
  W.items.push(it);
  applyPose(W, it, snapPose(W, it, x, z));
  return it;
}

const banned = (s) => /\bRAC\b|\bCAM\b|distro|Xponex|\$|\bprice\b/i.test(s);

export function runAvTests() {
  const atStart = calls === 0;
  calls += 1;
  const R = [];
  const t = (name, fn) => { let ok = false; try { ok = !!fn(); } catch (e) { name += ' (' + e.message + ')'; } R.push(['av: ' + name, ok]); };
  const mixer = BY_ID.mixer, sub = BY_ID.subwoofer, mics = BY_ID.micset, neck = BY_ID.gooseneck, kit = BY_ID.streamkit, hot = BY_ID.hotspot;
  const orders = registeredProducts().filter((p) => p.order >= 50 && p.order <= 59).map((p) => p.order + ':' + p.id);

  t('orders 50-59 are only the new audio, camera, and hotspot items', () => orders.join(',') === '50:mixer,51:subwoofer,52:micset,53:gooseneck,54:streamkit,57:hotspot');
  t('each new item is unconfirmed and stays in an existing category', () => [mixer, sub, mics, neck, kit, hot].every((d) => d && d.unconfirmed && ['audio', 'tvs', 'computers'].includes(d.cat)));

  t('mixer is the X32 Compact candidate and snaps onto a 6 ft table', () => {
    if (!(mixer && mixer.cat === 'audio' && mixer.snapsTo.includes('top') && near(mixer.w, ft(24.84)) && near(mixer.d, ft(20.16)) && near(mixer.h, ft(8.39)) && /front of house/.test(mixer.note))) return false;
    const W = room(); const tbl = place(W, 'table6', 10, 12); const it = place(W, 'mixer', tbl.x, tbl.z);
    return it.mode === 'top' && it.host === tbl.uid && it.y === BY_ID.table6.top && isValid(W, it) && fills(mixer) && envelope(mixer).names.includes('mixerBody');
  });
  t('subwoofer is the EON718S candidate on the floor, not the mixer column size', () => {
    if (!(sub && sub.cat === 'audio' && sub.snapsTo.length === 0 && near(sub.w, ft(24)) && near(sub.d, ft(25.1)) && near(sub.h, ft(26.3)) && !near(sub.h, ft(8.39)))) return false;
    const W = room(); const it = place(W, 'subwoofer', 8, 18);
    return it.mode === 'free' && it.y === 0 && isValid(W, it) && fills(sub) && envelope(sub).names.includes('subCab');
  });
  t('wireless mic set is the zero-gap receiver plus handheld and snaps onto a table', () => {
    const want = { w: 7.76 + 1.46, d: 6.93, h: 1.65 };
    if (!(mics && mics.showOnPlan === 'unconfirmed' && mics.snapsTo.includes('top') && near(MICSET_IN.w, want.w) && near(mics.w, ft(want.w)) && near(mics.d, ft(want.d)) && near(mics.h, ft(want.h)) && /floor plan/.test(mics.note) && mics.flags.some((f) => /Lav and headset/.test(f)))) return false;
    const W = room(); const tbl = place(W, 'table6', 12, 14); const it = place(W, 'micset', tbl.x + 0.4, tbl.z);
    const names = envelope(mics).names;
    return it.mode === 'top' && it.y === BY_ID.table6.top && isValid(W, it) && fills(mics) && names.includes('micReceiver') && names.includes('micHandheld');
  });
  t('podium mic uses the SM58 body only and snaps onto the lectern', () => {
    if (!(neck && neck.showOnPlan === 'unconfirmed' && neck.snapsTo.includes('top') && near(neck.w, ft(1.46)) && near(neck.d, ft(1.46)) && near(neck.h, ft(6.93)) && /Gooseneck length is not in the size sheet/.test(neck.note))) return false;
    const W = room(); const pod = place(W, 'podium', 16, 30); const it = place(W, 'gooseneck', pod.x, pod.z);
    return it.mode === 'top' && it.host === pod.uid && near(it.y, BY_ID.podium.top) && isValid(W, it) && fills(neck) && envelope(neck).names.includes('gooseneckBody');
  });
  t('camera kit is the sheet envelope and stands on the floor', () => {
    if (!(kit && kit.cat === 'tvs' && near(kit.w, ft(7.5)) && near(kit.d, ft(16.5)) && near(kit.h, ft(68.9)) && /Tripod footprint is not confirmed/.test(kit.note))) return false;
    const W = room(); const it = place(W, 'streamkit', 22, 16);
    return it.mode === 'free' && it.y === 0 && isValid(W, it) && fills(kit) && envelope(kit).names.includes('streamBody');
  });
  t('Wi-Fi hotspot is the small tabletop router and is not confirmed for the floor plan', () => {
    if (!(hot && hot.cat === 'computers' && hot.showOnPlan === 'unconfirmed' && hot.snapsTo.includes('top') && near(hot.w, ft(5.78)) && near(hot.d, ft(5.08)) && near(hot.h, ft(1.15)) && hot.h < 0.15 && /floor plan/.test(hot.note))) return false;
    const W = room(); const tbl = place(W, 'table6', 18, 10); const it = place(W, 'hotspot', tbl.x - 1, tbl.z);
    return it.mode === 'top' && it.y === BY_ID.table6.top && isValid(W, it) && fills(hot) && envelope(hot).names.includes('hotspotBody');
  });
  t('uplight and stage light are not registered (stage-deck numbers are not a light)', () => {
    const used = new Set(registeredProducts().map((p) => p.id));
    return !used.has('uplight') && !used.has('stagelight') && !BY_ID.uplight && !BY_ID.stagelight && UPLIGHT.order === 55 && STAGELIGHT.order === 56 && UPLIGHT.registered === false && STAGELIGHT.registered === false && /StageTek/.test(UPLIGHT.reason) && /StageTek/.test(STAGELIGHT.reason) && /rents lighting/.test(UPLIGHT.reason) && /rents lighting/.test(STAGELIGHT.reason) && /96/.test(UPLIGHT.reason);
  });
  t('new icons use Rentacomputer.com colours and copy stays clear of banned words', () => {
    const items = [mixer, sub, mics, neck, kit, hot];
    const text = items.flatMap((d) => [d.name, d.note, ...(d.flags || [])]).join('\n') + UPLIGHT.reason + STAGELIGHT.reason;
    return items.every((d) => { const svg = itemIcon(d); return svg.startsWith('<svg') && (svg.includes(BRAND.colors.highlight) || svg.includes(BRAND.colors.accent)); }) && !banned(text);
  });
  t('checks did not run at startup', () => atStart && calls === 1 && !!document.getElementById('sum'));
  return R;
}

function selftestPage() {
  return typeof document !== 'undefined' && !!document.getElementById('sum') && !!document.getElementById('out');
}

let cached = null;
function attach() {
  if (!selftestPage() || typeof Node === 'undefined') return;
  const sum = document.getElementById('sum');
  const out = document.getElementById('out');
  if (sum.dataset.av) return;
  sum.dataset.av = '1';
  const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  Object.defineProperty(sum, 'textContent', {
    configurable: true,
    get() { return desc.get.call(this); },
    set(v) {
      desc.set.call(this, v);
      if (!/^ALL PASS \(\d+\)$/.test(v) && !/^\d+ FAILED, \d+ passed$/.test(v)) return;
      if (!cached) cached = runAvTests();
      for (const li of [...out.querySelectorAll('li[data-av]')]) li.remove();
      let fail = 0, pass = 0;
      for (const [n, ok] of cached) {
        const li = document.createElement('li');
        li.dataset.av = '1';
        li.className = ok ? 'ok' : 'bad';
        li.textContent = (ok ? 'PASS ' : 'FAIL ') + n;
        out.appendChild(li);
        if (ok) pass++; else fail++;
      }
      const all = /^ALL PASS \((\d+)\)$/.exec(v);
      const some = /^(\d+) FAILED, (\d+) passed$/.exec(v);
      const of = some ? +some[1] : 0;
      const op = all ? +all[1] : (some ? +some[2] : 0);
      const tf = of + fail, tp = op + pass;
      desc.set.call(this, tf ? `${tf} FAILED, ${tp} passed` : `ALL PASS (${tp})`);
      if (document.title.startsWith('SELFTEST')) document.title = tf ? 'SELFTEST FAIL' : 'SELFTEST ALL PASS';
    },
  });
}

// v3.36: wired through src/tests.js (selftest only); the self-attach is removed so checks are not listed twice.
export { attach as avAttach };
