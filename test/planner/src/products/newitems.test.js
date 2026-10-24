import { Box3 } from 'three';
import { BY_ID } from '../catalog.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { itemIcon } from '../icons.js';
import { BRAND } from '../brand.js';
import { newItem, snapPose, applyPose } from '../logic.js';
import { presetWalls } from '../walls.js';
import { BODY_ID, DEFAULT_MOUNT, DROP_IN, PROJ_DEPTH_IN, PROJ_IN, THROW_IN, THROW_MAX_IN, THROW_RATIO_MAX, THROW_RATIO_MIN, VIDEO_SCREEN, ceilingBodyLocal, chooseTablePose, linkedScreenId, placeProjectorBody, throwCheck } from './projscreen.js';

const ft = (i) => Math.round((i / 12) * 1000) / 1000;
const near = (a, b, e = 0.02) => Math.abs(a - b) <= e;

function bounds(d) {
  const g = buildMesh(d, 'free');
  const b = new Box3().setFromObject(g);
  const named = {};
  g.traverse((m) => { if (m.name) (named[m.name] = named[m.name] || []).push(m); });
  const sz = { x: b.max.x - b.min.x, y: b.max.y - b.min.y, z: b.max.z - b.min.z, minY: b.min.y, maxY: b.max.y, minZ: b.min.z, maxZ: b.max.z };
  disposeTree(g);
  return { sz, named, g: null };
}

