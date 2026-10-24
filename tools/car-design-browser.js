/**
 * Page-side half of the 370Z design check. Loaded into world.html by
 * tools/car-design-check.mjs. It does not ship with the game.
 *
 * Poses the real player car and one traffic copy, shoots front / rear /
 * side / three-quarter at close and far range, and measures the pixels.
 */
(function () {
  const BAR = {
    minBakePx: 256,
    minIou: 0.55,
    minSatRatio: 0.42,
    minLumRatio: 0.38,
    minEdgeRatio: 0.4,
    silverExtra: 2
  };

  let origRender = null;
  let hold = false;
  let pose = null;
  let hooked = false;
  const errors = [];

  function fail(msg) { errors.push(String(msg)); }

  function hook() {
    if (hooked) return;
    if (typeof render !== 'function') throw new Error('world render() is missing');
    origRender = render;
    const wrapped = function () {
      if (hold) return;
      try { if (pose) applyPose(pose); } catch (e) { fail(e && e.message || e); }
      return origRender();
    };
    render = wrapped;
    window.render = wrapped;
    hooked = true;
  }

  function hideChrome() {
    try { if (typeof kPause === 'function') kPause(true); } catch (e) { fail(e.message || e); }
    try { flying = false; } catch (e) { fail('flying: ' + (e.message || e)); }
    try { paused = true; } catch (e) { fail('paused: ' + (e.message || e)); }
    try { window.drawHud = function () {}; } catch (e) { fail(e.message || e); }
    try { window.NOZ = false; } catch (e) {}
    try { camLookOn = false; } catch (e) {}
    try { if (window.CAM_LOOK) { CAM_LOOK.active = false; CAM_LOOK.orbit = null; } } catch (e) {}
    ['kOver', 'kHome', 'kPzBg', 'kMenuB', 'kToast'].forEach((id) => {
      const n = document.getElementById(id);
      if (n) n.style.display = 'none';
    });
  }

  function screenRight(az) {
    const right = az + Math.PI + Math.PI / 2;
    return [Math.sin(right), Math.cos(right)];
  }

  function applyPose(spec) {
    P.x = 12000; P.z = 12000; P.y = 80;
    P.yaw = 0; P.pitch = 0; P.bank = 0; P.v = 0; P.thr = 0;
    P.ground = true; P.sus = 0; P.ebRoll = 0; P.ebK = 0;
    const gap = spec.gap;
    const r = screenRight(spec.az);
    const car = spec.car;
    if (car) {
      car.on = !spec.hideTraffic;
      car.sim = true;
      car.hit = false;
      car.fade = 1;
      car.pi = 0;
      car.x = P.x + r[0] * gap;
      car.z = P.z + r[1] * gap;
      car.y = P.y;
      car.yaw = 0;
      car.pitch = 0;
      car.roll = 0;
      car.bodyRoll = 0;
      car.nose = 0;
      car.noseV = 0;
      car.suspY = 0;
      car.suspV = 0;
      car.slip = 0;
      car.braking = false;
      car.steer = spec.steer || 0;
      car.wheelA = 0;
      car.vx = 0; car.vy = 0; car.vz = 0;
    }
    if (window.TRAFFIC && TRAFFIC.cars) {
      for (const c of TRAFFIC.cars) if (c !== car) c.on = false;
    }
    window.NOZ = !!spec.hidePlayer;
    try { camLookOn = false; } catch (e) {}
    FLYCAM.orbit = { az: spec.az, el: spec.el, d: spec.dist };
    FLYCAM.back = spec.dist;
    FLYCAM.up = Math.sin(spec.el) * spec.dist;
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  async function waitReady() {
    const t0 = performance.now();
    while (performance.now() - t0 < 50000) {
      if (window.ZD && ZD.Xray && ZD.Xray.ready && ZD.Xray.car && window.TRAFFIC && typeof P !== 'undefined') return true;
      await sleep(200);
    }
    return false;
  }

  function pickCar() {
    TRAFFIC.ensure();
    const cars = TRAFFIC.cars || [];
    let car = null;
    for (const c of cars) if (c.sim) { car = c; break; }
    if (!car) car = cars[0] || null;
    if (!car) return null;
    for (const c of cars) c.on = false;
    car.sim = true;
    car.on = true;
    return car;
  }

  function projectBox(x, y, z, yaw, pad) {
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    const rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const L = 2.2 + pad, Ww = 1.2 + pad, top = 1.7 + pad * 0.25;
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, n = 0;
    for (const a of [-L, L]) for (const s of [-Ww, Ww]) for (const h of [0, top]) {
      const p = proj(x + fx * a + rx * s, y + h, z + fz * a + rz * s);
      if (!p) continue;
      n++;
      if (p[0] < minX) minX = p[0];
      if (p[1] < minY) minY = p[1];
      if (p[0] > maxX) maxX = p[0];
      if (p[1] > maxY) maxY = p[1];
    }
    if (n < 4) return null;
    return { x: minX, y: minY, w: Math.max(2, maxX - minX), h: Math.max(2, maxY - minY) };
  }

  function snapCanvas() {
    const shot = document.createElement('canvas');
    shot.width = W; shot.height = H;
    const g = shot.getContext('2d');
    g.drawImage(cv, 0, 0, cv.width, cv.height, 0, 0, W, H);
    return shot;
  }

  function cropOf(shot, box, destH) {
    const padX = Math.max(8, box.w * 0.08);
    const padY = Math.max(8, box.h * 0.12);
    let x = Math.max(0, Math.floor(box.x - padX));
    let y = Math.max(0, Math.floor(box.y - padY));
    let w = Math.min(shot.width - x, Math.ceil(box.w + padX * 2));
    let h = Math.min(shot.height - y, Math.ceil(box.h + padY * 2));
    if (w < 2 || h < 2) return null;
    const scale = destH / h;
    const out = document.createElement('canvas');
    out.width = Math.max(2, Math.round(w * scale));
    out.height = Math.max(2, Math.round(destH));
    const g = out.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(shot, x, y, w, h, 0, 0, out.width, out.height);
    return { canvas: out, srcW: w, srcH: h };
  }

  function sample(canvas) {
    const g = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const data = g.getImageData(0, 0, w, h).data;
    const border = [];
    const push = (i) => border.push([data[i], data[i + 1], data[i + 2]]);
    for (let x = 0; x < w; x++) { push((0 * w + x) * 4); push(((h - 1) * w + x) * 4); }
    for (let y = 0; y < h; y++) { push((y * w + 0) * 4); push((y * w + (w - 1)) * 4); }
    border.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
    const mid = border[border.length >> 1] || [0, 0, 0];
    const mask = new Uint8Array(w * h);
    let n = 0, sat = 0, lum = 0, lum2 = 0, edge = 0;
    const lums = new Float32Array(w * h);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const r = data[i], gg = data[i + 1], b = data[i + 2];
      const dr = r - mid[0], dg = gg - mid[1], db = b - mid[2];
      const dist = dr * dr + dg * dg + db * db;
      const L = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
      lums[p] = L;
      if (dist > 28 * 28) {
        mask[p] = 1; n++;
        const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
        sat += mx === 0 ? 0 : (mx - mn) / mx;
        lum += L; lum2 += L * L;
      }
    }
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (!mask[p]) continue;
      const gx = lums[p + 1] - lums[p - 1];
      const gy = lums[p + w] - lums[p - w];
      if (gx * gx + gy * gy > 35 * 35) edge++;
    }
    const mean = n ? lum / n : 0;
    const variance = n ? Math.max(0, lum2 / n - mean * mean) : 0;
    return {
      w, h, maskN: n, maskFrac: n / Math.max(1, w * h),
      sat: n ? sat / n : 0,
      lum: mean,
      lumStd: Math.sqrt(variance),
      edge: n ? edge / n : 0,
      mask, lums
    };
  }

  function iouOf(a, b) {
    const gw = 96, gh = 64;
    function grid(sampleObj, canvas) {
      const g = new Uint8Array(gw * gh);
      const sw = canvas.width, sh = canvas.height;
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
        const sx = Math.min(sw - 1, Math.floor((x + 0.5) / gw * sw));
        const sy = Math.min(sh - 1, Math.floor((y + 0.5) / gh * sh));
        g[y * gw + x] = sampleObj.mask[sy * sw + sx] ? 1 : 0;
      }
      return g;
    }
    // caller passes already-sampled crops; rebuild grids from mask size stored on sample
    return null;
  }

  function gridMask(info, canvas) {
    const gw = 96, gh = 64;
    const g = new Uint8Array(gw * gh);
    const sw = canvas.width, sh = canvas.height;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const sx = Math.min(sw - 1, Math.floor((x + 0.5) / gw * sw));
      const sy = Math.min(sh - 1, Math.floor((y + 0.5) / gh * sh));
      g[y * gw + x] = info.mask[sy * sw + sx] ? 1 : 0;
    }
    return g;
  }

  function iouGrids(a, b) {
    let inter = 0, union = 0;
    for (let i = 0; i < a.length; i++) {
      const A = a[i], B = b[i];
      if (A || B) union++;
      if (A && B) inter++;
    }
    return union ? inter / union : 0;
  }

  function silverBlobs(info, canvas) {
    const w = canvas.width, h = canvas.height;
    const img = canvas.getContext('2d').getImageData(0, 0, w, h).data;
    const mark = new Uint8Array(w * h);
    for (let p = 0, i = 0; p < w * h; p++, i += 4) {
      if (!info.mask[p]) continue;
      const r = img[i], g = img[i + 1], b = img[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const L = info.lums[p];
      if (L > 115 && L < 220 && mx - mn < 42) mark[p] = 1;
    }
    const seen = new Uint8Array(w * h);
    const blobs = [];
    const stack = [];
    for (let p = 0; p < mark.length; p++) {
      if (!mark[p] || seen[p]) continue;
      let area = 0, minX = w, minY = h, maxX = 0, maxY = 0;
      stack.length = 0;
      stack.push(p);
      seen[p] = 1;
      while (stack.length) {
        const q = stack.pop();
        area++;
        const x = q % w, y = (q / w) | 0;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        const nbs = [q - 1, q + 1, q - w, q + w];
        for (const nb of nbs) {
          if (nb < 0 || nb >= mark.length || seen[nb] || !mark[nb]) continue;
          const nx = nb % w;
          if (Math.abs(nx - x) > 1) continue;
          seen[nb] = 1;
          stack.push(nb);
        }
      }
      const bw = maxX - minX + 1, bh = maxY - minY + 1;
      const aspect = bw / Math.max(1, bh);
      if (area >= 10 && area < w * h * 0.25 && aspect > 0.45 && aspect < 2.1) {
        blobs.push({ area, x: (minX + maxX) / 2, y: (minY + maxY) / 2, w: bw, h: bh, aspect });
      }
    }
    return blobs;
  }

  function sourceInfo(car) {
    const cache = TRAFFIC._cache;
    const key = car && car._key;
    let sourcePx = 0;
    if (cache && key && cache.has(key)) sourcePx = cache.get(key).width || 0;
    let displayed = 0;
    try {
      const yDraw = (car.y || 0) + (car.suspY || 0);
      const c0 = camS(car.x, yDraw + 0.6, car.z);
      if (c0 && c0[2] > 0.5) displayed = H * 0.9 / c0[2] * 7;
    } catch (e) {}
    const tunePx = (window.TRAFFIC_TUNE && TRAFFIC_TUNE.spritePx) || 0;
    return {
      key: key || '',
      sourcePx,
      displayed: Math.round(displayed),
      tunePx,
      playerPx: (window.ZV && ZV.cv && ZV.cv.width) || 0
    };
  }

function judgeShot(spec, metrics) {
  const reasons = [];
  if (spec.range === 'far') {
    return { ok: true, farLod: true, reasons: ['Far LOD. A simpler shape is allowed past the close range.'] };
  }
  if (metrics.wheelDecal) reasons.push('Wheels are flat camera-facing cards, not tires sitting in the wells.');
  const src = metrics.sourcePx || metrics.tunePx || 0;
  if (metrics.usesSprite && src && src < BAR.minBakePx) {
    reasons.push('Close bake is ' + src + ' px. The floor is ' + BAR.minBakePx + '. A 160 px bake is too coarse.');
  }
  const p = metrics.player, t = metrics.traffic;
  if (!p || p.maskN < 30) reasons.push('Player car did not read in the crop.');
  if (!t || t.maskN < 20) reasons.push('Traffic copy did not read in the crop.');
  if (p && t && p.maskN > 30 && t.maskN > 30) {
    if (metrics.iou < BAR.minIou) reasons.push('Silhouette does not match his Z (IoU ' + metrics.iou.toFixed(2) + ').');
    const satR = t.sat / Math.max(0.02, p.sat);
    const lumR = t.lumStd / Math.max(1, p.lumStd);
    const edgeR = t.edge / Math.max(0.01, p.edge);
    metrics.satRatio = +satR.toFixed(2);
    metrics.lumRatio = +lumR.toFixed(2);
    metrics.edgeRatio = +edgeR.toFixed(2);
    if (satR < BAR.minSatRatio && lumR < BAR.minLumRatio) reasons.push('Paint and lighting are flat next to the showroom car.');
    if (edgeR < BAR.minEdgeRatio && src < BAR.minBakePx) reasons.push('The copy is smeared. Edge detail is ' + Math.round(edgeR * 100) + '% of his Z.');
  }
  const extra = (metrics.trafficBlobs || 0) - (metrics.playerBlobs || 0);
  metrics.silverExtra = extra;
  if (spec.id === 'rear' || spec.id === 'three' || spec.id === 'front') {
    if (extra >= BAR.silverExtra) reasons.push(extra + ' extra round silver marks. From this angle a real wheel is thin, not a star facing the lens.');
  }
  return { ok: reasons.length === 0, farLod: false, reasons };
}

function gapFor(spec) {
  const f = H * 0.9;
  const sprite = f / spec.dist * 7;
  const gapPx = spec.range === 'far'
    ? Math.min(W * 0.28, 300)
    : Math.max(80, Math.min(W / 2 - sprite / 2 - 28, sprite * 0.92));
  return gapPx * spec.dist / f;
}

function countTinyDraws(fn) {
  let n = 0;
  const proto = CanvasRenderingContext2D.prototype;
  const orig = proto.drawImage;
  proto.drawImage = function (img) {
    try {
      const w = img && img.width;
      if (w && w <= 32 && img.height <= 32) n++;
    } catch (e) {}
    return orig.apply(this, arguments);
  };
  try { fn(); } finally { proto.drawImage = orig; }
  return n;
}

  function drawFit(g, image, x, y, w, h) {
    const s = Math.min(w / image.width, h / image.height);
    const dw = image.width * s, dh = image.height * s;
    g.imageSmoothingEnabled = true;
    g.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }

  function drawZoom(g, crop, x, y, w, h) {
    g.save();
    g.beginPath();
    g.rect(x, y, w, h);
    g.clip();
    g.fillStyle = '#120814';
    g.fillRect(x, y, w, h);
    const s = Math.min(w / crop.canvas.width, h / crop.canvas.height);
    const dw = crop.canvas.width * s, dh = crop.canvas.height * s;
    g.imageSmoothingEnabled = false;
    g.drawImage(crop.canvas, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    g.restore();
  }

  function ringBlobs(g, blobs, crop, dx, dy, dw, dh) {
    if (!blobs || !blobs.length) return;
    const s = Math.min(dw / crop.canvas.width, dh / crop.canvas.height);
    const ox = dx + (dw - crop.canvas.width * s) / 2;
    const oy = dy + (dh - crop.canvas.height * s) / 2;
    g.save();
    g.strokeStyle = '#ff2a3d';
    g.lineWidth = 3;
    g.font = 'bold 16px sans-serif';
    g.fillStyle = '#ff2a3d';
    blobs.slice(0, 6).forEach((b, i) => {
      const cx = ox + b.x * s, cy = oy + b.y * s;
      const rad = Math.max(10, Math.max(b.w, b.h) * s * 0.65);
      g.beginPath();
      g.arc(cx, cy, rad, 0, 6.3);
      g.stroke();
      if (i === 0) g.fillText('camera-facing wheel', Math.min(dx + dw - 180, cx + rad + 4), cy);
    });
    g.restore();
  }

  function sheet(spec, wide, playerCrop, trafficCrop, verdict, blobs) {
    const Wd = 1440, head = 118, wideH = 300, zoomH = 520, foot = 78;
    const out = document.createElement('canvas');
    out.width = Wd;
    out.height = head + wideH + zoomH + foot;
    const g = out.getContext('2d');
    g.fillStyle = '#0b0610';
    g.fillRect(0, 0, out.width, out.height);
    g.fillStyle = verdict.ok ? '#7dff6b' : '#ff2a3d';
    g.font = 'bold 34px sans-serif';
    const banner = (verdict.ok ? 'PASS' : 'FAIL') + '  ·  ' + spec.title + '  ·  ' + (spec.range === 'far' ? 'FAR' : 'CLOSE');
    g.fillText(banner, 28, 46);
    g.fillStyle = '#ffe14d';
    g.font = '20px sans-serif';
    g.fillText(spec.sub, 28, 80);
    g.fillStyle = '#c9bdd4';
    g.font = '18px sans-serif';
    const why = (verdict.reasons && verdict.reasons[0]) || (verdict.ok ? 'Matches the close-range bar.' : '');
    g.fillText(why.slice(0, 140), 28, 106);
    drawFit(g, wide, 24, head, Wd - 48, wideH - 8);
    const y = head + wideH;
    const colW = (Wd - 48 - 20) / 2;
    drawZoom(g, playerCrop, 24, y, colW, zoomH - 36);
    drawZoom(g, trafficCrop, 24 + colW + 20, y, colW, zoomH - 36);
    if (!verdict.ok && spec.range !== 'far') ringBlobs(g, blobs, trafficCrop, 24 + colW + 20, y, colW, zoomH - 36);
    g.font = 'bold 22px sans-serif';
    g.fillStyle = '#3ee6ff';
    g.fillText("BOB'S 370Z", 24, y + zoomH - 8);
    g.fillStyle = verdict.ok ? '#7dff6b' : '#ff2a3d';
    g.fillText(spec.range === 'far' ? 'TRAFFIC  ·  far LOD' : 'TRAFFIC COPY', 24 + colW + 20, y + zoomH - 8);
    return out.toDataURL('image/png').split(',')[1];
  }

  async function postShot(name, b64) {
    const res = await fetch('/__shot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, b64 })
    });
    if (!res.ok) throw new Error('shot post failed ' + res.status);
  }

  function codeFlags() {
    let wheelDecal = false;
    let usesSprite = false;
    try {
      const src = TRAFFIC && TRAFFIC.toString ? '' : '';
    } catch (e) {}
    // The closures are not readable. The node scan is the source of truth.
    // Runtime evidence: a wheel card is a tiny canvas the draw path composites.
    const tune = window.TRAFFIC_TUNE || {};
    return {
      tunePx: tune.spritePx || 0,
      fullDist: tune.fullDist || 0,
      boxDist: tune.boxDist || 0
    };
  }

  function bytesOfB64(b64) {
    const n = atob(b64);
    const s = new Uint8Array(n.length);
    for (let i = 0; i < n.length; i++) s[i] = n.charCodeAt(i) & 255;
    return s;
  }

  async function sha256(buf) {
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function geomStats(root) {
    const uuids = new Set();
    let meshes = 0, verts = 0;
    if (root && root.traverse) root.traverse((o) => {
      if (!o.isMesh || !o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
      meshes++;
      verts += o.geometry.attributes.position.count;
      if (o.geometry.uuid) uuids.add(o.geometry.uuid);
    });
    return { meshes, verts, uuids };
  }

  async function sourceModel() {
    const expect = window.__CAR_EXPECT || {};
    const reasons = [];
    const out = {
      ok: true,
      reasons,
      file: '',
      source: '',
      bytesha: '',
      embedSha: '',
      creditSha: '',
      script: expect.script || 'shared/assets/370z-glb.js',
      bytes: expect.bytes || 0,
      playerVerts: 0,
      cloneVerts: 0,
      sharedGeom: 0,
      fetched: []
    };
    function bad(msg) { out.ok = false; reasons.push(msg); }
    try {
      if (!expect.bytesha) bad('checker has no sha256 for shared/assets/370z-glb.js');
      const embed = window.ZD_EMBED || {};
      const cfgFile = (embed.cfg && embed.cfg.file) || '';
      out.file = cfgFile;
      const wantFile = expect.file || 'assets/370z.glb';
      if (cfgFile !== wantFile) bad('runtime cfg.file is ' + (cfgFile || 'missing') + ', expected ' + wantFile);
      const asset = window.ZD_ASSET_GLB || '';
      if (!asset) bad('window.ZD_ASSET_GLB is empty');
      if (embed.glb && asset && embed.glb !== asset) bad('ZD_EMBED.glb is not the same string as ZD_ASSET_GLB');
      if (asset && expect.bytesha) {
        out.embedSha = await sha256(bytesOfB64(asset));
        if (out.embedSha !== expect.bytesha) {
          bad('ZD_ASSET_GLB sha256 ' + out.embedSha.slice(0, 12) + ' does not match ' + out.script + ' ' + expect.bytesha.slice(0, 12));
        }
      }
      const X = window.ZD && ZD.Xray;
      if (!X) bad('ZD.Xray is missing');
      else {
        out.source = X.source || '';
        if (X.source !== 'glb') bad('player source is "' + (X.source || '') + '", expected glb from ' + wantFile);
        const credit = X.credit || null;
        const cfile = (credit && credit.file) || '';
        if (cfile !== wantFile) bad('ZD.Xray.credit.file is ' + (cfile || 'missing') + ', expected ' + wantFile);
        if (!credit || !credit.buffer) bad('ZD.Xray.credit.buffer is missing');
        else if (expect.bytesha) {
          out.creditSha = await sha256(credit.buffer);
          out.bytesha = out.creditSha;
          if (out.creditSha !== expect.bytesha) {
            bad('loaded GLB sha256 ' + out.creditSha.slice(0, 12) + ' does not match ' + out.script + ' ' + expect.bytesha.slice(0, 12));
          }
        }
        const pg = geomStats(X.car);
        out.playerVerts = pg.verts;
        if (window.TRAFFIC && !TRAFFIC._clone && typeof TRAFFIC._bake === 'function') {
          try { TRAFFIC._bake('0:0:0'); } catch (e) {}
        }
        const cg = geomStats(window.TRAFFIC && TRAFFIC._clone);
        out.cloneVerts = cg.verts;
        let shared = 0;
        cg.uuids.forEach((id) => { if (pg.uuids.has(id)) shared++; });
        out.sharedGeom = shared;
      }
      const zGlb = [];
      document.querySelectorAll('script[src]').forEach((el) => {
        try {
          const u = new URL(el.getAttribute('src'), location.href);
          const rel = u.pathname.replace(/^\//, '').split('?')[0];
          if (/370z/i.test(rel) || /\.(glb|gltf)$/i.test(rel)) zGlb.push(rel);
        } catch (e) {}
      });
      const canonScript = (s) => s === 'shared/assets/370z-glb.js' || s.endsWith('/shared/assets/370z-glb.js');
      if (!zGlb.some(canonScript)) bad('the page did not load shared/assets/370z-glb.js');
      zGlb.filter((s) => !canonScript(s)).forEach((s) => {
        bad('the page loads a second model script ' + s);
      });
      const fetched = [];
      (performance.getEntriesByType('resource') || []).forEach((e) => {
        if (/\.glb(\?|$)/i.test(e.name) || /\.gltf(\?|$)/i.test(e.name)) fetched.push(String(e.name).split('?')[0]);
      });
      out.fetched = fetched;
      fetched.forEach((name) => {
        if (!/\/assets\/370z\.glb$/.test(name) && !/\/shared\/assets\/370z\.glb$/.test(name)) {
          bad('the page fetched a different model ' + name);
        }
      });
    } catch (e) {
      bad('source hash failed: ' + (e && e.message || e));
    }
    window.__CAR_SOURCE = out;
    return out;
  }

  async function boot() {
    errors.length = 0;
    hideChrome();
    hook();
    const ready = await waitReady();
    if (!ready) {
      return { ok: false, error: '370Z renderer or traffic did not become ready', errors };
    }
    let car = null;
    try { car = pickCar(); } catch (e) { return { ok: false, error: 'traffic build failed: ' + (e.message || e), errors }; }
    if (!car) return { ok: false, error: 'no traffic car slot', errors };
    hold = false;
    pose = { az: Math.PI, el: 0.2, dist: 11, gap: 6, steer: 0, car, hidePlayer: false, hideTraffic: false };
    origRender();
    await sleep(400);
    let gl = '';
    try {
      const ctx3 = ZD.Xray.renderer.getContext();
      gl = ctx3.getParameter(ctx3.RENDERER) + ' / ' + ctx3.getParameter(ctx3.VENDOR);
    } catch (e) { gl = 'unknown'; }
    let source = null;
    try { source = await sourceModel(); } catch (e) {
      source = { ok: false, reasons: ['source hash failed: ' + (e && e.message || e)] };
    }
    return {
      ok: true,
      errors,
      gl,
      source,
      cloned: (TRAFFIC.stats && TRAFFIC.stats().clonedMeshes) || 0,
      cars: (TRAFFIC.cars || []).length,
      flags: codeFlags(),
      playerPaint: (window.KID && KID.paint) || ''
    };
  }

  async function ensureBake(car) {
    for (let i = 0; i < 8; i++) {
      applyPose(pose);
      origRender();
      const key = car._key;
      const key2 = car._key2;
      const cache = TRAFFIC._cache;
      if (!cache) return;
      const need = [];
      if (key && !cache.has(key)) need.push(key);
      if (key2 && car._blend > 0.05 && !cache.has(key2)) need.push(key2);
      if (!key) { await sleep(30); continue; }
      if (!need.length) return;
      for (const k of need) {
        try { TRAFFIC._bake(k); } catch (e) { fail('bake ' + k + ' ' + (e.message || e)); }
      }
      if (need.every((k) => cache.has(k))) return;
      await sleep(40);
    }
  }

async function shot(spec) {
  const car = pose && pose.car;
  if (!car) throw new Error('boot first');
  const gap = gapFor(spec);
  spec.gap = +gap.toFixed(2);
  const srcModel = window.__CAR_SOURCE;
  const sha = srcModel && (srcModel.bytesha || srcModel.creditSha || '');
  const glbNote = !srcModel ? ''
    : (srcModel.ok
      ? '  ·  same GLB ' + (srcModel.file || 'assets/370z.glb') + ' ' + String(sha).slice(0, 12)
      : '  ·  WRONG GLB');
  spec.sub = spec.sub || (
    (spec.range === 'far' ? 'Far range ' : 'Close range ') + spec.dist + ' m'
    + '  ·  cars ' + spec.gap + ' m apart'
    + (spec.steer ? '  ·  front axle steered 0.45 rad' : '')
    + glbNote
  );
  pose = {
      az: spec.az, el: spec.el, dist: spec.dist, gap,
      steer: spec.steer || 0,
      car, hidePlayer: false, hideTraffic: false,
      title: spec.title, id: spec.id, range: spec.range
    };
    hold = true;
    await ensureBake(car);
    applyPose(pose);
    const tinyDraws = countTinyDraws(() => { origRender(); });
    const wide = snapCanvas();
    const pad = spec.range === 'far' ? 3.5 : 1.8;
    const r = screenRight(spec.az);
    const playerBox = projectBox(P.x, P.y, P.z, P.yaw, pad);
    const trafficBox = projectBox(car.x, car.y, car.z, car.yaw, pad);
    const dest = spec.range === 'far' ? 420 : 460;
    const playerCrop = playerBox ? cropOf(wide, playerBox, dest) : null;
    const trafficCrop = trafficBox ? cropOf(wide, trafficBox, dest) : null;
    if (!playerCrop || !trafficCrop) {
      hold = false;
      return { ok: false, error: 'car left the frame', id: spec.id, range: spec.range, playerBox, trafficBox };
    }
    const pInfo = sample(playerCrop.canvas);
    const tInfo = sample(trafficCrop.canvas);
    const iou = iouGrids(gridMask(pInfo, playerCrop.canvas), gridMask(tInfo, trafficCrop.canvas));
    const pBlobs = silverBlobs(pInfo, playerCrop.canvas);
    const tBlobs = silverBlobs(tInfo, trafficCrop.canvas);
    const src = sourceInfo(car);
    const metrics = {
      id: spec.id,
      range: spec.range,
      dist: spec.dist,
      iou: +iou.toFixed(3),
      sourcePx: src.sourcePx,
      displayed: src.displayed,
      tunePx: src.tunePx,
      playerPx: src.playerPx,
      usesSprite: src.sourcePx > 0,
      tinyWheelDraws: tinyDraws,
      wheelDecal: !!spec.wheelDecal || tinyDraws >= 3,
      playerBlobs: pBlobs.length,
      trafficBlobs: tBlobs.length,
      player: { maskN: pInfo.maskN, sat: +pInfo.sat.toFixed(3), lum: +pInfo.lum.toFixed(1), lumStd: +pInfo.lumStd.toFixed(1), edge: +pInfo.edge.toFixed(3), w: pInfo.w, h: pInfo.h },
      traffic: { maskN: tInfo.maskN, sat: +tInfo.sat.toFixed(3), lum: +tInfo.lum.toFixed(1), lumStd: +tInfo.lumStd.toFixed(1), edge: +tInfo.edge.toFixed(3), w: tInfo.w, h: tInfo.h }
    };
    const verdict = judgeShot(spec, metrics);
    const b64 = sheet(spec, wide, playerCrop, trafficCrop, verdict, tBlobs);
    const name = spec.range + '-' + spec.id + '.png';
    await postShot(name, b64);
    // Raw zooms, nearest-neighbor, so a reviewer can open one car at a time.
    await postShot(spec.range + '-' + spec.id + '-player.png', playerCrop.canvas.toDataURL('image/png').split(',')[1]);
    await postShot(spec.range + '-' + spec.id + '-traffic.png', trafficCrop.canvas.toDataURL('image/png').split(',')[1]);
    hold = false;
    metrics.verdict = verdict;
    metrics.file = name;
    return metrics;
  }

  async function fpsProbe() {
    const car = pose && pose.car;
    const cars = (TRAFFIC.cars || []).filter((c) => c.sim);
    const use = cars.slice(0, 12);
    if (!use.length) return { error: 'no sim cars' };
    function ringOn(on) {
      for (let i = 0; i < use.length; i++) {
        const c = use[i];
        c.on = on;
        c.sim = true;
        c.hit = false;
        c.fade = 1;
        c.pi = i % ((TRAFFIC_TUNE.paints && TRAFFIC_TUNE.paints.length) || 1);
        const a = i / use.length * Math.PI * 2;
        c.x = P.x + Math.cos(a) * 16;
        c.z = P.z + Math.sin(a) * 16;
        c.y = P.y;
        c.yaw = a;
        c.steer = 0;
        c.pitch = 0;
        c.bodyRoll = 0;
        c.nose = 0;
      }
    }
    hold = true;
    pose = null;
    FLYCAM.orbit = { az: Math.PI, el: 0.2, d: 18 };
    ringOn(true);
    const tBake = performance.now();
    for (let n = 0; n < 40; n++) {
      origRender();
      const cache = TRAFFIC._cache;
      if (!cache) break;
      let missing = 0;
      for (const c of use) {
        if (c._key && !cache.has(c._key)) {
          missing++;
          try { TRAFFIC._bake(c._key); } catch (e) {}
        }
      }
      if (!missing) break;
    }
    const bakeMs = performance.now() - tBake;
    function timeOne(on) {
      ringOn(on);
      origRender();
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now();
        origRender();
        samples.push(performance.now() - t0);
      }
      samples.sort((a, b) => a - b);
      return { samples: samples.map((v) => +v.toFixed(2)), median: +samples[2].toFixed(2) };
    }
    const on = timeOne(true);
    const off = timeOne(false);
    ringOn(false);
    if (car) car.on = true;
    hold = false;
    return {
      bakeMs: Math.round(bakeMs),
      on: on.median,
      off: off.median,
      delta: +(on.median - off.median).toFixed(2),
      samplesOn: on.samples,
      samplesOff: off.samples,
      alive: use.length
    };
  }

  window.__CAR_DESIGN = { boot, shot, fpsProbe, errors };
})();
