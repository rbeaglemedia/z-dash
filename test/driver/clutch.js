
/* Z-DASH — clutch-in detection for every data source (feeds SHIFT WITH DAD's GET READY → SHIFT cue and tap scoring).
   1) Clutch switch: if the source gives f.clutch as a boolean (sim, a log with a "Clutch Switch" column), that wins.
      For a live OBD adapter, probe() runs once at first connect. A Nissan clutch-switch channel over Mode 22 or a CAN
      broadcast is NOT confirmed for the 370Z, so the status stays 'unknown' until a candidate is verified on Bob's car
      (candidates go in ZD.CLUTCH_CANDIDATES; none are shipped because none are verified).
   2) Fallback inference: clutch-in when engine rpm stops matching wheel speed × gear ratio (no gear fits), or at a
      sharp rpm drop / flare with the throttle lifted. Clutch-out when rpm locks to a gear again.
   Adds f.clutchIn (boolean), f.clutchSrc ('switch' | 'inferred'), f.gearCalc (1-6 or null). Bob's shift scorer is untouched. */
(function () {
  const ZD = (window.ZD = window.ZD || {});
  const KEY = 'zdash.clutchSig';
  const car = () => ZD.CAR || { gears: [3.794, 2.324, 1.624, 1.271, 1.0, 0.794], finalDrive: 3.692, rearTire: { width: 295, aspect: 35, rim: 19 }, idle: 750 };
  function tireCirc() { const t = car().rearTire; return Math.PI * (t.rim * 0.0254 + 2 * t.width * t.aspect / 100 / 1000); } // ≈2.165 m on 295/35R19
  const C = (ZD.Clutch = {
    status() { try { return JSON.parse(localStorage.getItem(KEY)) || { sig: 'unknown' }; } catch (e) { return { sig: 'unknown' }; } },
    setStatus(s) { try { localStorage.setItem(KEY, JSON.stringify(Object.assign({ at: new Date().toISOString() }, s))); } catch (e) {} },
    expectedRpm(mph, g) { const c = car(); return (mph * 0.44704 / tireCirc()) * 60 * c.gears[g - 1] * c.finalDrive; },
    // best-fitting gear and its error for one frame
    fit(rpm, mph) { let best = null, err = 9; for (let g = 1; g <= car().gears.length; g++) { const e = Math.abs(rpm / C.expectedRpm(mph, g) - 1); if (e < err) { err = e; best = g; } } return { g: best, err }; },
    attach(f, src) {
      if (!f) return f;
      if (typeof f.clutch === 'boolean') { f.clutchIn = f.clutch; f.clutchSrc = 'switch'; }
      const st = src._ci || (src._ci = { inn: false, mis: 0, lock: 0, prevRpm: null, prevT: null, gear: null, why: '' });
      const rpm = f.rpm, mph = f.speed, t = f.t != null ? f.t : performance.now() / 1000;
      if (rpm == null || mph == null) { if (f.clutchSrc !== 'switch') { f.clutchIn = false; f.clutchSrc = 'inferred'; } return f; }
      const dt = st.prevT != null ? clampDt(t - st.prevT) : 0, rate = dt > 0 && st.prevRpm != null ? (rpm - st.prevRpm) / dt : 0;
      const thr = f.throttle == null ? 50 : f.throttle;
      if (mph < 6) { st.inn = false; st.mis = 0; st.gear = null; }
      else {
        const { g, err } = C.fit(rpm, mph), locked = err < 0.06;
        if (locked) { st.mis = 0; st.lock += dt; if (!st.inn || st.lock > 0.15) { st.inn = false; st.gear = g; } }
        else { st.lock = 0; st.mis += dt; if (!st.inn && st.mis >= 0.08) { st.inn = true; st.why = 'ratio'; } }
        if (!st.inn && dt > 0 && ((rate < -2500 && thr < 30) || (rate > 3000 && err > 0.04))) { st.inn = true; st.why = rate < 0 ? 'rpm-drop' : 'rpm-flare'; st.lock = 0; }
      }
      st.prevRpm = rpm; st.prevT = t;
      f.gearCalc = st.gear;
      if (f.clutchSrc !== 'switch') { f.clutchIn = st.inn; f.clutchSrc = 'inferred'; f.clutchWhy = st.inn ? st.why : ''; }
      return f;
    },
    // First live connect: look for a clutch-switch channel. Each candidate {name, cmd, bit(resp)->bool|null} is tried once;
    // a reply only makes it a CANDIDATE. It is promoted to 'switch' only after it toggles in step with inferred clutch-ins
    // during a drive (verify()). With no verified candidates the status is recorded as 'unknown' and inference is used.
    async probe(elm) {
      const prev = C.status(); if (prev.sig === 'switch') return prev;
      const found = [];
      for (const cand of ZD.CLUTCH_CANDIDATES || []) { try { const r = await elm.cmd(cand.cmd, 800); if (r && !/NO DATA|\?|ERROR|7F/.test(r)) found.push(cand.name); } catch (e) {} }
      const s = { sig: 'unknown', how: found.length ? 'candidates answered, not verified: ' + found.join(', ') : 'no verified Mode 22 / CAN clutch channel for the 370Z; using rpm/speed inference', candidates: found };
      C.setStatus(s); return s;
    },
    verify(name, agreeRate) { if (agreeRate > 0.9) C.setStatus({ sig: 'switch', how: name + ' (verified on a drive)' }); },
  });
  function clampDt(d) { return d > 0 && d < 1 ? d : 0; }
})();

