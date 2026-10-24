#!/usr/bin/env node
/**
 * Neon World architecture check. Test-only. Ships nothing into the game.
 *
 * Reviews every solid building (kind b and landmark) before it is reported:
 * scale against the 370Z, a 1.7 m person, and the pet; doors and garages;
 * window grids; floating, intersecting, and z-fighting geometry; roofs;
 * Arcade / Street / on-foot tiers; signs; the Z dance mural; neon style;
 * shadowBlur; and the cost of a building pass next to PERF-GUARD.
 *
 *   node tools/arch-check.mjs --root <tree> --out test-results/arch-check
 *
 * Exit 0 pass, 1 architecture fail, 2 checker failure.
 * --review keeps exit 0 on an architecture fail so a PR comment can carry it.
 */
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { spawn, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || 'google-chrome';
const MARKER = '<!-- ARCHITECTURE-CHECK -->';

const BUILTIN_CAPS = {
  building: { phone: 8, ipad: 16, pc: 8 },
  pass: { phone: 40, ipad: 90, pc: 40 }
};
const PR62_FACE = { phone: 68.9, ipad: 170.1, pc: 65.2 };
const FACE_SHARE = 0.7;

function parseArgs(argv) {
  const out = {
    root: path.resolve(HERE, '..'),
    out: '',
    port: 0,
    review: false,
    shots: true,
    writeBaseline: false,
    only: '',
    fpsBaseline: '',
    plans: [],
    plansOnly: false
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root') out.root = path.resolve(argv[++i]);
    else if (a === '--out') out.out = path.resolve(argv[++i]);
    else if (a === '--port') out.port = Number(argv[++i]);
    else if (a === '--review') out.review = true;
    else if (a === '--no-shots') out.shots = false;
    else if (a === '--write-baseline') out.writeBaseline = true;
    else if (a === '--only') out.only = String(argv[++i] || '');
    else if (a === '--fps-baseline') out.fpsBaseline = path.resolve(argv[++i]);
    else if (a === '--plan') out.plans.push(path.resolve(argv[++i]));
    else if (a === '--plans-only') out.plansOnly = true;
    else if (a === '--help') out.help = true;
    else throw new Error('Unknown arg ' + a);
  }
  if (!out.out) out.out = path.join(out.root, 'test-results', 'arch-check');
  return out;
}

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.webmanifest': 'application/manifest+json'
  })[ext] || 'application/octet-stream';
}

function patchDetail(code) {
  if (code.includes('DETAIL.arch')) return code;
  return code.replace(/\}\)\(\);\s*$/, [
    '  try { window.DETAIL.arch = { winW: WIN_W, winH: WIN_H }; } catch (e) {}',
    '})();',
    ''
  ].join('\n'));
}

function patchPaint(code) {
  if (code.includes('NEON_PAINT.muralFrame')) return code;
  return code.replace(/\}\)\(\);\s*$/, [
    '  try {',
    '    if (window.NEON_PAINT) {',
    '      window.NEON_PAINT.muralFrame = muralFrame;',
    '      window.NEON_PAINT.artsList = artsList;',
    '      window.NEON_PAINT.isTaggedArts = isTaggedArts;',
    '    }',
    '  } catch (e) {}',
    '})();',
    ''
  ].join('\n'));
}

function startServer(root, port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/__arch.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(harnessHtml());
      return;
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/__arch.html';
    const file = path.normalize(path.join(root, rel));
    if (!file.startsWith(root)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + rel); return; }
      let body = buf;
      const arch = url.searchParams.get('arch') === '1';
      if (arch && file.endsWith(path.sep + 'detail.js')) body = Buffer.from(patchDetail(buf.toString('utf8')), 'utf8');
      if (arch && file.endsWith(path.sep + 'neon-paint.js')) body = Buffer.from(patchPaint(buf.toString('utf8')), 'utf8');
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(body);
    });
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function harnessHtml() {
  return `<!doctype html><meta charset="utf-8"><title>arch</title>
<canvas id="c" width="1280" height="720"></canvas>
<script>
window.__bootError = '';
window.onerror = function (m, s, l) { window.__bootError += m + ' @' + (s || '') + ':' + l + '\\n'; };
window.P = { x:0, y:0, z:0, yaw:0, pitch:0, bank:0, v:0, ground:true, driveMode:'street', simT:1, hd:0 };
window.WALK_MODE = { onFoot:false, insideBuilding:false, x:0, y:0, z:0, yaw:0, wx:0, wz:0 };
window.FLYCAM = { orbit:true, back:10, up:2 };
window.ZV = { ty:0.6, camDist:10 };
window.toast = function () {};
</script>
<script src="/shared/tune.js"></script>
<script src="/world/camera.js"></script>
<script src="/world/towtruck.js"></script>
<script src="/world/city.js"></script>
<script src="/world/city-draw.js"></script>
<script src="/shared/detail-tune.js"></script>
<script src="/world/detail.js?arch=1"></script>
<script src="/world/neon-paint.js?arch=1"></script>
<script src="/tools/arch-check-browser.js"></script>
<script>
window.__ARCH_READY = (window.ARCH && typeof CITY !== 'undefined' && typeof drawBldg === 'function') ? 'ready' : ('missing ' + (window.__bootError || ''));
</script>`;
}

