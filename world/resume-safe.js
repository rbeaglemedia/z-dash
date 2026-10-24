'use strict';
/* Safe spawn for zdash.world.resume.v1 while PR #79 is still open.
   Kid world only. Does not read or write cars, pets, characters, home, or paint.
   A saved spot is used only when CITY.spotClear says the car can sit there
   (exact match when the map stamp still matches, otherwise the district or
   road anchor). Anything else, including a spot now inside a building, starts
   on the runway at (0, 0) and leaves the challenge list in the save. */
(function (root) {
  const KEY = 'zdash.world.resume.v1';
  const RUNWAY = { x: 0, z: 0, y: 0, how: 'runway' };

  function num(v) {
    const x = +v;
    return Number.isFinite(x) ? x : null;
  }

  function city() {
    if (typeof CITY !== 'undefined' && CITY) return CITY;
    return root.CITY || null;
  }

  function spotClear(x, z, y) {
    const C = city();
    return !!(C && C.spotClear && C.spotClear(x, z, y));
  }

  function stamp() {
    const C = city();
    return C && C.mapStamp ? C.mapStamp() : '';
  }

  function districts() {
    const C = city();
    if (!C) return [];
    if (typeof C.districts === 'function') return C.districts();
    return C.DISTRICTS || [];
  }

  function nodes() {
    const C = city();
    if (!C) return [];
    if (typeof C.nodes === 'function') return C.nodes();
    return (C.ROADS && C.ROADS.nodes) || [];
  }

  function nudge(x, z, y) {
    if (spotClear(x, z, y)) return { x: x, z: z, y: Number.isFinite(+y) ? +y : 0, how: 'anchor' };
    const rings = [10, 22, 36];
    for (let r = 0; r < rings.length; r++) {
      for (let i = 0; i < 8; i++) {
        const ang = i / 8 * Math.PI * 2;
        const sx = x + Math.cos(ang) * rings[r], sz = z + Math.sin(ang) * rings[r];
        if (spotClear(sx, sz, 0)) return { x: sx, z: sz, y: 0, how: 'nudge' };
      }
    }
    return null;
  }

  function fromAnchor(a, y) {
    if (!a) return null;
    if (a.district != null && a.ux != null) {
      const list = districts();
      let d = null;
      for (let i = 0; i < list.length; i++) if (list[i] && list[i].id === a.district) { d = list[i]; break; }
      if (d) {
        const x = d.x0 + (+a.ux) * (d.x1 - d.x0);
        const z = d.z0 + (+a.uz || 0) * (d.z1 - d.z0);
        const s = nudge(x, z, y);
        if (s) return s;
      }
    }
    if (a.road) {
      const ns = nodes();
      let best = null, bd = 1e9;
      for (let i = 0; i < ns.length; i++) {
        const nd = ns[i];
        if (!nd || nd.kind !== a.road.kind) continue;
        const dist = Math.hypot(nd.x - a.road.nx, nd.z - a.road.nz);
        if (dist < bd) { bd = dist; best = nd; }
      }
      if (best && bd < 180) {
        const s = nudge(best.x + (+a.road.ox || 0), best.z + (+a.road.oz || 0), 0);
        if (s) return s;
      }
    }
    return null;
  }

  function resolveSpot(spot, map) {
    if (!spot) return null;
    const x = num(spot.x), z = num(spot.z);
    if (x == null || z == null) return null;
    const y = num(spot.y) || 0;
    const same = !!(map && map === stamp());
    if (same && spotClear(x, z, y)) return { x: x, z: z, y: y, how: 'exact' };
    const via = fromAnchor(spot.anchor, y);
    if (via) return via;
    if (spotClear(x, z, y)) return { x: x, z: z, y: y, how: same ? 'exact' : 'clear' };
    return null;
  }

  function read(store) {
    const box = store || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!box || typeof box.getItem !== 'function') return null;
    let raw = null;
    try { raw = box.getItem(KEY); } catch (e) { return null; }
    if (!raw) return null;
    try {
      const o = JSON.parse(raw);
      if (!o || o.v !== 1 || typeof o !== 'object') return null;
      return o;
    } catch (e) { return null; }
  }

  // Where a saved bag may put the car. Never a blocked coordinate.
  function resolve(bag) {
    if (!bag) return Object.assign({ kept: false }, RUNWAY);
    const pose = resolveSpot(bag.pose, bag.map);
    if (pose) return Object.assign({ kept: true }, pose);
    const list = bag.challenges || [];
    for (let i = 0; i < list.length; i++) {
      const ch = list[i];
      if (ch && ch.home) {
        const home = resolveSpot(ch.home, bag.map);
        if (home) return Object.assign({ kept: true }, home);
      }
    }
    return Object.assign({ kept: false, challenges: list.length }, RUNWAY);
  }

  function apply(P, bag) {
    const spot = resolve(bag);
    if (!P) return spot;
    P.x = spot.x; P.z = spot.z; P.y = spot.y || 0;
    P.v = 0; P.ground = true; P.pitch = 0;
    return spot;
  }

  root.ZD_RESUME = { KEY: KEY, read: read, resolve: resolve, apply: apply, runway: RUNWAY };
})(typeof globalThis !== 'undefined' ? globalThis : this);
