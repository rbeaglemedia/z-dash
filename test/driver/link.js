
/* Z-DASH — PHONE → IPAD LINK (prototype). Bob's phone (connected to the car) shares a compact ~10 Hz state with her
   iPad over a WebRTC data channel. No server: pairing is two QR codes (phone shows an OFFER, iPad scans it and shows
   an ANSWER, phone scans that). ICE uses host candidates only (iceServers: []), so on the phone's hotspot it needs
   no internet. Camera access is held during pairing: it is needed to scan, and browsers only expose real local IPs
   (instead of mDNS names) to pages with camera/mic permission. */
(function () {
  const ZD = (window.ZD = window.ZD || {}), $ = (s) => document.querySelector(s), Q = new URLSearchParams(location.search);
  const L = (ZD.Link = { role: null, pc: null, ch: null, state: 'idle', F: {}, remote: { real: false, label: '' }, lastMsg: 0, cbs: [], shiftCbs: [], stream: null, sent: 0, got: 0 });
  L.on = (cb) => L.cbs.push(cb); L.onShift = (cb) => L.shiftCbs.push(cb);
  const emit = () => { for (const cb of L.cbs) try { cb(L); } catch (e) {} };
  L.linked = () => L.state === 'linked' && performance.now() - L.lastMsg < 2500;

  // ---------- compact codes: deflate-raw + base64url ("Z1."), or plain base64url ("Z0.") ----------
  const b64u = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = (s) => { const b = atob(s.replace(/-/g, '+').replace(/_/g, '/')); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  async function pipe(u8, T) { const s = new Blob([u8]).stream().pipeThrough(new T('deflate-raw')); return new Uint8Array(await new Response(s).arrayBuffer()); }
  // drop SDP lines a data channel doesn't need, to keep the QR small
  const slim = (sdp) => sdp.split('\r\n').filter((l) => l && !/^a=(extmap|rtcp-fb|ssrc|msid|ice-options:trickle$)/.test(l)).join('\r\n') + '\r\n';
  L.encode = async function (desc) { const raw = new TextEncoder().encode(JSON.stringify({ t: desc.type, s: slim(desc.sdp) })); if (window.CompressionStream) return 'Z1.' + b64u(await pipe(raw, CompressionStream)); return 'Z0.' + b64u(raw); };
  L.decode = async function (code) { code = String(code || '').trim(); const [v, d] = [code.slice(0, 3), code.slice(3)]; let u = unb64u(d); if (v === 'Z1.') u = await pipe(u, DecompressionStream); else if (v !== 'Z0.') throw new Error('Not a Z-DASH code'); const j = JSON.parse(new TextDecoder().decode(u)); return { type: j.t, sdp: j.s }; };
  const waitIce = (pc, ms = 3500) => new Promise((res) => { if (pc.iceGatheringState === 'complete') return res(); const t = setTimeout(res, ms); pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); res(); } }); });

  function newPC() {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.addEventListener('connectionstatechange', () => { if (pc !== L.pc) return; const cs = pc.connectionState;
      if (cs === 'disconnected' && (L.state === 'linked' || L.state === 'reconnecting')) reconnecting('disconnected');
      else if (cs === 'connected' && L.state === 'reconnecting' && L.ch && L.ch.readyState === 'open') back();
      else if (['failed', 'closed'].includes(cs) && L.state !== 'idle') lost(cs); });
    pc.addEventListener('iceconnectionstatechange', () => { if (pc === L.pc && pc.iceConnectionState === 'disconnected' && L.role === 'host' && L.ch && L.ch.readyState === 'open' && pc.restartIce) { try { pc.restartIce(); } catch (e) {} } });
    return pc;
  }
  const GRACE = +(Q.get('linkgrace') || 12000);
  function lost(why) { if (L.state === 'lost' || L.state === 'idle') return; clearTimeout(L.graceT); L.state = 'lost'; L.why = why; L.drops = (L.drops || 0) + 1; if (window.ZD_JR && L.watch) L.watch(false); emit(); }
  function reconnecting(why) { if (L.state !== 'linked') return; L.state = 'reconnecting'; L.why = why; L.recT = performance.now(); emit(); clearTimeout(L.graceT); L.graceT = setTimeout(() => { if (L.state === 'reconnecting') lost(why + ' (gave up)'); }, GRACE); }
  function back() { if (L.state !== 'reconnecting') return; clearTimeout(L.graceT); L.state = 'linked'; L.recovered = (L.recovered || 0) + 1; emit(); }
  // pair code: the same 4 digits on both screens, from both DTLS fingerprints, so Bob can see the right iPad joined
  function pairCode() { const fp = (d) => ((d && d.sdp && d.sdp.match(/a=fingerprint:\S+ ([0-9A-F:]+)/i)) || [])[1] || ''; const pc = L.pc; if (!pc) return '';
    const k = [fp(pc.localDescription), fp(pc.remoteDescription)].sort().join('|'); if (k === '|') return ''; let h = 2166136261; for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); } return String((h >>> 0) % 10000).padStart(4, '0'); }
  L.pairCode = pairCode;
  function bind(ch) {
    L.ch = ch;
    ch.onopen = () => { L.state = 'linked'; L.lastMsg = performance.now(); L.code = pairCode(); stopCam(); try { localStorage.setItem('zdash.link.last', JSON.stringify({ at: Date.now(), role: L.role, code: L.code })); } catch (e) {} emit(); if (ZD.Roles) ZD.Roles.onLink(L); };
    ch.onclose = () => { if (ch === L.ch) lost('closed'); };
    ch.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch (x) { return; } L.lastMsg = performance.now(); L.got++; if (L.state === 'reconnecting') back();
      if (m.k === 's') { L.F = { speed: m.v, rpm: m.r, gear: m.g, throttle: m.th, brake: !!m.b, latG: m.la, lonG: m.lo, clutch: !!m.c, clutchIn: !!m.c, t: m.t }; L.remote = { real: !!m.real, label: m.lab || '', state: m.st }; }
      else if (m.k === 'sh') for (const cb of L.shiftCbs) try { cb({ rating: m.r, score: m.s, from: m.f, to: m.to }); } catch (x) {}
      else if (m.k === 'ev') L.lastEvent = { e: m.e, t: performance.now() };
      else if (m.k === 'ro') { if (ZD.Roles) ZD.Roles.merge(m.rec); }
      else if (m.k === 'pf') { if (ZD.Roles) ZD.Roles.peerProfile(m.p); }
    };
  }
  L.stop = function () { clearTimeout(L.graceT); const pc = L.pc, ch = L.ch; Object.assign(L, { role: null, pc: null, ch: null, state: 'idle' }); try { ch && ch.close(); } catch (e) {} try { pc && pc.close(); } catch (e) {} clearInterval(L.timer); if (L.watch) L.watch(false); stopCam(); emit(); };

  // ---------- Bob's phone (host) ----------
  L.share = async function () {
    L.stop(); L.role = 'host'; L.state = 'offering'; emit();
    await startCam().catch(() => {}); // permission first, so the offer carries real host IPs (see header)
    const pc = (L.pc = newPC()); bind(pc.createDataChannel('zdash', { ordered: true }));
    await pc.setLocalDescription(await pc.createOffer()); await waitIce(pc);
    L.offer = await L.encode(pc.localDescription); L.state = 'waiting'; emit();
    clearInterval(L.timer); L.timer = setInterval(sendState, 100); if (L.watch) L.watch(true); hookShifts(); return L.offer;
  };
  L.acceptAnswer = async function (code) { const d = await L.decode(code); if (d.type !== 'answer') throw new Error('That is not her answer code'); await L.pc.setRemoteDescription(d); L.state = 'connecting'; emit(); };
  let hooked = false, lastEv = 0;
  function hookShifts() { const A = window.ZDAPP; if (hooked || !A || !A.scorer) return; hooked = true; A.scorer.on((ev) => send({ k: 'sh', r: ev.rating, s: ev.score, f: ev.from, to: ev.to })); }
  L.send = (m) => send(m);
  function send(m) { if (L.ch && L.ch.readyState === 'open') { try { L.ch.send(JSON.stringify(m)); L.sent++; } catch (e) {} } }
  function sendState() {
    const A = window.ZDAPP; if (!A || !L.ch || L.ch.readyState !== 'open') return; const f = A.F || {}, src = A.src;
    const live = !!(src && src.status === 'live'), real = Q.get('linkfake') === '1' || (live && src.label !== 'SIM' && src.label !== 'CSV');
    const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10), r2 = (x) => (x == null ? null : Math.round(x * 100) / 100);
    send({ k: 's', t: Date.now(), v: r1(f.speed), r: f.rpm == null ? null : Math.round(f.rpm), g: f.gear, th: f.throttle == null ? null : Math.round(f.throttle), b: f.brake ? 1 : 0, c: (typeof f.clutchIn === 'boolean' ? f.clutchIn : f.clutch === true) ? 1 : 0, la: r2(f.latG), lo: r2(f.lonG), real, lab: src ? src.label : '', st: live ? 'live' : 'idle' });
    const now = performance.now(); // accel events: hard launch / hard braking
    if (now - lastEv > 1500 && (f.lonG || 0) > 0.45) { lastEv = now; send({ k: 'ev', e: 'launch' }); } else if (now - lastEv > 1500 && (f.lonG || 0) < -0.55) { lastEv = now; send({ k: 'ev', e: 'brake' }); }
  }

  // ---------- her iPad (guest) ----------
  L.join = async function (code) {
    const d = await L.decode(code); if (d.type !== 'offer') throw new Error("That is not Dad's code");
    { const oc = L.ch, op = L.pc; L.ch = null; L.pc = null; clearTimeout(L.graceT); try { oc && oc.close(); op && op.close(); } catch (e) {} }
    L.role = 'guest'; L.state = 'answering'; emit();
    const pc = (L.pc = newPC()); pc.ondatachannel = (e) => bind(e.channel);
    await pc.setRemoteDescription(d); await pc.setLocalDescription(await pc.createAnswer()); await waitIce(pc);
    L.answer = await L.encode(pc.localDescription); L.state = 'connecting'; if (L.watch) L.watch(true); emit(); return L.answer;
  };
  L.watch = function (on) {
    if (L._watch) { clearInterval(L._watch); L._watch = 0; }
    if (!on) return;
    L._watch = setInterval(() => { if (L.state === 'linked' && performance.now() - L.lastMsg > 3000) reconnecting('no data'); }, 500);
  };
  if (!window.ZD_JR) L.watch(true);

  // ---------- camera QR scanning (jsQR) ----------
  async function startCam() { if (L.stream) return L.stream; L.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false }); return L.stream; }
  function stopCam() { if (L.stream) { L.stream.getTracks().forEach((t) => t.stop()); L.stream = null; } clearInterval(L.scanT); const v = $('#lkVideo'); if (v) v.srcObject = null; }
  L.scan = async function (onCode) {
    const v = $('#lkVideo'); try { v.srcObject = await startCam(); await v.play(); } catch (e) { setMsg('Camera not available. Use COPY / PASTE instead.'); return; }
    $('#lkCam').classList.remove('hidden'); const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
    clearInterval(L.scanT); L.scanT = setInterval(() => { if (!v.videoWidth || !window.jsQR) return; const k = Math.min(1, 720 / v.videoWidth); cv.width = v.videoWidth * k; cv.height = v.videoHeight * k; cx.drawImage(v, 0, 0, cv.width, cv.height);
      const r = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height, { inversionAttempts: 'attemptBoth' }); if (r && /^Z[01]\./.test(r.data)) { clearInterval(L.scanT); $('#lkCam').classList.add('hidden'); onCode(r.data); } }, 180);
  };

  // ---------- pairing UI (one overlay, used by both sides) ----------
  function qrTo(el, text) {
    if (!window.qrcode) { el.innerHTML = ''; return; } const q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make(); const n = q.getModuleCount(), cell = Math.max(2, Math.floor(300 / (n + 8)));
    const cv = document.createElement('canvas'); cv.width = cv.height = (n + 8) * cell; const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = '#000';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) c.fillRect((x + 4) * cell, (y + 4) * cell, cell, cell);
    el.innerHTML = ''; el.appendChild(cv); el.dataset.code = text;
  }
  function setMsg(t) { const m = $('#lkMsg'); if (m) m.textContent = t; }
  function panel(kid) {
    let el = $('#linkPanel'); if (!el) { el = document.createElement('div'); el.id = 'linkPanel'; el.className = 'lkpanel hidden'; document.body.appendChild(el); }
    el.classList.toggle('lkkid', !!kid);
    el.innerHTML = `<div class="lkbox"><div class="lkhead"><b id="lkTitle"></b><button id="lkClose" class="lkx" title="Close">✕</button></div>
      <div class="lkmain"><div class="lkqr" id="lkQr"></div>
        <div class="lkside"><div class="lkstep" id="lkStep"></div>
          <div id="lkCam" class="lkcam hidden"><video id="lkVideo" playsinline muted></video><span>Point the camera at the code</span></div>
          <div class="lkbtns" id="lkBtns"></div>
          <details class="lkhelp"><summary>Hotspot help</summary><ol>
            <li><b>Dad's phone:</b> turn on <b>Personal Hotspot</b> (iPhone: Settings → Personal Hotspot → Allow Others to Join · Android: Hotspot &amp; tethering).</li>
            <li><b>Her iPad:</b> Settings → Wi-Fi → join Dad's phone. It's fine that it says "no internet".</li>
            <li>Open Z-DASH on both, keep both screens on, then pair here. Allow the camera when asked: it is what lets the two find each other.</li>
            <li>Stuck on "Connecting…"? Check both are on the same hotspot, turn off VPN / iCloud Private Relay, then tap ✕ and pair again.</li></ol></details>
          <details class="lkpaste"><summary>No camera? Copy / paste the code</summary><textarea id="lkCode" rows="3" spellcheck="false" placeholder="paste the other device's code"></textarea><div class="lkbtns"><button id="lkCopy">COPY MY CODE</button><button id="lkUse">USE PASTED CODE</button></div></details>
          <div class="lkmsg" id="lkMsg"></div></div></div></div>`;
    el.querySelector('#lkClose').addEventListener('click', () => { el.classList.add('hidden'); if (L.state !== 'linked') stopCam(); });
    el.querySelector('#lkQr').addEventListener('click', () => { if (el.querySelector('#lkQr canvas')) el.classList.toggle('lkbig'); }); // tap the code to make it big
    el.querySelector('#lkCopy').addEventListener('click', async () => { const c = $('#lkQr').dataset.code || ''; try { await navigator.clipboard.writeText(c); setMsg('Code copied.'); } catch (e) { $('#lkCode').value = c; $('#lkCode').select(); setMsg('Select the code above and copy it.'); } });
    el.classList.remove('hidden'); return el;
  }
  L.openShare = async function () {
    const el = panel(false); $('#lkTitle').textContent = 'SHARE TO PASSENGER'; $('#lkStep').innerHTML = '<p><b>1.</b> On her iPad: Passenger Mode → ⚙ → <b>JOIN DAD\'S CAR</b>, and scan this code.</p><p><b>2.</b> Then scan the code her iPad shows.</p><p class="mute">Both on the same Wi-Fi or this phone\'s hotspot. No internet needed.</p>';
    $('#lkBtns').innerHTML = '<button id="lkScan" class="hot">SCAN HER CODE</button>'; setMsg('Making a pairing code…');
    const use = async (code) => { try { await L.acceptAnswer(code); setMsg('Connecting…'); } catch (e) { setMsg(e.message); } };
    $('#lkScan').addEventListener('click', () => L.scan(use)); $('#lkUse').addEventListener('click', () => use($('#lkCode').value));
    try { qrTo($('#lkQr'), await L.share()); setMsg('Waiting for her iPad…'); } catch (e) { setMsg('Could not start sharing: ' + e.message); }
  };
  L.openJoin = function () {
    const el = panel(true); $('#lkTitle').textContent = "JOIN DAD'S CAR"; $('#lkQr').innerHTML = '<div class="lkph">Dad\'s phone: Settings → <b>SHARE TO PASSENGER</b></div>'; delete $('#lkQr').dataset.code;
    $('#lkStep').innerHTML = '<p><b>1.</b> Scan the code on Dad\'s phone.</p><p><b>2.</b> Show Dad the code that appears here.</p><p class="mute">Then real drives count: <b>×2 coins</b> and part boxes!</p>';
    $('#lkBtns').innerHTML = '<button id="lkScan" class="hot">SCAN DAD\'S CODE</button>'; setMsg('');
    const use = async (code) => { try { setMsg('Got it! Making your code…'); const a = await L.join(code); qrTo($('#lkQr'), a); $('#lkStep').innerHTML = '<p><b>2.</b> Show this code to Dad\'s phone. He taps <b>SCAN HER CODE</b>.</p>'; $('#lkBtns').innerHTML = ''; setMsg('Waiting for Dad…'); } catch (e) { setMsg(e.message); } };
    $('#lkScan').addEventListener('click', () => L.scan(use)); $('#lkUse').addEventListener('click', () => use($('#lkCode').value));
    if (!Q.has('nocamauto')) L.scan(use); // camera opens right away: point it at Dad's code
  };
  L.on(() => {
    const t = { idle: '', offering: 'Making a pairing code…', waiting: 'Waiting for her iPad…', answering: 'Making your code…', connecting: 'Connecting…', linked: (L.role === 'host' ? 'CONNECTED: sharing live data with her iPad.' : "CONNECTED TO DAD'S CAR!") + (L.code ? ` PAIR CODE ${L.code}` : ''), reconnecting: L.role === 'host' ? 'Signal dropped: reconnecting…' : "Dad's car dropped out: reconnecting…", lost: L.role === 'host' ? 'Link lost. Tap SHARE again to re-pair.' : "Lost Dad's car, so it's practice for now. Tap JOIN to re-pair." }[L.state] || '';
    if ($('#linkPanel') && !$('#linkPanel').classList.contains('hidden')) setMsg(t);
    const sm = $('#shareMsg'), jm = $('#joinMsg'); if (sm && L.role !== 'guest') sm.textContent = L.state === 'idle' ? sm.dataset.def || sm.textContent : t; if (jm && L.role !== 'host') jm.textContent = L.state === 'idle' ? jm.dataset.def || jm.textContent : t;
    const bs = $('#btnShare'); if (bs) { bs.textContent = L.role === 'host' && L.state !== 'idle' ? 'STOP SHARING' : 'SHARE TO PASSENGER'; bs.classList.toggle('on', L.role === 'host' && L.state === 'linked'); }
    const bj = $('#btnJoin'); if (bj) bj.classList.toggle('on', L.role === 'guest' && L.state === 'linked');
    { let rp = $('#lkRepair'); const show = L.role === 'guest' && L.state === 'lost' && document.body.classList.contains('kidon');
      if (show && !rp) { rp = document.createElement('button'); rp.id = 'lkRepair'; rp.className = 'lkrepair'; rp.textContent = "🔗 RE-PAIR WITH DAD"; rp.addEventListener('click', () => { rp.remove(); L.openJoin(); }); document.body.appendChild(rp); }
      if (!show && rp) rp.remove(); }
    if (L.state === 'linked' && L.role === 'guest') setTimeout(() => { const p = $('#linkPanel'); if (p && L.state === 'linked') { p.classList.add('hidden'); const st = $('#settings'); if (st) st.classList.add('hidden'); } }, 1800); // back to her game
  });
  function wire() {
    const sm = $('#shareMsg'), jm = $('#joinMsg'); if (sm) sm.dataset.def = sm.textContent; if (jm) jm.dataset.def = jm.textContent;
    const bs = $('#btnShare'); if (bs) bs.addEventListener('click', () => { if (L.role === 'host' && L.state !== 'idle') L.stop(); else L.openShare(); });
    const bj = $('#btnJoin'); if (bj) bj.addEventListener('click', () => L.openJoin());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();

