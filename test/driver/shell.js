
/* Z-DASH — app shell: wires a data source → scorer / dyno / trip → screens. */
(function () {
  const ZD = window.ZD, C = ZD.CAR, COL = ZD.COL, T = ZD.text, $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);

  const S = {
    F: null, hist: [], scorer: new ZD.ShiftScorer(), dyno: new ZD.RoadDyno(), trip: null, screen: 'drive',
    src: null, yaw: 0.75, autoRot: true, lastDrag: 0, wheelAng: 0, lastShift: null, motion: { lat: 0, lon: 0 },
    gTrail: [], warming: false, bestDyno: null, lastDyno: null, partsOn: { engine: true, sc: true, ic: true, driveline: true, brakes: true, diff: true }, yawVel: 0, pitch: 0.3,
    speedup: 1, stillSince: null, demo: false, codes: null, codeTimer: null, fuel: null, mode: 'cruise', stats: null, ex: null, log: new ZD.DriveLogger(),
  };
  const newTrip = () => ({ t0: null, tLast: null, dist: 0, maxSpeed: 0, maxRpm: 0, maxBoost: -99, peakLat: 0, peakLon: 0, counts: { PERFECT: 0, GOOD: 0, SLOPPY: 0 } });
  S.trip = newTrip();

  // ---------------- data pipeline ----------------
  function onFrame(f) {
    if (f.latG == null) f.latG = S.motion.lat; // phone accelerometer fallback
    if (f.lonG == null) f.lonG = S.motion.lon;
    const prev = S.F; S.F = f;
    if (S.seen) for (const k in f) if (k !== 't' && f[k] != null) S.seen.add(k); // fields that have had data (auto-hide)
    const tr = S.trip;
    if (tr.t0 === null) tr.t0 = f.t;
    if (prev && f.t > prev.t && f.t - prev.t < 1) { const mi = ((f.speed || 0) * (f.t - prev.t)) / 3600; tr.dist += mi; S.fuel && S.fuel.addMiles(mi); S.ex && S.ex.addMiles(mi); }
    tr.tLast = f.t;
    tr.maxSpeed = Math.max(tr.maxSpeed, f.speed || 0); tr.maxRpm = Math.max(tr.maxRpm, f.rpm || 0);
    if (f.boost != null) tr.maxBoost = Math.max(tr.maxBoost, f.boost);
    tr.peakLat = Math.max(tr.peakLat, Math.abs(f.latG || 0)); tr.peakLon = Math.max(tr.peakLon, Math.abs(f.lonG || 0));
    S.hist.push({ t: f.t, th: f.throttle, b: f.boost, rpm: f.rpm });
    while (S.hist.length && f.t - S.hist[0].t > 20) S.hist.shift();
    S.gTrail.push([f.latG || 0, f.lonG || 0]); if (S.gTrail.length > 60) S.gTrail.shift();
    S.log.add(f);
    S.fuel && S.fuel.onFrame(f);
    if (S.ex) { S.ex.checkHealth(f); S.ex.checkIdle(f); S.ex.checkRuns(f); }
    S.scorer.push(f); S.dyno.push(f);
    if (ZD.Rec && ZD.Rec.on) ZD.Rec.sample(f, S.scorer.gear);
    if (S.demo && !S.demoRace && !params.has('mode') && f.t > 120) { S.demoRace = true; setMode('race'); if (!S.warming) toast('DEMO · SWITCHED TO RACE MODE'); }
    if (S.demo && !S.demoDyno && f.t > 40 && S.src.requestDynoPull) { S.demoDyno = true; S.src.requestDynoPull(); } // demo: show a dyno pull early
    // engine off for 3 s → trip summary
    S.frameAt = performance.now(); if ((f.rpm || 0) < 100 && !(f.speed > 0)) { S.stillSince ??= f.t; if (f.t - S.stillSince > 3 && !S.warming && tr.maxRpm >= 400) showPowerOff(); } else S.stillSince = null; // only a trip the engine actually ran in can end (Oct 19 tripfix)
  }
  S.scorer.on((ev) => {
    S.lastShift = ev; S.trip.counts[ev.rating]++; S.log.note('shift', { t: ev.t, from: ev.from, to: ev.to, mode: ev.mode, score: ev.score, rating: ev.rating, raw: ev.raw }); S.ex && S.ex.onShift(ev, S.scorer);
    if (S.warming || !ZD.layout.view(viewCaps()).popup) return;
    const el = $('#popup');
    el.className = 'popup ' + ev.rating;
    const R = ev.raw || {}, det = [R.shiftRpm ? `${R.shiftRpm} RPM` : '', R.duration != null ? `SHIFT ${R.duration}s` : '', R.jerk != null ? `LURCH ${R.jerk}` : '', R.revMatchErr != null ? `MATCH ±${R.revMatchErr}` : ''].filter(Boolean).slice(0, 3).join(' · ');
    el.innerHTML = `<div class="pg">${ev.to}</div><div class="pm"><div class="r">${ev.rating}</div><div class="c">${det}${ev.combo >= 2 ? ` · COMBO ×${ev.combo}` : ''}</div></div><div class="ps"><div class="sd">${ev.from}→${ev.to}</div><div class="p">${ev.score}</div><div class="pp">+${ev.points.toLocaleString()}</div></div>`;
    void el.offsetWidth; el.classList.add('show');
  });
  S.dyno.on((run) => { S.ex && S.ex.onDyno(run); S.lastDyno = run; if (!S.bestDyno || run.peakHp > S.bestDyno.peakHp) S.bestDyno = run; $('#btnDyno').disabled = false; });

  function onMotion(e) {
    const a = e.acceleration; if (!a) return; // phone in landscape on the mount, screen facing the driver
    S.motion.lat += ((a.y || 0) / 9.81 - S.motion.lat) * 0.2; S.motion.lon += (-(a.z || 0) / 9.81 - S.motion.lon) * 0.2;
    const r = e.rotationRate; if (r && r.alpha != null) { S.motion.yaw = (S.motion.yaw || 0) + ((r.alpha || 0) - (S.motion.yaw || 0)) * 0.2; S.motion.hasGyro = true; } // deg/s about the phone's screen axis ≈ car yaw on a landscape mount
  }
  let motionOn = false;
  (window.ZD = window.ZD || {}).armMotion = function (on) {
    if (!!on === motionOn) return;
    motionOn = !!on;
    if (motionOn) window.addEventListener('devicemotion', onMotion);
    else window.removeEventListener('devicemotion', onMotion);
  };
  if (!window.ZD_JR) window.ZD.armMotion(true);

  // ---------------- sources ----------------
  // Anything blank gets hidden: live OBD panels whose data is still null ~5 s after going live drop out (and come back if a value
  // shows up later). Demo / replay: the adapter caps as before (null = everything shows).
  function viewCaps() { const src = S.src, c = src && src.caps; if (!src || src.label !== 'OBD' || !S.seenT0 || performance.now() - S.seenT0 < 5000) return c;
    return c ? new Set([...c].filter((k) => S.seen.has(k))) : S.seen; }
  async function useSource(src) {
    if (S.src) S.src.stop(); if (ZD.Rec && ZD.Rec.on) ZD.Rec.stop('source changed');
    S.src = src; S.F = null; S.hist = []; S.seen = new Set(); S.seenT0 = 0;
    src.onFrame(onFrame);
    src.onStatus((st, msg) => {
      const chip = $('#srcChip'); chip.className = 'chip ' + st; chip.querySelector('b').textContent = src.label;
      if (ZD.Rec) { if (st === 'live' && src.label === 'OBD' && !ZD.Rec.on) ZD.Rec.start('OBD ' + (msg || '')); ZD.Rec.event('status', st + (msg ? ' ' + msg : '')); }
      if (st === 'live' && ZD.wake) ZD.wake.acquire();
      if (st === 'live') S.seenT0 = performance.now();
      if (st === 'live') { splashLinked(); if (src.label !== 'CSV') S.log.start(src.label + (S.demo ? ' (demo)' : '')); } // replays aren't re-logged
      if (msg) $('#srcMsg').textContent = msg;
    });
    setupCodes(src); setupFuel(); setupStats(); setupExtras();
    showSplash();
    try { await src.start(); }
    catch (e) {
      const hint = /cancel|No port selected|User/i.test(e.message) ? ' Pair the adapter in Android Bluetooth settings first, close other OBD apps, then try again.' : '';
      $('#srcMsg').textContent = $('#startMsg').textContent = 'Could not connect: ' + e.message.replace(/\.*$/, '.') + hint;
      SP.idle = true; $('#splash').classList.remove('started'); $('#srcChip').className = 'chip';
    }
  }

  // ---------------- splash (headlights flash amber once on connect) ----------------
  const SP = { t0: 0, linkT: null, on: true, idle: true };
  function showSplash() { if (params.has('nosplash')) return; SP.t0 = performance.now(); SP.linkT = null; SP.on = true; SP.idle = false; $('#splash').classList.add('started'); $('#splash').classList.remove('gone'); }
  function splashLinked() { SP.linkT = performance.now(); }
  function hideSplash() { SP.on = false; $('#splash').classList.add('gone'); }
  function drawSplash(now) {
    const { ctx, w, h } = ZD.fit($('#cv-splash'));
    ZD.grid(ctx, w, h, 28, 0.05);
    const lt = SP.linkT ? (now - SP.linkT) / 1000 : -1;
    // one amber flash (like a lock/unlock blink), then DRLs come up
    let amber = 0, drl = 0;
    if (lt >= 0) { amber = lt < 0.5 ? Math.sin((lt / 0.5) * Math.PI) : 0; drl = ZD.clamp((lt - 0.45) / 0.35, 0, 1); }
    if (SP.idle) { drawStart(ctx, w, h, now); return; }
    const s = Math.min(w / 3.4, h / 2.3), gy = h * 0.84;
    if (ZD.Xray && ZD.Xray.ready) ZD.Xray.render(ctx, 0, h * 0.12, w, h * 0.8, { xray: false, yaw: 0.25 + 0.35 * (lt < 0 ? 1 : Math.max(0, 1 - lt)), pitch: 0.14, dist: 6.0, amber, drl });
    else ZD.drawFrontCar(ctx, w / 2, gy, s, { amber, drl }, -10);
    const ty = Math.max(30, gy - 1.3 * s - 34);
    T(ctx, 'Z', w / 2, ty, 28, COL.RED, 'center', 'num', 900, 12);
    T(ctx, '40TH ANNIVERSARY · SUPERCHARGED', w / 2, ty + 18, 11, COL.MUTE, 'center');
    const msg = lt < 0 ? `CONNECTING · ${S.src ? S.src.label : ''}` + '.'.repeat(1 + (Math.floor(now / 300) % 3)) : 'LINK ESTABLISHED';
    T(ctx, msg, w / 2, h - 10, 12, lt < 0 ? COL.MUTE : COL.TXT, 'center', 'txt', 700);
    if (lt > 1.5) hideSplash();
  }

  const START_SPIN_S = 24; // start screen car: one full turn every 24 s
  function drawStart(ctx, w, h, now) {
    const s = Math.min(w / 4.6, h / 3.1), gy = h * 0.6;
    if (ZD.Xray && ZD.Xray.ready) ZD.Xray.render(ctx, 0, 40, w, h * 0.6, { xray: false, neon: true, alpha: 0.55, yaw: 0.6 + ((now / 1000) * (2 * Math.PI)) / START_SPIN_S, pitch: 0.16, dist: 6.6, drl: 0.35 + 0.1 * Math.sin(now / 600) }); // Oct 18: DRIVE's red neon wireframe car, slow continuous 360°
    else ZD.drawFrontCar(ctx, w / 2, gy, s, { amber: 0, drl: 0.25 + 0.1 * Math.sin(now / 600) }, -10);
    T(ctx, 'Z-DASH', w / 2, 34, 22, '#fff', 'center', 'num', 800, 10);
    T(ctx, `${C.name.toUpperCase()} · ${C.edition.toUpperCase()} · GTM ROTREX · ${C.peakWhp} WHP`, w / 2, 52, 11, COL.MUTE, 'center', 'txt', 700);
  }

  // ---------------- driving modes + per-mode bests ----------------
  function setMode(m) {
    S.mode = m; S.scorer.setMode(m);
    if (S.src && S.src.car) S.src.car.driver.style = m; // demo driver drives to match
    document.querySelectorAll('#modeBtn button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    try { if (!S.demo) localStorage.setItem('zdash.mode', m); } catch (e) {}
  }
  document.querySelectorAll('#modeBtn button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  function setupStats() {
    const init = { cruise: { best: 0, bestDriving: 0, history: [] }, race: { best: 0, bestDriving: 0, history: [] } };
    if (S.demo) { S.stats = { cruise: { best: 48200, bestDriving: 91, history: [{ date: Date.now() - 864e5 * 3, score: 48200, shifts: 41, driving: 91 }] }, race: { best: 142500, bestDriving: 0, history: [{ date: Date.now() - 864e5 * 6, score: 142500, shifts: 96 }] } }; return; }
    try { S.stats = JSON.parse(localStorage.getItem('zdash.modeStats')) || init; } catch (e) { S.stats = init; }
  }
  function recordTrip() {
    const sc = S.scorer;
    for (const m of ['cruise', 'race']) {
      const B = sc.byMode[m]; if (!B.n) continue;
      const st = S.stats[m], drv = m === 'cruise' ? sc.drivingScore() : null;
      st.history.push({ date: Date.now(), score: B.total, shifts: B.n, driving: drv }); st.history = st.history.slice(-50);
      st.best = Math.max(st.best, B.total); if (drv) st.bestDriving = Math.max(st.bestDriving, drv);
    }
    try { if (!S.demo) localStorage.setItem('zdash.modeStats', JSON.stringify(S.stats)); } catch (e) {}
  }
  const coachTips = () => ZD.coach(S.scorer.shifts, { mode: S.mode, harsh: S.scorer.harsh, t0: S.trip.t0 || 0 });

  // ---------------- extras: shift light cfg, health, runs/ghost, achievements, Rotrex fluid ----------------
  function setupExtras() {
    let ov;
    if (S.demo) { // demo: previous best 0-60 (gives a ghost to race), Rotrex fluid nearly due
      const gtrace = Array.from({ length: 24 }, (_, i) => { const t = (i / 23) * 5.0; return [+t.toFixed(2), +(60 * Math.pow(t / 5.0, 0.85)).toFixed(1)]; });
      ov = { idle: { hist: [742, 751, 738, 755, 747, 744, 752, 749].map((avg, i) => ({ date: Date.now() - 864e5 * (16 - i * 2), avg, min: avg - 18, secs: 60 + i * 9, dips: 0, stalls: 0 })) }, maint: { rotrexMiSince: 17748 }, runs: { z60: [{ time: 5.0, date: Date.now() - 864e5 * 9 }, { time: 5.3, date: Date.now() - 864e5 * 20 }], s60130: [{ time: 11.8, date: Date.now() - 864e5 * 9 }] }, ghost: { z60: { time: 5.0, trace: gtrace } } };
    }
    S.ex = new ZD.Extras(S.demo ? memStore({}, 'zdash.extras') : undefined, ov);
    S.ex.on((ev) => {
      if (S.warming && ev.type !== 'run') return;
      const N = { z60: '0-60', s60130: '60-130' };
      if (ev.type === 'health') showAlert('HEALTH', ev.msg);
      if (ev.type === 'run') { S.lastRunEv = ev; if (!S.warming) toast(`⏱ ${N[ev.kind]} · ${ev.time.toFixed(2)} s` + (ev.best ? ' · NEW BEST! (new ghost saved)' : ` · #${ev.rank || '-'} on the board`)); S.ex.onRun(ev); }
      if (ev.type === 'ach') toast(`🏆 ACHIEVEMENT UNLOCKED · ${ev.title}: ${ev.desc}`);
      if (ev.type === 'maint') showAlert('ROTREX', ev.left > 0 ? `SX150 traction-fluid change due in ${Math.round(ev.left)} miles.` : 'SX150 traction-fluid change is due now.');
    });
    document.querySelectorAll('[data-cfg]').forEach((inp) => { inp.value = getPath(S.ex.cfg, inp.dataset.cfg); });
  }
  const getPath = (o, p) => p.split('.').reduce((a, k) => a && a[k], o);
  const setPath = (o, p, v) => { const k = p.split('.'); const last = k.pop(); k.reduce((a, x) => a[x], o)[last] = v; };
  document.querySelectorAll('[data-cfg]').forEach((inp) => inp.addEventListener('change', () => { const v = +inp.value; if (isFinite(v) && S.ex) { setPath(S.ex.cfg, inp.dataset.cfg, v); S.ex.save(); } }));
  $('#btnFluid').addEventListener('click', () => { if (S.ex && confirm('Reset the Rotrex SX150 fluid counter? Only do this after the fluid was changed.')) { S.ex.rotrexReset(); toast('ROTREX FLUID COUNTER RESET'); } });
  function showAlert(code, msg) { S.alertCode = null; $('#alertCode').textContent = code; $('#alertMsg').textContent = msg; $('#alert').classList.remove('hidden'); }

  // ---------------- fuel ----------------
  function setupFuel() {
    // Demo: throwaway history (5 past tanks ≈ 240 mi each) and ~44 mi of range left so the low-fuel warning fires.
    S.fuel = new ZD.FuelTracker(S.demo ? memStore({}, 'zdash.fuel') : undefined, S.demo ? { milesSinceFill: 196.5, fills: [238, 251, 233, 244, 236].map((m, i) => ({ miles: m, date: Date.now() - (5 - i) * 6e8 })) } : undefined);
    S.fuel.on((ev) => {
      if (S.warming) return;
      if (ev.type === 'low') toast(`⛽ LOW FUEL · ABOUT ${Math.round(ev.range)} MI LEFT`);
      if (ev.type === 'fill') toast(ev.auto ? '⛽ REFUEL DETECTED · TRIP RESET' : '⛽ FILL-UP LOGGED · TRIP RESET');
    });
    $('#tankGal').value = S.fuel.settings.tankGal;
  }
  $('#btnFill').addEventListener('click', () => S.fuel && S.fuel.fillUp(false));
  $('#tankGal').addEventListener('change', (e) => S.fuel && S.fuel.setTank(+e.target.value));
  function fuelBar(ctx, x, y, w, h) {
    const F = S.fuel; if (!F) return;
    const low = F.low, blink = low && Math.floor(performance.now() / 500) % 2;
    T(ctx, '⛽', x, y + h, 12, low ? COL.RED : COL.MUTE, 'left');
    const bx = x + 18; ctx.strokeStyle = low ? COL.RED : '#3a1a1e'; ctx.strokeRect(bx + 0.5, y + 0.5, w, h);
    ctx.fillStyle = low ? (blink ? '#ff2a3d' : '#7a1520') : '#b0202f'; ctx.fillRect(bx + 2, y + 2, Math.max(0, (w - 3) * F.pct), h - 3);
    T(ctx, low ? `LOW · ${Math.round(F.range)} MI` : `${Math.round(F.range)} MI`, bx + w + 8, y + h, 13, low ? COL.RED : COL.MUTE, 'left', 'txt', 700);
  }

  // ---------------- trouble codes ----------------
  function memStore(init, key = 'zdash.codes') { const m = { [key]: JSON.stringify(init) }; return { getItem: (k) => m[k] || null, setItem: (k, v) => (m[k] = v) }; }
  function setupCodes(src) {
    clearInterval(S.codeTimer);
    // Demo uses its own throwaway settings (P0420/P0430 marked usual, Auto-clear on) so it never touches Bob's real list.
    S.codes = new ZD.CodeManager(S.demo ? memStore({ allow: ['P0420', 'P0430'], auto: true, history: [] }) : undefined);
    S.codes.on(onCodes);
    if (src.readCodes) S.codeTimer = setInterval(() => S.codes.poll(S.src), 4000);
    renderCodes();
  }
  // Codes banner/badge/screen stay in sync with what the car currently reports: a banner is tied to its code and is
  // dismissed the moment that code is gone (auto-cleared, cleared by hand, or cleared by the module itself).
  function activeCodes() { const c = (S.codes && S.codes.current) || {}; return new Set([...(c.stored || []), ...(c.pending || []), ...(c.body || [])]); }
  function hideCodeAlert() { if (S.alertCode) { $('#alert').classList.add('hidden'); S.alertCode = null; } }
  function onCodes(ev) {
    const M = S.codes, act = activeCodes();
    if (ev.type === 'autocleared' && !S.warming) toast(`${ev.codes.join(', ')} auto-cleared`, 2000);
    if (ev.type === 'cleared') M.alerts = [];
    const gone = (ev.gone || []).filter((c) => !act.has(c));
    if (gone.length && !S.warming && ev.type !== 'autocleared') toast(`${gone.join(', ')} cleared`, 2000);
    M.alerts = M.alerts.filter((a) => act.has(a.code));               // drop alerts for codes that are no longer reported
    if (S.alertCode && !act.has(S.alertCode)) hideCodeAlert();         // ...and their banner, right away
    const a = M.alerts[M.alerts.length - 1];
    if (a && !a.shown && !S.warming) { a.shown = true; S.alertCode = a.code; $('#alertCode').textContent = a.code; $('#alertMsg').textContent = a.meaning + (ZD.isEngineCode(a.code) ? ' Not on your usual list, so it was NOT auto-cleared.' : ' Tire/body module code: standard OBD can\'t clear this.'); $('#alert').classList.remove('hidden'); }
    renderCodes();
  }
  let toastT, toastT2; function toast(msg, ms = 3500) { const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden', 'fade'); clearTimeout(toastT); clearTimeout(toastT2); toastT = setTimeout(() => t.classList.add('fade'), Math.max(0, ms - 400)); toastT2 = setTimeout(() => t.classList.add('hidden'), ms); }
  const esc = (x) => String(x).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const ago = (t) => { const s = Math.round((Date.now() - t) / 1000); return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.round(s / 60)} min ago` : new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); };
  function renderCodes() {
    const M = S.codes; if (!M) return;
    const can = S.src && S.src.readCodes;
    $('#codesRead').textContent = !can ? '· not available for this data source' : M.lastRead ? `· read ${new Date(M.lastRead).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}` : '· reading…';
    const rows = [];
    const seen = new Set();
    for (const [list, tag, cls] of [[M.current.stored, 'STORED', ''], [M.current.pending, 'PENDING', 'p']]) for (const c of list) {
      if (seen.has(c + tag)) continue; seen.add(c + tag);
      const usual = M.allow.has(c);
      rows.push(`<div class="code ${usual ? '' : 'alertc'}"><span class="id">${c}</span><span class="m">${esc(ZD.dtcMeaning(c))}</span><button class="usual ${usual ? 'on' : ''}" data-code="${c}">${usual ? '★ USUAL' : '☆ MARK USUAL'}</button><span class="tags"><span class="t ${cls}">${tag}</span>ENGINE${usual ? ' · AUTO-CLEARS' : ' · ALERT'}</span></div>`);
    }
    for (const c of M.current.body) rows.push(`<div class="code"><span class="id">${c}</span><span class="m">${esc(ZD.dtcMeaning(c))}</span><button class="usual" disabled>NISSAN-ONLY</button><span class="tags"><span class="t b">TPMS / BODY</span>needs Nissan-specific request · not auto-cleared</span></div>`);
    $('#codeList').innerHTML = rows.length ? rows.join('') : `<div class="empty">${can ? 'No trouble codes. 👍' : 'Codes need a live adapter connection (or the demo).'}</div>`;
    $('#codeList').querySelectorAll('.usual[data-code]').forEach((b) => b.addEventListener('click', () => { M.toggleAllow(b.dataset.code); }));
    const hist = M.history.slice().sort((a, b) => b.last - a.last);
    $('#codeHist').innerHTML = hist.length ? hist.map((h) => `<div class="hist"><span class="id">${h.code}</span><span>${ago(h.last)}</span><span class="c">×${h.count}</span></div>`).join('') : '<div class="empty">Nothing auto-cleared yet.</div>';
    const bt = $('#btnAuto'); bt.classList.toggle('on', M.auto); bt.querySelector('b').textContent = M.auto ? 'ON' : 'OFF';
    const flagged = [...M.current.stored, ...M.current.pending].some((c) => !M.allow.has(c));
    const need = new Set([...M.current.stored, ...M.current.pending].filter((c) => !M.allow.has(c)).concat(M.current.body)).size; // codes needing attention
    $('#tabCodes').classList.toggle('flag', flagged || need > 0); const bd = $('#codesBadge'); bd.textContent = need; bd.classList.toggle('hidden', need === 0);
    $('#btnClearCodes').disabled = !can; $('#btnReadCodes').disabled = !can;
  }
  $('#btnAuto').addEventListener('click', () => S.codes.setAuto(!S.codes.auto));
  $('#btnReadCodes').addEventListener('click', () => S.codes.poll(S.src));
  $('#btnClearCodes').addEventListener('click', () => {
    const M = S.codes, list = [...new Set([...M.current.stored, ...M.current.pending])];
    $('#confirmCodes').textContent = list.length ? `Codes that will be cleared: ${list.join(', ')}` : 'No engine codes are stored right now.';
    $('#confirm').classList.remove('hidden');
  });
  $('#confirmNo').addEventListener('click', () => $('#confirm').classList.add('hidden'));
  $('#confirmYes').addEventListener('click', async () => { $('#confirm').classList.add('hidden'); await S.codes.clearAll(S.src); toast('CODES CLEARED · readiness monitors reset'); });
  $('#alertX').addEventListener('click', () => { $('#alert').classList.add('hidden'); S.alertCode = null; });
  $('#alertGo').addEventListener('click', () => { $('#alert').classList.add('hidden'); S.alertCode = null; setScreen('codes'); });

  // ---------------- screens ----------------
  function drawDrive() {
    let { ctx, w, h } = ZD.fit($('#cv-drive')); const f = S.F || {}, nowT = performance.now(), dt = Math.min(0.05, (nowT - (S.driveT || nowT)) / 1000); S.driveT = nowT;
    if (!drawChase(ctx, w, h, f, dt)) ZD.grid(ctx, w, h, 32, 0.045);
    // HUD is laid out on a virtual canvas 378 px tall and scaled to the real height, so fonts/panels scale with the
    // viewport height (short landscape phones with the address bar showing get a proportionally smaller HUD).
    const hk = ZD.clamp(h / 378, 0.7, 1.3), realH = h; ctx.save(); ctx.scale(hk, hk); w /= hk; h /= hk; if (S.driveK !== hk) { S.driveK = hk; $('#popup').style.scale = Math.min(1.15, hk).toFixed(3); }
    // RPM bar
    const x0 = 18, x1 = w - 18, y0 = 12, bh = 30, maxR = 8000, n = 80, segW = (x1 - x0) / n;
    // progressive shift light: builds from the mode's START rpm to its SHIFT rpm, then flashes the screen edge
    const SL = S.ex ? S.ex.cfg.shiftLight[S.mode] : { start: 5800, shift: 7000 };
    /* 6th is top gear on the 6MT: no upshift cue / flash / SHIFT label there; the light only warns near redline (over-rev) */
    const gNow = f.gear >= 1 ? f.gear : (f.clutch !== true && S.scorer && S.scorer.gear) || 0, topGear = gNow >= (C.topGear || 6), SLc = topGear ? { start: C.redline - 800, shift: C.redline - 300 } : SL;
    const rpm = f.rpm || 0, shiftNow = rpm >= SLc.shift && (f.throttle || 0) > 15 && f.clutch !== true, flash = shiftNow && Math.floor(performance.now() / 80) % 2; S.cue = { gear: gNow, top: topGear, shiftNow, label: !topGear }; /* for tests */
    const cp = viewCaps(), L = ZD.layout.view(cp), has = (k) => !cp || cp.has(k);
    if (L.tach) {
    for (let i = 0; i < n; i++) {
      const r = (i / n) * maxR, lit = r < rpm;
      let col;
      if (!lit) col = r >= C.redline ? '#3a0d13' : r >= SLc.start && r < SLc.shift ? '#1f1012' : '#140a0c';
      else if (shiftNow) col = flash ? '#ffffff' : (S.mode === 'cruise' ? '#3ee6ff' : '#ff2a3d');
      else if (r < SLc.start) col = '#5a1a22';
      else { const t = ZD.clamp((r - SLc.start) / (SLc.shift - SLc.start), 0, 1); col = t < 0.5 ? `rgb(${Math.round(62 + 193 * t * 2)},${Math.round(230 - 54 * t * 2)},${Math.round(255 - 223 * t * 2)})` : `rgb(255,${Math.round(176 - 134 * (t - 0.5) * 2)},${Math.round(32 + 29 * (t - 0.5) * 2)})`; }
      ctx.fillStyle = col; const hh = bh * (0.55 + 0.45 * (i / n));
      if (lit && r >= SLc.start) { ctx.shadowColor = col; ctx.shadowBlur = 8; }
      ctx.fillRect(x0 + i * segW + 1, y0 + bh - hh, segW - 2, hh); ctx.shadowBlur = 0;
    }
    // shift-point marker
    const mx = x0 + (SL.shift / maxR) * (x1 - x0); ctx.fillStyle = S.mode === 'cruise' ? '#3ee6ff' : '#ff2a3d'; ctx.fillRect(mx - 1, y0 - 5, 2, bh + 8);
    S.edgeOn = shiftNow && flash; S.edgeMode = S.mode;
    if (shiftNow) { ctx.shadowColor = '#ff2a3d'; ctx.shadowBlur = 18; ctx.strokeStyle = flash ? '#fff' : '#ff2a3d'; ctx.strokeRect(x0 - 4, y0 - 4, x1 - x0 + 8, bh + 8); ctx.shadowBlur = 0; }
    } else S.edgeOn = false;
    // ghost run (only while a timed run is live)
    if (L.ghost && S.ex && S.ex.run && S.ex.run.elapsed > 0.2) {
      const R = S.ex.run, gd = S.ex.ghostDelta(), nm = R.kind === 'z60' ? '0-60' : '60-130';
      T(ctx, `⏱ ${nm}  ${R.elapsed.toFixed(2)}s` + (gd !== null ? `   GHOST ${gd > 0 ? '+' : ''}${gd.toFixed(2)}s` : ''), w / 2, 76, 15, gd !== null && gd <= 0 ? '#3ee6ff' : '#ffb020', 'center', 'num', 700, 8);
    }
    if (L.tach) for (let k = 0; k <= 8; k++) T(ctx, String(k), x0 + (k / 8) * (x1 - x0), y0 + bh + 14, 11, k >= 8 ? COL.RED : COL.MUTE, 'center');
    const gear = f.gear === 0 ? 'N' : f.gear >= 1 ? String(f.gear) : S.scorer.gear && f.clutch !== true ? String(S.scorer.gear) : '–';
    const sc = S.scorer, accent = S.mode === 'cruise' ? '#3ee6ff' : '#ff2a3d';
    // ---- panels (each can be switched off in the layout editor; the car + grid always stay) ----
    const modeBox = $('#modeBtn') && L.mode ? $('#modeBtn').getBoundingClientRect() : null; // real px reserved for the CRUISE/RACE toggle under the gear
    const top0 = L.tach ? 62 : 14, botLim = h - (L.mode ? ((modeBox && modeBox.height ? modeBox.height : 30) + 18) / hk : 14);
    // left column: speed, then gear filling the rest
    let ly = top0;
    if (L.speed) {
      ZD.panel(ctx, 14, ly, 196, 112); T(ctx, 'SPEED', 26, ly + 18, 11, COL.MUTE, 'left', 'txt', 700);
      T(ctx, ZD.fmt(f.speed, 0), 112, ly + 90, 84, '#ffffff', 'center', 'num', 800, 14); T(ctx, 'MPH', 198, ly + 104, 11, COL.MUTE, 'right', 'txt', 700); ly += 122;
    }
    if (L.gear) {
      const gh = Math.max(60, Math.min(200, botLim - ly)); S.gearRect = [14 * hk, ly * hk, 196 * hk, gh * hk]; ctx.save(); ctx.strokeStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 12; ctx.lineWidth = 2; ctx.strokeRect(14, ly, 196, gh); ctx.fillStyle = S.mode === 'cruise' ? 'rgba(62,230,255,.06)' : 'rgba(255,42,61,.08)'; ctx.fillRect(14, ly, 196, gh); ctx.restore();
      T(ctx, 'GEAR', 26, ly + 18, 11, COL.MUTE, 'left', 'txt', 700); T(ctx, gear, 112, ly + gh / 2 + 38, Math.min(110, gh * 0.85), '#ffffff', 'center', 'num', 800, 20); ly += gh + 10;
    }
    // right column: big RPM (mirrors SPEED), boost, score/combo, fuel, tire pressure — stacked; boost flexes to fit
    let ry = top0; const rx = w - 210, avail = h - 2 - top0;
    const merged = L.score && L.fuel, scH = merged ? 84 : 70, tpH = 48; // score + fuel share one panel when both are on
    const fixedNoRpm = (L.score ? scH + 10 : 0) + (L.fuel && !merged ? 44 : 0) + (L.tpms ? tpH + 10 : 0);
    let rH = 0; if (L.rpm) for (const c of [112, 100, 90]) { rH = c; if (!L.boost || avail - fixedNoRpm - c - 20 >= 46) break; }
    const bH = Math.min(140, avail - fixedNoRpm - (L.rpm ? rH + 10 : 0) - 10);
    if (L.rpm) {
      const hot = rpm >= SLc.start, rc = shiftNow ? (flash ? '#ffffff' : accent) : rpm >= SLc.start ? (S.mode === 'cruise' ? '#3ee6ff' : '#ffb020') : '#ffffff';
      ZD.panel(ctx, rx, ry, 196, rH); T(ctx, 'RPM', rx + 12, ry + 18, 11, COL.MUTE, 'left', 'txt', 700);
      const rs = String(Math.round(rpm / 10) * 10); let fs = rH >= 112 ? 76 : 66; ctx.font = `800 ${fs}px ${ZD.FONT.num}`; const mw = ctx.measureText(rs).width; if (mw > 176) fs = Math.floor(fs * 176 / mw);
      T(ctx, rs, rx + 98, ry + rH - 22, fs, rc, 'center', 'num', 800, hot ? 18 : 14);
      if (!topGear) T(ctx, `SHIFT ${SL.shift.toLocaleString()}`, rx + 184, ry + rH - 8, 10, rpm >= SL.start ? rc : COL.MUTE, 'right', 'txt', 700); ry += rH + 10;
    }
    if (L.boost && bH >= 105) { ZD.panel(ctx, rx, ry, 196, bH); ZD.arcGauge(ctx, w - 112, ry + bH / 2 + 4, bH >= 130 ? 52 : 40, f.boost, 'BOOST', 'PSI', { min: -15, max: C.boostGaugeMax, zero: 0, dec: 1, big: 27, lw: 8, colorFn: (v) => (v > 0.5 ? '#ff2a3d' : '#6d5f62') }); ry += bH + 10; }
    else if (L.boost && bH >= 44) { // compact boost: number + bar
      const bh2 = Math.min(64, bH), b = f.boost ?? 0, pos = b > 0.5; ZD.panel(ctx, rx, ry, 196, bh2); T(ctx, 'BOOST', rx + 12, ry + 17, 11, COL.MUTE, 'left', 'txt', 700);
      T(ctx, `${f.boost != null ? (b >= 0 ? '+' : '') + b.toFixed(1) : '--'}`, rx + 150, ry + 24, 22, pos ? '#ff2a3d' : '#fff', 'right', 'num', 700, pos ? 8 : 0); T(ctx, 'PSI', rx + 184, ry + 24, 10, COL.MUTE, 'right', 'txt', 700);
      const bx = rx + 12, bw = 172, by = ry + bh2 - 16, z = bx + bw * (15 / (15 + C.boostGaugeMax)); ctx.fillStyle = '#1c0a0d'; ctx.fillRect(bx, by, bw, 6); ctx.fillStyle = pos ? '#ff2a3d' : '#6d5f62';
      const px = bx + bw * ((ZD.clamp(b, -15, C.boostGaugeMax) + 15) / (15 + C.boostGaugeMax)); ctx.fillRect(Math.min(z, px), by, Math.abs(px - z), 6); ctx.fillStyle = '#8a7a7d'; ctx.fillRect(z - 1, by - 2, 2, 10); ry += bh2 + 10;
    }
    if (L.score) {
      ZD.panel(ctx, rx, ry, 196, scH); T(ctx, 'SCORE', rx + 12, ry + 18, 11, COL.MUTE, 'left', 'txt', 700);
      T(ctx, sc.total.toLocaleString(), w - 26, ry + 44, 24, '#ffffff', 'right', 'num', 700, 8);
      T(ctx, sc.combo >= 2 ? `COMBO ×${sc.combo}` : S.lastShift ? `LAST ${S.lastShift.from}→${S.lastShift.to} ${S.lastShift.rating}` : 'NO SHIFTS YET', w - 26, ry + 62, 11, sc.combo >= 2 ? COL.RED : COL.MUTE, 'right', 'txt', 700);
      if (merged) fuelBar(ctx, rx + 12, ry + 68, 96, 9); ry += scH + 10;
    }
    if (L.fuel && !merged) { ZD.panel(ctx, rx, ry, 196, 34); fuelBar(ctx, rx + 12, ry + 12, 96, 10); ry += 44; }
    if (L.tpms && ry + tpH <= h - 2) {
      ZD.panel(ctx, rx, ry, 196, tpH); T(ctx, 'TIRES · PSI', rx + 12, ry + 14, 10, COL.MUTE, 'left', 'txt', 700);
      const tp = f.tpms || {}; [['FL', 0, 0], ['FR', 1, 0], ['RL', 0, 1], ['RR', 1, 1]].forEach(([k, cx, cy]) => { const v = tp[k]; T(ctx, `${k} ${v != null ? v.toFixed(1) : '--'}`, rx + 20 + cx * 92, ry + 30 + cy * 15, 14, v != null && v < 30 ? COL.RED : COL.TXT, 'left', 'num', 700); });
      ry += 80;
    }
    // NOW PLAYING (optional): compact HTML panel centred above the bottom strip, between the gauge columns
    { const np = $('#npDrive'), show = !!L.music && !!ZD.Music; if (show) { if (!np.dataset.bound) { ZD.npBind(np); np.dataset.bound = 1; } const nw = 300, nh = 52, sb = (L.temps || L.afr) ? 34 + 8 : 12, key = [Math.round((w / 2 - nw / 2) * hk), Math.round((h - sb - nh) * hk), hk.toFixed(3)].join(',');
        if (np.dataset.k !== key) { np.dataset.k = key; np.style.left = `${(w / 2 - nw / 2) * hk}px`; np.style.top = `${(h - sb - nh) * hk}px`; np.style.transform = `scale(${hk})`; } }
      np.classList.toggle('hidden', !show); }
    // bottom-centre strip: temps / mixture
    const strip = [];
    if (L.temps) { if (has('coolant')) strip.push(`COOL ${ZD.fmt(f.coolant, 0)}°`); if (has('oil')) strip.push(`OIL ${ZD.fmt(f.oil, 0)}°`); if (has('iat')) strip.push(`IAT ${ZD.fmt(f.iat, 0)}°`); }
    if (L.afr) { if (has('afr')) strip.push(`AFR ${ZD.fmt(f.afr, 1)}`); if (has('ethanol')) strip.push(`E${ZD.fmt(f.ethanol, 0)}`); }
    if (strip.length) { const swx = 0; const sw = strip.length * 88 + 16; ZD.panel(ctx, w / 2 - sw / 2, h - 34, sw, 26); strip.forEach((t, i) => T(ctx, t, w / 2 - sw / 2 + 8 + 44 + i * 88, h - 16, 12, COL.TXT, 'center', 'num', 600)); }
    ctx.restore();
  }

  // center-stage 3D chase car, drawn before the overlays
  function drawChase(ctx, w, h, f, dt) {
    const X = ZD.Xray; if (!X || !X.ready || !X.renderChase) return false;
    S.wheelAng += ((f.speed || 0) * 0.44704 / 0.34) * dt;
    // horizon glow
    const hz = h * 0.42, g = ctx.createLinearGradient(0, hz - 70, 0, hz + 40); g.addColorStop(0, 'rgba(255,42,61,0)'); g.addColorStop(0.7, 'rgba(255,42,61,0.10)'); g.addColorStop(1, 'rgba(255,42,61,0)'); ctx.fillStyle = g; ctx.fillRect(0, hz - 70, w, 110);
    X.renderChase(ctx, 0, 40, w, h - 40, { t: performance.now() / 1000, speed: f.speed, lonG: f.lonG, latG: f.latG, brake: f.brake, shifting: f.clutch === true, wheelAng: S.wheelAng }, dt);
    return true;
  }

  const afrCol = (v) => (v < 11 ? '#ff2a3d' : v < 12.8 ? '#ff7a50' : v < 15.5 ? '#e9e3e4' : '#3ee6ff');
  // ENGINE status words: smoothed value -> state with dead bands -> 0.8 s dwell before the word changes.
  const ENGW = {};
  function engWord(key, raw, pick) {
    const now = performance.now(), e = ENGW[key] || (ENGW[key] = { v: raw, s: null, c: null, ct: now, t: now });
    if (raw == null) { e.s = null; e.c = null; e.v = null; return null; }
    const dt = Math.min(2000, now - e.t); e.t = now; e.v = e.v == null ? raw : e.v + (raw - e.v) * (1 - Math.exp(-dt / 600));
    const cand = pick(e.v, e.s);
    if (e.s == null) e.s = cand;
    else if (cand !== e.s) { if (cand !== e.c) { e.c = cand; e.ct = now; } else if (now - e.ct >= 800) { e.s = cand; e.c = null; } }
    else e.c = null;
    return e.s;
  }
  const ENG_WCOL = { OK: '#7d6a6d', AMB: '#ffb020', RED: '#ff2a3d' };
  // lambda: boosted above 2 psi (leaves below 1.5). Off boost: OK 0.97-1.03, RICH below 0.97, LEAN above 1.05 (1.03-1.05 keeps the last word).
  // On boost, rich is expected; above 0.90 is LEAN! (clears below 0.88).
  function lamWord(bank, lam, boost) {
    const b = engWord('boost', boost ?? 0, (v, s) => (s === 'B' ? (v < 1.5 ? 'N' : 'B') : v > 2 ? 'B' : 'N')) === 'B';
    const w = engWord('lam' + bank + (b ? 'b' : 'n'), lam, b
      ? (v, s) => (s === 'LEAN!' ? (v < 0.88 ? 'RICH · BOOST OK' : 'LEAN!') : v > 0.9 ? 'LEAN!' : 'RICH · BOOST OK')
      : (v, s) => { if (s === 'RICH' && v < 0.975) return 'RICH'; if (s === 'LEAN' && v > 1.03) return 'LEAN'; return v < 0.97 ? 'RICH' : v > 1.05 ? 'LEAN' : s === 'LEAN' || s === 'RICH' || s == null ? 'OK' : s; });
    return w && [w, w === 'LEAN!' ? 'RED' : w === 'RICH' || w === 'LEAN' ? 'AMB' : 'OK'];
  }
  // fuel trim: total correction (short + long). OK within ±10% (leaves at ±10, returns inside ±8).
  function trimWord(bank, s, l) {
    const tot = s == null && l == null ? null : (s || 0) + (l || 0);
    const w = engWord('trim' + bank, tot, (v, st) => { const m = st && st !== 'OK' ? 8 : 10; return v > m ? 'ADDING FUEL' : v < -m ? 'PULLING FUEL' : 'OK'; });
    const a = Math.abs(ENGW['trim' + bank]?.v ?? 0);
    return w && [w, w === 'OK' ? 'OK' : a > 20 ? 'RED' : 'AMB'];
  }
  // cat temp: hotter bank. OK / HOT above 1400°F / TOO HOT above 1600°F, 30°F dead band on the way down.
  function catWord(c1, c2) {
    const m = c1 == null && c2 == null ? null : Math.max(c1 ?? -1e9, c2 ?? -1e9);
    const w = engWord('cat', m, (v, s) => { if (v > 1600 || (s === 'TOO HOT' && v > 1570)) return 'TOO HOT'; if (v > 1400 || (s !== 'OK' && s != null && v > 1370)) return 'HOT'; return 'OK'; });
    return w && [w, w === 'TOO HOT' ? 'RED' : w === 'HOT' ? 'AMB' : 'OK'];
  }
  // ENGINE (OBD+), condensed (Oct 19): lambda per bank, fuel trims per bank, cat temps, pedal, throttle, MAF, abs load.
  // A tile shows when any of its values has data; blank ones are left out and the rest reflow.
  function drawEngine() {
    const { ctx, w, h } = ZD.fit($('#cv-engine')), f = S.F || {};
    ZD.grid(ctx, w, h, 32, 0.035);
    const has = (...k) => k.some((x) => f[x] != null), n = (v, d) => (v == null ? '--' : (+v).toFixed(d)), sg = (v, d) => (v == null ? '--' : (v > 0 ? '+' : '') + (+v).toFixed(d));
    const trimCol = (...v) => { const m = Math.max(0, ...v.filter((x) => x != null).map(Math.abs)); return m > 20 ? '#ff2a3d' : m > 10 ? '#ffb020' : COL.TXT; };
    const lam = (k, b) => ({ show: has(k), lab: 'LAMBDA ' + b, big: n(f[k], 3), sub: f[k] != null ? `${(f[k] * 14.7).toFixed(1)} AFR GAS-EQ` : '', sub2: f.cmdLam != null ? `CMD ${n(f.cmdLam, 3)}` : '', word: lamWord(b, f[k], f.boost) });
    const trim = (s, l, b) => ({ show: has(s, l), lab: 'FUEL TRIM ' + b, pair: [['SHORT', sg(f[s], 1)], ['LONG', sg(f[l], 1)]], unit: '%', col: trimCol(f[s], f[l]), word: trimWord(b, f[s], f[l]) });
    const cm = Math.max(f.cat1 || 0, f.cat2 || 0);
    const TL = [lam('lam1', 'B1'), lam('lam2', 'B2'), trim('stft1', 'ltft1', 'B1'), trim('stft2', 'ltft2', 'B2'),
      { show: has('cat1', 'cat2'), lab: 'CAT TEMP', pair: [['B1', n(f.cat1, 0)], ['B2', n(f.cat2, 0)]], unit: '°F', col: cm > 1600 ? '#ff2a3d' : cm > 1400 ? '#ffb020' : COL.TXT, word: catWord(f.cat1, f.cat2) },
      { show: has('pedalD'), lab: 'PEDAL', big: n(f.pedalD, 0), sub: '%' },
      { show: has('relThr'), lab: 'THROTTLE', big: n(f.relThr, 0), sub: '% RELATIVE', sub2: f.cmdThr != null ? `CMD ${n(f.cmdThr, 0)}%` : '' },
      { show: has('maf'), lab: 'MAF', big: n(f.maf, 1), sub: 'G/S' }, { show: has('absLoad'), lab: 'ABS LOAD', big: n(f.absLoad, 0), sub: '%' }].filter((t) => t.show);
    if (!TL.length) { T(ctx, 'NO ENGINE DATA FROM THIS SOURCE', w / 2, h / 2, 13, COL.MUTE, 'center', 'txt', 700); return; }
    const rows = TL.length > 4 ? 2 : 1, cols = Math.ceil(TL.length / rows), tw = (w - 16) / cols, th = (h - 12) / rows;
    TL.forEach((t, i) => { const x = 8 + (i % cols) * tw, y = 6 + Math.floor(i / cols) * th, pw = tw - 6, ph = th - 6, big = ZD.clamp(Math.min(ph * 0.26, pw * 0.2), 16, 40);
      ZD.panel(ctx, x, y, pw, ph, t.lab);
      if (t.word) T(ctx, t.word[0], x + pw - 8, y + 15, pw < 140 ? 9 : 10, ENG_WCOL[t.word[1]], 'right', 'txt', 800);
      if (t.pair) { t.pair.forEach(([l, v], j) => { const cx = x + pw * (j ? 0.75 : 0.25); T(ctx, v, cx, y + ph * 0.56, big * 0.8, t.col, 'center', 'num', 700); T(ctx, l, cx, y + ph * 0.56 + 18, 10, COL.MUTE, 'center', 'txt', 700); });
        T(ctx, t.unit, x + pw / 2, y + ph - 8, 10, COL.MUTE, 'center', 'txt', 700); return; }
      const yb = y + ph * (t.sub2 ? 0.52 : 0.58);
      T(ctx, t.big, x + pw / 2, yb, big, COL.TXT, 'center', 'num', 700);
      T(ctx, t.sub, x + pw / 2, yb + 20, 10, COL.MUTE, 'center', 'txt', 700);
      if (t.sub2) T(ctx, t.sub2, x + pw / 2, y + ph - 9, 11, COL.TXT, 'center', 'txt', 700); });
  }
  // CODES → ECU INFO (OBD+): VIN / calibration (Mode 09, read once) and the since-clear / run-time PIDs. Hidden when there's nothing.
  function renderEcuInfo() { const f = S.F || {}, I = (S.src && S.src.info) || {}, R = [];
    const add = (k, v) => { if (v != null && v !== '') R.push(`<div class="hist"><span class="id">${k}</span><span>${esc(v)}</span><span class="c"></span></div>`); };
    const o2 = (m) => [0, 4].map((s, b) => { const l = [1, 2, 3, 4].filter((n) => m & (1 << (s + n - 1))); return l.length ? `B${b + 1}: S${l.join(', S')}` : ''; }).filter(Boolean).join(' · ');
    add('VIN', I.vin); add('CAL ID', I.calid); add('RUN', f.runTime != null ? tfmt(f.runTime) + ' this start' : null);
    add('CLEAR', f.distClr != null || f.timeClr != null || f.warmups != null ? [f.distClr != null ? Math.round(f.distClr).toLocaleString() + ' mi' : '', f.timeClr != null ? Math.round(f.timeClr / 60).toLocaleString() + ' h engine time' : '', f.warmups != null ? f.warmups + ' warm-ups' : ''].filter(Boolean).join(' · ') + ' since codes cleared' : null);
    add('MIL', f.distMil != null || f.timeMil != null ? `${Math.round(f.distMil || 0)} mi · ${Math.round(f.timeMil || 0)} min with check-engine light on` : null);
    add('FUEL', f.fuelType != null ? ({ 1: 'Gasoline', 2: 'Methanol', 3: 'Ethanol', 4: 'Diesel', 9: 'Bi-fuel gasoline', 0: 'Not reported' }[f.fuelType] || 'Type ' + f.fuelType) : null);
    add('O2', f.o2s != null ? o2(f.o2s) || 'none' : null);
    add('BARO', f.baro != null ? `${Math.round(f.baro)} kPa` : null); add('EVAP', f.purge != null || f.evapVp != null ? [f.purge != null ? `purge ${Math.round(f.purge)}%` : '', f.evapVp != null ? `vapor ${Math.round(f.evapVp)} Pa` : ''].filter(Boolean).join(' · ') : null);
    $('#ecuInfoBox').style.display = R.length ? '' : 'none'; const html = R.join(''); if ($('#ecuInfo').innerHTML !== html) $('#ecuInfo').innerHTML = html; }
  function drawGauges() {
    const { ctx, w, h } = ZD.fit($('#cv-gauges')), f = S.F || {};
    ZD.grid(ctx, w, h, 32, 0.035);
    const gw = Math.min(640, w - 300), cols = 5, tw = gw / cols, th = 124;
    const G = [
      ['BOOST', 'PSI', f.boost, { min: -15, max: C.boostGaugeMax, zero: 0, dec: 1, colorFn: (v) => (v > 0.5 ? '#ff2a3d' : '#6d5f62') }],
      ['AFR', 'GAS-EQ', f.afr, { min: 9, max: 20, dec: 1, colorFn: afrCol }],
      ['ETHANOL', '% E', f.ethanol, { min: 0, max: 100, dec: 0, color: '#ffb020' }],
      ['OIL TEMP', '°F', f.oil, { min: 100, max: 300, danger: 260 }],
      ['COOLANT', '°F', f.coolant, { min: 100, max: 260, danger: 225 }],
      ['INTAKE', '°F IAT', f.iat, { min: 40, max: 200, danger: 150 }],
      ['THROTTLE', '%', f.throttle, { min: 0, max: 100 }],
      ['TIMING', '° BTDC', f.timing, { min: -10, max: 50, dec: 1 }],
      ['VOLTS', 'V', f.volts, { min: 10, max: 16, dec: 1, danger: 15 }],
      ['LOAD', '%', f.load, { min: 0, max: 160 }],
    ];
    // Layout scales with the viewport HEIGHT so short landscape phones (e.g. 1024x400 with Chrome bars) keep a usable chart.
    // Tall enough: 2 tile rows + chart under them (chart ≥ ~32% of height). Short: chart moves to the right column under a smaller G-force circle.
    const minChart = Math.max(110, h * 0.32), short = h < 400 || (h - 26 - 2 * 62) < minChart;
    const thT = short ? ZD.clamp((h - 18) / 2, 56, 124) : ZD.clamp((h - 26 - minChart) / 2, 62, 124), k = thT / 124;
    // blank tiles hidden (live OBD, see viewCaps): the rest reflow into two full-width rows (10 tiles = the usual 5 + 5)
    const cp = viewCaps(), KEYS = ['boost', 'afr', 'ethanol', 'oil', 'coolant', 'iat', 'throttle', 'timing', 'volts', 'load'], Gv = cp ? G.filter((g, i) => cp.has(KEYS[i])) : G;
    const c0 = Math.ceil(Gv.length / 2);
    Gv.forEach(([lab, unit, val, o], j) => {
      const row = j < c0 ? 0 : 1, tw = gw / (row ? Gv.length - c0 : c0), i = row ? j - c0 : j;
      const cx = 8 + i * tw, cy = 6 + row * (thT + 4);
      ZD.panel(ctx, cx, cy, tw - 6, thT);
      const danger = o.danger !== undefined && val > o.danger, r = Math.max(22, Math.min(40 * k, (tw - 6) * 0.36));
      ZD.arcGauge(ctx, cx + (tw - 6) / 2, cy + Math.max(30, 58 * k), r, val, lab, unit, Object.assign({ big: Math.max(13, 19 * k), lw: Math.max(4, 6 * k) }, o, danger ? { color: '#ffffff' } : {}));
    });
    // right column: G-force (full height, or the top part on short screens)
    const fx = gw + 8, fw = w - fx - 8, gH = short ? Math.round(h * 0.46) : h - 14;
    // throttle / boost / rpm trace: under the tiles, or in the right column under the G circle on short screens
    const cX = short ? fx : 8, cW = short ? fw : gw - 6, ty = short ? 6 + gH + 6 : 6 + 2 * (thT + 4), tH = h - ty - 8;
    const nb = cp && !cp.has('boost'); ZD.panel(ctx, cX, ty, cW, tH, nb ? 'THROTTLE · RPM  (20 s)' : 'THROTTLE · BOOST · RPM  (20 s)');
    const top = ty + 26, bot = ty + tH - 10, now = S.F ? S.F.t : 0, px = (t) => cX + 4 + ((t - (now - 20)) / 20) * (cW - 8), py = (v, lo, hi) => bot - ((v - lo) / (hi - lo)) * (bot - top);
    ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1; for (let q = 0; q <= 4; q++) { const y = top + ((bot - top) * q) / 4; ctx.beginPath(); ctx.moveTo(cX + 4, y); ctx.lineTo(cX + cW - 4, y); ctx.stroke(); }
    const line = (key, lo, hi, col, lw, glow) => {
      ctx.save(); ctx.beginPath(); ctx.rect(cX + 2, top - 4, cW - 4, bot - top + 8); ctx.clip(); ctx.beginPath(); let st = false;
      for (const p of S.hist) { if (p[key] == null) continue; const X = px(p.t), Y = py(ZD.clamp(p[key], lo, hi), lo, hi); st ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); st = true; }
      ctx.lineJoin = 'round'; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.shadowColor = col; ctx.shadowBlur = glow; ctx.stroke(); ctx.shadowBlur = 0; ctx.restore();
    };
    line('rpm', 0, 8000, 'rgba(235,235,245,.6)', 1.8, 0);
    if (!nb) line('b', -15, C.boostGaugeMax, '#ffc040', 2.6, 6);
    line('th', 0, 100, '#ff3b4e', 3.2, 10);
    T(ctx, 'THR', cX + cW - (nb ? 66 : 96), ty + 15, 11, '#ff3b4e', 'left', 'txt', 700); if (!nb) T(ctx, 'BST', cX + cW - 66, ty + 15, 11, '#ffc040', 'left', 'txt', 700); T(ctx, 'RPM', cX + cW - 36, ty + 15, 11, '#d8d0d2', 'left', 'txt', 700);
    // friction circle
    ZD.panel(ctx, fx, 6, fw, gH, 'G-FORCE');
    const R = Math.max(20, Math.min(fw, gH - (short ? 50 : 80)) / 2 - 10), ccx = fx + fw / 2, ccy = short ? 6 + gH / 2 + 4 : 6 + 22 + R + 4, gmax = 1.2;
    ctx.strokeStyle = 'rgba(255,42,61,.25)'; ctx.lineWidth = 1;
    for (const g of [0.4, 0.8, 1.2]) { ctx.beginPath(); ctx.arc(ccx, ccy, (R * g) / gmax, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(ccx - R, ccy); ctx.lineTo(ccx + R, ccy); ctx.moveTo(ccx, ccy - R); ctx.lineTo(ccx, ccy + R); ctx.stroke();
    T(ctx, '0.8g', ccx + (R * 0.8) / gmax + 3, ccy - 3, 9, COL.MUTE); if (!short) { T(ctx, 'ACCEL', ccx, ccy - R - 3, 9, COL.MUTE, 'center'); T(ctx, 'BRAKE', ccx, ccy + R + 11, 9, COL.MUTE, 'center'); }
    S.gTrail.forEach(([la, lo], i) => { ctx.fillStyle = `rgba(255,42,61,${(i / S.gTrail.length) * 0.5})`; ctx.beginPath(); ctx.arc(ccx + (la / gmax) * R, ccy - (lo / gmax) * R, 2, 0, Math.PI * 2); ctx.fill(); });
    const la = f.latG || 0, lo = f.lonG || 0;
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#ff2a3d'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(ccx + (ZD.clamp(la, -gmax, gmax) / gmax) * R, ccy - (ZD.clamp(lo, -gmax, gmax) / gmax) * R, 6, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    S.gaugeLayout = { short, chart: [cX, ty, cW, tH], tileH: thT, h };
    const by = short ? 6 + gH - 10 : h - 22;
    T(ctx, `LAT ${Math.abs(la).toFixed(2)}`, fx + 12, by, 13, COL.TXT, 'left', 'txt', 700);
    T(ctx, `LON ${lo.toFixed(2)}`, fx + fw / 2, by, 13, COL.TXT, 'center', 'txt', 700);
    T(ctx, `PEAK ${Math.max(S.trip.peakLat, S.trip.peakLon).toFixed(2)}g`, fx + fw - 12, by, 13, COL.RED, 'right', 'txt', 700);
  }

  function drawCar(dt) {
    const { ctx, w, h } = ZD.fit($('#cv-car')), f = S.F || {};
    // smooth auto-rotate (eases back in after a drag) + drag inertia
    const idle = performance.now() - S.lastDrag;
    if (S.dragging) { /* finger is on it */ } else if (Math.abs(S.yawVel) > 0.02) { S.yaw += S.yawVel * dt; S.yawVel *= Math.pow(0.04, dt); }
    else if (S.autoRot && idle > 2500) S.yaw += dt * 0.22 * ZD.clamp((idle - 2500) / 1500, 0, 1);
    S.wheelAng += ((f.speed || 0) * 0.44704 / 0.34) * dt;
    if (ZD.Xray && ZD.Xray.ready) { drawXray(ctx, w, h, f); return; }
    ZD.drawCar3D(ctx, w, h, S.yaw, 0.32, { t: performance.now() / 1000, boost: f.boost ?? -10, brake: f.brake, throttle: f.throttle, iat: f.iat, wheelAng: S.wheelAng, on: S.partsOn });
    T(ctx, 'GTM STAGE 1 ROTREX · X-RAY', w / 2, 20, 12, COL.MUTE, 'center', 'txt', 700);
    T(ctx, 'DRAG TO ROTATE', w - 14, h - 14, 10, '#5a4a4d', 'right');
  }

  function drawXray(ctx, w, h, f) {
    ZD.grid(ctx, w, h, 32, 0.04);
    const X = ZD.Xray, top = 26, bot = 52;
    const pts = X.render(ctx, 0, top, w, h - top - bot, { yaw: S.yaw, pitch: S.pitch, dist: 5.8, st: { t: performance.now() / 1000, boost: f.boost ?? -10, boostPeak: C.boostPeakPsi, iat: f.iat, brake: f.brake, lonG: f.lonG, throttle: f.throttle, rpm: f.rpm, speed: f.speed, wheelAng: S.wheelAng, on: S.partsOn } }) || [];
    // leader lines: anchor dot exactly on the projected part, label column left/right, de-overlapped
    const val = { sc: f.boost != null ? `${f.boost >= 0 ? '+' : ''}${f.boost.toFixed(1)} psi` : '--', ic: f.iat != null ? `IAT ${Math.round(f.iat)}°F` : '--', brakes: f.brake != null ? `${Math.round(f.brake * 100)}%` : (f.lonG != null && f.lonG < -0.1 ? `${(-f.lonG).toFixed(2)} g` : 'OFF'), diff: f.throttle != null ? `THR ${Math.round(f.throttle)}%` : '--', engine: f.rpm != null ? `${Math.round(f.rpm)} rpm` : '--', trans: f.gear ? `GEAR ${f.gear}` : 'N', shaft: f.speed != null ? `${Math.round(f.speed)} mph` : '--' };
    const L = pts.filter((p) => p.x < w / 2).sort((a, b) => a.y - b.y), R = pts.filter((p) => p.x >= w / 2).sort((a, b) => a.y - b.y);
    const place = (arr) => { let y = top + 22; arr.forEach((p) => { p.ly = Math.max(ZD.clamp(p.y, top + 22, h - bot - 10), y); y = p.ly + 38; }); const over = y - 38 - (h - bot - 10); if (over > 0) arr.forEach((p) => (p.ly -= over)); };
    place(L); place(R);
    [[L, 16, 'left'], [R, w - 16, 'right']].forEach(([arr, lx, al]) => arr.forEach((p) => {
      const ex = al === 'left' ? lx + 150 : lx - 150, a = 0.45 + 0.55 * p.glow;
      ctx.strokeStyle = p.color; ctx.globalAlpha = a; ctx.lineWidth = 1.2; ctx.shadowColor = p.color; ctx.shadowBlur = 6 * p.glow;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ex, p.ly); ctx.lineTo(lx, p.ly); ctx.stroke();
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.globalAlpha = a * 0.5; ctx.stroke();
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      T(ctx, p.label, lx, p.ly - 5, 11, '#fff', al, 'txt', 700);
      T(ctx, val[p.key] || '', lx, p.ly + 11, 12, p.color, al, 'num', 700, 6 * p.glow);
    }));
    T(ctx, 'GTM STAGE 1 ROTREX · X-RAY', w / 2, 18, 12, COL.MUTE, 'center', 'txt', 700);
    if (X.credit) { T(ctx, `3D MODEL "${X.credit.title}" · ${X.credit.author}`, w - 14, h - 30, 9, '#7a6a6d', 'right'); T(ctx, `${X.credit.license} · Sketchfab · recolored for Z-DASH`, w - 14, h - 16, 9, '#7a6a6d', 'right'); }
    else T(ctx, 'MODEL: PROCEDURAL Z34 (3D MODEL NOT LOADED)', 14, 18, 9, '#6a5a5d', 'left');
    T(ctx, 'DRAG TO ROTATE', w - 14, 18, 10, '#5a4a4d', 'right');
  }

  function drawDyno() {
    const { ctx, w, h } = ZD.fit($('#cv-dyno')), run = S.lastDyno, best = S.bestDyno;
    ZD.grid(ctx, w, h, 32, 0.035);
    const gx = 50, gy = 14, gw = w - 330, gh = h - 50, r0 = 2000, r1 = 7500, vmax = 550;
    const X = (r) => gx + ((r - r0) / (r1 - r0)) * gw, Y = (v) => gy + gh - (v / vmax) * gh;
    ZD.panel(ctx, gx - 40, gy - 6, gw + 52, gh + 40);
    ctx.strokeStyle = 'rgba(255,42,61,.12)'; ctx.lineWidth = 1;
    for (let v = 0; v <= vmax; v += 100) { ctx.beginPath(); ctx.moveTo(gx, Y(v)); ctx.lineTo(gx + gw, Y(v)); ctx.stroke(); T(ctx, String(v), gx - 6, Y(v) + 4, 10, COL.MUTE, 'right'); }
    for (let r = 2000; r <= 7500; r += 500) { ctx.beginPath(); ctx.moveTo(X(r), gy); ctx.lineTo(X(r), gy + gh); ctx.stroke(); if (r % 1000 === 0) T(ctx, String(r / 1000) + 'k', X(r), gy + gh + 14, 10, COL.MUTE, 'center'); }
    T(ctx, 'RPM', gx + gw, gy + gh + 28, 10, COL.MUTE, 'right');
    // stock ghost curve
    ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(200,190,192,.35)'; ctx.lineWidth = 1.2; ctx.beginPath();
    C.stockCurve.forEach(([r, tq], i) => { const hp = (tq * r) / 5252; i ? ctx.lineTo(X(r), Y(hp)) : ctx.moveTo(X(r), Y(hp)); }); ctx.stroke(); ctx.setLineDash([]);
    T(ctx, 'STOCK ~275 WHP', X(7400), Y(290), 10, 'rgba(200,190,192,.55)', 'right');
    const plot = (curve, key, col, lw, glow) => { ctx.beginPath(); curve.forEach((c, i) => (i ? ctx.lineTo(X(c.rpm), Y(c[key])) : ctx.moveTo(X(c.rpm), Y(c[key])))); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.shadowColor = col; ctx.shadowBlur = glow; ctx.stroke(); ctx.shadowBlur = 0; };
    if (run) { plot(run.curve, 'tq', '#e9e3e4', 2, 4); plot(run.curve, 'hp', '#ff2a3d', 3, 12); }
    // live pull trace
    const cur = S.dyno.cur;
    if (cur && cur.pts.length) { const p = cur.pts[cur.pts.length - 1]; ctx.strokeStyle = '#ffb020'; ctx.beginPath(); ctx.moveTo(X(p.rpm), gy); ctx.lineTo(X(p.rpm), gy + gh); ctx.stroke(); }
    // readout
    const rx = w - 260;
    T(ctx, 'PEAK WHP', rx, 34, 12, COL.MUTE, 'left', 'txt', 700);
    T(ctx, run ? String(run.peakHp) : '---', rx, 96, 60, '#ffffff', 'left', 'num', 800, run ? 16 : 0);
    T(ctx, run ? `@ ${run.peakHpRpm.toLocaleString()} RPM` : '', rx, 116, 13, COL.RED, 'left', 'txt', 700);
    T(ctx, 'PEAK TORQUE', rx, 148, 12, COL.MUTE, 'left', 'txt', 700);
    T(ctx, run ? `${run.peakTq} LB-FT` : '---', rx, 178, 26, COL.TXT, 'left', 'num', 700);
    T(ctx, run ? `@ ${run.peakTqRpm.toLocaleString()} RPM · GEAR ${run.gear}` : '', rx, 196, 13, COL.MUTE, 'left', 'txt', 700);
    let status = run ? `RUN ${S.dyno.runs.length}${best && best !== run ? ` · BEST ${best.peakHp} WHP` : ''}` : 'NO PULL YET';
    if (cur && cur.pts.length > 3) status = `PULL IN PROGRESS · GEAR ${cur.gear} · ${Math.round(cur.pts[cur.pts.length - 1].rpm).toLocaleString()} RPM`;
    T(ctx, status, rx, 228, 13, cur ? '#ffb020' : COL.TXT, 'left', 'txt', 700);
    T(ctx, 'Estimated from acceleration (weight, drag,', rx, 258, 11, COL.MUTE);
    T(ctx, 'rolling resistance). Fun number, not a real dyno.', rx, 272, 11, COL.MUTE);
    T(ctx, 'Live: full throttle in 3rd or 4th from ~2,500 rpm.', rx, 290, 11, COL.MUTE);
    T(ctx, '— WHP   — TORQUE', gx + 6, gy + 16, 11, COL.MUTE);
    ctx.fillStyle = '#ff2a3d'; ctx.fillRect(gx + 6, gy + 12, 10, 2); ctx.fillStyle = '#e9e3e4'; ctx.fillRect(gx + 56, gy + 12, 10, 2);
  }

  const tfmt = (s) => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  function drawTrip() {
    const { ctx, w, h } = ZD.fit($('#cv-trip')), tr = S.trip, sc = S.scorer;
    ZD.grid(ctx, w, h, 32, 0.035);
    const tiles = [
      ['TRIP TIME', tr.t0 !== null ? tfmt(tr.tLast - tr.t0) : '--'], ['DISTANCE', `${tr.dist.toFixed(1)} MI`],
      ['MAX SPEED', `${Math.round(tr.maxSpeed)} MPH`], ['MAX RPM', Math.round(tr.maxRpm).toLocaleString()],
      ['MAX BOOST', tr.maxBoost > -99 ? `${tr.maxBoost.toFixed(1)} PSI` : '--'], ['PEAK G', `${Math.max(tr.peakLat, tr.peakLon).toFixed(2)} g`],
    ];
    const tw = 140, th = 62;
    tiles.forEach(([l, v], i) => { const x = 10 + (i % 2) * (tw + 6), y = 8 + Math.floor(i / 2) * (th + 6); ZD.panel(ctx, x, y, tw, th, l); T(ctx, v, x + 10, y + 48, 21, COL.TXT, 'left', 'num', 700); });
    // health watch · warm idle
    { const iy = 214, ih = h - iy - 8, iw = 2 * tw + 6; ZD.panel(ctx, 10, iy, iw, ih, 'HEALTH · WARM IDLE');
      const n = S.ex ? S.ex.idleNow() : {}, hist = S.ex ? S.ex.cfg.idle.hist.slice(-12) : [], base = n.base;
      const flag = n.stalls ? 'STALL' : n.dips ? 'DIPPED' : n.avg != null ? 'STEADY' : 'WAITING';
      const fcol = n.stalls ? COL.RED : n.dips ? '#ffb020' : n.avg != null ? '#3ee6ff' : COL.MUTE;
      T(ctx, n.avg != null ? String(Math.round(n.avg)) : '--', 22, iy + 62, 34, '#fff', 'left', 'num', 800);
      T(ctx, 'AVG WARM IDLE RPM', 22, iy + 80, 9, COL.MUTE, 'left', 'txt', 700);
      T(ctx, flag, iw, iy + 30, 14, fcol, 'right', 'num', 700, flag === 'STEADY' ? 0 : 8);
      T(ctx, n.avg != null ? `min ${Math.round(n.min)} · ${Math.round(n.secs)} s` : 'warm · stopped · neutral', iw, iy + 50, 11, COL.MUTE, 'right', 'txt', 600);
      T(ctx, base ? `usual ~${Math.round(base)} · flag <${Math.round(base - S.ex.cfg.health.idleDip)} or stall` : 'learning your usual idle', iw, iy + 66, 10, COL.MUTE, 'right', 'txt', 600);
      // trend across drives (+ this drive)
      const pts = hist.map((d) => d.avg).concat(n.avg != null ? [n.avg] : []), gx = 22, gy = iy + 94, gw = iw - 24, gh = ih - 116;
      T(ctx, `TREND · LAST ${pts.length} DRIVES`, gx, gy + gh + 16, 9, COL.MUTE, 'left', 'txt', 700);
      if (pts.length > 1 && gh > 20) { const lo = Math.min(...pts, base || 1e9) - 40, hi = Math.max(...pts, base || 0) + 40, Y = (v) => gy + gh - ((v - lo) / (hi - lo)) * gh, X = (i) => gx + (i / (pts.length - 1)) * gw;
        if (base) { ctx.strokeStyle = 'rgba(62,230,255,.35)'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(gx, Y(base)); ctx.lineTo(gx + gw, Y(base)); ctx.stroke(); ctx.strokeStyle = 'rgba(255,176,32,.35)'; ctx.beginPath(); ctx.moveTo(gx, Y(base - S.ex.cfg.health.idleDip)); ctx.lineTo(gx + gw, Y(base - S.ex.cfg.health.idleDip)); ctx.stroke(); ctx.setLineDash([]); }
        ctx.strokeStyle = COL.RED; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)))); ctx.stroke();
        pts.forEach((v, i) => { const d = hist[i], bad = d && (d.stalls || d.dips); ctx.fillStyle = i === pts.length - 1 && n.avg != null ? '#fff' : bad ? '#ffb020' : COL.RED; ctx.beginPath(); ctx.arc(X(i), Y(v), 2.6, 0, 7); ctx.fill(); });
        T(ctx, `${Math.round(Math.min(...pts))}–${Math.round(Math.max(...pts))}`, gx + gw, gy + gh + 16, 9, COL.MUTE, 'right', 'num', 700); } }
    // score block
    const sx = 310, sw = 270;
    ZD.panel(ctx, sx, 8, sw, 200, `SHIFT SCORE · ${S.mode.toUpperCase()} MODE`);
    T(ctx, sc.total.toLocaleString(), sx + sw / 2, 80, 44, '#fff', 'center', 'num', 800, 14);
    const best = S.stats ? S.stats[S.mode].best : 0, drv = S.mode === 'cruise' ? sc.drivingScore() : null;
    T(ctx, `COMBO ×${sc.bestCombo} · ${sc.M.n} SHIFTS · BEST ${Math.max(best, sc.total).toLocaleString()}` + (drv !== null ? ` · DRIVING ${drv}/100` : ''), sx + sw / 2, 104, 12, COL.MUTE, 'center', 'txt', 700);
    const tot = Math.max(1, sc.shifts.length), bx = sx + 16, bw = sw - 32;
    let acc = 0;
    for (const [k, col] of [['PERFECT', '#ff2a3d'], ['GOOD', '#9a2430'], ['SLOPPY', '#3a2a2d']]) {
      const n = tr.counts[k], ww = (n / tot) * bw; ctx.fillStyle = col; ctx.fillRect(bx + acc, 122, ww, 12); acc += ww;
    }
    ['PERFECT', 'GOOD', 'SLOPPY'].forEach((k, i) => { T(ctx, `${k} ${tr.counts[k]}`, bx + (i * bw) / 3 + (i === 0 ? 0 : 0), 156, 13, i === 0 ? COL.RED : COL.TXT, 'left', 'txt', 700); });
    const avg = (key) => { const v = sc.shifts.filter((s) => s.parts[key] !== undefined).map((s) => s.parts[key]); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
    const parts = [['CLUTCH', avg('clutch')], ['LURCH', avg('lurch')], ['TIME', avg('time')], ['PICKUP', avg('pickup')]];
    parts.forEach(([k, v], i) => { const x = bx + i * (bw / 4); T(ctx, k, x, 180, 10, COL.MUTE, 'left', 'txt', 700); T(ctx, v === null ? '--' : String(v), x, 198, 15, COL.TXT, 'left', 'num', 700); });
    const F = S.fuel;
    ZD.panel(ctx, sx, 214, sw, h - 222, 'FUEL · TRIP-BASED');
    if (F) {
      const rs = String(Math.round(F.range));
      T(ctx, rs, sx + 12, 262, 34, F.low ? COL.RED : '#fff', 'left', 'num', 800, F.low ? 12 : 0);
      const rw = ctx.measureText(rs).width;
      T(ctx, F.low ? 'MI TO EMPTY · LOW FUEL' : 'MI TO EMPTY', sx + 22 + rw, 262, 12, F.low ? COL.RED : COL.MUTE, 'left', 'txt', 700);
      T(ctx, `${F.milesSinceFill.toFixed(1)} mi since fill-up · avg ${Math.round(F.avgMiles)} mi/tank`, sx + 12, 284, 12, COL.MUTE, 'left', 'txt', 600);
      T(ctx, `≈ ${F.mpg.toFixed(1)} mpg · ${F.settings.tankGal} gal tank` + (S.F && S.F.fuelLevel != null ? ` · sender ${S.F.fuelLevel}%` : ''), sx + 12, 300, 12, COL.MUTE, 'left', 'txt', 600);
      ctx.fillStyle = '#1c0a0d'; ctx.fillRect(sx + 12, 310, sw - 24, 6); ctx.fillStyle = F.low ? COL.RED : '#b0202f'; ctx.fillRect(sx + 12, 310, (sw - 24) * F.pct, 6);
    }
    // coaching + recent shifts
    const lx = sx + sw + 10, lw = w - lx - 10;
    ZD.panel(ctx, lx, 8, lw, h - 70, `COACH · ${S.mode.toUpperCase()}`);
    let cy = 34;
    for (const tip of coachTips().slice(0, 4)) cy = ZD.wrap(ctx, '▸ ' + tip, lx + 10, cy, lw - 20, 14, 12, COL.TXT) + 4;
    T(ctx, 'RECENT SHIFTS', lx + 10, cy + 10, 11, COL.MUTE, 'left', 'txt', 600);
    sc.shifts.slice(-Math.max(0, Math.floor((h - 90 - cy) / 20))).reverse().forEach((s, i) => {
      const y = cy + 30 + i * 20, col = s.rating === 'PERFECT' ? '#ff2a3d' : s.rating === 'GOOD' ? '#e9e3e4' : '#7a6a6d';
      T(ctx, `${s.from}→${s.to}`, lx + 10, y, 13, COL.TXT, 'left', 'num', 700);
      T(ctx, s.rating, lx + 56, y, 12, col, 'left', 'txt', 700);
      T(ctx, String(s.score), lx + 120, y, 12, COL.TXT, 'left', 'num', 700);
      T(ctx, `${s.mode === 'race' ? 'R' : 'C'} · ${s.raw.shiftRpm.toLocaleString()} rpm · ${s.raw.duration}s`, lx + lw - 10, y, 11, COL.MUTE, 'right', 'txt', 600);
    });
  }

  // ---------------- HANDLING (estimated from the phone's accelerometer/gyro + speed) ----------------
  function drawHandling() {
    const { ctx, w, h } = ZD.fit($('#cv-handling')), f = S.F || {};
    ZD.grid(ctx, w, h, 32, 0.035);
    const lat = f.latG || 0, lon = f.lonG || 0, v = (f.speed || 0) * 0.44704, LIM = C.tractionG || 0.85;
    const H = (S.hand ||= { trail: [], peakL: 0, peakR: 0, yawF: 0 });
    // yaw rate: phone gyro if present, else (demo) derived from lateral g and speed with a little driver noise
    const yawExp = v > 3 ? (lat * 9.81 / v) * 57.3 : 0;
    const yawMeas = S.motion.hasGyro ? S.motion.yaw : yawExp * (1 + 0.08 * Math.sin(performance.now() / 900));
    H.yawF += (yawMeas - H.yawF) * 0.15; H.yawEF = (H.yawEF || 0) + (yawExp - (H.yawEF || 0)) * 0.15;
    if (lat < 0) H.peakL = Math.max(H.peakL, -lat); else H.peakR = Math.max(H.peakR, lat);
    // ---- grip arch: peak = STRAIGHT (all grip left for braking/accel), slopes = cornering load L / R ----
    const ax = 20, aw = w * 0.56, ay = 40, ah = h - 120, cx = ax + aw / 2, base = ay + ah;
    ZD.panel(ctx, ax - 8, ay - 28, aw + 16, ah + 78, 'TRACTION · CORNERING LOAD  (ESTIMATED)');
    const X = (g) => cx + (g / (LIM * 1.25)) * (aw / 2), Y = (gl) => base - Math.sqrt(Math.max(0, 1 - (gl / (LIM * 1.25)) ** 2)) * ah * 0.92;
    // zones under the curve
    for (let i = -50; i < 50; i++) { const g0 = (i / 50) * LIM * 1.25, g1 = ((i + 1) / 50) * LIM * 1.25, u = Math.abs(g0) / LIM;
      ctx.fillStyle = u > 1 ? 'rgba(255,42,61,.28)' : u > 0.8 ? 'rgba(255,176,32,.16)' : 'rgba(62,230,255,.07)';
      ctx.beginPath(); ctx.moveTo(X(g0), base); ctx.lineTo(X(g0), Y(Math.abs(g0))); ctx.lineTo(X(g1), Y(Math.abs(g1))); ctx.lineTo(X(g1), base); ctx.fill(); }
    ctx.strokeStyle = '#ff2a3d'; ctx.lineWidth = 2.5; ctx.shadowColor = '#ff2a3d'; ctx.shadowBlur = 10; ctx.beginPath();
    for (let i = -60; i <= 60; i++) { const g = (i / 60) * LIM * 1.25; i === -60 ? ctx.moveTo(X(g), Y(Math.abs(g))) : ctx.lineTo(X(g), Y(Math.abs(g))); } ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,42,61,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, base); ctx.lineTo(ax + aw, base); ctx.stroke();
    [-1, -0.5, 0.5, 1].forEach((k) => { const g = k * LIM; ctx.strokeStyle = 'rgba(255,42,61,.18)'; ctx.beginPath(); ctx.moveTo(X(g), base); ctx.lineTo(X(g), Y(Math.abs(g))); ctx.stroke(); T(ctx, `${Math.abs(g).toFixed(2)}g`, X(g), base + 14, 10, COL.MUTE, 'center'); });
    T(ctx, 'STRAIGHT', cx, Y(0) - 10, 12, '#fff', 'center', 'txt', 800, 8);
    T(ctx, '◀ LEFT TURN', ax + 6, base + 30, 11, COL.MUTE, 'left', 'txt', 700); T(ctx, 'RIGHT TURN ▶', ax + aw - 6, base + 30, 11, COL.MUTE, 'right', 'txt', 700);
    T(ctx, 'LIMIT', X(-LIM), Y(LIM) - 8, 10, COL.RED, 'center', 'txt', 700); T(ctx, 'LIMIT', X(LIM), Y(LIM) - 8, 10, COL.RED, 'center', 'txt', 700);
    // trail + live marker (lateral g; marker glows with total grip used incl. braking/accel)
    H.trail.push(lat); if (H.trail.length > 90) H.trail.shift();
    H.trail.forEach((g, i) => { ctx.fillStyle = `rgba(255,42,61,${(i / H.trail.length) * 0.35})`; ctx.beginPath(); ctx.arc(X(g), Y(Math.abs(g)), 2.5, 0, 7); ctx.fill(); });
    const used = Math.min(1.5, Math.hypot(lat, lon) / LIM), mcol = used > 1 ? '#ff2a3d' : used > 0.8 ? '#ffb020' : '#3ee6ff';
    const mx = X(ZD.clamp(lat, -LIM * 1.25, LIM * 1.25)), my = Y(Math.min(Math.abs(lat), LIM * 1.25));
    ctx.strokeStyle = mcol; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, base); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = mcol; ctx.shadowColor = mcol; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(mx, my, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    T(ctx, `${Math.abs(lat).toFixed(2)}g ${lat < -0.03 ? 'L' : lat > 0.03 ? 'R' : ''}`, mx, my - 14, 14, '#fff', 'center', 'num', 700, 6);
    T(ctx, `GRIP USED ${Math.round(used * 100)}%`, ax + 6, ay + 16, 13, mcol, 'left', 'num', 700, 6);
    T(ctx, `PEAK  L ${H.peakL.toFixed(2)}g  ·  R ${H.peakR.toFixed(2)}g`, ax + aw - 6, ay + 16, 12, COL.MUTE, 'right', 'txt', 700);
    // ---- right side: wheel load estimates + friction circle + yaw ----
    const rx = ax + aw + 24, rw = w - rx - 12;
    ZD.panel(ctx, rx, ay - 28, rw, 196, 'WHEEL LOAD  (EST. FROM G)');
    // 370Z ≈ 53/47 front/rear static; transfer = g · CG height / wheelbase (or track)
    const hcg = 0.48, WB = 2.55, TR = 1.55, fr = 0.53;
    const dLon = lon * hcg / WB, dLat = lat * hcg / TR;
    const load = { FL: (fr - dLon) * (0.5 + dLat), FR: (fr - dLon) * (0.5 - dLat), RL: (1 - fr + dLon) * (0.5 + dLat), RR: (1 - fr + dLon) * (0.5 - dLat) }; // left turn (lat<0) loads the right-side (outside) tyres
    const tx = rx + rw / 2, ty = ay + 70;
    [['FL', -1, -1], ['FR', 1, -1], ['RL', -1, 1], ['RR', 1, 1]].forEach(([k, sx, sy]) => {
      const pct = Math.max(0, load[k]) * 100, bx = tx + sx * (rw * 0.25) , by = ty + sy * 46, hot = pct > 34 ? '#ff2a3d' : pct > 28 ? '#ffb020' : pct < 18 ? '#3ee6ff' : COL.TXT;
      ctx.strokeStyle = hot; ctx.lineWidth = 1.5; ctx.shadowColor = hot; ctx.shadowBlur = pct > 28 ? 10 : 0; ctx.strokeRect(bx - 14, by - 26, 28, 52); ctx.shadowBlur = 0;
      ctx.fillStyle = hot; ctx.globalAlpha = 0.35; const fh = ZD.clamp(pct / 45, 0, 1) * 48; ctx.fillRect(bx - 12, by + 24 - fh, 24, fh); ctx.globalAlpha = 1;
      T(ctx, k, bx + sx * 34, by - 8, 11, COL.MUTE, 'center', 'txt', 700); T(ctx, `${pct.toFixed(0)}%`, bx + sx * 34, by + 12, 16, hot, 'center', 'num', 700);
    });
    ctx.strokeStyle = 'rgba(255,42,61,.25)'; ctx.beginPath(); ctx.moveTo(tx, ty - 60); ctx.lineTo(tx, ty + 60); ctx.moveTo(tx - rw * 0.25, ty - 46); ctx.lineTo(tx + rw * 0.25, ty - 46); ctx.moveTo(tx - rw * 0.25, ty + 46); ctx.lineTo(tx + rw * 0.25, ty + 46); ctx.stroke();
    T(ctx, 'FRONT', tx, ty - 66, 9, COL.MUTE, 'center', 'txt', 700);
    // friction circle + yaw / balance
    const by2 = ay + 178; ZD.panel(ctx, rx, by2, rw, h - by2 - 12, 'G-G · BALANCE');
    const R = Math.min(48, (h - by2 - 40) / 2), fcx = rx + R + 18, fcy = by2 + 24 + R;
    ctx.strokeStyle = 'rgba(255,42,61,.35)'; [1, 0.5].forEach((k) => { ctx.beginPath(); ctx.arc(fcx, fcy, R * k, 0, 7); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(fcx - R, fcy); ctx.lineTo(fcx + R, fcy); ctx.moveTo(fcx, fcy - R); ctx.lineTo(fcx, fcy + R); ctx.stroke();
    ctx.fillStyle = mcol; ctx.shadowColor = mcol; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(fcx + ZD.clamp(lat / LIM, -1.2, 1.2) * R, fcy - ZD.clamp(lon / LIM, -1.2, 1.2) * R, 5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    const ratio = Math.abs(H.yawEF) > 3 ? H.yawF / H.yawEF : 1;
    const bal = Math.abs(H.yawEF) < 3 ? 'STRAIGHT' : ratio < 0.85 ? 'UNDERSTEER?' : ratio > 1.15 ? 'OVERSTEER?' : 'NEUTRAL';
    const qx = fcx + R + 16;
    T(ctx, 'YAW RATE', qx, fcy - 22, 10, COL.MUTE, 'left', 'txt', 700); T(ctx, `${H.yawF.toFixed(1)}°/s`, qx, fcy - 4, 16, COL.TXT, 'left', 'num', 700);
    T(ctx, 'BALANCE', qx, fcy + 18, 10, COL.MUTE, 'left', 'txt', 700); T(ctx, bal, qx, fcy + 36, 14, bal === 'NEUTRAL' || bal === 'STRAIGHT' ? '#3ee6ff' : '#ffb020', 'left', 'num', 700);
    // honesty footer
    T(ctx, S.motion.hasGyro ? 'ESTIMATED from phone accelerometer + gyro and speed. OBD has no steering angle or tire slip.' : 'ESTIMATED from g-forces and speed (no gyro: yaw is derived). OBD has no steering angle or tire slip.', ax, h - 8, 10, '#6a5a5d', 'left');
  }

  function drawRuns() {
    const { ctx, w, h } = ZD.fit($('#cv-runs')), X = S.ex; if (!X) return;
    ZD.grid(ctx, w, h, 32, 0.035);
    const N = { z60: '0-60 MPH', s60130: '60-130 MPH' };
    // leaderboards
    ['z60', 's60130'].forEach((k, j) => {
      const x = 10, y = 8 + j * 132; ZD.panel(ctx, x, y, 210, 126, `${N[k]} · TOP 5`);
      const list = X.cfg.runs[k];
      if (!list.length) T(ctx, 'No runs yet', x + 12, y + 44, 13, COL.MUTE);
      list.forEach((r, i) => { T(ctx, `${i + 1}.`, x + 12, y + 38 + i * 18, 13, COL.MUTE, 'left', 'num', 700); T(ctx, `${r.time.toFixed(2)} s`, x + 40, y + 38 + i * 18, 14, i === 0 ? '#fff' : COL.TXT, 'left', 'num', 700, i === 0 ? 8 : 0); T(ctx, new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric' }), x + 198, y + 38 + i * 18, 11, COL.MUTE, 'right'); });
    });
    // Rotrex fluid
    const left = X.rotrexLeft(), iv = X.cfg.maint.rotrexIntervalMi;
    ZD.panel(ctx, 10, 272, 210, h - 280, 'ROTREX SX150 FLUID');
    T(ctx, left > 0 ? `${Math.round(left).toLocaleString()} mi` : 'DUE NOW', 22, 312, 22, left < 300 ? COL.RED : '#fff', 'left', 'num', 700, left < 300 ? 10 : 0);
    T(ctx, `until change (every ${iv.toLocaleString()} mi)`, 22, 330, 11, COL.MUTE);
    ctx.fillStyle = '#1c0a0d'; ctx.fillRect(22, 340, 186, 5); ctx.fillStyle = left < 300 ? COL.RED : '#b0202f'; ctx.fillRect(22, 340, 186 * ZD.clamp(1 - left / iv, 0, 1), 5);
    // ghost chart
    const gx = 230, gw = 380, gy = 8, gh = h - 16;
    ZD.panel(ctx, gx, gy, gw, gh, 'GHOST RUN · 0-60');
    const px = (t) => gx + 36 + (t / 7) * (gw - 50), py = (v) => gy + gh - 24 - (v / 70) * (gh - 56);
    ctx.strokeStyle = 'rgba(255,42,61,.12)'; for (let v = 0; v <= 60; v += 20) { ctx.beginPath(); ctx.moveTo(px(0), py(v)); ctx.lineTo(px(7), py(v)); ctx.stroke(); T(ctx, String(v), px(0) - 6, py(v) + 4, 10, COL.MUTE, 'right'); }
    for (let t = 0; t <= 7; t++) T(ctx, `${t}s`, px(t), gy + gh - 8, 10, COL.MUTE, 'center');
    const line = (tr, col, dash, glow) => { if (!tr) return; ctx.setLineDash(dash); ctx.beginPath(); tr.forEach(([t, v], i) => (i ? ctx.lineTo(px(t), py(Math.min(v, 70))) : ctx.moveTo(px(t), py(v)))); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = glow; ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0; };
    const ghost = X.cfg.ghost.z60, last = X.lastRun && X.lastRun.kind === 'z60' ? X.lastRun : null;
    line(ghost && ghost.trace, 'rgba(200,190,192,.7)', [5, 5], 0);
    line(last && last.trace, '#ff2a3d', [], 10);
    T(ctx, ghost ? `GHOST (BEST) ${ghost.time.toFixed(2)} s` : 'NO GHOST YET', gx + 44, gy + 34, 12, 'rgba(220,210,212,.85)', 'left', 'txt', 700);
    T(ctx, last ? `LAST RUN ${last.time.toFixed(2)} s` : 'Do a 0-60 from a stop to race your ghost', gx + 44, gy + 52, 12, last ? COL.RED : COL.MUTE, 'left', 'txt', 700);
    // achievements
    const ax = 620, aw = w - ax - 10;
    const un = X.cfg.ach.unlocked, cnt = Object.keys(un).length;
    ZD.panel(ctx, ax, 8, aw, h - 62, `ACHIEVEMENTS ${cnt}/${ZD.ACHIEVEMENTS.length}`);
    ZD.ACHIEVEMENTS.forEach(([id, title], i) => {
      const col = i % 2, row = Math.floor(i / 2), bx = ax + 10 + col * ((aw - 20) / 2), by = 30 + row * 46, got = !!un[id];
      ctx.strokeStyle = got ? '#ff2a3d' : '#2a1518'; ctx.fillStyle = got ? 'rgba(255,42,61,.15)' : 'rgba(0,0,0,.3)';
      ctx.beginPath(); ctx.moveTo(bx + 14, by); ctx.lineTo(bx + 26, by + 7); ctx.lineTo(bx + 26, by + 21); ctx.lineTo(bx + 14, by + 28); ctx.lineTo(bx + 2, by + 21); ctx.lineTo(bx + 2, by + 7); ctx.closePath(); ctx.fill(); ctx.stroke();
      T(ctx, got ? '★' : '·', bx + 14, by + 19, 12, got ? '#fff' : '#3a2a2d', 'center');
      T(ctx, title, bx + 32, by + 12, 11, got ? '#fff' : '#5a4a4d', 'left', 'txt', 700);
      T(ctx, got ? 'UNLOCKED' : 'LOCKED', bx + 32, by + 25, 9, got ? COL.RED : '#3a2a2d', 'left', 'txt', 600);
    });
  }

  // ---------------- power-off summary ----------------
  function showPowerOff() { if (!$('#poweroff').classList.contains('hidden')) return; S.log.stop({ miles: +S.trip.dist.toFixed(1), score: S.scorer.total, mode: S.mode }); $('#poweroff').classList.remove('hidden'); if (S.ex) S.ex.idleEndDrive(); S.offT = performance.now(); S.offTips = coachTips(); recordTrip(); }
  function drawPowerOff(now) {
    const { ctx, w, h } = ZD.fit($('#cv-off')), tr = S.trip, sc = S.scorer, a = Math.min(1, (now - S.offT) / 600);
    ctx.globalAlpha = a;
    T(ctx, 'VEHICLE POWERED OFF', w / 2, 46, 26, '#fff', 'center', 'num', 800, 16);
    T(ctx, `${C.name.toUpperCase()} · ${C.edition.toUpperCase()} · ${C.induction.toUpperCase()}`, w / 2, 66, 11, COL.MUTE, 'center', 'txt', 700);
    if (ZD.Xray && ZD.Xray.ready) ZD.Xray.render(ctx, w / 2 - 300, 74, 600, 166, { xray: false, yaw: 1.2 + (now - S.offT) / 9000, pitch: 0.14, dist: 6.4, drl: 0.15 });
    else ZD.drawSideCar(ctx, w / 2 - 190, 226, 380, 0);
    ctx.strokeStyle = 'rgba(255,42,61,.35)'; ctx.beginPath(); ctx.moveTo(w / 2 - 260, 227); ctx.lineTo(w / 2 + 260, 227); ctx.stroke();
    const stats = [['TRIP TIME', tr.t0 !== null ? tfmt(tr.tLast - tr.t0) : '--'], ['DISTANCE', `${tr.dist.toFixed(1)} mi`], ['MAX SPEED', `${Math.round(tr.maxSpeed)} mph`], ['SHIFTS', String(sc.shifts.length)], ['BEST COMBO', `×${sc.bestCombo}`], ['SCORE', sc.total.toLocaleString()]];
    const cw = (w - 40) / stats.length;
    stats.forEach(([l, v], i) => { const x = 20 + cw * i + cw / 2; T(ctx, l, x, 270, 11, COL.MUTE, 'center', 'txt', 700); T(ctx, v, x, 298, 22, i === 5 ? '#ff2a3d' : COL.TXT, 'center', 'num', 700, i === 5 ? 10 : 0); });
    T(ctx, `COACH · ${S.mode.toUpperCase()}`, 40, 326, 11, COL.RED, 'left', 'txt', 700);
    let ty = 342; for (const tip of (S.offTips || []).slice(0, 2)) ty = ZD.wrap(ctx, '▸ ' + tip, 40, ty, w - 80, 15, 12, COL.TXT) + 2;
    ctx.globalAlpha = 1;
  }
  $('#poweroff').addEventListener('click', () => { $('#poweroff').classList.add('hidden'); if (S.src && S.src.status === 'live' && S.src.label !== 'CSV') S.log.start(S.src.label + (S.demo ? ' (demo)' : '')); S.trip = newTrip(); S.scorer.reset(); S.lastShift = null; S.stillSince = null; });
  $('#btnPowerOff').addEventListener('click', showPowerOff);

  // ---------------- UI wiring ----------------
  function setScreen(name) {
    S.screen = name;
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.scr === name));
    document.querySelectorAll('.scr').forEach((s) => s.classList.toggle('on', s.id === 'scr-' + name));
  }
  document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => setScreen(b.dataset.scr)));
  document.querySelectorAll('#partChips button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.part; S.partsOn[k] = !S.partsOn[k]; b.classList.toggle('on', S.partsOn[k]); }));
  $('#btnDyno').addEventListener('click', () => {
    if (S.src && S.src.requestDynoPull) { S.src.requestDynoPull(); $('#btnDyno').disabled = true; setTimeout(() => ($('#btnDyno').disabled = false), 25000); }
    else $('#srcMsg').textContent = 'Live mode: the dyno records automatically on any full-throttle pull in 3rd or 4th.';
  });
  // drag to rotate the car
  const cv = $('#cv-car'); let drag = null;
  cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; S.dragging = true; S.yawVel = 0; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => {
    if (!drag) return; const now = performance.now(), dx = e.clientX - drag.x, dy = e.clientY - drag.y, dts = Math.max(0.008, (now - drag.t) / 1000);
    S.yaw -= dx * 0.008; S.pitch = ZD.clamp(S.pitch + dy * 0.004, 0.04, 0.85); S.yawVel = ZD.lerp(S.yawVel, (-dx * 0.008) / dts, 0.5);
    drag = { x: e.clientX, y: e.clientY, t: now }; S.lastDrag = now;
  });
  const endDrag = () => { drag = null; S.dragging = false; S.lastDrag = performance.now(); };
  cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
  // ---------------- drive-screen layout editor ----------------
  function renderLayoutEd() {
    const L = ZD.layout.get(), which = ZD.layout.which();
    $('#layoutToggles').innerHTML = ZD.layout.PANELS.map(([k, name]) => `<div class="ltog${L[k] ? ' on' : ''}" data-k="${k}"><span>${name}${k === 'tpms' ? '<span class="note">needs TPMS data</span>' : ''}</span><span class="sw"></span></div>`).join('');
    document.querySelectorAll('#layoutEd [data-preset]').forEach((b) => b.classList.toggle('on', b.dataset.preset === which));
    $('#layoutWhich').textContent = which === 'CUSTOM' ? '· CUSTOM' : '';
    document.querySelectorAll('#layoutToggles .ltog').forEach((el) => el.addEventListener('click', () => { ZD.layout.set(el.dataset.k, !ZD.layout.get()[el.dataset.k]); renderLayoutEd(); }));
  }
  function applyLayout() { const L = ZD.layout.get(); $('#modeBtn').style.display = L.mode ? '' : 'none'; if (!L.popup) $('#popup').classList.remove('show'); }
  ZD.layout.onchange = applyLayout; applyLayout();
  const openLayout = () => { renderLayoutEd(); $('#layoutEd').classList.remove('hidden'); };
  $('#btnLayout').addEventListener('click', openLayout);
  document.querySelectorAll('#layoutEd [data-preset]').forEach((b) => b.addEventListener('click', () => { ZD.layout.preset(b.dataset.preset); renderLayoutEd(); }));
  $('#layoutDone').addEventListener('click', () => $('#layoutEd').classList.add('hidden'));
  { // long-press (600 ms) anywhere on the drive screen opens the editor
    const cvd = $('#cv-drive'); let lp = null, p0 = null;
    cvd.addEventListener('pointerdown', (e) => { p0 = [e.clientX, e.clientY]; lp = setTimeout(openLayout, 600); });
    cvd.addEventListener('pointermove', (e) => { if (lp && p0 && Math.hypot(e.clientX - p0[0], e.clientY - p0[1]) > 12) { clearTimeout(lp); lp = null; } });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => cvd.addEventListener(ev, () => { clearTimeout(lp); lp = null; }));
  }
  if (params.has('layout')) { const v = params.get('layout').toUpperCase(); if (ZD.layout.PRESETS[v]) { ZD.layout.get(); Object.assign(ZD.layout.get(), ZD.layout.PRESETS[v]); applyLayout(); } }
  if (params.has('layouted')) setTimeout(openLayout, 50);

  // settings
  // adapter picker (settings + start screen share one saved choice)
  function fillAdapters() {
    const cur = ZD.adapterId();
    ['#adapterSel', '#adapterSel2'].forEach((sel) => { const el = $(sel); if (!el) return;
      el.innerHTML = Object.entries(ZD.ADAPTERS).map(([id, a]) => `<option value="${id}"${id === cur ? ' selected' : ''}>${a.name}</option>`).join('');
      el.onchange = () => { try { localStorage.setItem('zdash.adapter', el.value); } catch (e) {} fillAdapters(); }; });
    const a = ZD.ADAPTERS[cur]; $('#adapterNote').textContent = a.locked ? a.note : `${a.name}: connects via ${a.transports.map((t) => ({ serial: 'Chrome (Web Serial, Android 138+)', ble: 'Chrome (Web Bluetooth)', native: 'the Android app', 'native-tcp': 'the Android app (Wi-Fi)' })[t]).join(' or ')}. Close other OBD apps first: one app at a time.`;
  }
  fillAdapters();
  function connectLive() {
    S.demo = false; markSrc('obd');
    let src; try { src = ZD.makeLiveSource(); } catch (e) { $('#srcMsg').textContent = $('#startMsg').textContent = e.message + (e.locked ? '' : '.'); return; }
    $('#startMsg').textContent = ''; useSource(src);
  }
  // Settings sheet controller (driver + passenger). It opens BELOW the visible top bar, so: any top tab closes it and switches,
  // the gear toggles it, Android back closes it (history entry), ✕ / tap-outside / Esc close it and you're back on the tab you were on.
  const SET = ZD.Settings = { el: $('#settings'), isOpen() { return !this.el.classList.contains('hidden'); },
    bar() { const k = document.querySelector('#kid:not(.hidden) .khdr'); return k || $('#hdr'); },
    open() { if (this.isOpen()) return; const b = this.bar(), top = b ? Math.max(0, Math.round(b.getBoundingClientRect().bottom)) : 0; this.el.style.top = top + 'px'; this.el.classList.remove('hidden'); document.body.classList.add('setopen'); renderLogs();
      try { history.pushState({ zdSet: 1 }, ''); this.pushed = true; } catch (e) { this.pushed = false; } },
    close(fromPop) { if (!this.isOpen()) return; this.el.classList.add('hidden'); document.body.classList.remove('setopen'); if (this.pushed && !fromPop) { this.pushed = false; try { if (history.state && history.state.zdSet) history.back(); } catch (e) {} } this.pushed = false; },
    toggle() { this.isOpen() ? this.close() : this.open(); } };
  window.addEventListener('popstate', () => { if (SET.isOpen()) SET.close(true); });
  document.addEventListener('click', (e) => { if (SET.isOpen() && e.target.closest && e.target.closest('#tabs button, #kTabs button')) SET.close(); }, true); // a top tab closes settings, the tab still switches
  window.addEventListener('resize', () => { if (SET.isOpen()) { const b = SET.bar(); if (b) SET.el.style.top = Math.round(b.getBoundingClientRect().bottom) + 'px'; } });
  $('#btnSettings').addEventListener('click', () => SET.toggle());
  async function renderLogs() {
    const list = await S.log.list(), el = $('#logList');
    el.innerHTML = list.length ? list.map((d) => `<div class="logrow"><span>${new Date(d.started).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} · ${d.source} · ${d.rows.toLocaleString()} rows · ${d.shifts} shifts${S.log.cur && S.log.cur.id === d.id ? ' · <b style="color:#ff2a3d">RECORDING</b>' : ''}</span><button data-exp="${d.id}">EXPORT / SHARE</button><button data-rep="${d.id}">REPLAY</button></div>`).join('') : '<div class="empty">No drives saved yet. Logging starts automatically when a source connects.</div>';
    el.querySelectorAll('[data-exp]').forEach((b) => b.addEventListener('click', async () => { const r = await S.log.exportDrive(b.dataset.exp); toast(r === 'shared' ? 'LOG SHARED' : 'LOG SAVED TO DOWNLOADS'); }));
    el.querySelectorAll('[data-rep]').forEach((b) => b.addEventListener('click', async () => { const text = await S.log.csv(b.dataset.rep); S.demo = false; const src = new ZD.CsvReplaySource(text, 'saved drive'); S.trip = newTrip(); S.scorer.reset(); ZD.Settings.close(); useSource(src); }));
  }
  $('#btnClose').addEventListener('click', () => SET.close());
  { // Settings close: a pinned ✕ that's always on screen (the CLOSE button sits at the very bottom of a long panel on short phones), tap outside the panel or press Esc
    const st = $('#settings'), pn = st.querySelector('.panel'), x = document.createElement('button'); x.id = 'btnCloseX'; x.className = 'closex'; x.type = 'button'; x.setAttribute('aria-label', 'Close settings'); x.textContent = '✕'; pn.prepend(x);
    const close = () => SET.close(); x.addEventListener('click', close);
    st.addEventListener('pointerdown', (e) => { if (e.target === st) close(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !st.classList.contains('hidden')) close(); }); }
  $('#btnSplash').addEventListener('click', () => { SET.close(); showSplash(); setTimeout(splashLinked, 900); });
  $('#btnSpeed').addEventListener('click', () => { S.speedup = S.speedup >= 4 ? 1 : S.speedup * 2; if (S.src) S.src.speedup = S.speedup; $('#btnSpeed').textContent = `REPLAY SPEED ${S.speedup}×`; });
  const markSrc = (k) => document.querySelectorAll('[data-src]').forEach((b) => b.classList.toggle('on', b.dataset.src === k));
  document.querySelector('[data-src="sim"]').addEventListener('click', () => { markSrc('sim'); $('#srcMsg').textContent = 'Running the demo drive (simulated data).'; startDemo(); });
  document.querySelector('[data-src="obd"]').addEventListener('click', () => { markSrc('obd'); S.demo = false; $('#srcMsg').textContent = 'Looking for your adapter…'; connectLive(); });
  const onCsv = async (e) => {
    const file = e.target.files[0]; if (!file) return; markSrc('');
    const text = await file.text();
    try { const src = new ZD.CsvReplaySource(text, file.name); src.speedup = S.speedup; S.trip = newTrip(); S.scorer.reset(); await useSource(src); $('#srcMsg').textContent = `Replaying ${file.name} · columns: ${Object.entries(src.mapped || {}).map(([k, v]) => k + '=' + v).join(', ')}`; }
    catch (err) { $('#srcMsg').textContent = 'CSV problem: ' + err.message; ZD.Settings.open(); }
  };
  $('#csvFile').addEventListener('change', onCsv);
  $('#csvFile2').addEventListener('change', (e) => { S.demo = false; onCsv(e); });
  $('#btnObd2').addEventListener('click', connectLive);
  $('#btnLogs2').addEventListener('click', () => { hideSplash(); SET.open(); setTimeout(() => { const h = $('#btnExportRun'); h && h.closest('.row').previousElementSibling.scrollIntoView({ block: 'start' }); }, 60); }); // into the app with no adapter: drive logs, EXPORT RUN, replay
  $('#btnDemo').addEventListener('click', () => { phoneFullscreen(); startDemo(); });
  // small "tap for fullscreen" button in the header whenever fullscreen isn't active (and the browser supports it)
  function syncFsBtn() { const can = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen), fs = !!(document.fullscreenElement || document.webkitFullscreenElement) || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches; $('#btnFs').classList.toggle('hidden', !can || fs); }
  $('#btnFs').addEventListener('click', () => { try { if (matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) return; const el = document.documentElement, p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : el.webkitRequestFullscreen && el.webkitRequestFullscreen(); if (p && p.then) p.then(() => { try { screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {}); } catch (e) {} }).catch(() => {}); } catch (e) {} });
  document.addEventListener('fullscreenchange', syncFsBtn); document.addEventListener('webkitfullscreenchange', syncFsBtn); syncFsBtn();
  // phones: go fullscreen + lock landscape on the START DEMO tap (needs a user gesture; silently ignored where unsupported)
  /* Installed app (display-mode standalone or fullscreen) is already full screen.
     The Fullscreen API ends on every HTML navigation, so requesting it on a tap
     that also leaves the page flashes browser chrome. A browser tab still asks
     for fullscreen on the first tap. */
  const FS = { want: true };
  const fsMode = () => matchMedia('(pointer: coarse)').matches || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches;
  addEventListener('pointerdown', () => { if (!FS.want || document.fullscreenElement || document.webkitFullscreenElement || !fsMode()) return; if (matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) { FS.want = false; return; } FS.want = false; try { const el = document.documentElement, p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : null; if (p) p.catch(() => { FS.want = true; }); } catch (e) {} }, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') FS.want = true; });
  function phoneFullscreen() { try { if (matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) return; if (!matchMedia('(pointer: coarse)').matches || document.fullscreenElement) return; const el = document.documentElement; const p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : null; if (p) p.then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {})).catch(() => {}); } catch (e) {} }
  // performance toggles
  function renderPerf() { $('#tglLow').textContent = `LOW DETAIL: ${ZD.perf.low ? 'ON' : 'OFF'}`; $('#tglLow').classList.toggle('on', ZD.perf.low); $('#tglFps').textContent = `FPS COUNTER: ${ZD.perf.fps ? 'ON' : 'OFF'}`; $('#tglFps').classList.toggle('on', ZD.perf.fps); $('#fps').classList.toggle('hidden', !ZD.perf.fps); }
  $('#tglLow').addEventListener('click', () => { ZD.perf.set('low', !ZD.perf.low); renderPerf(); });
  $('#tglFps').addEventListener('click', () => { ZD.perf.set('fps', !ZD.perf.fps); renderPerf(); });
  /* beta: Dad's Stillen front bumper on the driver car (default OFF; OFF leaves the model untouched) */
  const stBeta = /[?&]stillenbeta/.test(location.search); if (stBeta) document.body.classList.add('stbeta'); /* driver Stillen preview only with ?stillenbeta until Bob approves it */
  ZD.drvStillen = stBeta && (() => { try { return localStorage.getItem('zdash.drvStillen') === '1'; } catch (e) { return false; } })();
  const renderStillen = () => { const b = $('#tglStillen'); if (b) { b.textContent = `STILLEN BUMPER (BETA): ${ZD.drvStillen ? 'ON' : 'OFF'}`; b.classList.toggle('on', ZD.drvStillen); } };
  if ($('#tglStillen')) { $('#tglStillen').addEventListener('click', () => { ZD.drvStillen = !ZD.drvStillen; try { localStorage.setItem('zdash.drvStillen', ZD.drvStillen ? '1' : '0'); } catch (e) {} renderStillen(); if (ZD.Xray && ZD.Xray.drvStillen && ZD.Xray.ready) ZD.Xray.drvStillen(); }); renderStillen(); }
  renderPerf();

  // ---------------- main loop ----------------
  let lastT = performance.now();
  const FPS = { n: 0, t0: performance.now(), el: $('#fps') };
  let dadRaf = 0;
  function loop(now) {
    if (window.ZD_PARKED) { dadRaf = 0; return; }
    const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
    if (ZD.perf.fps) { FPS.n++; if (now - FPS.t0 >= 500) { const fps = (FPS.n * 1000) / (now - FPS.t0); FPS.el.textContent = `${fps.toFixed(0)} FPS${ZD.perf.low ? ' · LOW' : ''} · ${Math.round(ZD.perf.dpr(3) * 100) / 100}×`; FPS.el.classList.toggle('slow', fps < 40); FPS.n = 0; FPS.t0 = now; } }
    if (S.src && S.src.label === 'OBD' && S.frameAt && now - S.frameAt > 5000 && S.trip.maxRpm >= 400 && $('#poweroff').classList.contains('hidden')) showPowerOff(); // no OBD data for 5 s after a real drive: end it once (newTrip after the tap can't end again)
    { const on = !!(S.seen && ["lam1", "lam2", "stft1", "ltft1", "stft2", "ltft2", "cat1", "cat2", "pedalD", "pedalE", "relThr", "cmdThr", "thrB", "maf", "baro", "absLoad", "cmdLam", "purge", "evapVp", "runTime", "distClr", "timeClr", "warmups", "distMil", "timeMil", "fuelType", "o2s"].some((k) => S.seen.has(k))), te = $('#tabEngine'); if (te.style.display !== (on ? '' : 'none')) te.style.display = on ? '' : 'none'; } if (S.screen === 'codes' && now - (S.ecuT || 0) > 500) { S.ecuT = now; renderEcuInfo(); } // ENGINE tab only with OBD+ data
    if (document.body.classList.contains('kidon')) { dadRaf = 0; return; } // Passenger Mode draws on its own loop. Dad's loop stays stopped so it does not run under the menu.
    if (SP.on) drawSplash(now);
    if (!$('#poweroff').classList.contains('hidden')) drawPowerOff(now);
    const edge = $('#edge'); const eOn = !!S.edgeOn && S.screen === 'drive'; edge.classList.toggle('on', eOn); edge.classList.toggle('cruise', S.edgeMode === 'cruise');
    const fn = { runs: drawRuns, handling: drawHandling, drive: drawDrive, gauges: drawGauges, engine: drawEngine, car: () => drawCar(dt), dyno: drawDyno, trip: drawTrip }[S.screen]; if (fn) fn();
    dadRaf = requestAnimationFrame(loop);
  }
  function stopDad() { cancelAnimationFrame(dadRaf); dadRaf = 0; }
  function startDad() { if (!dadRaf && !window.ZD_PARKED && !document.body.classList.contains('kidon')) dadRaf = requestAnimationFrame(loop); }
  window.ZD_DASH = window.ZD_DASH || {};
  ZD_DASH.stopDad = stopDad;
  ZD_DASH.startDad = startDad;

  // boot. Start screen waits for START DEMO / CSV / live adapter.
  // URL options for demos/screenshots: ?demo (auto-start) &nosplash &screen=dyno &warm=300 &autodyno &speed=2 &poweroff
  async function startDemo() {
    S.demo = true; S.demoDyno = false; S.demoRace = false; S.trip = newTrip(); S.scorer.reset(); S.lastShift = null; S.dyno.runs = []; S.lastDyno = S.bestDyno = null;
    const sim = new ZD.SimSource(); sim.speedup = S.speedup;
    await useSource(sim);
    setMode(params.get('mode') || 'cruise');
    if (params.has('autodyno')) { sim.requestDynoPull(); S.demoDyno = true; }
    if (params.has('warm')) {
      S.warming = true; const total = +params.get('warm') || 120;
      for (let t = 0; t < total; t += 8) { sim.fastForward(Math.min(8, total - t)); await S.codes.poll(sim); }
      S.warming = false; $('#alert').classList.add('hidden'); onCodes({});
    }
    if (params.has('poweroff')) showPowerOff();
    S.ready = true;
  }
  if (params.has('speed')) S.speedup = +params.get('speed') || 1;
  if (params.has('yaw')) { S.yaw = +params.get('yaw'); S.autoRot = false; }
  if (params.has('screen')) setScreen(params.get('screen'));
  if (params.has('demo') || params.has('nosplash') || params.has('warm')) startDemo();
  if (params.has('nosplash')) hideSplash();
  try { const m = localStorage.getItem('zdash.mode'); if (m && !params.has('demo')) setMode(m); } catch (e) {}
  startDad();
  window.ZDAPP = S; // for debugging in the console
})();