function launchChrome(port) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zd-arch-'));
  const args = [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--disable-sync',
    '--mute-audio', '--hide-scrollbars', '--force-color-profile=srgb',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    '--window-size=1280,720', 'about:blank'
  ];
  const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return { child, dir };
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

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
  throw new Error('Chrome debug endpoint not ready: ' + last);
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
    this.logs = [];
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error((msg.error && msg.error.message) || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      } else if (msg.method === 'Runtime.exceptionThrown' || msg.method === 'Runtime.consoleAPICalled') {
        this.logs.push(msg.method + ' ' + JSON.stringify(msg.params).slice(0, 500));
      }
    });
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 180000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  async eval(expression, timeout) {
    const ev = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    }, timeout || 180000);
    if (ev.exceptionDetails) {
      const ex = ev.exceptionDetails.exception;
      throw new Error((ev.exceptionDetails.text || 'eval') + ' ' + (ex && ex.description ? ex.description : ''));
    }
    return ev.result && ev.result.value;
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

function readCommit(root) {
  try {
    return {
      sha: execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      branch: execFileSync('git', ['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim()
    };
  } catch (e) {
    return { sha: '', branch: '', error: e.message };
  }
}

function scanShadowFile(file, text, onlyFns) {
  const lines = text.split('\n');
  let fn = '';
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const mfn = lines[i].match(/function\s+(\w+)\s*\(/);
    if (mfn) fn = mfn[1];
    if (onlyFns && onlyFns.indexOf(fn) < 0) continue;
    const re = /shadowBlur\s*=\s*([^;]+)/g;
    let m;
    while ((m = re.exec(lines[i]))) {
      const rhs = m[1].trim();
      if (rhs === '0') continue;
      hits.push({ file, line: i + 1, fn, rhs });
    }
  }
  return hits;
}

function scanShadow(root) {
  const hits = [];
  const city = path.join(root, 'world', 'city-draw.js');
  const detail = path.join(root, 'world', 'detail.js');
  const paint = path.join(root, 'world', 'neon-paint.js');
  if (fs.existsSync(city)) hits.push(...scanShadowFile('world/city-draw.js', fs.readFileSync(city, 'utf8'), null));
  if (fs.existsSync(detail)) hits.push(...scanShadowFile('world/detail.js', fs.readFileSync(detail, 'utf8'), null));
  if (fs.existsSync(paint)) hits.push(...scanShadowFile('world/neon-paint.js', fs.readFileSync(paint, 'utf8'), ['paintMural', 'drawBuildingGraffiti']));
  return hits;
}

function loadJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return null; }
}

function faceMedians(json) {
  const rows = json && json.rows;
  if (!rows || typeof rows !== 'object') return null;
  const out = {};
  for (const key of Object.keys(rows)) {
    const row = rows[key];
    if (!row || (row.scene !== 'face' && row.label !== 'Building face')) continue;
    if (row.viewport && typeof row.medianMs === 'number') out[row.viewport] = row.medianMs;
  }
  return out.phone ? out : null;
}

function fpsBudget(root, explicit) {
  const candidates = [
    explicit,
    path.join(root, 'tools', 'perf-guard-baseline.json')
  ].filter(Boolean);
  for (const file of candidates) {
    const face = faceMedians(loadJson(file));
    if (face) return { source: 'perf-guard', file, face };
  }
  return { source: 'pr62-published', file: '', face: Object.assign({}, PR62_FACE) };
}

