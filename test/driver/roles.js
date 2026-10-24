
/* Z-DASH — DEVICE ROLES + PARENT PASSCODE.
   Every device gets a random device id (localStorage, mirrored to IndexedDB so clearing one keeps it). The FIRST device
   that sets the parent passcode becomes the DRIVER device (Bob's phone): only it can leave Passenger Mode, and only with
   the passcode. A device that pairs with Dad's car (JOIN DAD'S CAR) while Dad has a passcode becomes a PASSENGER device:
   it always opens in Passenger Mode, with no driver toggle. Recovery (new phone): a hidden "Register as driver device"
   behind the passcode (the salted hash came over the pairing link, so the passenger device can check it offline).
   Before any passcode exists nothing changes (today's flow). Passcode = 4-6 digits, PBKDF2-SHA256 with a random salt;
   the passcode itself is never stored or sent. Each device keeps its own passenger profile (zdash.kid.v1). */
(function (G) {
  const ZD = (G.ZD = G.ZD || {}), KEY = 'zdash.roles.v1', ITER = 120000, $ = (s) => document.querySelector(s);
  const hex = (u8) => Array.from(u8, (b) => b.toString(16).padStart(2, '0')).join(''), rnd = (n) => { const u = new Uint8Array(n); crypto.getRandomValues(u); return hex(u); };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  let S = load() || { v: 1, dev: rnd(12), role: null, pass: null };
  const R = (ZD.Roles = { get S() { return S; }, peers: {} });
  /* IndexedDB mirror (best effort): restores the id/role/passcode if localStorage alone was cleared */
  function idb(mode, fn) { return new Promise((ok) => { try { const q = indexedDB.open('zdash-roles', 1); q.onupgradeneeded = () => q.result.createObjectStore('kv'); q.onsuccess = () => { try { const tx = q.result.transaction('kv', mode), r = fn(tx.objectStore('kv')); tx.oncomplete = () => ok(r && r.result); tx.onerror = () => ok(null); } catch (e) { ok(null); } }; q.onerror = () => ok(null); } catch (e) { ok(null); } }); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} idb('readwrite', (st) => st.put(JSON.parse(JSON.stringify(S)), 'roles')); if (R.apply) R.apply(); }
  if (!load()) idb('readonly', (st) => st.get('roles')).then((r) => { if (r && r.dev) S = r; save(); });

  async function hash(pin, salt, it = ITER) {
    if (crypto.subtle) { const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
      return hex(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: it }, k, 256))); }
    let h = 2166136261 >>> 0; const s = salt + ':' + pin; for (let n = 0; n < 20000; n++) for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0; return 'f' + h.toString(16); /* no WebCrypto (plain http): weak fallback */
  }
  R.hasPass = () => !!S.pass;
  R.isDriverDev = () => !!S.pass && S.pass.driver === S.dev;
  const DM = () => { try { return localStorage.getItem('zdash.devMode') || ''; } catch (e) { return ''; } }; /*reopen*/ R.devMode = DM; R.setDevMode = (m) => { try { m ? localStorage.setItem('zdash.devMode', m) : localStorage.removeItem('zdash.devMode'); } catch (e) {} if (R.apply) R.apply(); };
  R.isPassengerDev = () => DM() === 'kid' || (DM() !== 'adult' && S.role === 'passenger' && !R.isDriverDev());
  R.needsPass = () => R.isDriverDev(); /* leaving Passenger Mode */
  R.canDrive = () => !R.isPassengerDev();
  let fails = 0, lockUntil = 0;
  R.check = async (pin) => { if (!S.pass) return true; if (Date.now() < lockUntil) return false; const ok = (await hash(pin, S.pass.salt, S.pass.it)) === S.pass.hash; if (ok) fails = 0; else if (++fails >= 5) { lockUntil = Date.now() + 30000; fails = 0; } return ok; };
  R.locked = () => Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
  R.setPass = async (pin) => { const salt = rnd(16); S.pass = { salt, it: crypto.subtle ? ITER : 0, hash: await hash(pin, salt), driver: S.pass ? S.pass.driver : S.dev, at: Date.now() }; if (S.pass.driver === S.dev) S.role = 'driver'; save(); share(); };
  R.registerDriver = () => { if (!S.pass) return; S.pass = Object.assign({}, S.pass, { driver: S.dev, at: Date.now() }); S.role = 'driver'; save(); share(); };
  R.clearPass = () => { S.pass = null; S.role = null; save(); };
  /* pairing sync: newest passcode record wins on both sides; a device that is not the record's driver becomes a passenger */
  R.merge = (rec) => { if (!rec || !rec.hash || !rec.salt) return; if (S.pass && (S.pass.at || 0) >= (rec.at || 0)) return; S.pass = { salt: rec.salt, it: rec.it, hash: rec.hash, driver: rec.driver, at: rec.at }; S.role = rec.driver === S.dev ? 'driver' : 'passenger'; if (S.role === 'passenger') try { localStorage.removeItem('zdash.devMode'); } catch (e) {} save(); if (S.role === 'passenger' && ZD.Kid && ZD.Kid.setOn) ZD.Kid.setOn(true, false); };
  const rec = () => (S.pass ? { salt: S.pass.salt, it: S.pass.it, hash: S.pass.hash, driver: S.pass.driver, at: S.pass.at } : null);
  function share() { const L = ZD.Link; if (L && L.send && L.state === 'linked') { L.send({ k: 'ro', rec: rec() }); } }
  R.onLink = (L) => { if (S.pass) L.send({ k: 'ro', rec: rec() }); if (L.role === 'guest') L.send({ k: 'pf', p: R.profile() }); };
  R.profile = () => { let p = (G.ZDKID && G.ZDKID.P) || null; if (!p) try { p = JSON.parse(localStorage.getItem('zdash.kid.v1')) || {}; } catch (e) { p = {}; } return { dev: S.dev, name: p.carName || p.name || '', coins: p.coins || 0, stars: p.stars || 0, presets: (p.myPresets || []).length }; };
  R.peerProfile = (p) => { if (!p || !p.dev) return; R.peers[p.dev] = Object.assign({ seen: Date.now() }, p); try { localStorage.setItem('zdash.peers', JSON.stringify(R.peers)); } catch (e) {} };
  try { R.peers = JSON.parse(localStorage.getItem('zdash.peers')) || {}; } catch (e) {}

  /* ---------- keypad (parent passcode) ---------- */
  R.keypad = function (title, sub) { return new Promise((done) => {
    let el = $('#pcPad'); if (el) el.remove(); el = document.createElement('div'); el.id = 'pcPad'; el.className = 'pcpad';
    el.innerHTML = `<div class="pcbox"><div class="pchead"><b>${title}</b><button class="pcx" data-k="x">✕</button></div><div class="pcsub">${sub || ''}</div><div class="pcdots"></div>
      <div class="pckeys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-k="${n}">${n}</button>`).join('')}<button data-k="b">⌫</button><button data-k="0">0</button><button data-k="ok" class="pcok">OK</button></div></div>`;
    document.body.appendChild(el); let v = ''; const dots = el.querySelector('.pcdots'), draw = () => { dots.innerHTML = Array.from({ length: Math.max(4, v.length) }, (_, i) => `<i class="${i < v.length ? 'on' : ''}"></i>`).join(''); };
    const end = (r) => { el.remove(); done(r); }; draw();
    el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) { if (e.target === el) end(null); return; } const k = b.dataset.k;
      if (k === 'x') end(null); else if (k === 'b') v = v.slice(0, -1); else if (k === 'ok') { if (v.length >= 4) end(v); else el.querySelector('.pcsub').textContent = '4 to 6 digits'; } else if (v.length < 6) v += k; draw(); });
  }); };
  R.say = (el, t) => { const s = el && el.querySelector('.pcsub'); if (s) s.textContent = t; };
  /* ask for the passcode; resolves true when correct (or when no passcode exists) */
  R.gate = async function (why) { if (!S.pass) return true; for (let i = 0; i < 3; i++) { const l = R.locked(); const pin = await R.keypad('PARENT PASSCODE', l ? `Too many tries. Wait ${l} s.` : why || 'Enter the parent passcode'); if (pin == null) return false; if (await R.check(pin)) return true; } return false; };
  R.setup = async function () {
    if (S.pass && !(await R.gate('Enter the CURRENT passcode to change it'))) return false;
    const a = await R.keypad(S.pass ? 'NEW PASSCODE' : 'SET PARENT PASSCODE', 'Pick 4 to 6 digits. This phone becomes the DRIVER device.'); if (a == null) return false;
    const b = await R.keypad('CONFIRM PASSCODE', 'Type it again'); if (b == null) return false; if (a !== b) { R.toast('Passcodes did not match. Nothing changed.'); return false; }
    await R.setPass(a); R.toast('Parent passcode set. This phone is the driver device.'); return true;
  };
  R.recover = async function () {
    if (!S.pass) { R.toast("Pair with Dad's phone once (JOIN DAD'S CAR) so this device can check the passcode."); return false; }
    if (!(await R.gate('Register THIS device as the driver device'))) return false; R.registerDriver(); if (ZD.Kid && ZD.Kid.setOn) ZD.Kid.setOn(false); R.toast('This device is now the driver device.'); return true;
  };
  R.toast = (t) => { const k = ZD.Kid && ZD.Kid.toast; if (k && document.body.classList.contains('kidon')) k(t, 3200); else { const el = $('#toast'); if (!el) return; el.textContent = t; el.classList.remove('hidden'); clearTimeout(R._tt); R._tt = setTimeout(() => el.classList.add('hidden'), 3200); } };

  /* ---------- Settings: status text, kid-only settings, buttons ---------- */
  R.apply = function () {
    const b = document.body; if (!b) return; b.classList.toggle('zd-passdev', R.isPassengerDev()); b.classList.toggle('zd-locked', R.needsPass());
    const st = $('#passStat'), bp = $('#btnPass');
    if (bp) bp.textContent = S.pass ? 'CHANGE PASSCODE' : 'SET PARENT PASSCODE';
    if (st) st.textContent = !S.pass ? 'No passcode yet: Passenger Mode can be left without one. Set it here and this phone becomes the driver device.' : R.isDriverDev() ? 'This phone is the DRIVER device. Leaving Passenger Mode needs the passcode.' : 'Passenger device.';
  };
  function wire() {
    const panel = $('#settings .panel'); if (panel) { let drv = false; for (const c of panel.children) { if (c.tagName === 'H3' && /MUSIC/.test(c.textContent)) drv = true; if (drv) c.classList.add('drvset'); } } /* kid-only Settings: everything from MUSIC down is Dad's */
    const tk = $('#tglKid'); if (tk && tk.parentNode) tk.parentNode.classList.add('kidtglrow');
    const bp = $('#btnPass'); if (bp) bp.addEventListener('click', () => R.setup());
    const br = $('#btnRegDrv'); if (br) br.addEventListener('click', () => R.recover());
    R.apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})(window);

