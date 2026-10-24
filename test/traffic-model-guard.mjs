#!/usr/bin/env node
/**
 * Fails if Neon World traffic builds from anything other than the player's 370Z.
 * The player and the Garage load shared/assets/370z-glb.js (ZD_EMBED file assets/370z.glb).
 * shared/assets/traffic/* are other cars. Traffic must clone ZD.Xray.car and refuse a mismatch.
 *
 *   node test/traffic-model-guard.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = [];
function check(ok, msg) { if (!ok) fail.push(msg); }

function glbJson(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/"((?:Z2xURg)[^"]+)"/);
  if (!m) throw new Error('no GLB payload in ' + file);
  const raw = Buffer.from(m[1], 'base64');
  if (raw.slice(0, 4).toString() !== 'glTF') throw new Error('not a GLB: ' + file);
  let off = 12;
  while (off + 8 <= raw.length) {
    const len = raw.readUInt32LE(off);
    const type = raw.readUInt32LE(off + 4);
    off += 8;
    const chunk = raw.slice(off, off + len);
    off += len;
    if (type === 0x4E4F534A) return JSON.parse(chunk.toString('utf8').replace(/\0+$/, ''));
  }
  throw new Error('no JSON chunk in ' + file);
}

function counts(js) {
  let meshes = 0, tris = 0;
  const acc = js.accessors || [];
  for (const mesh of js.meshes || []) {
    meshes++;
    for (const prim of mesh.primitives || []) {
      if ((prim.mode == null ? 4 : prim.mode) !== 4) continue;
      if (prim.indices != null) tris += (acc[prim.indices].count / 3) | 0;
      else if (prim.attributes && prim.attributes.POSITION != null) tris += (acc[prim.attributes.POSITION].count / 3) | 0;
    }
  }
  const mats = {};
  for (const mat of js.materials || []) mats[mat.name || ''] = (mats[mat.name || ''] || 0) + 1;
  return { meshes, tris, mats, generator: (js.asset && js.asset.generator) || '' };
}

const zPath = path.join(root, 'shared/assets/370z-glb.js');
const z = counts(glbJson(zPath));
check(z.meshes === 369, '370Z mesh count is ' + z.meshes + ', expected 369');
check(z.tris === 26549, '370Z triangle count is ' + z.tris + ', expected 26549');
check(z.mats.BODY > 0 && z.mats.TYRE > 0, '370Z GLB is missing BODY or TYRE');
check(/Sketchfab/.test(z.generator), '370Z generator is ' + z.generator);

const embed = fs.readFileSync(path.join(root, 'shared/zd-embed.js'), 'utf8');
check(/"file": "assets\/370z\.glb"/.test(embed), 'zd-embed.js does not point the player at assets/370z.glb');
check(/glb:\s*window\.ZD_ASSET_GLB/.test(embed), 'zd-embed.js does not load ZD_ASSET_GLB');
check(/traffic:\s*window\.ZD_ASSET_TRAFFIC/.test(embed), 'zd-embed.js lost the separate traffic table');

const world = fs.readFileSync(path.join(root, 'world.html'), 'utf8');
const zAt = world.indexOf('shared/assets/370z-glb.js');
const eAt = world.indexOf('shared/zd-embed.js');
check(zAt > 0 && eAt > zAt, 'world.html must load 370z-glb.js before zd-embed.js');

const traffic = fs.readFileSync(path.join(root, 'world/traffic.js'), 'utf8');
check(/X\.car\.clone\(true\)/.test(traffic), 'traffic does not clone the player car');
check(/assertPlayerZ\(/.test(traffic), 'traffic has no player-Z guard');
check(/traffic source is not the player GLB/.test(traffic), 'traffic guard message missing');
check(/370z\.glb/.test(traffic), 'traffic guard does not require assets/370z.glb');
check(!/loadTraffic\s*\(/.test(traffic), 'traffic calls loadTraffic (Kenney / generic cars)');
check(!/ZD_ASSET_TRAFFIC/.test(traffic), 'traffic reads ZD_ASSET_TRAFFIC');
check(!/assets\/traffic\//.test(traffic), 'traffic path points at shared/assets/traffic');
check(!/renderTraffic\s*\(/.test(traffic), 'traffic draws through renderTraffic');
check(!/WANTED|wTraffic|wKnock|wFlip|bumpTraffic|bumpKeep|bumpYaw/.test(traffic), 'traffic.js still cites a WANTED ram or roll');
const tune = fs.readFileSync(path.join(root, 'shared/traffic-tune.js'), 'utf8');
check(!/WANTED|wTraffic|wKnock|bumpTraffic|bumpKeep|ZTR\.|jr\.html/.test(tune), 'traffic-tune.js still cites WANTED');
check(/speedMin:\s*10/.test(tune) && /speedMax:\s*15/.test(tune), 'pace is not the Neon World 10–15 m/s band');

const sedan = counts(glbJson(path.join(root, 'shared/assets/traffic/sedan.js')));
check(sedan.meshes !== z.meshes && sedan.tris !== z.tris, 'sedan GLB unexpectedly matches the 370Z');
check(sedan.meshes < 20, 'sedan mesh count ' + sedan.meshes + ' is not the small traffic set');

if (fail.length) {
  console.error('traffic model guard FAIL');
  fail.forEach((m) => console.error('- ' + m));
  process.exit(1);
}
console.log('traffic model guard PASS');
console.log('player Z: shared/assets/370z-glb.js  ' + z.meshes + ' meshes  ' + z.tris + ' tris  ' + z.generator);
console.log('traffic: clones ZD.Xray.car from that file; refuses any other source');
