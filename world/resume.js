'use strict';
/* Neon World resume. Kid app only.
   Saves Ellie's spot, car/foot state, NOS bottle, and in-progress challenges
   to localStorage 'zdash.world.resume.v1'. Never reads or writes cars, pets,
   characters, home, or paint (zdash.kid.v1, zdash.char.v1, zdash.pet.v1,
   zdash.house.v1, zdash.neonpaint.v1, and the other profile keys).
   Position is an absolute spot plus a district/road anchor. If the city
   layout changes and that spot is blocked, she gets a safe spawn and the
   challenge record stays. Writes are throttled (no per-frame storage). */
(function (root) {
  const KEY = 'zdash.world.resume.v1';
  const GAP = 2.5;

  function n(v, d) {
    const x = +v;
    if (!Number.isFinite(x)) return 0;
    const p = Math.pow(10, d == null ? 2 : d);
    return Math.round(x * p) / p;
  }

  function create(env) {
    const city = env.city || {};
    const live = env.live || {};
    const store = env.storage;
    let loaded = null;
    let applied = false;
    let armed = false;
    let acc = 0;
    let lastJson = '';
    let extras = [];
    let lastBag = null;

    function stamp() { return city.mapStamp ? city.mapStamp() : ''; }
    function spotClear(x, z, y) { return !!(city.spotClear && city.spotClear(x, z, y)); }
    function districts() { return city.districts ? city.districts() : []; }
    function nodes() { return city.nodes ? city.nodes() : []; }
    function objectives() { return root.ZOBJ || env.objectives || []; }

    function anchorOf(x, z) {
      const a = { x: n(x), z: n(z) };
      const list = districts();
      for (let i = 0; i < list.length; i++) {
        const d = list[i];
        if (!d || x < d.x0 || x > d.x1 || z < d.z0 || z > d.z1) continue;
        a.district = d.id;
        a.ux = n((x - d.x0) / Math.max(1, d.x1 - d.x0), 4);
        a.uz = n((z - d.z0) / Math.max(1, d.z1 - d.z0), 4);
        break;
      }
      const ns = nodes();
      let best = null, bd = 1e9;
      for (let i = 0; i < ns.length; i++) {
        const nd = ns[i];
        if (!nd || nd.kind === 'tunnel' || nd.kind === 'track') continue;
        const dist = (nd.x - x) * (nd.x - x) + (nd.z - z) * (nd.z - z);
        if (dist < bd) { bd = dist; best = nd; }
      }
      if (best && bd <= 80 * 80) {
        a.road = { kind: best.kind || 'street', ox: n(x - best.x), oz: n(z - best.z), nx: n(best.x), nz: n(best.z) };
      }
      return a;
    }

    function snapClear(x, z, y) {
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

    function resolveAnchor(a, y) {
      if (!a) return null;
      if (a.district && a.ux != null) {
        const d = districts().filter(function (q) { return q && q.id === a.district; })[0];
        if (d) {
          const x = d.x0 + a.ux * (d.x1 - d.x0);
          const z = d.z0 + a.uz * (d.z1 - d.z0);
          const s = snapClear(x, z, y);
          if (s) return s;
        }
      }
      if (a.road) {
        let best = null, bd = 1e9;
        const ns = nodes();
        for (let i = 0; i < ns.length; i++) {
          const nd = ns[i];
          if (!nd || nd.kind !== a.road.kind) continue;
          const dist = Math.hypot(nd.x - a.road.nx, nd.z - a.road.nz);
          if (dist < bd) { bd = dist; best = nd; }
        }
        if (best && bd < 180) {
          const s = snapClear(best.x + (+a.road.ox || 0), best.z + (+a.road.oz || 0), 0);
          if (s) return { x: s.x, z: s.z, y: s.y, how: s.how === 'anchor' ? 'road' : s.how };
        }
      }
      return null;
    }

    function resolveSaved(spot, map) {
      if (!spot || !Number.isFinite(+spot.x) || !Number.isFinite(+spot.z)) return null;
      const same = !!(map && map === stamp());
      const y = +spot.y || 0;
      if (same && spotClear(+spot.x, +spot.z, y)) return { x: +spot.x, z: +spot.z, y: y, how: 'exact' };
      const via = resolveAnchor(spot.anchor, y);
      if (via) return via;
      if (spotClear(+spot.x, +spot.z, y)) return { x: +spot.x, z: +spot.z, y: y, how: same ? 'exact' : 'clear' };
      return null;
    }

    function placeOf(bag) {
      const list = bag && bag.challenges || [];
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c && c.needsPlace && +c.tLeft > 0 && !c._unplaced) return c;
      }
      return null;
    }

    function readPacks() {
      const out = [];
      const objs = objectives();
      for (let i = 0; i < objs.length; i++) {
        const o = objs[i];
        if (!o || typeof o.pack !== 'function') continue;
        const p = o.pack();
        if (p) out.push(p);
      }
      return out;
    }

    function prevOf(id) {
      const bags = [lastBag, loaded];
      for (let b = 0; b < bags.length; b++) {
        const list = bags[b] && bags[b].challenges;
        if (!list) continue;
        for (let i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
      }
      return null;
    }

    function homeNow() {
      const pose = live.readPose ? live.readPose() : null;
      if (!pose) return null;
      return {
        x: n(pose.x), y: n(pose.y), z: n(pose.z), yaw: n(pose.yaw, 3),
        mode: pose.mode || 'car', wings: pose.wings ? 1 : 0,
        driveMode: pose.driveMode === 'street' ? 'street' : 'arcade',
        v: n(pose.v), ground: !!pose.ground, pitch: n(pose.pitch, 3),
        foot: pose.foot || null, inside: pose.inside || null,
        anchor: anchorOf(pose.x, pose.z)
      };
    }

    function stampChallenge(p) {
      const prev = prevOf(p.id);
      const row = {
        id: p.id, name: p.name || 'Challenge', needsPlace: !!p.needsPlace, active: !!p.active,
        x: n(p.x), y: n(p.y), z: n(p.z), r: p.r || 16,
        tLeft: n(p.tLeft, 2), maxT: p.maxT || 25, overchargeT: n(p.overchargeT, 2),
        claimed: p.claimed || 0, spawned: p.spawned || 0, hold: !!p.hold,
        anchor: anchorOf(p.x, p.z)
      };
      if (p.hold && prev && prev.home) row.home = prev.home;
      else if (p.needsPlace && !p.hold) row.home = homeNow();
      else if (prev && prev.home) row.home = prev.home;
      return row;
    }

    function capture() {
      const pose0 = live.readPose ? live.readPose() : { x: 0, y: 0, z: 0, mode: 'car' };
      const pose = Object.assign({}, pose0, { anchor: anchorOf(pose0.x || 0, pose0.z || 0) });
      const nos = live.readNos ? live.readNos() : { tank: 1, left: 0, hotDropNosT: 0 };
      const challenges = [];
      const seen = {};
      const packs = readPacks();
      for (let i = 0; i < packs.length; i++) {
        const row = stampChallenge(packs[i]);
        seen[row.id] = 1;
        challenges.push(row);
      }
      for (let i = 0; i < extras.length; i++) {
        if (extras[i] && !seen[extras[i].id]) challenges.push(extras[i]);
      }
      return { v: 1, map: stamp(), pose: pose, nos: nos, challenges: challenges };
    }

    function worth(bag) {
      if (bag.challenges && bag.challenges.length) return true;
      const nos = bag.nos || {};
      if (+nos.tank < 0.98 || +nos.hotDropNosT > 0.2 || +nos.left > 0.05) return true;
      const p = bag.pose || {};
      if (p.mode && p.mode !== 'car') return true;
      if ((+p.y || 0) > 3 || (+p.v || 0) > 1) return true;
      if (Math.hypot(+p.x || 0, +p.z || 0) > 8) return true;
      return false;
    }

    function write(bag) {
      if (!store || typeof store.setItem !== 'function') return false;
      let json = '';
      try { json = JSON.stringify(bag); } catch (e) { return false; }
      if (json === lastJson) return false;
      lastJson = json;
      lastBag = bag;
      loaded = bag;
      try { store.setItem(KEY, json); return true; } catch (e) { return false; }
    }

    function clearStore() {
      lastJson = '';
      if (store && typeof store.removeItem === 'function') {
        try { store.removeItem(KEY); } catch (e) {}
      }
    }

    function flush() {
      if (!armed) return false;
      const bag = capture();
      if (!worth(bag)) {
        if (lastJson) clearStore();
        return false;
      }
      return write(bag);
    }

    function tick(dt) {
      if (!armed) return;
      if (env.paused && env.paused()) return;
      acc += +dt || 0;
      if (acc < (env.interval || GAP)) return;
      acc = 0;
      flush();
    }

    function readStore() {
      if (!store || typeof store.getItem !== 'function') return null;
      let raw = null;
      try { raw = store.getItem(KEY); } catch (e) { return null; }
      if (!raw) return null;
      try {
        const o = JSON.parse(raw);
        if (!o || o.v !== 1 || typeof o !== 'object' || Array.isArray(o)) return null;
        if (o.pose && typeof o.pose !== 'object') return null;
        return o;
      } catch (e) { return null; }
    }

    function resumeWhere(bag, ch) {
      const map = bag && bag.map;
      if (ch && ch.home) {
        const home = resolveSaved(ch.home, map);
        if (home) return home;
      }
      if (bag && bag.pose) {
        const pose = resolveSaved(bag.pose, map);
        if (pose) return pose;
      }
      if (ch) return resolveSaved({ x: ch.x, y: 0, z: +ch.z + 36, anchor: ch.anchor }, map) || resolveSaved(ch, map);
      return null;
    }

    function objFor(id) {
      const objs = objectives();
      for (let i = 0; i < objs.length; i++) if (objs[i] && objs[i].id === id && typeof objs[i].apply === 'function') return objs[i];
      return null;
    }

    function applyOne(ch, map, hold) {
      if (!ch) return false;
      const obj = objFor(ch.id);
      const apply = obj ? function (pack, opt) { obj.apply(pack, opt); } : (live.applyChallenge || function () {});
      if (!ch.needsPlace) { apply(ch, { hold: false }); return true; }
      const at = resolveSaved({ x: ch.x, y: ch.y, z: ch.z, anchor: ch.anchor }, map);
      if (!at) {
        const kept = Object.assign({}, ch, { _unplaced: true });
        extras = extras.filter(function (e) { return e.id !== ch.id; }).concat([kept]);
        apply(ch, { unplaced: true });
        return false;
      }
      extras = extras.filter(function (e) { return e.id !== ch.id; });
      apply(ch, { hold: !!hold, x: at.x, z: at.z, y: at.y || 0 });
      return true;
    }

    function applyBag(bag, holdPlaces) {
      if (!bag) return;
      extras = [];
      const list = bag.challenges || [];
      for (let i = 0; i < list.length; i++) applyOne(list[i], bag.map, !!(holdPlaces && list[i] && list[i].needsPlace));
    }

    function promptFor(ch) {
      const secs = Math.max(1, Math.ceil(+ch.tLeft || 0));
      return {
        kicker: 'CHALLENGE WAITING',
        title: (ch.name || 'Challenge') + ' · ' + secs + 's left',
        sub: 'Other starts keep it. Resume goes back.'
      };
    }

    function preview() {
      const bag = loaded;
      const empty = { continue: false, resume: false, far: false, cityMoved: false, prompt: null, challenge: null };
      if (!bag) return empty;
      const ch = placeOf(bag);
      const poseAt = bag.pose ? resolveSaved(bag.pose, bag.map) : null;
      const resumeAt = ch ? resumeWhere(bag, ch) : null;
      const far = !!(poseAt && resumeAt && Math.hypot(poseAt.x - resumeAt.x, poseAt.z - resumeAt.z) > 70);
      const cityMoved = (!!bag.pose && !poseAt) || (!!ch && !resumeAt);
      let prompt = null;
      if (ch && resumeAt) prompt = promptFor(ch);
      else if (cityMoved && ((ch) || (bag.challenges && bag.challenges.length))) {
        prompt = {
          kicker: 'CITY CHANGED',
          title: (ch && ch.name) || 'Challenges kept',
          sub: 'That spot moved. Safe start. Your challenge is still saved.'
        };
      }
      return {
        continue: !!poseAt && (!resumeAt || far),
        resume: !!resumeAt,
        far: far,
        cityMoved: cityMoved,
        prompt: prompt,
        challenge: ch
      };
    }

    function beginContinue() {
      const bag = loaded;
      if (live.safeSpawn) live.safeSpawn();
      if (bag) applyBag(bag, false);
      const where = bag && bag.pose ? resolveSaved(bag.pose, bag.map) : null;
      let how = 'safe';
      if (where && bag && live.applyPose) { live.applyPose(bag.pose, where); how = where.how; }
      else if (live.toast) live.toast('CITY CHANGED · SAFE START · CHALLENGES KEPT');
      if (bag && bag.nos && live.applyNos) live.applyNos(bag.nos);
      applied = true;
      armed = true;
      const ch = placeOf(bag);
      const back = ch ? resumeWhere(bag, ch) : null;
      const here = where || { x: 0, z: 0 };
      const far = !!(back && Math.hypot(here.x - back.x, here.z - back.z) > 70);
      if (ch && live.setHold) live.setHold(ch.id, far);
      flush();
      return { ok: !!where, how: how, showPrompt: far, prompt: far && ch ? promptFor(ch) : null };
    }

    function beginResume() {
      const bag = loaded || lastBag;
      const ch = placeOf(bag);
      if (live.safeSpawn) live.safeSpawn();
      if (bag) applyBag(bag, false);
      const where = resumeWhere(bag, ch);
      if (!where) {
        if (live.toast) live.toast('CITY CHANGED · SAFE START · CHALLENGES KEPT');
        if (bag && bag.nos && live.applyNos) live.applyNos(bag.nos);
        applied = true;
        armed = true;
        flush();
        return { ok: false, how: 'safe', showPrompt: false, prompt: null };
      }
      const pose = (ch && ch.home) || (bag && bag.pose) || {};
      if (live.applyPose) live.applyPose(pose, where);
      if (bag && bag.nos && live.applyNos) live.applyNos(bag.nos);
      if (ch && live.setHold) live.setHold(ch.id, false);
      applied = true;
      armed = true;
      flush();
      return { ok: true, how: where.how, showPrompt: false, prompt: null };
    }

    function beginAside() {
      const bag = loaded;
      if (!applied && bag) applyBag(bag, true);
      applied = true;
      if (live.parkFeet) live.parkFeet();
      const savedCh = placeOf(bag) || placeOf(lastBag);
      const packs = readPacks();
      let liveCh = null;
      for (let i = 0; i < packs.length; i++) if (packs[i] && packs[i].needsPlace && +packs[i].tLeft > 0) { liveCh = packs[i]; break; }
      const ch = liveCh || savedCh;
      let far = false;
      if (ch && ch.needsPlace) {
        const here = live.readPose ? live.readPose() : { x: 0, z: 0 };
        const homeSpot = savedCh && savedCh.home ? resolveSaved(savedCh.home, (bag || lastBag || {}).map) : null;
        const back = homeSpot || { x: +ch.x || 0, z: +ch.z || 0 };
        far = Math.hypot((+here.x || 0) - back.x, (+here.z || 0) - back.z) > 70;
        if (live.setHold) live.setHold(ch.id, far);
      }
      armed = true;
      return { ok: true, showPrompt: !!(ch && ch.needsPlace && far), prompt: (ch && far) ? promptFor(ch) : null, challenge: ch || null };
    }

    loaded = readStore();
    lastBag = loaded;
    if (loaded) lastJson = '';
    try { if (loaded) lastJson = JSON.stringify(loaded); } catch (e) { lastJson = ''; }

    return {
      key: KEY,
      preview: preview,
      beginContinue: beginContinue,
      beginResume: beginResume,
      beginAside: beginAside,
      tick: tick,
      flush: flush,
      anchorOf: anchorOf,
      resolveSaved: resolveSaved,
      bag: function () { return loaded; }
    };
  }

  root.ZD_RESUME = { KEY: KEY, create: create };

  if (typeof document === 'undefined' || typeof CITY === 'undefined') return;

  function browserSpot(x, z, y) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
    if (!CITY || !CITY.probe || !CITY.surfaceAt) return false;
    const pad = 80;
    if (x < CITY.XS0 - pad || x > CITY.XS1 + pad || z < CITY.ZS0 - pad || z > CITY.ZS1 + pad) return false;
    let surf = 'grass';
    try { surf = CITY.surfaceAt(x, z); } catch (e) { return false; }
    if (surf === 'water') return false;
    const yy = Number.isFinite(y) ? y : 0;
    const top = Math.max(yy, 0.4);
    const bot = yy > 3 ? yy - 0.8 : 0;
    let pr = null;
    try { pr = CITY.probe(x, z, top, bot); } catch (e) { return false; }
    if (pr && pr.wl) return false;
    return true;
  }

  function parkFeet() {
    const W = root.WALK_MODE;
    if (!W) return;
    W.onFoot = false;
    W.insideBuilding = false;
    W.insideDoor = null;
    W.dancing = false;
    W.runMode = false;
    W.vx = 0;
    W.vz = 0;
    W.speed = 0;
    try { if (typeof walkHideInterior === 'function') walkHideInterior(); } catch (e) {}
    try { if (typeof syncOnFootButtons === 'function') syncOnFootButtons(); } catch (e) {}
  }

  function findDoor(inside) {
    if (!inside || !inside.purpose || !CITY || !CITY.BL) return null;
    let best = null, bd = 30;
    for (let i = 0; i < CITY.BL.length; i++) {
      const b = CITY.BL[i];
      if (!b || !b.doors || b.purpose !== inside.purpose) continue;
      for (let d = 0; d < b.doors.length; d++) {
        const door = b.doors[d];
        const dist = Math.hypot(door[0] - (+inside.doorX || 0), door[1] - (+inside.doorZ || 0));
        if (dist >= bd) continue;
        bd = dist;
        const nx = door[2] || 0, nz = door[3] || 0;
        best = {
          x: door[0], z: door[1], nx: nx, nz: nz, dist: dist, y: 0, buildingId: b.id,
          standX: door[0] + nx * 1.2, standZ: door[1] + nz * 1.2,
          purpose: b.purpose, purposeLabel: b.purposeLabel || b.purpose,
          actionLabel: b.purposeLabel || '', color: b.c || '#3ee6ff', top: b.top || 0, cx: b.cx, cz: b.cz
        };
      }
    }
    return best;
  }

  function restoreInside(inside) {
    const door = findDoor(inside);
    const W = root.WALK_MODE;
    if (!door || !W || typeof P === 'undefined') return false;
    W.onFoot = true;
    W.x = door.standX;
    W.z = door.standZ;
    W.y = 0;
    W.yaw = Math.atan2(door.nx || 0, door.nz || 1);
    W.insideBuilding = true;
    W.insideDoor = door;
    W.door = door;
    W.room = {
      x: +inside.roomX || 0, z: inside.roomZ != null ? +inside.roomZ : 2.45,
      yaw: inside.roomYaw != null ? +inside.roomYaw : Math.PI,
      petX: 1.1, petZ: 2.15, tx: null, tz: null
    };
    P.x = door.standX;
    P.z = door.standZ;
    P.y = 0;
    P.v = 0;
    P.ground = true;
    P.driveMode = 'street';
    try { if (typeof setDriveMode === 'function') setDriveMode('street', true); } catch (e) {}
    try { if (typeof walkShowInterior === 'function') walkShowInterior(door); } catch (e) {}
    try { if (typeof syncOnFootButtons === 'function') syncOnFootButtons(); } catch (e) {}
    return true;
  }

  function readPose() {
    const W = root.WALK_MODE;
    const onFoot = !!(W && W.onFoot);
    const inside = !!(onFoot && W.insideBuilding);
    const x = onFoot ? +W.x : +P.x;
    const z = onFoot ? +W.z : +P.z;
    const y = onFoot ? (+W.y || 0) : (+P.y || 0);
    return {
      x: n(x), y: n(y), z: n(z),
      yaw: n(onFoot ? W.yaw : P.yaw, 3),
      pitch: n(P.pitch, 3), bank: n(P.bank, 3),
      v: n(P.v), vs: n(P.vs),
      ground: !!P.ground, wings: P.wings ? 1 : 0,
      driveMode: P.driveMode === 'street' ? 'street' : 'arcade',
      hd: n(P.hd, 3),
      mode: inside ? 'inside' : onFoot ? 'foot' : 'car',
      foot: onFoot ? { x: n(W.x), y: n(W.y || 0), z: n(W.z), yaw: n(W.yaw, 3), run: !!W.runMode } : null,
      inside: inside && W.insideDoor ? {
        purpose: W.insideDoor.purpose || '',
        doorX: n(W.insideDoor.x), doorZ: n(W.insideDoor.z),
        roomX: n(W.room && W.room.x), roomZ: n(W.room && W.room.z),
        roomYaw: n(W.room && W.room.yaw, 3)
      } : null
    };
  }

  function applyPose(pose, where) {
    const keepY = where.how === 'exact' || where.how === 'clear';
    const y = keepY ? (+pose.y || where.y || 0) : (where.y || 0);
    P.x = where.x;
    P.z = where.z;
    P.y = y;
    P.yaw = +pose.yaw || 0;
    P.hd = P.yaw;
    P.pitch = keepY ? (+pose.pitch || 0) : 0;
    P.bank = 0;
    P.v = keepY ? (+pose.v || 0) : 0;
    P.vs = y > 2 ? (+pose.vs || 0) : 0;
    P.ground = y < 2;
    P.gam = P.ground ? 0 : (P.pitch || 0);
    P._lv = P.v;
    P._ly = P.y;
    P.fromSkyDrop = false;
    const street = pose.driveMode === 'street' || pose.mode === 'foot' || pose.mode === 'inside';
    P.driveMode = street ? 'street' : 'arcade';
    try { if (typeof setDriveMode === 'function') setDriveMode(P.driveMode, true); } catch (e) {}
    try { if (typeof setWings === 'function') setWings(pose.wings ? 1 : 0, true); } catch (e) {}
    parkFeet();
    if (pose.mode === 'inside' && pose.inside && restoreInside(pose.inside)) return;
    if ((pose.mode === 'foot' || pose.mode === 'inside') && root.WALK_MODE) {
      const W = root.WALK_MODE;
      const fx = pose.foot && pose.foot.x != null ? +pose.foot.x : where.x;
      const fz = pose.foot && pose.foot.z != null ? +pose.foot.z : where.z;
      W.onFoot = true;
      W.x = browserSpot(fx, fz, 0) ? fx : where.x;
      W.z = browserSpot(fx, fz, 0) ? fz : where.z;
      W.y = P.ground ? (P.y || 0) : 0;
      W.yaw = pose.foot && pose.foot.yaw != null ? +pose.foot.yaw : P.yaw;
      W.runMode = !!(pose.foot && pose.foot.run);
      P.v = 0;
      P.ground = true;
      P.driveMode = 'street';
      try { if (typeof setDriveMode === 'function') setDriveMode('street', true); } catch (e) {}
      try { if (typeof syncOnFootButtons === 'function') syncOnFootButtons(); } catch (e) {}
    }
  }

  function safeSpawn() {
    try { if (typeof reset === 'function') reset(); } catch (e) {}
    parkFeet();
    if (typeof P === 'undefined') return;
    if (browserSpot(P.x, P.z, 0)) return;
    const tries = [[0, 40], [0, 80], [0, 160], [0, 240], [12, 80], [-12, 80]];
    for (let i = 0; i < tries.length; i++) {
      if (!browserSpot(tries[i][0], tries[i][1], 0)) continue;
      P.x = tries[i][0];
      P.z = tries[i][1];
      P.y = 0;
      P.ground = true;
      P.v = 0;
      break;
    }
  }

  const api = create({
    storage: root.localStorage,
    interval: GAP,
    paused: function () { try { return !!paused; } catch (e) { return false; } },
    city: {
      mapStamp: function () { return CITY.mapStamp ? CITY.mapStamp() : ''; },
      spotClear: browserSpot,
      districts: function () { return CITY.DISTRICTS || []; },
      nodes: function () { return (CITY.ROADS && CITY.ROADS.nodes) || []; }
    },
    live: {
      readPose: readPose,
      readNos: function () {
        return { tank: n(Math.max(0, Math.min(1, +P.nosTank || 0)), 3), left: n(P.nosLeft, 3), hotDropNosT: n(P.hotDropNosT, 2) };
      },
      applyNos: function (nos) {
        if (!nos) return;
        P.nosTank = Math.max(0, Math.min(1, +nos.tank || 0));
        P.nosLeft = Math.max(0, +nos.left || 0);
        P.hotDropNosT = Math.max(0, +nos.hotDropNosT || 0);
      },
      applyPose: applyPose,
      safeSpawn: safeSpawn,
      parkFeet: parkFeet,
      setHold: function (id, on) {
        if (id === 'hotdrop' && root.HOTDROP) root.HOTDROP.hold = !!on && !!root.HOTDROP.active;
      },
      toast: function (msg) { try { if (typeof kToast === 'function') kToast(msg, 2200); } catch (e) {} }
    }
  });

  let popWant = false;
  let dismissed = false;

  function text(id, value) {
    const el = document.getElementById(id);
    if (el && el.textContent !== value) el.textContent = value;
  }
  function overlayOpen() {
    const el = document.getElementById('kOver');
    return !!(el && !el.classList.contains('hidden'));
  }
  function paint(view) {
    const note = document.getElementById('kResumeNote');
    const go = document.getElementById('kResumeGo');
    const cont = document.getElementById('kContinue');
    if (cont) cont.hidden = !view.continue;
    if (!note) return;
    if (!view.prompt) { note.hidden = true; return; }
    note.hidden = false;
    text('kResumeKicker', view.prompt.kicker);
    text('kResumeTitle', view.prompt.title);
    text('kResumeSub', view.prompt.sub);
    if (go) go.hidden = !view.resume;
  }
  function paintPop(r) {
    const pop = document.getElementById('kResumePop');
    if (!pop) return;
    const show = !!(r && r.showPrompt && r.prompt) && !dismissed && !overlayOpen();
    popWant = !!(r && r.showPrompt && r.prompt) && !dismissed;
    pop.hidden = !show;
    if (!show || !r || !r.prompt) return;
    text('kPopKicker', r.prompt.kicker);
    text('kPopTitle', r.prompt.title);
    text('kPopSub', r.prompt.sub);
  }
  function syncChallenge() {
    const b = document.getElementById('kChallenge');
    if (!b) return;
    const H = root.HOTDROP;
    b.hidden = !(H && H.active && H.tLeft > 0);
  }
  function launch() {
    try { flying = true; } catch (e) {}
    const over = document.getElementById('kOver');
    if (over) over.classList.add('hidden');
    const mb = document.getElementById('kMenuB');
    if (mb) mb.classList.remove('hidden');
    const wr = document.getElementById('kWreck');
    if (wr) wr.classList.add('hidden');
    try { if (typeof kPause === 'function') kPause(false); } catch (e) {}
    try {
      if (root.GARAGE_HOME_HUB && typeof root.GARAGE_HOME_HUB.close === 'function') root.GARAGE_HOME_HUB.close();
    } catch (e) {}
  }
  function goContinue(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    const r = api.beginContinue();
    launch();
    paintPop(r);
    syncChallenge();
    paint(api.preview());
  }
  function goResume(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    const r = api.beginResume();
    launch();
    paintPop(r);
    syncChallenge();
    paint(api.preview());
    if (r.ok) { try { if (typeof kToast === 'function') kToast('CHALLENGE RESUMED'); } catch (e) {} }
  }

  root.RESUME = {
    beginContinue: goContinue,
    beginResume: goResume,
    beginAside: function () {
      const r = api.beginAside();
      paintPop(r);
      syncChallenge();
      return r;
    },
    remind: function () {
      const view = api.preview();
      paintPop({ showPrompt: !!view.resume, prompt: view.prompt });
      syncChallenge();
    },
    tick: function (dt) { api.tick(dt); },
    flush: function () { try { api.flush(); } catch (e) {} },
    onPause: function (on) {
      const pop = document.getElementById('kResumePop');
      if (!pop) return;
      pop.hidden = on ? true : !popWant;
    },
    onNear: function () {
      popWant = false;
      const pop = document.getElementById('kResumePop');
      if (pop) pop.hidden = true;
    },
    paintStart: function () { paint(api.preview()); }
  };

  const cont = document.getElementById('kContinue');
  const go = document.getElementById('kResumeGo');
  const popGo = document.getElementById('kPopGo');
  const stay = document.getElementById('kPopStay');
  if (cont) cont.addEventListener('click', goContinue);
  if (go) go.addEventListener('click', goResume);
  if (popGo) popGo.addEventListener('click', goResume);
  if (stay) stay.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    dismissed = true;
    popWant = false;
    const pop = document.getElementById('kResumePop');
    if (pop) pop.hidden = true;
  });
  try { paint(api.preview()); } catch (e) {}
  addEventListener('pagehide', function () { try { api.flush(); } catch (e) {} });
  addEventListener('visibilitychange', function () {
    try { if (document.visibilityState === 'hidden') api.flush(); } catch (e) {}
  });
})(typeof window !== 'undefined' ? window : globalThis);