function applyFps(report, budget) {
  const caps = { building: Object.assign({}, BUILTIN_CAPS.building), pass: Object.assign({}, BUILTIN_CAPS.pass), face: budget.face, share: FACE_SHARE, source: budget.source };
  for (const vp of ['phone', 'ipad', 'pc']) {
    if (typeof budget.face[vp] === 'number') caps.pass[vp] = Math.min(caps.pass[vp], Math.round(budget.face[vp] * FACE_SHARE * 10) / 10);
  }
  const fails = [];
  for (const row of report.fps || []) {
    const bCap = caps.building[row.viewport];
    const pCap = caps.pass[row.viewport];
    if (row.one && row.one.median > bCap) fails.push(row.viewport + ' one building ' + row.one.median + ' ms over ' + bCap + ' ms');
    if (row.pass && row.pass.median > pCap) fails.push(row.viewport + ' building pass ' + row.pass.median + ' ms over ' + pCap + ' ms (' + row.neighbors + ' buildings)');
  }
  report.fpsCaps = caps;
  if (fails.length) {
    report.findings.push({
      check: 'fps',
      severity: 'fail',
      title: 'Building pass is over the frame budget',
      detail: 'Caps are the built-in per-building limit, and 70% of the PERF-GUARD building-face median (' + budget.source + '). ' + fails.join('; ') + '.',
      buildings: []
    });
  } else if ((report.fps || []).length) {
    report.passes.push('One near building and the in-view building pass stay inside the FPS caps on phone, iPad, and PC.');
  }
  report.ok = !!(report.calib && report.calib.ok) && !(report.findings || []).some((f) => f.severity === 'fail') && !report.checkerError;
}

function mergeShadow(report, hits) {
  if (!hits.length) {
    if (!(report.findings || []).some((f) => f.check === 'shadow')) {
      report.passes = report.passes || [];
      report.passes.push('city-draw.js, detail.js, and the mural painter do not assign a non-zero shadowBlur.');
    }
    return;
  }
  const where = hits.map((h) => h.file + ':' + h.line + ' (' + h.rhs + ')').join('; ');
  let f = (report.findings || []).find((x) => x.check === 'shadow');
  if (!f) {
    f = { check: 'shadow', severity: 'fail', title: 'Building pass set shadowBlur', detail: '', buildings: [] };
    report.findings.push(f);
  }
  f.detail = (f.detail ? f.detail + ' ' : '') + 'Source: ' + where + '.';
}

function loadBaseline(root) {
  return loadJson(path.join(root, 'tools', 'arch-check-baseline.json'));
}

function writeBaseline(root, report, prev) {
  const next = {
    version: 1,
    note: 'Mural floor for the Z dance buildings, the small river-edge ramps, and the solid-building count on main. A later mural wall must be at least this big. The river-edge ramps stay this size and this far from the water. Extra ramps are allowed. The building list is a snapshot of main. Placements may change. The count stays at buildings.length unless docs/NEON-WORLD-STYLE.md raises Approved count. Do not edit the count to hide a block that loaded in the game. Written by arch-check --write-baseline. Do not edit these numbers to hide a smaller wall or a moved river jump.',
    capturedAt: new Date().toISOString(),
    git: { sha: report.sha || '', branch: report.branch || '' },
    murals: (report.murals || []).map((m) => ({
      id: m.id,
      purpose: m.purpose,
      label: m.label,
      cx: m.cx,
      cz: m.cz,
      width: m.width,
      height: m.height,
      area: m.area
    })),
    buildings: (prev && prev.buildings && prev.buildings.length) ? prev.buildings : (report.roster || []),
    riverEdge: (prev && prev.riverEdge && prev.riverEdge.length) ? prev.riverEdge : ((report.ramps && report.ramps.riverEdge) || []),
    rampLot: (report.ramps && report.ramps.lot) || (prev && prev.rampLot) || 24,
    scales: report.scales || (prev && prev.scales) || null
  };
  if (!next.murals.length && prev && prev.murals) next.murals = prev.murals;
  fs.writeFileSync(path.join(root, 'tools', 'arch-check-baseline.json'), JSON.stringify(next, null, 2) + '\n');
  return next;
}

function writeReport(dir, report) {
  fs.mkdirSync(dir, { recursive: true });
  const shots = path.join(dir, 'shots');
  fs.mkdirSync(shots, { recursive: true });
  for (const shot of report.shots || []) {
    if (!shot.b64) continue;
    fs.writeFileSync(path.join(shots, shot.name), Buffer.from(shot.b64, 'base64'));
  }
  const slim = Object.assign({}, report);
  delete slim.shots;
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(slim, null, 2));
  const md = markdown(slim);
  fs.writeFileSync(path.join(dir, 'report.md'), md);
  fs.writeFileSync(path.join(dir, 'comment.md'), MARKER + '\n\n' + commentMd(slim));
  return md;
}

