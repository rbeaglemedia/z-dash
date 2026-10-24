#!/usr/bin/env node
'use strict';
// Side-by-side proof that ?gl=1 matches today's 2D buildings on the boulevard map.
// One Chrome. Software GL on this VM is not a phone FPS number.
//   node tools/gl-city-proof.js
//   node tools/gl-city-proof.js --quick
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';
const PORT = 8791;

const VIEWPORTS = [
  {
    id: 'phone', width: 844, height: 390, dpr: 2, mobile: true, touch: true,
    ua: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'ipad', width: 1024, height: 768, dpr: 1, mobile: true, touch: true,
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.7 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'pc', width: 1366, height: 768, dpr: 1, mobile: false, touch: false,
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
];

const PAGES = ['world.html', 'world-split.html'];
const SHOTS = ['face', 'nos', 'air'];

function mime(file) {
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.webmanifest': 'application/manifest+json',
    '.woff2': 'font/woff2', '.woff': 'font/woff'
  })[path.extname(file).toLowerCase()] || 'application/octet-stream';
}
function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
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
    const body = { id: id, method: method, params: params || {} };
    if (sessionId) body.sessionId = body.sessionId;
    if (sessionId) body.sessionId = sessionId;
    this.ws.send(JSON.stringify(body));
    return new Promise((res, rej) => this.pending.set(id, { res: res, rej: rej }));
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
  const ev = await cdp.send('Runtime.evaluate', { expression: expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (ev.exceptionDetails) throw new Error(JSON.stringify(ev.exceptionDetails).slice(0, 900));
  return ev.result && ev.result.value;
}

const PICK = `(function(){
  function front(b, stand, el, d, y){
    var s=b.sign||{}, nx=s.nx||0, nz=s.nz||0;
    if(!nx&&!nz) nz=-1;
    var cx=b.cx, cz=b.cz;
    return {id:b.id, purpose:b.purpose, h:b.top, kind:b.nosStation?b.nosStation.kind:'shop',
      x:cx+nx*stand, y:y, z:cz+nz*stand, yaw:Math.atan2(nx,nz), pitch:0, ground:y<3,
      el:el, d:d, az:0};
  }
  var shops=CITY.BL.filter(function(b){
    return b&&b.purpose&&b.boxes&&b.boxes.length&&b.kind!=='outline'&&!b.nosStation&&b.purpose!=='SKY_DROP'&&b.top>=8&&b.top<=28;
  });
  shops.sort(function(a,b){return (a.top||0)-(b.top||0);});
  var face=shops[Math.floor(shops.length/2)]||shops[0];
  var nos=CITY.BL.filter(function(b){return b.nosStation&&b.nosStation.kind==='station';})[0]
    ||CITY.BL.filter(function(b){return b.purpose==='NOS';})[0];
  var cx=0,cz=0; shops.forEach(function(b){cx+=b.cx;cz+=b.cz;});
  cx/=shops.length; cz/=shops.length;
  window.__proofRef={face:face, nos:nos};
  return {
    n:shops.length,
    face:front(face, 16, 0.14, 22, 0),
    nos:front(nos||face, 14, 0.16, 18, 0),
    air:{id:0, purpose:'air', h:0, kind:'air', x:cx, y:0, z:cz, yaw:0.45, pitch:0, ground:false, el:1.05, d:70, az:0.35}
  };
})()`;

function applySource(pose) {
  return `(function(){
    var s=${JSON.stringify(pose)};
    paused=true; flying=false;
    ['kOver','kHome','kPzBg','kWreck'].forEach(function(id){var e=document.getElementById(id); if(e) e.classList.add('hidden');});
    P.x=s.x; P.y=s.y; P.z=s.z; P.yaw=s.yaw; P.hd=s.yaw; P.pitch=0; P.roll=0; P.bank=0;
    P.v=0; P.ground=!!s.ground; P.wreck=null; P.ebK=0; P.loop=null;
    FLYCAM.orbit={az:s.az||0, el:s.el, d:s.d};
    if(typeof VP!=='undefined'&&VP) VP.cp=null;
  })()`;
}

function anchorSource(shot) {
  return `(function(){
    var b=window.__proofRef&&window.__proofRef[${JSON.stringify(shot)}];
    if(!b||!b.boxes||!b.boxes[0]||typeof proj!=='function') return null;
    var q=b.boxes[0];
    var y=Math.min(q.y1||b.top||8, (q.y0||0)+Math.max(4,(q.y1||8)*0.55));
    var p=proj(q.x0, y, q.z0);
    if(!p) return null;
    return {u:p[0]/Math.max(W,1), v:p[1]/Math.max(H,1), purpose:b.purpose, id:b.id};
  })()`;
}

function sampleSource(n) {
  return `new Promise(function(resolve){
    var dz=drawZ; drawZ=function(){};
    var orig=drawBldg, acc=0;
    drawBldg=function(b,d){var t=performance.now(); orig(b,d); acc+=performance.now()-t;};
    var rows=[], prev=performance.now(), left=${n + 1};
    function tick(){
      var now=performance.now();
      var gl=null; try{ gl=window.GLCITY?GLCITY.stats():null; }catch(e){ gl={error:String(e)}; }
      rows.push({dt:now-prev, bldg:acc, gl:gl});
      acc=0; prev=now;
      if(--left>0) requestAnimationFrame(tick);
      else {
        drawZ=dz; drawBldg=orig;
        var keep=rows.slice(1);
        var blur=0; try{ blur=(document.documentElement.innerHTML.match(/shadowBlur/g)||[]).length; }catch(e){}
        resolve({
          raf:keep.map(function(r){return Math.round(r.dt*10)/10;}),
          bldg:keep.map(function(r){return Math.round(r.bldg*10)/10;}),
          gl:keep[keep.length-1]?keep[keep.length-1].gl:null,
          canvas:{w:cv.width,h:cv.height,W:W,H:H,DPR:DPR},
          scripts:[].map.call(document.scripts,function(s){return s.src;}).filter(function(s){return /gl-city|nos-station/.test(s);})
        });
      }
    }
    requestAnimationFrame(tick);
  })`;
}

function avg(xs) {
  if (!xs || !xs.length) return null;
  let s = 0;
  for (let i = 0; i < xs.length; i++) s += xs[i];
  return Math.round(s / xs.length * 10) / 10;
}

async function main() {
  const quick = process.argv.indexOf('--quick') >= 0;
  const pages = quick ? ['world.html'] : PAGES;
  const views = quick ? [VIEWPORTS[1]] : VIEWPORTS;
  const shots = quick ? ['face'] : SHOTS;
  const samples = quick ? 2 : 5;
  const out = path.join(ROOT, 'test-results', 'gl-city-proof');
  const art = '/opt/cursor/artifacts/gl-city-proof';
  fs.mkdirSync(path.join(out, 'shots'), { recursive: true });
  fs.mkdirSync(art, { recursive: true });
  const server = await startServer();
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-gl-proof-'));
  const child = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--mute-audio', '--remote-debugging-port=' + (PORT + 1),
    '--user-data-dir=' + dir, 'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (b) => { stderr += b.toString(); });
  const results = [];
  try {
    const ver = await waitJson('http://127.0.0.1:' + (PORT + 1) + '/json/version');
    const cdp = new Cdp(ver.webSocketDebuggerUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    const modes = [
      { id: '2d', q: '' },
      { id: 'gl', q: '?gl=1' },
      { id: 'glow', q: '?gl=1&glow=1' }
    ];
    for (const page of pages) {
      for (const vp of views) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: vp.mobile
        }, sessionId);
        await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: !!vp.touch, maxTouchPoints: 1 }, sessionId);
        await cdp.send('Network.setUserAgentOverride', { userAgent: vp.ua }, sessionId);
        for (const mode of modes) {
          if (mode.id === 'glow' && (page !== 'world.html' || quick)) continue;
          const url = 'http://127.0.0.1:' + PORT + '/' + page + mode.q;
          await cdp.send('Page.navigate', { url: url }, sessionId);
          let ready = false;
          for (let i = 0; i < 60 && !ready; i++) {
            const v = await evalJs(cdp, sessionId, 'typeof drawBldg==="function"&&typeof CITY!=="undefined"&&typeof FLYCAM!=="undefined"&&cv.width>0');
            ready = !!v;
            if (!ready) await sleep(200);
          }
          if (!ready) throw new Error('did not boot ' + page + ' ' + mode.id + ' ' + vp.id + '\n' + stderr.slice(-400));
          await sleep(quick ? 300 : 700);
          const picked = await evalJs(cdp, sessionId, PICK);
          const useShots = mode.id === 'glow' ? ['face'] : shots;
          for (const shot of useShots) {
            await evalJs(cdp, sessionId, applySource(picked[shot]));
            await evalJs(cdp, sessionId, 'new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r);});})');
            const anchor = await evalJs(cdp, sessionId, anchorSource(shot === 'air' ? 'face' : shot));
            const measure = await evalJs(cdp, sessionId, sampleSource(samples));
            await evalJs(cdp, sessionId, 'new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r);});})');
            const cap = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
            const name = page.replace('.html', '') + '-' + vp.id + '-' + shot + '-' + mode.id + '.png';
            const buf = Buffer.from(cap.data, 'base64');
            fs.writeFileSync(path.join(out, 'shots', name), buf);
            fs.writeFileSync(path.join(art, name), buf);
            const g = measure && measure.gl;
            const row = {
              page: page, viewport: vp.id, shot: shot, mode: mode.id, file: name,
              raf: avg(measure.raf), bldg: avg(measure.bldg),
              fps: measure.raf && avg(measure.raf) ? Math.round(1000 / avg(measure.raf)) : null,
              compose: g && g.composeMs != null ? Math.round(g.composeMs * 10) / 10 : null,
              blit: g && g.blitMs != null ? g.blitMs : null,
              buildings: g && g.buildings,
              glow: g && g.glow,
              ready: g && g.ready,
              canvas: measure.canvas,
              scripts: measure.scripts,
              anchor: anchor,
              pose: picked[shot]
            };
            results.push(row);
            console.log(page, vp.id, shot, mode.id, 'raf', row.raf, 'fps', row.fps, 'bldg', row.bldg, 'compose', row.compose, 'n', row.buildings, 'canvas', measure.canvas && (measure.canvas.w + 'x' + measure.canvas.h));
          }
        }
      }
    }
  } finally {
    child.kill('SIGKILL');
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const stamp = new Date().toISOString();
  fs.writeFileSync(path.join(out, 'proof.json'), JSON.stringify({ stamp: stamp, note: 'SwiftShader, car draw stubbed, not a Galaxy or iPad FPS', results: results, stderrTail: stderr.slice(-1500) }, null, 2));
  console.log('wrote', out);
}

main().catch((e) => { console.error(e); process.exit(1); });
