'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs/interiors');
const port = 9333;
const rooms = ['house', 'arcade', 'cafe', 'pets', 'soccer', 'builder'];

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--user-data-dir=/tmp/interiors-cdp',
    '--remote-debugging-port=' + port,
    '--window-size=1180,820',
    'about:blank'
  ], { stdio: 'ignore' });
  let browser = null;
  for (let i = 0; i < 40; i++) {
    try {
      browser = JSON.parse(await get('http://127.0.0.1:' + port + '/json/version'));
      break;
    } catch (e) { await sleep(150); }
  }
  if (!browser) throw new Error('chrome did not open a port');
  const ws = new WebSocket(browser.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) pending.get(msg.id)(msg);
  };
  function call(method, params, sessionId) {
    const n = ++id;
    return new Promise((resolve) => {
      pending.set(n, resolve);
      const payload = { id: n, method, params: params || {} };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }
  const target = await call('Target.createTarget', { url: 'about:blank' });
  const tid = target.result.targetId;
  const attached = await call('Target.attachToTarget', { targetId: tid, flatten: true });
  const session = attached.result.sessionId;
  await call('Page.enable', {}, session);
  await call('Runtime.enable', {}, session);
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1180, height: 820, deviceScaleFactor: 1, mobile: false
  }, session);

  async function open(url) {
    await call('Page.navigate', { url }, session);
    for (let i = 0; i < 80; i++) {
      const ev = await call('Runtime.evaluate', {
        expression: 'document.body && document.body.dataset.ready || ""',
        returnByValue: true
      }, session);
      if (ev.result && ev.result.result && ev.result.result.value === '1') return;
      await sleep(50);
    }
    throw new Error('not ready ' + url);
  }

  async function shot(file) {
    const ev = await call('Page.captureScreenshot', { format: 'png' }, session);
    fs.writeFileSync(file, Buffer.from(ev.result.data, 'base64'));
  }

  const base = 'file://' + path.join(root, 'test/interiors-review.html');
  for (const room of rooms) {
    for (let n = 1; n <= 4; n++) {
      const url = base + '?room=' + room + '&style=' + n;
      await open(url);
      const meta = await call('Runtime.evaluate', {
        expression: 'JSON.stringify({ms:document.body.dataset.ms,id:document.body.dataset.style,boxes:document.body.dataset.boxes,name:document.body.dataset.name})',
        returnByValue: true
      }, session);
      const info = JSON.parse(meta.result.result.value);
      const file = path.join(outDir, room + '-' + n + '-' + info.id + '.png');
      await shot(file);
      console.log(room, n, info.id, info.ms + ' ms', info.boxes, 'boxes');
    }
  }

  await open(base + '?dump=1');
  const report = await call('Runtime.evaluate', {
    expression: 'document.getElementById("report").textContent',
    returnByValue: true
  }, session);
  fs.writeFileSync(path.join(outDir, 'times.json'), report.result.result.value);

  for (const room of rooms) {
    await open(base + '?room=' + room + '&sheet=files');
    const file = path.join(outDir, room + '-sheet.png');
    await shot(file);
    console.log('sheet', room, fs.statSync(file).size);
  }

  ws.close();
  chrome.kill('SIGKILL');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
