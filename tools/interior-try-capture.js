'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs/interior-try');
const logDir = path.join(root, 'test-results/interior-try');
const port = 9335;
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(logDir, { recursive: true });

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--no-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/interior-try-cdp',
    '--remote-debugging-port=' + port,
    'about:blank'
  ], { stdio: 'ignore' });
  let ws;
  const rows = [];
  try {
    let list = '';
    for (let i = 0; i < 40; i++) {
      try { list = await get('http://127.0.0.1:' + port + '/json/list'); break; }
      catch (e) { await sleep(250); }
    }
    const pages = JSON.parse(list).filter((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (!pages.length) throw new Error('no page target');
    ws = new WebSocket(pages[0].webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    let id = 0;
    const pending = new Map();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
        else p.resolve(msg.result);
      }
    };
    function send(method, params) {
      const n = ++id;
      return new Promise((resolve, reject) => {
        pending.set(n, { resolve, reject });
        ws.send(JSON.stringify({ id: n, method, params: params || {} }));
      });
    }
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1180, height: 820, deviceScaleFactor: 1, mobile: false
    });

    async function shoot(name, query) {
      const url = 'file://' + root + '/world.html?' + query;
      await send('Page.navigate', { url });
      let ready = '';
      for (let i = 0; i < 80; i++) {
        await sleep(250);
        const ev = await send('Runtime.evaluate', {
          expression: 'document.body && document.body.dataset.ready==="1" ? JSON.stringify(document.body.dataset) : ""',
          returnByValue: true
        });
        ready = ev.result && ev.result.value || '';
        if (ready) break;
      }
      if (!ready) throw new Error(name + ' not ready');
      const probe = await send('Runtime.evaluate', {
        expression: '(function(){const bar=document.getElementById("interior-try-switch");const nums=bar?bar.querySelectorAll("button[data-style]"):[];let shown=0;for(let i=0;i<nums.length;i++)if(!nums[i].hidden)shown++;const menu=document.getElementById("interior-try-menu");const card=document.getElementById("walk-interior");const cv=document.getElementById("walk-room-cv");return JSON.stringify({bar:!!bar&&!bar.hidden,nums:shown,menu:!!menu&&!menu.hidden,card:!!card&&!card.hidden,cw:cv&&cv.width,ch:cv&&cv.height});})()',
        returnByValue: true
      });
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(shot.data, 'base64'));
      const row = Object.assign({ name: name }, JSON.parse(ready), JSON.parse(probe.result.value || '{}'));
      rows.push(row);
      console.log(name, JSON.stringify(row));
    }

    const shots = [['menu', 'interiorTry=1&tryShot=menu&notraffic=1']];
    ['cafe', 'arcade', 'pets', 'soccer', 'builder'].forEach(function (room) {
      for (let n = 1; n <= 4; n++) shots.push([room + '-' + n, 'interiorTry=1&tryShot=' + room + '&tryStyle=' + n + '&notraffic=1']);
    });
    for (let n = 1; n <= 4; n++) shots.push(['house-' + n, 'interiorTry=1&tryShot=house&tryStyle=' + n + '&notraffic=1']);
    for (let i = 0; i < shots.length; i++) await shoot(shots[i][0], shots[i][1]);
    fs.writeFileSync(path.join(logDir, 'fps.json'), JSON.stringify(rows, null, 2));
  } finally {
    try { if (ws) ws.close(); } catch (e) {}
    try { chrome.kill('SIGKILL'); } catch (e) {}
    spawn('pkill', ['-f', 'user-data-dir=/tmp/interior-try-cdp'], { stdio: 'ignore' });
  }
}

main().catch((err) => {
  console.error(err);
  spawn('pkill', ['-f', 'user-data-dir=/tmp/interior-try-cdp'], { stdio: 'ignore' });
  process.exit(1);
});
