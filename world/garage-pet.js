/* Companion Pet turntable on the Kid App garage preview.
   Doors use the existing wing hinge (ZGL). The pet uses CREW.paintGaragePet,
   the same floor scale as the room (about 0.41x Ellie), not the crew close-up.
   Nothing here writes zdash.garagez.v1, the car eq, or the saved pet choice. */
(function () {
  'use strict';
  const SIG = 2.6;
  /* GL.open finishes at 0.35 and GL.hatch starts at 0.40, so 0.38 is doors-up
     and the hatch still shut. The hinge clock runs 0..1 in GL.time (1.8s). */
  const DOOR = 0.38;
  const DOOR_TIME = 1.8;
  const GAP = 0.62;
  let door = 0;
  let halfW = 0;
  let axis = 'z';
  let hingeBad = false;
  const cur = { pet: '', t: 0, on: false, phase: 'none', side: 1.5 };

  function hinge(g) {
    const Z = window.ZGL;
    if (!Z || hingeBad) return;
    try {
      if (Z.ensure()) Z.set(g);
    } catch (e) {
      hingeBad = true;
    }
  }

  function placeSide(X) {
    if (halfW) return halfW + GAP;
    try {
      const b = new X.THREE_Box3().setFromObject(X.car);
      const hx = (b.max.x - b.min.x) / 2;
      const hz = (b.max.z - b.min.z) / 2;
      const w = Math.min(hx, hz);
      if (w > 0.4 && w < 2.2) {
        halfW = w;
        axis = hx < hz ? 'x' : 'z';
      }
    } catch (e) {}
    return (halfW || 0.95) + GAP;
  }

  /* Stand outside the doors, on the side the camera is looking at, so the pet
     stays next to the opening instead of in front of the nose. */
  function spot(yaw) {
    const side = (halfW || 0.95) + GAP;
    const h = +yaw || 0;
    const cx = Math.cos(h);
    const cz = Math.sin(h);
    if (axis === 'x') {
      const s = Math.abs(cx) < 0.2 ? 1 : (cx >= 0 ? 1 : -1);
      return { x: s * side, y: 0, z: 0.05, face: s > 0 ? -90 : 90, side: side };
    }
    const s = Math.abs(cz) < 0.2 ? 1 : (cz >= 0 ? 1 : -1);
    return { x: 0.05, y: 0, z: s * side, face: s > 0 ? 180 : 0, side: side };
  }

  function pose(dt, on, pet) {
    if (door < 0.02 && window.ZD && ZD.Xray && ZD.Xray.ready) placeSide(ZD.Xray);
    const id = on && pet && pet !== 'none' ? String(pet) : '';
    if (id !== cur.pet) {
      cur.pet = id;
      cur.t = 0;
    }
    const step = Math.max(0, +dt || 0);
    if (id) cur.t += step;
    cur.on = !!id;
    cur.phase = !id ? 'none' : (cur.t < SIG ? 'sig' : 'idle');
    const target = id ? DOOR : 0;
    const dg = step / DOOR_TIME;
    if (door < target) door = Math.min(target, door + dg);
    else if (door > target) door = Math.max(target, door - dg);
    if (id || door > 0.001) hinge(door);
  }

  function draw(ctx, X, yaw) {
    if (!cur.on || !ctx || !X || !X.ready || !X.project) return false;
    const CREW = window.CREW;
    if (!CREW || typeof CREW.paintGaragePet !== 'function') return false;
    if (door < 0.05) placeSide(X);
    const at = spot(yaw);
    cur.side = at.side;
    const origin = { x: at.x, y: 0, z: at.z };
    const face = at.face;
    ctx.save();
    const foot = X.project(origin.x, 0, origin.z);
    if (foot) {
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.beginPath();
      ctx.ellipse(foot.x, foot.y, Math.max(7, foot.m * 0.2), Math.max(3, foot.m * 0.07), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const ok = CREW.paintGaragePet(ctx, (x, y, z) => {
      const p = X.project(x, y, z);
      if (!p) return null;
      return [p.x, p.y, 1, p.m];
    }, cur.pet, cur.t, origin, face);
    ctx.restore();
    return !!ok;
  }

  window.GPET = {
    pose: pose,
    draw: draw,
    get state() {
      const Z = window.ZGL;
      return {
        pet: cur.pet,
        phase: cur.phase,
        t: +cur.t.toFixed(3),
        door: +door.toFixed(3),
        side: +cur.side.toFixed(3),
        axis: axis,
        on: cur.on,
        hinge: !!(Z && Z.S && Z.S.ok),
        hingeBad: hingeBad
      };
    }
  };
})();
