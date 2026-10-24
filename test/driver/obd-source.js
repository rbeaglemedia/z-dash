(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const DataSource = ZD.DataSource;
  const SimSource = ZD.SimSource;
  /* ---------- (2) CSV replay (EcuTek EcuConnect log export) ---------- */
  // Column names vary by logger/version, so match by keywords. Edit here once we see Bob's file.
  const COLS = {
    t: [/^time/i, /timestamp/i, /elapsed/i],
    rpm: [/engine.?speed/i, /\brpm\b/i, /engine.?rpm/i],
    speed: [/vehicle.?speed/i, /\bvss\b/i, /road.?speed/i, /^speed/i],
    throttle: [/throttle/i, /\btps\b/i, /accel.*pedal/i, /\bapp\b/i],
    gear: [/gear/i],
    clutch: [/clutch/i],
    boost: [/boost/i, /manifold.*press/i, /\bmap\b/i],
    afr: [/afr/i, /air.?fuel/i, /lambda/i, /\bo2\b/i],
    coolant: [/coolant/i, /\becT\b/i, /water.?temp/i],
    oil: [/oil.?temp/i],
    iat: [/intake.?air.?temp/i, /\biat\b/i, /air.?temp/i],
    timing: [/timing/i, /ignition/i, /advance/i],
    volts: [/volt/i, /battery/i],
    load: [/load/i],
    ethanol: [/ethanol/i, /flex/i, /e%/i, /alcohol/i],
    fuelLevel: [/fuel.?level/i, /fuel.?tank/i],
  };
  ZD.parseCsvLog = function (text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const split = (l) => l.split(/[,;\t]/).map((s) => s.trim().replace(/^"|"$/g, ''));
    // header = first line containing an rpm-ish column
    let hi = lines.findIndex((l) => /rpm|engine.?speed/i.test(l));
    if (hi < 0) throw new Error('Could not find a header row with RPM in it');
    const header = split(lines[hi]);
    const map = {}, EXACT = {"lambda b1s1": "lam1", "lambda b2s1": "lam2", "stft b1 (%)": "stft1", "ltft b1 (%)": "ltft1", "stft b2 (%)": "stft2", "ltft b2 (%)": "ltft2", "cat temp b1s1 (f)": "cat1", "cat temp b2s1 (f)": "cat2", "accel pedal d (%)": "pedalD", "accel pedal e (%)": "pedalE", "relative throttle (%)": "relThr", "commanded throttle (%)": "cmdThr", "throttle b (%)": "thrB", "maf (g/s)": "maf", "barometric pressure (kpa)": "baro", "absolute load (%)": "absLoad", "commanded lambda": "cmdLam", "evap purge (%)": "purge", "evap vapor pressure (pa)": "evapVp", "engine run time (s)": "runTime", "distance since codes cleared (mi)": "distClr", "time since codes cleared (min)": "timeClr", "warm-ups since clear": "warmups", "distance with mil (mi)": "distMil", "time with mil (min)": "timeMil", "fuel type": "fuelType", "o2 sensors present": "o2s", "lambda_b1": "lam1", "lambda_b2": "lam2", "stft_b1": "stft1", "ltft_b1": "ltft1", "stft_b2": "stft2", "ltft_b2": "ltft2", "cat_b1_f": "cat1", "cat_b2_f": "cat2", "pedal_d": "pedalD", "pedal_e": "pedalE", "rel_throttle": "relThr", "cmd_throttle": "cmdThr", "throttle_b": "thrB", "maf_gs": "maf", "baro_kpa": "baro", "abs_load": "absLoad", "cmd_lambda": "cmdLam", "evap_purge": "purge", "evap_pa": "evapVp", "run_time_s": "runTime", "dist_since_clear_mi": "distClr", "time_since_clear_min": "timeClr", "warmups_since_clear": "warmups", "dist_mil_mi": "distMil", "time_mil_min": "timeMil", "fuel_type": "fuelType", "o2_sensors": "o2s"}; header.forEach((h, i) => { const k = EXACT[h.toLowerCase()]; if (k && map[k] === undefined) map[k] = i; }); // OBD+ columns by exact name, before the loose matching
    for (const key in COLS) {
      const idx = header.findIndex((h) => COLS[key].some((re) => re.test(h)) && !Object.values(map).includes(header.indexOf(h)));
      if (idx >= 0) map[key] = idx;
    }
    const units = (k) => (map[k] !== undefined ? header[map[k]] : '');
    const kmh = /km/i.test(units('speed'));
    const tempC = (k) => /°?c\b|\(c\)|deg ?c/i.test(units(k));
    const lambda = /lambda/i.test(units('afr'));
    const boostKpaAbs = /kpa/i.test(units('boost')) && !/boost/i.test(units('boost'));
    const msTime = /ms/i.test(units('t'));
    const frames = [];
    for (let i = hi + 1; i < lines.length; i++) {
      const c = split(lines[i]);
      const num = (k) => { if (map[k] === undefined) return null; const v = parseFloat(c[map[k]]); return isFinite(v) ? v : null; };
      if (num('rpm') === null) continue;
      const F = (v) => (v === null ? null : v);
      let t = num('t'); t = t === null ? frames.length * 0.05 : msTime ? t / 1000 : t;
      let speed = num('speed'); if (speed !== null && kmh) speed *= 0.621371;
      let boost = num('boost'); if (boost !== null && boostKpaAbs) boost = (boost - 101.3) * 0.145038;
      let afr = num('afr'); if (afr !== null && lambda) afr *= 14.7;
      const temp = (k) => { const v = num(k); return v === null ? null : tempC(k) ? v * 1.8 + 32 : v; };
      const clutchRaw = map.clutch !== undefined && c[map.clutch] !== '' && c[map.clutch] != null ? c[map.clutch] : null; // blank clutch column (OBD logs) = no clutch switch, not 'released'
      frames.push({
        t, rpm: num('rpm'), speed: F(speed), throttle: F(num('throttle')), gear: F(num('gear')),
        clutch: clutchRaw === null ? null : /^(1|on|true|pressed|depressed|yes)$/i.test(clutchRaw),
        boost, afr, coolant: temp('coolant'), oil: temp('oil'), iat: temp('iat'),
        timing: F(num('timing')), volts: F(num('volts')), load: F(num('load')), ethanol: F(num('ethanol')), fuelLevel: F(num('fuelLevel')), brake: null, latG: null, lonG: null, ...Object.fromEntries(["lam1", "lam2", "stft1", "ltft1", "stft2", "ltft2", "cat1", "cat2", "pedalD", "pedalE", "relThr", "cmdThr", "thrB", "maf", "baro", "absLoad", "cmdLam", "purge", "evapVp", "runTime", "distClr", "timeClr", "warmups", "distMil", "timeMil", "fuelType", "o2s"].map((k) => [k, num(k)])),
      });
    }
    const t0 = frames.length ? frames[0].t : 0; frames.forEach((f) => (f.t -= t0));
    return { frames, mapped: Object.fromEntries(Object.entries(map).map(([k, i]) => [k, header[i]])), header };
  };

  class CsvReplaySource extends DataSource {
    constructor(text, name) { super('CSV'); this.text = text; this.name = name || 'log.csv'; this.speedup = 1; this.loop = true; }
    async start() {
      this.setStatus('connecting');
      const { frames, mapped } = ZD.parseCsvLog(this.text);
      if (!frames.length) throw new Error('No data rows found');
      this.frames = frames; this.mapped = mapped; this.i = 0;
      console.info('[Z-DASH] CSV columns mapped:', mapped);
      let t0 = performance.now();
      this.timer = setInterval(() => {
        const tNow = ((performance.now() - t0) / 1000) * this.speedup;
        while (this.i < frames.length && frames[this.i].t <= tNow) this.emit(frames[this.i++]);
        if (this.i >= frames.length) { if (this.loop) { this.i = 0; t0 = performance.now(); } else this.stop(); }
      }, 20);
      this.setStatus('live', `${this.name} · ${frames.length} rows`);
    }
    stop() { clearInterval(this.timer); this.setStatus('idle'); }
  }

  /* ---------- (3) Live adapters — adapter-agnostic ----------
     The app only needs a TRANSPORT (moves text both ways) + a PROTOCOL (what to send).
     Every standard adapter we support speaks the ELM327 command set (OBDLink's STN chips are
     ELM327-compatible and faster), so one protocol class covers them; adapters differ only in
     how they connect. Add a new adapter by adding a profile to ZD.ADAPTERS — nothing else changes. */
  const SPP_UUID = '00001101-0000-1000-8000-00805f9b34fb';
  ZD.ADAPTERS = {
    'obdlink-mxp': { name: 'OBDLink MX+', transports: ['serial', 'native'], protocol: 'elm327', stn: true, btName: 'OBDLink MX' },
    'obdlink-lx': { name: 'OBDLink LX', transports: ['serial', 'native'], protocol: 'elm327', stn: true, btName: 'OBDLink LX' },
    'obdlink-cx': { name: 'OBDLink CX', transports: ['ble', 'native'], protocol: 'elm327', stn: true, btName: 'OBDLink CX' },
    'elm327-bt': { name: 'Generic ELM327 (Bluetooth)', transports: ['serial', 'ble', 'native'], protocol: 'elm327', btName: 'OBD' },
    'elm327-wifi': { name: 'Generic ELM327 (Wi-Fi)', transports: ['native-tcp'], protocol: 'elm327', host: '192.168.0.10', port: 35000 },
    // Bob's current dongle. Proprietary — EcuTek: "ECU Connect will NOT work with any other interface,
    // including ELMxxx-compatible dongles" and it isn't sold as an open/ELM adapter. Kept here so the
    // picker explains it instead of failing. Its logs still work: ECU Connect exports CSV → REPLAY.
    // FUTURE (not built): if the EVI protocol ever becomes usable (e.g. the r/q50 reverse-engineering effort), this
    // becomes { transports: ['serial', 'native'], protocol: 'ecutek-evi', locked: false, caps: [...whatever it exposes] }
    // plus a ZD.PROTOCOLS['ecutek-evi'] source. Panels whose data isn't in caps auto-hide (ZD.layout.view).
    'ecutek-evi-bt': { name: 'EcuTek EVI-BT (ECU Connect only)', transports: [], protocol: null, locked: true, caps: null,
      note: 'The EcuTek EVI-BT only talks to EcuTek\'s ECU Connect app (proprietary, not ELM327). For live data use a standard adapter like the OBDLink MX+ or CX. You can still replay ECU Connect logs: My Files > Data Logs > Share, then REPLAY A LOG.' },
  };
  // Data an adapter can provide. null/undefined caps = the full standard set (any ELM327/OBDLink on the 370Z).
  // A limited profile lists only what it has, e.g. caps: ['rpm', 'speed', 'throttle', 'coolant', 'iat', 'boost'].
  ZD.adapterCaps = (id = ZD.adapterId()) => { const p = ZD.ADAPTERS[id]; return p && p.caps ? new Set(p.caps) : null; };
  ZD.adapterId = () => { try { return localStorage.getItem('zdash.adapter') || 'obdlink-lx'; } catch (e) { return 'obdlink-lx'; } }; // default = Bob's OBDLink LX when nothing is saved (Oct 18)

  // BLE (OBDLink CX, BLE clones): Web Bluetooth in Chrome on Android.
  class WebBluetoothTransport {
    constructor(prof = {}) { this.prof = prof; }
    async connect() {
      if (!navigator.bluetooth) throw new Error('Web Bluetooth not available in this browser');
      const SERVICES = [0xfff0, 0xffe0, '0000fff0-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2'];
      const filters = [{ namePrefix: 'OBDLink' }, { namePrefix: 'OBD' }, { namePrefix: 'V-LINK' }, { namePrefix: 'IOS-Vlink' }];
      this.dev = await navigator.bluetooth.requestDevice({ filters, optionalServices: SERVICES });
      const srv = await this.dev.gatt.connect();
      let svc; for (const u of SERVICES) { try { svc = await srv.getPrimaryService(u); break; } catch (e) {} }
      if (!svc) throw new Error('Adapter found but no serial service');
      const chars = await svc.getCharacteristics();
      this.tx = chars.find((c) => c.properties.write || c.properties.writeWithoutResponse);
      this.rx = chars.find((c) => c.properties.notify);
      await this.rx.startNotifications();
      this.rx.addEventListener('characteristicvaluechanged', (e) => this.ondata && this.ondata(new TextDecoder().decode(e.target.value)));
    }
    async write(s) { await this.tx.writeValue(new TextEncoder().encode(s)); }
    close() { try { this.dev.gatt.disconnect(); } catch (e) {} }
  }
  // Classic Bluetooth SPP (OBDLink MX+/LX): Web Serial over Bluetooth RFCOMM — Chrome on Android 138+
  // (and desktop Chrome 117+). Pair the adapter in Android Bluetooth settings first.
  class WebSerialTransport {
    constructor(prof = {}) { this.prof = prof; }
    async connect() {
      if (!navigator.serial) throw new Error('Web Serial not available in this browser (needs Chrome 138+ on Android)');
      this.port = await navigator.serial.requestPort({ allowedBluetoothServiceClassIds: [SPP_UUID], filters: [{ bluetoothServiceClassId: SPP_UUID }] });
      await this.port.open({ baudRate: 115200 });
      this.writer = this.port.writable.getWriter(); this.reader = this.port.readable.getReader(); this.open = true;
      (async () => { const dec = new TextDecoder(); try { while (this.open) { const { value, done } = await this.reader.read(); if (done) break; this.ondata && this.ondata(dec.decode(value)); } } catch (e) {} })();
    }
    async write(s) { await this.writer.write(new TextEncoder().encode(s)); }
    async close() { this.open = false; try { await this.reader.cancel(); this.reader.releaseLock(); this.writer.releaseLock(); await this.port.close(); } catch (e) {} }
  }
  // Android app build: a small native plugin (Bluetooth SPP / BLE / Wi-Fi TCP) exposes
  // window.ZDNative.{connect(opts), write, onData, close}. Android WebView has no Web Serial/Bluetooth,
  // so the packaged app always goes through this.
  class NativeTransport {
    constructor(prof = {}, kind = 'native') { this.prof = prof; this.kind = kind; }
    async connect() {
      if (!G.ZDNative) throw new Error('Native bridge not present (only in the Android app build)');
      G.ZDNative.onData((s) => this.ondata && this.ondata(s));
      await G.ZDNative.connect({ kind: this.kind, name: this.prof.btName, host: this.prof.host, port: this.prof.port });
    }
    async write(s) { await G.ZDNative.write(s); }
    close() { G.ZDNative && G.ZDNative.close && G.ZDNative.close(); }
  }
  ZD.TRANSPORTS = { ble: WebBluetoothTransport, serial: WebSerialTransport, native: NativeTransport, 'native-tcp': NativeTransport };
  // Pick the first transport this environment can actually use for the chosen adapter.
  ZD.pickTransport = function (prof) {
    const can = { native: !!G.ZDNative, 'native-tcp': !!G.ZDNative, serial: typeof navigator !== 'undefined' && !!navigator.serial, ble: typeof navigator !== 'undefined' && !!navigator.bluetooth };
    const k = prof.transports.find((t) => can[t]);
    if (!k) return null;
    return k.startsWith('native') ? new NativeTransport(prof, k === 'native-tcp' ? 'tcp' : 'auto') : new ZD.TRANSPORTS[k](prof);
  };
  // Factory used by the UI: returns a live DataSource for an adapter id, or throws a helpful error.
  ZD.makeLiveSource = function (id = ZD.adapterId()) {
    const prof = ZD.ADAPTERS[id]; if (!prof) throw new Error('Unknown adapter ' + id);
    if (prof.locked) { const e = new Error(prof.note); e.locked = true; throw e; }
    const tr = ZD.pickTransport(prof);
    if (!tr) throw new Error(`${prof.name} can't connect from this browser. Use Chrome on Android (${prof.transports.includes('serial') ? 'version 138+ for classic Bluetooth' : 'Web Bluetooth'}) or the Android app build`);
    const mk = ZD.PROTOCOLS[prof.protocol]; if (!mk) throw new Error('No protocol for ' + prof.name);
    const src = mk(tr, prof); src.caps = prof.caps ? new Set(prof.caps) : null; return src;
  };

  // Protocol registry: profile.protocol → source factory. A future 'ecutek-evi' protocol plugs in here; nothing else changes.
  ZD.PROTOCOLS = { elm327: (tr, prof) => new Elm327Source(tr, prof) };
  // ELM327/STN protocol over any transport.
  class Elm327Source extends DataSource {
    constructor(transport, prof = ZD.ADAPTERS['obdlink-mxp']) { super('OBD'); this.prof = prof; this.tr = transport || ZD.pickTransport(prof) || new WebBluetoothTransport(prof); this.buf = ''; this.waiters = []; }
    cmd(s, timeout = 1500) {
      return new Promise((res, rej) => {
        const drop = () => { const i = this.waiters.indexOf(w); if (i >= 0) this.waiters.splice(i, 1); }; // a timed-out waiter must leave the queue, or every later reply goes to the wrong command
        const to = setTimeout(() => { drop(); const e = new Error('timeout ' + s); e.raw = this.buf; rej(e); }, timeout);
        const w = (r) => { clearTimeout(to); res(r); };
        this.waiters.push(w);
        Promise.resolve().then(() => this.tr.write(s + '\r')).catch((e) => { clearTimeout(to); drop(); rej(e); });
      });
    }
    onData(s) {
      this.buf += String(s).replace(/\0/g, '');
      let i; while ((i = this.buf.indexOf('>')) >= 0) { const r = this.buf.slice(0, i).trim(); this.buf = this.buf.slice(i + 1); const w = this.waiters.shift(); w && w(r); }
    }
    async start() {
      this.setStatus('connecting');
      this.tr.ondata = (s) => this.onData(s);
      await this.exclusive(async () => { await this.tr.connect(); await this.init(); }); // locked, so the 4 s trouble-code poll can't interleave '03'/'07' with the init
      if (this.prof.stn) { try { await this.cmd('STI', 1500); } catch (e) {} }
      if (ZD.Clutch) { try { this.clutchProbe = await ZD.Clutch.probe(this); } catch (e) {} } // clutch-switch channel? (stays 'unknown' until verified)
      this.setStatus('live', this.prof.name);
      setTimeout(() => (this.initLog || []).forEach((m) => this.note('obd-init', m)), 1000); // after the recorder + drive log have started // the recorder starts at 'live', so replay the init steps into the run
      this.running = true; this.t0 = performance.now(); this.last = {};
      this.scanQ = ['0100']; this.scanPids = []; this.scanM09 = ''; // one-time supported-PID scan, run in the background between polls
      this.loop();
    }
    // Adapter init (Oct 18 hotfix, OBDLink LX "timeout ATE0"): ATZ resets the chip (~1 s) and drops anything sent meanwhile,
    // and its banner can carry stray '>'s. So: wake, reset, wait, flush, then each setting with retries on a clean buffer.
    async init() {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const flush = () => { this.buf = ''; this.waiters.length = 0; };
      const log = (m) => this.initLog.push(m);
      const raw = (r) => JSON.stringify(String(r == null ? '' : r).slice(-60));
      this.initLog = []; log('transport open');
      try { await this.tr.write('\r'); } catch (e) {} // wake / cancel anything half-sent
      await sleep(300); flush();
      try { log('ATZ ' + raw(await this.cmd('ATZ', 2500))); } catch (e) { log('ATZ no prompt (ok) ' + raw(e.raw)); }
      await sleep(1500); flush(); // let the reset finish; drop the banner and any stray prompts
      for (const c of ['ATE0', 'ATL0', 'ATS0', 'ATH0', 'ATSP6']) { // 370Z = ISO15765 CAN 500k
        let last = '', err = null, ok = false;
        for (let k = 1; k <= 3 && !ok; k++) {
          flush();
          try { last = await this.cmd(c, 2000); err = null; ok = /OK/i.test(last); if (!ok) log(c + ' try ' + k + ' reply ' + raw(last)); }
          catch (e) { err = e; last = e.raw || ''; log(c + ' try ' + k + ' ' + e.message + ' raw ' + raw(last)); }
          if (!ok) await sleep(300);
        }
        if (!ok && (err || !last.replace(/[\s>?]/g, ''))) {
          const e = new Error(`adapter didn't answer ${c} after 3 tries (${err ? err.message : 'bad reply'}), last reply ${raw(last)}`);
          log(e.message); throw e;
        }
        log(c + (ok ? ' OK' : ' accepted ' + raw(last)));
      }
      flush();
      try { const r = await this.cmd('0100', 6000); log('0100 ' + raw(r) + (/41\s*00/i.test(r) ? ' ECU ok' : ' (no ECU answer yet)')); } // first request does SEARCHING...
      catch (e) { log('0100 timeout raw ' + raw(e.raw)); }
      flush();
    }
    // Mode 01 PIDs. Up to 6 PIDs per request on CAN; STN chips answer fast (~15-25 req/s).
    async loop() {
      const fast = '010C0D110B', slow = ['01050F0E42', '01042F']; let n = 0, ri = 0, si = 0;
      while (this.running) {
        try {
          await this.exclusive(async () => {
            if (this.scanQ && this.scanQ.length) await this.scanStep(); // one supported-PID request per cycle, so it never holds up the gauges
            const X = this.extra(), fx = X.fast.length && n % 2 ? X.fast[ri++ % X.fast.length] : '';
            const pt = performance.now(); await this.poll(fast + fx); this.pollMs = performance.now() - pt; // every other cycle: + 2 rotating extra PIDs in the same request (no extra round trip)
            if (n++ % 10 === 0) { for (const s of slow) await this.poll(s); if (!this.has42) await this.readVolts(); }
            if (n % 20 === 6 && X.slow.length) await this.poll(X.slow[si++ % X.slow.length]); // OBD+ slow round-robin: temps / air / since-clear, one request every 20 cycles // no PID 42 -> adapter battery voltage (ATRV)
          });
          if (ZD.Rec) ZD.Rec.pollDone(this.last, this.pollMs);
          if (performance.now() - (this.okAt || 0) > 2500) { this.last = {}; await new Promise((r) => setTimeout(r, 250)); continue; } // ECU not answering (key off / asleep): no stale frames
          const L = this.last;
          this.emit({
            t: (performance.now() - this.t0) / 1000, rpm: L.rpm ?? null, speed: L.speed ?? null, throttle: L.throttle ?? null,
            gear: null, clutch: null, boost: L.map !== undefined ? (L.map - 101.3) * 0.145038 : null, afr: L.lam1 != null || L.lam2 != null ? 14.7 * (L.lam1 != null && L.lam2 != null ? (L.lam1 + L.lam2) / 2 : L.lam1 ?? L.lam2) : null, // gasoline-equivalent AFR from wideband lambda
            coolant: L.coolant ?? null, oil: null, iat: L.iat ?? null, timing: L.timing ?? null, volts: L.volts ?? null,
            load: L.load ?? null, ethanol: null, fuelLevel: L.fuelLevel ?? null, brake: null, latG: null, lonG: null, ...Object.fromEntries(["lam1", "lam2", "stft1", "ltft1", "stft2", "ltft2", "cat1", "cat2", "pedalD", "pedalE", "relThr", "cmdThr", "thrB", "maf", "baro", "absLoad", "cmdLam", "purge", "evapVp", "runTime", "distClr", "timeClr", "warmups", "distMil", "timeMil", "fuelType", "o2s"].map((k) => [k, L[k] ?? null])),
          });
        } catch (e) { console.warn(e); if (ZD.Rec) { const tn = performance.now(); this.errN = (this.errN || 0) + 1; if (!this.errT || tn - this.errT > 1000) { ZD.Rec.event('obd-error', (e && e.message) + (this.errN > 1 ? ' x' + this.errN : '')); this.errT = tn; this.errN = 0; } } await new Promise((r) => setTimeout(r, 250)); }
      }
    }
    // OBD+ extra PIDs, only the ones this car reported as supported (scan, or the cached scan from last time)
    extra() { const sup = this.supported || this.cachedSup || (this.cachedSup = (() => { try { return JSON.parse(localStorage.getItem('zdash.obd.pids')).mode01 || []; } catch (e) { return []; } })());
      if (this._xs === sup) return this._x; this._xs = sup; const has = (p) => sup.includes(p), F = [];
      for (const pr of [['24', '28'], ['06', '08'], ['24', '28'], ['49', '45'], ['24', '28'], ['07', '09']]) { const s = pr.filter(has).join(''); if (s) F.push(s); } // lambda ~1/4, each trim / pedal pair ~1/12 of fast cycles
      const grp = (l) => { const s = l.filter(has); return s.length ? '01' + s.join('') : null; };
      const SL = [grp(['3C', '3D', '33', '43', '44', '2E']), grp(['32', '4C', '47', '4A', '66']), grp(['3C', '3D', '33', '43', '44', '2E']), grp(['1F', '31', '4E', '30', '21', '4D']), grp(['51', '13'])].filter(Boolean);
      return (this._x = { fast: F, slow: SL }); }
    // Supported-PID scan: 0100 / 0120 / 0140 ... while the bitmask says the next block exists, then 0900 (Mode 09 info).
    // Read-only requests only. Result -> '# supported-pids: ...' row in the run export + localStorage 'zdash.obd.pids'.
    async scanStep() {
      const q = this.scanQ.shift(); let r = '';
      try { r = await this.cmd(q, 3000); } catch (e) { r = 'timeout'; }
      const hex = String(r).split(/[\r\n]+/).map((l) => l.replace(/\s+/g, '').toUpperCase().replace(/^[0-9A-F]:/, '')).filter((l) => /^[0-9A-F]+$/.test(l) && l.length % 2 === 0).join('');
      if (q.startsWith('01')) {
        const blk = parseInt(q.slice(2), 16), j = hex.indexOf('41' + q.slice(2));
        if (j >= 0 && hex.length >= j + 12) { const m = parseInt(hex.substr(j + 4, 8), 16) >>> 0;
          for (let k = 0; k < 32; k++) if (m & (0x80000000 >>> k)) this.scanPids.push((blk + k + 1).toString(16).toUpperCase().padStart(2, '0'));
          if ((m & 1) && blk < 0xE0) this.scanQ.unshift('01' + (blk + 0x20).toString(16).toUpperCase().padStart(2, '0')); }
        if (!this.scanQ.some((x) => x.startsWith('01'))) this.scanQ.push('0900');
      } else if (q === '0900') { this.scanM09 = hex.slice(hex.indexOf('4900') >= 0 ? hex.indexOf('4900') : 0).slice(0, 40) || String(r).slice(0, 40);
        const j = hex.indexOf('4900'), m = j >= 0 ? parseInt(hex.substr(j + 4, 8), 16) >>> 0 : 0; if (m & 0x40000000) this.scanQ.push('0902'); if (m & 0x10000000) this.scanQ.push('0904'); } // VIN, calibration ID (once)
      else { const asc = (h) => h.replace(/../g, (x) => { const c = parseInt(x, 16); return c > 32 && c < 127 ? String.fromCharCode(c) : ''; }), k = hex.indexOf(q === '0902' ? '4902' : '4904'), txt = k >= 0 ? asc(hex.slice(k + 6)) : '';
        (this.info ||= {})[q === '0902' ? 'vin' : 'calid'] = txt || null; if (txt) this.note(q === '0902' ? 'vin' : 'calid', txt); }
      if (!this.scanQ.length) {
        const pids = this.scanPids.filter((p) => p.slice(1) !== '0' || !['20', '40', '60', '80', 'A0', 'C0', 'E0'].includes(p)); // drop the "next block supported" markers
        this.supported = pids;
        try { localStorage.setItem('zdash.obd.pids', JSON.stringify({ t: Date.now(), adapter: this.prof && this.prof.name, mode01: pids, mode09: this.scanM09 })); } catch (e) {}
        if (ZD.Rec && ZD.Rec.run) ZD.Rec.run.obd = { mode01: pids, mode09: this.scanM09, vin: (this.info || {}).vin, calid: (this.info || {}).calid }; // -> EXPORT RUN header comments
        this.note('supported-pids', pids.join(' ') || 'none'); this.note('mode09', this.scanM09 || 'none');
      }
    }
    // One Mode 01 group. Multi-PID first; if the reply doesn't parse cleanly, ask each PID on its own (3 bad multi replies -> per-PID for good).
    async poll(req) {
      this.noPid ||= new Set(); this.multiBad ||= {}; this.miss ||= {};
      const want = []; for (let i = 2; i < req.length; i += 2) if (!this.noPid.has(req.substr(i, 2))) want.push(req.substr(i, 2));
      if (!want.length) return;
      if (want.length > 1 && (this.multiBad[req] || 0) < 3) { const q = '01' + want.join(''); if (this.parse(await this.cmd(q), q)) return;
        if (!this.badHex) return; this.multiBad[req] = (this.multiBad[req] || 0) + 1; } // NO DATA / STOPPED (no bytes at all): just skip this cycle
      const no = []; let ok = 0;
      for (const p of want) { const q = '01' + p, r = await this.cmd(q), got = this.parse(r, q); if (got && got.has(p)) { ok++; this.miss[p] = 0; } else if (/NO DATA|\?/.test(r)) no.push([p, q, r]); }
      if (ok) for (const [p, q, r] of no) if ((this.miss[p] = (this.miss[p] || 0) + 1) >= 3) { this.noPid.add(p); this.rawNote('obd-nopid', q, r); } // unsupported only while the ECU answers the others
    }
    async readVolts() { try { const m = (await this.cmd('ATRV')).match(/(\d{1,2}(?:\.\d+)?)\s*V/i); if (m && +m[1] > 5 && +m[1] < 20) this.last.volts = +m[1]; } catch (e) {} }
    // Raw replies into the run file: the first 50 after connect plus parse failures (capped), so real logs can be debugged without bloating it.
    rawNote(kind, q, r) { if (!(ZD.Rec && ZD.Rec.on) && !(G.ZDAPP && G.ZDAPP.log && G.ZDAPP.log.cur)) return; this.rawN ||= { 'obd-raw': 0, 'obd-bad': 0, 'obd-nopid': 0 };
      if (this.rawN[kind] >= (kind === 'obd-raw' ? 50 : 100)) return; this.rawN[kind]++; this.note(kind, q + ' => ' + JSON.stringify(String(r)).slice(0, 140)); }
    // debug note -> run recorder event AND a '# kind ...' comment row in the drive-log CSV (the file EXPORT gives Bob)
    note(kind, text) { try { if (ZD.Rec && ZD.Rec.on) ZD.Rec.event(kind, text); const DL = G.ZDAPP && G.ZDAPP.log; if (DL && DL.note) DL.note(kind, text); } catch (e) {} }
    // Mode 01 reply -> this.last. Handles CAN multi-frame (ISO-TP) replies with headers off, e.g.
    //   "00A\r0:410C0B2E0D00\r1:11140B1E" : a 3-digit byte-count line, then "N:" frame-index prefixes on each line.
    // Returns the Set of PIDs read, or null if the reply is inconsistent (nothing is applied then).
    parse(resp, req = '') {
      const lens = { '0C': 2, '0D': 1, '11': 1, '0B': 1, '05': 1, '0F': 1, '0E': 1, '42': 2, '04': 1, '2F': 1, '24': 4, '28': 4, '06': 1, '07': 1, '08': 1, '09': 1, '3C': 2, '3D': 2, '49': 1, '4A': 1, '45': 1, '4C': 1, '47': 1, '66': 5, '33': 1, '43': 2, '44': 2, '2E': 1, '32': 2, '1F': 2, '31': 2, '4E': 2, '30': 1, '21': 2, '4D': 2, '51': 1, '13': 1 };
      this.rawNote('obd-raw', req, resp);
      let hex = '', count = 0, counts = 0; this.badHex = false;
      for (let ln of String(resp).split(/[\r\n]+/)) {
        ln = ln.replace(/\s+/g, '').toUpperCase(); if (!ln || ln === req) continue; // blank / echoed command
        if (/^[0-9A-F]{3}$/.test(ln)) { count = parseInt(ln, 16); counts++; continue; } // ISO-TP byte count
        ln = ln.replace(/^[0-9A-F]:/, ''); // frame index "0:", "1:" ...
        if (/^[0-9A-F]+$/.test(ln) && ln.length % 2 === 0) hex += ln; // SEARCHING..., NO DATA, STOPPED etc. are skipped
      }
      let B = hex.match(/../g) || []; if (counts === 1 && B.length > count) B = B.slice(0, count); // drop last-frame padding
      const want = new Set(); for (let i = 2; i < req.length; i += 2) want.add(req.substr(i, 2).toUpperCase());
      const bad = () => { this.badHex = true; this.rawNote('obd-bad', req, resp); return null; };
      let i = B.indexOf('41'); if (i < 0) return hex ? bad() : null;
      const vals = []; i++;
      while (i < B.length) {
        const pid = B[i], n = lens[pid];
        if (n && (!want.size || want.has(pid)) && i + n < B.length) { vals.push([pid, B.slice(i + 1, i + 1 + n).map((x) => parseInt(x, 16))]); i += 1 + n; continue; }
        if (pid === '41') { i++; continue; } // a second "41" block (another ECU answering)
        if (B.slice(i).every((x) => x === '00' || x === 'AA' || x === '55')) break; // CAN padding
        return bad();
      }
      if (!vals.length) return bad();
      const L = this.last, got = new Set(); this.okAt = performance.now();
      for (const [pid, b] of vals) {
        got.add(pid);
        switch (pid) {
          case '0C': L.rpm = (b[0] * 256 + b[1]) / 4; break;
          case '0D': L.speed = b[0] * 0.621371; break;
          case '11': L.throttle = (b[0] * 100) / 255; break;
          case '0B': L.map = b[0]; break; // kPa abs (stock sensor may cap out under boost — EcuTek may expose a better one)
          case '05': L.coolant = (b[0] - 40) * 1.8 + 32; break;
          case '0F': L.iat = (b[0] - 40) * 1.8 + 32; break;
          case '0E': L.timing = b[0] / 2 - 64; break;
          case '42': L.volts = (b[0] * 256 + b[1]) / 1000; this.has42 = true; break;
          case '04': L.load = (b[0] * 100) / 255; break;
          case '2F': L.fuelLevel = (b[0] * 100) / 255; break;
          case '24': L.lam1 = ((b[0] * 256 + b[1]) * 2) / 65536; break; case '28': L.lam2 = ((b[0] * 256 + b[1]) * 2) / 65536; break; // wideband: lambda (fuel-independent)
          case '06': L.stft1 = ((b[0] - 128) * 100) / 128; break; case '07': L.ltft1 = ((b[0] - 128) * 100) / 128; break; case '08': L.stft2 = ((b[0] - 128) * 100) / 128; break; case '09': L.ltft2 = ((b[0] - 128) * 100) / 128; break;
          case '3C': L.cat1 = ((b[0] * 256 + b[1]) / 10 - 40) * 1.8 + 32; break; case '3D': L.cat2 = ((b[0] * 256 + b[1]) / 10 - 40) * 1.8 + 32; break;
          case '49': L.pedalD = (b[0] * 100) / 255; break; case '4A': L.pedalE = (b[0] * 100) / 255; break; case '45': L.relThr = (b[0] * 100) / 255; break; case '4C': L.cmdThr = (b[0] * 100) / 255; break; case '47': L.thrB = (b[0] * 100) / 255; break;
          case '66': if (b[0] & 1) L.maf = (b[1] * 256 + b[2]) / 32; else if (b[0] & 2) L.maf = (b[3] * 256 + b[4]) / 32; break;
          case '33': L.baro = b[0]; break; case '43': L.absLoad = ((b[0] * 256 + b[1]) * 100) / 255; break; case '44': L.cmdLam = ((b[0] * 256 + b[1]) * 2) / 65536; break; case '2E': L.purge = (b[0] * 100) / 255; break;
          case '32': { let v = b[0] * 256 + b[1]; if (v > 32767) v -= 65536; L.evapVp = v / 4; break; }
          case '1F': L.runTime = b[0] * 256 + b[1]; break; case '31': L.distClr = (b[0] * 256 + b[1]) * 0.621371; break; case '4E': L.timeClr = b[0] * 256 + b[1]; break; case '30': L.warmups = b[0]; break;
          case '21': L.distMil = (b[0] * 256 + b[1]) * 0.621371; break; case '4D': L.timeMil = b[0] * 256 + b[1]; break; case '51': L.fuelType = b[0]; break; case '13': L.o2s = b[0]; break; // factory sender — unreliable when low
        }
      }
      return got;
    }
    // Trouble codes: Mode 03 stored, Mode 07 pending, Mode 04 clear (engine computer only).
    // TPMS/body codes need Nissan-specific requests to other modules (ATSH header + service 0x21/0x19) — TODO.
    async exclusive(fn) { const prev = this.lock || Promise.resolve(); let rel; this.lock = new Promise((r) => (rel = r)); await prev; try { return await fn(); } finally { rel(); } }
    async readCodes() {
      return this.exclusive(async () => ({ stored: ZD.parseDtcResponse(await this.cmd('03', 3000), '43'), pending: ZD.parseDtcResponse(await this.cmd('07', 3000), '47'), body: [] }));
    }
    async clearCodes() { return this.exclusive(async () => { await this.cmd('04', 5000); }); }
    stop() { this.running = false; this.tr.close(); this.setStatus('idle'); }
  }

  Object.assign(ZD, { DataSource, SimSource, CsvReplaySource, Elm327Source, ObdElmSource: Elm327Source, WebBluetoothTransport, WebSerialTransport, NativeTransport });
})(typeof window !== 'undefined' ? window : globalThis);
