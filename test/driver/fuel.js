
/* Z-DASH — fuel gauge that doesn't trust the factory sender.
   Primary: trip-based. Miles since the last fill-up vs. Bob's learned average miles per tank.
   Secondary: if the OBD fuel level (PID 0x2F) is available, a big jump while stopped = refuel → auto reset.
   Future (stub): fuel used from injector duty / MAF — needs calibration for E85 + ID1050 injectors. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const DEF = { tankGal: 19.0, avgMilesPerTank: 240, reserveMiles: 40, lowWarnMiles: 40 }; // 370Z tank ≈ 19 gal (setting)

  class FuelTracker {
    constructor(store, init) {
      this.store = store || (typeof localStorage !== 'undefined' ? localStorage : null);
      const s = Object.assign({ milesSinceFill: 0, fills: [], settings: { ...DEF } }, this.load(), init || {});
      Object.assign(this, s); this.settings = Object.assign({ ...DEF }, s.settings);
      this.lastLevel = null; this.stoppedSince = null; this.warned = false; this.listeners = [];
    }
    load() { try { return JSON.parse(this.store.getItem('zdash.fuel') || '{}'); } catch (e) { return {}; } }
    save() { try { this.store.setItem('zdash.fuel', JSON.stringify({ milesSinceFill: this.milesSinceFill, fills: this.fills.slice(-30), settings: this.settings })); } catch (e) {} }
    on(cb) { this.listeners.push(cb); }
    emit(ev) { for (const l of this.listeners) l(ev); }
    /** Learned miles per tank = average of the last 5 "real" tanks (ignores top-offs under 50 mi). */
    get avgMiles() { const t = this.fills.filter((f) => f.miles >= 50).slice(-5); return t.length ? t.reduce((a, f) => a + f.miles, 0) / t.length : this.settings.avgMilesPerTank; }
    get range() { return Math.max(0, this.avgMiles - this.milesSinceFill); }
    get pct() { return Math.max(0, Math.min(1, 1 - this.milesSinceFill / this.avgMiles)); }
    get mpg() { return this.avgMiles / this.settings.tankGal; }
    get low() { return this.range <= this.settings.lowWarnMiles; }
    addMiles(mi) {
      if (!(mi > 0)) return;
      this.milesSinceFill += mi;
      if (this.low && !this.warned) { this.warned = true; this.emit({ type: 'low', range: this.range }); }
      if (Math.random() < 0.02) this.save();
    }
    fillUp(auto = false) {
      if (this.milesSinceFill >= 1) this.fills.push({ miles: +this.milesSinceFill.toFixed(1), date: Date.now(), auto });
      this.milesSinceFill = 0; this.warned = false; this.save(); this.emit({ type: 'fill', auto });
    }
    setTank(gal) { if (gal > 5 && gal < 40) { this.settings.tankGal = gal; this.save(); } }
    /** Secondary: OBD fuel level %. Refuel = level up ≥ 15 points while stopped. */
    onFrame(f) {
      if (f.fuelLevel == null) return;
      const stopped = !(f.speed > 1);
      if (stopped) { if (this.levelAtStop == null) this.levelAtStop = f.fuelLevel; if (f.fuelLevel - this.levelAtStop >= 15) { this.levelAtStop = f.fuelLevel; this.fillUp(true); } }
      else this.levelAtStop = null;
      this.lastLevel = f.fuelLevel;
    }
    // FUTURE: gallons used ≈ Σ(injector duty × flow) — or MAF ÷ AFR ÷ fuel density. Needs calibration for
    // E85 blend (Zeitronix %), ID1050 flow rate and EcuTek's injector scaling before it can be trusted.
    estimateGallonsFromMaf() { return null; }
  }
  ZD.FuelTracker = FuelTracker;
})(typeof window !== 'undefined' ? window : globalThis);

