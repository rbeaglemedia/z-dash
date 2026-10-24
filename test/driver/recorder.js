
/* Z-DASH — RUN RECORDER (real-car diagnostics). Starts by itself when a live OBD adapter connects and records:
   every frame at the real poll rate (rpm, speed, gear, throttle, coolant + every raw PID received, poll latency),
   OBD status changes / errors / reconnects, and app health once a second (fps, worst frame, long tasks > 50 ms,
   visibility / page-hide / freeze, wake-lock state). Rows are buffered in memory and written to IndexedDB in
   chunks every few seconds (and on page-hide), so a crash or reload keeps everything up to the last chunk.
   Keeps the last 5 runs. Settings → EXPORT RUN shares a CSV + JSON summary (share sheet, or a download).
   Cheap by design: one array push per frame, one tiny rAF counter, no work on the drawing path. ?norec turns it off. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {}), MAX_RUNS = 5, FLUSH_MS = 4000;
  const PIDS = ['rpm', 'speed', 'throttle', 'map', 'coolant', 'iat', 'timing', 'volts', 'load', 'fuelLevel'];
  const COLS = ['type', 't_ms', 'rpm', 'speed_mph', 'gear', 'throttle', 'coolant_f', 'map_kpa', 'iat_f', 'timing', 'volts', 'load', 'fuel', 'poll_ms', 'fps', 'frame_max_ms', 'longtasks', 'info', ...["lambda_b1", "lambda_b2", "stft_b1", "ltft_b1", "stft_b2", "ltft_b2", "cat_b1_f", "cat_b2_f", "pedal_d", "pedal_e", "rel_throttle", "cmd_throttle", "throttle_b", "maf_gs", "baro_kpa", "abs_load", "cmd_lambda", "evap_purge", "evap_pa", "run_time_s", "dist_since_clear_mi", "time_since_clear_min", "warmups_since_clear", "dist_mil_mi", "time_mil_min", "fuel_type", "o2_sensors"]];
  const off = (() => { try { return new URLSearchParams(location.search).has('norec'); } catch (e) { return false; } })();
  let dbp = null; const db = () => (dbp ||= new Promise((res) => { try { const r = indexedDB.open('zdash-runs', 1); r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('runs', { keyPath: 'id' }); d.createObjectStore('chunks', { autoIncrement: true }).createIndex('run', 'run'); }; r.onsuccess = () => res(r.result); r.onerror = () => res(null); } catch (e) { res(null); } }));
  const rq = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const R = (ZD.Rec = { on: false, run: null, buf: [], poll: null, t0: 0, frames: 0, fmax: 0, lt: 0, ltMax: 0, n: 0, listeners: [] });
  const now = () => Math.round(performance.now() - R.t0);
  const num = (v, d = 1) => (v == null || Number.isNaN(v) ? '' : +(+v).toFixed(d));
  R.status = () => (R.on ? `RECORDING · ${R.n} samples` : 'idle (starts when the OBD adapter connects)');
  R.changed = () => R.listeners.forEach((f) => { try { f(); } catch (e) {} });

  R.start = async function (label, meta = {}) { if (off) return; if (R.on) await R.stop('restart');
    R.t0 = performance.now(); const id = new Date().toISOString().replace(/[:.]/g, '-');
    R.run = { id, started: Date.now(), label, ua: navigator.userAgent, screen: `${screen.width}x${screen.height}@${devicePixelRatio}`, build: G.ZD_BUILD || '', meta, samples: 0, events: 0, chunks: 0, ran: 0 };
    R.on = true; R.n = 0; R.buf = []; R.event('start', label); R.event('wake', ZD.wake ? (ZD.wake.lock ? 'wakelock' : ZD.wake.how || 'none') : 'n/a'); if (window.ZD_JR && R.armBattery) R.armBattery(); if (!R._armed) { R._armed = true; requestAnimationFrame(tick); }
    const d = await db(); if (d) { try { await rq(d.transaction('runs', 'readwrite').objectStore('runs').put(R.run)); } catch (e) {} }
    clearInterval(R.flushT); R.flushT = setInterval(R.flush, FLUSH_MS); R.prune(); R.changed(); };
  R.stop = async function (why = 'stop') { if (!R.on) return; R.event('stop', why); R.on = false; clearInterval(R.flushT); await R.flush(); R.changed(); };
  /* raw OBD poll results, called by the OBD source after each poll cycle */
  R.pollDone = function (last, ms) { R.poll = { last, ms }; };
  /* one row per frame the dash receives (= real poll rate) */
  R.sample = function (f, gear) { if (!R.on) return; if (f.rpm >= 400 && R.run && !R.run.ran) R.run.ran = 1; const L = (R.poll && R.poll.last) || {}, ms = R.poll ? R.poll.ms : null; R.poll = null;
    R.buf.push(['s', now(), num(f.rpm, 0), num(f.speed), f.gear ?? gear ?? (ZD.inferGear && f.rpm && f.speed > 3 ? ZD.inferGear(f.rpm, f.speed) ?? '' : ''), num(f.throttle), num(f.coolant, 0), num(L.map, 0), num(f.iat, 0), num(f.timing), num(f.volts, 2), num(f.load), num(f.fuelLevel), num(ms, 0), '', '', '', '', ...["lam1", "lam2", "stft1", "ltft1", "stft2", "ltft2", "cat1", "cat2", "pedalD", "pedalE", "relThr", "cmdThr", "thrB", "maf", "baro", "absLoad", "cmdLam", "purge", "evapVp", "runTime", "distClr", "timeClr", "warmups", "distMil", "timeMil", "fuelType", "o2s"].map((k) => num(f[k], 3))]); R.n++; };
  R.event = function (kind, info) { if (!R.on) return; const row = new Array(COLS.length).fill(''); row[0] = 'e'; row[1] = now(); row[17] = String(kind) + (info != null && info !== '' ? ':' + String(info).replace(/[\n,]/g, ' ').slice(0, 160) : ''); R.buf.push(row); if (R.run) R.run.events++; };
  R.flush = async function () { if (!R.run || !R.buf.length) return; const rows = R.buf; R.buf = []; R.run.samples = R.n; R.run.ended = Date.now(); R.run.chunks++;
    const d = await db(); if (!d) { (R.mem ||= []).push(...rows); return; }
    try { const t = d.transaction(['runs', 'chunks'], 'readwrite'); t.objectStore('chunks').add({ run: R.run.id, rows }); t.objectStore('runs').put(Object.assign({}, R.run)); } catch (e) { (R.mem ||= []).push(...rows); } };
  R.list = async function () { const d = await db(); if (!d) return R.run ? [R.run] : []; const all = await rq(d.transaction('runs').objectStore('runs').getAll()); return all.sort((a, b) => b.started - a.started); };
  R.prune = async function () { const d = await db(); if (!d) return; const l = (await R.list()).sort((a, b) => (a.ran === 0) - (b.ran === 0) || b.started - a.started); for (const r of l.slice(MAX_RUNS)) { if (R.run && r.id === R.run.id) continue; // runs where the engine never ran are evicted first
      const t = d.transaction(['runs', 'chunks'], 'readwrite'); t.objectStore('runs').delete(r.id); const keys = await rq(t.objectStore('chunks').index('run').getAllKeys(r.id)); keys.forEach((k) => t.objectStore('chunks').delete(k)); } };
  R.rows = async function (id) { if (R.run && R.run.id === id) await R.flush(); const d = await db(); let rows = [];
    if (d) { const ch = await rq(d.transaction('chunks').objectStore('chunks').index('run').getAll(id)); ch.forEach((c) => rows.push(...c.rows)); } if (R.mem && R.run && R.run.id === id) rows.push(...R.mem); return rows; };
  R.summary = function (run, rows) { const s = rows.filter((r) => r[0] === 's'), h = rows.filter((r) => r[0] === 'h'), e = rows.filter((r) => r[0] === 'e'); const gaps = []; let maxGap = 0;
    for (let i = 1; i < s.length; i++) { const g = s[i][1] - s[i - 1][1]; maxGap = Math.max(maxGap, g); if (g > 500) gaps.push({ at_ms: s[i - 1][1], gap_ms: g }); }
    const fps = h.map((r) => +r[14]).filter((v) => v > 0).sort((a, b) => a - b), poll = s.map((r) => +r[13]).filter((v) => v > 0).sort((a, b) => a - b), q = (a, p) => (a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : null);
    const evc = {}; e.forEach((r) => { const k = String(r[17]).split(':')[0]; evc[k] = (evc[k] || 0) + 1; });
    const dur = s.length ? (s[s.length - 1][1] - s[0][1]) / 1000 : 0;
    return { run, duration_s: +dur.toFixed(1), samples: s.length, sample_hz: dur ? +(s.length / dur).toFixed(2) : 0, gaps_over_500ms: gaps.length, worst_gap_ms: maxGap, gaps: gaps.slice(0, 50),
      fps: { min: fps[0] ?? null, p05: q(fps, 0.05), median: q(fps, 0.5) }, poll_ms: { median: q(poll, 0.5), p95: q(poll, 0.95), max: poll[poll.length - 1] ?? null }, long_tasks: h.reduce((a, r) => a + (+r[16] || 0), 0), events: evc,
      hidden_or_sleep: e.filter((r) => /^(hidden|pagehide|freeze)/.test(r[17])).map((r) => ({ at_ms: r[1], what: r[17] })) }; };
  R.export = async function (id) { const l = await R.list(); if (!id && l[0] && l[0].ran === 0) { const d = l.find((r) => r.ran !== 0); if (d) return R.export2([d, l[0]]); } const run = id ? l.find((r) => r.id === id) : l[0]; if (!run) return 'none'; return R.export2([run]); };
  R.export2 = async function (runs) { const out = []; for (const run of runs) {
    const obd = (R.run && R.run.id === run.id && R.run.obd) || run.obd; // supported-PID scan from the OBD source (first second after connect)
    const rows = await R.rows(run.id), csv = `# Z-DASH run recorder v1 · ${run.label} · started ${new Date(run.started).toISOString()} · build ${run.build}\n# type: s = sample (one per OBD frame), h = app health (1 per second), e = event\n${obd ? `# supported-pids: ${obd.mode01.join(' ') || 'none'}\n# mode09: ${obd.mode09 || 'none'}\n${obd.vin ? '# vin: ' + obd.vin + '\n' : ''}${obd.calid ? '# calid: ' + obd.calid + '\n' : ''}` : ''}${COLS.join(',')}\n` + rows.map((r) => r.join(',')).join('\n') + '\n';
    const sum = JSON.stringify(R.summary(run, rows), null, 1), base = `zdash-run-${run.id}`; out.push([csv, sum, base]); }
    const files = typeof File !== 'undefined' ? out.flatMap(([csv, sum, base]) => [new File([csv], base + '.csv', { type: 'text/csv' }), new File([sum], base + '.json', { type: 'application/json' })]) : null;
    if (G.ZDNative && G.ZDNative.shareFile) { out.forEach(([csv, , base]) => G.ZDNative.shareFile(base + '.csv', csv)); return 'shared'; }
    if (files && navigator.canShare && navigator.canShare({ files })) { try { await navigator.share({ files, title: 'Z-DASH run ' + out[0][2].slice(10), text: 'Z-DASH run recording' }); return 'shared'; } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; } }
    for (const [txt, name, type] of out.flatMap(([csv, sum, base]) => [[csv, base + '.csv', 'text/csv'], [sum, base + '.json', 'application/json']])) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 8000); }
    return 'downloaded'; };

  /* app health: a tiny rAF counter (no drawing), long tasks, visibility / lifecycle */
  let last = 0, sec = 0;
  function tick(ts) { if (!R.on || window.ZD_PARKED || window.ZD_DASH_IDLE) { R._armed = false; last = 0; sec = 0; return; }
    if (last) { const dt = ts - last; R.frames++; if (dt > R.fmax) R.fmax = dt; } last = ts; if (!sec) sec = ts;
    if (ts - sec >= 1000) { const row = new Array(COLS.length).fill(''); row[0] = 'h'; row[1] = now(); row[14] = +((R.frames * 1000) / (ts - sec)).toFixed(1); row[15] = Math.round(R.fmax); row[16] = R.lt; row[17] = R.ltMax ? 'lt_max:' + Math.round(R.ltMax) : ''; R.buf.push(row); R.frames = 0; R.fmax = 0; R.lt = 0; R.ltMax = 0; sec = ts; R.changed(); }
    requestAnimationFrame(tick); }
  if (!off) {
    try { new PerformanceObserver((l) => { if (!R.on) return; for (const e of l.getEntries()) { R.lt++; if (e.duration > R.ltMax) R.ltMax = e.duration; } }).observe({ type: 'longtask', buffered: false }); } catch (e) {}
    document.addEventListener('visibilitychange', () => { R.event(document.visibilityState === 'visible' ? 'visible' : 'hidden'); if (document.visibilityState !== 'visible') R.flush(); last = 0; });
    addEventListener('pagehide', (e) => { R.event('pagehide', e.persisted ? 'bfcache' : ''); R.flush(); });
    addEventListener('pageshow', (e) => R.event('pageshow', e.persisted ? 'bfcache' : ''));
    document.addEventListener('freeze', () => { R.event('freeze'); R.flush(); }); document.addEventListener('resume', () => R.event('resume'));
    addEventListener('online', () => R.event('online')); addEventListener('offline', () => R.event('offline'));
    addEventListener('error', (e) => R.event('jserror', (e.message || '') + ' @' + (e.lineno || ''))); addEventListener('unhandledrejection', (e) => R.event('rejection', e.reason && (e.reason.message || e.reason)));
    function armBattery() { if (R._batArmed || !navigator.getBattery) return; R._batArmed = 1; navigator.getBattery().then((b) => { const f = () => R.event('battery', `${Math.round(b.level * 100)}%${b.charging ? ' charging' : ' NOT charging'}`); b.addEventListener('chargingchange', f); R.listeners.push(() => { if (R.on && !R._bat) { R._bat = 1; f(); } }); }).catch(() => {}); }
    if (!window.ZD_JR) armBattery(); R.armBattery = armBattery; }
  /* Settings: status line + EXPORT RUN */
  function wire() { const b = document.getElementById('btnExportRun'), st = document.getElementById('recStat'); if (!b || !st) return;
    const show = async () => { const l = await R.list().catch(() => []); st.textContent = `Run recorder: ${R.status()} · ${l.length} run${l.length === 1 ? '' : 's'} saved (keeps last ${MAX_RUNS})`; };
    R.listeners.push(() => { if (!document.getElementById('settings') || document.getElementById('settings').classList.contains('hidden')) return; show(); });
    b.addEventListener('click', async () => { b.disabled = true; st.textContent = 'Preparing the export…'; try { const r = await R.export(); st.textContent = r === 'none' ? 'No runs recorded yet: connect the OBD adapter and drive.' : r === 'shared' ? 'Run shared ✓' : r === 'cancelled' ? 'Share cancelled' : 'Run downloaded ✓ (CSV + JSON in Downloads)'; } catch (e) { st.textContent = 'Export failed: ' + e.message; } b.disabled = false; });
    document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#btnSettings')) setTimeout(show, 50); }, true); show(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})(typeof window !== 'undefined' ? window : globalThis);

