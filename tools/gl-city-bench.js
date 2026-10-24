#!/usr/bin/env node
/**
 * Headless before/after for the ?gl=1 building pass.
 *
 *   node tools/gl-city-bench.js --out test-results/gl-city
 *   node tools/gl-city-bench.js --quick
 *
 * One Chrome at a time. Five rAF samples per shot (the first interval is dropped).
 * Software WebGL on this VM is not a phone GPU. submitMs / gpuMs are the
 * building-pass numbers. blitMs stays 0 (the canvases stack; nothing reads the GL buffer back).
 * rafMs is the whole frame, including the player car.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';

const VIEWPORTS = [
  {
    id: 'phone',
    width: 844, height: 390, dpr: 2, mobile: true, touch: true,
    ua: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'ipad',
    width: 1024, height: 768, dpr: 2, mobile: true, touch: true,
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.7 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'pc',
    width: 1366, height: 768, dpr: 1, mobile: false, touch: false,
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
];

const SHOTS = ['air', 'face', 'shops', 'glow'];

function mime(file) {
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.webmanifest': 'application/manifest+json',
    '.woff2': 'font/woff2', '.woff': 'font/woff'
  })[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + rel); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.next = 1;
    this.pending = new Map();
    this.ready = new Promise((res, rej) => {
      this.ws.addEventListener('open', res);
      this.ws.addEventListener('error', () => rej(new Error('cdp socket error')));
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error(msg.error.message || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      }
    });
  }
  async send(method, params, sessionId) {
    await this.ready;
    const id = this.next++;
    const body = { id: id, method: method, params: params || {} };
    if (sessionId) body.sessionId = sessionId;
    this.ws.send(JSON.stringify(body));
    return new Promise((res, rej) => this.pending.set(id, { res: res, rej: rej }));
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function waitJson(url) {
  let last = '';
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('Chrome debug endpoint not ready: ' + last);
}

function poseSource(name) {
  // IIFE: CDP reuses one eval scope, so a top-level const throws on the second shot.
  return `
    (function () {
      var shots = {
        air: {x:40, y:170, z:220, yaw:0.35, pitch:-0.08, ground:false},
        face: {x:448, y:42, z:1200, yaw:Math.PI/2, pitch:0, ground:true},
        shops: {x:286, y:7, z:1935, yaw:Math.PI, pitch:0.03, ground:true},
        glow: {x:200, y:12, z:860, yaw:0.02, pitch:0, ground:true}
      };
      var s = shots[${JSON.stringify(name)}];
      paused = true;
      flying = false;
      ['kOver', 'kHome', 'kPzBg', 'kWreck'].forEach(function (id) {
        var e = document.getElementById(id); if (e) e.classList.add('hidden');
      });
      P.x = s.x; P.y = s.y; P.z = s.z; P.yaw = s.yaw; P.pitch = s.pitch; P.hd = s.yaw;
      P.roll = 0; P.bank = 0; P.v = 0; P.ground = s.ground; P.wreck = null; P.ebK = 0; P.loop = null;
      if (typeof VP !== 'undefined' && VP) VP.cp = null;
    })()
  `;
}

function sampleSource(n) {
  return `
    new Promise(function (resolve) {
      const dz = drawZ;
      drawZ = function () {};
      const orig = drawBldg;
      let bldgAcc = 0;
      drawBldg = function (b, d) {
        const t = performance.now();
        orig(b, d);
        bldgAcc += performance.now() - t;
      };
      const rows = [];
      let prev = performance.now();
      let left = ${n + 1};
      function tick() {
        const now = performance.now();
        let gl = null;
        try { gl = window.GLCITY ? GLCITY.stats() : null; } catch (e) { gl = { error: String(e) }; }
        rows.push({ dt: now - prev, bldg: bldgAcc, gl: gl });
        bldgAcc = 0;
        prev = now;
        if (--left > 0) requestAnimationFrame(tick);
        else {
          drawZ = dz;
          drawBldg = orig;
          const keep = rows.slice(1, ${n + 1});
          resolve({
            raf: keep.map(function (r) { return Math.round(r.dt * 10) / 10; }),
            bldg: keep.map(function (r) { return Math.round(r.bldg * 10) / 10; }),
            gl: keep[keep.length - 1] ? keep[keep.length - 1].gl : null,
            canvas: { w: cv.width, h: cv.height, W: W, H: H, DPR: DPR },
            cam: { x: Math.round(cam.x), y: Math.round(cam.y), z: Math.round(cam.z), yaw: Math.round(cam.yaw * 100) / 100 },
            P: { x: Math.round(P.x), y: Math.round(P.y), z: Math.round(P.z) },
            stack: {
              cgl: document.getElementById('cgl') ? document.getElementById('cgl').width : 0,
              cback: document.getElementById('cback') ? document.getElementById('cback').width : 0
            }
          });
        }
      }
      requestAnimationFrame(tick);
    })
  `;
}

async function run() {
  const args = process.argv.slice(2);
  let outDir = path.join(ROOT, 'test-results', 'gl-city');
  let quick = false;
  let port = 8766;
  let gpu = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') outDir = path.resolve(args[++i]);
    else if (args[i] === '--quick') quick = true;
    else if (args[i] === '--port') port = Number(args[++i]);
    else if (args[i] === '--gpu') gpu = true;
  }
  const shots = quick ? ['face', 'air'] : SHOTS;
  const views = quick ? [VIEWPORTS[0]] : VIEWPORTS;
  const samples = quick ? 2 : 5;
  fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

  const server = await startServer(port);
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-gl-chrome-'));
  const chromeArgs = [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--mute-audio',
    '--remote-debugging-port=' + (port + 1), '--user-data-dir=' + dir,
    'about:blank'
  ];
  if (!gpu) chromeArgs.splice(1, 0, '--disable-gpu');
  const child = spawn(CHROME, chromeArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (b) => { stderr += b.toString(); });
  const results = [];
  try {
    const ver = await waitJson('http://127.0.0.1:' + (port + 1) + '/json/version');
    const cdp = new Cdp(ver.webSocketDebuggerUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Network.enable', {}, sessionId);

    for (const vp of views) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: vp.mobile
      }, sessionId);
      await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: !!vp.touch, maxTouchPoints: 1 }, sessionId);
      await cdp.send('Network.setUserAgentOverride', { userAgent: vp.ua }, sessionId);
      for (const mode of [0, 1]) {
        const url = 'http://127.0.0.1:' + port + '/world-split.html?gl=' + mode;
        await cdp.send('Page.navigate', { url: url }, sessionId);
        await sleep(400);
        let ready = false;
        for (let i = 0; i < 40 && !ready; i++) {
          const probe = await cdp.send('Runtime.evaluate', {
            expression: 'typeof drawBldg==="function" && typeof CITY!=="undefined" && typeof cv!=="undefined" && cv.width>0',
            returnByValue: true
          }, sessionId);
          ready = !!(probe.result && probe.result.value);
          if (!ready) await sleep(200);
        }
        if (!ready) throw new Error('page did not boot ' + vp.id + ' gl=' + mode);
        await sleep(quick ? 400 : 1200);
        for (const shot of shots) {
          await cdp.send('Runtime.evaluate', { expression: poseSource(shot), returnByValue: true }, sessionId);
          await sleep(quick ? 250 : 700);
          const ev = await cdp.send('Runtime.evaluate', {
            expression: sampleSource(samples),
            awaitPromise: true,
            returnByValue: true
          }, sessionId);
          if (ev.exceptionDetails) throw new Error(JSON.stringify(ev.exceptionDetails).slice(0, 800));
          await cdp.send('Runtime.evaluate', {
            expression: 'new Promise(function(r){ requestAnimationFrame(function(){ requestAnimationFrame(r); }); })',
            awaitPromise: true
          }, sessionId);
          const value = ev.result && ev.result.value;
          const shotPng = path.join(outDir, 'screenshots', vp.id + '-' + shot + '-gl' + mode + '.png');
          const cap = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
          fs.writeFileSync(shotPng, Buffer.from(cap.data, 'base64'));
          results.push({
            viewport: vp.id, css: vp.width + 'x' + vp.height, dpr: vp.dpr,
            gl: mode, shot: shot, file: path.relative(outDir, shotPng),
            measure: value
          });
          const g = value && value.gl;
          console.log(vp.id, 'gl=' + mode, shot, 'canvas', value && value.canvas, 'cam', value && value.cam, 'P', value && value.P, 'stack', value && value.stack, 'raf', value && value.raf, 'bldg', value && value.bldg, 'compose', g && g.composeMs, 'blit', g && g.blitMs, 'gpu', g && g.gpuMs, 'submit', g && g.submitMs, 'n', g && g.buildings, 'err', g && g.error);
        }
      }
    }
    cdp.close();
  } finally {
    child.kill('SIGKILL');
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const stamp = new Date().toISOString();
  fs.writeFileSync(path.join(outDir, 'bench.json'), JSON.stringify({ stamp: stamp, gpu: gpu, quick: quick, results: results, stderrTail: stderr.slice(-2000) }, null, 2));
  fs.writeFileSync(path.join(outDir, 'bench.md'), renderMd(results, stamp, gpu));
  console.log('wrote', outDir);
}

function avg(xs) {
  if (!xs || !xs.length) return null;
  let s = 0;
  for (let i = 0; i < xs.length; i++) s += xs[i];
  return Math.round(s / xs.length * 10) / 10;
}

function renderMd(results, stamp, gpu) {
  const lines = [];
  lines.push('# WebGL building bench');
  lines.push('');
  lines.push('Stamp ' + stamp + '. Chrome ' + (gpu ? 'GPU allowed' : '`--disable-gpu` (software WebGL)') + '.');
  lines.push('`raf` is the whole frame with the player car stubbed out, so the number is the city pass. `bldg` is time inside `drawBldg` (2D solid, or 2D leftovers when `gl=1`). `compose` is submit + the WebGL draw. `blit` is 0: the GL canvas is on screen, not copied.');
  lines.push('Five samples, first interval dropped. This VM is not a Galaxy or an A10.');
  lines.push('');
  lines.push('| view | shot | canvas | 2D raf ms | 2D bldg ms | GL raf ms | GL bldg ms | GL compose ms | GL blit ms | buildings |');
  lines.push('|---|---|---|---:|---:|---:|---:|---:|---:|---:|');
  const key = (r) => r.viewport + '|' + r.shot;
  const by = new Map();
  for (const r of results) {
    if (!by.has(key(r))) by.set(key(r), {});
    by.get(key(r))[r.gl] = r;
  }
  for (const pair of by.values()) {
    const a = pair[0], b = pair[1];
    const base = a || b;
    const cv = (base.measure && base.measure.canvas) || {};
    const gs = b && b.measure && b.measure.gl || {};
    lines.push([
      base.viewport,
      base.shot,
      (cv.w || '?') + 'x' + (cv.h || '?') + ' dpr ' + (cv.DPR || '?'),
      a ? avg(a.measure.raf) : '',
      a ? avg(a.measure.bldg) : '',
      b ? avg(b.measure.raf) : '',
      b ? avg(b.measure.bldg) : '',
      b ? (gs.composeMs != null ? Math.round(gs.composeMs * 10) / 10 : '') : '',
      b ? (gs.blitMs != null ? Math.round(gs.blitMs * 10) / 10 : '') : '',
      b ? (gs.buildings != null ? gs.buildings : '') : ''
    ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'));
  }
  lines.push('');
  lines.push('## WebGL');
  lines.push('');
  const any = results.find((r) => r.gl === 1 && r.measure && r.measure.gl);
  if (any) {
    const g = any.measure.gl;
    lines.push('```json');
    lines.push(JSON.stringify({ webgl: g.webgl, limits: g.limits, fallback: g.fallback, error: g.error, loadMs: g.loadMs, assetErr: g.assetErr }, null, 2));
    lines.push('```');
  }
  lines.push('');
  return lines.join('\n');
}

run().catch((e) => { console.error(e); process.exit(1); });
