import * as THREE from 'three';
import { registerProduct, registerPanel } from '../register.js';
import { product } from './create.js';
import { BRAND } from '../brand.js';
import { box, cyl, mat } from './geom.js';
import { BY_ID } from '../catalog.js';
import { toLocal, toWorld, newItem, applyPose } from '../logic.js';

// Projector with a screen. The screen mesh is named videoScreen so a later pass can put video on it.
// UNCONFIRMED projector model. missing-products.xlsx uses the Epson Pro L1100U with the standard lens,
// including feet: sheet rounds 23.1 × 19.4 × 8.3 in from the Epson page 23.07 × 19.37 × 8.31 (W × D × H).
// https://epson.com/For-Work/Projectors/Large-Venue/Pro-L1100U-Laser-WUXGA-3LCD-Projector-w-4K-Enhancement-%26-Standard-Lens/p/V11H735020
// Throw ratio for that standard lens is 1.45–2.32. This item uses the minimum, 1.45 × the listed screen width.
// The lens can sit farther back, up to 2.32 × the image width.
// UNCONFIRMED screen. Overall size is the catalog Projector screen, 120 × 24 × 96 in, which product-dims.js
// flags (no confident source). The frame around videoScreen is only so the surface reads as a screen.
// UNCONFIRMED mount height and drop length. Neither number is in the size sheet or on the Epson page.
// The ceiling drawing uses a 12 in drop from the top of this item (the 8 ft screen). That is not a measured ceiling.
export const SCREEN_IN = { w: 120, d: 24, h: 96 };
export const PROJ_IN = { w: 23.1, d: 19.4, h: 8.3 };
export const THROW_RATIO_MIN = 1.45;
export const THROW_RATIO_MAX = 2.32;
export const THROW_IN = THROW_RATIO_MIN * SCREEN_IN.w; // 174 in, minimum for a 120 in wide image
export const THROW_MAX_IN = THROW_RATIO_MAX * SCREEN_IN.w; // 278.4 in
export const PROJ_DEPTH_IN = SCREEN_IN.d + THROW_IN + PROJ_IN.d; // 217.4 in
export const DROP_IN = 12; // UNCONFIRMED placeholder, not a sourced length
export const VIDEO_SCREEN = 'videoScreen';
export const BODY_ID = 'projbody';
export const DEFAULT_MOUNT = 'ceiling';

