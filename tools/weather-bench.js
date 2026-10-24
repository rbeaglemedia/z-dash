#!/usr/bin/env node
/**
 * Weather prototype bench. One Chrome at a time.
 * Phone / iPad / PC viewports match the city-builder FPS harness
 * (844×390 dpr 3 throttle 4, 1180×820 dpr 2 throttle 2, 1366×768 dpr 1 throttle 1).
 * Five frame-time pairs per device, same pinned pose, weather off then on.
 *
 *   node tools/weather-bench.js --smoke
 *   node tools/weather-bench.js --shots
 *   node tools/weather-bench.js --fps
 *   node tools/weather-bench.js
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';
const OUT = path.resolve(process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : path.join(ROOT, 'test-results', 'weather'));
const ART = '/opt/cursor/artifacts/weather';
const SMOKE = process.argv.includes('--smoke');
const PROBE = process.argv.includes('--probe');
const DO_FPS = !PROBE && (process.argv.includes('--fps') || (!SMOKE && !process.argv.includes('--shots')));
const DO_SHOTS = PROBE || process.argv.includes('--shots') || (!SMOKE && !process.argv.includes('--fps')) || SMOKE;

const DEVICES = [
  { id: 'phone', width: 844, height: 390, dpr: 2, throttle: 4, mobile: true, touch: true },
  { id: 'ipad', width: 1180, height: 820, dpr: 2, throttle: 2, mobile: true, touch: true },
  { id: 'pc', width: 1366, height: 768, dpr: 1, throttle: 1, mobile: false, touch: false }
];

const POSES = [
  { id: 'sand_wall_outside', kind: 'sand', where: 'wall', x: -90, z: 460, yaw: -Math.PI / 2 },
  { id: 'sand_filter_inside', kind: 'sand', where: 'inside', x: -260, z: 460, yaw: 0 },
  { id: 'fog_wall_outside', kind: 'fog', where: 'wall', x: 0, z: 1450, yaw: 0 },
  { id: 'fog_filter_inside', kind: 'fog', where: 'inside', x: 20, z: 1595, yaw: 0 },
  { id: 'rain_wall_outside', kind: 'rain', where: 'wall', x: 150, z: 520, yaw: Math.PI / 2 },
  { id: 'rain_filter_inside', kind: 'rain', where: 'inside', x: 370, z: 520, yaw: 0 }
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function startServer(port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/world.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing'); return; }
      const ext = path.extname(file).toLowerCase();
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function launchChrome(port) {
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-weather-chrome-'));
  const args = [
    '--headless=new', '--disable-gpu', '--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--enable-webgl', '--ignore-gpu-blocklist',
    '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--mute-audio',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir, '--window-size=1280,800',
    'about:blank'
  ];
  const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return { child, dir };
}

async function waitJson(url, tries) {
  let last = '';
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('chrome debug not ready: ' + last);
}

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
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 60000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function ev(cdp, expression, timeout) {
  const r = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  }, timeout || 30000);
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || 'eval failed');
  }
  return r.result ? r.result.value : undefined;
}

async function waitFor(cdp, expression, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const ok = await ev(cdp, expression);
    if (ok) return true;
    await sleep(200);
  }
  return false;
}

function poseExpr(p) {
  return `(function(){
    var over=document.getElementById('kOver'); if(over) over.classList.add('hidden');
    var menu=document.getElementById('kMenuB'); if(menu) menu.classList.remove('hidden');
    var home=document.getElementById('kHome'); if(home) home.classList.add('hidden');
    flying=false; paused=false;
    if(typeof reset==='function') reset();
    P.x=${p.x}; P.z=${p.z}; P.y=0; P.yaw=${p.yaw}; P.hd=${p.yaw}; P.pitch=0; P.bank=0;
    P.ground=true; P.v=${p.v || 0}; P.thr=0; P.wings=0; P.driveMode='arcade'; P.wreck=null;
    if(typeof B!=='undefined'){ B.tup=${p.throttle ? 1 : 0}; B.brk=0; B.nos=0; }
    if(window.WEATHER){
      WEATHER.debugFps=${p.fps == null ? 'null' : p.fps};
      WEATHER.bench(${p.bench === 'off' ? "'off'" : "'auto'"});
    }
    if(typeof resize==='function') resize();
    return {x:P.x,z:P.z,kind:window.weather&&weather.kind,zone:!!(window.weather&&weather.inZone(P.x,P.z)),dist:window.CDRAW&&CDRAW.dist};
  })()`;
}

async function paintPose(cdp, p) {
  const setup = poseExpr(p);
  await ev(cdp, setup);
  // Shots show the light filter (the 110 fps look). The FPS pairs measure the live rate.
  await ev(cdp, `if(window.WEATHER){ WEATHER.bench('off'); WEATHER.bench('auto'); WEATHER.debugFps=140; }`);
  await ev(cdp, `new Promise(function(res){ var n=0; (function w(){ if(window.weather) weather.tick(0.05, 140); if(++n<18) setTimeout(w, 16); else res(1); })(); })`);
  return ev(cdp, `(function(){
    if(typeof resize==='function') resize();
    var err=null;
    try { render(); } catch(e) { err=String(e&&e.stack||e); }
    var c0=null;
    try { c0=camS(P.x, P.y+(ZV.ty||0.6), P.z); } catch(e) { err=err||String(e); }
    var px=null;
    try { var d0=(ZV.camDist||10), f=H*0.9; px=Math.round(clamp(f/d0*ZV.win,40,ZV.maxPx)); } catch(e) { px=String(e); }
    return {
      err:err,
      cv:!!(typeof ZV!=='undefined'&&ZV.cv&&ZV.cv.width>8),
      cvw:(typeof ZV!=='undefined'&&ZV.cv)?ZV.cv.width:0,
      c0:c0&&c0.map(function(n){return +n.toFixed(2);}),
      cam:{x:+cam.x.toFixed(1),z:+cam.z.toFixed(1),yaw:+cam.yaw.toFixed(3)},
      ready:!!(window.ZD&&ZD.Xray&&ZD.Xray.ready),
      zgl:!!(window.ZGL&&ZGL.ensure&&(function(){try{return ZGL.ensure();}catch(e){return String(e);}})()),
      noz:!!window.NOZ,
      W:typeof W!=='undefined'?W:0,
      H:typeof H!=='undefined'?H:0,
      px:px,
      flying:typeof flying!=='undefined'?flying:null
    };
  })()`);
}

async function sampleMs(cdp, frames) {
  return ev(cdp, `new Promise(function(res){
    var i=0,t0=performance.now(),n=${frames};
    function f(){ i++; if(i>=n) res((performance.now()-t0)/n); else requestAnimationFrame(f); }
    requestAnimationFrame(f);
  })`, 40000);
}

async function shot(cdp, file) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

async function setDevice(cdp, d) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: d.width, height: d.height, deviceScaleFactor: d.dpr, mobile: !!d.mobile
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: !!d.touch });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: d.throttle });
}

async function openWorld(cdp, base) {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: base + '/world.html' });
  const up = await waitFor(cdp, `!!(window.weather && weather.zones && weather.zones.length>=4 && typeof CDRAW!=='undefined')`, 30000);
  if (!up) throw new Error('weather zones did not load');
  const car = await waitFor(cdp, `!!(window.ZD && ZD.Xray && ZD.Xray.ready)`, 40000);
  if (!car) throw new Error('player car WebGL did not become ready');
  await sleep(200);
}

function copyArt(file) {
  try {
    fs.mkdirSync(ART, { recursive: true });
    fs.copyFileSync(file, path.join(ART, path.basename(file)));
  } catch (e) {}
}

async function apiCheck(cdp) {
  return ev(cdp, `(function(){
    var loaded=weather.source;
    var v0=P.v=33;
    weather.tick(0.016, 140);
    var speedSame=P.v===v0;
    var checks=[
      ['spawn clear', weather.inZone(0,0)===null],
      ['runway clear', weather.inZone(0,800)===null],
      ['sand', weather.inZone(-260,460)&&weather.inZone(-260,460).kind==='sand'],
      ['fog north', weather.inZone(20,1595)&&weather.inZone(20,1595).kind==='fog'],
      ['rain', weather.inZone(370,520)&&weather.inZone(370,520).kind==='rain'],
      ['fog south', weather.inZone(-200,-300)&&weather.inZone(-200,-300).kind==='fog'],
      ['yard clear', weather.inZone(-220,-700)===null],
      ['tunnel clear', weather.inZone(-450,600)===null],
      ['river clear', weather.inZone(0,1800)===null],
      ['speed untouched', speedSame],
      ['source', weather.source==='stand-in'||weather.source==='interfaces']
    ];
    var saved=weather.zones.map(function(z){return {id:z.id,kind:z.kind,x0:z.x0,x1:z.x1,z0:z.z0,z1:z.z1};});
    var savedClear=4;
    weather.setZones({zones:[{name:'Sand',x0:-10,x1:10,z0:-10,z1:10},{name:'Rain',x0:20,x1:30,z0:0,z1:10},{name:'Fog',x0:40,x1:50,z0:0,z1:10}]});
    checks.push(['name Sand', weather.inZone(0,0)&&weather.inZone(0,0).kind==='sand']);
    checks.push(['name Rain', weather.inZone(25,5)&&weather.inZone(25,5).kind==='rain']);
    checks.push(['name Fog', weather.inZone(45,5)&&weather.inZone(45,5).kind==='fog']);
    weather.setZones({zones:[{kind:'sand',x0:-10,x1:10,z0:-10,z1:10}],clear:[{id:'hole',x0:-2,x1:2,z0:-2,z1:2}]});
    checks.push(['hole', weather.inZone(0,0)===null]);
    checks.push(['edge of hole', weather.inZone(5,0)&&weather.inZone(5,0).kind==='sand']);
    weather.setZones({zones:saved, clear:[
      {id:'runway',x0:-20,x1:20,z0:-55,z1:1522},
      {id:'tunnel',x0:-530,x1:-370,z0:470,z1:730},
      {id:'river-jumps',x0:-400,x1:400,z0:1700,z1:1920},
      {id:'homestead-yard',x0:-310,x1:-130,z0:-800,z1:-600}
    ]});
    checks.push(['restored sand', !!(weather.inZone(-260,460))]);
    var prepHit=0;
    weather.onHeadroom(function(){ prepHit++; });
    return {ok:checks.filter(function(c){return !c[1];}).map(function(c){return c[0];}), source:loaded, n:weather.zones.length, speedSame:speedSame};
  })()`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  const server = await startServer(0);
  const port = server.address().port;
  const base = 'http://127.0.0.1:' + port;
  const debugPort = 9400 + Math.floor(Math.random() * 400);
  const chrome = launchChrome(debugPort);
  let chromeLog = '';
  chrome.child.stderr.on('data', d => { chromeLog += d.toString(); });
  const kill = () => { try { chrome.child.kill('SIGKILL'); } catch (e) {} };
  process.on('exit', kill);
  const lines = [];
  try {
    const list = await waitJson('http://127.0.0.1:' + debugPort + '/json/list', 40);
    const page = list.find(t => t.type === 'page');
    if (!page) throw new Error('no chrome page');
    const cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const devices = SMOKE ? [DEVICES[0]] : DEVICES;
    const report = { devices: {}, api: null, shots: [] };

    for (const d of devices) {
      console.log('device ' + d.id);
      await setDevice(cdp, Object.assign({}, d, { throttle: 1 }));
      await openWorld(cdp, base);
      if (!report.api) {
        report.api = await apiCheck(cdp);
        console.log('api', JSON.stringify(report.api));
        if (report.api.ok.length) throw new Error('api failed: ' + report.api.ok.join(', '));
      }
      if (DO_FPS) {
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: d.throttle });
        const pose = { x: -260, z: 460, yaw: 0, bench: 'off', fps: null, v: 0 };
        await ev(cdp, poseExpr(pose));
        await sleep(300);
        const before = [];
        for (let i = 0; i < 5; i++) before.push(await sampleMs(cdp, 40));
        await ev(cdp, poseExpr({ x: -260, z: 460, yaw: 0, bench: 'auto', fps: null, v: 0 }));
        await ev(cdp, `new Promise(function(res){ var n=0; (function w(){ weather.tick(0.05, (typeof fps!=='undefined'?fps:30)); if(++n<30) setTimeout(w, 20); else res(weather.thickMix); })(); })`);
        await sleep(600);
        const after = [];
        for (let i = 0; i < 5; i++) after.push(await sampleMs(cdp, 40));
        const state = await ev(cdp, `({dist:CDRAW.dist, streets:CDRAW.streets, far:CDRAW.far, outline:+CDRAW.outline.toFixed(1), thick:+weather.thickMix.toFixed(2), density:+weather.density.toFixed(2), ema:+weather.ema.toFixed(1), fps:+(typeof fps!=='undefined'?fps:0).toFixed(1), kind:weather.kind, grid:WEATHER.gridN})`);
        report.devices[d.id] = {
          viewport: d.width + 'x' + d.height,
          dpr: d.dpr,
          throttle: d.throttle,
          beforeMs: before.map(v => +v.toFixed(2)),
          afterMs: after.map(v => +v.toFixed(2)),
          state
        };
        console.log(d.id, JSON.stringify(report.devices[d.id]));
      }

      if (DO_SHOTS && (SMOKE || PROBE || d.id === 'phone')) {
        const poses = PROBE ? POSES.slice(0, 1) : POSES;
        for (const p of poses) {
          const painted = await paintPose(cdp, p);
          console.log('paint', p.id, JSON.stringify(painted));
          if (!painted || !painted.cv) throw new Error('car sprite missing at ' + p.id + ' ' + JSON.stringify(painted));
          const info = await ev(cdp, `({kind:weather.kind, dens:+weather.density.toFixed(2), mix:+weather.thickMix.toFixed(2), dist:+CDRAW.dist.toFixed(0), car:!!(ZV.cv&&ZV.cv.width>8), x:+P.x.toFixed(1), z:+P.z.toFixed(1), px:${painted.px || 0}})`);
          const name = p.id + '.png';
          const file = path.join(OUT, name);
          await shot(cdp, file);
          copyArt(file);
          report.shots.push({ file: name, info });
          console.log('shot', name, JSON.stringify(info));
        }
        if (PROBE) break;
      }
    }

    if (DO_SHOTS && !PROBE && !process.argv.includes('--no-clip')) {
      console.log('clip');
      await setDevice(cdp, Object.assign({}, DEVICES[0], { throttle: 1, dpr: 2 }));
      await openWorld(cdp, base);
      await ev(cdp, poseExpr({ x: -150, z: 460, yaw: -Math.PI / 2, v: 32, throttle: true, fps: 140 }));
      await ev(cdp, `if(window.WEATHER){ WEATHER.bench('off'); WEATHER.bench('auto'); WEATHER.debugFps=140; } flying=true; paused=false; B.tup=1; P.v=32; P.driveMode='arcade'; P.wings=0; render();`);
      const frameDir = path.join(OUT, 'frames');
      fs.mkdirSync(frameDir, { recursive: true });
      let inside = 0;
      const n = 28;
      let saved = 0;
      for (let i = 0; saved < n && i < 80; i++) {
        await ev(cdp, `flying=true; B.tup = (P.x < -220) ? 0 : 1; if(P.x<-240) P.v=Math.min(P.v,34);`);
        await sleep(70);
        const r = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
        fs.writeFileSync(path.join(frameDir, String(saved).padStart(3, '0') + '.jpg'), Buffer.from(r.data, 'base64'));
        saved++;
        const now = await ev(cdp, `weather.kind==='sand' && P.x<-185 && P.x>-340`);
        if (now) inside++;
        if (inside >= 12 && saved >= 16) break;
      }
      const end = await ev(cdp, `({x:+P.x.toFixed(1), z:+P.z.toFixed(1), v:+P.v.toFixed(1), kind:weather.kind, dens:+weather.density.toFixed(2)})`);
      console.log('clip end', JSON.stringify(end));
      report.clipEnd = end;
      const mp4 = path.join(OUT, 'drive-into-sand.mp4');
      await new Promise((res, rej) => {
        const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '10', '-i', path.join(frameDir, '%03d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
        ff.on('exit', code => code === 0 ? res() : rej(new Error('ffmpeg ' + code)));
      });
      copyArt(mp4);
      fs.rmSync(frameDir, { recursive: true, force: true });
    }

    fs.writeFileSync(path.join(OUT, 'bench.json'), JSON.stringify(report, null, 2));
    lines.push('# Weather frame times');
    lines.push('');
    lines.push('Same pose for every pair: car at x=-260, z=460 (inside the west sand), yaw north, stopped. Headless Chrome, CPU throttle as listed. Five pairs. Frame time is the average of 40 requestAnimationFrame gaps. Before = weather bench off (no curtain, no filter, far draw restored). After = weather on at the live frame rate.');
    lines.push('');
    lines.push('| device | viewport | dpr | throttle | before ms | after ms | after dist | thick |');
    lines.push('|---|---|---|---|---|---|---|---|');
    for (const id of Object.keys(report.devices)) {
      const row = report.devices[id];
      lines.push('| ' + [id, row.viewport, row.dpr, row.throttle, row.beforeMs.join(', '), row.afterMs.join(', '), row.state && row.state.dist, row.state && row.state.thick].join(' | ') + ' |');
    }
    lines.push('');
    lines.push('API source: ' + (report.api && report.api.source) + '. Failed checks: ' + ((report.api && report.api.ok.join(', ')) || 'none') + '.');
    if (report.clipEnd) lines.push('Clip ended at ' + JSON.stringify(report.clipEnd) + '.');
    fs.writeFileSync(path.join(OUT, 'fps.md'), lines.join('\n') + '\n');
    console.log(lines.join('\n'));
    cdp.close();
  } catch (err) {
    fs.writeFileSync(path.join(OUT, 'chrome-log.txt'), chromeLog.slice(-8000));
    throw err;
  } finally {
    kill();
    server.close();
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
  }
}

main().catch(err => { console.error(err); process.exit(1); });
