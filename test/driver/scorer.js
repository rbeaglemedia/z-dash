
/* Z-DASH — shift detection + scoring. Works on generic frames from ANY source
   (sim, CSV replay, live OBD). Uses the clutch switch when the source has one,
   otherwise infers shifts from the rpm/speed ratio.
   Tuned for SynchroRev Match: the car blips the throttle on downshifts, so we grade
   what the driver controls — clutch engagement, throttle pickup, shift time, lurch. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const clamp = ZD.clamp;

  ZD.SCORING = {
    // component → [value that earns 100, value that earns 0]
    // Tuned for Bob's ZSpeed Stage 3 clutch + ZSP 19.5 lb steel flywheel:
    //  • Stage 3 grabs hard, so a little extra jerk on engagement is normal → lurch/clutch
    //    tolerances are a bit wider, but they carry the most weight (smoothness is the skill).
    //  • 19.5 lb flywheel holds revs longer than a lightweight one, so revs need a moment to
    //    fall on upshifts → slightly more relaxed upshift-time target.
    clutchRate: [2000, 11000],  // peak rpm/s the clutch yanks the engine into lock
    lurch: [1.0, 4.5],          // peak jerk after engagement (g per second)
    upTime: [0.35, 0.95],       // clutch-in → locked, upshift (s)
    downTime: [0.55, 1.35],     // clutch-in → locked, downshift (s)
    pickup: [0.15, 0.7],        // clutch release → back on throttle (s), upshifts under power
    // Driving modes. Every shift (up AND down) is scored; what "good" means depends on the mode.
    modes: {
      cruise: { // safe/smooth: early low-rpm upshifts, steady throttle, gentle braking, no lurch
        shiftRpmUp: [3000, 5000], lurch: [0.8, 3.5], steady: [25, 160], brake: [0.5, 1.1], downLurch: [3, 9], // Oct 19: downs judged on smoothness, not rev-match (OBD speed comes in 1 mph steps, so jerk is noisy)
        up: { shiftRpm: 0.25, clutch: 0.25, lurch: 0.25, steady: 0.15, time: 0.1 },
        down: { clutch: 0.3, lurch: 0.35, brake: 0.25, time: 0.1 },
      },
      race: { // near-redline upshifts, quick shifts, strong pull, well rev-matched downshifts
        shiftRpmUp: [7000, 5200], upTime: [0.3, 0.8], pull: [0.3, 0.05], revMatch: [80, 500],
        up: { shiftRpm: 0.3, time: 0.2, pull: 0.2, clutch: 0.15, lurch: 0.15 },
        down: { revMatch: 0.35, clutch: 0.2, lurch: 0.2, time: 0.25 },
      },
    },
    ratings: [[85, 'PERFECT', 500], [65, 'GOOD', 250], [0, 'SLOPPY', 50]],
  };

  const lin = (v, [good, bad]) => clamp((100 * (bad - v)) / (bad - good), 0, 100);

  class ShiftScorer {
    constructor() {
      this.buf = []; this.state = 'idle'; this.gear = null; this.cur = null; this.listeners = [];
      this.mode = 'cruise'; this.shifts = []; this.pending = null;
      this.byMode = { cruise: { total: 0, combo: 0, bestCombo: 0, n: 0, sum: 0 }, race: { total: 0, combo: 0, bestCombo: 0, n: 0, sum: 0 } };
      this.harsh = 0; this.harshArmed = true;
      this.pendingFinal = null; this.lastInferred = null; this.inferCount = 0;
    }
    on(cb) { this.listeners.push(cb); }
    reset() { const l = this.listeners, m = this.mode; Object.assign(this, new ShiftScorer()); this.listeners = l; this.mode = m; }
    setMode(m) { if (this.byMode[m]) this.mode = m; }
    get M() { return this.byMode[this.mode]; }
    get total() { return this.M.total; }
    get combo() { return this.M.combo; }
    get bestCombo() { return this.M.bestCombo; }
    /** CRUISE trip-wide driving score (0-100): average shift score, minus harsh accel/brake events. */
    drivingScore() {
      const c = this.byMode.cruise; if (!c.n) return null;
      return Math.max(0, Math.round(c.sum / c.n - this.harsh * 3));
    }
    push(f) {
      const hasClutch = typeof f.clutch === 'boolean';
      const g = f.gear >= 1 ? f.gear : f.gear === 0 ? null : ZD.inferGear(f.rpm, f.speed);
      // derived longitudinal accel from speed (g)
      const prev = this.buf[this.buf.length - 1];
      f._g = g;
      f._acc = prev && f.t > prev.t ? ((f.speed - prev.speed) * 0.44704) / (f.t - prev.t) / 9.81 : 0;
      if (prev) f._acc = prev._acc + (f._acc - prev._acc) * 0.5; // light smoothing
      // harsh accel/brake events (for the CRUISE driving score)
      if (Math.abs(f._acc) > 0.45 && this.harshArmed) { this.harsh++; this.harshArmed = false; } else if (Math.abs(f._acc) < 0.3) this.harshArmed = true;
      this.buf.push(f);
      // finish the previous shift once we have ~1.2 s of data after it (throttle steadiness / pull)
      if (this.pending && f.t - this.pending.tLock >= 1.2) { this.finalize(this.pending); this.pending = null; }
      while (this.buf.length && f.t - this.buf[0].t > 6) this.buf.shift();

      if (this.state === 'idle') {
        if (g && this.gear !== g) { this.inferCount = (this.lastInferred === g ? this.inferCount + 1 : 1); this.lastInferred = g; if (this.inferCount >= 3 && !this.gear) this.gear = g; }
        const startByClutch = hasClutch && f.clutch && this.gear && f.speed > 6;
        const startByRatio = !hasClutch && this.gear && f.speed > 6 && g !== this.gear;
        if (startByClutch || startByRatio) {
          if (this.pending) { this.finalize(this.pending); this.pending = null; }
          this.state = 'shifting';
          this.cur = { tStart: hasClutch ? f.t : prev ? prev.t : f.t, from: this.gear, preThrottle: this.avgThrottle(f.t - 0.4, f.t - 0.05), startRpm: prev ? prev.rpm : f.rpm, tRel: null, to: null, lockCount: 0, mode: this.mode };
        }
        if (!g && f.speed < 3) this.gear = null;
      } else if (this.state === 'shifting') {
        const c = this.cur;
        if (hasClutch && !f.clutch && c.tRel === null) c.tRel = f.t;
        if (!hasClutch && g && c.tRel === null) c.tRel = prev ? prev.t : f.t;
        const engaged = hasClutch ? !f.clutch : true;
        if (engaged && g) {
          if (c.to === g) c.lockCount++; else { c.to = g; c.lockCount = 1; }
          if (c.lockCount >= 3) {
            if (c.to === c.from) { this.state = 'idle'; this.cur = null; return; } // clutch tap, no shift
            c.tLock = f.t; this.gear = c.to; this.state = 'idle'; this.pending = c; this.cur = null;
          }
        }
        if (f.t - c.tStart > 4 || f.speed < 4) { this.state = 'idle'; this.cur = null; if (f.speed < 4) this.gear = null; }
      }
    }
    avgThrottle(t0, t1) {
      const s = this.buf.filter((x) => x.t >= t0 && x.t <= t1);
      return s.length ? s.reduce((a, x) => a + x.throttle, 0) / s.length : 0;
    }
    finalize(c) {
      const S = ZD.SCORING, up = c.to > c.from;
      const tRel = c.tRel ?? c.tLock - 0.15;
      const win = this.buf.filter((x) => x.t >= tRel - 0.05 && x.t <= c.tLock + 0.6); // engagement window
      // clutch smoothness: how violently the engine is pulled to the new gear's rpm
      let rate = 0, maxDev = 0, relDev = null;
      for (let i = 1; i < win.length; i++) {
        const a = win[i - 1], b = win[i];
        const ea = a.rpm - a.speed * ZD.rpmPerMph(c.to), eb = b.rpm - b.speed * ZD.rpmPerMph(c.to);
        if (relDev === null) relDev = ea;
        maxDev = Math.max(maxDev, Math.abs(eb));
        if (b.t > a.t) rate = Math.max(rate, Math.abs(eb - ea) / (b.t - a.t));
      }
      // lurch: peak jerk (g/s) from speed-derived accel
      let jerk = 0;
      for (let i = 2; i < win.length; i++) {
        const a = win[i - 2], b = win[i];
        if (b.t > a.t) jerk = Math.max(jerk, Math.abs(b._acc - a._acc) / (b.t - a.t));
      }
      const duration = c.tLock - c.tStart;
      let pickup = null;
      const underPower = up && c.preThrottle > 35;
      if (underPower) {
        const want = c.preThrottle * 0.5;
        const hit = this.buf.find((x) => x.t >= tRel && x.throttle >= want);
        pickup = hit ? hit.t - tRel : 1.5;
      }
      // ---- mode-specific extras ----
      const mode = c.mode || this.mode, MS = S.modes[mode];
      const after = (t0, t1) => this.buf.filter((x) => x.t >= c.tLock + t0 && x.t <= c.tLock + t1);
      let steady = null, pull = null, brakeG = null;
      const a1 = after(0.3, 1.2);
      if (a1.length > 2) { let tv = 0; for (let i = 1; i < a1.length; i++) tv += Math.abs(a1[i].throttle - a1[i - 1].throttle); steady = tv / (a1[a1.length - 1].t - a1[0].t || 1); }
      const a2 = after(0.2, 0.8);
      if (a2.length) pull = a2.reduce((q, x) => q + x._acc, 0) / a2.length;
      const pre = this.buf.filter((x) => x.t >= c.tStart - 1.5 && x.t <= c.tStart);
      if (pre.length) brakeG = Math.max(0, -Math.min(...pre.map((x) => x._acc)));
      const parts = {
        clutch: lin(mode === 'cruise' && !up ? Math.max(0, rate - 10 * Math.max(0, -(relDev || 0))) : rate, S.clutchRate), // CRUISE downshift: the rpm the clutch makes up (no blip) isn't held against it
        lurch: lin(jerk, (mode === 'cruise' && !up && MS.downLurch) || MS.lurch || S.lurch),
        time: lin(duration, up ? MS.upTime || S.upTime : S.downTime),
      };
      const hard = c.preThrottle >= 60; // RACE only grades shift point / pull on upshifts made under power
      if (up && (mode === 'cruise' || hard)) parts.shiftRpm = lin(c.startRpm, MS.shiftRpmUp);
      if (mode === 'cruise') {
        if (up && steady !== null) parts.steady = lin(steady, MS.steady);
        if (!up && brakeG !== null) parts.brake = lin(brakeG, MS.brake);
      } else {
        if (up && hard && pull !== null) parts.pull = lin((pull * ZD.ratio(3)) / ZD.ratio(c.to), MS.pull); // normalised to 3rd-gear pull
        if (!up && relDev !== null) parts.revMatch = lin(Math.abs(relDev), MS.revMatch);
      }
      if (pickup !== null) parts.pickup = lin(pickup, S.pickup); // shown in the breakdown; folded into "pull" in RACE
      const w = up ? MS.up : MS.down;
      let score = 0, wsum = 0;
      for (const k in w) if (parts[k] !== undefined) { score += parts[k] * w[k]; wsum += w[k]; }
      score = Math.round(score / (wsum || 1));
      if (mode === 'cruise' && !up && relDev !== null) { parts.revMatch = lin(Math.abs(relDev), [80, 500]); if (Math.abs(relDev) < 250) score = Math.min(100, score + (Math.abs(relDev) < 120 ? 10 : 5)); } // rev-match = bonus in CRUISE
      const [, rating, base] = S.ratings.find(([min]) => score >= min);
      const B = this.byMode[mode];
      if (rating === 'SLOPPY') B.combo = 0; else B.combo++;
      B.bestCombo = Math.max(B.bestCombo, B.combo); B.n++; B.sum += score;
      const mult = rating === 'SLOPPY' ? 1 : 1 + Math.min(B.combo - 1, 8) * 0.25;
      const points = Math.round((base + score * 2) * mult);
      B.total += points;
      const ev = {
        t: c.tLock, from: c.from, to: c.to, dir: up ? 'UP' : 'DOWN', mode, score, rating, points,
        combo: B.combo, mult, parts,
        raw: { clutchRate: Math.round(rate), jerk: +jerk.toFixed(2), duration: +duration.toFixed(2), pickup: pickup === null ? null : +pickup.toFixed(2), revMatchErr: relDev === null ? null : Math.round(relDev), maxDev: Math.round(maxDev), shiftRpm: Math.round(c.startRpm), steady: steady === null ? null : Math.round(steady), pull: pull === null ? null : +pull.toFixed(2), brakeG: brakeG === null ? null : +brakeG.toFixed(2) },
      };
      this.shifts.push(ev);
      for (const l of this.listeners) l(ev);
    }
  }
  ZD.ShiftScorer = ShiftScorer;

  /** Post-drive coaching: find the worst patterns in this trip's shifts and turn them into
      2-4 short tips tied to real events (time, gears, score), worded for the mode. */
  ZD.coach = function (shifts, opts = {}) {
    const mode = opts.mode || 'cruise', list = shifts.filter((s) => s.mode === mode);
    if (list.length < 3) return [`Drive a bit more in ${mode.toUpperCase()} mode to get coaching tips.`];
    const t0 = opts.t0 || 0, ts = (t) => { const s = Math.max(0, Math.round(t - t0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
    const tips = [], avg = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
    const worst = (arr, key) => arr.filter((s) => s.parts[key] !== undefined).sort((a, b) => a.parts[key] - b.parts[key])[0];
    // 1. gear pair with the most lurch
    const byPair = {};
    for (const s of list) (byPair[`${s.from}→${s.to}`] ||= []).push(s);
    const pairs = Object.entries(byPair).map(([k, a]) => ({ k, a, lurch: avg(a.map((s) => s.parts.lurch)), jerk: Math.max(...a.map((s) => s.raw.jerk)) })).sort((x, y) => x.lurch - y.lurch);
    if (pairs.length && pairs[0].lurch < 80) {
      const w = pairs[0].a.sort((x, y) => x.parts.lurch - y.parts.lurch)[0];
      tips.push({ score: pairs[0].lurch, text: `Your ${pairs[0].k} shifts jerk the most (worst at ${ts(w.t)}, score ${w.score}, ${w.raw.jerk} g/s). ` + (mode === 'race' ? 'Keep it quick, but slip the Stage 3 a touch longer so it doesn\'t shock the driveline.' : 'Ease the clutch out over about half a second and roll on the gas as it bites.') });
    }
    // 2. slow shifts
    const ups = list.filter((s) => s.dir === 'UP'), slow = worst(ups, 'time');
    if (slow && slow.parts.time < 70) tips.push({ score: slow.parts.time, text: `Slow ${slow.from}→${slow.to} at ${ts(slow.t)}: ${slow.raw.duration}s clutch-in to hooked-up (score ${slow.score}). ` + (mode === 'race' ? 'Aim under 0.4s: one firm motion through the gate.' : 'No need to rush, but a smoother, steadier motion keeps the car settled.') });
    // 3. throttle pickup / pull (race) or shift rpm / steadiness (cruise)
    if (mode === 'race') {
      const p = worst(ups, 'pull');
      if (p && p.parts.pull < 70) tips.push({ score: p.parts.pull, text: `Weak pull after ${p.from}→${p.to} at ${ts(p.t)} (score ${p.score}, back on throttle in ${p.raw.pickup ?? '?'}s). Get back to full throttle as soon as the clutch bites.` });
      const r = worst(ups, 'shiftRpm');
      if (r && r.parts.shiftRpm < 60) tips.push({ score: r.parts.shiftRpm, text: `Early shift ${r.from}→${r.to} at ${ts(r.t)}: ${r.raw.shiftRpm.toLocaleString()} rpm. The Rotrex keeps building boost up top, so hold it to about 7,000+.` });
      const d = worst(list.filter((s) => s.dir === 'DOWN'), 'revMatch');
      if (d && d.parts.revMatch < 70) tips.push({ score: d.parts.revMatch, text: `Downshift ${d.from}→${d.to} at ${ts(d.t)} was ${Math.abs(d.raw.revMatchErr)} rpm off when the clutch came up (score ${d.score}). Let SynchroRev finish its blip before you release.` });
    } else {
      const r = worst(ups, 'shiftRpm');
      if (r && r.parts.shiftRpm < 60) tips.push({ score: r.parts.shiftRpm, text: `${r.from}→${r.to} at ${ts(r.t)} came at ${r.raw.shiftRpm.toLocaleString()} rpm. In Cruise, shift around 2,500–3,500 for a calmer, smoother drive.` });
      const st = worst(ups, 'steady');
      if (st && st.parts.steady < 65) tips.push({ score: st.parts.steady, text: `Throttle was choppy after ${st.from}→${st.to} at ${ts(st.t)} (score ${st.score}). Pick a pedal position and hold it.` });
      const b = worst(list.filter((s) => s.dir === 'DOWN'), 'brake');
      if (b && b.parts.brake < 65) tips.push({ score: b.parts.brake, text: `Hard braking before the ${b.from}→${b.to} downshift at ${ts(b.t)} (${b.raw.brakeG} g). Brake earlier and lighter, then downshift.` });
      if (opts.harsh > 2) tips.push({ score: 50, text: `${opts.harsh} harsh accel/brake moments this drive. Smoother inputs raise your Cruise driving score.` });
    }
    tips.sort((a, b) => a.score - b.score);
    const out = tips.slice(0, 4).map((t) => t.text);
    if (out.length < 2) {
      const best = list.slice().sort((a, b) => b.score - a.score)[0];
      out.push(`Nice: your best was ${best.from}→${best.to} at ${ts(best.t)} (score ${best.score}). Keep doing that.`);
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);

