
/* Z-DASH — trouble codes: plain-English lookup + Auto-clear manager.
   Standard OBD-II: Mode 03 = stored codes, Mode 07 = pending, Mode 04 = clear.
   NOTE: Mode 04 clears ALL engine codes at once and resets the emissions readiness monitors.
   Tire-pressure (C17xx) and body codes live in other modules (BCM/TPMS) and need
   Nissan-specific requests — standard OBD can't read or clear them. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});

  ZD.DTC = {
    P0011: 'Intake valve timing over-advanced (bank 1). Often low/dirty oil or a sticky VVT solenoid.',
    P0021: 'Intake valve timing over-advanced (bank 2). Often low/dirty oil or a sticky VVT solenoid.',
    P0101: 'Air flow sensor (MAF) reading out of range. Check intake for leaks; common after intake or tune changes.',
    P0102: 'Air flow sensor (MAF) signal low. Check the MAF plug and wiring.',
    P0103: 'Air flow sensor (MAF) signal high. Check the MAF plug and wiring.',
    P0106: 'Manifold pressure (MAP) sensor reading out of range. Check the 4-bar MAP sensor wiring and vacuum line.',
    P0113: 'Intake air temperature sensor signal high (reads very cold / unplugged).',
    P0117: 'Coolant temperature sensor signal low.',
    P0118: 'Coolant temperature sensor signal high.',
    P0122: 'Throttle position sensor signal low.',
    P0123: 'Throttle position sensor signal high.',
    P0137: 'Rear oxygen sensor low voltage (bank 1). Common with test pipes.',
    P0138: 'Rear oxygen sensor high voltage (bank 1).',
    P0157: 'Rear oxygen sensor low voltage (bank 2). Common with test pipes.',
    P0158: 'Rear oxygen sensor high voltage (bank 2).',
    P0171: 'Engine running lean (bank 1). Too much air or not enough fuel. Get it checked, especially on boost/E85.',
    P0172: 'Engine running rich (bank 1). Too much fuel.',
    P0174: 'Engine running lean (bank 2). Too much air or not enough fuel. Get it checked, especially on boost/E85.',
    P0175: 'Engine running rich (bank 2). Too much fuel.',
    P0178: 'Flex-fuel (ethanol) sensor signal low. Check the flex sensor wiring.',
    P0179: 'Flex-fuel (ethanol) sensor signal high. Check the flex sensor wiring.',
    P0300: 'Random misfire detected. Ease off and get it checked. Plugs/coils are common on boosted VQs.',
    P0301: 'Misfire, cylinder 1.', P0302: 'Misfire, cylinder 2.', P0303: 'Misfire, cylinder 3.',
    P0304: 'Misfire, cylinder 4.', P0305: 'Misfire, cylinder 5.', P0306: 'Misfire, cylinder 6.',
    P0325: 'Knock sensor circuit problem.',
    P0335: 'Crankshaft position sensor problem. Can cause stalling or no-start.',
    P0340: 'Camshaft position sensor problem.',
    P0420: 'Catalytic converter efficiency low (bank 1). Expected with test pipes.',
    P0430: 'Catalytic converter efficiency low (bank 2). Expected with test pipes.',
    P0442: 'Small evaporative (fuel vapor) leak. Often a loose gas cap.',
    P0455: 'Large evaporative (fuel vapor) leak. Check the gas cap first.',
    P0456: 'Very small evaporative leak. Often the gas cap.',
    P0500: 'Vehicle speed sensor problem.',
    P0507: 'Idle speed higher than expected. Common after intake/tune work, or an air leak.',
    P0605: 'Engine computer internal error.',
    P0704: 'Clutch pedal switch circuit problem (affects cruise control / starting).',
    P1148: 'Closed-loop fuel control problem (bank 1). Usually shows with an O2 sensor code.',
    P1168: 'Closed-loop fuel control problem (bank 2). Usually shows with an O2 sensor code.',
    P1550: 'Battery current sensor range problem (common after battery work).',
    P1610: 'Immobilizer (NATS) lock mode. Key/immobilizer problem.',
    P2096: 'Post-catalyst fuel trim too lean (bank 1). Common with test pipes.',
    P2097: 'Post-catalyst fuel trim too rich (bank 1).',
    P2098: 'Post-catalyst fuel trim too lean (bank 2). Common with test pipes.',
    P2099: 'Post-catalyst fuel trim too rich (bank 2).',
    P2100: 'Electronic throttle motor circuit problem.',
    P2135: 'Throttle position sensors disagree with each other.',
    U1000: 'Communication problem between the car\'s computers (CAN bus).',
    U1001: 'Communication problem between the car\'s computers (CAN bus).',
    // TPMS (body module — Nissan-specific, not standard OBD)
    C1704: 'Tire pressure low, front left.', C1705: 'Tire pressure low, front right.',
    C1706: 'Tire pressure low, rear right.', C1707: 'Tire pressure low, rear left.',
    C1708: 'No signal from front-left tire sensor. Usually a dead sensor battery or missing sensor.',
    C1709: 'No signal from front-right tire sensor. Usually a dead sensor battery or missing sensor.',
    C1710: 'No signal from rear-right tire sensor. Usually a dead sensor battery or missing sensor.',
    C1711: 'No signal from rear-left tire sensor. Usually a dead sensor battery or missing sensor.',
    C1716: 'Bad data from front-left tire sensor.', C1717: 'Bad data from front-right tire sensor.',
    C1718: 'Bad data from rear-right tire sensor.', C1719: 'Bad data from rear-left tire sensor.',
    C1729: 'Tire pressure system not getting a vehicle speed signal.',
  };
  ZD.dtcMeaning = (c) => ZD.DTC[c] || (c[0] === 'P' ? 'Engine/powertrain code (not in the built-in list; look it up).' : c[0] === 'C' ? 'Chassis code (Nissan-specific).' : c[0] === 'B' ? 'Body code (Nissan-specific).' : 'Network code.');
  ZD.isEngineCode = (c) => c[0] === 'P' || c[0] === 'U';

  /** Auto-clear manager. Persists allowlist + history in localStorage.
      Safety rules: never auto-clear while ANY engine code outside the allowlist is present
      (Mode 04 wipes everything), and never touch body/TPMS codes. */
  class CodeManager {
    constructor(store) {
      this.store = store || (typeof localStorage !== 'undefined' ? localStorage : null);
      const saved = this.load();
      this.allow = new Set(saved.allow || []); this.history = saved.history || []; this.auto = !!saved.auto;
      this.current = { stored: [], pending: [], body: [] }; this.alerts = []; this.listeners = []; this.busy = false; this.lastRead = null;
    }
    load() { try { return JSON.parse(this.store.getItem('zdash.codes') || '{}'); } catch (e) { return {}; } }
    save() { try { this.store.setItem('zdash.codes', JSON.stringify({ allow: [...this.allow], history: this.history.slice(-100), auto: this.auto })); } catch (e) {} }
    on(cb) { this.listeners.push(cb); }
    changed(ev) { this.save(); for (const l of this.listeners) l(ev || {}); }
    toggleAllow(code) { this.allow.has(code) ? this.allow.delete(code) : this.allow.add(code); this.changed(); }
    setAuto(v) { this.auto = v; this.changed({ type: 'auto' }); }
    async poll(src) {
      if (!src || !src.readCodes || this.busy) return;
      this.busy = true;
      try {
        const prev = new Set([...this.current.stored, ...this.current.pending, ...this.current.body]);
        this.current = await src.readCodes(); this.lastRead = Date.now();
        const nowSet = new Set([...this.current.stored, ...this.current.pending, ...this.current.body]), gone = [...prev].filter((c) => !nowSet.has(c));
        const engine = [...new Set([...this.current.stored, ...this.current.pending])];
        const fresh = [...engine, ...this.current.body].filter((c) => !prev.has(c));
        const unknown = engine.filter((c) => !this.allow.has(c));
        for (const c of fresh) if (!this.allow.has(c) || !ZD.isEngineCode(c)) this.alerts.push({ code: c, meaning: ZD.dtcMeaning(c), t: Date.now() });
        if (this.auto && engine.length && unknown.length === 0) {
          await src.clearCodes();
          const now = Date.now();
          for (const c of engine) {
            const h = this.history.find((x) => x.code === c);
            if (h) { h.count++; h.last = now; } else this.history.push({ code: c, first: now, last: now, count: 1 });
          }
          this.current = await src.readCodes();
          this.changed({ type: 'autocleared', codes: engine });
        } else this.changed({ type: 'read', fresh, gone });
      } finally { this.busy = false; }
    }
    async clearAll(src) {
      await src.clearCodes(); this.current = await src.readCodes(); this.changed({ type: 'cleared' });
    }
  }
  ZD.CodeManager = CodeManager;

  // Parse a Mode 03/07 response ("43 01 33 04 20 00 00") into ["P0133","P0420"]
  ZD.parseDtcResponse = function (resp, modeByte) {
    const hex = resp.replace(/[^0-9A-F]/gi, '').toUpperCase(), out = [];
    let i = hex.indexOf(modeByte); if (i < 0) return out; i += 2;
    if (hex.length - i > 4 && (hex.length - i) % 4 === 2) i += 2; // CAN: count byte
    for (; i + 4 <= hex.length; i += 4) {
      const w = hex.substr(i, 4); if (w === '0000') continue;
      const n = parseInt(w[0], 16);
      out.push('PCBU'[n >> 2] + ((n & 3).toString()) + w.substr(1));
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);