function sectionBody(md, heading) {
  const lines = String(md || '').split('\n');
  const want = heading.trim();
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === want) {
      start = i + 1;
      level = (want.match(/^#+/) || ['#'])[0].length;
      break;
    }
  }
  if (start < 0) return '';
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    const m = /^(#+)\s/.exec(lines[i]);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n');
}

function styleRules(body) {
  const rules = [];
  for (const line of String(body || '').split('\n')) {
    const m = /^\s*-\s+(.+)$/.exec(line);
    if (!m || m[1].indexOf('|') < 0) continue;
    const parts = m[1].split('|');
    const triggers = parts[0].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    const simpler = parts.slice(1).join('|').trim();
    if (triggers.length && simpler) rules.push({ triggers, simpler });
  }
  return rules;
}

function labeledLine(body, label) {
  const re = new RegExp('^' + label + ':\\s*(.+)$', 'im');
  const m = re.exec(String(body || ''));
  return m ? m[1].trim() : '';
}

function purposeRules(body) {
  const rows = [];
  for (const line of String(body || '').split('\n')) {
    const m = /^\s*-\s+([A-Za-z0-9_ -]+)\s*\|\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1].trim().toUpperCase().replace(/[\s-]+/g, '_');
    const words = m[2].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    rows.push({ key, words });
  }
  return rows;
}

function approvedCount(md) {
  const body = sectionBody(md, '## Buildings');
  const m = /Approved count:\s*(\d+)/i.exec(body);
  return m ? Number(m[1]) : null;
}

function loadStyle(root) {
  const file = path.join(root, 'docs', 'NEON-WORLD-STYLE.md');
  let md = '';
  try { md = fs.readFileSync(file, 'utf8'); }
  catch (e) { return { ok: false, file, error: e.message, capability: [], drift: [], hard: [], purpose: [], approvedCount: null }; }
  const brand = sectionBody(md, '## Brand');
  return {
    ok: true,
    file: 'docs/NEON-WORLD-STYLE.md',
    mood: labeledLine(brand, 'Mood'),
    homes: labeledLine(brand, 'Homes'),
    ellie: labeledLine(brand, 'Ellie'),
    capability: styleRules(sectionBody(md, '## Capability')),
    drift: styleRules(sectionBody(md, '### Drift')),
    hard: styleRules(sectionBody(md, '### Hard breaks')),
    purpose: purposeRules(sectionBody(md, '## Purpose')),
    approvedCount: approvedCount(md)
  };
}

function discoverPlans(root, explicit) {
  const out = (explicit || []).slice();
  const docs = path.join(root, 'docs');
  if (fs.existsSync(docs)) {
    for (const name of fs.readdirSync(docs)) {
      if (!/\.md$/i.test(name)) continue;
      if (/neon-world-style/i.test(name)) continue;
      if (/plan|proposal|building/i.test(name)) out.push(path.join(docs, name));
    }
  }
  return [...new Set(out)];
}

