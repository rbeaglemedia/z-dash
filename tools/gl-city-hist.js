#!/usr/bin/env node
'use strict';
// Frame-time histogram for ?gl=1 versus the 2D canvas.
// Software GL on this VM is not a phone FPS number. 1% low is the
// average of the slowest 1% of frames. Peaks are not the score.
//   node tools/gl-city-hist.js
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';
const PORT = 8795;
const FRAMES = 280;
const WARM = 40;

function mime(file) {
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.webmanifest': 'application/manifest+json'
  })[path.extname(file).toLowerCase()] || 'application/octet-stream';
}
function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing'); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
}
async function waitJson(url) {
  for (let i = 0; i < 40; i++) {
    try { const res = await fetch(url); if (res.ok) return await res.json(); } catch (e) {}
    await sleep(150);
  }
  throw new Error('Chrome debug endpoint not ready');
}
async function evalJs(cdp, sessionId, expression) {
  const ev = await cdp.send('Runtime.evaluate', {
    expression: expression, returnByValue: true, awaitPromise: true
  }, sessionId);
  if (ev.exceptionDetails) throw new Error(JSON.stringify(ev.exceptionDetails).slice(0, 900));
  return ev.result && ev.result.value;
}

function pct(sorted, p) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
  return sorted[i];
}
function summarize(samples) {
  const xs = samples.slice().sort(function (a, b) { return a - b; });
  const n = xs.length;
  const worstN = Math.max(1, Math.round(n * 0.01));
  let slow = 0;
  for (let i = n - worstN; i < n; i++) slow += xs[i];
  const low = slow / worstN;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += xs[i];
  return {
    n: n,
    avg: Math.round(sum / n * 10) / 10,
    p50: Math.round(pct(xs, 0.50) * 10) / 10,
    p95: Math.round(pct(xs, 0.95) * 10) / 10,
    p99: Math.round(pct(xs, 0.99) * 10) / 10,
    low1: Math.round(low * 10) / 10,
    worst: Math.round(xs[n - 1] * 10) / 10,
    best: Math.round(xs[0] * 10) / 10
  };
}

const PLACE = `(function(){
  var shops=CITY.BL.filter(function(b){
    return b&&b.boxes&&b.boxes.length&&b.kind!=='outline'&&!b.nosStation&&b.top>=8&&b.top<=28;
  });
  shops.sort(function(a,b){return (a.top||0)-(b.top||0);});
  var face=shops[Math.floor(shops.length/2)]||shops[0];
  var s=face.sign||{}, nx=s.nx||0, nz=s.nz||0;
  if(!nx&&!nz) nz=-1;
  var x=face.cx+nx*16, z=face.cz+nz*16, yaw=Math.atan2(nx,nz);
  ['kOver','kHome','kPzBg','kWreck'].forEach(function(id){var e=document.getElementById(id); if(e) e.classList.add('hidden');});
  P.x=x; P.y=0; P.z=z; P.yaw=yaw; P.hd=yaw; P.pitch=0; P.roll=0; P.bank=0;
  P.v=18; P.ground=true; P.wreck=null; P.ebK=0; P.loop=null;
  if(typeof VP!=='undefined'&&VP) VP.cp=null;
  window.__histFace={x:x,z:z,yaw:yaw};
  return {x:x,z:z,yaw:yaw,id:face.id};
})()`;

