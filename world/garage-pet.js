/* Companion Pet turntable on the Kid App garage preview.
   Selecting a pet triggers the same wings-open sequence Neon World already
   plays: ZGL doors ramp 0→1 over 1.8s (shared/tune.js transformTime) and the
   pet plays PET_CLIPS.takeoff, then the same ride/fly pose petPose falls into.
   Nothing here writes P.tf, P.wings, zdash.garagez.v1, the car eq, or the saved pet. */
(function () {
  'use strict';
  const DOOR = 1;
  const DOOR_TIME = 1.8;
  let door = 0;
  let hingeBad = false;
  const cur = { pet: '', t: 0, on: false, phase: 'none', pose: null };

  function hinge(g) {
    const Z = window.ZGL;
    if (!Z || hingeBad) return;
    try {
      if (Z.ensure()) Z.set(g);
    } catch (e) {
      hingeBad = true;
    }
  }

  /* Same hatch fraction hatchOpen() uses, from this preview's door clock. */
  function hatchOf(g) {
    const H = window.ZGL && ZGL.GL && ZGL.GL.hatch;
    if (!H || !(H[1] > H[0])) return g;
    const u = (g - H[0]) / (H[1] - H[0]);
    return u < 0 ? 0 : u > 1 ? 1 : u;
  }

  function pose(dt, on, pet) {
    const id = on && pet && pet !== 'none' ? String(pet) : '';
    if (id !== cur.pet) {
      cur.pet = id;
      cur.t = 0;
      if (id) door = 0;
    }
    const step = Math.max(0, +dt || 0);
    if (id) cur.t += step;
    cur.on = !!id;
    const target = id ? DOOR : 0;
    const dg = step / DOOR_TIME;
    if (door < target) door = Math.min(target, door + dg);
    else if (door > target) door = Math.max(target, door - dg);
    if (id || door > 0.001) hinge(door);
    const CREW = window.CREW;
    cur.pose = id && CREW && typeof CREW.wingsPose === 'function' ? CREW.wingsPose(id, cur.t, hatchOf(door)) : null;
    cur.phase = cur.pose ? cur.pose.phase : 'none';
    cur.mesh = !!(CREW && CREW.showWingsPet && CREW.showWingsPet(cur.pose, !!id));
  }

  /* petFk is x lateral, y up, z longitudinal. drawPet places that on the car as
     (z, y, x), the same map the in-car tubes use. */
  function draw(ctx, X) {
    if (cur.mesh) return true;
    if (!cur.on || !cur.pose || !ctx || !X || !X.ready || !X.project) return false;
    const CREW = window.CREW;
    if (!CREW || typeof CREW.paintGaragePet !== 'function') return false;
    const ok = CREW.paintGaragePet(ctx, (x, y, z) => {
      const p = X.project(z, y, x);
      if (!p) return null;
      return [p.x, p.y, 1 + z * 0.01, p.m];
    }, cur.pose);
    return !!ok;
  }

  window.GPET = {
    pose: pose,
    draw: draw,
    get state() {
      const Z = window.ZGL;
      const q = cur.pose && cur.pose.q;
      return {
        pet: cur.pet,
        phase: cur.phase,
        t: +cur.t.toFixed(3),
        door: +door.toFixed(3),
        hatch: +hatchOf(door).toFixed(3),
        on: cur.on,
        clip: q ? { x: +q.x.toFixed(3), y: +q.y.toFixed(3), z: +q.z.toFixed(3) } : null,
        mesh: !!cur.mesh,
        hinge: !!(Z && Z.S && Z.S.ok),
        hingeBad: hingeBad
      };
    }
  };
})();