function planClaims(text) {
  const claims = [];
  for (const raw of String(text || '').split('\n')) {
    const line = raw.replace(/^\s*[-*]\s+/, '').replace(/^\s*#+\s+/, '').trim();
    if (!line || line.startsWith('|') || line.startsWith('```')) continue;
    claims.push(line);
  }
  return claims;
}

function claimNegated(sentence, at, termLen) {
  const beforeNeg = /don'?t|do not|never|avoid|instead of|rather than|\bno\b|\bnot\b|without|forbid|forbidden|banned|drop the|away from|move off|moving off|moving away|won'?t|will not/;
  let before = sentence.slice(Math.max(0, at - 90), at);
  const cut = Math.max(before.lastIndexOf('. '), before.lastIndexOf('; '));
  if (cut >= 0) before = before.slice(cut + 1);
  if (beforeNeg.test(before)) return true;
  let after = sentence.slice(at + termLen, at + termLen + 80);
  const stop = after.search(/[.;]/);
  if (stop >= 0) after = after.slice(0, stop);
  return /don'?t|do not|never|avoid|forbidden|banned|not allowed|won'?t|will not/.test(after);
}

function scanPlanText(text, rules) {
  const hits = [];
  for (const claim of planClaims(text)) {
    const low = claim.toLowerCase();
    for (const rule of rules) {
      let caught = '';
      for (const term of rule.triggers) {
        const at = low.indexOf(term);
        if (at < 0) continue;
        if (claimNegated(low, at, term.length)) continue;
        caught = term;
        break;
      }
      if (!caught) continue;
      hits.push({ rule, term: caught, claim: claim.slice(0, 220) });
    }
  }
  return hits;
}

function pushFinding(report, finding) {
  report.findings = report.findings || [];
  const prev = report.findings.find((f) => f.check === finding.check && f.title === finding.title && f.severity === finding.severity);
  if (prev) {
    if (finding.detail && prev.detail.indexOf(finding.detail) < 0) prev.detail += ' ' + finding.detail;
    return prev;
  }
  report.findings.push(finding);
  return finding;
}

function applyGuide(report, style, planFiles) {
  report.styleGuide = style && style.file ? style.file : 'docs/NEON-WORLD-STYLE.md';
  report.passes = report.passes || [];
  report.findings = report.findings || [];
  if (!style || !style.ok) {
    pushFinding(report, {
      check: 'brand',
      severity: 'warn',
      title: 'Style guide was not loaded',
      detail: 'docs/NEON-WORLD-STYLE.md could not be read, so this run did not judge brand or capability against Bob\'s latest edits.',
      buildings: []
    });
    return;
  }
  const shadow = (report.findings || []).some((f) => f.check === 'shadow' && f.severity === 'fail');
  const blurRule = style.capability.find((r) => r.triggers.some((t) => t.indexOf('blur') >= 0));
  if (shadow && blurRule) {
    pushFinding(report, {
      check: 'capability',
      severity: 'fail',
      title: 'Beyond the stack: blur',
      detail: 'Finished building draw uses a live blur. ' + blurRule.simpler,
      buildings: []
    });
  }
  const plans = [];
  for (const file of planFiles || []) {
    let text = '';
    try { text = fs.readFileSync(file, 'utf8'); }
    catch (e) {
      pushFinding(report, {
        check: 'capability',
        severity: 'fail',
        title: 'Plan could not be read',
        detail: file + ' — ' + e.message,
        buildings: []
      });
      continue;
    }
    const rel = file.includes('docs' + path.sep) ? 'docs/' + path.basename(file) : path.basename(file);
    plans.push(rel);
    for (const hit of scanPlanText(text, style.capability)) {
      pushFinding(report, {
        check: 'capability',
        severity: 'fail',
        title: 'Plan is beyond the stack',
        detail: rel + ' asks for "' + hit.term + '". ' + hit.rule.simpler + ' Quote: ' + hit.claim,
        buildings: []
      });
    }
    for (const hit of scanPlanText(text, style.hard)) {
      pushFinding(report, {
        check: 'brand',
        severity: 'fail',
        title: 'Plan breaks the brand',
        detail: rel + ' — "' + hit.term + '". ' + hit.rule.simpler + ' Quote: ' + hit.claim,
        buildings: []
      });
    }
    for (const hit of scanPlanText(text, style.drift)) {
      pushFinding(report, {
        check: 'brand',
        severity: 'warn',
        title: 'Plan drifts from the brand',
        detail: rel + ' — "' + hit.term + '". ' + hit.rule.simpler + ' Quote: ' + hit.claim,
        buildings: []
      });
    }
  }
  report.plans = plans;
  const capFail = report.findings.some((f) => f.check === 'capability' && f.severity === 'fail');
  const brandFail = report.findings.some((f) => f.check === 'brand' && f.severity === 'fail');
  if (!capFail) report.passes.push('Nothing reviewed needs curves, photoreal detail, live blur, or a unique heavy mesh. Straight boxes, glow strips, and a light shared model stay inside the stack.');
  if (!brandFail && !report.findings.some((f) => f.check === 'brand' && f.severity === 'warn')) {
    report.passes.push('Brand matches the latest docs/NEON-WORLD-STYLE.md.');
  }
}

function buildingLine(b) {
  const note = b.note ? ' — ' + b.note : '';
  return (b.purpose || b.label || 'building') + ' `' + b.id + '`' + note;
}

function markdown(p) {
  const lines = [];
  lines.push('# Architecture check');
  lines.push('');
  lines.push('Target `' + (p.branch || '') + '` `' + (p.sha || '').slice(0, 12) + '`');
  lines.push('');
  lines.push('Result: **' + (p.ok ? 'PASS' : 'FAIL') + '**');
  lines.push('');
  lines.push('Reviewed ' + ((p.counts && p.counts.buildings) || 0) + ' solid buildings. Shots: ' + ((p.shotNames && p.shotNames.length) || 0) + '. Style guide: `' + (p.styleGuide || 'docs/NEON-WORLD-STYLE.md') + '`.');
  if (p.plans && p.plans.length) lines.push('Plans: ' + p.plans.join(', ') + '.');
  lines.push('');
  if (p.checkerError) {
    lines.push('Checker error: ' + p.checkerError);
    lines.push('');
  }
  if (p.calib && !p.calib.ok) {
    lines.push('Calibration failed. These building results are not trusted.');
    lines.push('');
    for (const e of p.calib.errors || []) lines.push('- ' + e);
    lines.push('');
  }
  const order = [
    ['count', 'Count'],
    ['layout', 'Layout'],
    ['scale', 'Scale'],
    ['doors', 'Doors'],
    ['garage', 'Garages'],
    ['windows', 'Windows'],
    ['geometry', 'Geometry'],
    ['roofs', 'Roofs'],
    ['tiers', 'Detail tiers'],
    ['signs', 'Signs'],
    ['purpose', 'Purpose'],
    ['mural', 'Z dance mural'],
    ['style', 'Style'],
    ['ramps', 'Ramps'],
    ['shadow', 'shadowBlur'],
    ['fps', 'FPS'],
    ['capability', 'Capability'],
    ['brand', 'On brand']
  ];
  for (const [id, title] of order) {
    const fails = (p.findings || []).filter((f) => f.check === id && f.severity === 'fail');
    const warns = (p.findings || []).filter((f) => f.check === id && f.severity === 'warn');
    lines.push('## ' + title);
    lines.push('');
    if (p.plansOnly && id !== 'capability' && id !== 'brand') {
      lines.push('Not run. This was a plan review, before a city build.');
      lines.push('');
      continue;
    }
    if (!fails.length && !warns.length) lines.push('Pass.');
    for (const f of fails) {
      lines.push('- **' + f.title + '**');
      lines.push('  ' + f.detail);
      const names = (f.buildings || []).map(buildingLine);
      if (names.length) lines.push('  Buildings: ' + names.join('; ') + '.');
    }
    for (const f of warns) {
      lines.push('- Warning: **' + f.title + '**');
      lines.push('  ' + f.detail);
      const names = (f.buildings || []).map(buildingLine);
      if (names.length) lines.push('  Buildings: ' + names.join('; ') + '.');
    }
    lines.push('');
  }
  if (p.ramps && p.ramps.riverEdge) {
    lines.push('## River-edge ramps');
    lines.push('');
    lines.push(p.ramps.count + ' ramps besides tow trucks. Light floor ' + p.ramps.lot + '. No upper limit.');
    lines.push('');
    for (const r of p.ramps.riverEdge) lines.push('- ' + r.bank + ' bank ' + r.h + ' m × ' + r.len + ' m, lip ' + r.lipToWater + ' m from the water, at ' + r.cx + ', ' + r.cz);
    lines.push('');
  }
  if (p.murals && p.murals.length) {
    lines.push('## Mural floor');
    lines.push('');
    for (const m of p.murals) lines.push('- ' + m.label + ' `' + m.id + '` ' + m.width + '×' + m.height + ' m (' + m.area + ' m²), flat ' + m.flat + ', intact ' + m.intact);
    lines.push('');
  }
  if (p.fps && p.fps.length) {
    lines.push('## FPS samples');
    lines.push('');
    lines.push('Software GL. Milliseconds are this host, same idea as PERF-GUARD. Source for the building-face share: ' + ((p.fpsCaps && p.fpsCaps.source) || '') + '.');
    lines.push('');
    lines.push('| View | One building ms | Pass ms | Buildings | Cap one | Cap pass | Buffer |');
    lines.push('| --- | ---: | ---: | ---: | ---: | ---: | --- |');
    for (const row of p.fps) {
      const caps = p.fpsCaps || { building: {}, pass: {} };
      lines.push('| ' + row.viewport + ' | ' + row.one.median + ' | ' + row.pass.median + ' | ' + row.neighbors + ' | ' + caps.building[row.viewport] + ' | ' + caps.pass[row.viewport] + ' | ' + row.buffer + ' |');
    }
    lines.push('');
  }
  if (p.passes && p.passes.length) {
    lines.push('## What held');
    lines.push('');
    for (const row of p.passes) lines.push('- ' + row);
    lines.push('');
  }
  if (p.shotNames && p.shotNames.length) {
    lines.push('## Shots');
    lines.push('');
    lines.push('Street front, three-quarter, flying roof, and on-foot close-up, at phone 844×390, iPad 1024×768, and PC 1280×720.');
    lines.push('');
    const by = new Map();
    for (const name of p.shotNames) {
      const id = name.split('-')[0];
      if (!by.has(id)) by.set(id, []);
      by.get(id).push('shots/' + name);
    }
    for (const [id, files] of by) lines.push('- `' + id + '` ' + files.join(', '));
    lines.push('');
  }
  return lines.join('\n');
}

function commentMd(p) {
  const lines = [];
  lines.push('## ARCHITECTURE-CHECK');
  lines.push('');
  lines.push('**' + (p.ok ? 'PASS' : 'FAIL') + '** on `' + (p.branch || '') + '` `' + (p.sha || '').slice(0, 12) + '`.');
  lines.push('');
  lines.push('Kid App buildings only. ' + ((p.counts && p.counts.buildings) || 0) + ' reviewed. Judged against `' + (p.styleGuide || 'docs/NEON-WORLD-STYLE.md') + '`. Full log: `test-results/arch-check/report.md`.');
  if (p.plans && p.plans.length) lines.push('Plans: ' + p.plans.join(', ') + '.');
  lines.push('');
  const fails = (p.findings || []).filter((f) => f.severity === 'fail');
  const warns = (p.findings || []).filter((f) => f.severity === 'warn');
  if (!fails.length) lines.push('No architecture fails.');
  for (const f of fails) {
    const n = (f.buildings || []).length;
    lines.push('- **' + f.title + '**' + (n ? ' (' + n + ')' : ''));
    lines.push('  ' + f.detail);
  }
  if (warns.length) {
    lines.push('');
    lines.push('Warnings (they do not fail the review):');
    lines.push('');
    for (const f of warns) {
      const n = (f.buildings || []).length;
      lines.push('- **' + f.title + '**' + (n ? ' (' + n + ')' : ''));
      lines.push('  ' + f.detail);
    }
  }
  lines.push('');
  if (p.fps && p.fps.length) {
    lines.push('FPS (software GL, one near building / in-view pass):');
    lines.push('');
    for (const row of p.fps) lines.push('- ' + row.viewport + ' ' + row.one.median + ' ms / ' + row.pass.median + ' ms over ' + row.neighbors + ' buildings');
    lines.push('');
  }
  if (p.ramps) {
    lines.push('Ramps: ' + p.ramps.count + ' (floor ' + p.ramps.lot + ', no ceiling). River-edge small jumps: ' + ((p.ramps.riverEdge && p.ramps.riverEdge.length) || 0) + '.');
    lines.push('');
  }
  if (p.murals && p.murals.length) {
    lines.push('Dance mural:');
    lines.push('');
    for (const m of p.murals) lines.push('- ' + m.label + ' ' + m.width + '×' + m.height + ' m');
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('node tools/arch-check.mjs [--root tree] [--out dir] [--no-shots] [--review] [--write-baseline] [--only PURPOSE] [--fps-baseline file] [--plan file] [--plans-only]');
    return;
  }
  const meta = readCommit(args.root);
  const baseline = loadBaseline(args.root);
  const style = loadStyle(args.root);
  const planFiles = discoverPlans(args.root, args.plans);
  const guidePayload = Object.assign({}, baseline || { murals: [] }, { style: style });
  let server = null;
  let chrome = null;
  let cdp = null;
  const report = {
    ok: false,
    sha: meta.sha,
    branch: meta.branch,
    findings: [],
    passes: [],
    shots: [],
    shotNames: [],
    checkerError: ''
  };
  try {
    if (args.plansOnly) throw Object.assign(new Error('skip-city'), { skipCity: true });
    server = await startServer(args.root, args.port);
    const srvPort = server.address().port;
    const debugPort = 9400 + Math.floor(Math.random() * 500);
    chrome = launchChrome(debugPort);
    const ver = await waitJson('http://127.0.0.1:' + debugPort + '/json/version', 80);
    cdp = new Cdp(ver.webSocketDebuggerUrl);
    await cdp.send('Target.setDiscoverTargets', { discover: true });
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await waitJson('http://127.0.0.1:' + debugPort + '/json/list', 40);
    const page = targets.find((t) => t.id === targetId) || targets.find((t) => t.type === 'page');
    cdp.close();
    cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + srvPort + '/__arch.html' });
    let readyVal = '';
    for (let i = 0; i < 80; i++) {
      readyVal = await cdp.eval('window.__ARCH_READY');
      if (readyVal === 'ready') break;
      await sleep(200);
    }
    if (readyVal !== 'ready') {
      const probe = await cdp.eval('JSON.stringify({state:document.readyState, err:window.__bootError||"", city:typeof CITY, draw:typeof drawBldg, detail:!!window.DETAIL, paint:!!(window.NEON_PAINT&&window.NEON_PAINT.muralFrame)})');
      throw new Error('Harness did not start: ' + readyVal + ' ' + probe + ' logs=' + cdp.logs.slice(0, 6).join('\n'));
    }
    const scales = await cdp.eval('ARCH.preload()');
    report.scales = scales;
    const pageReport = await cdp.eval('ARCH.run(' + JSON.stringify(guidePayload) + ')', 300000);
    Object.assign(report, pageReport, { sha: meta.sha, branch: meta.branch, shots: [], shotNames: [] });
    report.findings = report.findings || [];
    report.passes = report.passes || [];
    mergeShadow(report, scanShadow(args.root));
    const budget = fpsBudget(args.root, args.fpsBaseline);
    report.fps = [];
    for (const vp of ['phone', 'ipad', 'pc']) {
      const rate = vp === 'ipad' ? 4 : 1;
      try { await cdp.send('Emulation.setCPUThrottlingRate', { rate }); } catch (e) {}
      const row = await cdp.eval('ARCH.timeFps(' + JSON.stringify(vp) + ')', 180000);
      report.fps.push(row);
    }
    try { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); } catch (e) {}
    applyFps(report, budget);
    if (args.writeBaseline) {
      writeBaseline(args.root, report, baseline);
      report.passes.push('Mural floor written to tools/arch-check-baseline.json.');
    } else if (!baseline) {
      report.passes.push('No mural floor file yet. Run with --write-baseline to record today.');
    }
    if (args.shots) {
      let plan = await cdp.eval('ARCH.plan()');
      if (args.only) {
        const want = args.only.toLowerCase().split(/[,\s]+/);
        plan = plan.filter((b) => want.indexOf(String(b.purpose || '').toLowerCase()) >= 0);
      }
      for (const b of plan) {
        for (const name of b.shots) {
          const b64 = await cdp.eval('ARCH.shot(' + JSON.stringify(name) + ')', 120000);
          if (b64) {
            report.shots.push({ name, b64 });
            report.shotNames.push(name);
          }
        }
      }
    }
  } catch (e) {
    if (!(e && e.skipCity)) {
      report.checkerError = String(e && e.stack || e);
      if (!report.findings) report.findings = [];
      if (!report.passes) report.passes = [];
    }
  } finally {
    applyGuide(report, style, planFiles);
    report.plansOnly = !!args.plansOnly;
    const failN = (report.findings || []).filter((f) => f.severity === 'fail').length;
    const cityOk = args.plansOnly ? !report.checkerError : !!(report.calib && report.calib.ok);
    report.ok = cityOk && !failN && !report.checkerError;
    report.counts = report.counts || { buildings: args.plansOnly ? 0 : 0, fails: 0 };
    report.counts.fails = failN;
    report.counts.warns = (report.findings || []).filter((f) => f.severity === 'warn').length;
    report.counts.shots = (report.shotNames || []).length;
    writeReport(args.out, report);
    if (cdp) cdp.close();
    if (chrome) {
      try { chrome.child.kill('SIGKILL'); } catch (e) {}
      try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
    }
    if (server) server.close();
  }
  const fails = (report.findings || []).filter((f) => f.severity === 'fail').length;
  const warns = (report.findings || []).filter((f) => f.severity === 'warn').length;
  console.log((report.ok ? 'PASS' : 'FAIL') + ' findings=' + fails + ' warnings=' + warns + ' shots=' + (report.shotNames || []).length + ' out=' + args.out);
  console.log('sha ' + (report.sha || ''));
  for (const f of report.findings || []) {
    if (f.severity === 'fail' || f.severity === 'warn') console.log(f.severity + ' ' + f.check + ' ' + f.title + ' n=' + ((f.buildings && f.buildings.length) || 0));
  }
  if (report.checkerError) console.log('CHECKER ' + report.checkerError.split('\n')[0]);
  if (report.calib && !report.calib.ok) {
    for (const e of report.calib.errors || []) console.log('CALIB ' + e);
  }
  if (report.fps) {
    for (const row of report.fps) console.log('FPS ' + row.viewport + ' one=' + row.one.median + ' pass=' + row.pass.median + ' n=' + row.neighbors);
  }
  const checkerBad = !!report.checkerError || (report.calib && !report.calib.ok);
  if (checkerBad) process.exitCode = 2;
  else if (!report.ok && !args.review) process.exitCode = 1;
  else process.exitCode = 0;
}

main().catch((e) => {
  console.error(e && e.stack || e);
  process.exitCode = 2;
});