function arm(mode) {
  const drive = mode === 'drive';
  return `(function(){
    var s=window.__histFace;
    P.x=s.x; P.z=s.z; P.y=0; P.yaw=s.yaw; P.hd=s.yaw; P.v=${drive ? 18 : 0}; P.ground=true;
    paused=${drive ? 'false' : 'true'}; flying=${drive ? 'true' : 'false'};
    FLYCAM.orbit=${drive ? 'null' : '{az:0, el:0.14, d:22}'};
    var cams=0, camOrig=camS;
    camS=function(x,y,z){cams++; return camOrig(x,y,z);};
    var bldgMs=0, bldgN=0, drawOrig=drawBldg;
    drawBldg=function(b,d){var t=performance.now(); drawOrig(b,d); bldgMs+=performance.now()-t; bldgN++;};
    var raf=[], js=[], comp=[], buildings=[], bldg=[];
    var prev=performance.now();
    var left=${FRAMES + WARM};
    var renderOrig=render;
    var resolveHist;
    render=function(){
      var t0=performance.now();
      renderOrig();
      var t1=performance.now();
      var g=null; try{ g=window.GLCITY&&GLCITY.stats?GLCITY.stats():null; }catch(e){}
      raf.push(t0-prev); js.push(t1-t0);
      comp.push(g&&g.composeMs||0);
      buildings.push(g&&g.buildings||0);
      bldg.push(bldgMs); bldgMs=0;
      prev=t0;
      if(--left<=0){
        render=renderOrig;
        camS=camOrig;
        drawBldg=drawOrig;
        var cut=${WARM};
        var per=Math.round(cams/${FRAMES + WARM});
        resolveHist({
          raf:raf.slice(cut), js:js.slice(cut), comp:comp.slice(cut), bldg:bldg.slice(cut),
          buildings:buildings[buildings.length-1],
          cams:per, canvas:{w:cv.width,h:cv.height},
          gl:g&&{ready:g.ready, glow:g.glow, webgl:g.webgl, error:g.error}
        });
      }
    };
    return new Promise(function(res){ resolveHist=res; });
  })()`;
}

async function main() {
  const server = await startServer();
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-gl-hist-'));
  const child = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--mute-audio', '--remote-debugging-port=' + (PORT + 1),
    '--user-data-dir=' + dir, 'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (b) => { stderr += b.toString(); });
  const out = [];
  try {
    const ver = await waitJson('http://127.0.0.1:' + (PORT + 1) + '/json/version');
    const cdp = new Cdp(ver.webSocketDebuggerUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 844, height: 390, deviceScaleFactor: 2, mobile: true
    }, sessionId);
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 }, sessionId);
    for (const mode of ['', '?gl=1']) {
      await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/world.html' + mode }, sessionId);
      let ready = false;
      for (let i = 0; i < 60 && !ready; i++) {
        ready = !!(await evalJs(cdp, sessionId, 'typeof render==="function"&&typeof CITY!=="undefined"&&cv.width>0'));
        if (!ready) await sleep(200);
      }
      if (!ready) throw new Error('boot ' + mode + ' ' + stderr.slice(-300));
      await sleep(400);
      const place = await evalJs(cdp, sessionId, PLACE);
      for (const run of ['still', 'drive']) {
        const raw = await evalJs(cdp, sessionId, arm(run));
        const row = {
          mode: mode === '?gl=1' ? 'gl' : '2d', run: run, place: place,
          raf: summarize(raw.raf), js: summarize(raw.js), comp: summarize(raw.comp), bldg: summarize(raw.bldg || []),
          buildings: raw.buildings, cams: raw.cams, canvas: raw.canvas, gl: raw.gl
        };
        out.push(row);
        console.log(row.mode, row.run, 'raf p50', row.raf.p50, 'p95', row.raf.p95, 'low1', row.raf.low1, 'worst', row.raf.worst, 'js p95', row.js.p95, 'js low1', row.js.low1, 'bldg p50', row.bldg.p50, 'bldg p95', row.bldg.p95, 'comp p95', row.comp.p95, 'cams', row.cams, 'n', row.buildings);
      }
    }
  } finally {
    child.kill('SIGKILL');
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const stamp = new Date().toISOString();
  const file = path.join(ROOT, 'test-results', 'gl-city-proof', 'hist.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ stamp: stamp, note: 'SwiftShader phone 844x390 dpr 2. Not a device FPS. 1% low is the mean of the slowest 1% of frames after a 40-frame warmup.', rows: out }, null, 2));
  console.log('wrote', file);
}

main().catch((e) => { console.error(e); process.exit(1); });