export function runNewItemTests() {
  const R = [];
  const t = (name, fn) => { let ok = false; try { ok = !!fn(); } catch (e) { name += ' (' + e.message + ')'; } R.push([name, ok]); };

  const badge = BY_ID.badgeprinter, proj = BY_ID.projscreen, charge = BY_ID.chargetable;
  t('badge printer is a tabletop computer item at the Zebra ZC300 candidate size', () => badge && badge.cat === 'computers' && badge.snapsTo.includes('top') && near(badge.w, ft(6.2), 0.001) && near(badge.d, ft(15.1), 0.001) && near(badge.h, ft(10.2), 0.001) && badge.unconfirmed && /UNCONFIRMED brand/.test(badge.note) && /Epson ColorWorks C3500/.test(badge.note) && /18\.4 in deep/.test(badge.note));
  t('badge printer mesh is a generic housing at that size', () => { const { sz, named } = bounds(badge); const brand = Object.keys(named).some((n) => /zebra|epson/i.test(n)); return named.badgeBody && !brand && near(sz.x, badge.w) && near(sz.z, badge.d) && near(sz.y, badge.h) && sz.minY >= -0.02; });
  t('badge printer snaps onto a 6 ft table', () => { const W = { walls: presetWalls('30x40'), items: [] }; const tbl = newItem('table6'); applyPose(W, tbl, snapPose(W, tbl, 10, 10)); W.items.push(tbl); const bp = newItem('badgeprinter'); W.items.push(bp); applyPose(W, bp, snapPose(W, bp, tbl.x, tbl.z)); return bp.mode === 'top' && bp.host === tbl.uid && bp.y === tbl.y + BY_ID.table6.top; });

  t('projector with screen uses the flagged screen, the candidate body, and the minimum throw', () => proj && proj.cat === 'tvs' && proj.snapsTo.includes('wallfloor') && proj.videoScreen === VIDEO_SCREEN && near(proj.w, ft(120), 0.001) && near(proj.h, ft(96), 0.001) && near(proj.d, ft(PROJ_DEPTH_IN), 0.001) && near(THROW_IN, THROW_RATIO_MIN * 120, 0.001) && near(THROW_MAX_IN, THROW_RATIO_MAX * 120, 0.001) && THROW_RATIO_MAX === 2.32 && DEFAULT_MOUNT === 'ceiling' && DROP_IN === 12 && proj.unconfirmed && /UNCONFIRMED model and screen/.test(proj.note) && /videoScreen/.test(proj.note) && /2\.32/.test(proj.note) && /Ceiling is the preselected/.test(proj.note) && /UNCONFIRMED mount height and drop length/.test(proj.note) && /12 in drop/.test(proj.note));
  t('projector hangs from an unconfirmed short drop, in line with the screen', () => {
    const g = buildMesh(proj, 'free');
    let body = null, drop = null, mount = null, rig = null;
    g.traverse((m) => { if (m.name === 'projectorBody') body = m; if (m.name === 'projectorDrop') drop = m; if (m.name === 'projectorMount') mount = m; if (m.name === 'projectorRig') rig = m; });
    const loc = ceilingBodyLocal(proj);
    const ok = rig && body && drop && mount && near(body.position.x, 0) && near(body.position.y, loc.y) && near(body.position.z, loc.z) && body.position.y > PROJ_IN.h / 12 && drop.position.y > body.position.y && mount.position.y > drop.position.y && mount.position.y <= proj.h + 0.001;
    disposeTree(g);
    return ok;
  });
  t('projector screen is a named mesh in front of the screen case and behind the projector', () => {
    const g = buildMesh(proj, 'free');
    let video = null, body = null;
    g.traverse((m) => { if (m.name === VIDEO_SCREEN) video = m; if (m.name === 'projectorBody') body = m; });
    const b = new Box3().setFromObject(g), sz = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z];
    const vw = video && video.geometry.parameters.width, bodyD = body && body.geometry.parameters.depth;
    const lensZ = body ? body.position.z - bodyD / 2 : 0, screenZ = video ? video.position.z + video.geometry.parameters.depth / 2 : 0;
    const gap = lensZ - screenZ;
    disposeTree(g);
    return video && video.isMesh && video.userData.video === 1 && vw > 9 && body && near(gap, THROW_IN / 12) && near(sz[0], proj.w) && near(sz[1], proj.h) && near(sz[2], proj.d);
  });
  t('table mount snaps only the projector body onto a table and leaves the screen', () => {
    const W = { walls: presetWalls('30x40'), items: [] };
    const screen = newItem('projscreen', 15, 10, 0); W.items.push(screen);
    const sx = screen.x, sz = screen.z, sa = screen.a;
    const tbl = newItem('table6'); applyPose(W, tbl, { x: 15, z: 20.39, a: 0, y: 0, host: null, mode: 'free' }); W.items.push(tbl);
    const far = newItem('table6'); applyPose(W, far, { x: 15, z: 36, a: 0, y: 0, host: null, mode: 'free' }); W.items.push(far);
    const good = chooseTablePose(W.items, screen);
    const placed = placeProjectorBody(W, screen);
    const body = W.items.find((o) => o.type === BODY_ID);
    const chk = throwCheck(screen, body);
    const none = chooseTablePose([screen], screen);
    const onlyFar = chooseTablePose([screen, far], screen);
    return good.pose && good.pose.mode === 'top' && good.pose.host === tbl.uid && good.pose.y === BY_ID.table6.top && !good.warning
      && placed.pose && body && body.mode === 'top' && body.host === tbl.uid && body.y === BY_ID.table6.top && linkedScreenId(body) === screen.uid
      && screen.x === sx && screen.z === sz && screen.a === sa && chk.ok && !placed.warning
      && none.pose === null && /table/.test(none.warning)
      && onlyFar.pose && onlyFar.pose.host === far.uid && /Out of throw range/.test(onlyFar.warning) && screen.x === sx;
  });
  t('projector body is a tabletop item the size of the candidate projector', () => {
    const body = BY_ID[BODY_ID];
    const meshOk = bounds(body);
    return body && body.hidden && body.snapsTo.includes('top') && near(body.w, ft(PROJ_IN.w), 0.001) && near(body.d, ft(PROJ_IN.d), 0.001) && near(body.h, ft(PROJ_IN.h), 0.001) && meshOk.named.projectorBody && near(meshOk.sz.x, body.w) && near(meshOk.sz.z, body.d) && near(meshOk.sz.y, body.h);
  });

  t('phone charging table is the hightop candidate size with a square top', () => charge && charge.cat === 'tables' && !charge.round && near(charge.w, ft(23.6), 0.001) && near(charge.d, ft(23.6), 0.001) && near(charge.h, ft(43.3), 0.001) && near(charge.top, charge.h, 0.001) && charge.unconfirmed && /UNCONFIRMED model/.test(charge.note) && /23\.2 × 23\.2 × 43\.3/.test(charge.note) && /round top is not confirmed/.test(charge.note));
  t('phone charging table mesh matches that footprint', () => { const { sz, named } = bounds(charge); return named.chargeTop && near(sz.x, charge.w) && near(sz.z, charge.d) && near(sz.y, charge.h) && sz.minY >= -0.02; });

  t('new product icons use Rentacomputer.com colours', () => [badge, proj, charge].every((d) => { const svg = itemIcon(d); return svg.startsWith('<svg') && (svg.includes(BRAND.colors.highlight) || svg.includes(BRAND.colors.accent)); }));
  t('a shape with no draw still builds', () => { const g = buildMesh({ shape: 'not-a-product', w: 1, d: 1, h: 1 }, 'free'); const b = new Box3().setFromObject(g); disposeTree(g); return near(b.max.x - b.min.x, 1) && near(b.max.y, 1); });
  return R;
}
