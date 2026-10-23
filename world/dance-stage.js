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
  var LS_CREW = 'zdash.crew.v1';
  var CH_CREW = 'zdash-crew';
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
    tab: 'stage',
    intent: 'routine',
    countKind: 'routine',
    countMax: 5,
    liveMirror: true,
    improve: false,
    improveKind: 'char',
    improvePhase: 'idle',
    improveIndex: 0,
    improvePlay: false,
    improveRecT: 0,
    improveCount: 0,
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
    petName: 'MY DOG',
    petFrames: [],
    faults: [],
    W: 0,
    H: 0
  };

  var root, canvas, ctx, video, stream, topEl, footEl, waveBox, waveBtn, waveCap;
  var backBtn, improveBtn, startBtn, freeBtn, recCharBtn, recPetBtn;
  var tabBtns = {}, stageRow, charRow, petRow, pillChar, pillPet, pillCharClassic, pillCharMine, pillPetClassic, pillPetMine;
  var improveEl, improveTop, improveBot, improveTitle, improveLeftCap, improveRightCap, improveKf, replayBtn, saveTuneBtn, closeImproveBtn;
  var chipBtns = {}, slotBtns = [], progBtn, dogBtn, simBtn, slotRow, classicBtn;
  var mcan, mctx, snapCan, snapCtx, prevPix, sparks = [], lastT = 0, storeCache = null, danceCh = null, petCache = null, petCh = null, crewCh = null, rewarded = false;
  var takeFrames = [];
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
      '.zd-ds-top{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:center;gap:6px;pointer-events:auto;padding:3px 8px;background:linear-gradient(rgba(5,0,16,.94),rgba(5,0,16,.72))}',
      '.zd-ds-top[hidden],.zd-ds-foot[hidden]{display:none !important}',
      '.zd-ds-tabs{display:flex;flex:1;gap:4px;justify-content:center;min-width:0}',
      '.zd-ds-tab,.zd-ds-back,.zd-ds-util{font-size:10px;padding:3px 7px;white-space:nowrap}',
      '.zd-ds-util{margin-left:auto;white-space:nowrap;border-color:#ff4fd8 !important;background:rgba(255,79,216,.16) !important}',
      '.zd-ds-foot{position:absolute;left:0;right:0;bottom:0;z-index:5;display:flex;justify-content:center;align-items:center;gap:8px;padding:4px 10px calc(6px + env(safe-area-inset-bottom));background:linear-gradient(transparent,rgba(5,0,16,.94) 30%)}',
      '.zd-ds-row{display:flex;flex-wrap:nowrap;gap:8px;justify-content:center;align-items:center}',
      '.zd-ds-row[hidden]{display:none !important}',
      '.zd-ds button{font-family:Orbitron,sans-serif;font-weight:800;font-size:11px;letter-spacing:.3px;color:#fff;background:rgba(62,230,255,.1);border:1.5px solid rgba(62,230,255,.85);border-radius:999px;padding:4px 9px;cursor:pointer}',
      '.zd-ds-big{font-size:13px !important;padding:7px 18px !important;min-width:200px}',
      '.zd-ds-pill{display:flex;border:1.5px solid rgba(255,225,77,.85);border-radius:999px;overflow:hidden}',
      '.zd-ds-pill[hidden]{display:none !important}',
      '.zd-ds-pill button{border:0;border-radius:0;background:transparent;padding:7px 12px;font-size:11px}',
      '.zd-ds-improve{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;pointer-events:none;background:transparent}',
      '.zd-ds-improve[hidden]{display:none !important}',
      '.zd-ds-improve-top,.zd-ds-improve-bot{pointer-events:auto}',
      '.zd-ds-improve-top{padding:6px 10px 4px;background:linear-gradient(rgba(5,0,16,.96),rgba(5,0,16,.78));text-align:center}',
      '.zd-ds-improve-title{font:800 12px/1.3 Orbitron,sans-serif;color:#fff;text-shadow:0 0 10px #ff4fd8,0 0 14px #3ee6ff}',
      '.zd-ds-improve-caps{display:flex;gap:8px;margin-top:4px}',
      '.zd-ds-improve-caps span{flex:1;font:800 12px/1.2 Orbitron,sans-serif;letter-spacing:.3px}',
      '.zd-ds-improve-caps .l{color:#3ee6ff;text-shadow:0 0 8px #3ee6ff}',
      '.zd-ds-improve-caps .r{color:#ff4fd8;text-shadow:0 0 8px #ff4fd8}',
      '.zd-ds-improve-kf{margin-top:2px;font:700 10px/1.2 Orbitron,sans-serif;color:#ffe14d}',
      '.zd-ds-improve-bot{margin-top:auto;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;padding:6px 8px calc(8px + env(safe-area-inset-bottom));background:linear-gradient(transparent,rgba(5,0,16,.96) 28%)}',
      '.zd-ds button.on{color:#12052a;background:linear-gradient(90deg,#ffe14d,#ff9a2e);border-color:#ffe14d;box-shadow:0 0 12px rgba(255,225,77,.45)}',
      '.zd-ds-program{width:100%;border-color:#ff4fd8;background:rgba(255,79,216,.16);letter-spacing:.4px}',
      '.zd-ds-program.on{color:#fff;background:linear-gradient(90deg,#ff4fd8,#3ee6ff);border-color:#fff;box-shadow:0 0 16px rgba(255,79,216,.55)}',
      '.zd-ds-dog{width:100%;border-color:#ffe14d;background:rgba(255,225,77,.12);letter-spacing:.3px;color:#fff}',
      '.zd-ds-dog.on{color:#12052a;background:linear-gradient(90deg,#ffe14d,#7dff6b);border-color:#fff;box-shadow:0 0 16px rgba(125,255,107,.55)}',
      '.zd-ds-classic{border-color:#ffe14d;background:rgba(255,225,77,.12)}',
      '.zd-ds-classic.on{color:#12052a;background:linear-gradient(90deg,#ffe14d,#7dff6b);border-color:#fff}',
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
    backBtn = el('button', 'zd-ds-back', '← BACK');
    backBtn.type = 'button';
    backBtn.addEventListener('click', onBack);
    var tabs = el('div', 'zd-ds-tabs');
    [['stage', '💃 DANCE STAGE'], ['char', '🕺 RECORD MY DANCE'], ['pet', '🐾 RECORD MY PET']].forEach(function (pair) {
      var b = el('button', 'zd-ds-tab', pair[1]);
      b.type = 'button';
      b.addEventListener('click', function () { selectTab(pair[0]); });
      tabBtns[pair[0]] = b;
      tabs.appendChild(b);
    });
    improveBtn = el('button', 'zd-ds-util', '📹 RECORD TO IMPROVE APP');
    improveBtn.type = 'button';
    improveBtn.addEventListener('click', function () { openImprove(state.tab === 'pet' ? 'pet' : 'char'); });
    topEl.appendChild(backBtn);
    topEl.appendChild(tabs);
    topEl.appendChild(improveBtn);
    waveBox = el('div', 'zd-ds-wavebox');
    waveCap = el('div', 'zd-ds-wavecap', 'WAVE HAND HERE FOR 1s TO START HANDS-FREE');
    waveBtn = el('button', 'zd-ds-wave', '');
    waveBtn.type = 'button';
    waveBtn.setAttribute('aria-label', 'WAVE HAND HERE FOR 1s TO START HANDS-FREE');
    waveBox.appendChild(waveCap);
    waveBox.appendChild(waveBtn);
    footEl = el('div', 'zd-ds-foot');
    stageRow = el('div', 'zd-ds-row');
    startBtn = el('button', 'zd-ds-big', '▶ START DANCE');
    startBtn.type = 'button';
    startBtn.addEventListener('click', function () { api.startRoutine(state.selected || 'neon-pulse'); });
    freeBtn = el('button', 'zd-ds-big', '✨ FREE DANCE');
    freeBtn.type = 'button';
    freeBtn.addEventListener('click', toggleFreeDance);
    stageRow.appendChild(startBtn);
    stageRow.appendChild(freeBtn);
    charRow = el('div', 'zd-ds-row');
    charRow.hidden = true;
    recCharBtn = el('button', 'zd-ds-big', '🔴 RECORD MY DANCE (8s)');
    recCharBtn.type = 'button';
    recCharBtn.addEventListener('click', function () { armCountdown('record', 3); });
    pillChar = el('div', 'zd-ds-pill');
    pillChar.hidden = true;
    pillCharClassic = el('button', '', '✨ Classic Dance');
    pillCharClassic.type = 'button';
    pillCharClassic.addEventListener('click', function () { pickClassic(); });
    pillCharMine = el('button', '', '🎬 My Recorded Dance');
    pillCharMine.type = 'button';
    pillCharMine.addEventListener('click', function () { showRecorded('char'); });
    pillChar.appendChild(pillCharClassic);
    pillChar.appendChild(pillCharMine);
    charRow.appendChild(recCharBtn);
    charRow.appendChild(pillChar);
    petRow = el('div', 'zd-ds-row');
    petRow.hidden = true;
    recPetBtn = el('button', 'zd-ds-big', '🔴 RECORD MY PET (6s)');
    recPetBtn.type = 'button';
    recPetBtn.addEventListener('click', function () { armCountdown('pet', 3); });
    pillPet = el('div', 'zd-ds-pill');
    pillPet.hidden = true;
    pillPetClassic = el('button', '', '✨ Signature Pet Dance');
    pillPetClassic.type = 'button';
    pillPetClassic.addEventListener('click', function () {
      state.intent = 'pet';
      pickClassic();
    });
    pillPetMine = el('button', '', '🐾 My Recorded Pet Dance');
    pillPetMine.type = 'button';
    pillPetMine.addEventListener('click', function () { showRecorded('pet'); });
    pillPet.appendChild(pillPetClassic);
    pillPet.appendChild(pillPetMine);
    petRow.appendChild(recPetBtn);
    petRow.appendChild(pillPet);
    footEl.appendChild(stageRow);
    footEl.appendChild(charRow);
    footEl.appendChild(petRow);
    improveEl = el('div', 'zd-ds-improve');
    improveEl.hidden = true;
    improveTop = el('div', 'zd-ds-improve-top');
    improveTitle = el('div', 'zd-ds-improve-title', '📹 RECORD TO IMPROVE APP (SIDE-BY-SIDE CAMERA vs. DANCER)');
    var caps = el('div', 'zd-ds-improve-caps');
    improveLeftCap = el('span', 'l', 'Left: Camera Take');
    improveRightCap = el('span', 'r', 'Right: In-Game Dancer');
    caps.appendChild(improveLeftCap);
    caps.appendChild(improveRightCap);
    improveKf = el('div', 'zd-ds-improve-kf', '');
    improveTop.appendChild(improveTitle);
    improveTop.appendChild(caps);
    improveTop.appendChild(improveKf);
    improveBot = el('div', 'zd-ds-improve-bot');
    replayBtn = el('button', '', '▶ REPLAY SIDE-BY-SIDE');
    replayBtn.type = 'button';
    replayBtn.addEventListener('click', replayImprove);
    saveTuneBtn = el('button', '', '💾 SAVE / DOWNLOAD CLIP FOR TUNING');
    saveTuneBtn.type = 'button';
    saveTuneBtn.addEventListener('click', downloadTune);
    closeImproveBtn = el('button', '', '✕ CLOSE');
    closeImproveBtn.type = 'button';
    closeImproveBtn.addEventListener('click', closeImprove);
    improveBot.appendChild(replayBtn);
    improveBot.appendChild(saveTuneBtn);
    improveBot.appendChild(closeImproveBtn);
    improveEl.appendChild(improveTop);
    improveEl.appendChild(improveBot);
    root.appendChild(canvas);
    root.appendChild(video);
    root.appendChild(topEl);
    root.appendChild(waveBox);
    root.appendChild(footEl);
    root.appendChild(improveEl);
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

  function syncTab() {
    if (state.improve) return;
    if (isPetish()) state.tab = 'pet';
    else if (isMocapish()) state.tab = 'char';
    else state.tab = 'stage';
  }
  function hasCharRecording() {
    var slots = readStore().slots;
    for (var i = 0; i < slots.length; i++) if (slots[i] && slots[i].frames && slots[i].frames.length) return true;
    return false;
  }
  function hasPetRecording() {
    var slots = readPetStore().slots;
    for (var i = 0; i < slots.length; i++) if (slots[i] && slots[i].frames && slots[i].frames.length) return true;
    return false;
  }
  function selectTab(tab) {
    if (state.improve) closeImprove();
    if (tab === state.tab) { updateChrome(); return; }
    if (tab === 'char') enterMocap();
    else if (tab === 'pet') enterPet();
    else {
      state.intent = 'routine';
      state.countKind = 'routine';
      if (state.mode !== 'routine' && state.mode !== 'freestyle' && state.mode !== 'results') {
        state.mode = 'align';
        state.routineId = state.selected || 'neon-pulse';
      }
      state.tab = 'stage';
    }
    updateChrome();
  }
  function toggleFreeDance() {
    if (!state.open) api.open({});
    if (state.mode === 'freestyle') {
      state.mode = 'align';
      state.routineId = state.selected || 'neon-pulse';
      state.intent = 'routine';
    } else {
      state.tab = 'stage';
      state.intent = 'routine';
      state.countKind = 'routine';
      state.mode = 'freestyle';
      state.routineId = 'freestyle';
      state.routineT = 0;
      state.moves = 0;
      state.kcal = 0;
    }
    updateChrome();
  }
  function armCountdown(kind, seconds) {
    if (!state.open) api.open({});
    state.countKind = kind === 'pet' ? 'pet' : kind === 'record' ? 'record' : 'routine';
    state.intent = state.countKind === 'pet' ? 'pet' : state.countKind === 'record' ? 'record' : 'routine';
    state.routineId = state.countKind === 'pet' ? 'pet' : state.countKind === 'record' ? 'mocap' : (state.selected || 'neon-pulse');
    state.tab = state.countKind === 'pet' ? 'pet' : state.countKind === 'record' ? 'char' : 'stage';
    state.mode = 'countdown';
    state.countMax = seconds || 5;
    state.countLeft = state.countMax;
    state.countGo = 0;
    state.waveHold = 0;
    updateChrome();
  }
  function showRecorded(kind) {
    if (kind === 'pet') {
      state.intent = 'pet';
      var ps = readPetStore();
      var pidx = ps.activeSlot || 0;
      var pslot = ps.slots[pidx];
      if (!pslot || !pslot.frames) {
        for (var i = 0; i < 3; i++) if (ps.slots[i] && ps.slots[i].frames) { pidx = i; pslot = ps.slots[i]; break; }
      }
      if (pslot && pslot.frames) {
        state.petFrames = pslot.frames;
        state.petName = pslot.name;
        state.mode = 'petplay';
        state.playT = 0;
        state.tab = 'pet';
        bindPetOpt(pidx);
      }
    } else {
      var store = readStore();
      var idx = store.activeSlot || 0;
      var slot = store.slots[idx];
      if (!slot || !slot.frames) {
        for (var j = 0; j < 3; j++) if (store.slots[j] && store.slots[j].frames) { idx = j; slot = store.slots[j]; break; }
      }
      if (slot && slot.frames) {
        state.moFrames = slot.frames;
        state.slotName = slot.name;
        state.mode = 'playback';
        state.playT = 0;
        state.intent = 'record';
        state.routineId = 'mocap';
        state.tab = 'char';
        bindCharOpt(idx);
      }
    }
    updateChrome();
  }
  function updateChrome() {
    if (!topEl) return;
    syncTab();
    var tab = state.tab || 'stage';
    Object.keys(tabBtns).forEach(function (id) {
      tabBtns[id].classList.toggle('on', !state.improve && id === tab);
    });
    if (stageRow) stageRow.hidden = state.improve || tab !== 'stage';
    if (charRow) charRow.hidden = state.improve || tab !== 'char';
    if (petRow) petRow.hidden = state.improve || tab !== 'pet';
    if (freeBtn) freeBtn.classList.toggle('on', state.mode === 'freestyle');
    if (topEl) topEl.hidden = !!state.improve;
    if (footEl) footEl.hidden = !!state.improve;
    if (improveEl) improveEl.hidden = !state.improve;
    if (waveBox) waveBox.hidden = state.improve || tab !== 'stage' || !(state.mode === 'align' || state.mode === 'countdown' || state.mode === 'countgo');
    if (pillChar) pillChar.hidden = !hasCharRecording();
    if (pillPet) pillPet.hidden = !hasPetRecording();
    var crew = readCrew();
    if (pillCharClassic) pillCharClassic.classList.toggle('on', crew.charDanceOpt === 'classic');
    if (pillCharMine) pillCharMine.classList.toggle('on', String(crew.charDanceOpt || '').indexOf('slot') === 0);
    if (pillPetClassic) pillPetClassic.classList.toggle('on', crew.petDanceOpt === 'classic' || crew.petDanceMode === 'classic');
    if (pillPetMine) pillPetMine.classList.toggle('on', String(crew.petDanceOpt || '').indexOf('slot') === 0 || crew.petDanceMode === 'custom');
    if (improveRightCap) improveRightCap.textContent = state.improveKind === 'pet' ? 'Right: In-Game Pet' : 'Right: In-Game Dancer';
    if (improveKf) {
      var n = takeFrames.length;
      if (!n || state.improvePhase === 'count') improveKf.textContent = state.improvePhase === 'count' ? 'GET READY' : '';
      else if (state.improvePhase === 'rec') improveKf.textContent = 'RECORDING ' + takeFrames.length + '/' + (state.improveKind === 'pet' ? 40 : 40);
      else improveKf.textContent = 'KF ' + (Math.floor(state.improveIndex) + 1) + '/' + n;
    }
    refreshSlotLabels();
  }

  function refreshSlotLabels() {
    if (!slotBtns.length) return;
    var pet = isPetish() || state.intent === 'pet';
    var store = pet ? readPetStore() : readStore();
    var crew = readCrew();
    var opt = pet ? crew.petDanceOpt : crew.charDanceOpt;
    for (var i = 0; i < 3; i++) {
      var s = store.slots[i];
      slotBtns[i].textContent = s && s.name ? ('SLOT ' + (i + 1) + ' · ' + s.name) : ('SLOT ' + (i + 1));
      slotBtns[i].classList.toggle('on', opt === ('slot' + (i + 1)));
    }
    if (classicBtn) classicBtn.classList.toggle('on', opt === 'classic');
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
    var head = topEl && !topEl.hidden ? (topEl.offsetHeight || 34) : 34;
    var foot = footEl && !footEl.hidden ? (footEl.offsetHeight || 46) : 46;
    if (state.improve) {
      head = improveTop ? (improveTop.offsetHeight || 62) : 62;
      foot = improveBot ? (improveBot.offsetHeight || 48) : 48;
    }
    var mocap = false;
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
        name: String(slot.name || petSlotName('', i)).slice(0, 48),
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
    var nm = petSlotName(name || state.petName, idx);
    var sixty = toSixty(frames && frames.length ? frames : state.petFrames);
    store.slots[idx] = { name: nm, duration: 6, updatedAt: Date.now(), frames: sixty };
    store.activeSlot = idx;
    store.enabled = true;
    state.petName = nm;
    state.petFrames = sixty;
    writePetStore(store);
    bindPetOpt(idx);
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
  function zoneSum() {
    var s = 0;
    for (var i = 0; i < ZONE_IDS.length; i++) s += +state.zoneEnergy[ZONE_IDS[i]] || 0;
    return s;
  }
  function mirrorPetNow() {
    if (!state.liveMirror || state.improve) return false;
    if (state.mode === 'petplay') return false;
    if (!(state.tab === 'pet' || state.mode === 'pet' || state.mode === 'petrec')) return false;
    if (state.mode === 'petrec') return true;
    return !!(state.cameraActive || zoneSum() > 0.04);
  }
  function livePetPose(now) {
    if (mirrorPetNow()) return petPoseFromZones(state.zoneEnergy, state.mode === 'petrec' ? clamp(state.recordT / 6, 0, 1) : 0);
    if (state.mode === 'petplay' && readCrew().petDanceOpt === 'classic') {
      var tc = ((now / 1000) % 6) / 6;
      return sanitizePet(petPreset('wiggle', tc), tc);
    }
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
    state.tab = 'pet';
    state.recordT = 0;
    state.petFrames = [];
    state.countGo = 0;
    resetTake();
    updateChrome();
  }
  function finishPetRecording() {
    var name = state.petName || petSlotName('', 0);
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
      var petPose = petPoseFromZones(state.zoneEnergy, t);
      state.petFrames.push(petPose);
      var pz = zoneSum() > 0.02 ? zoneArr(state.zoneEnergy) : zonesFromPetPose(petPose);
      pushTake(i, t, 'pet', null, petPose, pz);
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
    if (!state.open) api.open({});
    if (!isPetish()) enterPet();
    var store = readPetStore();
    var idx = store.activeSlot || 0;
    var slot = store.slots[idx];
    if (slot && slot.frames && slot.frames.length) {
      state.petFrames = slot.frames;
      state.petName = slot.name;
      state.mode = 'petplay';
      state.intent = 'pet';
      bindPetOpt(idx);
      updateChrome();
      return;
    }
    api.recordPetDance();
  }
  function selectPetSlot(idx) {
    var store = readPetStore();
    store.activeSlot = idx;
    var slot = store.slots[idx];
    if (slot && slot.name) state.petName = slot.name;
    else state.petName = petSlotName('', idx);
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
    if (slot && slot.frames && slot.frames.length) bindPetOpt(idx);
    updateChrome();
  }

  function beginRecording() {
    state.mode = 'recording';
    state.routineId = 'mocap';
    state.intent = 'record';
    state.tab = 'char';
    state.recordT = 0;
    state.moFrames = [];
    state.countGo = 0;
    resetTake();
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
      var pose = poseFromZones(state.zoneEnergy, t);
      state.moFrames.push(pose);
      var zz = zoneSum() > 0.02 ? zoneArr(state.zoneEnergy) : zonesFromCharPose(pose);
      pushTake(i, t, 'char', pose, null, zz);
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
    if (slot && slot.frames && slot.frames.length) bindCharOpt(idx);
    updateChrome();
  }
  function propCountdown() {
    if (!state.open) api.open({});
    var pet = isPetish() || state.intent === 'pet';
    state.countKind = pet ? 'pet' : (state.intent === 'record' || state.mode === 'mocap' || state.mode === 'playback' || state.mode === 'recording') ? 'record' : 'routine';
    if (state.countKind === 'pet') state.routineId = 'pet';
    else if (state.countKind === 'record') state.routineId = 'mocap';
    state.mode = 'countdown';
    state.countMax = 5;
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

  function mirrorCharNow() {
    if (!state.liveMirror || state.improve) return false;
    if (state.mode === 'playback' || state.mode === 'results') return false;
    if (!(state.tab === 'char' || state.mode === 'recording' || state.mode === 'mocap' || state.mode === 'freestyle')) return false;
    if (state.mode === 'recording' || state.mode === 'freestyle') return true;
    return !!(state.cameraActive || zoneSum() > 0.04);
  }
  function livePose(now) {
    if (mirrorCharNow()) return poseFromZones(state.zoneEnergy, state.mode === 'recording' ? clamp(state.recordT / 8, 0, 1) : 0);
    if ((state.mode === 'playback' || state.mode === 'mocap') && readCrew().charDanceOpt === 'classic') {
      return sanitizePose(presetPose('groove', ((now / 1000) % 8) / 8), ((now / 1000) % 8) / 8);
    }
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
  /* Crew companion + Ellie, same joint proportions as world/crew.js (metres, y up, z forward). */
  var DEG = Math.PI / 180;
  var CREW_H = 1.75;
  var CREW_B = { thigh: 0.245 * CREW_H, shin: 0.247 * CREW_H, foot: 0.15 * CREW_H, spine: 0.17 * CREW_H, chest: 0.115 * CREW_H, neck: 0.045 * CREW_H, head: 0.14 * CREW_H, uarm: 0.186 * CREW_H, farm: 0.146 * CREW_H, hand: 0.09 * CREW_H };
  var CREW_SHAPE = {
    girl: { sh: 0.114 * CREW_H, hip: 0.098 * CREW_H, arm: 0.02, leg: 0.026 },
    boy: { sh: 0.130 * CREW_H, hip: 0.088 * CREW_H, arm: 0.026, leg: 0.03 }
  };
  var PET_RIG = {
    dog: { len: 0.28, leg: 0.16, head: 0.09, body: 0.074, ear: 'floppy', earL: 0.07, tail: 'wag', tailL: 0.22, tailR: 0.03, snout: 0.075 },
    cat: { len: 0.22, leg: 0.14, head: 0.084, body: 0.058, ear: 'point', earL: 0.05, tail: 'up', tailL: 0.26, tailR: 0.02, snout: 0.02, whiskers: 1 },
    bunny: { len: 0.2, leg: 0.13, head: 0.072, body: 0.055, ear: 'point', earL: 0.16, tail: 'cotton', tailL: 0.05, tailR: 0.03, snout: 0.015 },
    dragon: { len: 0.25, leg: 0.13, head: 0.092, body: 0.072, ear: 'horn', earL: 0.06, tail: 'spade', tailL: 0.28, tailR: 0.03, snout: 0.045, wings: 1 },
    fox: { len: 0.26, leg: 0.16, head: 0.088, body: 0.068, ear: 'point', earL: 0.075, tail: 'brush', tailL: 0.26, tailR: 0.042, snout: 0.05, whiteTip: 1 }
  };
  var PET_NICK = { '#ffbe3b': 'GOLD', '#ff2bd6': 'MAGENTA', '#2bff88': 'LIME', '#ff5522': 'ORANGE', '#a259ff': 'PURPLE', '#00f6ff': 'CYAN' };
  function crewChannel() {
    if (crewCh) return crewCh;
    try { crewCh = new BroadcastChannel(CH_CREW); } catch (e) { crewCh = null; }
    return crewCh;
  }
  function hexColor(v, fallback) {
    var s = String(v || '').trim().toLowerCase();
    return /^#[0-9a-f]{3,8}$/.test(s) ? s : fallback;
  }
  function readCrew() {
    var o = {};
    try {
      var raw = localStorage.getItem(LS_CREW);
      if (raw) o = JSON.parse(raw) || {};
    } catch (e) { o = {}; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) o = {};
    var live = window.CREW_STATE;
    if (live && typeof live === 'object') {
      ['char', 'pet', 'charColor', 'petColor', 'acc', 'moveMode', 'charDanceOpt', 'petDanceOpt', 'petDanceMode', 'activePetDanceSlot'].forEach(function (k) {
        if ((o[k] == null || o[k] === '') && live[k] != null && live[k] !== '') o[k] = live[k];
      });
    }
    var pet = String(o.pet || 'dog').toLowerCase();
    if (!PET_RIG[pet]) pet = 'dog';
    var ch = String(o.char || 'girl').toLowerCase();
    if (ch === 'male' || ch === 'man' || ch === 'boy') ch = 'boy';
    else ch = 'girl';
    return {
      raw: o,
      pet: pet,
      petColor: hexColor(o.petColor, '#ffbe3b'),
      char: ch,
      charColor: hexColor(o.charColor, ch === 'boy' ? '#3ee6ff' : '#ff4fd8'),
      acc: o.acc == null ? '' : o.acc,
      moveMode: o.moveMode,
      charDanceOpt: o.charDanceOpt || '',
      petDanceOpt: o.petDanceOpt || '',
      petDanceMode: o.petDanceMode || '',
      activePetDanceSlot: o.activePetDanceSlot
    };
  }
  function writeCrew(patch) {
    var base = {};
    try {
      var raw = localStorage.getItem(LS_CREW);
      if (raw) base = JSON.parse(raw) || {};
    } catch (e) { base = {}; }
    if (!base || typeof base !== 'object' || Array.isArray(base)) base = {};
    var next = { v: 1 };
    for (var k in base) next[k] = base[k];
    for (var p in patch) next[p] = patch[p];
    try { localStorage.setItem(LS_CREW, JSON.stringify(next)); } catch (e) { fault(e); }
    try {
      if (window.CREW_STATE && typeof window.CREW_STATE === 'object') {
        for (var q in next) window.CREW_STATE[q] = next[q];
      }
    } catch (e2) {}
    try {
      var ch = crewChannel();
      if (ch) ch.postMessage(JSON.parse(JSON.stringify(next)));
    } catch (e3) {}
    return next;
  }
  function danceOptKey(idx) { return 'slot' + ((idx | 0) + 1); }
  function petTitleName(crew) {
    var species = String(crew.pet || 'dog').toUpperCase();
    var nick = PET_NICK[crew.petColor];
    return nick ? species + ' (' + nick + ')' : species;
  }
  function petHeader(crew) { return 'MY PET (' + petTitleName(crew || readCrew()) + ') — CAMERA DANCE ANIMATION'; }
  function petSlotName(name, idx) {
    var n = String(name || '').trim();
    if (!n || /cyber\s*pup/i.test(n)) n = 'MY ' + String(readCrew().pet || 'dog').toUpperCase();
    void idx;
    return n.slice(0, 48);
  }
  function charLabel(crew) { return crew.char === 'boy' ? 'NEON MAN' : 'NEON WOMAN'; }
  function bindCharOpt(idx) {
    var slot = readStore().slots[idx];
    if (!slot || !slot.frames || !slot.frames.length) return null;
    return writeCrew({ charDanceOpt: danceOptKey(idx) });
  }
  function bindPetOpt(idx) {
    var slot = readPetStore().slots[idx];
    if (!slot || !slot.frames || !slot.frames.length) return null;
    return writeCrew({ petDanceMode: 'custom', activePetDanceSlot: idx | 0, petDanceOpt: danceOptKey(idx) });
  }
  function pickClassic() {
    if (isPetish() || state.intent === 'pet') writeCrew({ petDanceMode: 'classic', petDanceOpt: 'classic' });
    else writeCrew({ charDanceOpt: 'classic' });
    updateChrome();
  }
  function projectPt(p, cx, cy, ppm) {
    var x = p[0], y = p[1], z = p[2];
    var c = 0.8, s = 0.6;
    var xr = x * c + z * s;
    var zr = -x * s + z * c;
    return { x: cx + xr * ppm, y: cy - y * ppm + zr * ppm * 0.28, z: zr };
  }
  function stroke3(ax, ay, bx, by, col, w) {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.shadowColor = col;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  function petPartList(type) {
    var r = PET_RIG[type] || PET_RIG.dog;
    var tailR = r.tail === 'brush' ? r.tailR * 1.2 : r.tail === 'cotton' ? r.tailR * 0.7 : r.tailR * 0.6;
    var P = [['S', 'Hp', r.body], ['S', 'head', 0.03], ['head', 'head', r.head], ['head', 'snout', r.head * 0.45], ['tail0', 'tail1', r.tailR], ['tail1', 'tail2', tailR]];
    ['L', 'R'].forEach(function (k) {
      P.push(['ear' + k, 'earT' + k, r.ear === 'antenna' ? 0.007 : 0.018]);
      ['F', 'B'].forEach(function (f) {
        P.push(['leg' + f + k, 'knee' + f + k, 0.024]);
        P.push(['knee' + f + k, 'paw' + f + k, 0.02]);
      });
      if (r.wings) P.push(['wing' + k, 'wingT' + k, 0.02]);
    });
    return P;
  }
  function petJoints(q, type) {
    var R0 = PET_RIG[type] || PET_RIG.dog;
    q = q || {};
    var cy = Math.cos((q.yaw || 0) * DEG), sy = Math.sin((q.yaw || 0) * DEG);
    var cpi = Math.cos((q.pitch || 0) * DEG), spi = Math.sin((q.pitch || 0) * DEG);
    var pv = R0.leg;
    function W(v0) {
      var dy = v0[1] - pv, dz = v0[2];
      var v = [v0[0], pv + dy * cpi + dz * spi, -dy * spi + dz * cpi];
      return [(q.x || 0) + v[0] * cy + v[2] * sy, (q.y || 0) + v[1], (q.z || 0) - v[0] * sy + v[2] * cy];
    }
    var J = {}, L = R0.len, lg = R0.leg;
    var hy = lg * (1 - 0.35 * (q.tuck || 0)) + (q.bob || 0);
    var hipY = hy - (q.sit || 0) * lg * 0.72;
    var shY = hy + (q.sit || 0) * lg * 0.12 + (q.pawUp || 0) * 0.03;
    var S = [0, shY, L / 2 - (q.sit || 0) * 0.03];
    var Hp = [0, hipY, -L / 2 + (q.sit || 0) * 0.05];
    J.S = W(S); J.Hp = W(Hp);
    var lk = (q.look || 0) * DEG, tl = (q.tilt || 0) * DEG;
    var hd = [Math.sin(lk) * 0.05, shY + 0.075 + 0.02 * (q.sit || 0), S[2] + Math.cos(lk) * 0.05];
    J.head = W(hd);
    var fw = [Math.sin(lk), 0, Math.cos(lk)], sd = [Math.cos(lk), 0, -Math.sin(lk)];
    J.snout = W([hd[0] + fw[0] * R0.head * 0.95, hd[1] - 0.022, hd[2] + fw[2] * R0.head * 0.95]);
    [-1, 1].forEach(function (s) {
      var k = s < 0 ? 'L' : 'R';
      var ex = s * R0.head * 0.62 * Math.cos(tl);
      var ey = R0.head * 0.7 + s * Math.sin(tl) * R0.head * 0.4;
      var base = [hd[0] + sd[0] * ex, hd[1] + ey, hd[2] + sd[2] * ex - 0.01];
      J['ear' + k] = W(base);
      var eL = R0.earL * (1 - 0.65 * (q.earFold || 0));
      var tip = R0.ear === 'floppy'
        ? [base[0] + sd[0] * s * 0.045, base[1] - eL * 0.95, base[2] - 0.03]
        : R0.ear === 'antenna'
          ? [base[0] + sd[0] * s * 0.005, base[1] + eL, base[2] - 0.01]
          : [base[0] + sd[0] * s * 0.018, base[1] + eL, base[2] - (R0.ear === 'horn' ? 0.035 : 0.005)];
      J['earT' + k] = W(tip);
      J['eye' + k] = W([hd[0] + fw[0] * R0.head * 0.8 + sd[0] * s * R0.head * 0.38, hd[1] + 0.012, hd[2] + fw[2] * R0.head * 0.8 + sd[2] * s * R0.head * 0.38]);
      [['F', S, 0], ['B', Hp, 0.5]].forEach(function (spec) {
        var fr = spec[0], top = spec[1], off = spec[2];
        var ph = ((q.ph || 0) + off + (s > 0 ? 0.5 : 0)) * Math.PI * 2;
        var swng = Math.sin(ph) * (q.amp || 0) * 0.085;
        var lift = Math.max(0, Math.cos(ph)) * (q.amp || 0) * 0.045;
        var tx = s * R0.body * 0.65;
        var foot = [tx, lift + lg * 0.5 * (q.tuck || 0), top[2] + swng];
        if (fr === 'B' && q.sit > 0) foot = [foot[0] + (s * R0.body * 0.9 - foot[0]) * q.sit, foot[1] * (1 - q.sit), foot[2] + (top[2] + 0.09 - foot[2]) * q.sit];
        if (fr === 'F' && q.pawUp > 0) foot = [foot[0] + (s * 0.035 - foot[0]) * q.pawUp, foot[1] + (top[1] - 0.04 - foot[1]) * q.pawUp, foot[2] + (top[2] + 0.08 - foot[2]) * q.pawUp];
        if (fr === 'F') {
          var up = k === 'L' ? (q.pawL || 0) : (q.pawR || 0);
          if (up) foot = [foot[0] + (s * 0.04 - foot[0]) * up, foot[1] + (top[1] - 0.02 - foot[1]) * up, foot[2] + (top[2] + 0.1 - foot[2]) * up];
        }
        var t3 = [tx, top[1] - 0.01, top[2]];
        var kn = [(t3[0] + foot[0]) / 2, (t3[1] + foot[1]) / 2, (t3[2] + foot[2]) / 2 + (fr === 'F' ? -0.012 : 0.02)];
        J['leg' + fr + k] = W(t3);
        J['knee' + fr + k] = W(kn);
        J['paw' + fr + k] = W(foot);
      });
      if (R0.wings) {
        var flap = q.flap || 0;
        J['wing' + k] = W([s * 0.03, shY + 0.02, S[2] - 0.04]);
        J['wingT' + k] = W([s * (0.16 - 0.04 * flap), shY + 0.1 + 0.06 * flap, S[2] - 0.12]);
      }
    });
    var w = q.wag || 0;
    var upTail = (R0.tail === 'up' ? 1 : R0.tail === 'cotton' ? 0.15 : 0.35) * (1 - (q.tailDown || 0));
    var t1 = [w * 0.06, hipY + 0.05 + upTail * 0.06, Hp[2] - 0.07];
    var t2 = [w * 0.16, hipY + 0.04 + upTail * 0.18, Hp[2] - R0.tailL * (1 - upTail * 0.35)];
    J.tail0 = W([0, hipY + 0.01, Hp[2] - 0.02]);
    J.tail1 = W(t1);
    J.tail2 = W(t2);
    return J;
  }
  function petQ(frame, now) {
    frame = frame || {};
    var hop = +frame.hop || 0, wag = +frame.wag || 0, bow = +frame.bow || 0, sway = +frame.sway || 0;
    return {
      x: sway * 0.08, y: hop * 0.05, z: 0,
      yaw: (+frame.spin >= 0.5) ? ((now / 7) % 360) : sway * -28,
      pitch: -bow * 34, bob: hop * 0.02, wag: wag,
      pawL: +frame.pawL || 0, pawR: +frame.pawR || 0,
      sit: bow * 0.15, tuck: bow * 0.2, tilt: sway * 8, look: sway * 12,
      flap: 0.3 + hop * 0.7
    };
  }
  function groundJoints(J, keys) {
    var minY = 99;
    for (var i = 0; i < keys.length; i++) if (J[keys[i]]) minY = Math.min(minY, J[keys[i]][1]);
    if (minY > 90) return J;
    var out = {};
    for (var k in J) out[k] = [J[k][0], J[k][1] - minY, J[k][2]];
    return out;
  }
  function drawWirePet(cx, cy, ppm, frame, now, crew) {
    var type = crew.pet;
    var R0 = PET_RIG[type] || PET_RIG.dog;
    var J = groundJoints(petJoints(petQ(frame, now), type), ['pawFL', 'pawFR', 'pawBL', 'pawBR']);
    var parts = petPartList(type);
    var pts = {};
    for (var k in J) pts[k] = projectPt(J[k], cx, cy, ppm);
    var items = [];
    for (var i = 0; i < parts.length; i++) {
      var a = parts[i][0], b = parts[i][1];
      if (!pts[a] || !pts[b]) continue;
      items.push({ a: a, b: b, r: parts[i][2], z: (pts[a].z + pts[b].z) / 2 });
    }
    items.sort(function (u, v) { return u.z - v.z; });
    var col = crew.petColor;
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 34, 7, 0, 0, 6.3);
    ctx.fill();
    for (var n = 0; n < items.length; n++) {
      var it = items[n], A = pts[it.a], B = pts[it.b];
      if (it.a === it.b) {
        ctx.fillStyle = '#12051c';
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(A.x, A.y, Math.max(5, it.r * ppm), 0, 6.3);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else stroke3(A.x, A.y, B.x, B.y, col, Math.max(1.7, it.r * ppm * 1.8));
    }
    ['L', 'R'].forEach(function (side) {
      var e = pts['eye' + side];
      if (!e) return;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(e.x, e.y, Math.max(1.6, 0.02 * ppm), 0, 6.3);
      ctx.fill();
    });
    var sn = pts.snout, t2 = pts.tail2;
    if (R0.whiskers && sn) {
      ctx.strokeStyle = 'rgba(255,255,255,.9)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      for (var w = -1; w <= 1; w++) {
        ctx.beginPath();
        ctx.moveTo(sn.x, sn.y);
        ctx.lineTo(sn.x + 18, sn.y + w * 4);
        ctx.moveTo(sn.x, sn.y);
        ctx.lineTo(sn.x - 18, sn.y + w * 4);
        ctx.stroke();
      }
    }
    if (t2 && (R0.tail === 'cotton' || R0.whiteTip)) {
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(t2.x, t2.y, R0.tail === 'cotton' ? Math.max(6, R0.tailR * ppm * 1.7) : Math.max(3.5, R0.tailR * ppm * 0.65), 0, 6.3);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    if (t2 && R0.tail === 'spade') {
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(t2.x, t2.y - 9);
      ctx.lineTo(t2.x + 8, t2.y);
      ctx.lineTo(t2.x, t2.y + 10);
      ctx.lineTo(t2.x - 8, t2.y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  function drawCompanion(cx, cy, sc, pose, now, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    drawWirePet(cx, cy, 360 * (sc || 1), pose, now, readCrew());
    ctx.restore();
  }
  function charJoints(p, boy) {
    var shape = boy ? CREW_SHAPE.boy : CREW_SHAPE.girl;
    var B = CREW_B;
    p = p || {};
    var cy = Math.cos((p.yaw || 0) * DEG), sy = Math.sin((p.yaw || 0) * DEG);
    function W(lx, ly, lz) { return [(p.px || 0) + lx * cy + lz * sy, (p.py || 0) + ly, (p.pz || 0) - lx * sy + lz * cy]; }
    var rl = (p.roll || 0) * DEG;
    var up = [Math.sin(rl), Math.cos((p.lean || 0) * DEG) * Math.cos(rl), Math.sin((p.lean || 0) * DEG)];
    function add(a, d, l) { return [a[0] + d[0] * l, a[1] + d[1] * l, a[2] + d[2] * l]; }
    var pel = [p.sway || 0, 0, 0];
    var J = {};
    J.pel = W(pel[0], pel[1], pel[2]);
    var waist = add(pel, up, B.spine * 0.5);
    var chest = add(pel, up, B.spine);
    var nk = add(chest, up, B.chest);
    var hp = ((p.lean || 0) + (p.head || 0)) * DEG;
    var hdir = [0, Math.cos(hp), Math.sin(hp)];
    var hd = add(nk, hdir, B.neck);
    J.chest = W(chest[0], chest[1], chest[2]);
    J.neck = W(nk[0], nk[1], nk[2]);
    J.head = W(hd[0] + hdir[0] * B.head * 0.45, hd[1] + hdir[1] * B.head * 0.45, hd[2] + hdir[2] * B.head * 0.45);
    var tw = (p.twist || 0) * DEG, ct = Math.cos(tw), st = Math.sin(tw);
    function T(v) { return [nk[0] + (v[0] - nk[0]) * ct + (v[2] - nk[2]) * st, v[1], nk[2] - (v[0] - nk[0]) * st + (v[2] - nk[2]) * ct]; }
    [-1, 1].forEach(function (s) {
      var k = s < 0 ? 'L' : 'R';
      var hip = [pel[0] + s * shape.hip, -0.02, 0];
      var ha = (p['hip' + k] || 0) * DEG;
      var ka = ((p['hip' + k] || 0) - (p['knee' + k] || 0)) * DEG;
      var lo = s * 0.08;
      var kn = [hip[0] + Math.sin(lo) * B.thigh, hip[1] - Math.cos(ha) * B.thigh * Math.cos(lo), hip[2] + Math.sin(ha) * B.thigh];
      var an = [kn[0] + Math.sin(lo) * B.shin * 0.55, kn[1] - Math.cos(ka) * B.shin, kn[2] + Math.sin(ka) * B.shin];
      var toe = [an[0], an[1] - B.foot * 0.12, an[2] + B.foot * 0.8];
      J['hip' + k] = W(hip[0], hip[1], hip[2]);
      J['knee' + k] = W(kn[0], kn[1], kn[2]);
      J['ank' + k] = W(an[0], an[1], an[2]);
      J['toe' + k] = W(toe[0], toe[1], toe[2]);
      var shp = [nk[0] + s * shape.sh, nk[1] - 0.035, nk[2]];
      var sa = (p['sh' + k] || 0) * DEG;
      var ea = ((p['sh' + k] || 0) + (p['el' + k] || 8)) * DEG;
      var ao = ((p['ao' + k] || 0) + 6) * DEG * s;
      var el = [shp[0] + Math.sin(ao) * B.uarm, shp[1] - Math.cos(sa) * B.uarm * Math.cos(ao), shp[2] + Math.sin(sa) * B.uarm];
      var wr = [el[0] + Math.sin(ao) * B.farm * 0.45, el[1] - Math.cos(ea) * B.farm, el[2] + Math.sin(ea) * B.farm];
      var hn = [wr[0], wr[1] - Math.cos(ea) * B.hand * 0.7, wr[2] + Math.sin(ea) * B.hand * 0.7];
      function put(name, v) { var t = T(v); J[name] = W(t[0], t[1], t[2]); }
      put('sh' + k, shp); put('el' + k, el); put('wr' + k, wr); put('hand' + k, hn);
    });
    J._boy = boy ? 1 : 0;
    return J;
  }
  function danceToChar(frame, now) {
    frame = frame || {};
    var armL = clamp(+frame.armL || 0, 0, 1), armR = clamp(+frame.armR || 0, 0, 1);
    var legL = clamp(+frame.legL || 0, -1, 1), legR = clamp(+frame.legR || 0, -1, 1);
    var sway = clamp(+frame.sway || 0, -1, 1), bounce = clamp(+frame.bounce || 0, 0, 1);
    function sh(a) { return 6 + a * 158; }
    function el(a) { return a > 0.35 && a < 0.72 ? 78 : 14 + a * 24; }
    return {
      px: sway * 0.07, py: 0.94 + bounce * 0.05, pz: 0,
      yaw: (+frame.spin >= 0.5) ? ((now / 6) % 360) : sway * -18,
      lean: (0.45 - bounce) * 10, head: sway * -8, sway: sway * 0.03, roll: sway * 7, twist: sway * 10,
      hipL: legL * 34, hipR: legR * 34,
      kneeL: Math.abs(legL) * 42 + (1 - bounce) * 6,
      kneeR: Math.abs(legR) * 42 + (1 - bounce) * 6,
      shL: sh(armL), shR: sh(armR), elL: el(armL), elR: el(armR),
      aoL: (armL - 0.45) * 24, aoR: (armR - 0.45) * 24
    };
  }
  function accList(acc) {
    if (acc == null || acc === '' || acc === 'none' || acc === 'off') return [];
    if (Array.isArray(acc)) return acc.map(function (x) { return String(x).toLowerCase(); });
    if (typeof acc === 'object') return Object.keys(acc).filter(function (k) { return acc[k] && acc[k] !== 'none'; }).map(function (k) { return String(k).toLowerCase(); });
    return String(acc).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  }
  function drawAcc(list, pts, col, ppm) {
    var h = pts.head, sL = pts.shL, sR = pts.shR;
    if (!h) return;
    list.forEach(function (name) {
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 2;
      ctx.shadowColor = col;
      ctx.shadowBlur = 6;
      if (name === 'visor' || name === 'glasses' || name === 'shades') {
        stroke3(h.x - 10, h.y + 2, h.x + 10, h.y + 2, '#fff', 2.4);
      } else if (name === 'bow') {
        ctx.beginPath();
        ctx.moveTo(h.x - 4, h.y - 8);
        ctx.lineTo(h.x - 14, h.y - 14);
        ctx.lineTo(h.x - 12, h.y - 4);
        ctx.closePath();
        ctx.moveTo(h.x + 4, h.y - 8);
        ctx.lineTo(h.x + 14, h.y - 14);
        ctx.lineTo(h.x + 12, h.y - 4);
        ctx.closePath();
        ctx.fill();
      } else if (name === 'cap' || name === 'hat') {
        ctx.beginPath();
        ctx.arc(h.x, h.y - 2, Math.max(8, 0.07 * ppm), Math.PI, 0);
        ctx.stroke();
        stroke3(h.x - 8, h.y - 2, h.x + 16, h.y, col, 2);
      } else if (name === 'headphones' || name === 'cans') {
        ctx.beginPath();
        ctx.arc(h.x - 11, h.y, 4, 0, 6.3);
        ctx.arc(h.x + 11, h.y, 4, 0, 6.3);
        ctx.stroke();
        stroke3(h.x - 11, h.y - 4, h.x + 11, h.y - 6, col, 1.6);
      } else if (name === 'cape' || name === 'jacket') {
        if (sL && sR) {
          stroke3(sL.x, sL.y, sL.x - 8, sL.y + 36, col, 2);
          stroke3(sR.x, sR.y, sR.x + 8, sR.y + 36, col, 2);
        }
      } else if (name === 'crown') {
        ctx.beginPath();
        ctx.moveTo(h.x - 10, h.y - 8);
        ctx.lineTo(h.x - 6, h.y - 16);
        ctx.lineTo(h.x, h.y - 8);
        ctx.lineTo(h.x + 6, h.y - 16);
        ctx.lineTo(h.x + 10, h.y - 8);
        ctx.stroke();
      } else if (name === 'wings') {
        if (sL && sR) {
          stroke3(sL.x, sL.y, sL.x - 22, sL.y - 8, col, 2);
          stroke3(sR.x, sR.y, sR.x + 22, sR.y - 8, col, 2);
        }
      } else if (sL && sR) {
        stroke3((sL.x + sR.x) / 2 - 8, (sL.y + sR.y) / 2 + 8, (sL.x + sR.x) / 2 + 8, (sL.y + sR.y) / 2 + 10, '#ffe14d', 2);
      }
      ctx.shadowBlur = 0;
    });
  }
  function drawCrewChar(cx, cy, sc, pose, now, alpha) {
    var crew = readCrew();
    var boy = crew.char === 'boy';
    var shape = boy ? CREW_SHAPE.boy : CREW_SHAPE.girl;
    var J = groundJoints(charJoints(danceToChar(pose, now), boy), ['toeL', 'toeR', 'ankL', 'ankR']);
    var ppm = 92 * (sc || 1);
    var pts = {};
    for (var k in J) if (k.charAt(0) !== '_') pts[k] = projectPt(J[k], cx, cy, ppm);
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 22 * (sc || 1), 6, 0, 0, 6.3);
    ctx.fill();
    var col = crew.charColor;
    var segs = [
      ['hipL', 'kneeL', shape.leg], ['kneeL', 'ankL', shape.leg * 0.8], ['ankL', 'toeL', shape.leg * 0.55],
      ['hipR', 'kneeR', shape.leg], ['kneeR', 'ankR', shape.leg * 0.8], ['ankR', 'toeR', shape.leg * 0.55],
      ['shL', 'elL', shape.arm], ['elL', 'wrL', shape.arm * 0.85], ['wrL', 'handL', shape.arm * 0.6],
      ['shR', 'elR', shape.arm], ['elR', 'wrR', shape.arm * 0.85], ['wrR', 'handR', shape.arm * 0.6],
      ['pel', 'chest', boy ? 0.055 : 0.042], ['chest', 'neck', boy ? 0.03 : 0.024], ['neck', 'head', 0.02]
    ];
    for (var i = 0; i < segs.length; i++) {
      var A = pts[segs[i][0]], B = pts[segs[i][1]];
      if (A && B) stroke3(A.x, A.y, B.x, B.y, col, Math.max(1.6, segs[i][2] * ppm));
    }
    if (pts.head) {
      var hr = (boy ? 0.062 : 0.058) * ppm;
      ctx.fillStyle = '#12051c';
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.shadowColor = col;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(pts.head.x, pts.head.y, hr, 0, 6.3);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (boy) {
        stroke3(pts.head.x, pts.head.y - hr * 0.4, pts.head.x, pts.head.y - hr * 1.35, col, 2);
        stroke3(pts.head.x - hr * 0.45, pts.head.y - hr * 0.2, pts.head.x - hr * 0.9, pts.head.y - hr * 1.1, col, 1.6);
        stroke3(pts.head.x + hr * 0.45, pts.head.y - hr * 0.2, pts.head.x + hr * 0.9, pts.head.y - hr * 1.1, col, 1.6);
      } else {
        stroke3(pts.head.x, pts.head.y - hr * 0.2, pts.head.x - hr * 0.35, pts.head.y + hr * 0.9, col, 3);
        stroke3(pts.head.x - hr * 0.35, pts.head.y + hr * 0.9, pts.head.x + hr * 0.15, pts.head.y + hr * 2.1, col, 2.2);
      }
    }
    drawAcc(accList(crew.acc), pts, col, ppm);
    ctx.restore();
  }
  function drawFigure(cx, cy, sc, pose, now, alpha) {
    drawCrewChar(cx, cy, sc, pose, now, alpha);
    return;
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
    drawCompanion(cx, cy, (sc || 1) * 0.85, pose, now, alpha);
    return;
    pose = pose || {};
    var hop = pose.hop || 0;
    var wag = pose.wag || 0;
    var bow = pose.bow || 0;
    var sway = pose.sway || 0;
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.translate(cx + sway * 26 * sc, cy - hop * 40 * sc);
    ctx.rotate((pose.spin ? Math.sin(now / 80) * 0.55 : 0) + bow * 0.42);
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
  var ZONE_POS = [[0.22, 0.18], [0.78, 0.18], [0.20, 0.48], [0.80, 0.48], [0.28, 0.82], [0.72, 0.82]];
  function zoneArr(z) {
    var a = [];
    for (var i = 0; i < 6; i++) a.push(Math.round(((z && +z[ZONE_IDS[i]]) || 0) * 1000) / 1000);
    return a;
  }
  function zonesFromCharPose(p) {
    p = p || {};
    return [
      clamp(+p.armL || 0, 0, 1),
      clamp(+p.armR || 0, 0, 1),
      0,
      0,
      clamp(((+p.legL || 0) + 0.25) / 2, 0, 1),
      clamp(((+p.legR || 0) + 0.25) / 2, 0, 1)
    ];
  }
  function zonesFromPetPose(p) {
    p = p || {};
    var hop = clamp(+p.hop || 0, 0, 1);
    var sway = clamp(+p.sway || 0, -1, 1);
    return [
      clamp(hop * (0.55 - sway * 0.45), 0, 1),
      clamp(hop * (0.55 + sway * 0.45), 0, 1),
      clamp(+p.pawL || 0, 0, 1),
      clamp(+p.pawR || 0, 0, 1),
      clamp(+p.bow || 0, 0, 1),
      clamp(+p.bow || 0, 0, 1)
    ];
  }
  function centroidOf(zones) {
    var w = 0, cx = 0, cy = 0, i, e;
    for (i = 0; i < 6; i++) {
      e = +zones[i] || 0;
      w += e;
      cx += ZONE_POS[i][0] * e;
      cy += ZONE_POS[i][1] * e;
    }
    if (w > 0.001) { cx /= w; cy /= w; }
    else { cx = 0.5; cy = 0.55; w = 0; }
    var sx = 0, sy = 0;
    for (i = 0; i < 6; i++) {
      e = +zones[i] || 0;
      sx += e * Math.abs(ZONE_POS[i][0] - cx);
      sy += e * Math.abs(ZONE_POS[i][1] - cy);
    }
    var div = w > 0.001 ? w : 1;
    return {
      cx: Math.round(cx * 1000) / 1000,
      cy: Math.round(cy * 1000) / 1000,
      spreadX: Math.round((w > 0.001 ? sx / div : 0.2) * 1000) / 1000,
      spreadY: Math.round((w > 0.001 ? sy / div : 0.22) * 1000) / 1000
    };
  }
  function ensureSnap() {
    if (snapCan) return;
    snapCan = document.createElement('canvas');
    snapCan.width = 96;
    snapCan.height = 72;
    snapCtx = snapCan.getContext('2d');
  }
  function paintSilhouette(c, x, y, w, h, rec) {
    var zones = (rec && rec.zones) || [0, 0, 0, 0, 0, 0];
    var cols = ['#3ee6ff', '#ff4fd8', '#ffe14d', '#7dff6b', '#b45cff', '#ffb020'];
    c.save();
    c.fillStyle = '#100416';
    c.fillRect(x, y, w, h);
    for (var i = 0; i < 6; i++) {
      var e = +zones[i] || 0;
      if (e < 0.02) continue;
      c.fillStyle = cols[i];
      c.globalAlpha = 0.28 + e * 0.6;
      c.beginPath();
      c.arc(x + ZONE_POS[i][0] * w, y + ZONE_POS[i][1] * h, 3 + e * Math.min(w, h) * 0.14, 0, 6.3);
      c.fill();
    }
    c.globalAlpha = 1;
    var hx = x + ((rec && rec.cx) || 0.5) * w;
    var hy = y + ((rec && rec.cy) || 0.55) * h;
    c.strokeStyle = '#7dff6b';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(hx - 7, hy); c.lineTo(hx + 7, hy);
    c.moveTo(hx, hy - 7); c.lineTo(hx, hy + 7);
    c.stroke();
    c.strokeStyle = '#3ee6ff';
    c.lineWidth = Math.max(2, w * 0.02);
    c.lineCap = 'round';
    c.shadowColor = '#3ee6ff';
    c.shadowBlur = 8;
    if (rec && rec.kind === 'pet' && rec.pet) {
      var pet = rec.pet;
      var bodyY = y + h * (0.62 - (pet.hop || 0) * 0.18);
      c.beginPath();
      c.ellipse(x + w * 0.5, bodyY, w * 0.18, h * 0.16, 0, 0, 6.3);
      c.stroke();
      c.beginPath();
      c.arc(x + w * 0.66, bodyY - h * 0.16, h * 0.1, 0, 6.3);
      c.stroke();
      c.beginPath();
      c.moveTo(x + w * 0.34, bodyY);
      c.quadraticCurveTo(x + w * 0.16, bodyY - h * 0.22 * (pet.wag || 0), x + w * 0.12, bodyY + h * 0.04);
      c.stroke();
    } else {
      var p = (rec && rec.pose) || {};
      var headX = x + w * (0.5 + (p.sway || 0) * 0.08);
      var headY = y + h * (0.22 - ((p.bounce || 0.4) - 0.4) * 0.08);
      var hipX = x + w * (0.5 + (p.sway || 0) * 0.12);
      var hipY = y + h * 0.58;
      c.beginPath();
      c.arc(headX, headY, Math.max(4, h * 0.07), 0, 6.3);
      c.moveTo(headX, headY + h * 0.08);
      c.lineTo(hipX, hipY);
      c.moveTo(headX, headY + h * 0.16);
      c.lineTo(x + w * (0.28 - (p.armL || 0) * 0.12), y + h * (0.42 - (p.armL || 0) * 0.28));
      c.moveTo(headX, headY + h * 0.16);
      c.lineTo(x + w * (0.72 + (p.armR || 0) * 0.12), y + h * (0.42 - (p.armR || 0) * 0.28));
      c.moveTo(hipX, hipY);
      c.lineTo(x + w * (0.38 + (p.legL || 0) * 0.08), y + h * (0.9 - Math.max(0, p.legL || 0) * 0.16));
      c.moveTo(hipX, hipY);
      c.lineTo(x + w * (0.62 + (p.legR || 0) * 0.08), y + h * (0.9 - Math.max(0, p.legR || 0) * 0.16));
      c.stroke();
    }
    c.restore();
  }
  function jpgFor(rec) {
    try {
      ensureSnap();
      paintSilhouette(snapCtx, 0, 0, 96, 72, rec);
      return snapCan.toDataURL('image/jpeg', 0.62);
    } catch (e) { return ''; }
  }
  function pushTake(i, t, kind, pose, pet, zones) {
    var c = centroidOf(zones || [0, 0, 0, 0, 0, 0]);
    var rec = {
      i: i,
      t: t,
      kind: kind,
      pose: pose ? sanitizePose(pose, t) : null,
      pet: pet ? sanitizePet(pet, t) : null,
      zones: (zones || []).slice(),
      cx: c.cx,
      cy: c.cy,
      spreadX: c.spreadX,
      spreadY: c.spreadY,
      jpg: ''
    };
    rec.jpg = jpgFor(rec);
    takeFrames.push(rec);
    return rec;
  }
  function resetTake() { takeFrames.length = 0; }
  function fillTakeFromFrames(kind, frames) {
    resetTake();
    for (var i = 0; i < frames.length; i++) {
      var p = frames[i];
      var t = p.t;
      if (kind === 'pet') pushTake(i, t, 'pet', null, p, zonesFromPetPose(p));
      else pushTake(i, t, 'char', p, null, zonesFromCharPose(p));
    }
  }
  function sampleImprovePose(t) {
    var kind = state.improveKind === 'pet' ? 'pet' : 'char';
    if (state.cameraActive || zoneSum() > 0.04) {
      if (kind === 'pet') return { pet: petPoseFromZones(state.zoneEnergy, t), pose: null, zones: zoneArr(state.zoneEnergy) };
      return { pose: poseFromZones(state.zoneEnergy, t), pet: null, zones: zoneArr(state.zoneEnergy) };
    }
    if (kind === 'pet') {
      var pet = sanitizePet(petPreset('wiggle', t), t);
      return { pet: pet, pose: null, zones: zonesFromPetPose(pet) };
    }
    var pose = sanitizePose(presetPose('groove', t), t);
    return { pose: pose, pet: null, zones: zonesFromCharPose(pose) };
  }
  function openImprove(kind) {
    if (!state.open) api.open({});
    state.improveKind = kind === 'pet' ? 'pet' : 'char';
    state.improve = true;
    state.improvePhase = 'count';
    state.improveCount = 3;
    state.improveRecT = 0;
    state.improvePlay = false;
    state.improveIndex = 0;
    resetTake();
    updateChrome();
  }
  function closeImprove() {
    state.improve = false;
    state.improvePhase = 'idle';
    state.improvePlay = false;
    updateChrome();
  }
  function replayImprove() {
    if (!takeFrames.length) {
      openImprove(state.improveKind);
      return;
    }
    state.improvePhase = 'play';
    state.improvePlay = true;
    state.improveIndex = 0;
    updateChrome();
  }
  function downloadTune() {
    var slim = [];
    for (var i = 0; i < takeFrames.length; i++) {
      var f = takeFrames[i];
      slim.push({
        i: f.i, t: f.t, kind: f.kind, cx: f.cx, cy: f.cy,
        spreadX: f.spreadX, spreadY: f.spreadY, zones: f.zones, pose: f.pose, pet: f.pet
      });
    }
    try {
      var blob = new Blob([JSON.stringify({ version: 1, kind: state.improveKind, frames: slim })], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ellie-mirror-tune.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) { fault(e); }
    try {
      if (!canvas) return;
      var a2 = document.createElement('a');
      a2.href = canvas.toDataURL('image/png');
      a2.download = 'ellie-mirror-tune.png';
      document.body.appendChild(a2);
      a2.click();
      a2.remove();
    } catch (e2) {}
  }
  function stepImprove(dt) {
    var cap = 40;
    if (state.improvePhase === 'count') {
      state.improveCount -= dt;
      if (state.improveCount <= 0) {
        state.improvePhase = 'rec';
        state.improveRecT = 0;
        resetTake();
      }
    } else if (state.improvePhase === 'rec') {
      state.improveRecT += dt;
      while (takeFrames.length < cap && state.improveRecT + 1e-4 >= takeFrames.length * 0.1) {
        var i = takeFrames.length;
        var t = i === 0 ? 0 : i === cap - 1 ? 1 : i / (cap - 1);
        var s = sampleImprovePose(t);
        pushTake(i, t, state.improveKind === 'pet' ? 'pet' : 'char', s.pose, s.pet, s.zones);
      }
      if (takeFrames.length >= cap || state.improveRecT >= 4) {
        state.improvePhase = 'play';
        state.improvePlay = true;
        state.improveIndex = 0;
      }
    } else if (state.improvePlay && takeFrames.length) {
      state.improveIndex += dt / 0.1;
      if (state.improveIndex >= takeFrames.length) state.improveIndex = 0;
    }
  }
  function currentTake() {
    if (!takeFrames.length) return null;
    return takeFrames[clamp(Math.floor(state.improveIndex), 0, takeFrames.length - 1)];
  }
  function drawImproveView(L, now) {
    var S = L.stage;
    var top = L.head + 6;
    var bot = state.H - L.foot - 6;
    var ph = Math.max(70, bot - top);
    var gap = 12;
    var pw = (S.w - 16 - gap) / 2;
    var x1 = 8;
    var x2 = 8 + pw + gap;
    function pane(x, col) {
      ctx.save();
      ctx.fillStyle = 'rgba(8,2,18,.9)';
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.shadowColor = col;
      ctx.shadowBlur = 12;
      roundRect(x, top, pw, ph, 14);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    pane(x1, '#3ee6ff');
    pane(x2, '#ff4fd8');
    var rec = currentTake();
    if (!rec) {
      var tt = state.improvePhase === 'rec' ? clamp(state.improveRecT / 4, 0, 1) : 0;
      var s = sampleImprovePose(tt);
      var c = centroidOf(s.zones);
      rec = { kind: state.improveKind, pose: s.pose, pet: s.pet, zones: s.zones, cx: c.cx, cy: c.cy };
    }
    paintSilhouette(ctx, x1 + 8, top + 10, pw - 16, ph - 20, rec);
    var sc = Math.max(0.62, Math.min(1.05, pw / 280, ph / 230));
    if (state.improveKind === 'pet') drawPup(x2 + pw / 2, top + ph * 0.74, sc, rec.pet || livePetPose(now), now, 1);
    else drawFigure(x2 + pw / 2, top + ph * 0.8, sc, rec.pose || livePose(now), now, 1);
    if (state.improvePhase === 'count') {
      ctx.save();
      ctx.font = '900 64px Orbitron,sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffe14d';
      ctx.shadowBlur = 16;
      ctx.fillText(String(Math.max(1, Math.ceil(state.improveCount))), S.x + S.w / 2, top + ph / 2);
      ctx.restore();
    }
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
    if (state.improve) {
      drawImproveView(L, now);
      ctx.restore();
      return;
    }
    var showFrame = state.tab === 'stage' && (state.mode === 'align' || state.mode === 'countdown' || state.mode === 'countgo');
    if (showFrame) drawAlign(L);
    var pet = state.tab === 'pet' || isPetish();
    var studio = state.tab === 'char' || state.tab === 'pet';
    var showFig = studio || !state.cameraActive || state.userSim || state.mode === 'playback' || state.mode === 'recording' || state.mode === 'mocap' || state.mode === 'align' || state.mode === 'countdown' || pet;
    if ((state.mode === 'routine' || state.mode === 'freestyle') && !studio) showFig = !state.cameraActive || state.userSim;
    var avail = Math.max(120, state.H - L.head - L.foot);
    if (showFig && !pet) {
      var sc = studio ? Math.max(0.9, Math.min(1.25, avail / 260)) : Math.max(0.55, Math.min(S.w, S.h) / 420);
      var fy = studio ? (L.head + avail * 0.72) : (L.frame.y + L.frame.h * 0.62);
      var fx = studio ? (S.x + S.w * 0.5) : L.center.x;
      drawFigure(fx, fy, sc, livePose(now), now, state.cameraActive && !state.userSim && !studio ? 0.55 : 1);
    }
    if (!studio && (state.mode === 'routine' || state.mode === 'freestyle' || state.mode === 'align')) {
      drawPads(L, now);
      drawCues(L, now);
    }
    if (showFig && pet) {
      var psc = studio ? Math.max(0.85, Math.min(1.15, avail / 280)) : Math.max(0.55, Math.min(S.w, S.h) / 420);
      var fade = state.cameraActive && !state.userSim ? 0.92 : 1;
      var py = studio ? (L.head + avail * 0.7) : (L.center.y - 4);
      drawPup(S.x + S.w * 0.5, py, studio ? psc : psc * 1.15, livePetPose(now), now, fade);
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
    if (state.improve || state.tab !== 'stage' || isPetish()) return;
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
    if (state.improve || state.tab !== 'stage') return;
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
      ctx.save();
      ctx.font = '800 12px Orbitron,sans-serif';
      ctx.fillStyle = '#ff2a3d';
      ctx.textAlign = 'left';
      ctx.shadowColor = '#ff2a3d';
      ctx.shadowBlur = 8;
      ctx.fillText('REC', L.stage.x + 12, L.head + 28);
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
    var phrase = state.countMax <= 3
      ? '3… 2… 1… RECORDING!'
      : (state.countKind === 'pet' || state.countKind === 'record') ? '5… 4… 3… 2… 1… RECORDING!' : '5… 4… 3… 2… 1… DANCE!';
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
    var crewCard = readCrew();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 8px Orbitron,sans-serif';
    ctx.fillStyle = '#ffe14d';
    ctx.fillText('MY PET (' + petTitleName(crewCard) + ')', P.x + 10, P.y + 8);
    ctx.fillText('CAMERA DANCE ANIMATION', P.x + 10, P.y + 18);
    ctx.font = '700 8px Orbitron,sans-serif';
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
    return;
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
    var who = readCrew();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 10px Orbitron,sans-serif';
    ctx.fillStyle = '#ffe14d';
    ctx.fillText(charLabel(who), P.x + 10, P.y + 8);
    ctx.font = '700 8px Orbitron,sans-serif';
    ctx.fillStyle = '#ffb3e6';
    var cap = who.charDanceOpt === 'classic' ? '✨ CLASSIC DEFAULT DANCE' : state.mode === 'playback' ? ('PLAY · ' + (state.slotName || 'CUSTOM')) : state.mode === 'recording' ? 'RECORDING MO-CAP' : 'LIVE PREVIEW';
    ctx.fillText(cap + '  ·  ' + who.charColor.toUpperCase() + (who.acc ? '  ·  ' + String(who.acc).toUpperCase() : ''), P.x + 10, P.y + 22);
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
    if (state.improve) {
      stepImprove(dt);
    } else if (state.mode === 'align' || state.mode === 'mocap' || state.mode === 'pet') {
      var waveHot = state.wavePtr || state.waveEnergy >= WAVE_E;
      if (waveHot) state.waveHold += dt;
      else state.waveHold = Math.max(0, state.waveHold - dt * 0.85);
      if (state.waveHold >= 1) {
        state.waveHold = 0;
        state.wavePtr = false;
        state.countKind = (state.mode === 'pet' || state.intent === 'pet') ? 'pet' : (state.mode === 'mocap' || state.intent === 'record') ? 'record' : 'routine';
        state.mode = 'countdown';
        state.countMax = 5;
        state.countLeft = 5;
        updateChrome();
      }
    }
    if (!state.improve && state.mode === 'countdown') {
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
      var recMode = o && (o.record || o.mode || o.tab);
      if (recMode === 'char' || recMode === 'character' || recMode === 'record' || recMode === 'mocap') selectTab('char');
      else if (recMode === 'pet' || recMode === 'dog') selectTab('pet');
      else if (o && o.routineId) api.startRoutine(o.routineId);
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
        faults: state.faults.slice(),
        tab: state.tab,
        improve: !!state.improve,
        improveKind: state.improveKind,
        takeFrames: takeFrames.length
      };
    },
    startRoutine: function (routineId) {
      if (!state.open) api.open({});
      state.intent = 'routine';
      state.countKind = 'routine';
      state.tab = 'stage';
      if (state.improve) closeImprove();
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
      state.countMax = 5;
      state.countLeft = 5;
      state.countGo = 0;
      state.waveHold = 0;
      state.tab = 'char';
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
    bindCharOpt(idx);
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
      state.countMax = 5;
      state.countLeft = 5;
      state.countGo = 0;
      state.waveHold = 0;
      state.tab = 'pet';
      updateChrome();
      return true;
    },
    getCustomPetDance: function () {
      return JSON.parse(JSON.stringify(readPetStore()));
    },
    simulatePetMoCapRecording: function (presetName) {
      if (!state.open) api.open({});
      var name = String(presetName || petSlotName('', 0)).slice(0, 48);
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
      fillTakeFromFrames('pet', frames);
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
      fillTakeFromFrames('char', frames);
      updateChrome();
      return saved;
    },
    openCompareReplay: function (opts) {
      if (!state.open) api.open({});
      var o = opts || {};
      var kind = o.kind || ((isPetish() || state.intent === 'pet') ? 'pet' : 'char');
      state.improveKind = kind === 'pet' ? 'pet' : 'char';
      if (!takeFrames.length) {
        if (state.improveKind === 'pet' && state.petFrames && state.petFrames.length) fillTakeFromFrames('pet', state.petFrames);
        else if (state.moFrames && state.moFrames.length) fillTakeFromFrames('char', state.moFrames);
      }
      state.improve = true;
      state.improvePhase = 'play';
      var n = takeFrames.length || 1;
      var kf = o.kf != null ? (+o.kf || 1) : Math.min(n, 24);
      state.improveIndex = clamp(kf - 1, 0, Math.max(0, n - 1));
      state.improvePlay = !!o.play;
      updateChrome();
      return true;
    }
  };
  api._lastTakeFrames = takeFrames;

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
