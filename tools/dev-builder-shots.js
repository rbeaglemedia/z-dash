/* Labeled DEV Builder screenshots at phone, iPad, and PC sizes.
   Headless Chrome. The page draws the current city and a demo edit. */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/opt/google/chrome/chrome';
const OUT = path.join(ROOT, 'test-results', 'dev-builder');
const PORT = Number(process.env.PORT || 8771);
const VIEWPORTS = [
  { id: 'phone', width: 390, height: 844 },
  { id: 'ipad', width: 1024, height: 768 },
  { id: 'pc', width: 1366, height: 768 }
];

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.json': 'application/json'
  })[ext] || 'application/octet-stream';
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

function shot(vp) {
  const file = path.join(OUT, vp.id + '.png');
  const url = 'http://127.0.0.1:' + PORT + '/test/dev-builder.html?demo=1&label=' + encodeURIComponent(vp.id);
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--disable-dev-shm-usage',
      '--user-data-dir=/tmp/dev-builder-chrome-' + vp.id,
      '--virtual-time-budget=6000',
      '--window-size=' + vp.width + ',' + vp.height,
      '--screenshot=' + file,
      url
    ];
    const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); }, 25000);
    child.stderr.on('data', (d) => { err += d; });
    child.on('exit', (code) => {
      clearTimeout(timer);
      if (code !== 0 || !fs.existsSync(file)) reject(new Error(vp.id + ' shot failed ' + code + ' ' + err.slice(-400)));
      else resolve(file);
    });
  });
}

(async function () {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  try {
    for (const vp of VIEWPORTS) {
      const file = await shot(vp);
      console.log(vp.id, fs.statSync(file).size);
    }
  } finally {
    server.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
