'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs/house-row');
const port = 9334;
fs.mkdirSync(outDir, { recursive: true });

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
    '--user-data-dir=/tmp/house-row-cdp',
    '--remote-debugging-port=' + port,
    'about:blank'
  ], { stdio: 'ignore' });
  let ws;
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
      const box = await send('Runtime.evaluate', {
        expression: '(function(){const c=document.getElementById("walk-interior"),v=document.getElementById("walk-room-cv"),k=document.querySelector(".kid");const r=c&&c.getBoundingClientRect();const vr=v&&v.getBoundingClientRect();return JSON.stringify({card:r&&{w:r.width,h:r.height,z:getComputedStyle(c).zIndex,disp:getComputedStyle(c).display,hid:c.hidden},cv:vr&&{w:vr.width,h:vr.height},kid:k&&getComputedStyle(k).zIndex,cw:v&&v.width,ch:v&&v.height});})()',
        returnByValue: true
      });
      const gl = await send('Runtime.evaluate', {
        expression: '(function(){const X=window.ZD&&ZD.Xray;return JSON.stringify({xray:!!(X&&X.ready),w:typeof W==="number"?W:0,h:typeof H==="number"?H:0});})()',
        returnByValue: true
      });
      console.log(name, 'box', box.result && box.result.value, 'gl', gl.result && gl.result.value);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const file = path.join(outDir, name + '.png');
      fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      console.log(name, ready);
    }

    const only = process.argv[2] || '';
    if (!only || only === 'street') await shoot('street', 'rowShot=street&notraffic=1');
    if (!only || only === 'inside') {
      for (let n = 1; n <= 4; n++) {
        await shoot('house-' + n + '-style-' + n, 'rowShot=inside&homeStyle=' + n + '&notraffic=1');
      }
    }
  } finally {
    try { if (ws) ws.close(); } catch (e) {}
    try { chrome.kill('SIGKILL'); } catch (e) {}
    spawn('pkill', ['-f', 'user-data-dir=/tmp/house-row-cdp'], { stdio: 'ignore' });
  }
}

main().catch((err) => {
  console.error(err);
  spawn('pkill', ['-f', 'user-data-dir=/tmp/house-row-cdp'], { stdio: 'ignore' });
  process.exit(1);
});
