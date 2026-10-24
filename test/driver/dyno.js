
/* Z-DASH — "road dyno". Captures any full-throttle pull in one gear and estimates
   wheel horsepower from acceleration:  P = (m·a + aero drag + rolling) · v
   It's an estimate (fun number, not a real dyno): accuracy depends on weight, road grade
   and how clean the speed signal is. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const C = ZD.CAR;

  class RoadDyno {
    constructor() { this.cur = null; this.runs = []; this.listeners = []; this.armed = false; }
    on(cb) { this.listeners.push(cb); }
    push(f) {
      const g = f.gear >= 1 ? f.gear : ZD.inferGear(f.rpm, f.speed);
      const wot = f.throttle >= 90 && !(f.clutch === true);
      if (wot && g && (!this.cur || this.cur.gear === g)) {
        if (!this.cur) this.cur = { gear: g, pts: [] };
        this.cur.pts.push({ t: f.t, rpm: f.rpm, v: f.speed * 0.44704 });
      } else if (this.cur) {
        this.finish(this.cur); this.cur = null;
      }
    }
    finish(run) {
      const p = run.pts;
      if (run.gear < 3 || p.length < 15 || p[p.length - 1].rpm - p[0].rpm < 2200) return; // 1st/2nd are traction-limited
      // smooth speed, then central-difference accel
      const sm = p.map((x, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - 3); j <= Math.min(p.length - 1, i + 3); j++) { s += p[j].v; n++; } return s / n; });
      const out = [];
      for (let i = 6; i < p.length - 6; i++) { // skip edges where the smoothing window runs off the pull
        const dt = p[i + 3].t - p[i - 3].t; if (dt <= 0) continue;
        const a = (sm[i + 3] - sm[i - 3]) / dt, v = sm[i];
        const F = C.massKg * a + 0.5 * 1.2 * C.cd * C.frontalAreaM2 * v * v + C.crr * C.massKg * 9.81;
        const hp = (F * v) / 745.7;
        out.push({ rpm: p[i].rpm, hp, tq: (hp * 5252) / p[i].rpm });
      }
      // bin every 250 rpm
      const bins = {};
      for (const o of out) { const k = Math.round(o.rpm / 250) * 250; (bins[k] = bins[k] || []).push(o); }
      const curve = Object.keys(bins).map(Number).sort((a, b) => a - b).map((k) => {
        const b = bins[k]; return { rpm: k, hp: b.reduce((s, x) => s + x.hp, 0) / b.length, tq: b.reduce((s, x) => s + x.tq, 0) / b.length };
      });
      for (let i = 1; i < curve.length - 1; i++) { curve[i].hp2 = (curve[i - 1].hp + curve[i].hp * 2 + curve[i + 1].hp) / 4; curve[i].tq2 = (curve[i - 1].tq + curve[i].tq * 2 + curve[i + 1].tq) / 4; }
      curve.forEach((c) => { c.hp = c.hp2 ?? c.hp; c.tq = c.tq2 ?? c.tq; delete c.hp2; delete c.tq2; });
      curve.splice(0, 1); curve.splice(-1, 1); // drop edge bins (throttle ramp-in / end of pull)
      if (curve.length < 5) return;
      const pk = curve.reduce((a, c) => (c.hp > a.hp ? c : a)), pt = curve.reduce((a, c) => (c.tq > a.tq ? c : a));
      const res = { gear: run.gear, curve, peakHp: Math.round(pk.hp), peakHpRpm: pk.rpm, peakTq: Math.round(pt.tq), peakTqRpm: pt.rpm, when: Date.now() };
      this.runs.push(res);
      for (const l of this.listeners) l(res);
    }
  }
  ZD.RoadDyno = RoadDyno;
})(typeof window !== 'undefined' ? window : globalThis);

