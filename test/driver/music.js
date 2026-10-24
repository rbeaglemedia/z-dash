
/* Z-DASH — NOW PLAYING + music beat clock.
   Sources: 'demo' (a clearly fake sample playlist, works offline), 'spotify' (Web API, Authorization Code with PKCE,
   needs Bob's own Spotify developer Client ID), or 'off'.
   Beats (for Passenger Mode's ROAD game): optional on-device microphone onset detection (Web Audio; audio is only
   analysed live in memory: nothing is recorded, stored or sent), else a steady tempo (demo track BPM or 120). */
(function () {
  const ZD = (window.ZD = window.ZD || {});
  const LS = { src: 'zdash.music.src', cid: 'zdash.spotify.clientId', tok: 'zdash.spotify.token', ver: 'zdash.spotify.verifier', state: 'zdash.spotify.state', sync: 'zdash.music.sync' };
  const REDIRECT = 'https://rbeaglemedia.github.io/z-dash/';
  // Bob's Spotify app "Z Dash" (public Client ID, PKCE: no secret anywhere). Transcribed from a photo: if Spotify says INVALID_CLIENT,
  // paste the ID from the Spotify developer dashboard into Settings > Music (a saved ID always wins over this default).
  const DEFAULT_CID = 'ae19bfe8874f4f5591cd137728ed27aa';
  const SCOPES = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  const put = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };

  // ---------- demo playlist (obviously fake) ----------
  function demoArt(c1, c2, label) {
    try { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d'); const g = x.createLinearGradient(0, 0, 128, 128); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      x.strokeStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(0, 70 + i * 8); x.lineTo(128, 70 + i * 8); x.stroke(); } x.beginPath(); x.arc(64, 64, 26, Math.PI, 0); x.fillStyle = 'rgba(255,225,77,.85)'; x.fill();
      x.fillStyle = '#fff'; x.font = '900 15px Orbitron, sans-serif'; x.textAlign = 'center'; x.fillText(label, 64, 116); x.font = '700 10px sans-serif'; x.fillText('DEMO', 64, 18); return cv.toDataURL(); } catch (e) { return ''; }
  }
  const DEMO = [
    { title: 'Neon Highway (Demo Track)', artist: 'Sample Artist · not a real song', album: 'Z-DASH Demo Mix', dur: 204, bpm: 118, c: ['#ff2a3d', '#2a0838'], tag: 'NEON' },
    { title: 'Midnight Boost (Demo Track)', artist: 'Sample Artist · not a real song', album: 'Z-DASH Demo Mix', dur: 187, bpm: 124, c: ['#3ee6ff', '#12052a'], tag: 'BOOST' },
    { title: 'Gridrunner (Demo Track)', artist: 'Sample Artist · not a real song', album: 'Z-DASH Demo Mix', dur: 221, bpm: 112, c: ['#9b5cff', '#ff4fd8'], tag: 'GRID' },
  ];

  const M = {
    src: get(LS.src, 'demo'), track: null, pos: 0, playing: false, at: performance.now(), msg: '', listeners: [], demoI: 0,
    clientId: get(LS.cid, '') || DEFAULT_CID, redirect: REDIRECT,
    on(cb) { this.listeners.push(cb); }, emit() { for (const cb of this.listeners) try { cb(this); } catch (e) {} },
    position() { return this.track ? Math.min(this.track.dur, this.pos + (this.playing ? (performance.now() - this.at) / 1000 : 0)) : 0; },
    setSource(s) { this.src = s; put(LS.src, s); this.track = null; this.msg = ''; if (s === 'demo') this.loadDemo(0, true); if (s === 'spotify') this.poll(); this.emit(); },
    loadDemo(i, play) { this.demoI = (i + DEMO.length) % DEMO.length; const d = DEMO[this.demoI]; d.art = d.art || demoArt(d.c[0], d.c[1], d.tag); this.track = Object.assign({ demo: true }, d); this.pos = 0; this.at = performance.now(); this.playing = play; this.emit(); },
    async toggle() { if (this.src === 'demo') { this.pos = this.position(); this.at = performance.now(); this.playing = !this.playing; this.emit(); return; } if (this.src === 'spotify') { const was = this.playing; this.pos = this.position(); this.at = performance.now(); this.playing = !was; this.emit(); await this.api(was ? 'PUT' : 'PUT', was ? '/me/player/pause' : '/me/player/play'); setTimeout(() => this.poll(), 600); } },
    async next() { if (this.src === 'demo') return this.loadDemo(this.demoI + 1, true); if (this.src === 'spotify') { await this.api('POST', '/me/player/next'); setTimeout(() => this.poll(), 700); } },
    async prev() { if (this.src === 'demo') return this.position() > 5 ? this.loadDemo(this.demoI, true) : this.loadDemo(this.demoI - 1, true); if (this.src === 'spotify') { await this.api('POST', '/me/player/previous'); setTimeout(() => this.poll(), 700); } },
    // volume / mute: Spotify sets the active device's volume (Premium); the demo tracks are silent samples, so there it only shows the state
    vol: Math.max(0, Math.min(100, +get('zdash.music.vol', 70) || 0)), muted: get('zdash.music.muted', '0') === '1',
    setVol(v) { this.vol = Math.round(Math.max(0, Math.min(100, v))); put('zdash.music.vol', String(this.vol)); if (this.vol > 0 && this.muted) { this.muted = false; put('zdash.music.muted', '0'); } this.pushVol(); this.emit(); },
    toggleMute() { this.muted = !this.muted; put('zdash.music.muted', this.muted ? '1' : '0'); this.pushVol(); this.emit(); },
    pushVol() { if (this.src !== 'spotify') return; clearTimeout(this._vt); this._vt = setTimeout(() => this.api('PUT', `/me/player/volume?volume_percent=${this.muted ? 0 : this.vol}`), 250); },
    tick() { if (this.src === 'demo' && this.track && this.position() >= this.track.dur) this.loadDemo(this.demoI + 1, true); },

    // ---------- Spotify (Authorization Code with PKCE; no client secret) ----------
    setClientId(id) { this.clientId = (id || '').trim() || DEFAULT_CID; put(LS.cid, this.clientId === DEFAULT_CID ? null : this.clientId); },
    token() { try { return JSON.parse(get(LS.tok, 'null')); } catch (e) { return null; } },
    connected() { return !!this.token(); },
    async connect() {
      if (!this.clientId) { this.msg = 'Enter your Spotify Client ID first.'; this.emit(); return; }
      if (!window.crypto || !crypto.subtle) { this.msg = 'Needs the secure https:// link.'; this.emit(); return; }
      const rnd = (n) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (b) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[b % 66]).join(''); };
      const ver = rnd(64), state = rnd(16), dig = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ver));
      const ch = btoa(String.fromCharCode(...new Uint8Array(dig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      put(LS.ver, ver); put(LS.state, state); put(LS.src, 'spotify'); put('zdash.spotify.ret', /jr\.html$/.test(location.pathname) ? 'jr.html' : null); // the redirect URI is index.html; jr.html sign-ins hop back after
      const u = new URL('https://accounts.spotify.com/authorize');
      u.search = new URLSearchParams({ response_type: 'code', client_id: this.clientId, scope: SCOPES, code_challenge_method: 'S256', code_challenge: ch, redirect_uri: REDIRECT, state }).toString();
      location.href = u.toString();
    },
    disconnect() { put(LS.tok, null); if (this.src === 'spotify') { this.track = null; this.playing = false; } this.msg = 'Spotify disconnected.'; this.emit(); },
    async handleRedirect() {
      const q = new URLSearchParams(location.search), code = q.get('code'), err = q.get('error');
      if (!code && !err) return; const clean = () => history.replaceState(null, '', location.pathname + location.hash);
      if (err) { this.msg = `Spotify said: ${err}`; clean(); return; }
      if (q.get('state') !== get(LS.state, '')) { this.msg = 'Spotify sign-in check failed, try CONNECT again.'; clean(); return; }
      clean();
      try { const r = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT, client_id: this.clientId, code_verifier: get(LS.ver, '') }) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error_description || j.error || r.status); this.saveTok(j); this.src = 'spotify'; put(LS.src, 'spotify'); this.msg = 'Spotify connected.'; this.poll();
      } catch (e) { this.msg = `Spotify sign-in failed: ${e.message}`; }
      put(LS.ver, null); put(LS.state, null); this.emit();
      const ret = get('zdash.spotify.ret', ''); if (ret) { put('zdash.spotify.ret', null); if (!/jr\.html$/.test(location.pathname)) location.replace(location.pathname.replace(/[^/]*$/, '') + ret); } // started on jr.html: go back there (same origin, so the token is shared)
    },
    saveTok(j) { const old = this.token() || {}; put(LS.tok, JSON.stringify({ access: j.access_token, refresh: j.refresh_token || old.refresh, exp: Date.now() + (j.expires_in || 3600) * 1000 - 60000 })); },
    async access() {
      const t = this.token(); if (!t) return null; if (Date.now() < t.exp) return t.access;
      try { const r = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: t.refresh, client_id: this.clientId }) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error); this.saveTok(j); return j.access_token; } catch (e) { put(LS.tok, null); this.msg = 'Spotify sign-in expired, tap CONNECT again.'; this.emit(); return null; }
    },
    async api(method, path) {
      const a = await this.access(); if (!a) return null;
      try { const r = await fetch('https://api.spotify.com/v1' + path, { method, headers: { Authorization: 'Bearer ' + a } });
        if (r.status === 403 && method !== 'GET') { this.msg = 'Play/pause/skip need Spotify Premium and an active device.'; this.emit(); }
        if (r.status === 404 && method !== 'GET') { this.msg = 'No active Spotify device: start playing in the Spotify app first.'; this.emit(); }
        if (r.status === 429) { this.backoff = Date.now() + 15000; }
        return r; } catch (e) { return null; }
    },
    async poll() {
      if (this.src !== 'spotify' || !this.connected() || document.hidden || (this.backoff && Date.now() < this.backoff)) return;
      const r = await this.api('GET', '/me/player/currently-playing?additional_types=episode'); if (!r) return;
      if (r.status === 204) { this.track = null; this.playing = false; this.emit(); return; }
      if (!r.ok) return; const j = await r.json(), it = j.item; if (!it) { this.track = null; this.emit(); return; }
      const imgs = (it.album && it.album.images) || it.images || []; const img = imgs.slice().sort((a, b) => a.width - b.width).find((i) => i.width >= 64) || imgs[0];
      this.track = { title: it.name, artist: (it.artists || []).map((a) => a.name).join(', ') || (it.show && it.show.name) || '', album: it.album ? it.album.name : '', art: img ? img.url : '', dur: (it.duration_ms || 0) / 1000, bpm: null };
      this.pos = (j.progress_ms || 0) / 1000; this.at = performance.now(); this.playing = !!j.is_playing; this.emit();
    },

    // ---------- beat clock + optional mic onset detection ----------
    sync: get(LS.sync, 'off'), mic: null, beats: 0, lastBeat: 0, beatSrc: 'steady', micBpm: null, onsets: [],
    bpm() { if (this.beatSrc === 'mic' && this.micBpm) return this.micBpm; if (this.track && this.track.bpm) return this.track.bpm; return 120; },
    pulse() { return Math.exp(-(performance.now() - this.lastBeat) / 140); }, // 1 on the beat, decays fast
    beatLabel() { return this.beatSrc === 'mic' ? `MIC BEAT ${this.micBpm ? Math.round(this.micBpm) + ' BPM' : '· LISTENING'}` : this.track && this.track.demo ? `DEMO BEAT ${this.bpm()} BPM` : `STEADY ${this.bpm()} BPM`; },
    async setSync(v) {
      this.sync = v; put(LS.sync, v);
      if (v === 'mic') { try { await this.startMic(); this.msg = 'Music sync on: listening for the beat (nothing is recorded).'; } catch (e) { this.sync = 'off'; put(LS.sync, 'off'); this.msg = 'Microphone not allowed, using a steady beat.'; } }
      else this.stopMic(); this.emit();
    },
    async startMic() {
      if (this.mic) return; const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const ac = new (window.AudioContext || window.webkitAudioContext)(); await ac.resume(); const srcN = ac.createMediaStreamSource(stream), an = ac.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0.2; srcN.connect(an); // analyser only, not connected to speakers or any recorder
      this.mic = { stream, ac, an, buf: new Uint8Array(an.frequencyBinCount), avg: 0, last: 0 };
    },
    stopMic() { if (!this.mic) return; this.mic.stream.getTracks().forEach((t) => t.stop()); this.mic.ac.close(); this.mic = null; this.micBpm = null; this.onsets = []; this.beatSrc = 'steady'; },
    beatTick() {
      const now = performance.now();
      if (this.mic) { // energy onset in the bass band (~40-180 Hz)
        const m = this.mic; m.an.getByteFrequencyData(m.buf); const hz = m.ac.sampleRate / m.an.fftSize; let e = 0, n = 0; for (let i = Math.floor(40 / hz); i <= Math.ceil(180 / hz); i++) { e += m.buf[i]; n++; } e /= n || 1;
        m.avg = m.avg * 0.96 + e * 0.04;
        if (e > m.avg * 1.25 && e > 70 && now - m.last > 280) { m.last = now; this.onsets.push(now); this.onsets = this.onsets.filter((t) => now - t < 8000);
          const iv = this.onsets.slice(1).map((t, i) => t - this.onsets[i]).filter((d) => d > 280 && d < 1100).sort((a, b) => a - b); if (iv.length >= 4) { let b = 60000 / iv[Math.floor(iv.length / 2)]; while (b < 85) b *= 2; while (b > 175) b /= 2; this.micBpm = b; }
          this.beat(now, 'mic'); return; }
        if (this.onsets.length >= 3 && now - this.onsets[this.onsets.length - 1] < (60000 / this.bpm()) * 1.5) return; // mic is finding beats: don't add clock beats
      }
      const per = 60000 / this.bpm(); if (now - this.lastBeat >= per) this.beat(this.lastBeat && now - this.lastBeat < per * 2 ? this.lastBeat + per : now, 'clock');
    },
    beat(t, how) { this.lastBeat = t; this.beats++; this.beatSrc = how === 'mic' ? 'mic' : 'steady'; for (const cb of this.beatCbs) try { cb(this.beats); } catch (e) {} },
    beatCbs: [], onBeat(cb) { this.beatCbs.push(cb); },
  };
  ZD.Music = M;
  if (M.src === 'demo') M.loadDemo(0, !window.ZD_JR);
  let clockIv = 0, pollIv = 0;
  ZD.musicClock = function (on) {
    if (clockIv) { clearInterval(clockIv); clockIv = 0; }
    if (pollIv) { clearInterval(pollIv); pollIv = 0; }
    if (!on || window.ZD_DASH_IDLE) return;
    const kid = !!window.ZD_JR;
    const beat = !kid || !!window.ZD_KID_BEAT;
    const spotify = !kid || (!!window.ZD_KID_MUSIC && M.src === 'spotify');
    if (!beat && !spotify) return;
    if (beat) clockIv = setInterval(() => { if (window.ZD_PARKED || window.ZD_DASH_IDLE) return; M.tick(); M.beatTick(); }, 20);
    if (spotify) pollIv = setInterval(() => { if (window.ZD_PARKED || window.ZD_DASH_IDLE) return; M.poll(); }, 4000);
  };
  if (!window.ZD_JR) ZD.musicClock(true);
  document.addEventListener('visibilitychange', () => { if (document.hidden || window.ZD_JR) return; M.poll(); });
  if (window.ZD_JR) {
    const q = new URLSearchParams(location.search);
    if (q.get('code') || q.get('error')) M.handleRedirect(); // the player only talks to Spotify after CONNECT
  } else M.handleRedirect().then(() => M.poll());
  // a saved "Mic" choice re-arms on the first tap (browsers need a gesture to start audio). The Kid App waits until that control is used.
  if (M.sync === 'mic' && !window.ZD_JR) addEventListener('pointerdown', function arm() { removeEventListener('pointerdown', arm); M.setSync('mic'); }, { once: true });
})();
/* NOW PLAYING widgets + Settings wiring (Bob's Drive panel, Passenger strip, MUSIC settings) */
(function () {
  const ZD = window.ZD, M = ZD.Music, $ = (s) => document.querySelector(s);
  const ICON = {
    prev: '<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    vol: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zM14.5 8.2a5 5 0 0 1 0 7.6l-1.2-1.4a3.2 3.2 0 0 0 0-4.8zM16.8 5.4a8.6 8.6 0 0 1 0 13.2l-1.2-1.4a6.8 6.8 0 0 0 0-10.4z"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zM15.5 9.1l1.4-1.4 2.3 2.3 2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3z"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',
  };
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const widgets = [];
  ZD.npBind = function (el) {
    el.innerHTML = `<div class="npArt"><img alt=""></div><div class="npTxt"><div class="npT"></div><div class="npA"></div><div class="npRow"><i class="npBar"><i></i></i><span class="npTime"></span></div></div>
      <div class="npBtns"><button data-np="prev" title="Previous">${ICON.prev}</button><button data-np="toggle" class="npPlay" title="Play / pause">${ICON.play}</button><button data-np="next" title="Next">${ICON.next}</button></div>`;
    if (el.classList.contains('npKid')) { // Passenger card: title marquee, big buttons, volume + mute
      el.querySelector('.npT').innerHTML = '<span class="npMq"></span>';
      el.insertAdjacentHTML('beforeend', `<div class="npVol"><button data-np="toggleMute" class="npMute" title="Mute">${ICON.vol}</button><input type="range" min="0" max="100" step="5" class="npVolR" aria-label="Volume"></div>`);
      const r = el.querySelector('.npVolR'); r.addEventListener('input', (e) => { e.stopPropagation(); M.setVol(+r.value); }); }
    el.querySelectorAll('[data-np]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); M[b.dataset.np](); }));
    el.addEventListener('pointerdown', (e) => e.stopPropagation()); // don't start the Drive-screen long-press
    widgets.push(el); paint(el); return el;
  };
  function paint(el) {
    const t = M.track, off = M.src === 'off';
    el.classList.toggle('npEmpty', !t); el.classList.toggle('npOff', off); el.classList.toggle('npDemo', !!(t && t.demo));
    const mq = el.querySelector('.npMq'); (mq || el.querySelector('.npT')).textContent = off ? 'MUSIC OFF' : t ? t.title : M.src === 'spotify' ? (M.connected() ? 'Nothing playing on Spotify' : 'Spotify not connected') : '';
    el.querySelector('.npA').textContent = off ? 'Turn on in Settings' : t ? t.artist : M.src === 'spotify' && !M.connected() ? 'Settings → MUSIC' : '';
    const img = el.querySelector('img'); const art = t && t.art ? t.art : ''; if (img.getAttribute('src') !== art) { if (art) img.src = art; else img.removeAttribute('src'); }
    el.querySelector('.npPlay').innerHTML = M.playing ? ICON.pause : ICON.play;
    if (mq) { const T = el.querySelector('.npT'); requestAnimationFrame(() => { const over = mq.scrollWidth - T.clientWidth; T.classList.toggle('marq', over > 2); T.style.setProperty('--mq', `${-over - 16}px`); T.style.setProperty('--mqs', `${Math.max(6, (over + 16) / 18)}s`); }); }
    const mb = el.querySelector('.npMute'); if (mb) { mb.innerHTML = M.muted || M.vol === 0 ? ICON.mute : ICON.vol; mb.classList.toggle('on', M.muted); const r = el.querySelector('.npVolR'); if (document.activeElement !== r) r.value = M.muted ? 0 : M.vol; r.style.setProperty('--v', `${M.muted ? 0 : M.vol}%`); }
  }
  function progress() { if (window.ZD_PARKED || window.ZD_DASH_IDLE) return; const t = M.track, p = M.position(); for (const el of widgets) { const bar = el.querySelector('.npBar > i'); bar.style.width = t && t.dur ? `${(100 * p) / t.dur}%` : '0%'; el.querySelector('.npTime').textContent = t && t.dur ? `${fmt(p)} / ${fmt(t.dur)}` : ''; el.style.setProperty('--np-pulse', M.pulse().toFixed(2)); } }
  M.on(() => { widgets.forEach(paint); renderSettings(); });
  let progIv = 0;
  ZD.musicPaint = function (on) { if (progIv) { clearInterval(progIv); progIv = 0; } if (!on || window.ZD_DASH_IDLE) return; progIv = setInterval(progress, 200); };
  if (!window.ZD_JR) ZD.musicPaint(true);

  // ---------- Settings → MUSIC ----------
  function renderSettings() {
    const box = $('#musicSet'); if (!box) return;
    box.querySelectorAll('[data-msrc]').forEach((b) => b.classList.toggle('on', b.dataset.msrc === M.src));
    const cid = $('#spCid'); if (cid && document.activeElement !== cid) cid.value = M.clientId;
    $('#spConnect').textContent = M.connected() ? 'DISCONNECT SPOTIFY' : 'CONNECT SPOTIFY';
    $('#tglSync').textContent = `MUSIC SYNC: ${M.sync === 'mic' ? 'MIC' : 'OFF'}`; $('#tglSync').classList.toggle('on', M.sync === 'mic');
    $('#musicMsg').textContent = M.msg || (M.src === 'spotify' ? (M.connected() ? 'Spotify connected.' : 'Not connected yet.') : M.src === 'demo' ? 'Demo track: a made-up sample song, no account needed.' : '');
  }
  function wire() {
    const box = $('#musicSet'); if (!box) return;
    box.querySelectorAll('[data-msrc]').forEach((b) => b.addEventListener('click', () => M.setSource(b.dataset.msrc)));
    $('#spCid').addEventListener('change', (e) => { M.setClientId(e.target.value); renderSettings(); });
    $('#spConnect').addEventListener('click', () => { M.setClientId($('#spCid').value); M.connected() ? M.disconnect() : M.connect(); });
    $('#tglSync').addEventListener('click', () => {
      if (M.sync === 'mic') return M.setSync('off');
      if (confirm('Music sync uses the microphone to hear the beat of the music in the car, so the ROAD game can move to it.\n\nThe sound is only analysed live on this phone: nothing is recorded, saved or sent.\n\nTurn on Music sync?')) M.setSync('mic');
    });
    renderSettings();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();

