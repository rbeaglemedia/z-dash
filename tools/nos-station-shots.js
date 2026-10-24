#!/usr/bin/env node
'use strict';
// Live shots of the built NOS station, plus a claim check.
// One Chrome. Software GL on this VM is not a phone FPS number.
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'test-results', 'gl-city', 'looks');
const ART = '/opt/cursor/artifacts/gl-city/looks';
const PORT = 8771;

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
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/world-split.html';
    const file = path.normalize(path.join(ROOT, rel));
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
    const body = { id, method, params: params || {} };
    if (sessionId) body.sessionId = sessionId;
    this.ws.send(JSON.stringify(body));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }
}

async function waitJson(url) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    await sleep(150);
  }
  throw new Error('Chrome debug endpoint not ready');
}

async function evalJs(cdp, sessionId, expression) {
  const ev = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (ev.exceptionDetails) throw new Error(JSON.stringify(ev.exceptionDetails).slice(0, 900));
  return ev.result && ev.result.value;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  const server = await startServer();
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-nos-chrome-'));
  const child = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--mute-audio', '--remote-debugging-port=' + (PORT + 1),
    '--user-data-dir=' + dir, 'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (b) => { stderr += b.toString(); });
  try {
    const ver = await waitJson('http://127.0.0.1:' + (PORT + 1) + '/json/version');
    const cdp = new Cdp(ver.webSocketDebuggerUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1024, height: 768, deviceScaleFactor: 1, mobile: true
    }, sessionId);
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 }, sessionId);
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/world-split.html' }, sessionId);
    let ready = false;
    for (let i = 0; i < 50 && !ready; i++) {
      const v = await evalJs(cdp, sessionId, 'typeof NOS_STATION==="object" && typeof CITY!=="undefined" && typeof WALK_MODE!=="undefined" && typeof drawBldg==="function"');
      ready = !!v;
      if (!ready) await sleep(200);
    }
    if (!ready) throw new Error('page did not boot\n' + stderr.slice(-500));
    await sleep(600);
    const report = await evalJs(cdp, sessionId, `(function(){
      var shops = CITY.BL.filter(function(b){return b.purpose==='NOS';}).map(function(b){
        return {id:b.id, kind:b.nosStation&&b.nosStation.kind, pumps:(b.nosStation&&b.nosStation.pumps||[]).length, boxes:b.boxes.length, h:b.top};
      });
      ['kOver','kHome','kPzBg','kWreck'].forEach(function(id){var e=document.getElementById(id); if(e) e.classList.add('hidden');});
      paused = true; flying = false;
      var st = CITY.BL.filter(function(b){return b.nosStation&&b.nosStation.kind==='station';})[0];
      var lane = st.nosStation.lane;
      var cx=(lane.x0+lane.x1)/2, cz=(lane.z0+lane.z1)/2;
      P.nosTank=0.2; P.hotDropNosT=0; P.x=cx; P.z=cz; P.y=0; P.v=0; P.ground=true; P.wreck=null; P.pitch=0;
      WALK_MODE.onFoot=false; WALK_MODE.insideBuilding=false; WALK_MODE.insideDoor=null;
      var hit = WALK_MODE.enterDoor();
      var claimed = {tank:P.nosTank, hot:P.hotDropNosT, inside:!!WALK_MODE.insideBuilding, onFoot:!!WALK_MODE.onFoot, hit:hit};
      P.nosTank=0.2; P.hotDropNosT=0; P.x=st.cx; P.z=st.cz; P.v=0;
      WALK_MODE.enterDoor();
      var kiosk = {tank:P.nosTank, hot:P.hotDropNosT, inside:!!WALK_MODE.insideBuilding};
      var laneHit = CITY.probe(cx, cz, 0.4);
      var post = st.boxes.filter(function(q){return q.nosPart==='post';})[0];
      var pumpBox = st.boxes.filter(function(q){return q.nosPart==='pump';})[0];
      return {shops:shops, claimed:claimed, kiosk:kiosk, under:{ce:laneHit.ce, wl:!!laneHit.wl, fl:laneHit.fl},
        pumpWall:!!CITY.hit((pumpBox.x0+pumpBox.x1)/2,(pumpBox.z0+pumpBox.z1)/2,0.2,0.4),
        postWall:!!CITY.hit((post.x0+post.x1)/2,(post.z0+post.z1)/2,0.2,0.4)};
    })()`);
    const shots = [
      { name: 'nos-live-station-front-ipad', x: -231.35, z: 163, yaw: Math.PI / 2, el: 0.12, az: 0, d: 18 },
      { name: 'nos-live-station-threeq-ipad', x: -231.35, z: 163, yaw: Math.PI / 2, el: 0.28, az: 0.75, d: 22 },
      { name: 'nos-live-station-roof-ipad', x: -230, z: 163, yaw: Math.PI / 2, el: 1.05, az: 0.4, d: 26 },
      { name: 'nos-live-station-foot-ipad', x: -232.2, z: 164.4, yaw: Math.PI / 2, el: 0.02, az: 0.35, d: 8 },
      { name: 'nos-live-depot-front-ipad', x: -300, z: 1522.65, yaw: 0, el: 0.16, az: 0, d: 22 }
    ];
    for (const s of shots) {
      await evalJs(cdp, sessionId, `(function(){
        paused=true; flying=false; P.ground=true; P.y=0; P.v=0; P.pitch=0; P.wreck=null;
        P.x=${s.x}; P.z=${s.z}; P.yaw=${s.yaw}; P.hd=${s.yaw};
        FLYCAM.orbit={az:${s.az}, el:${s.el}, d:${s.d}};
        if(typeof WALK_MODE!=='undefined'){WALK_MODE.onFoot=false; WALK_MODE.insideBuilding=false;}
      })()`);
      await evalJs(cdp, sessionId, 'new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r);});})');
      await sleep(200);
      const cap = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
      const buf = Buffer.from(cap.data, 'base64');
      fs.writeFileSync(path.join(OUT, s.name + '.png'), buf);
      fs.writeFileSync(path.join(ART, s.name + '.png'), buf);
    }
    fs.writeFileSync(path.join(OUT, 'nos-live-claim.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    child.kill('SIGKILL');
    server.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
