'use strict';
// Neon World buildings, windows, and neon edges on a private WebGL1 canvas.
// Query gate: ?gl=1. Default play stays on the 2D path in city-draw.js.
// ?glow=1 widens those edges with a server-replaceable kernel (world/gl-city-manifest.json).
// v30 building strokes are hard 1.2-2.4px edges, so the halo stays off unless ?glow=1.
// This file does not resize the shared car/traffic renderer (ZD.Xray) and does not
// set canvas caps, warm-up, or the car-sprite skip. See world/GL-CITY.md.
(function () {
  const q = new URLSearchParams(location.search);
  const enabled = q.get('gl') === '1';
  const glowOn = enabled && q.get('glow') === '1';
  const GLOW_PX = 7;

  const api = {
    version: 1,
    enabled: enabled,
    glow: glowOn,
    manifest: null,
    kernelImg: null,
    loadMs: 0,
    assetErr: '',
    error: '',
    fallback: enabled ? '' : 'off',
    lost: false,
    webgl: '',
    limits: null,
    statsFrame: emptyStats(),
    active: function () { return !!(enabled && gl && program && !api.lost && !api.error); },
    skipSolid: function (b) { return solid.has(b); },
    skipDyn: function (o) { return dyn.has(o); },
    compose: compose,
    beginUnder: beginUnder,
    beginOver: beginOver,
    withUnder: withUnder,
    stats: function () {
      const s = {};
      for (const k in api.statsFrame) s[k] = api.statsFrame[k];
      s.on = enabled;
      s.ready = api.active();
      s.glow = glowOn;
      s.webgl = api.webgl;
      s.loadMs = api.loadMs;
      s.assetErr = api.assetErr;
      s.fallback = api.fallback;
      s.lost = api.lost;
      s.error = api.error;
      s.limits = api.limits;
      s.manifest = api.manifest ? { version: api.manifest.version, assets: (api.manifest.assets || []).length } : null;
      return s;
    }
  };

  let gl = null, cv = null, backCv = null, backCtx = null, topCtx = null;
  let program = null, lineProg = null, spriteProg = null;
  let fillBuf, lineBuf, spriteBuf, kernelTex = null;
  let fillN = 0, lineN = 0, spriteN = 0;
  let fillArr = new Float32Array(4096);
  let lineArr = new Float32Array(8192);
  let spriteArr = new Float32Array(2048);
  const spriteRec = [];
  const texByCanvas = new Map();
  const texOrder = [];
  const solid = new Set();
  const dyn = new Set();
  const FILL_STRIDE = 7;
  const LINE_STRIDE = 17;
  const SPRITE_STRIDE = 9;
  const FAR_Z = 4000;
  // Line quad corners, hoisted so a window dash does not allocate six arrays.
  const LINE_PAT = [0, 1, 0, -1, 1, 1, 0, -1, 1, -1, 1, 1];
  const FACE_XL = [0, 3, 7, 4];
  const FACE_XR = [1, 2, 6, 5];
  const FACE_ZL = [0, 1, 5, 4];
  const FACE_ZR = [3, 2, 6, 7];
  const FACE_TOP = [4, 5, 6, 7];
  const FACE_BOT = [0, 1, 2, 3];
  const CORNER = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const EA = [0, 0, 0], EB = [0, 0, 0], MID = [0, 0, 0], SEG = [null, null];
  const FILL_HILL = [5 / 255, 16 / 255, 10 / 255];
  const FILL_BLDG = [10 / 255, 6 / 255, 18 / 255];
  const DASH_LONG = [6, 11];
  const DASH_SHORT = [4, 8];
  const C0 = [0, 0, 0];
  const SPR_PT = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const SPR_TRI = [0, 1, 2, 0, 2, 3];
  const SPR_OFF = [[-1, -1, 0, 1], [1, -1, 1, 1], [1, 1, 1, 0], [-1, 1, 0, 0]];
  const faceList = [];
  const pool = [];
  let pooli = 0;
  let basisOk = false;
  let bxx = 1, bxy = 0, bxz = 0, byx = 0, byy = 1, byz = 0, bzx = 0, bzy = 0, bzz = 1;
  let loc = null;
  let sizedW = 0, sizedH = 0;
  const hexCache = new Map();
  const recPool = [];
  let recN = 0;

  function emptyStats() {
    return {
      buildings: 0, faces: 0, segs: 0, windows: 0, sprites: 0,
      submitMs: 0, gpuMs: 0, blitMs: 0, composeMs: 0
    };
  }

  function hexToRgb(hex) {
    const hit = hexCache.get(hex);
    if (hit) return hit;
    let rgb;
    if (!hex || hex.charAt(0) !== '#') rgb = [0.24, 0.90, 1];
    else {
      let h = hex.slice(1);
      if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      const n = parseInt(h, 16);
      rgb = !(n >= 0) ? [0.24, 0.90, 1] : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    hexCache.set(hex, rgb);
    return rgb;
  }

  function alloc3() {
    let a = pool[pooli];
    if (!a) { a = [0, 0, 0]; pool[pooli] = a; }
    pooli++;
    return a;
  }

  // Same transform as camS, written into a reused vector. Trig is cached once
  // per frame so a few thousand corners do not allocate or recompute it.
  function refreshBasis() {
    if (typeof camStabilizeFlightPitch === 'function') camStabilizeFlightPitch();
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    const cp = Math.cos(-cam.pitch), sp = Math.sin(-cam.pitch);
    const cr = Math.cos(cam.roll), sr = Math.sin(cam.roll);
    bxx = cy * cr + sy * sp * sr; bxy = -cp * sr; bxz = -sy * cr + cy * sp * sr;
    byx = cy * sr - sy * sp * cr; byy = cp * cr; byz = -sy * sr - cy * sp * cr;
    bzx = sy * cp; bzy = sp; bzz = cy * cp;
    basisOk = true;
  }

  function camInto(out, x, y, z) {
    if (!basisOk) refreshBasis();
    const dx = x - cam.x, dy = y - cam.y, dz = z - cam.z;
    out[0] = dx * bxx + dy * bxy + dz * bxz;
    out[1] = dx * byx + dy * byy + dz * byz;
    out[2] = dx * bzx + dy * bzy + dz * bzz;
    return out;
  }

  function resetStats(s) {
    s.buildings = 0; s.faces = 0; s.segs = 0; s.windows = 0; s.sprites = 0;
    s.submitMs = 0; s.gpuMs = 0; s.blitMs = 0; s.composeMs = 0;
    return s;
  }

  function grow(arr, need) {
    if (arr.length >= need) return arr;
    let n = arr.length;
    while (n < need) n *= 2;
    const next = new Float32Array(n);
    next.set(arr);
    return next;
  }

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh) || 'shader';
      gl.deleteShader(sh);
      throw new Error(log);
    }
    return sh;
  }

  function link(vsSrc, fsSrc, binds) {
    const p = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    if (binds) for (let i = 0; i < binds.length; i++) gl.bindAttribLocation(p, i, binds[i]);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    return p;
  }

  const FILL_VS = [
    'attribute vec3 aCam;',
    'attribute vec4 aCol;',
    'uniform vec2 uWH;',
    'uniform float uF;',
    'uniform float uNear;',
    'uniform float uFar;',
    'varying vec4 vCol;',
    'void main(){',
    '  float Z=max(aCam.z,uNear);',
    '  float ndcX=2.0*aCam.x*uF/(Z*uWH.x);',
    '  float ndcY=2.0*aCam.y*uF/(Z*uWH.y);',
    '  float winZ=clamp((Z-uNear)/(uFar-uNear),0.0,1.0);',
    '  // w = Z collapses a wall of constant camera-x to a zero-area clip triangle.',
    '  // That wall still covers pixels after the divide, so the fill has to be',
    '  // submitted in screen space. Depth stays the same window z as before.',
    '  gl_Position=vec4(ndcX,ndcY,winZ*2.0-1.0,1.0);',
    '  vCol=aCol;',
    '}'
  ].join('\n');

  const FILL_FS = [
    'precision mediump float;',
    'varying vec4 vCol;',
    'void main(){ gl_FragColor=vec4(vCol.rgb*vCol.a,vCol.a); }'
  ].join('\n');

  const LINE_VS = [
    'attribute vec3 aA;',
    'attribute vec3 aB;',
    'attribute vec4 aMisc;',
    'attribute vec4 aCol;',
    'attribute vec2 aDash;',
    'attribute float aCross;',
    'uniform vec2 uWH;',
    'uniform float uF;',
    'uniform float uNear;',
    'uniform float uFar;',
    'varying vec4 vCol;',
    'varying float vAlong;',
    'varying float vDashOn;',
    'varying float vDashPer;',
    'varying float vCross;',
    'void main(){',
    '  float Za=max(aA.z,uNear), Zb=max(aB.z,uNear);',
    '  vec2 sa=vec2(uWH.x*0.5+aA.x*uF/Za, uWH.y*0.5-aA.y*uF/Za);',
    '  vec2 sb=vec2(uWH.x*0.5+aB.x*uF/Zb, uWH.y*0.5-aB.y*uF/Zb);',
    '  vec2 d=sb-sa;',
    '  float len=length(d);',
    '  vec2 dir=len>0.001?d/len:vec2(1.0,0.0);',
    '  vec2 nrm=vec2(-dir.y,dir.x);',
    '  float side=aMisc.x, end=aMisc.y, halfW=aMisc.w;',
    '  vec2 s=(end>0.5?sb:sa)+dir*(end>0.5?halfW:-halfW)+nrm*side*halfW;',
    '  float Z=max(end>0.5?aB.z:aA.z, uNear);',
    '  float ndcX=s.x/uWH.x*2.0-1.0;',
    '  float ndcY=1.0-s.y/uWH.y*2.0;',
    '  float winZ=clamp((Z-uNear)/(uFar-uNear),0.0,1.0)-0.00004;',
    '  gl_Position=vec4(ndcX*Z,ndcY*Z,(winZ*2.0-1.0)*Z,Z);',
    '  vCol=aCol;',
    '  vAlong=aMisc.z;',
    '  vDashOn=aDash.x;',
    '  vDashPer=aDash.y;',
    '  vCross=aCross;',
    '}'
  ].join('\n');

  const LINE_FS = [
    'precision mediump float;',
    'varying vec4 vCol;',
    'varying float vAlong;',
    'varying float vDashOn;',
    'varying float vDashPer;',
    'varying float vCross;',
    'uniform float uCore;',
    'void main(){',
    '  if(vDashPer>0.5){',
    '    float m=mod(vAlong,vDashPer);',
    '    if(m>vDashOn) discard;',
    '  }',
    '  float a=vCol.a;',
    '  float x=abs(vCross);',
    '  if(uCore<0.999){',
    '    float halo=x<=uCore?1.0:(1.0-(x-uCore)/max(0.001,1.0-uCore));',
    '    a*=halo;',
    '  }else{',
    '    // Canvas strokes fade across the outer half of the quad. A hard edge',
    '    // paints a full extra pixel, which reads as a line across the car.',
    '    a*=1.0-smoothstep(0.72,1.0,x);',
    '  }',
    '  if(a<0.004) discard;',
    '  gl_FragColor=vec4(vCol.rgb*a,a);',
    '}'
  ].join('\n');

  const SPRITE_VS = [
    'attribute vec2 aS;',
    'attribute float aZ;',
    'attribute vec2 aUv;',
    'attribute vec4 aCol;',
    'uniform vec2 uWH;',
    'uniform float uNear;',
    'uniform float uFar;',
    'varying vec2 vUv;',
    'varying vec4 vCol;',
    'void main(){',
    '  float Z=max(aZ,uNear);',
    '  float ndcX=aS.x/uWH.x*2.0-1.0;',
    '  float ndcY=1.0-aS.y/uWH.y*2.0;',
    '  float winZ=clamp((Z-uNear)/(uFar-uNear),0.0,1.0);',
    '  gl_Position=vec4(ndcX*Z,ndcY*Z,(winZ*2.0-1.0)*Z,Z);',
    '  vUv=aUv; vCol=aCol;',
    '}'
  ].join('\n');

  const SPRITE_FS = [
    'precision mediump float;',
    'varying vec2 vUv;',
    'varying vec4 vCol;',
    'uniform sampler2D uTex;',
    'void main(){',
    '  vec4 t=texture2D(uTex,vUv);',
    '  float a=t.a*vCol.a;',
    '  if(a<0.004) discard;',
    '  gl_FragColor=vec4(t.rgb*a,a);',
    '}'
  ].join('\n');

  function init() {
    if (!enabled || gl) return;
    const top = document.getElementById('c');
    const host = top && top.parentNode;
    if (!host) { api.fallback = 'no-host'; api.error = 'no-host'; return; }
    backCv = document.createElement('canvas');
    backCv.id = 'cback';
    backCv.setAttribute('aria-hidden', 'true');
    backCv.style.pointerEvents = 'none';
    cv = document.createElement('canvas');
    cv.id = 'cgl';
    cv.setAttribute('aria-hidden', 'true');
    cv.style.pointerEvents = 'none';
    // #cback (sky, ground), #cgl (buildings), #c (deco, car, HUD). No readback blit.
    host.insertBefore(backCv, top);
    host.insertBefore(cv, top);
    backCtx = backCv.getContext('2d', { alpha: false });
    const attrs = {
      alpha: true, depth: true, stencil: false, antialias: false,
      premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance'
    };
    gl = cv.getContext('webgl', attrs) || cv.getContext('experimental-webgl', attrs);
    if (!gl) { api.fallback = 'no-webgl1'; api.error = 'no-webgl1'; return; }
    cv.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      api.lost = true;
      api.fallback = 'context-lost';
      solid.clear();
      dyn.clear();
    }, false);
    try {
      program = link(FILL_VS, FILL_FS, ['aCam', 'aCol']);
      lineProg = link(LINE_VS, LINE_FS, ['aA', 'aB', 'aMisc', 'aCol', 'aDash', 'aCross']);
      spriteProg = link(SPRITE_VS, SPRITE_FS, ['aS', 'aZ', 'aUv', 'aCol']);
    } catch (e) {
      api.error = String(e && e.message || e);
      api.fallback = 'shader';
      gl = null;
      return;
    }
    fillBuf = gl.createBuffer();
    lineBuf = gl.createBuffer();
    spriteBuf = gl.createBuffer();
    cacheLocs();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    api.webgl = String(gl.getParameter(gl.VERSION) || '');
    api.limits = {
      webgl1: api.webgl.indexOf('WebGL 1') >= 0 || api.webgl.indexOf('WebGL 1.0') >= 0 || !/WebGL 2/.test(api.webgl),
      version: api.webgl,
      glsl: String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || ''),
      maxTexture: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      renderer: dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '',
      vendor: dbg ? String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '') : ''
    };
    // WebGL1 context from getContext('webgl') is not WebGL2. Record that explicitly.
    api.limits.webgl1 = typeof WebGL2RenderingContext === 'undefined' || !(gl instanceof WebGL2RenderingContext);
    loadAssets();
  }

  function loadAssets() {
    const t0 = performance.now();
    fetch('world/gl-city-manifest.json', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('manifest ' + r.status);
      return r.json();
    }).then(function (man) {
      api.manifest = man;
      const assets = man && man.assets || [];
      let pending = 0;
      for (let i = 0; i < assets.length; i++) {
        const a = assets[i];
        if (!a || a.kind !== 'image' || !a.url) continue;
        pending++;
        const img = new Image();
        img.onload = function () {
          if (a.id === 'glow-kernel') api.kernelImg = img;
          pending--;
          if (!pending) api.loadMs = performance.now() - t0;
        };
        img.onerror = function () {
          api.assetErr = a.id || 'asset';
          pending--;
          if (!pending) api.loadMs = performance.now() - t0;
        };
        img.src = a.url;
      }
      if (!pending) api.loadMs = performance.now() - t0;
    }).catch(function (e) {
      api.assetErr = String(e && e.message || e);
      api.loadMs = performance.now() - t0;
    });
  }

  function mirrorCss(node) {
    const top = document.getElementById('c');
    if (!node || !top) return;
    node.style.width = top.style.width;
    node.style.height = top.style.height;
  }

  function size2d(canvas, context) {
    const dw = Math.max(1, (W | 0) * (DPR || 1));
    const dh = Math.max(1, (H | 0) * (DPR || 1));
    if (canvas.width !== dw || canvas.height !== dh) {
      canvas.width = dw;
      canvas.height = dh;
    }
    context.setTransform(DPR || 1, 0, 0, DPR || 1, 0, 0);
  }

  function resize() {
    const dw = Math.max(1, (W | 0) * (DPR || 1));
    const dh = Math.max(1, (H | 0) * (DPR || 1));
    if (cv.width !== dw || cv.height !== dh) {
      cv.width = dw;
      cv.height = dh;
      sizedW = 0;
    }
    if (sizedW === dw && sizedH === dh) return;
    mirrorCss(cv);
    if (backCv && backCtx) {
      mirrorCss(backCv);
      size2d(backCv, backCtx);
    }
    gl.viewport(0, 0, cv.width, cv.height);
    sizedW = dw;
    sizedH = dh;
  }

  // Sky and ground draw into #cback, under the WebGL canvas.
  function beginUnder() {
    if (!api.active() || !backCtx || typeof ctx === 'undefined') return false;
    topCtx = ctx;
    ctx = backCtx;
    resize();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W || 1, H || 1);
    return true;
  }

  // Deco, the car, and the HUD draw into #c, above the WebGL canvas.
  function beginOver() {
    if (!topCtx) return;
    ctx = topCtx;
    topCtx = null;
    ctx.setTransform(DPR || 1, 0, 0, DPR || 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W || 1, H || 1);
  }

  // One callback on #cback, then the painter returns to #c. Used so a nearer
  // wall covers a street line with the same fill the 2D path already uses.
  function withUnder(fn) {
    if (!backCtx || typeof ctx === 'undefined' || typeof fn !== 'function') return;
    const prev = ctx;
    ctx = backCtx;
    try { fn(); }
    finally { ctx = prev; }
  }

  // Locations are queried once. Asking every frame flushes the GL queue and
  // is a stall on a phone once the GPU is behind.
  function cacheLocs() {
    function prog(p, attribs, uniforms) {
      const a = {}, u = {};
      for (let i = 0; i < attribs.length; i++) a[attribs[i]] = gl.getAttribLocation(p, attribs[i]);
      for (let i = 0; i < uniforms.length; i++) u[uniforms[i]] = gl.getUniformLocation(p, uniforms[i]);
      return { a: a, u: u };
    }
    loc = {
      fill: prog(program, ['aCam', 'aCol'], ['uWH', 'uF', 'uNear', 'uFar']),
      line: prog(lineProg, ['aA', 'aB', 'aMisc', 'aCol', 'aDash', 'aCross'], ['uWH', 'uF', 'uNear', 'uFar', 'uCore']),
      sprite: prog(spriteProg, ['aS', 'aZ', 'aUv', 'aCol'], ['uWH', 'uNear', 'uFar', 'uTex'])
    };
  }

  function bindPtr(index, size, stride, off) {
    if (index < 0) return;
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, off);
  }

  function bindFillAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, fillBuf);
    const s = FILL_STRIDE * 4;
    bindPtr(loc.fill.a.aCam, 3, s, 0);
    bindPtr(loc.fill.a.aCol, 4, s, 12);
  }

  function bindLineAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
    const s = LINE_STRIDE * 4;
    const a = loc.line.a;
    bindPtr(a.aA, 3, s, 0);
    bindPtr(a.aB, 3, s, 12);
    bindPtr(a.aMisc, 4, s, 24);
    bindPtr(a.aCol, 4, s, 40);
    bindPtr(a.aDash, 2, s, 56);
    bindPtr(a.aCross, 1, s, 64);
  }

  function bindSpriteAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuf);
    const s = SPRITE_STRIDE * 4;
    const a = loc.sprite.a;
    bindPtr(a.aS, 2, s, 0);
    bindPtr(a.aZ, 1, s, 8);
    bindPtr(a.aUv, 2, s, 12);
    bindPtr(a.aCol, 4, s, 20);
  }

  function uniforms(bag, core) {
    const u = bag.u;
    gl.uniform2f(u.uWH, W || 1, H || 1);
    if (u.uF) gl.uniform1f(u.uF, (H || 1) * 0.9);
    gl.uniform1f(u.uNear, typeof NEAR === 'number' ? NEAR : 0.5);
    gl.uniform1f(u.uFar, FAR_Z);
    if (u.uCore) gl.uniform1f(u.uCore, core);
  }

  // Orphan the buffer, then upload only the used floats. Writing a buffer the
  // GPU is still drawing stalls the next frame on a phone.
  function uploadDyn(buf, arr, nFloats) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, arr.buffer.byteLength, gl.DYNAMIC_DRAW);
    if (nFloats) gl.bufferSubData(gl.ARRAY_BUFFER, 0, arr.subarray(0, nFloats));
  }

  function pushFill(poly, rgb, alpha) {
    if (poly.length < 3) return;
    const need = (fillN + (poly.length - 2) * 3) * FILL_STRIDE;
    fillArr = grow(fillArr, need);
    const p0 = poly[0];
    for (let i = 1; i < poly.length - 1; i++) {
      const pa = poly[i], pb = poly[i + 1];
      const tri0 = p0, tri1 = pa, tri2 = pb;
      for (let k = 0; k < 3; k++) {
        const o = fillN * FILL_STRIDE;
        const p = k === 0 ? tri0 : (k === 1 ? tri1 : tri2);
        fillArr[o] = p[0]; fillArr[o + 1] = p[1]; fillArr[o + 2] = p[2];
        fillArr[o + 3] = rgb[0]; fillArr[o + 4] = rgb[1]; fillArr[o + 5] = rgb[2]; fillArr[o + 6] = alpha;
        fillN++;
      }
    }
  }

  function clipNear(poly) {
    const near = typeof NEAR === 'number' ? NEAR : 0.5;
    const o = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ai = a[2] >= near, bi = b[2] >= near;
      if (ai) o.push(a);
      if (ai !== bi) {
        const dz = b[2] - a[2];
        if (!dz) continue;
        const t = (near - a[2]) / dz;
        const m = alloc3();
        m[0] = a[0] + (b[0] - a[0]) * t; m[1] = a[1] + (b[1] - a[1]) * t; m[2] = near;
        o.push(m);
      }
    }
    return o;
  }

  // A corner just in front of the camera projects to a huge screen position.
  // The 2D painter cuts that face to a pad outside the canvas. WebGL1 drops the
  // uncut triangle, which leaves a wire box and the street line showing through.
  function clipScreen(poly) {
    if (!poly || poly.length < 3) return [];
    const f = (H || 1) * 0.9;
    const pad = 12;
    const sx = ((W || 1) * 0.5 + pad) / f;
    const sy = ((H || 1) * 0.5 + pad) / f;
    const planes = [[1, 0, -sx], [-1, 0, -sx], [0, 1, -sy], [0, -1, -sy]];
    let cur = poly;
    for (let p = 0; p < planes.length; p++) {
      const A = planes[p][0], B = planes[p][1], C = planes[p][2];
      const next = [];
      for (let i = 0; i < cur.length; i++) {
        const a = cur[i], b = cur[(i + 1) % cur.length];
        const da = A * a[0] + B * a[1] + C * a[2];
        const db = A * b[0] + B * b[1] + C * b[2];
        const ain = da <= 1e-6, bin = db <= 1e-6;
        if (ain && bin) next.push(b);
        else if (ain !== bin) {
          const den = da - db;
          if (den) {
            const t = da / den;
            const m = alloc3();
            m[0] = a[0] + (b[0] - a[0]) * t; m[1] = a[1] + (b[1] - a[1]) * t; m[2] = a[2] + (b[2] - a[2]) * t;
            next.push(m);
          }
          if (bin) next.push(b);
        }
      }
      cur = next;
      if (cur.length < 3) return [];
    }
    return cur;
  }

  function clipSeg(a, b) {
    const near = typeof NEAR === 'number' ? NEAR : 0.5;
    if (a[2] < near && b[2] < near) return null;
    if (a[2] >= near && b[2] >= near) { SEG[0] = a; SEG[1] = b; return SEG; }
    const dz = b[2] - a[2];
    if (!dz) return null;
    const t = (near - a[2]) / dz;
    if (!(t >= 0 && t <= 1)) return null;
    MID[0] = a[0] + (b[0] - a[0]) * t; MID[1] = a[1] + (b[1] - a[1]) * t; MID[2] = near;
    if (a[2] < near) { SEG[0] = MID; SEG[1] = b; }
    else { SEG[0] = a; SEG[1] = MID; }
    return SEG;
  }

  function screenLen(a, b) {
    const near = typeof NEAR === 'number' ? NEAR : 0.5;
    const f = (H || 1) * 0.9;
    const Za = a[2] < near ? near : a[2], Zb = b[2] < near ? near : b[2];
    const ax = (W || 1) / 2 + a[0] * f / Za, ay = (H || 1) / 2 - a[1] * f / Za;
    const bx = (W || 1) / 2 + b[0] * f / Zb, by = (H || 1) / 2 - b[1] * f / Zb;
    return Math.hypot(bx - ax, by - ay);
  }

  function pushLine(a, b, rgb, alpha, width, dashOn, dashPer) {
    const seg = clipSeg(a, b);
    if (!seg) return false;
    const len = screenLen(seg[0], seg[1]);
    if (!(len > 0.4)) return false;
    const half = Math.max(0.4, width) * 0.5;
    const glowExtra = glowOn ? GLOW_PX : 0;
    const drawHalf = half + glowExtra * 0.5;
    const core = glowExtra > 0 ? (half / drawHalf) : 1;
    // core is a uniform for the whole line pass. Mixed widths still fade from the
    // same ratio when glow is on; glow is off in the matching picture.
    api._core = core;
    const need = (lineN + 6) * LINE_STRIDE;
    lineArr = grow(lineArr, need);
    for (let i = 0; i < 6; i++) {
      const end = LINE_PAT[i * 2], side = LINE_PAT[i * 2 + 1];
      const o = lineN * LINE_STRIDE;
      const A = seg[0], B = seg[1];
      lineArr[o] = A[0]; lineArr[o + 1] = A[1]; lineArr[o + 2] = A[2];
      lineArr[o + 3] = B[0]; lineArr[o + 4] = B[1]; lineArr[o + 5] = B[2];
      lineArr[o + 6] = side;
      lineArr[o + 7] = end;
      lineArr[o + 8] = end ? len : 0;
      lineArr[o + 9] = drawHalf;
      lineArr[o + 10] = rgb[0]; lineArr[o + 11] = rgb[1]; lineArr[o + 12] = rgb[2]; lineArr[o + 13] = alpha;
      lineArr[o + 14] = dashOn || 0;
      lineArr[o + 15] = dashPer || 0;
      lineArr[o + 16] = side;
      lineN++;
    }
    return true;
  }

  function worldFace(ids, corners) {
    const poly = [];
    for (let i = 0; i < ids.length; i++) {
      const p = corners[ids[i]];
      poly.push(camInto(alloc3(), p[0], p[1], p[2]));
    }
    return clipScreen(clipNear(poly));
  }

  function edgePair(ids, corners, rgb, alpha, width) {
    for (let i = 0; i < ids.length; i++) {
      const a = corners[ids[i]], b = corners[ids[(i + 1) % ids.length]];
      camInto(EA, a[0], a[1], a[2]);
      camInto(EB, b[0], b[1], b[2]);
      if (pushLine(EA, EB, rgb, alpha, width, 0, 0)) api.statsFrame.segs++;
    }
  }

  function submitBox(q, b, d, ol) {
    const y0 = q.y0 || 0, y1 = q.y1;
    const corners = CORNER;
    corners[0][0] = q.x0; corners[0][1] = y0; corners[0][2] = q.z0;
    corners[1][0] = q.x1; corners[1][1] = y0; corners[1][2] = q.z0;
    corners[2][0] = q.x1; corners[2][1] = y0; corners[2][2] = q.z1;
    corners[3][0] = q.x0; corners[3][1] = y0; corners[3][2] = q.z1;
    corners[4][0] = q.x0; corners[4][1] = y1; corners[4][2] = q.z0;
    corners[5][0] = q.x1; corners[5][1] = y1; corners[5][2] = q.z0;
    corners[6][0] = q.x1; corners[6][1] = y1; corners[6][2] = q.z1;
    corners[7][0] = q.x0; corners[7][1] = y1; corners[7][2] = q.z1;
    const inside = cam.x > q.x0 && cam.x < q.x1 && cam.z > q.z0 && cam.z < q.z1 && cam.y > y0 && cam.y < y1;
    if (inside) return;
    const fillRgb = b.kind === 'hill' ? FILL_HILL : FILL_BLDG;
    const edgeRgb = hexToRgb(b.c);
    const dist = typeof CDRAW !== 'undefined' ? CDRAW.dist : 950;
    const alpha = Math.max(0.25, Math.min(1, 1.5 - d / dist));
    const lw = d < 400 ? 1.8 : 1.2;
    // Outlines use the same facing faces as the 2D far silhouette. farSil.o is
    // cleared before that fill, so a cap-only box reads as a hole in the wall.
    const faces = faceList;
    faces.length = 0;
    if (cam.x < q.x0) faces.push(FACE_XL);
    else if (cam.x > q.x1) faces.push(FACE_XR);
    if (cam.z < q.z0) faces.push(FACE_ZL);
    else if (cam.z > q.z1) faces.push(FACE_ZR);
    if (cam.y > y1) faces.push(FACE_TOP);
    else if (cam.y < y0) faces.push(FACE_BOT);
    for (let i = 0; i < faces.length; i++) {
      const poly = worldFace(faces[i], corners);
      pushFill(poly, fillRgb, 1);
      edgePair(faces[i], corners, edgeRgb, alpha, lw);
      api.statsFrame.faces++;
    }
    if (ol) return;
    const winDist = typeof CDRAW !== 'undefined' ? CDRAW.winDist : 70;
    if (!(d < winDist) || b.kind === 'pylon' || b.kind === 'bill') return;
    const st = d > 45 ? 11 : 5.5;
    const gfh = 4.5;
    const wc = hexToRgb(b.wc || b.c);
    const dash = (b.dash && b.dash[0] > 3) ? DASH_LONG : DASH_SHORT;
    const wa = alpha * 0.75;
    for (let y = y0 + (y0 > 0 ? 2 : gfh + 1.8); y < y1 - 1.5; y += st) {
      if (((Math.floor(y / st) * 31 + (b.wseed || 0)) % 7) === 0) continue;
      if (cam.x < q.x0) { camInto(EA, q.x0 - 0.2, y, q.z0 + 2); camInto(EB, q.x0 - 0.2, y, q.z1 - 2); if (pushLine(EA, EB, wc, wa, 1.6, dash[0], dash[1])) api.statsFrame.windows++; }
      else if (cam.x > q.x1) { camInto(EA, q.x1 + 0.2, y, q.z0 + 2); camInto(EB, q.x1 + 0.2, y, q.z1 - 2); if (pushLine(EA, EB, wc, wa, 1.6, dash[0], dash[1])) api.statsFrame.windows++; }
      if (cam.z < q.z0) { camInto(EA, q.x0 + 2, y, q.z0 - 0.2); camInto(EB, q.x1 - 2, y, q.z0 - 0.2); if (pushLine(EA, EB, wc, wa, 1.6, dash[0], dash[1])) api.statsFrame.windows++; }
      else if (cam.z > q.z1) { camInto(EA, q.x0 + 2, y, q.z1 + 0.2); camInto(EB, q.x1 - 2, y, q.z1 + 0.2); if (pushLine(EA, EB, wc, wa, 1.6, dash[0], dash[1])) api.statsFrame.windows++; }
    }
  }

  function submitBuilding(b, d) {
    if (!b || !b.boxes) return false;
    // The colored NOS station stays on the 2D painter. Copying its fills into
    // this pass would be a second palette, and a later station change would have
    // to be made twice. Black solids and neon edges are the WebGL proof.
    if (b.nosStation) return false;
    if (b.towCab && window.TOW3 && TOW3.on && TOW3.on(d)) return false;
    const ol = b.kind === 'outline';
    if (window.CDRAW && CDRAW.nonear && d <= CDRAW.far && !ol) return false;
    if ((d > (window.CDRAW ? CDRAW.far : 170) || ol) && window.CDRAW && (CDRAW.nofar || (!ol && d > CDRAW.far * 3.5 && b.top < 12))) return false;
    for (let i = 0; i < b.boxes.length; i++) submitBox(b.boxes[i], b, d, ol);
    solid.add(b);
    api.statsFrame.buildings++;
    return true;
  }

  function texFor(canvas) {
    let rec = texByCanvas.get(canvas);
    if (rec) return rec.tex;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    rec = { tex: tex, canvas: canvas };
    texByCanvas.set(canvas, rec);
    texOrder.push(canvas);
    while (texOrder.length > 64) {
      const old = texOrder.shift();
      const gone = texByCanvas.get(old);
      if (gone) { gl.deleteTexture(gone.tex); texByCanvas.delete(old); }
    }
    return tex;
  }

  function submitSprite(slot) {
    const c = slot && slot.car;
    if (!c || !c.on || !window.TRAFFIC || !TRAFFIC._cache || !c._key) return false;
    const src = TRAFFIC._cache.get(c._key);
    if (!src) return false;
    const yDraw = (c.y || 0) + (c.suspY || 0);
    camInto(C0, c.x, yDraw + 0.6, c.z);
    const near = typeof NEAR === 'number' ? NEAR : 0.5;
    if (C0[2] < near) return false;
    const sc = scr(C0);
    const px = (H || 1) * 0.9 / C0[2] * 7;
    const squash = 1 - (c.pitch || 0) * 0.10;
    const roll = (c.roll || 0) + (c.bodyRoll || 0);
    const cos = Math.cos(roll), sin = Math.sin(roll);
    const hw = px / 2, hh = px * squash / 2;
    for (let i = 0; i < 4; i++) {
      const ox = SPR_OFF[i][0] * hw, oy = SPR_OFF[i][1] * hh;
      const p = SPR_PT[i];
      p[0] = sc[0] + ox * cos - oy * sin;
      p[1] = sc[1] + ox * sin + oy * cos;
      p[2] = SPR_OFF[i][2];
      p[3] = SPR_OFF[i][3];
    }
    const fade = c.fade == null ? 1 : c.fade;
    const need = (spriteN + 6) * SPRITE_STRIDE;
    spriteArr = grow(spriteArr, need);
    const base = spriteN;
    for (let i = 0; i < 6; i++) {
      const p = SPR_PT[SPR_TRI[i]];
      const o = spriteN * SPRITE_STRIDE;
      spriteArr[o] = p[0]; spriteArr[o + 1] = p[1]; spriteArr[o + 2] = C0[2];
      spriteArr[o + 3] = p[2]; spriteArr[o + 4] = p[3];
      spriteArr[o + 5] = 1; spriteArr[o + 6] = 1; spriteArr[o + 7] = 1; spriteArr[o + 8] = fade;
      spriteN++;
    }
    let rec = recPool[recN];
    if (!rec) { rec = { tex: null, start: 0, count: 0 }; recPool[recN] = rec; }
    rec.tex = texFor(src); rec.start = base; rec.count = 6;
    recN++;
    spriteRec.push(rec);
    dyn.add(slot);
    api.statsFrame.sprites++;
    return true;
  }

  function drawPasses() {
    resize();
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const core = glowOn ? (api._core || 0.35) : 1;
    if (fillN) {
      gl.useProgram(program);
      uniforms(loc.fill, 1);
      uploadDyn(fillBuf, fillArr, fillN * FILL_STRIDE);
      bindFillAttribs();
      gl.drawArrays(gl.TRIANGLES, 0, fillN);
    }
    if (lineN) {
      gl.useProgram(lineProg);
      uniforms(loc.line, core);
      uploadDyn(lineBuf, lineArr, lineN * LINE_STRIDE);
      bindLineAttribs();
      gl.drawArrays(gl.TRIANGLES, 0, lineN);
    }
    if (spriteN) {
      gl.useProgram(spriteProg);
      uniforms(loc.sprite, 1);
      uploadDyn(spriteBuf, spriteArr, spriteN * SPRITE_STRIDE);
      bindSpriteAttribs();
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(loc.sprite.u.uTex, 0);
      for (let i = 0; i < spriteRec.length; i++) {
        const r = spriteRec[i];
        gl.bindTexture(gl.TEXTURE_2D, r.tex);
        gl.drawArrays(gl.TRIANGLES, r.start, r.count);
      }
    }
  }

  function compose(items) {
    if (!api.active() || !items) return;
    const t0 = performance.now();
    solid.clear();
    dyn.clear();
    fillN = 0; lineN = 0; spriteN = 0;
    spriteRec.length = 0;
    pooli = 0;
    basisOk = false;
    recN = 0;
    api._core = 1;
    resetStats(api.statsFrame);
    try {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const o = it[2];
        const dist = Math.sqrt(it[0]);
        if (!o) continue;
        if (o.draw) { if (o.traffic) submitSprite(o); }
        else if (o.boxes) submitBuilding(o, dist);
      }
      api.statsFrame.submitMs = performance.now() - t0;
      const t1 = performance.now();
      drawPasses();
      api.statsFrame.gpuMs = performance.now() - t1;
      api.statsFrame.blitMs = 0;
      api.statsFrame.composeMs = performance.now() - t0;
    } catch (e) {
      api.error = String(e && e.message || e);
      api.fallback = 'compose';
      solid.clear();
      dyn.clear();
    }
  }

  window.GLCITY = api;
  if (enabled) init();
})();
