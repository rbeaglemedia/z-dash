/**
 * Shoots the standalone Next traffic LOD page and reads its overlap
 * and frame-time report. Same 96×64 overlap bar as the 370Z design
 * check (0.55). Does not open world.html and does not deploy.
 *
 *   node tools/next-traffic-lod-check.mjs
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'test-results', 'next-traffic-lod');
const chrome = process.env.CHROME || 'google-chrome';
const port = 8765;

const shots = ['rear', 'front', 'side', 'three', 'pair'];
const tiers = [
  { id: 'phone', w: 844, h: 390 },
  { id: 'ipad', w: 1024, h: 768 },
  { id: 'pc', w: 1366, h: 768 }
];

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let p = path.join(root, decodeURIComponent(url.pathname));
    if (!p.startsWith(root)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(p, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing'); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function runChrome(url, w, h, png, dom) {
  return new Promise((resolve) => {
    const dir = '/tmp/chrome-lod-' + process.pid + '-' + Math.random().toString(16).slice(2);
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--enable-unsafe-swiftshader',
      '--hide-scrollbars',
      '--no-sandbox',
      '--virtual-time-budget=20000',
      '--user-data-dir=' + dir,
      '--window-size=' + w + ',' + h,
      '--screenshot=' + png,
      '--dump-dom',
      url
    ];
    const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    const timer = setTimeout(() => { child.kill('SIGKILL'); }, 40000);
    child.on('close', (code) => {
      clearTimeout(timer);
      fs.writeFileSync(dom, out);
      fs.rmSync(dir, { recursive: true, force: true });
      resolve({ code, err });
    });
  });
}

function readReport(html) {
  const m = html.match(/<pre id="report">([\s\S]*?)<\/pre>/);
  if (!m) return null;
  const text = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  try { return JSON.parse(text); } catch { return { ok: false, error: 'bad json', raw: text.slice(0, 400) }; }
}

const server = await serve();
fs.mkdirSync(outDir, { recursive: true });
const summary = { shots: {}, probes: {}, note: 'Headless Chrome software WebGL (SwiftShader). Not a Galaxy or iPad measurement.' };

for (const shot of shots) {
  const png = path.join(outDir, shot + '.png');
  const dom = path.join(outDir, shot + '.html');
  const url = 'http://127.0.0.1:' + port + '/next-traffic-lod.html?shot=' + shot;
  const w = shot === 'pair' ? 1400 : 1360;
  const h = shot === 'pair' ? 820 : 860;
  process.stdout.write('shot ' + shot + '\n');
  const run = await runChrome(url, w, h, png, dom);
  const html = fs.readFileSync(dom, 'utf8');
  const report = readReport(html);
  summary.shots[shot] = report || { ok: false, error: 'no report', chrome: run.code };
  if (!report) fs.writeFileSync(path.join(outDir, shot + '.chrome.txt'), run.err.slice(-2000));
}

for (const tier of tiers) {
  const png = path.join(outDir, 'probe-' + tier.id + '.png');
  const dom = path.join(outDir, 'probe-' + tier.id + '.html');
  const url = 'http://127.0.0.1:' + port + '/next-traffic-lod.html?mode=probe&tier=' + tier.id + '&w=' + tier.w + '&h=' + tier.h;
  process.stdout.write('probe ' + tier.id + '\n');
  const run = await runChrome(url, tier.w, tier.h, png, dom);
  const html = fs.readFileSync(dom, 'utf8');
  const report = readReport(html);
  summary.probes[tier.id] = report || { ok: false, error: 'no report', chrome: run.code };
  if (!report) fs.writeFileSync(path.join(outDir, 'probe-' + tier.id + '.chrome.txt'), run.err.slice(-2000));
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
server.close();
const ious = ['rear', 'front', 'side', 'three'].map((id) => {
  const s = summary.shots[id];
  return id + ' ' + (s && s.iou != null ? s.iou : 'missing');
});
console.log(ious.join('  '));
for (const tier of tiers) {
  const p = summary.probes[tier.id];
  const pr = p && p.probe;
  console.log(tier.id, pr ? pr.medianMs + ' ms ' + (pr.pass ? 'under' : 'OVER') : (p && p.error));
}
