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

  function emptyStats() {
    return {
      buildings: 0, faces: 0, segs: 0, windows: 0, sprites: 0,
      submitMs: 0, gpuMs: 0, blitMs: 0, composeMs: 0
    };
  }

  function hexToRgb(hex) {
    if (!hex || hex.charAt(0) !== '#') return [0.24, 0.90, 1];
    let h = hex.slice(1);
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    const n = parseInt(h, 16);
    if (!(n >= 0)) return [0.24, 0.90, 1];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
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
    '  gl_Position=vec4(ndcX*Z,ndcY*Z,(winZ*2.0-1.0)*Z,Z);',
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
    '  if(uCore<0.999){',
    '    float x=abs(vCross);',
    '    float halo=x<=uCore?1.0:(1.0-(x-uCore)/max(0.001,1.0-uCore));',
    '    a*=halo;',
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
    if (cv.width !== dw || cv.height !== dh) { cv.width = dw; cv.height = dh; }
    mirrorCss(cv);
    if (backCv && backCtx) {
      mirrorCss(backCv);
      size2d(backCv, backCtx);
    }
    gl.viewport(0, 0, cv.width, cv.height);
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

  function bindFillAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, fillBuf);
    const s = FILL_STRIDE * 4;
    const cam = gl.getAttribLocation(program, 'aCam');
    const col = gl.getAttribLocation(program, 'aCol');
    gl.enableVertexAttribArray(cam);
    gl.enableVertexAttribArray(col);
    gl.vertexAttribPointer(cam, 3, gl.FLOAT, false, s, 0);
    gl.vertexAttribPointer(col, 4, gl.FLOAT, false, s, 12);
  }

  function bindLineAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
    const s = LINE_STRIDE * 4;
    function at(name, size, off) {
      const loc = gl.getAttribLocation(lineProg, name);
      if (loc < 0) return;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, s, off);
    }
    at('aA', 3, 0);
    at('aB', 3, 12);
    at('aMisc', 4, 24);
    at('aCol', 4, 40);
    at('aDash', 2, 56);
    at('aCross', 1, 64);
  }

  function bindSpriteAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuf);
    const s = SPRITE_STRIDE * 4;
    function at(name, size, off) {
      const loc = gl.getAttribLocation(spriteProg, name);
      if (loc < 0) return;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, s, off);
    }
    at('aS', 2, 0);
    at('aZ', 1, 8);
    at('aUv', 2, 12);
    at('aCol', 4, 20);
  }

  function uniforms(p, core) {
    gl.uniform2f(gl.getUniformLocation(p, 'uWH'), W || 1, H || 1);
    const f = gl.getUniformLocation(p, 'uF');
    if (f) gl.uniform1f(f, (H || 1) * 0.9);
    gl.uniform1f(gl.getUniformLocation(p, 'uNear'), typeof NEAR === 'number' ? NEAR : 0.5);
    gl.uniform1f(gl.getUniformLocation(p, 'uFar'), FAR_Z);
    const c = gl.getUniformLocation(p, 'uCore');
    if (c) gl.uniform1f(c, core);
  }

  function pushFill(poly, rgb, alpha) {
    if (poly.length < 3) return;
    const need = (fillN + (poly.length - 2) * 3) * FILL_STRIDE;
    fillArr = grow(fillArr, need);
    const p0 = poly[0];
    for (let i = 1; i < poly.length - 1; i++) {
      const tri = [p0, poly[i], poly[i + 1]];
      for (let k = 0; k < 3; k++) {
        const o = fillN * FILL_STRIDE;
        const p = tri[k];
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
        o.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, near]);
      }
    }
    return o;
  }

  function clipSeg(a, b) {
    const near = typeof NEAR === 'number' ? NEAR : 0.5;
    if (a[2] < near && b[2] < near) return null;
    if (a[2] >= near && b[2] >= near) return [a, b];
    const dz = b[2] - a[2];
    if (!dz) return null;
    const t = (near - a[2]) / dz;
    if (!(t >= 0 && t <= 1)) return null;
    const m = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, near];
    return a[2] < near ? [m, b] : [a, m];
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
    const col = [rgb[0], rgb[1], rgb[2], alpha];
    const need = (lineN + 6) * LINE_STRIDE;
    lineArr = grow(lineArr, need);
    // two triangles: (start+, start-, end+), (start-, end-, end+)
    const pattern = [[0, 1], [0, -1], [1, 1], [0, -1], [1, -1], [1, 1]];
    for (let i = 0; i < pattern.length; i++) {
      const end = pattern[i][0], side = pattern[i][1];
      const o = lineN * LINE_STRIDE;
      const A = seg[0], B = seg[1];
      lineArr[o] = A[0]; lineArr[o + 1] = A[1]; lineArr[o + 2] = A[2];
      lineArr[o + 3] = B[0]; lineArr[o + 4] = B[1]; lineArr[o + 5] = B[2];
      lineArr[o + 6] = side;
      lineArr[o + 7] = end;
      lineArr[o + 8] = end ? len : 0;
      lineArr[o + 9] = drawHalf;
      lineArr[o + 10] = col[0]; lineArr[o + 11] = col[1]; lineArr[o + 12] = col[2]; lineArr[o + 13] = col[3];
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
      poly.push(camS(p[0], p[1], p[2]));
    }
    return clipNear(poly);
  }

  function edgePair(ids, corners, rgb, alpha, width) {
    for (let i = 0; i < ids.length; i++) {
      const a = corners[ids[i]], b = corners[ids[(i + 1) % ids.length]];
      if (pushLine(camS(a[0], a[1], a[2]), camS(b[0], b[1], b[2]), rgb, alpha, width, 0, 0)) api.statsFrame.segs++;
    }
  }

  function submitBox(q, b, d, ol) {
    const y0 = q.y0 || 0, y1 = q.y1;
    const corners = [
      [q.x0, y0, q.z0], [q.x1, y0, q.z0], [q.x1, y0, q.z1], [q.x0, y0, q.z1],
      [q.x0, y1, q.z0], [q.x1, y1, q.z0], [q.x1, y1, q.z1], [q.x0, y1, q.z1]
    ];
    const inside = cam.x > q.x0 && cam.x < q.x1 && cam.z > q.z0 && cam.z < q.z1 && cam.y > y0 && cam.y < y1;
    if (inside) return;
    const fillRgb = b.kind === 'hill' ? [5 / 255, 16 / 255, 10 / 255] : [10 / 255, 6 / 255, 18 / 255];
    const edgeRgb = hexToRgb(b.c);
    const dist = typeof CDRAW !== 'undefined' ? CDRAW.dist : 950;
    const alpha = Math.max(0.25, Math.min(1, 1.5 - d / dist));
    const lw = d < 400 ? 1.8 : 1.2;
    const faces = [];
    if (ol) {
      faces.push([0, 1, 2, 3], [4, 5, 6, 7]);
    } else {
      if (cam.x < q.x0) faces.push([0, 3, 7, 4]);
      else if (cam.x > q.x1) faces.push([1, 2, 6, 5]);
      if (cam.z < q.z0) faces.push([0, 1, 5, 4]);
      else if (cam.z > q.z1) faces.push([3, 2, 6, 7]);
      if (cam.y > y1) faces.push([4, 5, 6, 7]);
      else if (cam.y < y0) faces.push([0, 1, 2, 3]);
    }
    for (let i = 0; i < faces.length; i++) {
      pushFill(worldFace(faces[i], corners), fillRgb, 1);
      edgePair(faces[i], corners, edgeRgb, alpha, lw);
      api.statsFrame.faces++;
    }
    if (ol) {
      const verts = [[0, 4], [1, 5], [2, 6], [3, 7]];
      for (let i = 0; i < verts.length; i++) {
        const a = corners[verts[i][0]], c = corners[verts[i][1]];
        if (pushLine(camS(a[0], a[1], a[2]), camS(c[0], c[1], c[2]), edgeRgb, alpha, lw, 0, 0)) api.statsFrame.segs++;
      }
      return;
    }
    const winDist = typeof CDRAW !== 'undefined' ? CDRAW.winDist : 70;
    if (!(d < winDist) || b.kind === 'pylon' || b.kind === 'bill') return;
    const st = d > 45 ? 11 : 5.5;
    const gfh = 4.5;
    const wc = hexToRgb(b.wc || b.c);
    const dash = (b.dash && b.dash[0] > 3) ? [6, 11] : [4, 8];
    for (let y = y0 + (y0 > 0 ? 2 : gfh + 1.8); y < y1 - 1.5; y += st) {
      if (((Math.floor(y / st) * 31 + (b.wseed || 0)) % 7) === 0) continue;
      const segs = [];
      if (cam.x < q.x0) segs.push([[q.x0 - 0.2, y, q.z0 + 2], [q.x0 - 0.2, y, q.z1 - 2]]);
      else if (cam.x > q.x1) segs.push([[q.x1 + 0.2, y, q.z0 + 2], [q.x1 + 0.2, y, q.z1 - 2]]);
      if (cam.z < q.z0) segs.push([[q.x0 + 2, y, q.z0 - 0.2], [q.x1 - 2, y, q.z0 - 0.2]]);
      else if (cam.z > q.z1) segs.push([[q.x0 + 2, y, q.z1 + 0.2], [q.x1 - 2, y, q.z1 + 0.2]]);
      for (let s = 0; s < segs.length; s++) {
        const A = segs[s][0], B = segs[s][1];
        if (pushLine(camS(A[0], A[1], A[2]), camS(B[0], B[1], B[2]), wc, alpha * 0.75, 1.6, dash[0], dash[1])) api.statsFrame.windows++;
      }
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
    const c0 = camS(c.x, yDraw + 0.6, c.z);
    const near = typeof NEAR === 'number' ? NEAR : 0.5;
    if (!c0 || c0[2] < near) return false;
    const sc = scr(c0);
    const px = (H || 1) * 0.9 / c0[2] * 7;
    const squash = 1 - (c.pitch || 0) * 0.10;
    const roll = (c.roll || 0) + (c.bodyRoll || 0);
    const cos = Math.cos(roll), sin = Math.sin(roll);
    const hw = px / 2, hh = px * squash / 2;
    const local = [[-hw, -hh, 0, 1], [hw, -hh, 1, 1], [hw, hh, 1, 0], [-hw, hh, 0, 0]];
    const pts = [];
    for (let i = 0; i < 4; i++) {
      const x = local[i][0], y = local[i][1];
      pts.push([sc[0] + x * cos - y * sin, sc[1] + x * sin + y * cos, local[i][2], local[i][3]]);
    }
    const fade = c.fade == null ? 1 : c.fade;
    const tri = [0, 1, 2, 0, 2, 3];
    const need = (spriteN + 6) * SPRITE_STRIDE;
    spriteArr = grow(spriteArr, need);
    const base = spriteN;
    for (let i = 0; i < 6; i++) {
      const p = pts[tri[i]];
      const o = spriteN * SPRITE_STRIDE;
      spriteArr[o] = p[0]; spriteArr[o + 1] = p[1]; spriteArr[o + 2] = c0[2];
      spriteArr[o + 3] = p[2]; spriteArr[o + 4] = p[3];
      spriteArr[o + 5] = 1; spriteArr[o + 6] = 1; spriteArr[o + 7] = 1; spriteArr[o + 8] = fade;
      spriteN++;
    }
    spriteRec.push({ tex: texFor(src), start: base, count: 6 });
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
      uniforms(program, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, fillBuf);
      gl.bufferData(gl.ARRAY_BUFFER, fillArr.subarray(0, fillN * FILL_STRIDE), gl.DYNAMIC_DRAW);
      bindFillAttribs();
      gl.drawArrays(gl.TRIANGLES, 0, fillN);
    }
    if (lineN) {
      gl.useProgram(lineProg);
      uniforms(lineProg, core);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
      gl.bufferData(gl.ARRAY_BUFFER, lineArr.subarray(0, lineN * LINE_STRIDE), gl.DYNAMIC_DRAW);
      bindLineAttribs();
      gl.drawArrays(gl.TRIANGLES, 0, lineN);
    }
    if (spriteN) {
      gl.useProgram(spriteProg);
      uniforms(spriteProg, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuf);
      gl.bufferData(gl.ARRAY_BUFFER, spriteArr.subarray(0, spriteN * SPRITE_STRIDE), gl.DYNAMIC_DRAW);
      bindSpriteAttribs();
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(gl.getUniformLocation(spriteProg, 'uTex'), 0);
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
    api._core = 1;
    api.statsFrame = emptyStats();
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
