
/* Z-DASH — pluggable data sources.
   Every source emits the same "frame" object to the app:
   { t (s), rpm, speed (mph), throttle (%), gear (1-6 | 0 neutral | null unknown),
     clutch (true=pedal down | null unknown), boost (psi, negative = vacuum), afr,
     coolant/oil/iat (°F), timing (° BTDC), volts, load (%), ethanol (% flex content), brake (bool|null),
     latG / lonG (g | null → app falls back to the phone's accelerometer) }
   Missing values are null; the UI shows "--" for anything a source can't provide.
   To add a source: extend DataSource, call this.emit(frame) and this.setStatus(...). */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});

  class DataSource {
    constructor(label) { this.label = label; this.status = 'idle'; this.frameCbs = []; this.statusCbs = []; }
    onFrame(cb) { this.frameCbs.push(cb); }
    onStatus(cb) { this.statusCbs.push(cb); }
    emit(f) { if (ZD.Clutch) ZD.Clutch.attach(f, this); for (const cb of this.frameCbs) cb(f); }
    setStatus(s, msg) { this.status = s; this.statusMsg = msg || ''; for (const cb of this.statusCbs) cb(s, msg); }
    async start() {}
    stop() {}
  }

  /* ---------- (1) Simulated drive (default) ---------- */
  class SimSource extends DataSource {
    constructor() { super('SIM'); this.car = new ZD.SimCar(); this.timer = null; this.speedup = 1; }
    async start(opt) {
      this.setStatus('connecting');
      if (!(opt && opt.now)) await new Promise((r) => setTimeout(r, 900)); // pretend handshake (lets the splash play)
      let last = performance.now(), acc = 0;
      this.timer = setInterval(() => {
        if (window.ZD_PARKED) return;
        const now = performance.now();
        let dt = Math.min(0.25, (now - last) / 1000) * this.speedup; last = now;
        while (dt > 0) { const h = Math.min(0.005, dt); this.car.step(h); dt -= h; acc += h; }
        if (acc >= 0.05) { acc = 0; this.emit(this.car.frame()); } // 20 Hz like a fast OBD stream
      }, 16);
      this.setStatus('live');
    }
    stop() { clearInterval(this.timer); this.setStatus('idle'); }
    requestDynoPull() { this.car.driver.dynoRequested = true; }
    // Simulated ECU code memory. Demo script: test-pipe cat codes show up (Bob's "usual" codes),
    // later a lean code appears that is NOT on the list, and the TPMS module reports a dead sensor.
    simCodes() {
      const t = this.car.t, c = (this._codes ||= { stored: new Set(), pending: new Set(), body: new Set(['C1709']), fired: {} });
      const fire = (k, at, fn) => { if (t >= at && !c.fired[k]) { c.fired[k] = 1; fn(); } };
      fire('p420p', 20, () => c.pending.add('P0420'));
      fire('p420', 26, () => { c.pending.delete('P0420'); c.stored.add('P0420'); });
      fire('p430', 75, () => c.stored.add('P0430'));
      fire('p420b', 130, () => c.stored.add('P0420'));
      fire('p171', 170, () => c.stored.add('P0171'));
      fire('c1709x', 45, () => c.body.delete('C1709')); // TPMS sensor reports again: the module drops the code by itself
      return c;
    }
    async readCodes() { await new Promise((r) => setTimeout(r, 120)); const c = this.simCodes(); return { stored: [...c.stored], pending: [...c.pending], body: [...c.body] }; }
    async clearCodes() { await new Promise((r) => setTimeout(r, 200)); const c = this.simCodes(); c.stored.clear(); c.pending.clear(); /* body/TPMS untouched: needs Nissan-specific request */ }
    /** Run the sim ahead instantly (used for demos/screenshots: ?warm=300). */
    fastForward(sec) { let acc = 0; for (let i = 0; i < sec / 0.005; i++) { this.car.step(0.005); acc += 0.005; if (acc >= 0.05) { acc = 0; this.emit(this.car.frame()); } } }
  }

  ZD.DataSource = DataSource;
  ZD.SimSource = SimSource;
})(typeof window !== 'undefined' ? window : globalThis);
