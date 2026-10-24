
/* Z-DASH — extras: shift-light settings, health watch, 0-60 / 60-130 timer + ghost,
   achievements, Rotrex SX150 fluid reminder. All settings persist (demo uses a throwaway copy). */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});

  ZD.EXTRAS_DEFAULTS = {
    shiftLight: { cruise: { start: 2200, shift: 3000 }, race: { start: 5800, shift: 7000 } }, // rpm, per mode
    health: { iatMax: 140, oilMax: 250, boostMax: 11, boostLowWot: 3, ethanolMin: 70, idleDip: 150, idleWarmF: 170 }, // °F, °F, psi, psi, %E, rpm below YOUR usual warm idle, coolant °F
    idle: { hist: [] },                                                                       // per-drive warm-idle averages
    maint: { rotrexIntervalMi: 18000, rotrexMiSince: 0 },                                     // SX150 traction fluid
    runs: { z60: [], s60130: [] }, ghost: { z60: null, s60130: null },
    ach: { unlocked: {}, perfectTotal: 0 },
  };

  class Extras {
    constructor(store, overrides) {
      this.store = store || (typeof localStorage !== 'undefined' ? localStorage : null);
      const saved = this.load();
      const D = JSON.parse(JSON.stringify(ZD.EXTRAS_DEFAULTS));
      this.cfg = deepMerge(deepMerge(D, saved), overrides || {});
      this.listeners = []; this.health = {}; this.run = null; this.lastSpeed = 0;
    }
    load() { try { return JSON.parse(this.store.getItem('zdash.extras') || '{}'); } catch (e) { return {}; } }
    save() { try { this.store.setItem('zdash.extras', JSON.stringify(this.cfg)); } catch (e) {} }
    on(cb) { this.listeners.push(cb); }
    emit(ev) { for (const l of this.listeners) l(ev); }

    // ---------- health watch ----------
    checkHealth(f) {
      const H = this.cfg.health, now = f.t;
      const rules = [
        ['iat', f.iat != null && f.iat > H.iatMax, `Intake air ${Math.round(f.iat)}°F (limit ${H.iatMax}°F). Heat soak: ease off and let the intercooler recover.`],
        ['oil', f.oil != null && f.oil > H.oilMax, `Oil temp ${Math.round(f.oil)}°F (limit ${H.oilMax}°F). Back off and let it cool down.`],
        ['boostHi', f.boost != null && f.boost > H.boostMax, `Boost ${f.boost?.toFixed(1)} psi is above ${H.boostMax} psi. Possible boost creep or a pulley/sensor problem.`],
        ['boostLo', f.boost != null && f.throttle > 90 && f.rpm > 6000 && f.boost < H.boostLowWot, `Only ${f.boost?.toFixed(1)} psi at full throttle near redline. Check the belt and look for charge-pipe leaks.`],
        ['eth', f.ethanol != null && f.ethanol < H.ethanolMin, `Ethanol ${Math.round(f.ethanol)}% is below the ${H.ethanolMin}% your tune expects. Stay out of boost until you top up with E85.`],
      ];
      for (const [k, bad, msg] of rules) {
        const h = (this.health[k] ||= { since: null, last: -1e9 });
        if (bad) { h.since ??= now; if (now - h.since > 2 && now - h.last > 90) { h.last = now; this.emit({ type: 'health', key: k, msg }); } }
        else h.since = null;
      }
    }

    // ---------- warm idle: average idle rpm once warm, stopped, in neutral; flag only dips/stalls vs YOUR usual ----------
    idleBaseline() { // median of recent drives' warm-idle averages (adapts to the car's own steady idle)
      const h = this.cfg.idle.hist.slice(-10).map((d) => d.avg).sort((a, b) => a - b);
      if (h.length) return h[Math.floor(h.length / 2)];
      const I = this.idleCur; return I && I.secs > 20 ? I.sum / I.secs : null;
    }
    checkIdle(f) {
      const H = this.cfg.health, I = (this.idleCur ||= { sum: 0, secs: 0, min: null, lastT: null, dipSince: null, deadAt: null, wasIdle: false });
      const dt = I.lastT == null ? 0 : Math.min(0.5, Math.max(0, f.t - I.lastT)); I.lastT = f.t;
      const rpm = f.rpm || 0, warm = f.coolant != null && f.coolant >= H.idleWarmF, stopped = !(f.speed > 1);
      const neutral = f.gear === 0 || f.gear === 'N' || (f.gear == null && (f.throttle || 0) < 3);
      const idling = warm && stopped && neutral && (f.throttle || 0) < 3 && rpm > 250 && rpm < 1400;
      if (idling) { I.sum += rpm * dt; I.secs += dt; I.min = I.min == null ? rpm : Math.min(I.min, rpm); }
      const base = this.idleBaseline(); I.base = base;
      // dip: well below the usual warm idle for > 1.5 s
      if (idling && base && rpm < base - H.idleDip) { I.dipSince ??= f.t; if (f.t - I.dipSince > 1.5) { I.dips = (I.dips || 0) + (I.flaggedDip ? 0 : 1); if (!I.flaggedDip) this.emit({ type: 'health', key: 'idleDip', msg: `Warm idle dipped to ${Math.round(rpm)} rpm (your usual is ~${Math.round(base)}). Watch for a stall; check the IACV/throttle-body cleanliness and for vacuum leaks.` }); I.flaggedDip = true; } }
      else { I.dipSince = null; if (rpm >= (base || 0) - H.idleDip * 0.5) I.flaggedDip = false; }
      // stall: engine dies from a warm idle and is restarted within 20 s (a normal key-off isn't flagged)
      if (I.wasIdle && rpm < 100 && I.deadAt == null) { I.deadAt = f.t; I.wasIdle = false; }
      if (I.deadAt != null) { if (rpm > 400 && f.t - I.deadAt < 20) { I.stalls = (I.stalls || 0) + 1; this.emit({ type: 'health', key: 'stall', msg: 'Engine stalled at warm idle and was restarted. If it happens again, note the conditions (A/C on? just after a hard pull?); the drive log has the details.' }); I.deadAt = null; } else if (f.t - I.deadAt >= 20) I.deadAt = null; }
      if (rpm > 250) I.wasIdle = idling || (I.wasIdle && rpm < 1400 && stopped);
    }
    idleNow() { const I = this.idleCur; return I && I.secs > 3 ? { avg: I.sum / I.secs, min: I.min, secs: I.secs, base: I.base, dips: I.dips || 0, stalls: I.stalls || 0 } : { base: I && I.base, dips: (I && I.dips) || 0, stalls: (I && I.stalls) || 0 }; }
    idleEndDrive() { // call at power-off / end trip
      const n = this.idleNow(); if (n.avg != null && n.secs >= 10) { const h = this.cfg.idle.hist; h.push({ date: Date.now(), avg: Math.round(n.avg), min: Math.round(n.min), secs: Math.round(n.secs), dips: n.dips, stalls: n.stalls }); h.splice(0, Math.max(0, h.length - 20)); this.save(); }
      this.idleCur = null;
    }

    // ---------- 0-60 / 60-130 timer with ghost ----------
    checkRuns(f) {
      const v = f.speed || 0, prev = this.lastSpeed; this.lastSpeed = v;
      const R = this.run;
      if (!R) {
        if (prev < 0.5 && v >= 0.5) this.run = { kind: 'z60', t0: f.t, trace: [[0, v]], target: 60 };
        else if (prev < 60 && v >= 60 && f.throttle > 80) this.run = { kind: 's60130', t0: f.t, trace: [[0, v]], target: 130 };
        return;
      }
      const el = f.t - R.t0; R.trace.push([+el.toFixed(2), v]); R.elapsed = el;
      if (v >= R.target) {
        const time = +el.toFixed(2), list = this.cfg.runs[R.kind];
        const entry = { time, date: Date.now() }; list.push(entry); list.sort((a, b) => a.time - b.time); list.splice(5);
        const best = list[0] === entry;
        if (best) this.cfg.ghost[R.kind] = { time, trace: R.trace.filter((_, i) => i % 2 === 0) };
        this.save(); this.emit({ type: 'run', kind: R.kind, time, best, rank: list.indexOf(entry) + 1 });
        this.lastRun = { kind: R.kind, time, trace: R.trace };
        this.run = R.kind === 'z60' && f.throttle > 80 ? null : null;
        if (R.kind === 'z60' && f.throttle > 80) this.run = { kind: 's60130', t0: f.t, trace: [[0, v]], target: 130 }; // keep going: 60-130
        return;
      }
      if (f.throttle < 20) R.lowSince ??= f.t; else R.lowSince = null; // lifting during a shift is fine; a real lift aborts
      if (el > (R.kind === 'z60' ? 12 : 25) || (R.lowSince != null && f.t - R.lowSince > 0.8) || v < (R.trace[R.trace.length - 3]?.[1] ?? 0) - 1.5) this.run = null; // aborted
    }
    /** Ghost comparison for the active run: + = you're behind the ghost (seconds). */
    ghostDelta() {
      const R = this.run, gh = R && this.cfg.ghost[R.kind]; if (!R || !gh) return null;
      const v = R.trace[R.trace.length - 1][1]; const tr = gh.trace;
      for (let i = 1; i < tr.length; i++) if (tr[i][1] >= v) { const [t0, v0] = tr[i - 1], [t1, v1] = tr[i]; const tg = t0 + ((v - v0) / (v1 - v0 || 1)) * (t1 - t0); return +(R.elapsed - tg).toFixed(2); }
      return null;
    }

    // ---------- achievements ----------
    unlock(id, title, desc) { if (this.cfg.ach.unlocked[id]) return; this.cfg.ach.unlocked[id] = { title, desc, date: Date.now() }; this.save(); this.emit({ type: 'ach', id, title, desc }); }
    onShift(ev, scorer) {
      const A = this.cfg.ach;
      this.unlock('first', 'FIRST GEAR', 'Your first scored shift.');
      if (ev.rating === 'PERFECT') { A.perfectTotal++; if (A.perfectTotal % 10 === 0) this.save(); }
      if (A.perfectTotal >= 100) this.unlock('century', 'CENTURY', '100 PERFECT shifts.');
      if (ev.combo >= 10) this.unlock('combo10', 'ON A ROLL', '10-shift combo streak.');
      if (ev.combo >= 25) this.unlock('combo25', 'UNTOUCHABLE', '25-shift combo streak.');
      if (ev.dir === 'DOWN' && ev.mode === 'race' && ev.parts.revMatch === 100 && ev.parts.lurch >= 95) this.unlock('rev10', 'HEEL-TOE HERO', 'First 10/10 rev-matched downshift.');
      if (ev.dir === 'UP' && ev.mode === 'race' && ev.rating === 'PERFECT' && ev.raw.shiftRpm >= 7000) this.unlock('redline', 'REDLINE CLUB', 'PERFECT upshift above 7,000 rpm.');
      if (ev.mode === 'cruise' && scorer.byMode.cruise.n >= 20 && scorer.drivingScore() >= 90) this.unlock('smooth', 'SMOOTH OPERATOR', 'Cruise driving score 90+ over 20 shifts.');
    }
    onRun(ev) { if (ev.kind === 'z60' && ev.time < 5) this.unlock('sub5', 'SUB-5', '0-60 under 5 seconds.'); if (ev.kind === 's60130' && ev.time < 12) this.unlock('sub12', 'HIGHWAY HERO', '60-130 under 12 seconds.'); }
    onDyno(run) { this.unlock('dyno', 'DYNO DAY', `First road-dyno pull (${run.peakHp} whp).`); if (run.peakHp >= 450) this.unlock('450', '450 CLUB', 'Road-dyno estimate of 450+ whp.'); }

    // ---------- Rotrex SX150 traction-fluid reminder ----------
    addMiles(mi) {
      const M = this.cfg.maint, before = M.rotrexMiSince; M.rotrexMiSince += mi;
      const left = M.rotrexIntervalMi - M.rotrexMiSince;
      if ((before < M.rotrexIntervalMi - 250 && left <= 250) || (before < M.rotrexIntervalMi && left <= 0)) { this.save(); this.emit({ type: 'maint', left }); }
      if (Math.random() < 0.01) this.save();
    }
    rotrexLeft() { return this.cfg.maint.rotrexIntervalMi - this.cfg.maint.rotrexMiSince; }
    rotrexReset() { this.cfg.maint.rotrexMiSince = 0; this.save(); }
  }
  ZD.ACHIEVEMENTS = [
    ['first', 'FIRST GEAR'], ['combo10', 'ON A ROLL'], ['combo25', 'UNTOUCHABLE'], ['century', 'CENTURY'], ['rev10', 'HEEL-TOE HERO'],
    ['redline', 'REDLINE CLUB'], ['smooth', 'SMOOTH OPERATOR'], ['sub5', 'SUB-5'], ['sub12', 'HIGHWAY HERO'], ['dyno', 'DYNO DAY'], ['450', '450 CLUB'],
  ];
  function deepMerge(a, b) { for (const k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') deepMerge(a[k], b[k]); else a[k] = b[k]; } return a; }
  ZD.Extras = Extras;
})(typeof window !== 'undefined' ? window : globalThis);

