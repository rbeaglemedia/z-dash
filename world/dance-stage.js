/* Ellie's Dance Stage — Z Company Arts
   Standalone page: dance-stage.html
   Neon World: window.DANCE_STAGE opens over the world when a DANCE building is entered.
   Visual only. No WebAudio. Scores in zdash.dancestage.v1.
   Character mo-cap in zdash.customdance.v1. Pet mo-cap in zdash.petdance.v1. */
(function () {
  'use strict';
  if (window.DANCE_STAGE && window.DANCE_STAGE.open) return;

  var LS_STAGE = 'zdash.dancestage.v1';
  var LS_DANCE = 'zdash.customdance.v1';
  var CH_NAME = 'zdash-customdance';
  var LS_PET = 'zdash.petdance.v1';
  var CH_PET = 'zdash-petdance';
  var HIT_E = 0.1;
  var STILL_E = 0.045;
  var WAVE_E = 0.08;
  var DIFF_T = 45;
  var ZONE_IDS = ['UL', 'UR', 'ML', 'MR', 'LL', 'LR'];
  var ZONE_META = {
    UL: { name: 'UP-LEFT', hint: 'L HAND HIGH', color: '#3ee6ff' },
    UR: { name: 'UP-RIGHT', hint: 'R HAND HIGH', color: '#ff4fd8' },
    ML: { name: 'MID-LEFT', hint: 'L WAVE', color: '#ffe14d' },
    MR: { name: 'MID-RIGHT', hint: 'R WAVE', color: '#7dff6b' },
    LL: { name: 'LOW-LEFT', hint: 'L KICK', color: '#b45cff' },
    LR: { name: 'LOW-RIGHT', hint: 'R KICK', color: '#ffb020' }
  };
  var ANALYZE = {
    UL: [0.02, 0.06, 0.32, 0.30],
    UR: [0.66, 0.06, 0.32, 0.30],
    ML: [0.00, 0.34, 0.30, 0.30],
    MR: [0.70, 0.34, 0.30, 0.30],
    LL: [0.02, 0.64, 0.34, 0.32],
    LR: [0.64, 0.64, 0.34, 0.32],
    WAVE: [0.70, 0.00, 0.30, 0.26],
    MID: [0.30, 0.28, 0.40, 0.44]
  };
  var CAM = {
    video: { facingMode: 'user', width: { ideal: 640, max: 1280 }, height: { ideal: 480, max: 720 } },
    audio: false
  };

  function cue(b, extra) {
    var c = { b: b };
    if (extra) for (var k in extra) c[k] = extra[k];
    return c;
  }
  var ROUTINES = {
    'neon-pulse': {
      id: 'neon-pulse', name: 'NEON PULSE', bpm: 116, tag: 'GROOVE & REACH',
      cues: [
        cue(1, { z: 'UL' }), cue(2, { z: 'UR' }), cue(3, { z: 'ML' }), cue(4, { z: 'MR' }),
        cue(5, { z: 'UL' }), cue(6, { z: 'UR' }), cue(7, { z: 'LL' }), cue(8, { z: 'LR' }),
        cue(10, { pose: 1 }),
        cue(13, { z: 'ML' }), cue(14, { z: 'MR' }), cue(15, { z: 'UL' }), cue(16, { z: 'UR' }),
        cue(17, { z: 'LL' }), cue(18, { z: 'LR' }),
        cue(20, { pose: 1 }),
        cue(23, { z: 'UL' }), cue(24, { z: 'UR' })
      ]
    },
    'cyber-stage': {
      id: 'cyber-stage', name: 'CYBER STAGE', bpm: 126, tag: 'DOUBLE HITS & COMBO FLOW',
      cues: [
        cue(1, { z: 'UL' }), cue(2, { z: 'MR' }), cue(3, { z: 'UR' }), cue(4, { z: 'ML' }),
        cue(5, { hands: 1 }),
        cue(7, { z: 'LL' }), cue(8, { z: 'UR' }), cue(9, { z: 'LR' }), cue(10, { z: 'UL' }),
        cue(11, { hands: 1 }),
        cue(13, { spin: 1 }),
        cue(15, { z: 'ML' }), cue(16, { z: 'MR' }),
        cue(17, { hands: 1 }),
        cue(19, { spin: 1 }),
        cue(21, { z: 'LL' }), cue(22, { z: 'LR' })
      ]
    },
    'pro-choreo': {
      id: 'pro-choreo', name: 'PRO CHOREO CHALLENGE', bpm: 136, tag: 'FULL BODY 8-COUNT',
      cues: [
        cue(1, { z: 'UL' }), cue(2, { z: 'LL' }), cue(3, { z: 'UR' }), cue(4, { z: 'LR' }),
        cue(5, { z: 'UL' }), cue(6, { z: 'MR' }), cue(7, { z: 'UR' }), cue(8, { z: 'ML' }),
        cue(9, { z: 'LL' }), cue(10, { z: 'UL' }), cue(11, { z: 'LR' }), cue(12, { z: 'UR' }),
        cue(13, { z: 'ML' }), cue(14, { z: 'LL' }), cue(15, { z: 'MR' }), cue(16, { z: 'LR' }),
        cue(17, { hands: 1 }),
        cue(19, { spin: 1 }),
        cue(21, { z: 'UL' }), cue(22, { z: 'UR' }), cue(23, { z: 'LL' }), cue(24, { z: 'LR' }),
        cue(26, { pose: 1 }),
        cue(29, { z: 'ML' }), cue(30, { z: 'MR' }), cue(31, { z: 'UL' }), cue(32, { z: 'UR' }),
        cue(34, { pose: 1 })
      ]
    },
    freestyle: { id: 'freestyle', name: 'FREESTYLE MIRROR', bpm: 120, tag: 'NO TIMER', cues: [] }
  };

  function clamp(v, a, b) { v = +v; if (v !== v) v = 0; return v < a ? a : v > b ? b : v; }
  function r3(n) { return Math.round(clamp(n, -2, 2) * 1000) / 1000; }
  function emptyEnergy() {
    return { UL: 0, UR: 0, ML: 0, MR: 0, LL: 0, LR: 0 };
  }

  var state = {
    open: false,
    mode: 'align',
    intent: 'routine',
    countKind: 'routine',
    selected: 'neon-pulse',
    routineId: 'neon-pulse',
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    poses: 0,
    perfects: 0,
    misses: 0,
    cameraActive: false,
    simActive: true,
    userSim: false,
    camTried: false,
    zoneEnergy: emptyEnergy(),
    simEnergy: emptyEnergy(),
    camEnergy: emptyEnergy(),
    pulseEnergy: emptyEnergy(),
    wasHot: {},
    bestScores: {},
    rank: '',
    cues: [],
    routineT: 0,
    countLeft: 0,
    countGo: 0,
    waveHold: 0,
    wavePtr: false,
    waveEnergy: 0,
    midEnergy: 0,
    sawMotion: false,
    poseHold: 0,
    judge: null,
    shutter: 0,
    fever: false,
    moves: 0,
    kcal: 0,
    building: null,
    moFrames: [],
    recordT: 0,
    playT: 0,
    slotName: 'ELLIE MO-CAP #1',
    petName: 'CYBER PUP #1',
    petFrames: [],
    faults: [],
    W: 0,
    H: 0
  };

  var root, canvas, ctx, video, stream, topEl, titleEl, subEl, footEl, waveBox, waveBtn, waveCap;
  var chipBtns = {}, slotBtns = [], progBtn, dogBtn, simBtn, slotRow;
  var mcan, mctx, prevPix, sparks = [], lastT = 0, storeCache = null, danceCh = null, petCache = null, petCh = null, rewarded = false;
  var rafOn = false, layoutCache = null;

  function fault(e) {
    var msg = e && e.stack ? String(e.stack) : String(e);
    if (state.faults.length < 6 && state.faults.indexOf(msg) < 0) state.faults.push(msg);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function injectStyle() {
    if (document.getElementById('zd-ds-style')) return;
    var s = el('style');
    s.id = 'zd-ds-style';
    s.textContent = [
      '.zd-ds, .zd-ds *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
      '.zd-ds{display:none;position:fixed;inset:0;z-index:80;background:#07010f;color:#fff;font-family:Orbitron,sans-serif;user-select:none;touch-action:none;overflow:hidden}',
      '.zd-ds.zd-ds-on{display:block}',
      '.zd-ds canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}',
      '.zd-ds-vid{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}',
      '.zd-ds-top{position:absolute;top:0;left:0;right:0;z-index:3;text-align:center;pointer-events:none;padding:5px 12px 2px;background:linear-gradient(rgba(5,0,16,.9),rgba(5,0,16,.28) 72%,transparent)}',
      '.zd-ds-mark{font:800 clamp(10px,1.65vw,14px)/1.25 Orbitron,sans-serif;letter-spacing:.6px;color:#fff;text-shadow:0 0 10px #3ee6ff,0 0 18px #ff4fd8}',
      '.zd-ds-sub{margin-top:2px;font:700 9px/1.25 Orbitron,sans-serif;letter-spacing:.7px;color:#ffb3e6;text-shadow:0 0 8px rgba(255,79,216,.85)}',
      '.zd-ds-foot{position:absolute;left:0;right:0;bottom:0;z-index:3;display:flex;flex-direction:column;gap:4px;padding:4px 8px calc(6px + env(safe-area-inset-bottom));background:linear-gradient(transparent,rgba(5,0,16,.94) 26%)}',
      '.zd-ds-row{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}',
      '.zd-ds button{font-family:Orbitron,sans-serif;font-weight:800;font-size:10px;letter-spacing:.35px;color:#fff;background:rgba(62,230,255,.1);border:1.5px solid rgba(62,230,255,.85);border-radius:999px;padding:5px 8px;cursor:pointer}',
      '.zd-ds button.on{color:#12052a;background:linear-gradient(90deg,#ffe14d,#ff9a2e);border-color:#ffe14d;box-shadow:0 0 12px rgba(255,225,77,.45)}',
      '.zd-ds-program{width:100%;border-color:#ff4fd8;background:rgba(255,79,216,.16);letter-spacing:.4px}',
      '.zd-ds-program.on{color:#fff;background:linear-gradient(90deg,#ff4fd8,#3ee6ff);border-color:#fff;box-shadow:0 0 16px rgba(255,79,216,.55)}',
      '.zd-ds-dog{width:100%;border-color:#ffe14d;background:rgba(255,225,77,.12);letter-spacing:.4px;color:#fff}',
      '.zd-ds-dog.on{color:#12052a;background:linear-gradient(90deg,#ffe14d,#7dff6b);border-color:#fff;box-shadow:0 0 16px rgba(125,255,107,.55)}',
      '.zd-ds-wavebox{position:absolute;z-index:4;display:flex;align-items:center;gap:6px}',
      '.zd-ds-wavebox[hidden]{display:none !important}',
      '.zd-ds-slots[hidden]{display:none !important}',
      '.zd-ds-wavecap{max-width:148px;font:800 8px/1.25 Orbitron,sans-serif;color:#d9fbff;text-align:right;text-shadow:0 0 8px #3ee6ff}',
      '.zd-ds-wave{width:70px;height:70px;border-radius:50%;padding:0;border:2px solid #ff4fd8;box-shadow:0 0 16px rgba(62,230,255,.7),inset 0 0 12px rgba(255,79,216,.4);background:radial-gradient(circle at 50% 50%,rgba(8,0,20,.15),rgba(8,0,20,.55) 70%),conic-gradient(#3ee6ff var(--p,0%),rgba(255,79,216,.18) 0)}',
      '.zd-ds-slot{max-width:30%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    ].join('');
    document.head.appendChild(s);
  }

  function mount() {
    if (root) return true;
    if (!document.body) return false;
    injectStyle();
    root = el('div', 'zd-ds');
    root.id = 'zd-ds';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('aria-label', 'Z Company Arts Neon Dance Stage');
    canvas = el('canvas');
    canvas.id = 'zd-ds-cv';
    ctx = canvas.getContext('2d', { alpha: false });
    video = el('video', 'zd-ds-vid');
    video.setAttribute('playsinline', '');
    video.muted = true;
    video.autoplay = true;
    topEl = el('div', 'zd-ds-top');
    titleEl = el('div', 'zd-ds-mark', 'Z COMPANY ARTS — NEON DANCE STAGE');
    subEl = el('div', 'zd-ds-sub', "ELLIE'S FLOOR CAM");
    topEl.appendChild(titleEl);
    topEl.appendChild(subEl);
    waveBox = el('div', 'zd-ds-wavebox');
    waveCap = el('div', 'zd-ds-wavecap', 'WAVE HAND HERE FOR 1s TO START HANDS-FREE');
    waveBtn = el('button', 'zd-ds-wave', '');
    waveBtn.type = 'button';
    waveBtn.setAttribute('aria-label', 'WAVE HAND HERE FOR 1s TO START HANDS-FREE');
    waveBox.appendChild(waveCap);
    waveBox.appendChild(waveBtn);
    footEl = el('div', 'zd-ds-foot');
    var row1 = el('div', 'zd-ds-row');
    var tracks = [
      ['neon-pulse', 'NEON PULSE'],
      ['cyber-stage', 'CYBER STAGE'],
      ['pro-choreo', 'PRO CHOREO'],
      ['freestyle', 'FREESTYLE']
    ];
    tracks.forEach(function (pair) {
      var b = el('button', '', pair[1]);
      b.type = 'button';
      b.setAttribute('data-id', pair[0]);
      b.addEventListener('click', function () { api.startRoutine(pair[0]); });
      chipBtns[pair[0]] = b;
      row1.appendChild(b);
    });
    progBtn = el('button', 'zd-ds-program', 'PROGRAM CHARACTER DANCE (CAMERA MO-CAP)');
    progBtn.type = 'button';
    progBtn.addEventListener('click', enterMocap);
    dogBtn = el('button', 'zd-ds-dog', 'RECORD DOG / PET DANCE (DOG MO-CAP)');
    dogBtn.type = 'button';
    dogBtn.addEventListener('click', onDogClick);
    var row3 = el('div', 'zd-ds-row');
    function act(label, fn) {
      var b = el('button', '', label);
      b.type = 'button';
      b.addEventListener('click', fn);
      row3.appendChild(b);
      return b;
    }
    act('START ROUTINE', function () { api.startRoutine(state.selected || 'neon-pulse'); });
    act('PROP 5s COUNTDOWN', propCountdown);
    simBtn = act('PRACTICE / SIM DANCER', toggleSim);
    act('RECORD CHOREO', function () {
      if (isPetish() || state.intent === 'pet') api.recordPetDance();
      else api.recordChoreo();
    });
    act('BACK TO NEON WORLD', onBack);
    slotRow = el('div', 'zd-ds-row zd-ds-slots');
    slotRow.hidden = true;
    for (var i = 0; i < 3; i++) {
      (function (idx) {
        var b = el('button', 'zd-ds-slot', 'SLOT ' + (idx + 1));
        b.type = 'button';
        b.addEventListener('click', function () { selectSlot(idx); });
        slotBtns.push(b);
        slotRow.appendChild(b);
      })(i);
    }
    var saveB = el('button', '', 'SAVE SLOT');
    saveB.type = 'button';
    saveB.addEventListener('click', function () {
      if (isPetish() || state.intent === 'pet') {
        var petFrames = state.petFrames && state.petFrames.length ? state.petFrames : null;
        if (!petFrames) return;
        savePetDance(readPetStore().activeSlot || 0, state.petName, petFrames);
        return;
      }
      var store = readStore();
      var frames = state.moFrames && state.moFrames.length ? state.moFrames : null;
      if (!frames) return;
      api.saveCustomDance(store.activeSlot || 0, state.slotName, frames);
    });
    slotRow.appendChild(saveB);
    footEl.appendChild(row1);
    footEl.appendChild(progBtn);
    footEl.appendChild(dogBtn);
    footEl.appendChild(row3);
    footEl.appendChild(slotRow);
    root.appendChild(canvas);
    root.appendChild(video);
    root.appendChild(topEl);
    root.appendChild(waveBox);
    root.appendChild(footEl);
    document.body.appendChild(root);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    waveBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); state.wavePtr = true; });
    waveBtn.addEventListener('pointerup', function () { state.wavePtr = false; });
    waveBtn.addEventListener('pointercancel', function () { state.wavePtr = false; });
    window.addEventListener('resize', resize);
    mcan = document.createElement('canvas');
    mcan.width = 160;
    mcan.height = 120;
    mctx = mcan.getContext('2d', { willReadFrequently: true });
    if (!rafOn) { rafOn = true; requestAnimationFrame(raf); }
    return true;
  }

  function isStandalone() {
    var p = String((location && location.pathname) || '') + ' ' + String((location && location.href) || '');
    return /dance-stage\.html/i.test(p);
  }
  function inWorld() {
    if (document.getElementById('kMenuB') || document.getElementById('kid')) return true;
    if (typeof CITY !== 'undefined' && CITY) return true;
    return false;
  }
  function isMocapish() {
    if (state.mode === 'mocap' || state.mode === 'recording' || state.mode === 'playback') return true;
    if ((state.mode === 'countdown' || state.mode === 'countgo') && state.countKind === 'record') return true;
    return false;
  }
  function isPetish() {
    if (state.mode === 'pet' || state.mode === 'petrec' || state.mode === 'petplay') return true;
    if ((state.mode === 'countdown' || state.mode === 'countgo') && state.countKind === 'pet') return true;
    return false;
  }
  function isStudio() { return isMocapish() || isPetish(); }
  function currentBpm() {
    if (isMocapish() || state.routineId === 'freestyle' || state.routineId === 'mocap') return 120;
    var r = ROUTINES[state.routineId] || ROUTINES['neon-pulse'];
    return r.bpm;
  }
  function clockTime() {
    if (state.mode === 'playback' || state.mode === 'petplay') return state.playT;
    if (state.mode === 'recording' || state.mode === 'petrec') return state.recordT;
    if (state.mode === 'routine' || state.mode === 'freestyle') return state.routineT;
    return (performance.now() / 1000) % 64;
  }

  function updateChrome() {
    if (!titleEl) return;
    var mocap = isMocapish();
    var pet = isPetish();
    titleEl.textContent = pet
      ? 'Z COMPANY ARTS — RECORD DOG / PET DANCE (DOG MO-CAP)'
      : mocap
        ? 'Z COMPANY ARTS — PROGRAM CHARACTER DANCE (CAMERA MO-CAP)'
        : 'Z COMPANY ARTS — NEON DANCE STAGE';
    if (pet) subEl.textContent = 'PET LOOP · 6.0 SECONDS · 60 KEYFRAMES · CYBER PUP';
    else if (mocap) subEl.textContent = '8-COUNT LOOP · 8.0 SECONDS · 120 BPM · 80 KEYFRAMES';
    else if (state.mode === 'freestyle') subEl.textContent = 'FREESTYLE MIRROR · NO TIMER · FLOOR CAM';
    else {
      var meta = ROUTINES[state.selected] || ROUTINES['neon-pulse'];
      subEl.textContent = "ELLIE'S FLOOR CAM · " + meta.name + ' · ' + meta.bpm + ' BPM · ' + meta.tag;
    }
    Object.keys(chipBtns).forEach(function (id) {
      chipBtns[id].classList.toggle('on', !mocap && !pet && state.selected === id);
    });
    if (progBtn) progBtn.classList.toggle('on', mocap);
    if (dogBtn) dogBtn.classList.toggle('on', pet);
    if (simBtn) simBtn.classList.toggle('on', !!state.userSim || (!state.cameraActive && state.simActive));
    if (slotRow) slotRow.hidden = !(mocap || pet);
    if (waveBox) waveBox.hidden = !(state.mode === 'align' || state.mode === 'mocap' || state.mode === 'pet');
    refreshSlotLabels();
  }

  function refreshSlotLabels() {
    if (!slotBtns.length) return;
    var store = (isPetish() || state.intent === 'pet') ? readPetStore() : readStore();
    for (var i = 0; i < 3; i++) {
      var s = store.slots[i];
      slotBtns[i].textContent = s && s.name ? ('SLOT ' + (i + 1) + ' · ' + s.name) : ('SLOT ' + (i + 1));
      slotBtns[i].classList.toggle('on', store.activeSlot === i);
    }
  }

  function resize() {
    if (!root || !state.open) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = root.clientWidth || window.innerWidth || 1;
    var h = root.clientHeight || window.innerHeight || 1;
    var pw = Math.max(1, Math.round(w * dpr));
    var ph = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.W = w;
    state.H = h;
  }

  function computeLayout() {
    var W = state.W || window.innerWidth || 844;
    var H = state.H || window.innerHeight || 390;
    var head = topEl ? topEl.offsetHeight || 36 : 36;
    var foot = footEl ? footEl.offsetHeight || 120 : 120;
    var mocap = isStudio();
    var portrait = H > W * 1.02;
    var stage, panel = null;
    if (mocap && !portrait) {
      var pw = Math.max(188, Math.min(280, Math.round(W * 0.34)));
      panel = { x: W - pw - 6, y: head + 2, w: pw, h: Math.max(80, H - head - foot - 8) };
      stage = { x: 0, y: 0, w: W - pw - 2, h: H };
    } else if (mocap && portrait) {
      var ph = Math.max(140, Math.round(H * 0.34));
      panel = { x: 8, y: H - foot - ph - 4, w: W - 16, h: ph };
      stage = { x: 0, y: 0, w: W, h: panel.y };
    } else stage = { x: 0, y: 0, w: W, h: H };
    var top = head + 22;
    var limitH = portrait && panel ? stage.h : H;
    var bot = limitH - (portrait && panel ? 8 : foot) - 8;
    var span = Math.max(48, bot - top);
    var nx = { UL: 0.18, UR: 0.80, ML: 0.11, MR: 0.89, LL: 0.20, LR: 0.80 };
    var ny = { UL: 0.14, UR: 0.18, ML: 0.46, MR: 0.46, LL: 0.78, LR: 0.78 };
    var rad = Math.max(20, Math.min(32, stage.w * 0.055, span * 0.13));
    var pads = {};
    ZONE_IDS.forEach(function (id) {
      pads[id] = { id: id, x: stage.x + nx[id] * stage.w, y: top + ny[id] * span, r: rad };
    });
    var center = { x: stage.x + stage.w * 0.5, y: top + span * 0.46 };
    var box = {
      head: head, foot: foot, stage: stage, panel: panel, pads: pads, center: center,
      frame: {
        x: stage.x + stage.w * 0.28,
        y: top + span * 0.04,
        w: stage.w * 0.44,
        h: span * 0.9
      }
    };
    layoutCache = box;
    if (waveBox && !waveBox.hidden) {
      var wr = 8;
      if (panel && !portrait) waveBox.style.right = (W - stage.w + wr) + 'px';
      else waveBox.style.right = wr + 'px';
      waveBox.style.left = 'auto';
      waveBox.style.top = (head + 4) + 'px';
    }
    if (waveBtn) waveBtn.style.setProperty('--p', Math.round(clamp(state.waveHold, 0, 1) * 100) + '%');
    return box;
  }

  /* ---------- camera ---------- */
  function stopCamera() {
    state.cameraActive = false;
    if (stream) {
      try { stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} }); } catch (e) {}
    }
    stream = null;
    if (video) { try { video.srcObject = null; } catch (e) {} }
    prevPix = null;
  }
  function camAvailable() {
    return new Promise(function (resolve) {
      var done = false;
      function finish(v) { if (!done) { done = true; resolve(!!v); } }
      setTimeout(function () { finish(false); }, 900);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return finish(false);
        navigator.mediaDevices.enumerateDevices().then(function (list) {
          finish((list || []).some(function (d) { return d && d.kind === 'videoinput'; }));
        }, function () { finish(false); });
      } catch (e) { finish(false); }
    });
  }
  function startCamera() {
    camAvailable().then(function (ok) {
      if (!state.open || state.userSim || !ok) {
        state.simActive = true;
        state.cameraActive = false;
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        state.simActive = true;
        return;
      }
      navigator.mediaDevices.getUserMedia(CAM).then(function (s) {
        if (!state.open || state.userSim) {
          try { s.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
          return;
        }
        stream = s;
        video.srcObject = s;
        var p = video.play();
        if (p && p.then) p.then(function () {}, function () {});
        state.cameraActive = true;
        state.simActive = false;
        prevPix = null;
      }, function () {
        state.cameraActive = false;
        state.simActive = true;
      });
    }, function () { state.simActive = true; });
  }
  function toggleSim() {
    state.userSim = !state.userSim;
    if (state.userSim) {
      stopCamera();
      state.simActive = true;
      state.userSim = true;
    } else {
      state.camTried = true;
      startCamera();
    }
    updateChrome();
  }

  var ZONE_PIX = {};
  (function () {
    Object.keys(ANALYZE).forEach(function (k) {
      var r = ANALYZE[k];
      var x0 = Math.max(0, Math.floor(r[0] * 160));
      var y0 = Math.max(0, Math.floor(r[1] * 120));
      var x1 = Math.min(160, Math.ceil((r[0] + r[2]) * 160));
      var y1 = Math.min(120, Math.ceil((r[1] + r[3]) * 120));
      ZONE_PIX[k] = { x0: x0, y0: y0, x1: x1, y1: y1, n: Math.max(1, (x1 - x0) * (y1 - y0)) };
    });
  })();

  function analyzeCamera() {
    if (!state.cameraActive || !video || video.readyState < 2 || !mctx) return;
    try {
      mctx.save();
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.translate(160, 0);
      mctx.scale(-1, 1);
      mctx.drawImage(video, 0, 0, 160, 120);
      mctx.restore();
      var img = mctx.getImageData(0, 0, 160, 120);
      var d = img.data;
      if (!prevPix || prevPix.length !== d.length) {
        prevPix = new Uint8ClampedArray(d);
        return;
      }
      var counts = { UL: 0, UR: 0, ML: 0, MR: 0, LL: 0, LR: 0, WAVE: 0, MID: 0 };
      var out = mctx.createImageData(160, 120);
      var o = out.data;
      var keys = Object.keys(ZONE_PIX);
      for (var y = 0; y < 120; y++) {
        for (var x = 0; x < 160; x++) {
          var i = (y * 160 + x) * 4;
          var diff = Math.abs(d[i] - prevPix[i]) + Math.abs(d[i + 1] - prevPix[i + 1]) + Math.abs(d[i + 2] - prevPix[i + 2]);
          if (diff > DIFF_T) {
            var hot = diff > 110;
            o[i] = hot ? 255 : 80;
            o[i + 1] = hot ? 210 : 240;
            o[i + 2] = hot ? 90 : 255;
            o[i + 3] = hot ? 210 : 150;
            for (var k = 0; k < keys.length; k++) {
              var z = ZONE_PIX[keys[k]];
              if (x >= z.x0 && x < z.x1 && y >= z.y0 && y < z.y1) counts[keys[k]]++;
            }
            if (sparks.length < 140 && ((x + y) % 17) === 0) {
              var L = layoutCache;
              if (L) sparks.push({
                x: L.stage.x + (x / 160) * L.stage.w,
                y: L.stage.y + (y / 120) * L.stage.h,
                vx: (Math.random() - 0.5) * 30,
                vy: -25 - Math.random() * 40,
                life: 0.45,
                color: hot ? '#ffe14d' : (x < 80 ? '#3ee6ff' : '#ff4fd8')
              });
            }
          }
        }
      }
      prevPix.set(d);
      mctx.putImageData(out, 0, 0);
      state.motionReady = true;
      ZONE_IDS.forEach(function (id) {
        var raw = counts[id] / ZONE_PIX[id].n;
        state.camEnergy[id] = state.camEnergy[id] * 0.45 + raw * 0.55;
      });
      state.waveEnergy = state.waveEnergy * 0.4 + (counts.WAVE / ZONE_PIX.WAVE.n) * 0.6;
      state.midEnergy = counts.MID / ZONE_PIX.MID.n;
    } catch (e) { fault(e); }
  }

  function recomputeEnergy(dt) {
    ZONE_IDS.forEach(function (id) {
      var target = 0;
      if (state.cameraActive && !state.userSim) target = state.camEnergy[id] || 0;
      if (!state.cameraActive || state.userSim) target = Math.max(target, state.simEnergy[id] || 0);
      if ((state.pulseEnergy[id] || 0) > target) target = state.pulseEnergy[id];
      var prev = state.zoneEnergy[id] || 0;
      state.zoneEnergy[id] = prev + (target - prev) * 0.62;
      if (state.zoneEnergy[id] < 0.012) state.zoneEnergy[id] = 0;
      var hot = state.zoneEnergy[id] >= HIT_E;
      if (hot && !state.wasHot[id]) {
        state.moves++;
        state.sawMotion = true;
        if (state.mode === 'freestyle') state.kcal += 0.12;
        if (layoutCache && layoutCache.pads[id]) {
          var p = layoutCache.pads[id];
          burst(p.x, p.y, ZONE_META[id].color, 6);
        }
      }
      state.wasHot[id] = hot;
      if (state.pulseEnergy[id] > 0) state.pulseEnergy[id] = Math.max(0, state.pulseEnergy[id] - dt * 2.6);
    });
    if (state.mode === 'freestyle') {
      var avg = 0;
      ZONE_IDS.forEach(function (id) { avg += state.zoneEnergy[id]; });
      state.kcal += (avg / 6) * dt * 0.35;
    }
  }

  function burst(x, y, color, n) {
    for (var i = 0; i < n && sparks.length < 160; i++) {
      sparks.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 80,
        vy: -20 - Math.random() * 70,
        life: 0.35 + Math.random() * 0.35,
        color: color
      });
    }
  }

  /* ---------- scoring ---------- */
  function resolveRoutine(id) {
    var k = String(id == null ? '' : id).trim().toLowerCase().replace(/[_]+/g, ' ').replace(/\s+/g, ' ');
    var map = {
      '1': 'neon-pulse', 'neon': 'neon-pulse', 'neon pulse': 'neon-pulse', 'neon-pulse': 'neon-pulse', 'neonpulse': 'neon-pulse',
      '2': 'cyber-stage', 'cyber': 'cyber-stage', 'cyber stage': 'cyber-stage', 'cyber-stage': 'cyber-stage',
      '3': 'pro-choreo', 'pro': 'pro-choreo', 'pro choreo': 'pro-choreo', 'pro choreo challenge': 'pro-choreo', 'pro-choreo': 'pro-choreo',
      '4': 'freestyle', 'freestyle': 'freestyle', 'freestyle mirror': 'freestyle', 'mirror': 'freestyle'
    };
    if (map[k]) return map[k];
    var dashed = k.replace(/ /g, '-');
    return map[dashed] || 'neon-pulse';
  }
  function normZone(id) {
    var k = String(id == null ? '' : id).trim().toUpperCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
    if (ZONE_META[k]) return k;
    var alias = {
      'UP LEFT': 'UL', 'UPLEFT': 'UL', 'LEFT': 'UL',
      'UP RIGHT': 'UR', 'UPRIGHT': 'UR', 'RIGHT': 'UR',
      'MID LEFT': 'ML', 'MIDLEFT': 'ML',
      'MID RIGHT': 'MR', 'MIDRIGHT': 'MR',
      'LOW LEFT': 'LL', 'LOWLEFT': 'LL',
      'LOW RIGHT': 'LR', 'LOWRIGHT': 'LR',
      'HANDS': 'HANDS', 'HANDS UP': 'HANDS', 'HANDSUP': 'HANDS',
      'SPIN': 'SPIN', 'JUMP': 'SPIN', 'BURST': 'SPIN', 'SPIN / JUMP BURST': 'SPIN',
      'POSE': 'POSE', 'FREEZE': 'POSE', 'STRIKE': 'POSE'
    };
    return alias[k] || null;
  }
  function mult() {
    if (state.combo >= 12) return 8;
    if (state.combo >= 8) return 4;
    if (state.combo >= 4) return 2;
    return 1;
  }
  function judge(text) { state.judge = { text: text, at: performance.now() }; }
  function gradeFor(dt) {
    var a = Math.abs(dt);
    if (a <= 0.10) return 'PERFECT';
    if (a <= 0.18) return 'GREAT';
    if (a <= 0.30) return 'GOOD';
    return null;
  }
  function scoreCue(cueObj, grade) {
    if (!cueObj || cueObj.done || state.mode !== 'routine') return false;
    if (grade === 'MISS') {
      cueObj.done = true;
      cueObj.grade = 'MISS';
      state.combo = 0;
      state.fever = false;
      state.misses++;
      judge('MISS');
      maybeFinish();
      return true;
    }
    cueObj.done = true;
    cueObj.grade = grade;
    state.combo += 1;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    state.hits += 1;
    if (grade === 'PERFECT') state.perfects += 1;
    if (cueObj.kind === 'pose') state.poses += 1;
    var base = grade === 'PERFECT' ? 200 : grade === 'GREAT' ? 120 : 75;
    var m = mult();
    state.score += base * m;
    state.fever = m >= 8;
    judge(grade === 'PERFECT' ? 'PERFECT! (+200)' : grade === 'GREAT' ? 'GREAT! (+120)' : 'GOOD! (+75)');
    if (layoutCache) burst(layoutCache.center.x, layoutCache.center.y, m >= 8 ? '#ffe14d' : '#3ee6ff', 10);
    maybeFinish();
    return true;
  }
  function scoreNext(pred, grade) {
    for (var i = 0; i < state.cues.length; i++) {
      if (!state.cues[i].done && pred(state.cues[i])) return scoreCue(state.cues[i], grade);
    }
    return false;
  }
  function maybeFinish() {
    if (state.mode !== 'routine' || !state.cues.length) return;
    for (var i = 0; i < state.cues.length; i++) if (!state.cues[i].done) return;
    var total = state.cues.length;
    var acc = state.hits / total;
    var qual = state.perfects / total;
    var rank = 'B';
    if (acc >= 0.97 && qual >= 0.8) rank = 'S+';
    else if (acc >= 0.9) rank = 'S';
    else if (acc >= 0.75) rank = 'A';
    state.rank = rank;
    state.mode = 'results';
    persistStage();
    updateChrome();
  }
  function buildCues(def) {
    var beat = 60 / def.bpm;
    return def.cues.map(function (c, i) {
      return {
        i: i,
        t: (c.b - 1) * beat,
        kind: c.pose ? 'pose' : c.hands ? 'hands' : c.spin ? 'spin' : 'zone',
        zone: c.z || null,
        done: false,
        grade: null
      };
    });
  }
  function resetRun() {
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.hits = 0;
    state.poses = 0;
    state.perfects = 0;
    state.misses = 0;
    state.rank = '';
    state.fever = false;
    state.routineT = 0;
    state.poseHold = 0;
    state.sawMotion = false;
    state.moves = 0;
    state.kcal = 0;
    state.judge = null;
  }
  function setupChart(id) {
    var def = ROUTINES[id] || ROUTINES['neon-pulse'];
    resetRun();
    state.selected = def.id;
    state.routineId = def.id;
    state.intent = 'routine';
    state.cues = buildCues(def);
    state.mode = def.id === 'freestyle' ? 'freestyle' : 'routine';
    updateChrome();
  }
  function evaluate(dt) {
    if (state.mode !== 'routine') return;
    var t = state.routineT;
    var hotN = 0;
    ZONE_IDS.forEach(function (id) { if (state.zoneEnergy[id] >= HIT_E) hotN++; });
    var total = 0;
    ZONE_IDS.forEach(function (id) { total += state.zoneEnergy[id]; });
    total = total / 6;
    for (var i = 0; i < state.cues.length; i++) {
      var c = state.cues[i];
      if (c.done) continue;
      if (c.kind === 'zone') {
        if (Math.abs(t - c.t) <= 0.30 && state.zoneEnergy[c.zone] >= HIT_E) scoreCue(c, gradeFor(t - c.t) || 'GOOD');
        else if (t > c.t + 0.30) scoreCue(c, 'MISS');
      } else if (c.kind === 'hands') {
        if (Math.abs(t - c.t) <= 0.30 && state.zoneEnergy.UL >= HIT_E && state.zoneEnergy.UR >= HIT_E) scoreCue(c, gradeFor(t - c.t) || 'GOOD');
        else if (t > c.t + 0.30) scoreCue(c, 'MISS');
      } else if (c.kind === 'spin') {
        if (Math.abs(t - c.t) <= 0.30 && hotN >= 4) scoreCue(c, gradeFor(t - c.t) || 'GOOD');
        else if (t > c.t + 0.30) scoreCue(c, 'MISS');
      } else if (c.kind === 'pose') {
        if (t >= c.t && t <= c.t + 0.78) {
          if (total < STILL_E && (state.cameraActive || state.sawMotion)) state.poseHold += dt;
          else state.poseHold = 0;
          if (state.poseHold >= 0.6) {
            state.shutter = 1;
            scoreCue(c, 'PERFECT');
          }
        } else if (t > c.t + 0.78) scoreCue(c, 'MISS');
      }
    }
  }
  function pulseZone(id) {
    if (!ZONE_META[id]) return;
    state.pulseEnergy[id] = 1;
    state.simActive = true;
  }
  function pressZone(id) {
    pulseZone(id);
    state.zoneEnergy[id] = Math.max(state.zoneEnergy[id] || 0, 1);
    if (state.mode !== 'routine') return;
    var nowT = state.routineT;
    var hands = null, zoneCue = null;
    for (var i = 0; i < state.cues.length; i++) {
      var c = state.cues[i];
      if (c.done) continue;
      if (c.kind === 'zone' && c.zone === id && Math.abs(nowT - c.t) <= 0.30) zoneCue = c;
      if (c.kind === 'hands' && Math.abs(nowT - c.t) <= 0.30) hands = c;
    }
    if (hands && (id === 'UL' || id === 'UR')) {
      state.tapArm = state.tapArm || {};
      state.tapArm[id] = nowT;
      if (state.tapArm.UL != null && state.tapArm.UR != null && Math.abs(state.tapArm.UL - state.tapArm.UR) < 0.35) {
        scoreCue(hands, gradeFor(nowT - hands.t) || 'GOOD');
        return;
      }
    }
    if (zoneCue) scoreCue(zoneCue, gradeFor(nowT - zoneCue.t) || 'GOOD');
  }

  /* ---------- storage: stage ranks ---------- */
  function loadStage() {
    try {
      var raw = localStorage.getItem(LS_STAGE);
      if (raw) {
        var j = JSON.parse(raw);
        if (j && typeof j === 'object') return j;
      }
    } catch (e) {}
    return { v: 1, bestScores: {}, last: null };
  }
  function persistStage() {
    try {
      var data = loadStage();
      if (!data.bestScores || typeof data.bestScores !== 'object') data.bestScores = {};
      var rec = {
        score: state.score, rank: state.rank, maxCombo: state.maxCombo,
        hits: state.hits, poses: state.poses, at: Date.now()
      };
      var prev = data.bestScores[state.routineId];
      if (!prev || rec.score >= (prev.score || 0)) data.bestScores[state.routineId] = rec;
      data.last = { routineId: state.routineId, score: rec.score, rank: rec.rank, maxCombo: rec.maxCombo, hits: rec.hits, poses: rec.poses, at: rec.at };
      data.v = 1;
      localStorage.setItem(LS_STAGE, JSON.stringify(data));
      state.bestScores = data.bestScores;
    } catch (e) { fault(e); }
  }

  /* ---------- mo-cap ---------- */
  function sanitizePose(p, t) {
    p = p || {};
    var spin = (+p.spin >= 0.5) ? 1 : 0;
    var tt = t == null ? clamp(+p.t || 0, 0, 1) : clamp(+t, 0, 1);
    return {
      t: Math.round(tt * 10000) / 10000,
      armL: r3(clamp(+p.armL || 0, 0, 1)),
      armR: r3(clamp(+p.armR || 0, 0, 1)),
      legL: r3(clamp(+p.legL || 0, -1, 1)),
      legR: r3(clamp(+p.legR || 0, -1, 1)),
      sway: r3(clamp(+p.sway || 0, -1, 1)),
      bounce: r3(clamp(+p.bounce || 0, 0, 1)),
      spin: spin,
      energy: r3(clamp(+p.energy || 0, 0, 1))
    };
  }
  function poseFromZones(z, t) {
    z = z || emptyEnergy();
    var UL = +z.UL || 0, UR = +z.UR || 0, ML = +z.ML || 0, MR = +z.MR || 0, LL = +z.LL || 0, LR = +z.LR || 0;
    var armL = clamp(UL + ML * 0.5 * (1 - UL), 0, 1);
    var armR = clamp(UR + MR * 0.5 * (1 - UR), 0, 1);
    var legL = clamp(LL * 2 - 0.25, -1, 1);
    var legR = clamp(LR * 2 - 0.25, -1, 1);
    var left = (UL + ML + LL) / 3, right = (UR + MR + LR) / 3;
    var sway = clamp(right - left, -1, 1);
    var up = (UL + UR) / 2, low = (LL + LR) / 2;
    var bounce = clamp(0.5 + (up - low) * 0.55, 0, 1);
    var hot = 0;
    if (UL >= HIT_E) hot++; if (UR >= HIT_E) hot++; if (ML >= HIT_E) hot++;
    if (MR >= HIT_E) hot++; if (LL >= HIT_E) hot++; if (LR >= HIT_E) hot++;
    var energy = (UL + UR + ML + MR + LL + LR) / 6;
    return sanitizePose({ armL: armL, armR: armR, legL: legL, legR: legR, sway: sway, bounce: bounce, spin: hot >= 4 ? 1 : 0, energy: energy }, t);
  }
  function styleFor(name) {
    var s = String(name || '').toLowerCase();
    if (s.indexOf('kick') >= 0 || s.indexOf('leg') >= 0) return 'kicks';
    if (s.indexOf('spin') >= 0) return 'spin';
    if (s.indexOf('hand') >= 0) return 'hands';
    if (s.indexOf('wave') >= 0) return 'wave';
    return 'groove';
  }
  function presetPose(style, t) {
    var a = t * Math.PI * 2;
    var armL = 0.2, armR = 0.2, legL = -0.15, legR = -0.15, sway = 0, bounce = 0.4, spin = 0;
    if (style === 'hands') {
      armL = 0.92; armR = 0.92;
      sway = Math.sin(a * 2) * 0.35;
      bounce = clamp(0.72 + 0.28 * Math.sin(a * 4), 0, 1);
      legL = Math.sin(a * 2) * 0.35;
      legR = Math.sin(a * 2 + Math.PI) * 0.35;
      spin = (t > 0.72 && t < 0.84) ? 1 : 0;
    } else if (style === 'kicks') {
      armL = 0.38; armR = 0.42;
      legL = Math.sin(a * 2);
      legR = Math.sin(a * 2 + Math.PI);
      sway = Math.sin(a) * 0.4;
      bounce = 0.35 + 0.25 * Math.abs(Math.sin(a * 2));
      spin = 0;
    } else if (style === 'spin') {
      armL = clamp(0.55 + 0.4 * Math.sin(a * 2), 0, 1);
      armR = clamp(0.55 + 0.4 * Math.cos(a * 2), 0, 1);
      legL = Math.sin(a) * 0.5;
      legR = Math.cos(a) * 0.5;
      sway = Math.sin(a * 2) * 0.85;
      bounce = 0.6;
      spin = Math.sin(a * 2) > 0 ? 1 : 0;
    } else if (style === 'wave') {
      var sweep = 0.5 + 0.5 * Math.sin(a * 2);
      armL = sweep;
      armR = 1 - sweep;
      legL = Math.sin(a * 2) * 0.45;
      legR = Math.sin(a * 2 + 1) * 0.45;
      sway = Math.sin(a * 2);
      bounce = 0.4 + 0.35 * Math.abs(Math.sin(a * 4));
      spin = (t > 0.9) ? 1 : 0;
    } else {
      armL = clamp(0.5 + 0.5 * Math.sin(a * 2), 0, 1);
      armR = clamp(0.5 + 0.5 * Math.sin(a * 2 + Math.PI), 0, 1);
      legL = Math.sin(a * 2);
      legR = Math.sin(a * 2 + Math.PI);
      sway = Math.sin(a);
      bounce = clamp(0.4 + 0.55 * Math.abs(Math.sin(a * 4)), 0, 1);
      spin = (t > 0.46 && t < 0.54) || t > 0.93 ? 1 : 0;
    }
    var energy = clamp((armL + armR + Math.abs(legL) + Math.abs(legR)) / 4, 0, 1);
    return { armL: armL, armR: armR, legL: legL, legR: legR, sway: sway, bounce: bounce, spin: spin, energy: energy };
  }
  function toEighty(frames) {
    var src = Array.isArray(frames) ? frames : [];
    var out = [];
    for (var i = 0; i < 80; i++) {
      var t = i === 0 ? 0 : i === 79 ? 1 : i / 79;
      var srcP;
      if (src.length === 80) srcP = src[i];
      else if (src.length > 1) srcP = src[Math.round(i * (src.length - 1) / 79)];
      else if (src.length === 1) srcP = src[0];
      else srcP = presetPose('groove', t);
      var pose = sanitizePose(srcP, t);
      pose.t = i === 0 ? 0 : i === 79 ? 1 : Math.round((i / 79) * 10000) / 10000;
      out.push(pose);
    }
    return out;
  }
  function blankStore() {
    return { version: 1, activeSlot: 0, enabled: false, slots: [null, null, null] };
  }
  function normalizeStore(j) {
    var s = blankStore();
    if (!j || typeof j !== 'object') return s;
    s.version = 1;
    s.activeSlot = clamp(j.activeSlot | 0, 0, 2) | 0;
    var slots = Array.isArray(j.slots) ? j.slots : [];
    var any = false;
    for (var i = 0; i < 3; i++) {
      var slot = slots[i];
      if (!slot || !slot.frames) { s.slots[i] = null; continue; }
      var frames = toEighty(slot.frames);
      s.slots[i] = {
        name: String(slot.name || ('ELLIE MO-CAP #' + (i + 1))).slice(0, 48),
        bpm: 120,
        duration: 8,
        updatedAt: +slot.updatedAt || Date.now(),
        frames: frames
      };
      any = true;
    }
    s.enabled = any ? (j.enabled !== false) : false;
    return s;
  }
  function readStore() {
    if (storeCache) return storeCache;
    try {
      var raw = localStorage.getItem(LS_DANCE);
      if (raw) storeCache = normalizeStore(JSON.parse(raw));
      else storeCache = blankStore();
    } catch (e) { storeCache = blankStore(); }
    return storeCache;
  }
  function danceChannel() {
    if (danceCh) return danceCh;
    try { danceCh = new BroadcastChannel(CH_NAME); } catch (e) { danceCh = null; }
    return danceCh;
  }
  function writeStore(store) {
    storeCache = normalizeStore(store);
    try { localStorage.setItem(LS_DANCE, JSON.stringify(storeCache)); } catch (e) { fault(e); }
    try {
      var ch = danceChannel();
      if (ch) ch.postMessage(JSON.parse(JSON.stringify(storeCache)));
    } catch (e) {}
    refreshSlotLabels();
    return storeCache;
  }
  function poseAt(frames, tSec) {
    if (!frames || !frames.length) return poseFromZones(emptyEnergy(), 0);
    var u = (tSec % 8) / 8;
    if (u < 0) u += 1;
    var i = 0;
    for (var k = 0; k < frames.length - 1; k++) {
      if (frames[k].t <= u && frames[k + 1].t >= u) { i = k; break; }
      i = k;
    }
    var a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
    var span = (b.t - a.t) || 1;
    var f = clamp((u - a.t) / span, 0, 1);
    return {
      t: u,
      armL: a.armL + (b.armL - a.armL) * f,
      armR: a.armR + (b.armR - a.armR) * f,
      legL: a.legL + (b.legL - a.legL) * f,
      legR: a.legR + (b.legR - a.legR) * f,
      sway: a.sway + (b.sway - a.sway) * f,
      bounce: a.bounce + (b.bounce - a.bounce) * f,
      spin: (f < 0.5 ? a.spin : b.spin) ? 1 : 0,
      energy: a.energy + (b.energy - a.energy) * f
    };
  }

  /* ---------- pet mo-cap ---------- */
  function num(v, d) { v = +v; return v === v ? v : d; }
  function sanitizePet(p, t) {
    p = p || {};
    var tt = t == null ? clamp(num(p.t, 0), 0, 1) : clamp(+t, 0, 1);
    return {
      t: Math.round(tt * 10000) / 10000,
      hop: r3(clamp(num(p.hop, 0), 0, 1)),
      wag: r3(clamp(num(p.wag, 0), -1, 1)),
      pawL: r3(clamp(num(p.pawL, 0), 0, 1)),
      pawR: r3(clamp(num(p.pawR, 0), 0, 1)),
      bow: r3(clamp(num(p.bow, 0), 0, 1)),
      spin: num(p.spin, 0) >= 0.5 ? 1 : 0,
      sway: r3(clamp(num(p.sway, 0), -1, 1))
    };
  }
  function petPoseFromZones(z, t) {
    z = z || emptyEnergy();
    var UL = +z.UL || 0, UR = +z.UR || 0, ML = +z.ML || 0, MR = +z.MR || 0, LL = +z.LL || 0, LR = +z.LR || 0;
    var hop = clamp((UL + UR + ML + MR) / 4, 0, 1);
    var energy = (UL + UR + ML + MR + LL + LR) / 6;
    var wag = clamp(Math.sin((+t || 0) * Math.PI * 16) * Math.min(1, energy * 1.35), -1, 1);
    var pawL = clamp(ML * 0.65 + LL * 0.55, 0, 1);
    var pawR = clamp(MR * 0.65 + LR * 0.55, 0, 1);
    var up = (UL + UR) / 2;
    var low = (LL + LR) / 2;
    var bow = clamp((low - up) * 1.25, 0, 1);
    var hot = 0;
    if (UL >= HIT_E) hot++; if (UR >= HIT_E) hot++; if (ML >= HIT_E) hot++;
    if (MR >= HIT_E) hot++; if (LL >= HIT_E) hot++; if (LR >= HIT_E) hot++;
    var left = (UL + ML + LL) / 3, right = (UR + MR + LR) / 3;
    var sway = clamp(right - left, -1, 1);
    return sanitizePet({ hop: hop, wag: wag, pawL: pawL, pawR: pawR, bow: bow, spin: hot >= 4 ? 1 : 0, sway: sway }, t);
  }
  function petStyle(name) {
    var s = String(name || '').toLowerCase();
    if (s.indexOf('spin') >= 0) return 'spin';
    if (s.indexOf('bow') >= 0) return 'bow';
    if (s.indexOf('paw') >= 0) return 'paw';
    if (s.indexOf('hop') >= 0) return 'hop';
    return 'wiggle';
  }
  function petPreset(style, t) {
    var a = t * Math.PI * 2;
    var hop = 0.25, wag = Math.sin(a * 8), pawL = 0.15, pawR = 0.15, bow = 0.05, spin = 0, sway = Math.sin(a) * 0.35;
    if (style === 'hop') {
      hop = clamp(0.45 + 0.55 * Math.abs(Math.sin(a * 3)), 0, 1);
      wag = Math.sin(a * 8);
      pawL = 0.25; pawR = 0.25; bow = 0.05;
      sway = Math.sin(a) * 0.3;
      spin = t > 0.9 ? 1 : 0;
    } else if (style === 'bow') {
      bow = clamp(0.3 + 0.7 * Math.abs(Math.sin(a * 2)), 0, 1);
      hop = 0.12;
      wag = Math.sin(a * 6) * 0.75;
      pawL = 0.6; pawR = 0.6;
      sway = Math.sin(a) * 0.2;
      spin = 0;
    } else if (style === 'paw') {
      pawL = clamp(0.5 + 0.5 * Math.sin(a * 4), 0, 1);
      pawR = clamp(0.5 + 0.5 * Math.sin(a * 4 + Math.PI), 0, 1);
      hop = 0.22 + 0.2 * Math.abs(Math.sin(a * 2));
      wag = Math.sin(a * 10);
      bow = 0.12;
      spin = t > 0.94 ? 1 : 0;
    } else if (style === 'spin') {
      spin = Math.sin(a * 2) > 0 ? 1 : 0;
      hop = 0.58;
      wag = Math.sin(a * 8);
      pawL = 0.42; pawR = 0.42;
      bow = 0.16;
      sway = Math.sin(a * 2) * 0.8;
    } else {
      hop = clamp(0.3 + 0.6 * Math.abs(Math.sin(a * 3)), 0, 1);
      wag = Math.sin(a * 8);
      pawL = clamp(0.15 + 0.8 * Math.max(0, Math.sin(a * 4)), 0, 1);
      pawR = clamp(0.15 + 0.8 * Math.max(0, Math.sin(a * 4 + Math.PI)), 0, 1);
      bow = (t > 0.22 && t < 0.38) ? 0.88 : 0.06;
      spin = (t > 0.55 && t < 0.7) || t > 0.92 ? 1 : 0;
      sway = Math.sin(a);
    }
    return { hop: hop, wag: wag, pawL: pawL, pawR: pawR, bow: bow, spin: spin, sway: sway };
  }
  function petIndexT(i) {
    if (i <= 0) return 0;
    if (i >= 59) return 1;
    return Math.round((i / 59) * 10000) / 10000;
  }
  function toSixty(frames) {
    var src = Array.isArray(frames) ? frames : [];
    var out = [];
    for (var i = 0; i < 60; i++) {
      var t = i === 0 ? 0 : i === 59 ? 1 : i / 59;
      var srcP;
      if (src.length === 60) srcP = src[i];
      else if (src.length > 1) srcP = src[Math.round(i * (src.length - 1) / 59)];
      else if (src.length === 1) srcP = src[0];
      else srcP = petPreset('wiggle', t);
      var pose = sanitizePet(srcP, t);
      pose.t = petIndexT(i);
      out.push(pose);
    }
    return out;
  }
  function blankPetStore() {
    return { version: 1, activeSlot: 0, enabled: false, slots: [null, null, null] };
  }
  function normalizePetStore(j) {
    var s = blankPetStore();
    if (!j || typeof j !== 'object') return s;
    s.version = 1;
    s.activeSlot = clamp(j.activeSlot | 0, 0, 2) | 0;
    var slots = Array.isArray(j.slots) ? j.slots : [];
    var any = false;
    for (var i = 0; i < 3; i++) {
      var slot = slots[i];
      if (!slot || !slot.frames) { s.slots[i] = null; continue; }
      s.slots[i] = {
        name: String(slot.name || ('CYBER PUP #' + (i + 1))).slice(0, 48),
        duration: 6,
        updatedAt: +slot.updatedAt || Date.now(),
        frames: toSixty(slot.frames)
      };
      any = true;
    }
    s.enabled = any ? (j.enabled !== false) : false;
    return s;
  }
  function readPetStore() {
    if (petCache) return petCache;
    try {
      var raw = localStorage.getItem(LS_PET);
      petCache = raw ? normalizePetStore(JSON.parse(raw)) : blankPetStore();
    } catch (e) { petCache = blankPetStore(); }
    return petCache;
  }
  function petChannel() {
    if (petCh) return petCh;
    try { petCh = new BroadcastChannel(CH_PET); } catch (e) { petCh = null; }
    return petCh;
  }
  function writePetStore(store) {
    petCache = normalizePetStore(store);
    try { localStorage.setItem(LS_PET, JSON.stringify(petCache)); } catch (e) { fault(e); }
    try {
      var ch = petChannel();
      if (ch) ch.postMessage(JSON.parse(JSON.stringify(petCache)));
    } catch (e) {}
    refreshSlotLabels();
    return petCache;
  }
  function savePetDance(slotIdx, name, frames) {
    var store = readPetStore();
    var idx = clamp(slotIdx | 0, 0, 2) | 0;
    var nm = String(name || state.petName || ('CYBER PUP #' + (idx + 1))).slice(0, 48);
    var sixty = toSixty(frames && frames.length ? frames : state.petFrames);
    store.slots[idx] = { name: nm, duration: 6, updatedAt: Date.now(), frames: sixty };
    store.activeSlot = idx;
    store.enabled = true;
    state.petName = nm;
    state.petFrames = sixty;
    writePetStore(store);
    return JSON.parse(JSON.stringify(petCache));
  }
  function petPoseAt(frames, tSec) {
    if (!frames || !frames.length) return petPoseFromZones(emptyEnergy(), 0);
    var u = (tSec % 6) / 6;
    if (u < 0) u += 1;
    var i = 0;
    for (var k = 0; k < frames.length - 1; k++) {
      if (frames[k].t <= u && frames[k + 1].t >= u) { i = k; break; }
      i = k;
    }
    var a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
    var span = (b.t - a.t) || 1;
    var f = clamp((u - a.t) / span, 0, 1);
    return sanitizePet({
      t: u,
      hop: a.hop + (b.hop - a.hop) * f,
      wag: a.wag + (b.wag - a.wag) * f,
      pawL: a.pawL + (b.pawL - a.pawL) * f,
      pawR: a.pawR + (b.pawR - a.pawR) * f,
      bow: a.bow + (b.bow - a.bow) * f,
      spin: (f < 0.5 ? a.spin : b.spin) ? 1 : 0,
      sway: a.sway + (b.sway - a.sway) * f
    }, u);
  }
  function livePetPose(now) {
    if (state.mode === 'petplay' && state.petFrames.length) return petPoseAt(state.petFrames, state.playT);
    if (state.mode === 'petrec') return petPoseFromZones(state.zoneEnergy, clamp(state.recordT / 6, 0, 1));
    var t = ((now / 1000) % 6) / 6;
    return sanitizePet(petPreset('wiggle', t), t);
  }
  function beginPetRecording() {
    state.mode = 'petrec';
    state.routineId = 'pet';
    state.intent = 'pet';
    state.countKind = 'pet';
    state.recordT = 0;
    state.petFrames = [];
    state.countGo = 0;
    updateChrome();
  }
  function finishPetRecording() {
    var name = state.petName || 'CYBER PUP #1';
    var store = readPetStore();
    var idx = store.activeSlot || 0;
    if (!state.petFrames.length) state.petFrames = toSixty([]);
    savePetDance(idx, name, state.petFrames);
    state.mode = 'petplay';
    state.playT = 0;
    updateChrome();
  }
  function stepPetRecording(dt) {
    state.recordT += dt;
    while (state.petFrames.length < 60 && state.recordT + 1e-4 >= state.petFrames.length * 0.1) {
      var i = state.petFrames.length;
      var t = i === 0 ? 0 : i === 59 ? 1 : i / 59;
      state.petFrames.push(petPoseFromZones(state.zoneEnergy, t));
    }
    if (state.petFrames.length >= 60 || state.recordT >= 6) finishPetRecording();
  }
  function enterPet() {
    if (!state.open) api.open({});
    state.intent = 'pet';
    state.routineId = 'pet';
    state.countKind = 'pet';
    var store = readPetStore();
    var slot = store.slots[store.activeSlot] || null;
    if (slot && slot.frames && slot.frames.length) {
      state.petFrames = slot.frames;
      state.petName = slot.name;
      state.mode = 'petplay';
      if (!state.playT) state.playT = 0;
    } else state.mode = 'pet';
    updateChrome();
  }
  function onDogClick() {
    if (isPetish() && (state.mode === 'pet' || state.mode === 'petplay')) {
      api.recordPetDance();
      return;
    }
    enterPet();
  }
  function selectPetSlot(idx) {
    var store = readPetStore();
    store.activeSlot = idx;
    var slot = store.slots[idx];
    if (slot && slot.name) state.petName = slot.name;
    else state.petName = 'CYBER PUP #' + (idx + 1);
    writePetStore(store);
    state.intent = 'pet';
    state.routineId = 'pet';
    state.countKind = 'pet';
    if (slot && slot.frames && slot.frames.length) {
      state.petFrames = slot.frames;
      state.mode = 'petplay';
      state.playT = 0;
    } else {
      state.petFrames = [];
      state.mode = 'pet';
    }
    updateChrome();
  }

  function beginRecording() {
    state.mode = 'recording';
    state.routineId = 'mocap';
    state.intent = 'record';
    state.recordT = 0;
    state.moFrames = [];
    state.countGo = 0;
    updateChrome();
  }
  function finishRecording() {
    var name = state.slotName || 'ELLIE MO-CAP #1';
    var store = readStore();
    var idx = store.activeSlot || 0;
    if (!state.moFrames.length) state.moFrames = toEighty([]);
    api.saveCustomDance(idx, name, state.moFrames);
    state.mode = 'playback';
    state.playT = 0;
    updateChrome();
  }
  function stepRecording(dt) {
    state.recordT += dt;
    while (state.moFrames.length < 80 && state.recordT + 1e-4 >= state.moFrames.length * 0.1) {
      var i = state.moFrames.length;
      var t = i === 0 ? 0 : i === 79 ? 1 : i / 79;
      state.moFrames.push(poseFromZones(state.zoneEnergy, t));
    }
    if (state.moFrames.length >= 80 || state.recordT >= 8) finishRecording();
  }
  function enterMocap() {
    if (!state.open) api.open({});
    state.intent = 'record';
    state.routineId = 'mocap';
    state.countKind = 'record';
    var store = readStore();
    var slot = store.slots[store.activeSlot] || null;
    if (slot && slot.frames && slot.frames.length) {
      state.moFrames = slot.frames;
      state.slotName = slot.name;
      state.mode = 'playback';
      if (!state.playT) state.playT = 0;
    } else state.mode = 'mocap';
    updateChrome();
  }
  function selectSlot(idx) {
    if (isPetish() || state.intent === 'pet') return selectPetSlot(idx);
    var store = readStore();
    store.activeSlot = idx;
    var slot = store.slots[idx];
    if (slot && slot.name) state.slotName = slot.name;
    else state.slotName = 'ELLIE MO-CAP #' + (idx + 1);
    writeStore(store);
    if (slot && slot.frames && slot.frames.length) {
      state.moFrames = slot.frames;
      state.mode = 'playback';
      state.playT = 0;
      state.intent = 'record';
      state.routineId = 'mocap';
    }
    updateChrome();
  }
  function propCountdown() {
    if (!state.open) api.open({});
    var pet = isPetish() || state.intent === 'pet';
    state.countKind = pet ? 'pet' : (state.intent === 'record' || state.mode === 'mocap' || state.mode === 'playback' || state.mode === 'recording') ? 'record' : 'routine';
    if (state.countKind === 'pet') state.routineId = 'pet';
    else if (state.countKind === 'record') state.routineId = 'mocap';
    state.mode = 'countdown';
    state.countLeft = 5;
    state.countGo = 0;
    state.waveHold = 0;
    updateChrome();
  }
  function beginAfterCount() {
    if (state.countKind === 'pet') beginPetRecording();
    else if (state.countKind === 'record') beginRecording();
    else api.startRoutine(state.selected || 'neon-pulse');
  }

  function livePose(now) {
    if (state.mode === 'playback' && state.moFrames.length) return poseAt(state.moFrames, state.playT);
    if (state.mode === 'recording') return poseFromZones(state.zoneEnergy, clamp(state.recordT / 8, 0, 1));
    if (state.mode === 'mocap') return sanitizePose(presetPose('groove', ((now / 1000) % 8) / 8), ((now / 1000) % 8) / 8);
    if (state.mode === 'routine' || state.mode === 'freestyle') return chartPose(now);
    return sanitizePose(presetPose('groove', ((now / 1000) % 8) / 8), 0);
  }
  function chartPose(now) {
    var t = state.routineT;
    var bpm = currentBpm();
    var pose = sanitizePose({ armL: 0.18, armR: 0.18, legL: -0.1, legR: -0.1, sway: Math.sin(now / 280) * 0.2, bounce: 0.38 + Math.abs(Math.sin(t * Math.PI * 2 * (bpm / 60))) * 0.18, spin: 0, energy: 0.2 }, 0);
    if (state.mode === 'freestyle') return poseFromZones(state.zoneEnergy, 0);
    var best = null, bestDt = 1e9;
    for (var i = 0; i < state.cues.length; i++) {
      var dt = state.cues[i].t - t;
      if (dt < -0.28) continue;
      if (dt < bestDt) { bestDt = dt; best = state.cues[i]; }
    }
    if (!best) return pose;
    var k = clamp(1 - Math.max(0, bestDt) / 0.85, 0.25, 1);
    if (best.kind === 'zone') {
      if (best.zone === 'UL') pose.armL = k;
      if (best.zone === 'UR') pose.armR = k;
      if (best.zone === 'ML') pose.armL = 0.5 * k;
      if (best.zone === 'MR') pose.armR = 0.5 * k;
      if (best.zone === 'LL') pose.legL = k;
      if (best.zone === 'LR') pose.legR = k;
    } else if (best.kind === 'hands') { pose.armL = 1; pose.armR = 1; pose.bounce = 0.92; }
    else if (best.kind === 'spin') pose.spin = 1;
    else if (best.kind === 'pose') { pose.armL = 1; pose.armR = 0.42; pose.legL = 0.25; pose.legR = -0.35; pose.bounce = 0.28; }
    pose.energy = k;
    return pose;
  }

  /* ---------- input ---------- */
  var drag = false, hitOnce = {};
  function canvasPos(e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function hitTest(x, y) {
    if (!layoutCache) return null;
    var best = null, bd = 1e9;
    ZONE_IDS.forEach(function (id) {
      var p = layoutCache.pads[id];
      var d = Math.hypot(x - p.x, y - p.y);
      if (d <= p.r + 10 && d < bd) { bd = d; best = id; }
    });
    if (state.mode === 'routine') {
      var poseOpen = false;
      for (var i = 0; i < state.cues.length; i++) {
        var c = state.cues[i];
        if (!c.done && c.kind === 'pose' && state.routineT >= c.t - 0.05 && state.routineT <= c.t + 0.78) poseOpen = true;
      }
      if (poseOpen) {
        var c0 = layoutCache.center;
        if (Math.hypot(x - c0.x, y - c0.y) < 36) return 'FREEZE';
      }
    }
    return best;
  }
  function onDown(e) {
    drag = true;
    hitOnce = {};
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    poke(e);
  }
  function onMove(e) { if (drag) poke(e); }
  function onUp() { drag = false; hitOnce = {}; }
  function poke(e) {
    var p = canvasPos(e);
    var id = hitTest(p.x, p.y);
    if (!id || hitOnce[id]) return;
    hitOnce[id] = 1;
    if (id === 'FREEZE') api.simulateFreezePose();
    else pressZone(id);
  }
  function onBack() {
    var world = inWorld();
    api.close();
    if (!world) {
      try { location.href = 'world-split.html'; } catch (e) {}
    }
  }
  function awardReturn() {
    if (rewarded) return;
    if (typeof P === 'undefined' || !P) return;
    rewarded = true;
    try {
      P.nosTank = 1;
      if (window.HOTDROP) HOTDROP.overchargeT = Math.max(15, +HOTDROP.overchargeT || 0);
      if (typeof wMsg === 'function') wMsg('OVERCHARGED NOS + STAGE HYPE', '#ffe14d', 'Z COMPANY ARTS · 15s unlimited NOS');
      else if (typeof toast === 'function') toast('OVERCHARGED NOS + STAGE HYPE');
    } catch (e) {}
  }
  function wrapInput() {
    var fn = window.input;
    if (typeof fn !== 'function' || fn._dsWrapped) return;
    function wrapped() {
      var i = fn();
      if (api.isOpen()) return { hard: 0, lr: 0, climb: 0, nos: 0, brk: 0, eb: 0, tu: 0 };
      return i;
    }
    wrapped._dsWrapped = 1;
    try { window.input = wrapped; } catch (e) {}
  }
  function blobOf(b) {
    var parts = [];
    function grab(o, depth) {
      if (!o || depth > 3 || typeof o !== 'object') return;
      ['kind', 'type', 'sign', 'label', 'name', 'title', 'use', 'tag', 'venue', 'studio', 'word', 't'].forEach(function (k) {
        if (o[k] != null && typeof o[k] !== 'object') parts.push(String(o[k]));
      });
      if (o.p) grab(o.p, depth + 1);
      if (o.sign && typeof o.sign === 'object' && o.sign.t) parts.push(String(o.sign.t));
      if (Array.isArray(o.deco)) o.deco.forEach(function (d) {
        if (d && d[0] === 'sign' && d[1] && d[1].t) parts.push(String(d[1].t));
      });
    }
    grab(b, 0);
    return parts.join(' | ');
  }
  function isDanceBuilding(b) {
    if (!b || typeof b !== 'object') return false;
    if (b.dance === true || b.danceStage === true) return true;
    var kind = String(b.kind || b.type || b.use || b.studio || (b.p && (b.p.kind || b.p.type || b.p.use)) || '').toUpperCase();
    if (kind === 'DANCE' || kind === 'DANCE_STAGE' || kind === 'DANCESTAGE') return true;
    var blob = blobOf(b);
    if (/ellie/i.test(blob) && /dance/i.test(blob)) return true;
    if (/dance\s*stage/i.test(blob)) return true;
    if (/z\s*company\s*arts/i.test(blob)) return true;
    return false;
  }
  function resolveBuilding(b) {
    if (!b) return null;
    var id = b.buildingId != null ? b.buildingId : null;
    var list = (typeof CITY !== 'undefined' && CITY && CITY.BL) ? CITY.BL : null;
    if (list && id != null) {
      for (var i = 0; i < list.length; i++) if (list[i] && (list[i].id === id || list[i].oid === id)) return list[i];
    }
    return b;
  }
  function hookWalk() {
    var WM = window.WALK_MODE;
    if (!WM || typeof WM !== 'object') return;
    if (typeof WM.enterDoor === 'function' && WM.enterDoor._ds) return;
    var prev = (typeof WM.enterDoor === 'function') ? WM.enterDoor : null;
    function enterDoor(b) {
      try {
        var target = resolveBuilding(b);
        if (isDanceBuilding(target) || isDanceBuilding(b)) {
          api.open(target || b || {});
          return true;
        }
      } catch (e) {}
      if (prev) return prev.call(WM, b);
      return false;
    }
    enterDoor._ds = 1;
    WM.enterDoor = enterDoor;
  }

  /* ---------- draw ---------- */
  function roundRect(x, y, w, h, r) {
    var rr = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }
  function drawFigure(cx, cy, sc, pose, now, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.translate(cx + pose.sway * 20 * sc, cy - (pose.bounce - 0.35) * 34 * sc);
    ctx.rotate(pose.sway * 0.16 + (pose.spin ? Math.sin(now / 110) * 0.55 : 0));
    if (pose.spin) {
      ctx.strokeStyle = 'rgba(255,225,77,.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -8 * sc, 46 * sc, now / 200, now / 200 + 1.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -8 * sc, 34 * sc, -now / 160, -now / 160 + 1.1);
      ctx.stroke();
    }
    function limb(x0, y0, x1, y1, col, w) {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.shadowColor = col;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x1, y1, Math.max(2, w * 0.45), 0, 6.3);
      ctx.fill();
    }
    function arm(dir, amt, col) {
      var theta = clamp(amt, 0, 1) * Math.PI;
      var x0 = dir * 14 * sc, y0 = -28 * sc;
      var len = 46 * sc;
      var x1 = x0 + dir * Math.sin(theta) * len;
      var y1 = y0 + Math.cos(theta) * len;
      var mx = (x0 + x1) / 2 + dir * 7 * sc * Math.sin(theta + 0.5);
      var my = (y0 + y1) / 2 + 4 * sc;
      limb(x0, y0, mx, my, col, 4.2 * sc);
      limb(mx, my, x1, y1, col, 3.2 * sc);
    }
    function leg(dir, kick, col) {
      var x0 = dir * 8 * sc, y0 = 8 * sc;
      var x1 = x0 + dir * 6 * sc + kick * 22 * sc;
      var y1 = y0 + 42 * sc - Math.max(0, kick) * 18 * sc;
      var mx = (x0 + x1) / 2 + dir * 4 * sc;
      var my = (y0 + y1) / 2 + 2 * sc;
      limb(x0, y0, mx, my, col, 4.4 * sc);
      limb(mx, my, x1, y1, col, 3.3 * sc);
    }
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath();
    ctx.ellipse(0, 52 * sc, 26 * sc, 7 * sc, 0, 0, 6.3);
    ctx.fill();
    ctx.strokeStyle = '#d7c4ff';
    ctx.lineWidth = 6 * sc;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#b45cff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -34 * sc);
    ctx.lineTo(0, 10 * sc);
    ctx.stroke();
    ctx.shadowBlur = 0;
    arm(-1, pose.armL, '#3ee6ff');
    arm(1, pose.armR, '#ff4fd8');
    leg(-1, pose.legL, '#7dff6b');
    leg(1, pose.legR, '#ffe14d');
    ctx.fillStyle = '#12051c';
    ctx.strokeStyle = '#3ee6ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -50 * sc, 14 * sc, 0, 6.3);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ff4fd8';
    ctx.beginPath();
    ctx.moveTo(-6 * sc, -50 * sc);
    ctx.lineTo(6 * sc, -50 * sc);
    ctx.stroke();
    ctx.fillStyle = '#ffe14d';
    ctx.font = '800 ' + Math.max(8, 11 * sc) + 'px Orbitron,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Z', 0, -6 * sc);
    ctx.restore();
  }
  function drawPup(cx, cy, sc, pose, now, alpha) {
    pose = pose || {};
    var hop = pose.hop || 0;
    var wag = pose.wag || 0;
    var bow = pose.bow || 0;
    var sway = pose.sway || 0;
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.translate(cx + sway * 26 * sc, cy - hop * 40 * sc);
    ctx.rotate((pose.spin ? Math.sin(now / 80) * 0.9 : 0) + bow * 0.42);
    if (pose.spin) {
      ctx.strokeStyle = 'rgba(255,225,77,.9)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffe14d';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(4 * sc, -8 * sc, 46 * sc, now / 170, now / 170 + 1.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4 * sc, -8 * sc, 34 * sc, -now / 140, -now / 140 + 1.15);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'rgba(0,0,0,.38)';
    ctx.beginPath();
    ctx.ellipse(0, 30 * sc, 34 * sc, 7 * sc, 0, 0, 6.3);
    ctx.fill();
    ctx.strokeStyle = '#ff4fd8';
    ctx.lineWidth = Math.max(2, 4 * sc);
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff4fd8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-28 * sc, -2 * sc);
    ctx.quadraticCurveTo(-44 * sc, (-18 + wag * 22) * sc, -36 * sc, (-24 + wag * 16) * sc);
    ctx.stroke();
    ctx.shadowBlur = 0;
    function stub(x, lift, col) {
      ctx.strokeStyle = col;
      ctx.lineWidth = Math.max(2, 3.2 * sc);
      ctx.lineCap = 'round';
      ctx.shadowColor = col;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(x * sc, 8 * sc);
      ctx.lineTo((x + (lift > 0 ? 2 : 0)) * sc, (22 - lift) * sc);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc((x + (lift > 0 ? 2 : 0)) * sc, (22 - lift) * sc, Math.max(1.6, 2.3 * sc), 0, 6.3);
      ctx.fill();
    }
    stub(-16, 0, '#7dff6b');
    stub(-6, 0, '#7dff6b');
    stub(12, (pose.pawL || 0) * 16, '#3ee6ff');
    stub(22, (pose.pawR || 0) * 16, '#ffe14d');
    ctx.fillStyle = '#140818';
    ctx.strokeStyle = '#3ee6ff';
    ctx.lineWidth = Math.max(1.6, 2.4 * sc);
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(-2 * sc, 2 * sc, 30 * sc, 15 * sc, bow * -0.2, 0, 6.3);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(24 * sc, -12 * sc, 12 * sc, 0, 6.3);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff4fd8';
    ctx.beginPath();
    ctx.moveTo(16 * sc, -20 * sc);
    ctx.lineTo(12 * sc, -34 * sc);
    ctx.lineTo(24 * sc, -22 * sc);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(28 * sc, -22 * sc);
    ctx.lineTo(34 * sc, -36 * sc);
    ctx.lineTo(38 * sc, -18 * sc);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffe14d';
    ctx.beginPath();
    ctx.ellipse(34 * sc, -8 * sc, 6.5 * sc, 4 * sc, 0.2, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = '#12051c';
    ctx.beginPath();
    ctx.arc(37 * sc, -8 * sc, 1.5 * sc, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = '#7dff6b';
    ctx.shadowColor = '#7dff6b';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(28 * sc, -14 * sc, Math.max(1.4, 2 * sc), 0, 6.3);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffe14d';
    ctx.font = '800 ' + Math.max(8, 10 * sc) + 'px Orbitron,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Z', -2 * sc, 2 * sc);
    ctx.restore();
  }
  function drawStage(L, now) {
    var S = L.stage;
    ctx.save();
    ctx.beginPath();
    ctx.rect(S.x, S.y, S.w, S.h);
    ctx.clip();
    var g = ctx.createLinearGradient(0, 0, 0, S.h);
    g.addColorStop(0, '#14061f');
    g.addColorStop(0.45, '#07010f');
    g.addColorStop(1, '#050208');
    ctx.fillStyle = g;
    ctx.fillRect(S.x, S.y, S.w, S.h);
    if (state.cameraActive && video && video.readyState >= 2) {
      ctx.save();
      ctx.translate(S.x + S.w, S.y);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, S.w, S.h);
      ctx.restore();
      ctx.fillStyle = 'rgba(5,0,16,.38)';
      ctx.fillRect(S.x, S.y, S.w, S.h);
      if (state.motionReady && mcan) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.9;
        ctx.drawImage(mcan, S.x, S.y, S.w, S.h);
        ctx.restore();
      }
    } else {
      var rg = ctx.createRadialGradient(S.w * 0.2, S.h * 0.3, 20, S.w * 0.5, S.h * 0.4, S.w * 0.7);
      rg.addColorStop(0, 'rgba(255,79,216,.18)');
      rg.addColorStop(0.5, 'rgba(62,230,255,.05)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(S.x, S.y, S.w, S.h);
    }
    var vg = ctx.createRadialGradient(S.x + S.w / 2, S.y + S.h / 2, S.h * 0.2, S.x + S.w / 2, S.y + S.h / 2, S.w * 0.65);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(S.x, S.y, S.w, S.h);
    drawTruss(S, now);
    drawFloor(S, now);
    drawEq(S, now);
    if (state.fever && (state.mode === 'routine' || state.mode === 'results')) drawFever(S, now);
    var showFrame = state.mode === 'align' || state.mode === 'countdown' || state.mode === 'countgo' || state.mode === 'mocap' || state.mode === 'recording' || state.mode === 'pet' || state.mode === 'petrec';
    if (showFrame) drawAlign(L);
    var pet = isPetish();
    var showFig = !state.cameraActive || state.userSim || state.mode === 'playback' || state.mode === 'recording' || state.mode === 'mocap' || state.mode === 'align' || state.mode === 'countdown' || pet;
    if (state.mode === 'routine' || state.mode === 'freestyle') showFig = !state.cameraActive || state.userSim;
    if (showFig && !pet) {
      var sc = Math.max(0.55, Math.min(S.w, S.h) / 420);
      drawFigure(L.center.x, L.frame.y + L.frame.h * 0.62, sc, livePose(now), now, state.cameraActive && !state.userSim ? 0.55 : 1);
    }
    drawPads(L, now);
    drawCues(L, now);
    if (showFig && pet) {
      var psc = Math.max(0.55, Math.min(S.w, S.h) / 420);
      var fade = state.cameraActive && !state.userSim ? 0.85 : 1;
      drawPup(L.center.x, L.frame.y + L.frame.h * 0.56, psc * 1.25, livePetPose(now), now, fade);
    }
    ctx.restore();
  }
  function drawTruss(S, now) {
    var y = S.y + 8;
    ctx.save();
    ctx.strokeStyle = 'rgba(62,230,255,.55)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(S.x + 10, y + 16);
    ctx.lineTo(S.x + S.w - 10, y + 16);
    ctx.stroke();
    for (var i = 0; i < 7; i++) {
      var x = S.x + 16 + (S.w - 32) * (i / 6);
      ctx.beginPath();
      ctx.moveTo(x, y + 16);
      ctx.lineTo(x + 18, y + 28);
      ctx.lineTo(x, y + 16);
      ctx.moveTo(x, y + 16);
      ctx.lineTo(x, y + 8);
      ctx.stroke();
      var col = (state.fever ? '#ffe14d' : (i % 2 ? '#ff4fd8' : '#3ee6ff'));
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(now / 180 + i);
      ctx.beginPath();
      ctx.moveTo(x, y + 16);
      var sway = Math.sin(now / 400 + i) * 24;
      ctx.lineTo(x + sway, S.y + S.h * 0.42);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(62,230,255,.55)';
    }
    ctx.restore();
  }
  function drawFloor(S) {
    var y0 = S.y + S.h * 0.58;
    var y1 = S.y + S.h - 4;
    ctx.save();
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, 'rgba(62,230,255,0)');
    g.addColorStop(1, 'rgba(62,230,255,.16)');
    ctx.fillStyle = g;
    ctx.fillRect(S.x, y0, S.w, y1 - y0);
    ctx.strokeStyle = 'rgba(62,230,255,.32)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 7; i++) {
      var k = i / 7;
      var y = y0 + (y1 - y0) * k * k;
      ctx.beginPath();
      ctx.moveTo(S.x, y);
      ctx.lineTo(S.x + S.w, y);
      ctx.stroke();
    }
    for (var c = 0; c <= 8; c++) {
      var u = c / 8;
      ctx.beginPath();
      ctx.moveTo(S.x + S.w * 0.5 + (u - 0.5) * S.w * 0.18, y0);
      ctx.lineTo(S.x + u * S.w, y1);
      ctx.stroke();
    }
    ctx.translate(S.x + S.w / 2, y0 + (y1 - y0) * 0.42);
    ctx.scale(1, 0.38);
    ctx.fillStyle = 'rgba(255,79,216,.8)';
    ctx.font = '800 22px Orbitron,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff4fd8';
    ctx.shadowBlur = 10;
    ctx.fillText('Z', 0, -18);
    ctx.fillStyle = 'rgba(62,230,255,.8)';
    ctx.shadowColor = '#3ee6ff';
    ctx.font = '800 16px Orbitron,sans-serif';
    ctx.fillText('Z COMPANY ARTS', 0, 8);
    ctx.restore();
  }
  function drawEq(S, now) {
    var bpm = currentBpm();
    var beat = Math.abs(Math.sin(clockTime() * Math.PI * 2 * (bpm / 60)));
    ctx.save();
    for (var side = 0; side < 2; side++) {
      var x0 = side ? S.x + S.w - 22 : S.x + 8;
      for (var i = 0; i < 8; i++) {
        var id = ZONE_IDS[i % 6];
        var e = 0.25 + (state.zoneEnergy[id] || 0) * 0.9 + beat * (0.15 + (i % 3) * 0.08);
        var bh = 10 + e * 46;
        var y = S.y + S.h * 0.36 + i * 8;
        ctx.fillStyle = i % 2 ? 'rgba(255,79,216,.85)' : 'rgba(62,230,255,.85)';
        ctx.fillRect(x0, y - bh * 0.3, 8, bh * 0.45);
      }
    }
    ctx.restore();
  }
  function drawFever(S, now) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffe14d';
    ctx.shadowBlur = 12;
    for (var i = 0; i < 6; i++) {
      var x = S.x + ((now / 18 + i * 70) % (S.w + 30)) - 10;
      ctx.beginPath();
      ctx.moveTo(x, S.y + 20);
      ctx.lineTo(x + 36, S.y + S.h - 10);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawAlign(L) {
    var f = L.frame;
    ctx.save();
    ctx.strokeStyle = '#3ee6ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 6]);
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 10;
    roundRect(f.x, f.y, f.w, f.h, Math.min(36, f.w * 0.12));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(f.x + f.w / 2, f.y + f.h * 0.16, Math.max(8, f.h * 0.07), 0, 6.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(f.x + f.w / 2, f.y + f.h * 0.24);
    ctx.lineTo(f.x + f.w / 2, f.y + f.h * 0.58);
    ctx.moveTo(f.x + f.w * 0.28, f.y + f.h * 0.38);
    ctx.lineTo(f.x + f.w * 0.72, f.y + f.h * 0.38);
    ctx.moveTo(f.x + f.w / 2, f.y + f.h * 0.58);
    ctx.lineTo(f.x + f.w * 0.32, f.y + f.h * 0.9);
    ctx.moveTo(f.x + f.w / 2, f.y + f.h * 0.58);
    ctx.lineTo(f.x + f.w * 0.68, f.y + f.h * 0.9);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    if (state.mode === 'align' || state.mode === 'mocap' || state.mode === 'pet' || state.mode === 'countdown') {
      ctx.save();
      ctx.font = '700 11px Orbitron,sans-serif';
      ctx.fillStyle = '#d9fbff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.shadowColor = '#3ee6ff';
      ctx.shadowBlur = 8;
      var hint = (isPetish() || state.countKind === 'pet')
        ? 'PROP PHONE DOWN · FRAME YOUR DOG OR HOP AND PAW INSIDE THE NEON FRAME'
        : 'PROP PHONE DOWN · STEP BACK 6 FT SO YOUR BODY FITS THE NEON FRAME';
      wrapText(ctx, hint, L.stage.x + L.stage.w / 2, L.head + 18, Math.min(L.stage.w - 24, 640), 13);
      ctx.restore();
    }
  }
  function wrapText(c, text, x, y, maxW, lh) {
    var words = text.split(' ');
    var line = '', lines = [];
    for (var i = 0; i < words.length; i++) {
      var t = line ? line + ' ' + words[i] : words[i];
      if (c.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; }
      else line = t;
    }
    if (line) lines.push(line);
    for (var j = 0; j < lines.length; j++) c.fillText(lines[j], x, y + j * lh);
  }
  function drawPads(L) {
    ZONE_IDS.forEach(function (id) {
      var p = L.pads[id];
      var meta = ZONE_META[id];
      var e = state.zoneEnergy[id] || 0;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.strokeStyle = meta.color;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 2;
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = 10 + e * 16;
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, 6.3);
      ctx.stroke();
      if (e > 0.02) {
        ctx.globalAlpha = Math.min(0.55, e);
        ctx.fillStyle = meta.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.78, 0, 6.3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = '800 12px Orbitron,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(id, 0, -2);
      ctx.font = '700 7px Orbitron,sans-serif';
      ctx.fillStyle = meta.color;
      ctx.fillText(meta.hint, 0, p.r + 10);
      ctx.restore();
    });
  }
  function drawCues(L, now) {
    if (state.mode !== 'routine') return;
    var t = state.routineT;
    for (var i = 0; i < state.cues.length; i++) {
      var c = state.cues[i];
      if (c.done) continue;
      var dt = c.t - t;
      if (dt > 1.25 || dt < -0.25) continue;
      var k = 1 - clamp(dt / 1.25, 0, 1);
      if (c.kind === 'zone' && L.pads[c.zone]) {
        var p = L.pads[c.zone];
        var rad = p.r + (1 - k) * 72;
        ctx.strokeStyle = ZONE_META[c.zone].color;
        ctx.globalAlpha = 0.35 + k * 0.65;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, 6.3);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (c.kind === 'hands') {
        ['UL', 'UR'].forEach(function (id) {
          var p = L.pads[id];
          ctx.strokeStyle = '#ffe14d';
          ctx.globalAlpha = 0.4 + k * 0.6;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + (1 - k) * 70, 0, 6.3);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
        labelCenter(L, 'HANDS UP!', '#ffe14d');
      } else if (c.kind === 'spin') {
        ctx.strokeStyle = '#ffe14d';
        ctx.globalAlpha = 0.5 + 0.4 * Math.sin(now / 60);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(L.center.x, L.center.y, 30 + (1 - k) * 80, 0, 6.3);
        ctx.stroke();
        ctx.globalAlpha = 1;
        labelCenter(L, 'SPIN / JUMP BURST!', '#ffe14d');
      } else if (c.kind === 'pose') {
        ctx.strokeStyle = '#fff';
        ctx.globalAlpha = 0.5 + k * 0.5;
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        roundRect(L.center.x - 54, L.center.y - 28, 108, 56, 12);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        labelCenter(L, 'STRIKE A POSE! (FREEZE)', '#fff');
      }
    }
  }
  function labelCenter(L, text, col) {
    ctx.save();
    ctx.font = '800 12px Orbitron,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = col;
    ctx.shadowColor = col;
    ctx.shadowBlur = 8;
    ctx.fillText(text, L.center.x, L.center.y - 48);
    ctx.restore();
  }
  function drawBeat(L) {
    if (isPetish()) return;
    var bpm = currentBpm();
    var phase = clockTime() / (60 / bpm);
    var idx = ((Math.floor(phase) % 8) + 8) % 8;
    var frac = phase - Math.floor(phase);
    var labels = ['1', '2', '3', '4', '5', '6', '7', '8'];
    var y = L.head + 16;
    var cx = L.stage.x + L.stage.w / 2;
    var gap = 20;
    ctx.save();
    ctx.font = '800 12px Orbitron,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var x0 = cx - gap * 3.5;
    for (var i = 0; i < 8; i++) {
      var x = x0 + i * gap;
      var on = i === idx;
      if (on) {
        var rad = 9 + (frac < 0.18 ? (1 - frac / 0.18) * 5 : 0);
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 6.3);
        ctx.strokeStyle = frac < 0.18 ? '#ffe14d' : '#3ee6ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffe14d';
        ctx.shadowBlur = frac < 0.18 ? 12 : 0;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = on ? '#ffe14d' : 'rgba(255,255,255,.72)';
      ctx.fillText(labels[i], x, y);
      if (i < 7) {
        ctx.fillStyle = 'rgba(62,230,255,.55)';
        ctx.font = '700 10px Orbitron,sans-serif';
        ctx.fillText('·', x + gap / 2, y);
        ctx.font = '800 12px Orbitron,sans-serif';
      }
    }
    ctx.font = '700 8px Orbitron,sans-serif';
    ctx.fillStyle = '#9ff3ff';
    ctx.fillText(bpm + ' BPM', x0 + 8 * gap + 8, y);
    ctx.restore();
  }
  function drawHud(L) {
    if (!(state.mode === 'routine' || state.mode === 'freestyle' || state.mode === 'results' || state.mode === 'countdown' || state.mode === 'countgo')) return;
    var x = L.stage.x + 10;
    var y = L.head + 30;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 13px Orbitron,sans-serif';
    ctx.fillStyle = '#ffe14d';
    ctx.shadowColor = '#ffe14d';
    ctx.shadowBlur = 8;
    ctx.fillText('SCORE ' + state.score, x, y);
    ctx.shadowBlur = 0;
    var m = state.mode === 'routine' || state.mode === 'results' ? mult() : 1;
    var combo = 'COMBO ' + state.combo;
    if (m === 2) combo += '  ×2';
    else if (m === 4) combo += '  ×4';
    else if (m >= 8) combo += '  ×8 FEVER MODE';
    ctx.font = '800 11px Orbitron,sans-serif';
    ctx.fillStyle = m >= 8 ? '#ffe14d' : '#3ee6ff';
    ctx.fillText(combo, x, y + 16);
    if (state.mode === 'freestyle') {
      ctx.fillStyle = '#ffb3e6';
      ctx.font = '700 10px Orbitron,sans-serif';
      ctx.fillText('MOVES ' + state.moves + '  ·  STAGE KCAL ' + state.kcal.toFixed(1), x, y + 32);
    }
    if (state.mode === 'recording') {
      ctx.fillStyle = '#ff2a3d';
      ctx.fillText('REC ' + state.moFrames.length + '/80', x, y + 32);
    }
    ctx.restore();
  }
  function drawCountdown(L) {
    var n, word;
    if (state.mode === 'countdown') {
      n = Math.max(1, Math.ceil(state.countLeft));
      word = String(n);
    } else if (state.mode === 'countgo') {
      word = (state.countKind === 'record' || state.countKind === 'pet') ? 'RECORDING!' : 'DANCE!';
    } else if (state.mode === 'recording' || state.mode === 'petrec') {
      var recN = state.mode === 'petrec' ? state.petFrames.length : state.moFrames.length;
      var recMax = state.mode === 'petrec' ? 60 : 80;
      ctx.save();
      ctx.font = '800 12px Orbitron,sans-serif';
      ctx.fillStyle = '#ff2a3d';
      ctx.textAlign = 'left';
      ctx.fillText('REC ' + recN + '/' + recMax, L.stage.x + 12, L.head + 34);
      ctx.restore();
      return;
    } else return;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 ' + (word.length > 3 ? 42 : 84) + 'px Orbitron,sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = state.countKind === 'pet' ? '#ffe14d' : state.countKind === 'record' ? '#ff4fd8' : '#3ee6ff';
    ctx.shadowBlur = 18;
    ctx.fillText(word, L.center.x, L.center.y);
    ctx.font = '700 11px Orbitron,sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffb3e6';
    var phrase = state.countKind === 'pet' ? '5… 4… 3… 2… 1… RECORDING!' : state.countKind === 'record' ? '5… 4… 3… 2… 1… RECORDING!' : '5… 4… 3… 2… 1… DANCE!';
    ctx.fillText(phrase, L.center.x, L.center.y + 58);
    ctx.restore();
  }
  function drawJudge(L) {
    if (!state.judge) return;
    var age = performance.now() - state.judge.at;
    if (age > 760) return;
    ctx.save();
    ctx.globalAlpha = 1 - age / 760;
    ctx.font = '900 26px Orbitron,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = state.judge.text === 'MISS' ? '#ff2a3d' : '#fff';
    ctx.shadowColor = '#ffe14d';
    ctx.shadowBlur = 12;
    ctx.fillText(state.judge.text, L.center.x, L.head + 78);
    ctx.restore();
  }
  function drawCard(L) {
    if (state.mode !== 'results') return;
    var W = state.W, H = state.H;
    var w = Math.min(440, W - 28);
    var h = Math.min(210, Math.max(120, H - L.head - L.foot - 16));
    var x = (W - w) / 2;
    var y = L.head + 8;
    ctx.save();
    ctx.fillStyle = 'rgba(8,2,18,.9)';
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffe14d';
    ctx.shadowBlur = 16;
    roundRect(x, y, w, h, 16);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffe14d';
    ctx.font = '800 12px Orbitron,sans-serif';
    ctx.fillText('Z COMPANY ARTS', x + w / 2, y + 10);
    ctx.fillStyle = '#3ee6ff';
    ctx.font = '800 11px Orbitron,sans-serif';
    ctx.fillText('NEON DANCE STAGE', x + w / 2, y + 26);
    var meta = ROUTINES[state.routineId];
    ctx.fillStyle = '#ffb3e6';
    ctx.font = '700 10px Orbitron,sans-serif';
    ctx.fillText(meta ? meta.name : '', x + w / 2, y + 42);
    ctx.font = '900 ' + Math.max(36, Math.min(64, h * 0.28)) + 'px Orbitron,sans-serif';
    ctx.fillStyle = state.rank === 'S+' || state.rank === 'S' ? '#ffe14d' : '#fff';
    ctx.shadowColor = '#ffe14d';
    ctx.shadowBlur = 12;
    ctx.fillText(state.rank || 'B', x + w / 2, y + 56);
    ctx.shadowBlur = 0;
    ctx.font = '700 11px Orbitron,sans-serif';
    ctx.fillStyle = '#fff';
    var baseY = y + h - 62;
    ctx.fillText('SCORE ' + state.score + '   ·   MAX COMBO ' + state.maxCombo, x + w / 2, baseY);
    ctx.fillText('HITS ' + state.hits + '   ·   POSES ' + state.poses, x + w / 2, baseY + 16);
    ctx.fillStyle = '#7dff6b';
    ctx.fillText('STAGE RANK SAVED', x + w / 2, baseY + 34);
    ctx.restore();
  }
  function drawPetPanel(P, now) {
    var pose = livePetPose(now);
    ctx.save();
    ctx.fillStyle = 'rgba(10,4,22,.92)';
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffe14d';
    ctx.shadowBlur = 12;
    roundRect(P.x, P.y, P.w, P.h, 14);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 10px Orbitron,sans-serif';
    ctx.fillStyle = '#ffe14d';
    ctx.fillText('CYBER PUP', P.x + 10, P.y + 8);
    ctx.font = '700 8px Orbitron,sans-serif';
    ctx.fillStyle = '#ffb3e6';
    var cap = state.mode === 'petplay' ? ('PLAY · ' + (state.petName || 'CYBER PUP')) : state.mode === 'petrec' ? 'RECORDING DOG' : 'LIVE PUP PREVIEW';
    ctx.fillText(cap, P.x + 10, P.y + 22);
    ctx.fillStyle = '#d9fbff';
    function line(a, yy) { ctx.fillText(a, P.x + 10, yy); }
    line('HOP ' + pose.hop.toFixed(2) + '   WAG ' + (pose.wag >= 0 ? '+' : '') + pose.wag.toFixed(2), P.y + 36);
    line('PAW L ' + pose.pawL.toFixed(2) + '   PAW R ' + pose.pawR.toFixed(2), P.y + 48);
    line('BOW ' + pose.bow.toFixed(2) + '   SWAY ' + (pose.sway >= 0 ? '+' : '') + pose.sway.toFixed(2), P.y + 60);
    line('SPIN ' + pose.spin, P.y + 72);
    var kf = 1;
    if (state.petFrames && state.petFrames.length) {
      if (state.mode === 'petrec') kf = state.petFrames.length;
      else kf = Math.min(60, Math.floor(clamp(state.playT / 6, 0, 0.999) * 60) + 1);
    }
    ctx.fillStyle = '#7dff6b';
    line('KF ' + kf + '/60  ·  Z COMPANY ARTS', P.y + 86);
    var sc = Math.max(0.42, Math.min(P.w / 170, (P.h - 108) / 150));
    drawPup(P.x + P.w / 2, P.y + Math.min(P.h - 16, 112 + sc * 62), sc, pose, now, 1);
    ctx.restore();
  }
  function drawPanel(L, now) {
    var P = L.panel;
    if (!P) return;
    if (isPetish()) return drawPetPanel(P, now);
    ctx.save();
    ctx.fillStyle = 'rgba(10,4,22,.92)';
    ctx.strokeStyle = '#ff4fd8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff4fd8';
    ctx.shadowBlur = 12;
    roundRect(P.x, P.y, P.w, P.h, 14);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    var pose = livePose(now);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 10px Orbitron,sans-serif';
    ctx.fillStyle = '#ffe14d';
    ctx.fillText('CHARACTER TWIN', P.x + 10, P.y + 8);
    ctx.font = '700 8px Orbitron,sans-serif';
    ctx.fillStyle = '#ffb3e6';
    var cap = state.mode === 'playback' ? ('PLAY · ' + (state.slotName || 'CUSTOM')) : state.mode === 'recording' ? 'RECORDING MO-CAP' : 'LIVE PREVIEW';
    ctx.fillText(cap, P.x + 10, P.y + 22);
    ctx.fillStyle = '#d9fbff';
    var line = function (a, yy) { ctx.fillText(a, P.x + 10, yy); };
    line('ARM L ' + pose.armL.toFixed(2) + '   ARM R ' + pose.armR.toFixed(2), P.y + 36);
    line('LEG L ' + pose.legL.toFixed(2) + '   LEG R ' + pose.legR.toFixed(2), P.y + 48);
    line('SWAY ' + (pose.sway >= 0 ? '+' : '') + pose.sway.toFixed(2) + '   BOUNCE ' + pose.bounce.toFixed(2), P.y + 60);
    line('SPIN ' + pose.spin + '   ENERGY ' + pose.energy.toFixed(2), P.y + 72);
    var kf = 1;
    if (state.moFrames && state.moFrames.length) {
      if (state.mode === 'recording') kf = state.moFrames.length;
      else kf = Math.min(80, Math.floor(clamp(state.playT / 8, 0, 0.999) * 80) + 1);
    }
    ctx.fillStyle = '#7dff6b';
    line('KF ' + kf + '/80  ·  Z COMPANY ARTS', P.y + 86);
    var sc = Math.max(0.45, Math.min(P.w / 150, (P.h - 100) / 180));
    drawFigure(P.x + P.w / 2, P.y + Math.min(P.h - 18, 108 + sc * 70), sc, pose, now, 1);
    ctx.restore();
  }
  function drawSparks() {
    for (var i = 0; i < sparks.length; i++) {
      var s = sparks[i];
      ctx.globalAlpha = Math.max(0, Math.min(1, s.life * 2));
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, 3, 3);
    }
    ctx.globalAlpha = 1;
  }
  function drawShutter() {
    if (state.shutter <= 0) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,' + state.shutter + ')';
    ctx.lineWidth = 12;
    ctx.strokeRect(4, 4, state.W - 8, state.H - 8);
    ctx.restore();
  }

  function step(dt, now) {
    if (!state.open) return;
    analyzeCamera();
    recomputeEnergy(dt);
    if (window.WALK_MODE && WALK_MODE.nudge) { WALK_MODE.nudge.x = 0; WALK_MODE.nudge.z = 0; }
    wrapInput();
    if (state.mode === 'align' || state.mode === 'mocap' || state.mode === 'pet') {
      var waveHot = state.wavePtr || state.waveEnergy >= WAVE_E;
      if (waveHot) state.waveHold += dt;
      else state.waveHold = Math.max(0, state.waveHold - dt * 0.85);
      if (state.waveHold >= 1) {
        state.waveHold = 0;
        state.wavePtr = false;
        state.countKind = (state.mode === 'pet' || state.intent === 'pet') ? 'pet' : (state.mode === 'mocap' || state.intent === 'record') ? 'record' : 'routine';
        state.mode = 'countdown';
        state.countLeft = 5;
        updateChrome();
      }
    }
    if (state.mode === 'countdown') {
      state.countLeft -= dt;
      if (state.countLeft <= 0) { state.mode = 'countgo'; state.countGo = 0.55; }
    } else if (state.mode === 'countgo') {
      state.countGo -= dt;
      if (state.countGo <= 0) beginAfterCount();
    } else if (state.mode === 'routine') {
      state.routineT += dt;
      evaluate(dt);
    } else if (state.mode === 'freestyle') {
      state.routineT += dt;
    } else if (state.mode === 'recording') {
      stepRecording(dt);
    } else if (state.mode === 'playback') {
      state.playT += dt;
      if (state.playT >= 8) state.playT -= 8;
    } else if (state.mode === 'petrec') {
      stepPetRecording(dt);
    } else if (state.mode === 'petplay') {
      state.playT += dt;
      if (state.playT >= 6) state.playT -= 6;
    }
    if (state.shutter > 0) state.shutter = Math.max(0, state.shutter - dt * 1.5);
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.life -= dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 28 * dt;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    void now;
  }

  function render(now) {
    if (!state.open || !ctx) return;
    resize();
    var L = computeLayout();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#07010f';
    ctx.fillRect(0, 0, state.W, state.H);
    drawStage(L, now);
    drawPanel(L, now);
    drawBeat(L);
    drawHud(L);
    drawCountdown(L);
    drawJudge(L);
    drawCard(L);
    drawSparks();
    drawShutter();
    updateChrome();
  }

  function raf(t) {
    var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;
    lastT = t;
    try { step(dt, t); } catch (e) { fault(e); }
    try { render(t); } catch (e) { fault(e); }
    requestAnimationFrame(raf);
  }

  var api = {
    open: function (opts) {
      mount();
      var o = opts || {};
      var building = null;
      if (o && typeof o === 'object' && (o.doors || o.deco || o.kind || o.boxes || o.buildingId != null) && o.routineId == null && o.sim == null) {
        building = o;
        o = { building: building };
      }
      state.building = (o && o.building) || building || state.building;
      state.open = true;
      rewarded = false;
      if (root) {
        root.classList.add('zd-ds-on');
        root.setAttribute('aria-hidden', 'false');
      }
      if (o && o.sim) { state.userSim = true; state.simActive = true; stopCamera(); }
      resize();
      wrapInput();
      hookWalk();
      if (!state.camTried) { state.camTried = true; startCamera(); }
      if (o && o.routineId) api.startRoutine(o.routineId);
      updateChrome();
      return true;
    },
    close: function () {
      if (state.open && inWorld()) awardReturn();
      stopCamera();
      state.open = false;
      state.cameraActive = false;
      state.wavePtr = false;
      if (root) {
        root.classList.remove('zd-ds-on');
        root.setAttribute('aria-hidden', 'true');
      }
      return true;
    },
    isOpen: function () { return !!state.open; },
    getState: function () {
      var z = {};
      ZONE_IDS.forEach(function (id) { z[id] = Math.round((state.zoneEnergy[id] || 0) * 1000) / 1000; });
      return {
        open: !!state.open,
        mode: state.mode,
        routineId: state.routineId,
        score: state.score,
        combo: state.combo,
        maxCombo: state.maxCombo,
        hits: state.hits,
        poses: state.poses,
        cameraActive: !!state.cameraActive,
        simActive: !!state.simActive || !!state.userSim || !state.cameraActive,
        zoneEnergy: z,
        bestScores: state.bestScores || {},
        rank: state.rank,
        moves: state.moves,
        kcal: Math.round(state.kcal * 10) / 10,
        faults: state.faults.slice()
      };
    },
    startRoutine: function (routineId) {
      if (!state.open) api.open({});
      var id = resolveRoutine(routineId || state.selected);
      state.userSim = state.userSim || !state.cameraActive;
      state.simActive = state.simActive || state.userSim || !state.cameraActive;
      setupChart(id);
      return true;
    },
    simulateBeatHit: function (zoneId) {
      var z = normZone(zoneId);
      if (!z) return false;
      if (z === 'POSE') return api.simulateFreezePose();
      if (state.mode !== 'routine') return false;
      if (z === 'HANDS') return !!scoreNext(function (c) { return c.kind === 'hands'; }, 'PERFECT');
      if (z === 'SPIN') return !!scoreNext(function (c) { return c.kind === 'spin'; }, 'PERFECT');
      pulseZone(z);
      state.zoneEnergy[z] = 1;
      return !!scoreNext(function (c) { return c.kind === 'zone' && c.zone === z; }, 'PERFECT');
    },
    simulateFreezePose: function () {
      if (state.mode !== 'routine') return false;
      state.shutter = 1;
      state.poseHold = 0.6;
      return !!scoreNext(function (c) { return c.kind === 'pose'; }, 'PERFECT');
    },
    simulateStep: function (zoneId) {
      var z = normZone(zoneId);
      if (!z || !ZONE_META[z]) return false;
      api.setSimMotion(z, 1);
      if (state.mode === 'routine') {
        var openCue = null;
        for (var i = 0; i < state.cues.length; i++) {
          var c = state.cues[i];
          if (!c.done && c.kind === 'zone' && c.zone === z && Math.abs(state.routineT - c.t) <= 0.30) { openCue = c; break; }
        }
        if (openCue) return !!scoreCue(openCue, gradeFor(state.routineT - openCue.t) || 'PERFECT');
        return !!scoreNext(function (c) { return c.kind === 'zone' && c.zone === z; }, 'PERFECT');
      }
      return true;
    },
    setSimMotion: function (zoneId, energy) {
      var z = normZone(zoneId);
      if (!z || !ZONE_META[z]) return false;
      state.userSim = true;
      state.simActive = true;
      state.simEnergy[z] = clamp(energy, 0, 1);
      state.zoneEnergy[z] = state.simEnergy[z];
      if (state.zoneEnergy[z] >= HIT_E) state.sawMotion = true;
      return true;
    },
    recordChoreo: function () {
      if (!state.open) api.open({});
      state.intent = 'record';
      state.countKind = 'record';
      state.routineId = 'mocap';
      state.mode = 'countdown';
      state.countLeft = 5;
      state.countGo = 0;
      state.waveHold = 0;
      updateChrome();
      return true;
    },
    saveCustomDance: function (slotIdx, name, frames) {
      var store = readStore();
      var idx = clamp(slotIdx | 0, 0, 2) | 0;
      var nm = String(name || state.slotName || ('ELLIE MO-CAP #' + (idx + 1))).slice(0, 48);
      var src = frames && frames.length ? frames : state.moFrames;
      var eighty = toEighty(src);
      store.slots[idx] = { name: nm, bpm: 120, duration: 8, updatedAt: Date.now(), frames: eighty };
      store.activeSlot = idx;
      store.enabled = true;
      state.slotName = nm;
      state.moFrames = eighty;
      writeStore(store);
      return JSON.parse(JSON.stringify(storeCache));
    },
    getCustomDance: function () {
      return JSON.parse(JSON.stringify(readStore()));
    },
    recordPetDance: function () {
      if (!state.open) api.open({});
      state.intent = 'pet';
      state.countKind = 'pet';
      state.routineId = 'pet';
      state.mode = 'countdown';
      state.countLeft = 5;
      state.countGo = 0;
      state.waveHold = 0;
      updateChrome();
      return true;
    },
    getCustomPetDance: function () {
      return JSON.parse(JSON.stringify(readPetStore()));
    },
    simulatePetMoCapRecording: function (presetName) {
      if (!state.open) api.open({});
      var name = String(presetName || 'CYBER PUP #1').slice(0, 48);
      var style = petStyle(name);
      var frames = [];
      for (var i = 0; i < 60; i++) {
        var t = i === 0 ? 0 : i === 59 ? 1 : i / 59;
        frames.push(sanitizePet(petPreset(style, t), t));
        frames[i].t = petIndexT(i);
      }
      state.intent = 'pet';
      state.routineId = 'pet';
      state.countKind = 'pet';
      state.petFrames = frames;
      state.petName = name;
      state.mode = 'petplay';
      state.playT = 1.75;
      var saved = savePetDance(readPetStore().activeSlot || 0, name, frames);
      updateChrome();
      return saved;
    },
    simulateMoCapRecording: function (presetName) {
      if (!state.open) api.open({});
      var name = String(presetName || 'ELLIE MO-CAP #1').slice(0, 48);
      var style = styleFor(name);
      var frames = [];
      for (var i = 0; i < 80; i++) {
        var t = i === 0 ? 0 : i === 79 ? 1 : i / 79;
        frames.push(sanitizePose(presetPose(style, t), t));
        frames[i].t = i === 0 ? 0 : i === 79 ? 1 : Math.round((i / 79) * 10000) / 10000;
      }
      state.intent = 'record';
      state.routineId = 'mocap';
      state.moFrames = frames;
      state.mode = 'playback';
      state.playT = 1.15;
      state.slotName = name;
      var saved = api.saveCustomDance(readStore().activeSlot || 0, name, frames);
      updateChrome();
      return saved;
    }
  };

  try {
    var stageData = loadStage();
    if (stageData.bestScores) state.bestScores = stageData.bestScores;
  } catch (e) {}

  window.DANCE_STAGE = api;

  function boot() {
    mount();
    hookWalk();
    wrapInput();
    if (isStandalone()) api.open({});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(function () { try { hookWalk(); wrapInput(); } catch (e) {} }, 1000);
  window.addEventListener('keydown', function (e) {
    if (!api.isOpen()) return;
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'Space') {
      e.preventDefault();
    }
  }, true);
})();
