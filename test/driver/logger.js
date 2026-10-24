
/* Z-DASH — automatic drive logger. Every drive's raw data is saved on the phone (IndexedDB)
   as a CSV in the same format CSV replay reads, so Bob can export/share it and we can tune
   scoring from real drives. In the Android build, export goes through the Share sheet. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const COLS = ['t', 'rpm', 'speed', 'throttle', 'gear', 'clutch', 'boost', 'afr', 'ethanol', 'coolant', 'oil', 'iat', 'timing', 'volts', 'load', 'fuelLevel', 'latG', 'lonG', ...["lam1", "lam2", "stft1", "ltft1", "stft2", "ltft2", "cat1", "cat2", "pedalD", "pedalE", "relThr", "cmdThr", "thrB", "maf", "baro", "absLoad", "cmdLam", "purge", "evapVp", "runTime", "distClr", "timeClr", "warmups", "distMil", "timeMil", "fuelType", "o2s"]];
  const HEAD = ['Time (s)', 'Engine Speed (RPM)', 'Vehicle Speed (mph)', 'Throttle Position (%)', 'Gear', 'Clutch Switch', 'Boost (psi)', 'AFR', 'Ethanol Content (%)', 'Coolant Temp (F)', 'Oil Temp (F)', 'Intake Air Temp (F)', 'Ignition Timing (deg)', 'Battery Voltage (V)', 'Engine Load (%)', 'Fuel Level (%)', 'Lateral G', 'Longitudinal G', ...["Lambda B1S1", "Lambda B2S1", "STFT B1 (%)", "LTFT B1 (%)", "STFT B2 (%)", "LTFT B2 (%)", "Cat Temp B1S1 (F)", "Cat Temp B2S1 (F)", "Accel Pedal D (%)", "Accel Pedal E (%)", "Relative Throttle (%)", "Commanded Throttle (%)", "Throttle B (%)", "MAF (g/s)", "Barometric Pressure (kPa)", "Absolute Load (%)", "Commanded Lambda", "Evap Purge (%)", "Evap Vapor Pressure (Pa)", "Engine Run Time (s)", "Distance Since Codes Cleared (mi)", "Time Since Codes Cleared (min)", "Warm-ups Since Clear", "Distance With MIL (mi)", "Time With MIL (min)", "Fuel Type", "O2 Sensors Present"]];
  const MAX_DRIVES = 20;

  function idb() {
    return new Promise((res, rej) => {
      if (!G.indexedDB) return rej(new Error('no IndexedDB'));
      const r = indexedDB.open('zdash-logs', 1);
      r.onupgradeneeded = () => { const db = r.result; db.createObjectStore('drives', { keyPath: 'id' }); db.createObjectStore('chunks', { autoIncrement: true }).createIndex('drive', 'drive'); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  const tx = (db, stores, mode = 'readonly') => db.transaction(stores, mode);
  const req = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

  class DriveLogger {
    constructor() { this.cur = null; this.rows = []; this.dbp = idb().catch(() => null); this.flushT = null; }
    async start(sourceLabel, meta = {}) {
      await this.stop();
      const id = new Date().toISOString().replace(/[:.]/g, '-');
      this.cur = { id, started: Date.now(), source: sourceLabel, rows: 0, shifts: 0, miles: 0, ran: 0, meta };
      const db = await this.dbp; if (db) await req(tx(db, ['drives'], 'readwrite').objectStore('drives').put(this.cur));
      this.flushT = setInterval(() => this.flush(), 10000);
      this.prune();
    }
    add(f) {
      if (!this.cur) return;
      this.rows.push(COLS.map((k) => { const v = f[k]; return v === null || v === undefined ? '' : typeof v === 'boolean' ? (v ? 'On' : 'Off') : v; }).join(','));
      this.cur.rows++; if (f.rpm >= 400) this.cur.ran = 1;
    }
    note(kind, data) { if (this.cur) this.rows.push('# ' + kind + ' ' + JSON.stringify(data)); if (kind === 'shift' && this.cur) this.cur.shifts++; }
    async flush() {
      if (!this.cur || !this.rows.length) return;
      const db = await this.dbp, chunk = this.rows.join('\n'); this.rows = [];
      if (!db) { (this.mem ||= []).push(chunk); return; }
      const t = tx(db, ['drives', 'chunks'], 'readwrite');
      t.objectStore('chunks').add({ drive: this.cur.id, text: chunk });
      t.objectStore('drives').put({ ...this.cur, ended: Date.now() });
    }
    async stop(extra = {}) {
      if (!this.cur) return; clearInterval(this.flushT);
      Object.assign(this.cur, extra); await this.flush(); const done = this.cur; this.cur = null;
      await this.prune(); return done;
    }
    async list() {
      const db = await this.dbp; if (!db) return this.cur ? [this.cur] : [];
      const all = await req(tx(db, ['drives']).objectStore('drives').getAll());
      return all.sort((a, b) => b.started - a.started);
    }
    async csv(id) {
      await this.flush();
      const db = await this.dbp; let text = (this.mem || []).join('\n');
      let d = this.cur && this.cur.id === id ? this.cur : null;
      if (db) {
        d = d || (await req(tx(db, ['drives']).objectStore('drives').get(id)));
        const chunks = await req(tx(db, ['chunks']).objectStore('chunks').index('drive').getAll(id));
        text = chunks.map((c) => c.text).join('\n');
      }
      const C = ZD.CAR;
      return `# Z-DASH drive log v1 · ${C.name} ${C.edition} · source ${d ? d.source : '?'} · started ${d ? new Date(d.started).toISOString() : ''}\n# rows starting with # are events (shift scores, codes) for tuning\n${HEAD.join(',')}\n${text}\n`;
    }
    async exportDrive(id) {
      const text = await this.csv(id), name = `zdash-drive-${id}.csv`;
      const file = typeof File !== 'undefined' ? new File([text], name, { type: 'text/csv' }) : null;
      if (G.ZDNative && G.ZDNative.shareFile) return G.ZDNative.shareFile(name, text); // Android build: Share sheet
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: 'Z-DASH drive log' }); return 'shared'; } catch (e) { /* fall back to download */ } }
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      return 'downloaded';
    }
    async remove(id) {
      const db = await this.dbp; if (!db) return;
      const t = tx(db, ['drives', 'chunks'], 'readwrite'); t.objectStore('drives').delete(id);
      const keys = await req(t.objectStore('chunks').index('drive').getAllKeys(id)); keys.forEach((k) => t.objectStore('chunks').delete(k));
    }
    async prune() {
      const l = await this.list(), live = this.cur && this.cur.id;
      for (const d of l) if (d.id !== live && (d.rows < 50 || d.ran === 0)) await this.remove(d.id); // drop empty/aborted drives and ones where the engine never ran
      const junk = (d) => /\(demo\)/.test(d.source || '') || (d.ran == null && !(d.miles > 0) && !d.shifts && d.rows < 1200); // demo drives, and pre-fix 3-second "trips" (0 mi, no shifts)
      for (const d of l.filter((d) => d.id === live || (d.rows >= 50 && d.ran !== 0)).sort((a, b) => (a.id === live ? -1 : b.id === live ? 1 : junk(a) - junk(b)) || b.started - a.started).slice(MAX_DRIVES)) await this.remove(d.id); // over 20: junk goes first, real drives last
    }
  }
  ZD.DriveLogger = DriveLogger;
})(typeof window !== 'undefined' ? window : globalThis);

