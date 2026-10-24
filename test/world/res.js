'use strict';
// Kid-world resolution budget. Loaded before camera.js.
// The city canvas is already capped (iPad 1440×1080 at DPR 1, desktop 1280×720,
// phone min(devicePixelRatio, 2)). The 370Z sprite was not: X.render multiplied
// that logical size by devicePixelRatio again, and the /test warm-up rendered
// the shared GL canvas at 64px first. This file is the budget, the ?perf=1
// readout, and the clamp. It does not draw the car.
(function () {
  const CAP = 1440 * 1080;
  const DESK = 1280 * 720;
  const seen = Object.create(null);

  function touch() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }
  function ipadUA() {
    return /iPad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function fitBuf(w, h, dpr, cap) {
    let d = dpr;
    let bw = Math.max(1, Math.round(w * d));
    let bh = Math.max(1, Math.round(h * d));
    if (bw * bh > cap) {
      d = Math.sqrt(cap / (w * h || 1));
      bw = Math.max(1, Math.floor(w * d));
      bh = Math.max(1, Math.floor(h * d));
      while (bw * bh > cap && (bw > 1 || bh > 1)) {
        if (bw >= bh) bw--;
        else bh--;
      }
      d = Math.min(bw / w, bh / h);
    }
    return { dpr: d, bufW: bw, bufH: bh };
  }
  function classify(cssW, cssH) {
    const w = Math.max(1, cssW || window.innerWidth || 1);
    const h = Math.max(1, cssH || window.innerHeight || 1);
    const hasTouch = touch();
    const isDesktop = !hasTouch && w > 1024;
    const shortSide = Math.min(w, h), longSide = Math.max(w, h);
    const isIPad = hasTouch && (ipadUA() || (shortSide >= 680 && longSide >= 900));
    const device = window.devicePixelRatio || 1;
    let mode, cap, W, H, fit;
    if (isIPad) {
      mode = 'ipad'; cap = CAP;
      const scale = Math.min(1, Math.sqrt(cap / (w * h)));
      W = Math.max(1, Math.round(w * scale));
      H = Math.max(1, Math.round(h * scale));
      if (W * H > cap) {
        const s = Math.sqrt(cap / (W * H));
        W = Math.max(1, Math.floor(W * s));
        H = Math.max(1, Math.floor(H * s));
      }
      fit = { dpr: 1, bufW: W, bufH: H };
    } else if (!isDesktop) {
      mode = 'phone'; cap = CAP;
      W = w; H = h;
      fit = fitBuf(W, H, Math.min(device, 2), cap);
    } else {
      mode = 'desk'; cap = DESK;
      const scale = Math.min(1, Math.sqrt(cap / (w * h)));
      W = Math.max(1, Math.round(w * scale));
      H = Math.max(1, Math.round(h * scale));
      if (W * H > cap) {
        const s = Math.sqrt(cap / (W * H));
        W = Math.max(1, Math.floor(W * s));
        H = Math.max(1, Math.floor(H * s));
      }
      fit = { dpr: 1, bufW: W, bufH: H };
    }
    // The cap shrinks a page only when the uncapped backing would pass it.
    // Ellie's 1024×768 iPad is under 1440×1080, so the city stays the full page.
    const fullDpr = mode === 'phone' ? Math.min(device, 2) : 1;
    const fullW = Math.max(1, Math.round(w * fullDpr));
    const fullH = Math.max(1, Math.round(h * fullDpr));
    return {
      mode: mode, dpr: fit.dpr, W: W, H: H, cssW: w, cssH: h,
      bufW: fit.bufW, bufH: fit.bufH, device: device, cap: cap, area: w * h,
      capBinds: fit.bufW * fit.bufH + 1 < fullW * fullH
    };
  }

  function zResPlan() {
    return classify(window.innerWidth, window.innerHeight);
  }
  function zResView(cssW, cssH) {
    const plan = zResPlan();
    const w = Math.max(1, cssW || 1);
    const h = Math.max(1, cssH || 1);
    const sx = plan.bufW / Math.max(1, plan.cssW);
    const sy = plan.bufH / Math.max(1, plan.cssH);
    return fitBuf(w, h, Math.min(sx, sy) || plan.dpr || 1, plan.cap);
  }
  function round16(n) {
    return Math.max(32, Math.round(n / 16) * 16);
  }
  function zSpriteBudget(px) {
    const plan = zResPlan();
    let side = round16(Math.max(32, px * (plan.dpr || 1)));
    const long = Math.max(plan.bufW, plan.bufH, 32);
    if (side > long) side = Math.max(32, Math.floor(long / 16) * 16);
    const areaSide = Math.floor(Math.sqrt(plan.cap));
    if (side > areaSide) side = Math.max(32, Math.floor(areaSide / 16) * 16);
    return side;
  }
  // What the old sprite path allocated: logical size, then × min(devicePixelRatio, 2).
  function zSpriteRaw(px) {
    const o = Math.min(window.devicePixelRatio || 1, 2);
    return round16(px) * o;
  }
  function zResViol(name, w, h, maxW, maxH) {
    const sig = name + ':' + w + 'x' + h + '>' + maxW + 'x' + maxH;
    ZRES.log.push({ t: Math.round(performance.now()), name: name, w: w, h: h, maxW: maxW, maxH: maxH });
    if (ZRES.log.length > 40) ZRES.log.shift();
    if (!seen[sig]) {
      seen[sig] = 1;
      console.warn('[zres] ' + name + ' backing ' + w + '×' + h + ' over budget ' + maxW + '×' + maxH);
    }
  }
  function zResClampGl(X, side) {
    if (!X || !X.canvas || !X.renderer) return;
    const cw = X.canvas.width || 0, ch = X.canvas.height || 0;
    if (cw <= side && ch <= side) return;
    zResViol('car-gl', cw, ch, side, side);
    try {
      X.renderer.setPixelRatio(1);
      X.renderer.setSize(side, side, false);
      X._w = side; X._h = side; X._d = 1;
    } catch (e) {}
  }
  function zResNoteCanvas(name, canvas, maxW, maxH) {
    if (!canvas) return;
    const w = canvas.width || 0, h = canvas.height || 0;
    if (w > maxW + 1 || h > maxH + 1) zResViol(name, w, h, maxW, maxH);
  }
  function glSize(X) {
    let dw = 0, dh = 0;
    try {
      const gl = X && X.renderer && X.renderer.getContext && X.renderer.getContext();
      if (gl) { dw = gl.drawingBufferWidth || 0; dh = gl.drawingBufferHeight || 0; }
    } catch (e) {}
    return [dw, dh];
  }
  function carInfo() {
    try {
      if (typeof ZV === 'undefined' || !ZV) return null;
      return {
        px: ZV.dispPx || ZV.lastPx || 0,
        blit: ZV.cv ? [ZV.cv.width, ZV.cv.height] : [0, 0],
        frame: ZV.frame || 0
      };
    } catch (e) { return null; }
  }
  const ZRES = window.ZRES = {
    log: [],
    samples: {},
    phase: 'boot',
    on: /[?&]perf=1(?:&|$)/.test(location.search)
  };

  function snap(reason) {
    let plan;
    try { plan = zResPlan(); } catch (e) { return null; }
    ZRES.plan = plan;
    window.zResMaxSide = Math.max(plan.bufW, plan.bufH);
    const cv = document.getElementById('c');
    let cssW = 0, cssH = 0;
    if (cv) {
      const r = cv.getBoundingClientRect();
      cssW = Math.round(r.width); cssH = Math.round(r.height);
    }
    const X = window.ZD && window.ZD.Xray;
    const car = carInfo();
    const px = car ? car.px : 0;
    const rec = {
      t: Math.round(performance.now()),
      reason: reason,
      mode: plan.mode,
      device: +plan.device.toFixed(3),
      dpr: +plan.dpr.toFixed(3),
      cap: plan.cap,
      css: cssW + 'x' + cssH,
      logical: plan.W + 'x' + plan.H,
      planBuf: plan.bufW + 'x' + plan.bufH,
      canvas: cv ? (cv.width + 'x' + cv.height) : '0x0',
      carPx: px,
      blit: car ? (car.blit[0] + 'x' + car.blit[1]) : '0x0',
      gl: X && X.canvas ? (X.canvas.width + 'x' + X.canvas.height) : '0x0',
      drawBuf: glSize(X).join('x'),
      raw: px ? zSpriteRaw(px) : 0,
      budget: px ? zSpriteBudget(px) : 0,
      capBinds: !!plan.capBinds,
      viol: ZRES.log.length
    };
    ZRES.samples[reason] = rec;
    if (reason === 'vv' || reason === 'orient' || reason === 'settle') ZRES.samples.resize = rec;
    ZRES.last = rec;
    return rec;
  }

  function auditScreens() {
    const X = window.ZD && window.ZD.Xray;
    const nodes = document.querySelectorAll('canvas');
    for (let i = 0; i < nodes.length; i++) {
      const c = nodes[i];
      if (c.id === 'c') continue;
      const w = c.width || 0, h = c.height || 0;
      if (!w || !h) continue;
      // Tow-truck sheets are an atlas (7680×336). Clamping them to the screen
      // would break the cells. Log only if one grows past its own ceiling.
      if (w >= 2000 && h <= 800) {
        zResNoteCanvas(c.id || 'atlas', c, 8192, 4096);
        continue;
      }
      if (c.id === 'zCar' || (X && c === X.canvas)) continue;
      const rect = c.getBoundingClientRect();
      if (rect.width < 240 || rect.height < 160) continue;
      const box = zResView(rect.width, rect.height);
      if (w <= box.bufW + 2 && h <= box.bufH + 2) continue;
      zResViol(c.id || 'view', w, h, box.bufW, box.bufH);
      try { c.width = box.bufW; c.height = box.bufH; } catch (e) {}
    }
    // The player car uses this same pass. Its budget is the city pixel
    // density (so an iPad DPR-2 car cannot stay 960 on a DPR-1 page).
    // There is no second cap. Traffic sheets and the tow atlas are not the car.
    try {
      if (typeof ZV !== 'undefined' && ZV && ZV.dispPx) {
        const side = zSpriteBudget(ZV.dispPx);
        if (X && X.canvas && (X.canvas.width > side + 1 || X.canvas.height > side + 1)) zResClampGl(X, side);
        if (ZV.cv && (ZV.cv.width > side + 1 || ZV.cv.height > side + 1)) zResViol('car-blit', ZV.cv.width, ZV.cv.height, side, side);
      }
    } catch (e) {}
  }

  function paint() {
    if (!ZRES.on) return;
    let el = document.getElementById('zRes');
    if (!el) {
      const css = document.createElement('style');
      css.textContent = '#zRes{position:fixed;left:8px;top:8px;z-index:420;pointer-events:none;max-width:min(92vw,460px);padding:6px 8px;border:1px solid #3ee6ff;border-radius:8px;background:rgba(5,2,12,.88);color:#d7fff8;font:700 11px/1.35 ui-monospace,monospace;white-space:pre-wrap}';
      document.head.appendChild(css);
      el = document.createElement('div');
      el.id = 'zRes';
      el.setAttribute('aria-hidden', 'true');
      (document.body || document.documentElement).appendChild(el);
    }
    const s = ZRES.last || {};
    const a = ZRES.samples;
    const line = function (k) {
      const r = a[k];
      return k + ' ' + (r ? (r.canvas + ' css ' + r.css + ' gl ' + r.gl + ' dpr ' + r.dpr + '/' + r.device) : '—');
    };
    el.textContent = [
      'RES ' + (s.mode || '') + ' device ' + (s.device != null ? s.device : '') + ' applied ' + (s.dpr != null ? s.dpr : '') + ' cap ' + (s.capBinds ? 'binds' : 'off'),
      'cap ' + (s.cap || '') + ' plan ' + (s.planBuf || '') + ' #c ' + (s.canvas || '') + ' css ' + (s.css || ''),
      'car blit ' + (s.blit || '') + ' px ' + (s.carPx || 0) + ' budget ' + (s.budget || 0) + ' raw ' + (s.raw || 0) + (ZRES.layered ? ' layer' : ' copy'),
      'gl ' + (s.gl || '') + ' drawBuf ' + (s.drawBuf || '') + ' viol ' + (s.viol || 0),
      line('parse'),
      line('load'),
      line('input'),
      line('resize')
    ].join('\n');
  }

  function zResAfter(reason) {
    try {
      snap(reason || 'resize');
      auditScreens();
      paint();
    } catch (e) {}
  }

  let listened = false;
  function zResListen() {
    if (listened) return;
    listened = true;
    const fire = function (reason) {
      if (typeof resize === 'function') resize(reason);
      else zResAfter(reason);
    };
    window.addEventListener('orientationchange', function () { fire('orient'); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { fire('vv'); });
    const once = function () {
      ZRES.phase = 'input';
      fire('input');
      window.removeEventListener('pointerdown', once, true);
      window.removeEventListener('touchstart', once, true);
      window.removeEventListener('keydown', once, true);
    };
    window.addEventListener('pointerdown', once, true);
    window.addEventListener('touchstart', once, true);
    window.addEventListener('keydown', once, true);
    const t0 = performance.now();
    let n = 0;
    function settle() {
      n++;
      try {
        const plan = zResPlan();
        const cv = document.getElementById('c');
        if (cv && (cv.width > plan.bufW + 1 || cv.height > plan.bufH + 1)) fire('settle');
        else if (n === 1) snap('load');
      } catch (e) {}
      if (performance.now() - t0 < 1600) requestAnimationFrame(settle);
      else {
        try { snap('load'); } catch (e) {}
        if (ZRES.phase !== 'input') ZRES.phase = 'steady';
        paint();
      }
    }
    requestAnimationFrame(settle);
    if (ZRES.on) {
      const loop = function () {
        if (!ZRES.on) return;
        try { snap('live'); paint(); } catch (e) {}
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // The FPS branch leaves the Z on its own GL canvas (#zCar, or the shared
  // canvas once that canvas is in the page). Until that element is connected
  // the 2D copy stays, so the picture does not change ahead of their layer.
  function zCarLayer(X) {
    const named = document.getElementById('zCar');
    if (named && named.isConnected) return named;
    const c = X && X.canvas;
    if (c && c.isConnected && c.id !== 'c') return c;
    return null;
  }
  // Same rectangle drawZ used for drawImage: center (x, y) in city pixels,
  // square of `px`, rotated by `roll` radians. CSS only. The backing store
  // stays at the sprite budget; assigning canvas.width would drop WebGL.
  function zResPlaceCar(el, x, y, px, roll) {
    if (!el || !(px > 0)) return null;
    const city = document.getElementById('c');
    const cr = city ? city.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    let lw = cr.width, lh = cr.height;
    try {
      if (typeof W === 'number' && W > 0) lw = W;
      if (typeof H === 'number' && H > 0) lh = H;
    } catch (e) {}
    const sx = cr.width / Math.max(1, lw);
    const sy = cr.height / Math.max(1, lh);
    const size = px * ((sx + sy) / 2);
    const vx = cr.left + x * sx;
    const vy = cr.top + y * sy;
    const parent = el.offsetParent || document.documentElement;
    const pr = parent.getBoundingClientRect();
    el.style.position = 'absolute';
    el.style.left = (vx - pr.left) + 'px';
    el.style.top = (vy - pr.top) + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.marginLeft = (-size / 2) + 'px';
    el.style.marginTop = (-size / 2) + 'px';
    el.style.transformOrigin = 'center center';
    el.style.transform = 'rotate(' + (roll || 0) + 'rad)';
    el.style.pointerEvents = 'none';
    if (!el.style.zIndex) el.style.zIndex = '1';
    const X = window.ZD && window.ZD.Xray;
    const gl = X && X.canvas;
    if (gl && gl !== el && el.contains && el.contains(gl)) {
      gl.style.position = 'absolute';
      gl.style.left = '0';
      gl.style.top = '0';
      gl.style.right = 'auto';
      gl.style.bottom = 'auto';
      gl.style.width = '100%';
      gl.style.height = '100%';
      gl.style.margin = '0';
      gl.style.pointerEvents = 'none';
    }
    const box = {
      x: x, y: y, px: px, roll: roll || 0,
      css: Math.round(size),
      left: Math.round(vx), top: Math.round(vy)
    };
    ZRES.carBox = box;
    ZRES.layered = true;
    return box;
  }

  // Draw the GL car at exactly `rp` pixels (this budget, pixelRatio 1).
  // A buffer shorter than the budget is refused, so a warm-up cannot be
  // stretched over the car. When the GL size changes, the same frame is
  // rendered twice: some browsers still return the previous bitmap from
  // drawImage until the next present. copy === false skips the 2D cache
  // because the connected GL layer is the picture.
  function zPaintCar(X, rp, opts, copy) {
    if (!X || !X.ready || !(rp > 0)) return false;
    opts = opts || {};
    opts.pixelRatio = 1;
    opts.maxBuf = rp;
    opts.noDraw = true;
    const need = !X.canvas || X._w !== rp || X._h !== rp || X._d !== 1 || X.canvas.width < rp - 1 || X.canvas.height < rp - 1;
    X.render(ctx, 0, 0, rp, rp, opts);
    if (need) {
      try {
        const gl = X.renderer && X.renderer.getContext && X.renderer.getContext();
        if (gl) { gl.flush(); gl.finish(); }
      } catch (e) {}
      X.render(ctx, 0, 0, rp, rp, opts);
    }
    const src = X.canvas;
    if (!src || src.width < rp - 1 || src.height < rp - 1) {
      zResViol('car-short', src ? src.width : 0, src ? src.height : 0, rp, rp);
      return false;
    }
    if (src.width > rp + 1 || src.height > rp + 1) {
      zResViol('car-gl', src.width, src.height, rp, rp);
      zResClampGl(X, rp);
    }
    ZRES.car = { t: Math.round(performance.now()), gl: [src.width, src.height], rp: rp, d: X._d || 0, copy: copy !== false };
    ZRES.copied = copy !== false;
    if (copy !== false) {
      if (typeof ZV === 'undefined' || !ZV) return false;
      if (!ZV.cv) {
        ZV.cv = document.createElement('canvas');
        ZV.cvg = ZV.cv.getContext('2d', { alpha: true });
      }
      if (ZV.cv.width !== rp || ZV.cv.height !== rp) { ZV.cv.width = rp; ZV.cv.height = rp; }
      ZV.cvg.setTransform(1, 0, 0, 1, 0, 0);
      ZV.cvg.clearRect(0, 0, rp, rp);
      if (src.width !== rp || src.height !== rp) ZV.cvg.drawImage(src, 0, 0, src.width, src.height, 0, 0, rp, rp);
      else ZV.cvg.drawImage(src, 0, 0);
      ZV.sharp = rp;
    }
    if (ZRES.on) { try { snap('live'); paint(); } catch (e) {} }
    return true;
  }

  window.zResPlan = zResPlan;
  window.zResView = zResView;
  window.zSpriteBudget = zSpriteBudget;
  window.zSpriteRaw = zSpriteRaw;
  window.zResViol = zResViol;
  window.zResClampGl = zResClampGl;
  window.zResNoteCanvas = zResNoteCanvas;
  window.zResAfter = zResAfter;
  window.zResListen = zResListen;
  window.zResSnap = snap;
  window.zPaintCar = zPaintCar;
  window.zCarLayer = zCarLayer;
  window.zResPlaceCar = zResPlaceCar;
})();