export const PROJ_NOTE = 'UNCONFIRMED model and screen. Body is the Epson Pro L1100U candidate, 23.1 × 19.4 × 8.3 in. Screen is the catalog Projector screen, 120 × 24 × 96 in, which has no confident source. Throw is the standard-lens minimum, 1.45 × 120 in (that lens also reaches 2.32). The screen surface is named videoScreen. Ceiling is the preselected mount: the body hangs from a short drop in line with the screen. Table places only the projector on a table in the plan and leaves the screen where it is. UNCONFIRMED mount height and drop length (not in the size sheet). The drawing uses a 12 in drop from the top of this item, the 8 ft screen, which is not a measured ceiling.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const projIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="28" rx="1"/><path d="M6 12h12" stroke="${O}"/><path d="M32 4v8" stroke="${T}"/><rect x="24" y="12" width="18" height="8" rx="1"/></svg>`;
const bodyIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="16" width="36" height="16" rx="2"/><path d="M12 24h10" stroke="${O}"/><circle cx="34" cy="24" r="3.5" stroke="${T}"/></svg>`;

const inches = (n) => n / 12;
const clamp = (v, a, b) => (a > b ? (a + b) / 2 : Math.max(a, Math.min(b, v)));

export function ceilingBodyLocal(d) {
  const projD = inches(PROJ_IN.d), projH = inches(PROJ_IN.h);
  return { x: 0, y: d.h - inches(DROP_IN) - projH / 2, z: d.d / 2 - projD / 2 };
}

function addBody(g, projW, projH, projD, x, y, z) {
  const body = mat('projBody', 0x2a3038);
  const lens = mat('projLens', 0x101820);
  const vent = mat('projVent', 0x1a1e24);
  const housing = box(g, projW, projH, projD, body, x, y, z);
  housing.name = 'projectorBody';
  const glass = cyl(g, 0.12, 0.14, 0.1, lens, x, y + projH * 0.08, z - projD / 2 + 0.16, 20);
  glass.rotation.x = Math.PI / 2;
  glass.name = 'projectorLens';
  box(g, projW * 0.55, projH * 0.28, 0.02, vent, x, y, z + projD / 2 - 0.02);
  return housing;
}

export function drawProjector(g, d) {
  const frame = mat('projFrame', 0x1a1e24);
  const cloth = mat('projCloth', 0xd8d5cc);
  const videoMat = mat('videoScreen', 0x1b3a55, { emissive: 0x0e2a44 });
  const foot = mat('projFoot', 0x3a414c);
  const poleMat = mat('projPole', 0x8b939e);
  const screenD = inches(SCREEN_IN.d);
  const projW = inches(PROJ_IN.w), projD = inches(PROJ_IN.d), projH = inches(PROJ_IN.h);
  const zBack = -d.d / 2;
  const zCase = zBack + screenD / 2;

  const post = 0.08;
  for (const s of [-1, 1]) box(g, post, d.h, post, frame, s * (d.w / 2 - post / 2), d.h / 2, zCase);
  box(g, d.w, 0.1, 0.1, frame, 0, d.h - 0.05, zCase);
  box(g, d.w, 0.08, 0.08, frame, 0, 0.5, zCase);
  for (const s of [-1, 1]) box(g, 0.35, 0.06, screenD, foot, s * (d.w / 2 - 0.3), 0.03, zCase);

  const y0 = 0.58, y1 = d.h - 0.12, vh = y1 - y0, vw = d.w - post * 2;
  const face = zBack + screenD;
  box(g, vw, vh, 0.02, cloth, 0, y0 + vh / 2, face - 0.02);
  const video = box(g, vw - 0.04, vh - 0.04, 0.012, videoMat, 0, y0 + vh / 2, face - 0.006);
  video.name = VIDEO_SCREEN;
  video.userData.video = 1;

  // Ceiling mount: a short drop at the throw position, on the screen centerline. The body used to sit on the floor.
  const rig = new THREE.Group();
  rig.name = 'projectorRig';
  const loc = ceilingBodyLocal(d);
  const plate = box(rig, 0.45, 0.04, 0.45, poleMat, loc.x, d.h - 0.02, loc.z);
  plate.name = 'projectorMount';
  const drop = cyl(rig, 0.06, 0.06, inches(DROP_IN), poleMat, loc.x, d.h - inches(DROP_IN) / 2, loc.z, 12);
  drop.name = 'projectorDrop';
  addBody(rig, projW, projH, projD, loc.x, loc.y, loc.z);
  g.add(rig);
}

export function drawProjBody(g, d) {
  addBody(g, d.w, d.h, d.d, 0, d.h / 2, 0);
}

export const PROJ = product(31, 'projscreen', 'tvs', 'Projector with screen', SCREEN_IN.w, PROJ_DEPTH_IN, SCREEN_IN.h, 'projscreen', {
  snapsTo: ['wallfloor'], note: PROJ_NOTE, icon: projIcon(), draw: drawProjector, videoScreen: VIDEO_SCREEN, unconfirmed: true,
});
// Hidden from the add sheet. Table mode places this body on a table; the screen item stays where it is.
export const PROJ_BODY = product(31.5, BODY_ID, 'tvs', 'Projector', PROJ_IN.w, PROJ_IN.d, PROJ_IN.h, BODY_ID, {
  snapsTo: ['top'], note: 'Tabletop projector body for Projector with screen. Same Epson Pro L1100U candidate, 23.1 × 19.4 × 8.3 in. UNCONFIRMED model.', icon: bodyIcon(), draw: drawProjBody, hidden: true, unconfirmed: true,
});
registerProduct(PROJ);
registerProduct(PROJ_BODY);

function faceLocalZ(d) { return -d.d / 2 + inches(SCREEN_IN.d); }

// Distance from the screen face to the lens, along the screen's forward axis, plus the sideways offset.
export function throwCheck(screen, pose) {
  const d = BY_ID[screen.type] || BY_ID.projscreen;
  const projD = (BY_ID[BODY_ID] || { d: inches(PROJ_IN.d) }).d;
  const [fx, fz] = toWorld(screen.x, screen.z, screen.a, 0, faceLocalZ(d));
  const [lx, lz] = toWorld(pose.x, pose.z, pose.a, 0, -projD / 2);
  const dx = lx - fx, dz = lz - fz;
  const fwdX = Math.sin(screen.a), fwdZ = Math.cos(screen.a);
  const rightX = Math.cos(screen.a), rightZ = -Math.sin(screen.a);
  const alongFt = dx * fwdX + dz * fwdZ;
  const lateral = dx * rightX + dz * rightZ;
  const alongIn = alongFt * 12;
  const out = alongIn < THROW_IN - 0.6 || alongIn > THROW_MAX_IN + 0.6;
  const minFt = (THROW_IN / 12).toFixed(1), maxFt = (THROW_MAX_IN / 12).toFixed(1);
  let warning = '';
  if (out) warning = `Out of throw range. The standard lens needs ${minFt}–${maxFt} ft from the screen. This spot is ${alongFt.toFixed(1)} ft.`;
  else if (Math.abs(lateral) > 3) warning = `Off to the side of the screen by ${Math.abs(lateral).toFixed(1)} ft, so the image may miss it.`;
  return { alongIn, lateral, warning, ok: !warning };
}

function fitOnTable(table, hd, me, a, px, pz) {
  let [lx, lz] = toLocal(table.x, table.z, table.a || 0, px, pz);
  const r = a - (table.a || 0);
  const ex = Math.abs(Math.cos(r)) * me.w / 2 + Math.abs(Math.sin(r)) * me.d / 2;
  const ez = Math.abs(Math.sin(r)) * me.w / 2 + Math.abs(Math.cos(r)) * me.d / 2;
  if (hd.round) {
    const lim = hd.w / 2 - Math.hypot(ex, ez);
    if (lim < 0) return null;
    const m = Math.hypot(lx, lz);
    if (m > lim && m > 0) { lx *= lim / m; lz *= lim / m; }
  } else {
    const maxX = hd.w / 2 - ex, maxZ = hd.d / 2 - ez;
    if (maxX < -0.001 || maxZ < -0.001) return null;
    lx = clamp(lx, -maxX, maxX);
    lz = clamp(lz, -maxZ, maxZ);
  }
  const [x, z] = toWorld(table.x, table.z, table.a || 0, lx, lz);
  return { x, z, a, y: hd.top, host: table.uid, mode: 'top' };
}

// Pick a table already in the plan. The screen pose is not changed.
export function chooseTablePose(items, screen) {
  const d = BY_ID.projscreen, me = BY_ID[BODY_ID];
  const zc = d.d / 2 - me.d / 2;
  const [ix, iz] = toWorld(screen.x, screen.z, screen.a, 0, zc);
  let best = null;
  for (const h of items) {
    if (!h || h === screen || h.type === BODY_ID || h.mode === 'top') continue;
    const hd = BY_ID[h.type];
    if (!hd || !hd.top) continue;
    const pose = fitOnTable(h, hd, me, screen.a, ix, iz);
    if (!pose) continue;
    const chk = throwCheck(screen, pose);
    const rank = (chk.ok ? 0 : 1000) + Math.abs(chk.alongIn - THROW_IN) + Math.abs(chk.lateral) * 12;
    if (!best || rank < best.rank) best = { pose, warning: chk.warning, rank };
  }
  if (!best) return { pose: null, warning: 'No table in the plan yet. Add a table and the projector snaps onto it. The screen stays where it is.' };
  return { pose: best.pose, warning: best.warning };
}

export function linkedScreenId(body) {
  if (!body) return null;
  if (body.forScreen) return body.forScreen;
  return body.uid && body.uid.endsWith('~proj') ? body.uid.slice(0, -5) : null;
}

export function placeProjectorBody(world, screen) {
  const choice = chooseTablePose(world.items, screen);
  let body = world.items.find((o) => o.type === BODY_ID && linkedScreenId(o) === screen.uid);
  if (!choice.pose) {
    if (body) world.items = world.items.filter((o) => o !== body);
    return choice;
  }
  if (!body) {
    body = newItem(BODY_ID, choice.pose.x, choice.pose.z, choice.pose.a);
    body.uid = screen.uid + '~proj';
    body.forScreen = screen.uid;
    world.items.push(body);
  }
  applyPose(world, body, choice.pose);
  return choice;
}

const poseKey = (it) => [it.x, it.z, it.a].map((n) => Number(n).toFixed(3)).join(',');

function maintain(ESP) {
  const items = ESP.S.items;
  const keep = items.filter((b) => {
    if (b.type !== BODY_ID) return true;
    const sid = linkedScreenId(b);
    if (!sid) return true;
    const screen = items.find((o) => o.uid === sid && o.type === 'projscreen');
    return !!screen && screen.projMount !== 'ceiling';
  });
  if (keep.length !== items.length) ESP.S.items = keep;
  for (const screen of ESP.S.items) {
    if (screen.type !== 'projscreen') continue;
    const body = ESP.S.items.find((o) => o.type === BODY_ID && linkedScreenId(o) === screen.uid);
    if (body && screen.projMount !== 'ceiling' && screen.projMount !== 'table') screen.projMount = 'table';
    if (screen.projMount !== 'table') { screen.projWarn = screen.projWarn && !body ? screen.projWarn : ''; continue; }
    const draggingBody = !!(ESP.drag && body && ESP.selUid === body.uid);
    const key = poseKey(screen);
    if (!body || screen._projResnap || (screen._projSeen && screen._projSeen !== key && !draggingBody)) {
      screen._projResnap = false;
      const r = placeProjectorBody(ESP.W, screen);
      if (!r.pose) { screen.projMount = 'ceiling'; screen.projWarn = r.warning; }
      else screen.projWarn = r.warning || '';
    } else if (body.mode !== 'top') screen.projWarn = 'Drag the projector onto a table. The screen stays where it is.';
    else screen.projWarn = throwCheck(screen, body).warning || '';
    screen._projSeen = key;
  }
}

function applyRig(ESP) {
  for (const it of ESP.S.items) {
    if (it.type !== 'projscreen') continue;
    const g = ESP.meshes && ESP.meshes.get(it.uid) && ESP.meshes.get(it.uid).g;
    if (!g) continue;
    const table = it.projMount === 'table';
    g.traverse((m) => {
      if (m.name !== 'projectorRig') return;
      m.traverse((c) => {
        c.visible = !table;
        if (table) c.userData.noHit = 1;
        else if (c.userData) delete c.userData.noHit;
      });
    });
  }
}

function currentScreen(ESP) {
  const sel = ESP.selItem && ESP.selItem();
  if (!sel) return null;
  if (sel.type === 'projscreen') return sel;
  if (sel.type === BODY_ID) return ESP.S.items.find((o) => o.uid === linkedScreenId(sel) && o.type === 'projscreen') || null;
  return null;
}

function updateProjUI(ESP) {
  const box = ESP.$('#projMount'), note = ESP.$('#projMountNote');
  if (!box || !note) return;
  const screen = currentScreen(ESP);
  const sel = ESP.selItem && ESP.selItem();
  if (!screen) { box.classList.add('hidden'); note.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  const table = screen.projMount === 'table';
  for (const b of box.querySelectorAll('button')) {
    const on = b.dataset.mount === (table ? 'table' : 'ceiling');
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', on ? 'true' : 'false');
  }
  if (sel && sel.type === BODY_ID) ESP.$('#selName').textContent = 'Projector on table';
  const warn = screen.projWarn || '';
  note.textContent = warn || (table ? 'Screen stays here. The projector is on the table.' : 'Hanging on a short drop. Mount height and drop length are UNCONFIRMED.');
  note.classList.remove('hidden');
  note.classList.toggle('warn', !!warn);
}

function setMount(ESP, screen, mode) {
  if (mode !== 'table') {
    screen.projMount = 'ceiling';
    screen.projWarn = '';
    screen._projResnap = false;
  } else {
    const preview = chooseTablePose(ESP.S.items.filter((o) => linkedScreenId(o) !== screen.uid), screen);
    if (!preview.pose) {
      screen.projMount = 'ceiling';
      screen.projWarn = preview.warning;
      ESP.toast(preview.warning);
      updateProjUI(ESP);
      return;
    }
    screen.projMount = 'table';
    screen._projResnap = true;
  }
  ESP.syncItems();
  ESP.save();
  if (screen.projWarn && mode === 'table') ESP.toast(screen.projWarn);
  if (ESP.S.items.includes(screen) && ESP.selUid !== screen.uid) ESP.select(screen);
  else updateProjUI(ESP);
  ESP.frame();
}

export function installProjMount(ESP) {
  if (!ESP || ESP._projMount || typeof document === 'undefined') return;
  ESP._projMount = 1;
  const style = document.createElement('style');
  style.id = 'projMountStyle';
  style.textContent = '#projMount{display:flex;border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);border-radius:10px;overflow:hidden}#projMount button{flex:1;min-height:44px;border:0;background:transparent;color:inherit;font:inherit;font-weight:650}#projMount button+button{border-left:1px solid color-mix(in srgb,var(--accent) 45%,transparent)}#projMount button.on{background:var(--accent);color:var(--on-action)}#projMountNote{margin:0;font-size:12px;line-height:1.35;color:var(--muted)}#projMountNote.warn{color:var(--hl)}';
  document.head.appendChild(style);
  const bar = ESP.$('#selBar');
  const mount = document.createElement('div');
  mount.id = 'projMount';
  mount.className = 'projmount hidden';
  mount.setAttribute('role', 'radiogroup');
  mount.setAttribute('aria-label', 'Projector mount');
  mount.innerHTML = '<button type="button" role="radio" data-mount="ceiling" aria-checked="true" class="on">Ceiling</button><button type="button" role="radio" data-mount="table" aria-checked="false">Table</button>';
  const note = document.createElement('p');
  note.id = 'projMountNote';
  note.className = 'projnote hidden';
  const btns = bar && bar.querySelector('.selbtns');
  if (bar && btns) { bar.insertBefore(mount, btns); bar.insertBefore(note, btns); }
  mount.querySelector('[data-mount=ceiling]').onclick = () => { const s = currentScreen(ESP); if (s) setMount(ESP, s, 'ceiling'); };
  mount.querySelector('[data-mount=table]').onclick = () => { const s = currentScreen(ESP); if (s) setMount(ESP, s, 'table'); };
  const origSync = ESP.syncItems;
  const wrappedSync = function syncItems() {
    maintain(ESP);
    const r = origSync.apply(this, arguments);
    applyRig(ESP);
    updateProjUI(ESP);
    return r;
  };
  ESP.syncItems = wrappedSync;
  const origShow = ESP.showProducts;
  const wrappedShow = function showProducts() {
    const r = origShow.apply(this, arguments);
    const btn = document.querySelector('.prod[data-id="' + BODY_ID + '"]');
    if (btn) btn.remove();
    return r;
  };
  ESP.showProducts = wrappedShow;
  // expose.js copies these onto window.__esp before panels mount.
  if (window.__esp) { window.__esp.syncItems = wrappedSync; window.__esp.showProducts = wrappedShow; }
  const del = ESP.$('#btnDel');
  if (del) {
    const prev = del.onclick;
    del.onclick = () => {
      const e = ESP.selItem();
      if (e && e.type === BODY_ID) {
        const screen = ESP.S.items.find((o) => o.uid === linkedScreenId(e) && o.type === 'projscreen');
        if (screen) { setMount(ESP, screen, 'ceiling'); return; }
      }
      if (prev) prev();
    };
  }
}

registerPanel({ id: 'proj-mount', order: 80, mount: installProjMount });
