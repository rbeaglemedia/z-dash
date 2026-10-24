#!/usr/bin/env node
/**
 * Dev tools quality bar. One Chrome. Prints every check, pass or fail.
 *   node tools/dev-tools-check.js
 */
'use strict';

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';
const PORT = Number(process.env.PORT || 8766);
const OUT = path.join(ROOT, 'test-results', 'dev-tools');
const ART = '/opt/cursor/artifacts/dev-tools';
const MPH = 2.2369362920544;

const results = [];
function record(name, pass, detail) {
  const row = { name: name, pass: !!pass, detail: detail == null ? '' : String(detail) };
  results.push(row);
  console.log((row.pass ? 'PASS' : 'FAIL') + '\t' + name + (row.detail ? '\t' + row.detail : ''));
  return row.pass;
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function median(arr) {
  if (!arr.length) return 0;
  const s = arr.slice().sort(function (a, b) { return a - b; });
  const i = (s.length - 1) * 0.5, lo = Math.floor(i), hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] * (hi - i) + s[hi] * (i - lo);
}
function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.webmanifest': 'application/manifest+json',
    '.woff2': 'font/woff2'
  })[ext] || 'application/octet-stream';
}
function startServer() {
  const server = http.createServer(function (req, res) {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, function (err, buf) {
      if (err) { res.writeHead(404); res.end('missing'); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise(function (resolve) { server.listen(PORT, '127.0.0.1', function () { resolve(server); }); });
}
function launchChrome(debugPort) {
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-devtools-chrome-'));
  const child = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--mute-audio',
    '--remote-debugging-port=' + debugPort, '--user-data-dir=' + dir, 'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  return { child, dir };
}
async function waitJson(url) {
  let last = '';
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('Chrome debug endpoint not ready: ' + last);
}
class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.next = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.ready = new Promise(function (res, rej) {
      this.ws.addEventListener('open', res);
      this.ws.addEventListener('error', function () { rej(new Error('cdp socket error')); });
    }.bind(this));
    this.ws.addEventListener('message', function (ev) {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error((msg.error && msg.error.message) || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      } else if (msg.method) {
        for (const fn of this.listeners.get(msg.method) || []) fn(msg.params || {});
      }
    }.bind(this));
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise(function (res, rej) {
      const t = setTimeout(function () { this.pending.delete(id); rej(new Error('timeout ' + method)); }.bind(this), timeout || 30000);
      this.pending.set(id, {
        res: function (v) { clearTimeout(t); res(v); },
        rej: function (e) { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
    }.bind(this));
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function ev(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', { expression: expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || 'eval error');
  }
  return r.result ? r.result.value : undefined;
}
async function go(cdp, url) {
  await cdp.send('Page.navigate', { url: url });
  const pathOnly = new URL(url).pathname;
  const t0 = Date.now();
  let last = '';
  while (Date.now() - t0 < 40000) {
    try {
      last = await ev(cdp, 'document.readyState + " " + location.pathname');
      if (typeof last === 'string' && last.indexOf('complete') === 0 && last.indexOf(pathOnly) >= 0) return;
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('nav timeout ' + url + ' last=' + last);
}
async function shot(cdp, name) {
  const png = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const buf = Buffer.from(png.data, 'base64');
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), buf);
  fs.writeFileSync(path.join(ART, name), buf);
  return path.join(ART, name);
}
async function setViewport(cdp, vp) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr || 1, mobile: !!vp.touch
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: !!vp.touch, maxTouchPoints: vp.touch ? 5 : 1 });
}
async function click(cdp, selector) {
  const ok = await ev(cdp, '(function(){var el=document.querySelector(' + JSON.stringify(selector) + ');if(!el)return false;el.click();return true;})()');
  if (!ok) throw new Error('missing ' + selector);
}
async function waitUntil(cdp, expression, ms) {
  const t0 = Date.now();
  let last;
  while (Date.now() - t0 < ms) {
    try { last = await ev(cdp, expression); if (last) return last; }
    catch (e) { last = e.message; }
    await sleep(200);
  }
  throw new Error('timeout ' + String(last).slice(0, 240));
}
function pillExpr() {
  return '(function(){var el=document.getElementById("zdFps");var api=window.ZD_FPS_COUNTER||{};if(api.skipped)return{skipped:api.skipped,present:!!el};if(!el)return{missing:true};var r=el.getBoundingClientRect();var st=getComputedStyle(el);var overlaps=[];document.querySelectorAll("button,a,input,select,textarea,[role=button]").forEach(function(n){if(n===el||el.contains(n))return;var b=n.getBoundingClientRect();if(b.width<8||b.height<8)return;var sn=getComputedStyle(n);if(sn.display==="none"||sn.visibility==="hidden"||parseFloat(sn.opacity||"1")<0.05)return;if(r.left<b.right-1&&r.right>b.left+1&&r.top<b.bottom-1&&r.bottom>b.top+1)overlaps.push(n.id?"#"+n.id:n.tagName);});return{text:el.textContent,top:Math.round(r.top),rightGap:Math.round(innerWidth-r.right),w:Math.round(r.width),h:Math.round(r.height),font:parseFloat(st.fontSize),weight:parseInt(st.fontWeight,10)||400,family:st.fontFamily,pe:st.pointerEvents,nudge:el.getAttribute("data-nudge")||"",vw:innerWidth,vh:innerHeight,overlaps:overlaps,bg:st.backgroundColor};})()';
}
function htmlFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push.apply(out, htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function staticChecks() {
  let live = '';
  try { live = execSync('git diff --exit-code HEAD -- index.html jr.html world.html', { cwd: ROOT, encoding: 'utf8' }); record('live html byte-identical to HEAD', true, 'index.html jr.html world.html'); }
  catch (e) { record('live html byte-identical to HEAD', false, (e.stdout || e.message || '').slice(0, 300)); }
  ['index.html', 'jr.html', 'world.html'].forEach(function (f) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    record('live ' + f + ' has no fps-counter include', s.indexOf('fps-counter.js') < 0, s.indexOf('fps-counter.js') < 0 ? 'absent' : 'found include');
  });
  const pages = htmlFiles(path.join(ROOT, 'test'));
  pages.forEach(function (p) {
    const rel = path.relative(ROOT, p);
    const s = fs.readFileSync(p, 'utf8');
    record('include ' + rel, s.indexOf('fps-counter.js') >= 0, s.indexOf('fps-counter.js') >= 0 ? 'present' : 'MISSING fps-counter.js');
  });
  ['adventure.html', 'test/viewer.html', 'test/car-spinner.html', 'test/building-viewer.html', 'test/builder.html'].forEach(function (rel) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) {
      record('future page ' + rel, true, 'not in this branch. Include ' + (rel.indexOf('test/') === 0 ? '../shared/fps-counter.js' : 'shared/fps-counter.js'));
    } else {
      const s = fs.readFileSync(p, 'utf8');
      record('include ' + rel, s.indexOf('fps-counter.js') >= 0, s.indexOf('fps-counter.js') >= 0 ? 'present' : 'MISSING');
    }
  });
  const src = fs.readFileSync(path.join(ROOT, 'shared/fps-counter.js'), 'utf8');
  record('fps counter has no canvas shadowBlur', src.indexOf('shadowBlur') < 0, 'shared/fps-counter.js');
  record('fps counter skips neon world', src.indexOf('neon-world') >= 0 && /hud\|boot/.test(src), 'skip when world/hud.js or world/boot.js is on the page');
}

async function sampleFrames(cdp, ms) {
  return ev(cdp, '(function(){return new Promise(function(resolve){var arr=[];var last=performance.now();var end=last+' + ms + ';function tick(t){arr.push(t-last);last=t;if(t<end)requestAnimationFrame(tick);else{arr.sort(function(a,b){return a-b;});resolve({n:arr.length,median:arr[Math.floor(arr.length/2)],p95:arr[Math.min(arr.length-1,Math.floor(arr.length*0.95))]});}}requestAnimationFrame(tick);});})()');
}
async function micro(cdp, items) {
  return ev(cdp, '(function(){var reps=300,items=' + items + ';var t0=performance.now();for(var r=0;r<reps;r++){var __p=window.ZD_PERF;if(__p){try{__p.begin();}catch(e){__p=null;}}var __zo=window.ZD_PERF?performance.now():-1;if(__p&&__zo>=0){try{__p.add("other",performance.now()-__zo);}catch(e){}}for(var i=0;i<items;i++){var __ti=__p?performance.now():0;if(__p){try{__p.add("buildings",performance.now()-__ti);}catch(e){}}}if(window.ZD_BENCH&&ZD_BENCH.tick){}if(__p){try{__p.end();}catch(e){}}}return (performance.now()-t0)/reps;})()');
}

async function traceLab(cdp, base) {
  const events = [];
  cdp.on('Tracing.dataCollected', function (p) { if (p.value) events.push.apply(events, p.value); });
  await cdp.send('Tracing.start', {
    categories: 'devtools.timeline,disabled-by-default-devtools.timeline',
    transferMode: 'ReportEvents'
  });
  await go(cdp, base + '/test/dev/fixture.html');
  await waitUntil(cdp, 'window.__LAB && window.__LAB.done', 20000);
  await cdp.send('Tracing.end');
  await new Promise(function (resolve) {
    const t = setTimeout(resolve, 8000);
    cdp.on('Tracing.tracingComplete', function () { clearTimeout(t); resolve(); });
  });
  const lab = await ev(cdp, 'window.__LAB');
  const durs = events.filter(function (e) { return e.name === 'FireAnimationFrame' && e.ph === 'X' && e.dur; }).map(function (e) { return e.dur / 1000; });
  const burn = durs.filter(function (d) { return d >= 6 && d <= 30; });
  const tiny = durs.filter(function (d) { return d < 2; });
  const series = (lab && lab.snap && lab.snap.series) || [];
  const medLab = median(series);
  const medTrace = median(burn);
  const err = medLab ? Math.abs(medTrace - medLab) / medLab : 1;
  record('fixture trace vs FPS Lab median', err <= 0.05, 'lab ' + medLab.toFixed(2) + 'ms trace ' + medTrace.toFixed(2) + 'ms error ' + (err * 100).toFixed(1) + '% frames ' + burn.length + '/' + durs.length);
  let sumBad = 0, sumMax = 0, i;
  const sums = lab.sums || [];
  for (i = 0; i < sums.length; i++) {
    const d = Math.abs(sums[i].total - sums[i].sum);
    if (d > sumMax) sumMax = d;
    if (d > 0.25 && d > Math.abs(sums[i].total) * 0.05) sumBad++;
  }
  record('per-system timers sum to frame time', sumBad === 0, 'frames ' + sums.length + ' max |total-sum| ' + sumMax.toFixed(4) + 'ms closed ' + (lab.snap && lab.snap.closedMs));
  const systems = (lab.snap && lab.snap.systems) || {};
  const actual = lab.actual || {};
  const bits = [];
  let secOk = true;
  Object.keys(lab.target || {}).forEach(function (k) {
    const tol = k === 'other' ? 1.25 : Math.max(0.75, Math.abs(lab.target[k]) * 0.05);
    const diff = Math.abs((systems[k] || 0) - (actual[k] || 0));
    const ok = diff <= tol;
    if (!ok) secOk = false;
    bits.push(k + ' ' + (systems[k] || 0).toFixed(2) + ' vs ' + (actual[k] || 0).toFixed(2));
  });
  record('section timers match burned time', secOk, bits.join('; '));
  record('fixture does not log dips for its own frames', lab.snap && lab.snap.dips === 0, 'dips ' + (lab.snap && lab.snap.dips) + ' budget ' + (lab.snap && lab.snap.budget) + ' avg ' + (lab.snap && lab.snap.ms && lab.snap.ms.avg));
  record('counter frames stay tiny', tiny.length === 0 || median(tiny) < 0.35, 'tiny n ' + tiny.length + ' median ' + (tiny.length ? median(tiny).toFixed(3) : 'n/a') + 'ms');
  const poll = await ev(cdp, '(function(){var p=ZD_PERF;var before=p.snapshot().ms.avg;var dips0=p.snapshot().dips;var c=document.createElement("canvas");c.width=320;c.height=88;var g=c.getContext("2d");var n=0;var timer=setInterval(function(){n++;var s=p.snapshot();g.fillStyle="#12081c";g.fillRect(0,0,320,88);var series=s.series;var max=s.budget||16.7,i;for(i=0;i<series.length;i++)if(series[i]>max)max=series[i];for(i=0;i<series.length;i++){g.fillStyle="#3ee6ff";g.fillRect(i,88-(series[i]/max)*80,1,(series[i]/max)*80);}},250);return new Promise(function(resolve){setTimeout(function(){clearInterval(timer);var s=p.snapshot();resolve({polls:n,dips:s.dips-dips0,before:before,after:s.ms.avg});},2000);});})()');
  const grew = Math.abs((poll.after || 0) - (poll.before || 0));
  record('4Hz graph does not create the dips', poll.dips === 0 && grew < 1, 'extra dips ' + poll.dips + ' avg before ' + Number(poll.before).toFixed(2) + ' after ' + Number(poll.after).toFixed(2) + ' polls ' + poll.polls);
  const pill = await ev(cdp, pillExpr());
  record('fixture shows the FPS pill', pill && !pill.missing && !pill.skipped && pill.overlaps.length === 0 && pill.font >= 12 && pill.font <= 14 && pill.weight >= 700 && pill.pe === 'none' && pill.rightGap <= 20, JSON.stringify(pill));
  await shot(cdp, 'fps-phone-844x390-fixture.png');
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  staticChecks();
  const server = await startServer();
  const base = 'http://127.0.0.1:' + PORT;
  const debugPort = 9333;
  const chrome = launchChrome(debugPort);
  let cdp;
  try {
    const list = await waitJson('http://127.0.0.1:' + debugPort + '/json/list');
    const page = list.find(function (t) { return t.type === 'page'; }) || list[0];
    cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await setViewport(cdp, { width: 844, height: 390, dpr: 2, touch: true });
    await traceLab(cdp, base);

    await go(cdp, base + '/world.html');
    await sleep(800);
    const offBench = await micro(cdp, 250);
    record('tool overhead off (null checks)', offBench < 0.15, offBench.toFixed(4) + ' ms/frame of checks, 250 items');
    const urls = await ev(cdp, 'performance.getEntriesByType("resource").map(function(r){return r.name;}).filter(function(u){return u.indexOf("/test/dev/")>=0||u.indexOf("/test/vendor/")>=0||u.indexOf("fps-counter")>=0;})');
    record('world.html dev off loads no tool scripts', !urls || urls.length === 0, JSON.stringify(urls));
    const tune0 = await ev(cdp, '({maxSpeed:TUNE.maxSpeed,air:TUNE.airCruiseMax,fric:TUNE.groundFric,perf:!!window.ZD_PERF,wrench:!!document.getElementById("zd-wrench"),hook:!!window.ZD_DEV})');
    record('normal play keeps tune defaults and hides the wrench', tune0 && tune0.maxSpeed === 90 && tune0.air === 65 && !tune0.perf && !tune0.wrench && !tune0.hook, JSON.stringify(tune0));
    const offSamples = [];
    for (let i = 0; i < 5; i++) offSamples.push(await sampleFrames(cdp, 1000));
    record('world FPS samples with tools off', offSamples.length === 5, offSamples.map(function (s) { return s.median.toFixed(2); }).join(', ') + ' ms median');

    await ev(cdp, 'localStorage.clear()');
    await go(cdp, base + '/world.html');
    for (let i = 0; i < 5; i++) {
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 8, y: 8, button: 'left', clickCount: 1 });
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 8, y: 8, button: 'left', clickCount: 1 });
      await sleep(60);
    }
    await waitUntil(cdp, '!!document.getElementById("zd-pin")', 5000);
    record('five corner taps open the PIN pad', true, 'zd-pin');
    for (const k of ['1', '2', '3', '4', '1', '2', '3', '4']) await click(cdp, '[data-key="' + k + '"]');
    await waitUntil(cdp, '!!document.getElementById("zd-wrench")', 5000);
    const pinState = await ev(cdp, '({unlock:localStorage.getItem("zdash.dev.unlock"),pin:localStorage.getItem("zdash.dev.pin"),tune:TUNE.maxSpeed})');
    record('new PIN unlocks this device only', pinState.unlock === '1' && pinState.pin && pinState.pin.length === 64 && pinState.tune === 90, 'hash length ' + (pinState.pin && pinState.pin.length) + ' maxSpeed ' + pinState.tune);
    await shot(cdp, 'fps-phone-844x390-wrench.png');

    await ev(cdp, 'localStorage.clear()');
    await go(cdp, base + '/world.html?dev=1');
    await waitUntil(cdp, 'window.ZD_DEV && ZD_DEV.ready', 8000);
    const devState = await ev(cdp, '({unlock:localStorage.getItem("zdash.dev.unlock"),perf:window.ZD_PERF,match:ZD_OVR.matchesDefaults(),wrench:!!document.getElementById("zd-wrench"),stats:[].some.call(document.scripts,function(s){return (s.src||"").indexOf("stats.js")>=0;})})');
    record('?dev=1 shows the wrench and does not apply caps', devState.wrench && devState.unlock !== '1' && !devState.perf && devState.match && !devState.stats, JSON.stringify(devState));
    await ev(cdp, 'ZD_DEV.attachPerf()');
    await sleep(300);
    const onBench = await micro(cdp, 250);
    record('tool overhead on (frame clock)', onBench < 0.75, onBench.toFixed(4) + ' ms/frame of checks, 250 items');
    const onSamples = [];
    for (let i = 0; i < 5; i++) onSamples.push(await sampleFrames(cdp, 1000));
    const mean = function (xs) { return xs.reduce(function (a, b) { return a + b; }, 0) / xs.length; };
    const offMeds = offSamples.map(function (s) { return s.median; });
    const onMeds = onSamples.map(function (s) { return s.median; });
    const delta = mean(onMeds) - mean(offMeds);
    const spread = Math.max.apply(null, offMeds) - Math.min.apply(null, offMeds);
    const limit = Math.max(1.5, spread);
    record('on vs off frame-time pairs', delta < limit, 'off ' + offMeds.map(function (n) { return n.toFixed(2); }).join(', ') + ' on ' + onMeds.map(function (n) { return n.toFixed(2); }).join(', ') + ' delta ' + delta.toFixed(2) + 'ms limit ' + limit.toFixed(2) + 'ms');
    const restore = await ev(cdp, '(function(){var proto=CanvasRenderingContext2D.prototype;var d0=Object.getOwnPropertyDescriptor(proto,"shadowBlur");var own0=Object.prototype.hasOwnProperty.call(CDRAW,"nofar");ZD_KILLS.set("glow",true);var c=document.createElement("canvas").getContext("2d");c.shadowBlur=14;var forced=c.shadowBlur;ZD_KILLS.set("glow",false);c.shadowBlur=14;var back=c.shadowBlur;var d1=Object.getOwnPropertyDescriptor(proto,"shadowBlur");ZD_KILLS.set("far",true);var on=CDRAW.nofar===true;ZD_KILLS.set("far",false);var own1=Object.prototype.hasOwnProperty.call(CDRAW,"nofar");return{forced:forced,back:back,sameSet:d0.set===d1.set,sameGet:d0.get===d1.get,own0:own0,on:on,own1:own1,patched:!!proto.__zdGlowDesc};})()');
    record('kill switches restore exactly', restore.forced === 0 && restore.back === 14 && restore.sameSet && restore.sameGet && restore.on === true && restore.own1 === restore.own0 && !restore.patched, JSON.stringify(restore));
    const bench = await ev(cdp, '(function(){return new Promise(function(resolve){ZD_DEV.attachPerf();var z0=P.z;ZD_BENCH.start({seconds:1.2,onScore:function(score){resolve({score:score,z:P.z,z0:z0,drive:ZD_BENCH.drive,tick:ZD_BENCH.tick});}});});})()');
    record('short benchmark scores the fixed route', bench && bench.score && bench.score.id === 'highway-west-v1' && Math.abs(bench.z - bench.z0) > 50 && bench.drive === false && bench.tick == null, JSON.stringify({ id: bench.score && bench.score.id, seconds: bench.score && bench.score.seconds, z0: bench.z0, z: bench.z }));
    await ev(cdp, 'ZD_DEV.detachPerf()');
    const closed = await ev(cdp, '({perf:window.ZD_PERF,panel:document.getElementById("zd-panel")&&!document.getElementById("zd-panel").hidden})');
    record('closing the clock leaves ZD_PERF null', closed.perf == null, JSON.stringify(closed));
    const boom = await ev(cdp, 'ZD_DEV.load("does-not-exist.js").then(function(){return document.getElementById("zd-banner")&&document.getElementById("zd-banner").textContent;})');
    const alive = await ev(cdp, '(function(){var n=0;var native=requestAnimationFrame.bind(window);requestAnimationFrame=function(fn){n++;return native(fn);};return new Promise(function(resolve){setTimeout(function(){resolve({n:n,canvas:!!document.getElementById("c")});},400);});})()');
    record('a failed tool shows a message and the game keeps drawing', boom && boom.indexOf('still running') >= 0 && alive.n > 5 && alive.canvas, 'banner ' + boom + ' raf ' + alive.n);

    await ev(cdp, 'localStorage.setItem("zdash.dev.unlock","1")');
    await go(cdp, base + '/test/world.html');
    await sleep(500);
    const skip = await ev(cdp, '({skipped:ZD_FPS_COUNTER&&ZD_FPS_COUNTER.skipped,el:!!document.getElementById("zdFps"),hud:[].some.call(document.scripts,function(s){return /world\\/hud\\.js/.test(s.src||"");})})');
    record('Neon World test page does not double the FPS pill', skip && skip.skipped === 'neon-world' && skip.el === false && skip.hud, JSON.stringify(skip));

    await go(cdp, base + '/test/index.html?dev=1');
    await waitUntil(cdp, '!!document.querySelector("[data-tab=fps]")', 8000);
    await waitUntil(cdp, '!!document.getElementById("zd-game-frame") && document.getElementById("zd-game-frame").contentWindow && document.getElementById("zd-game-frame").contentWindow.ZD_DEV', 20000);
    const tabs = ['fps', 'speed', 'physics', 'ellie', 'character', 'car', 'building', 'builder', 'device'];
    for (const id of tabs) {
      await click(cdp, '[data-tab="' + id + '"]');
      await sleep(400);
      const info = await ev(cdp, '(function(){var dock=document.getElementById("dock");var pill=document.getElementById("zdFps");var text=(dock&&dock.innerText||"").slice(0,180);var btns=[].map.call(document.querySelectorAll(".zd-btn"),function(b){var r=b.getBoundingClientRect();return r.height;});var min=btns.length?Math.min.apply(null,btns):0;return{text:text,pill:!!pill&&getComputedStyle(pill).display!=="none",min:min,nudge:(pill&&pill.getAttribute("data-nudge"))||""};})()');
      record('phone tab ' + id, info && info.pill && info.min >= 44 && info.text.length > 0, 'minBtn ' + (info && info.min) + ' nudge ' + (info && info.nudge) + ' ' + (info && info.text).replace(/\s+/g, ' ').slice(0, 120));
      if (id === 'fps' || id === 'speed' || id === 'physics' || id === 'ellie' || id === 'character' || id === 'device') {
        await shot(cdp, 'fps-phone-844x390-' + id + '.png');
      }
    }
    const pill = await ev(cdp, pillExpr());
    record('hub pill is top-right and clear of buttons', pill && !pill.overlaps.length && pill.font >= 12 && pill.font <= 14 && pill.weight >= 700 && pill.pe === 'none' && (pill.nudge || pill.rightGap <= 20), JSON.stringify(pill));
    const noDouble = await ev(cdp, '(function(){var f=document.getElementById("zd-game-frame");var w=f.contentWindow;return{parent:!!document.getElementById("zdFps"),child:!!w.document.getElementById("zdFps"),childSkip:w.ZD_FPS_COUNTER&&w.ZD_FPS_COUNTER.skipped};})()');
    record('hub does not add a second pill inside Neon World', noDouble.parent && !noDouble.child, JSON.stringify(noDouble));

    await click(cdp, '[data-tab="fps"]');
    await waitUntil(cdp, '!!document.querySelector("[data-kill=traffic]")', 5000);
    await click(cdp, '[data-kill="traffic"]');
    const killed = await ev(cdp, '(function(){var w=document.getElementById("zd-game-frame").contentWindow;return{on:w.ZD_KILLS.get("traffic"),saved:localStorage.getItem("zdash.dev.kills")};})()');
    record('traffic kill saves and applies in the hub', killed && killed.on === true && killed.saved && killed.saved.indexOf('"traffic":true') >= 0, JSON.stringify(killed));
    await go(cdp, base + '/world.html');
    await waitUntil(cdp, 'window.ZD_DEV && ZD_DEV.ready', 8000);
    const bare = await ev(cdp, '({kill:!(window.ZD_KILL&&ZD_KILL.traffic),match:ZD_OVR.matchesDefaults(),max:TUNE.maxSpeed})');
    record('saved kill does not leak into a normal Neon World visit', bare.kill && bare.match && bare.max === 90, JSON.stringify(bare));
    await go(cdp, base + '/test/index.html');
    await waitUntil(cdp, '!!document.querySelector("[data-kill=traffic]")', 20000);
    const re = await ev(cdp, '(function(){var w=document.getElementById("zd-game-frame").contentWindow;var err=document.getElementById("zd-error");return{on:!!(w.ZD_KILLS&&w.ZD_KILLS.get("traffic")),msg:err&&err.textContent||""};})()');
    record('hub FPS tab reapplies the saved kill and says so', re.on && /saved kill switch/i.test(re.msg), JSON.stringify(re));
    await waitUntil(cdp, '!!document.querySelector("[data-kill=traffic]")', 5000);
    await click(cdp, '[data-kill="traffic"]');

    await click(cdp, '[data-tab="speed"]');
    await sleep(300);
    await click(cdp, '[data-mph="300"]');
    const cap = await ev(cdp, '(function(){var w=document.getElementById("zd-game-frame").contentWindow;var nos=w.ZD_OVR.defaults().nosBoost;return{max:w.TUNE.maxSpeed,expect:300/' + MPH + '/nos,air:w.TUNE.airCruiseMax,layer:!!w.ZD_OVR.layer("speed")};})()');
    record('300 mph cap applies only in this drive', cap && cap.layer && Math.abs(cap.max - cap.expect) < 0.02 && Math.abs(cap.air - cap.expect) < 0.02, JSON.stringify(cap));
    await click(cdp, '[data-clear="speed"]');
    const cleared = await ev(cdp, '(function(){var w=document.getElementById("zd-game-frame").contentWindow;return{max:w.TUNE.maxSpeed,layer:w.ZD_OVR.layer("speed"),match:w.ZD_OVR.matchesDefaults()};})()');
    record('speed Apply off restores the real default', cleared && cleared.max === 90 && !cleared.layer && cleared.match, JSON.stringify(cleared));

    await click(cdp, '[data-tab="physics"]');
    await waitUntil(cdp, 'window.ZD_TUNE_UI && ZD_TUNE_UI.draft && "groundFric" in ZD_TUNE_UI.draft', 5000);
    await ev(cdp, 'ZD_TUNE_UI.setDraft("groundFric", 0.2)');
    await ev(cdp, 'document.getElementById("zd-preset-name").value="ice"');
    await click(cdp, '[data-save-preset="1"]');
    await click(cdp, '[data-apply="tune"]');
    const applied = await ev(cdp, 'document.getElementById("zd-game-frame").contentWindow.TUNE.groundFric');
    record('physics apply changes this drive', Math.abs(applied - 0.2) < 0.001, 'groundFric ' + applied);
    await click(cdp, '[data-reset="tune"]');
    const reset = await ev(cdp, '(function(){var w=document.getElementById("zd-game-frame").contentWindow;return{tune:w.TUNE.groundFric,draft:ZD_TUNE_UI.draft.groundFric,match:w.ZD_OVR.matchesDefaults()};})()');
    record('physics reset restores defaults', reset.tune === 0.5 && Math.abs(reset.draft - 0.5) < 0.001 && reset.match, JSON.stringify(reset));
    await ev(cdp, 'document.getElementById("zd-presets").value="ice"');
    await click(cdp, '[data-load-preset="1"]');
    const loaded = await ev(cdp, '(function(){var w=document.getElementById("zd-game-frame").contentWindow;return{draft:ZD_TUNE_UI.draft.groundFric,tune:w.TUNE.groundFric};})()');
    record('preset load fills the sliders and does not apply', Math.abs(loaded.draft - 0.2) < 0.001 && loaded.tune === 0.5, JSON.stringify(loaded));
    await go(cdp, base + '/world.html');
    const leak = await ev(cdp, '({max:TUNE.maxSpeed,fric:TUNE.groundFric,hook:!!window.ZD_OVR})');
    record('speed and physics never leak into normal play', leak.max === 90 && leak.fric === 0.5, JSON.stringify(leak));

    await go(cdp, base + '/test/index.html');
    await waitUntil(cdp, '!!document.querySelector("[data-vote=love]")', 8000);
    await click(cdp, '[data-vote="love"]');
    await click(cdp, '[data-tab="ellie"]');
    await sleep(200);
    await click(cdp, '[data-ellie="copy"]');
    const votes = await ev(cdp, '(function(){var list=ZD_ELLIE.export();var box=document.getElementById("zd-ellie-out").value;return{n:list.length,vote:list[0]&&list[0].vote,href:list[0]&&list[0].href,title:list[0]&&list[0].title,box:box.indexOf("love")>=0};})()');
    record('Ellie vote saves and exports', votes.n === 1 && votes.vote === 'love' && votes.box && !!votes.href, JSON.stringify(votes));

    await ev(cdp, 'localStorage.setItem("zdash.dev.ui", JSON.stringify({tab:"device",game:"world",collapsed:true}))');
    await go(cdp, base + '/test/index.html');
    await sleep(500);
    const ui = await ev(cdp, '({tab:document.querySelector("[aria-selected=true]")&&document.querySelector("[aria-selected=true]").getAttribute("data-tab"),collapsed:document.body.classList.contains("zd-collapsed"),game:document.getElementById("zd-game").value})');
    record('last tool and dock persist', ui.tab === 'device' && ui.collapsed === true && ui.game === 'world', JSON.stringify(ui));

    await ev(cdp, 'window.ZD_TOOL_MODULES.builder={id:"builder",mount:function(){throw new Error("builder boom");}}');
    await click(cdp, '[data-tab="builder"]');
    await sleep(300);
    const err = await ev(cdp, '(function(){var f=document.getElementById("zd-game-frame");var w=f.contentWindow;var n=0;var native=w.requestAnimationFrame.bind(w);w.requestAnimationFrame=function(fn){n++;return native(fn);};return new Promise(function(resolve){setTimeout(function(){resolve({msg:document.getElementById("zd-error").textContent,n:n,canvas:!!w.document.getElementById("c")});},400);});})()');
    record('a throwing tool does not break the game', err.msg.indexOf('builder boom') >= 0 && err.msg.indexOf('still running') >= 0 && err.n > 5 && err.canvas, JSON.stringify(err));

    await shot(cdp, 'fps-phone-844x390-error.png');

    const pages = [
      ['/test/dance-stage.html', 'dance', 'kMenuB'],
      ['/test/crew.html', 'crew', 'kMenuB'],
      ['/test/neon-paint.html', 'paint', 'kMenuB'],
      ['/test/jr.html', 'jr', 'btnSettings'],
      ['/test/fly3.html', 'fly3', '']
    ];
    for (const row of pages) {
      await go(cdp, base + row[0]);
      await sleep(row[1] === 'jr' || row[1] === 'fly3' ? 2500 : 900);
      try { await ev(cdp, 'ZD_FPS_COUNTER&&ZD_FPS_COUNTER.place&&ZD_FPS_COUNTER.place()'); } catch (e) {}
      await sleep(200);
      const p = await ev(cdp, pillExpr());
      const ok = p && !p.missing && !p.skipped && p.font >= 12 && p.font <= 14 && p.weight >= 700 && p.pe === 'none' && (!p.overlaps || p.overlaps.length === 0) && /FPS/.test(p.text || '');
      record('pill ' + row[1], ok, JSON.stringify(p));
      if (row[2]) record('pill nudge ' + row[1], p && p.nudge.indexOf(row[2]) >= 0, p && p.nudge);
      else record('pill stays in the corner on ' + row[1], p && !p.nudge && p.rightGap <= 20, p && ('gap ' + p.rightGap));
      await shot(cdp, 'fps-phone-844x390-' + row[1] + '.png');
    }

    for (const vp of [
      { name: 'ipad-1180x820', width: 1180, height: 820, touch: true, dpr: 1 },
      { name: 'pc-1366x768', width: 1366, height: 768, touch: false, dpr: 1 }
    ]) {
      await setViewport(cdp, vp);
      await go(cdp, base + '/test/index.html');
      await waitUntil(cdp, '!!document.querySelector("[data-tab=device]")', 8000);
      for (const id of tabs) {
        await click(cdp, '[data-tab="' + id + '"]');
        await sleep(250);
        const info = await ev(cdp, '(function(){var dock=document.getElementById("dock");var pill=document.getElementById("zdFps");return{text:(dock.innerText||"").replace(/\\s+/g," ").slice(0,80),pill:!!pill,h:pill?pill.getBoundingClientRect().height:0};})()');
        record(vp.name + ' tab ' + id, info && info.pill && info.text.length > 0, info && info.text);
      }
      await shot(cdp, 'hub-' + vp.name + '.png');
    }

    await setViewport(cdp, { width: 1366, height: 768, dpr: 1, touch: false });
    await go(cdp, base + '/world.html');
    await ev(cdp, 'navigator.serviceWorker.register("/sw.js")');
    await ev(cdp, 'navigator.serviceWorker.ready');
    await go(cdp, base + '/test/index.html');
    const title = await ev(cdp, 'document.title + " " + document.body.id');
    record('root service worker does not rewrite /test/', title.indexOf('Z-DASH Dev Tools') >= 0 && title.indexOf('zd-app') >= 0, title);
    const reg = await ev(cdp, 'navigator.serviceWorker.getRegistration("/test/").then(function(r){return r?r.scope:"none";})');
    record('tools service worker scope is /test/', typeof reg === 'string' && reg.indexOf('/test/') >= 0, String(reg));
  } catch (e) {
    record('chrome suite crashed', false, e && e.stack ? e.stack.split('\n').slice(0, 6).join(' | ') : String(e));
  } finally {
    if (cdp) cdp.close();
    try { chrome.child.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
    server.close();
  }

  const failed = results.filter(function (r) { return !r.pass; });
  const summary = { pass: results.length - failed.length, fail: failed.length, total: results.length, results: results };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(OUT, 'report.txt'), results.map(function (r) { return (r.pass ? 'PASS' : 'FAIL') + '\t' + r.name + '\t' + r.detail; }).join('\n') + '\n');
  console.log('SUMMARY ' + summary.pass + ' pass, ' + summary.fail + ' fail, ' + summary.total + ' total');
  process.exit(failed.length ? 1 : 0);
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
