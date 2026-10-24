#!/usr/bin/env node
/**
 * PERF-GUARD — headless Chrome performance regression bench for Neon World.
 *
 * Test-only. Nothing here is loaded by the game. Software GL (--disable-gpu)
 * times are relative to this machine, not a Galaxy or an A10.
 *
 *   node tools/perf-guard.mjs --self-test
 *   node tools/perf-guard.mjs --quick --measure
 *   node tools/perf-guard.mjs --write-baseline
 *   node tools/perf-guard.mjs --baseline test-results/before.json --measure
 *   node tools/perf-guard.mjs --compare a.json b.json
 *
 * Full notes: tools/PERF-GUARD.md
 */
import { spawn, execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_BASELINE = path.join(ROOT, 'tools', 'perf-guard-baseline.json');
const CHROME = process.env.CHROME || 'google-chrome';

const VIEWPORTS = {
  phone: { id: 'phone', label: 'Phone', width: 844, height: 390, dpr: 2, touch: true, cpuThrottle: 1 },
  ipad: { id: 'ipad', label: 'iPad A10-class', width: 1024, height: 768, dpr: 2, touch: true, cpuThrottle: 4 },
  pc: { id: 'pc', label: 'PC', width: 1280, height: 720, dpr: 1, touch: false, cpuThrottle: 1 }
};

const WORLD_SCENES = ['air', 'face', 'shops', 'drive', 'house', 'closet'];
const SCENE_LABEL = {
  air: 'Open-air flight',
  face: 'Building face',
  shops: 'City Builder shops',
  drive: 'Downtown drive',
  house: "Ellie's House + item menu",
  closet: 'Closet',
  'jr-shell': 'Kid App shell (jr.html)'
};

const MEDIAN_LIMIT = 0.05;
const LOW1_LIMIT = 0.10;
const HOST_MATCH = 0.12;
const HOST_SCALE_MAX = 2;

function parseArgs(argv) {
  const o = {
    baseline: DEFAULT_BASELINE,
    out: '',
    commentMd: '',
    quick: false,
    measure: false,
    strict: false,
    writeBaseline: false,
    allowShortBaseline: false,
    forceHost: false,
    selfTest: false,
    compare: null,
    only: null,
    viewport: null,
    page: null,
    heapMs: null,
    heapViewport: 'phone',
    label: '',
    shotDir: '',
    help: false
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error('Missing value for ' + a);
      return argv[++i];
    };
    if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--self-test') o.selfTest = true;
    else if (a === '--quick') o.quick = true;
    else if (a === '--measure') o.measure = true;
    else if (a === '--strict') o.strict = true;
    else if (a === '--write-baseline') o.writeBaseline = true;
    else if (a === '--allow-short-baseline') o.allowShortBaseline = true;
    else if (a === '--force-host') o.forceHost = true;
    else if (a === '--baseline') o.baseline = path.resolve(next());
    else if (a === '--out') o.out = path.resolve(next());
    else if (a === '--comment-md') o.commentMd = path.resolve(next());
    else if (a === '--compare') o.compare = [path.resolve(next()), path.resolve(next())];
    else if (a === '--only') o.only = next().split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--viewport') o.viewport = next().split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--page') o.page = next().split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--heap-ms') o.heapMs = Number(next());
    else if (a === '--heap-viewport') o.heapViewport = next();
    else if (a === '--label') o.label = next();
    else if (a === '--shot-dir') o.shotDir = path.resolve(next());
    else throw new Error('Unknown arg ' + a);
  }
  if (o.heapMs == null) o.heapMs = o.quick ? 20000 : 180000;
  if (!(o.heapMs >= 0)) throw new Error('--heap-ms must be >= 0');
  return o;
}

function help() {
  console.log(`PERF-GUARD  (tools/PERF-GUARD.md)

  node tools/perf-guard.mjs                       compare with the committed baseline
  node tools/perf-guard.mjs --measure             same table, always exit 0 (FPS agent)
  node tools/perf-guard.mjs --quick --measure     short samples, 20s heap
  node tools/perf-guard.mjs --write-baseline      replace tools/perf-guard-baseline.json
  node tools/perf-guard.mjs --baseline before.json --out after.json
  node tools/perf-guard.mjs --compare before.json after.json
  node tools/perf-guard.mjs --only air,face --viewport phone
  node tools/perf-guard.mjs --page test/world-split.html --measure
  node tools/perf-guard.mjs --self-test

Exit 1 on a regression only when the baseline has "enforce": true, or with --strict.
--measure always exits 0 so in-progress FPS work is not blocked.
A crashed bench still exits 1.`);
}

function round(n, d) {
  if (!Number.isFinite(n)) return null;
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

function frameStats(samples) {
  const s = (samples || []).filter(n => Number.isFinite(n) && n >= 0 && n < 5000);
  const body = s.length > 8 ? s.slice(3) : s.slice();
  if (!body.length) return null;
  const sorted = body.slice().sort((a, b) => a - b);
  // Median of the slower half. Several scenes paint on one frame and spend the
  // next frame almost idle, so a plain median flips between those two modes
  // when a single sample is added or dropped. The slower half stays on the
  // loaded paint. A scene whose frames are all cheap (the house) stays cheap.
  const loaded = sorted.slice(Math.floor(sorted.length / 2));
  const mid = Math.floor(loaded.length / 2);
  const median = loaded.length % 2 ? loaded[mid] : (loaded[mid - 1] + loaded[mid]) / 2;
  const nLow = Math.max(1, Math.ceil(sorted.length * 0.01));
  const worst = sorted.slice(-nLow);
  const low1 = worst.reduce((a, b) => a + b, 0) / worst.length;
  return {
    medianMs: median,
    low1Ms: low1,
    maxMs: sorted[sorted.length - 1],
    frames: body.length
  };
}

/** One-frame blanks and flashes. shots[i] is a luminance grid (0-255). */
function detectFlicker(shots) {
  const body = (shots || []).filter(s => s && s.length);
  const start = body.length > 12 ? 5 : 0;
  const flags = [];
  if (body.length < start + 3) return { frames: 0, index: [], considered: Math.max(0, body.length - start) };
  const N = body[0].length;
  for (let i = start + 1; i < body.length - 1; i++) {
    const prev = body[i - 1], cur = body[i], next = body[i + 1];
    if (prev.length !== N || cur.length !== N || next.length !== N) continue;
    let blank = 0, flash = 0, prevMean = 0, curMean = 0, nextMean = 0;
    for (let p = 0; p < N; p++) {
      const a = prev[p], b = cur[p], c = next[p];
      prevMean += a; curMean += b; nextMean += c;
      if (a > 28 && b < 14 && c > 28) blank++;
      const d0 = a > b ? a - b : b - a;
      const d1 = b > c ? b - c : c - b;
      const d2 = a > c ? a - c : c - a;
      if (d0 > 70 && d1 > 70 && d2 < 30) flash++;
    }
    prevMean /= N; curMean /= N; nextMean /= N;
    const surround = (prevMean + nextMean) / 2;
    const bigDrop = surround - curMean > 22 && curMean < surround * 0.62 && blank / N > 0.18;
    if (blank / N > 0.18 || flash / N > 0.12 || bigDrop) flags.push(i);
  }
  return { frames: flags.length, index: flags, considered: body.length - start };
}

function median(nums) {
  const s = nums.filter(n => Number.isFinite(n)).slice().sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Steady growth: each third of the flight is higher, and the last third
 * never falls back to the first third (a GC sawtooth or a cache that fills
 * and plateaus is not a steady climb).
 */
function heapTrend(samples) {
  const bytes = (samples || []).map(s => s.bytes).filter(n => Number.isFinite(n));
  if (bytes.length < 6) {
    return { steady: false, reason: 'fewer than 6 heap samples', first: null, mid: null, last: null };
  }
  const third = Math.floor(bytes.length / 3);
  const a = median(bytes.slice(0, third));
  const b = median(bytes.slice(third, third * 2));
  const c = median(bytes.slice(third * 2));
  const lastMin = Math.min(...bytes.slice(third * 2));
  const firstMax = Math.max(...bytes.slice(0, third));
  const climb = c > a * 1.08 && b > a * 1.03 && c > b * 1.02;
  const noRecovery = lastMin > firstMax * 0.97;
  const steady = !!(climb && noRecovery);
  const fmt = n => n == null ? '?' : (n / 1048576).toFixed(1) + ' MB';
  return {
    steady,
    first: a,
    mid: b,
    last: c,
    lastMin,
    firstMax,
    reason: steady
      ? 'steady climb ' + fmt(a) + ' → ' + fmt(b) + ' → ' + fmt(c) + ' with no return'
      : 'not a steady climb (' + fmt(a) + ' → ' + fmt(b) + ' → ' + fmt(c) + ')'
  };
}

function cpuCalib() {
  const runs = [];
  for (let r = 0; r < 5; r++) {
    const end = process.hrtime.bigint() + 120000000n;
    let n = 0x12345678;
    let steps = 0;
    while (process.hrtime.bigint() < end) {
      n = Math.imul(n, 1664525) + 1013904223;
      steps++;
    }
    runs.push(steps);
  }
  return median(runs);
}

function gitInfo() {
  const read = (cmd) => {
    try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch (e) { return ''; }
  };
  return {
    sha: read('git rev-parse HEAD'),
    branch: read('git rev-parse --abbrev-ref HEAD')
  };
}

function fileSha(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0, 16);
}

function hostInfo() {
  const cpus = os.cpus() || [];
  return {
    cpuModel: cpus[0] ? cpus[0].model : '',
    cpuCount: cpus.length,
    calib: cpuCalib(),
    platform: process.platform,
    node: process.version
  };
}

function pct(cur, base) {
  if (!(base > 0) || !Number.isFinite(cur)) return null;
  return (cur - base) / base;
}

function hostScale(curCalib, baseCalib, forceHost) {
  if (forceHost || !(curCalib > 0) || !(baseCalib > 0)) {
    return { scale: 1, mode: forceHost ? 'force' : 'raw', skip: false };
  }
  const ratio = curCalib / baseCalib;
  if (ratio >= 1 - HOST_MATCH && ratio <= 1 + HOST_MATCH) return { scale: 1, mode: 'raw', skip: false, ratio };
  if (ratio >= 1 / HOST_SCALE_MAX && ratio <= HOST_SCALE_MAX) {
    return { scale: ratio, mode: 'scaled', skip: false, ratio };
  }
  return { scale: 1, mode: 'skip', skip: true, ratio };
}

function judgeRow(cur, base, scaleInfo) {
  const out = {
    key: cur.key,
    label: cur.label || SCENE_LABEL[cur.scene] || cur.scene,
    viewport: cur.viewport,
    scene: cur.scene,
    medianMs: cur.medianMs,
    low1Ms: cur.low1Ms,
    maxMs: cur.maxMs,
    frames: cur.frames,
    flickerFrames: cur.flickerFrames || 0,
    domStart: cur.domStart,
    domEnd: cur.domEnd,
    rafPerSec: cur.rafPerSec,
    rafPerFrame: cur.rafPerFrame,
    buffer: cur.buffer,
    hook: cur.hook || '',
    error: cur.error || '',
    fails: [],
    warns: [],
    result: 'PASS'
  };
  if (cur.error) {
    out.fails.push(cur.error);
    out.result = 'FAIL';
    return out;
  }
  if (!base) {
    out.warns.push('no baseline row');
    out.result = 'NO-BASE';
    return out;
  }
  out.baseMedianMs = base.medianMs;
  out.baseLow1Ms = base.low1Ms;
  out.baseFlicker = base.flickerFrames || 0;
  out.hookNote = base.hook && cur.hook && base.hook !== cur.hook ? (base.hook + ' → ' + cur.hook) : '';
  if (out.hookNote) out.warns.push('hook ' + out.hookNote);
  if (scaleInfo.skip) {
    out.warns.push('host mismatch, frame-time gates skipped');
    out.scaleMode = 'skip';
  } else {
    const med = cur.medianMs * scaleInfo.scale;
    const low = cur.low1Ms * scaleInfo.scale;
    out.adjMedianMs = med;
    out.adjLow1Ms = low;
    out.scaleMode = scaleInfo.mode;
    const medPct = pct(med, base.medianMs);
    const lowPct = pct(low, base.low1Ms);
    out.medianPct = medPct;
    out.low1Pct = lowPct;
    if (medPct != null && medPct > MEDIAN_LIMIT && med - base.medianMs > 0.3) {
      out.fails.push('median +' + (medPct * 100).toFixed(1) + '%');
    }
    if (lowPct != null && lowPct > LOW1_LIMIT && low - base.low1Ms > 0.3) {
      out.fails.push('1% low +' + (lowPct * 100).toFixed(1) + '%');
    }
  }
  if ((cur.flickerFrames || 0) > 0) out.fails.push('flicker ' + cur.flickerFrames);
  if (out.fails.length) out.result = 'FAIL';
  else if (out.warns.length && out.result === 'PASS') out.result = 'PASS';
  return out;
}

function judgeHeap(cur, scaleInfo) {
  const trend = cur || { steady: false, reason: 'no heap sample' };
  const fails = [];
  if (trend.steady) fails.push('heap ' + trend.reason);
  return {
    key: 'heap',
    label: '3-minute flight heap',
    steady: !!trend.steady,
    reason: trend.reason || '',
    fails,
    warns: scaleInfo && scaleInfo.skip ? [] : [],
    result: fails.length ? 'FAIL' : 'PASS',
    samples: trend.samples || cur.samples || [],
    durationMs: cur.durationMs || 0,
    viewport: cur.viewport || ''
  };
}

function compareRuns(current, baseline, opts) {
  const force = !!(opts && opts.forceHost);
  const scaleInfo = hostScale(current.host && current.host.calib, baseline && baseline.host && baseline.host.calib, force);
  const rows = [];
  const curRows = current.rows || {};
  const baseRows = (baseline && baseline.rows) || {};
  for (const key of Object.keys(curRows)) {
    rows.push(judgeRow(Object.assign({ key }, curRows[key]), baseRows[key] || null, scaleInfo));
  }
  const heap = judgeHeap(current.heap || { steady: false, reason: 'heap not run' }, scaleInfo);
  const fails = rows.reduce((n, r) => n + (r.result === 'FAIL' ? 1 : 0), 0) + (heap.result === 'FAIL' ? 1 : 0);
  return { rows, heap, fails, scaleInfo };
}

function fmtMs(n) {
  return Number.isFinite(n) ? n.toFixed(1) : '—';
}
function fmtPct(n) {
  if (!Number.isFinite(n)) return '—';
  const v = (n * 100);
  return (v > 0 ? '+' : '') + v.toFixed(1) + '%';
}

function markdownReport(current, judged, opts) {
  const enf = current.enforce === true;
  const blocking = !!(opts && opts.strict) || enf;
  const measure = !!(opts && opts.measure);
  const lines = [];
  lines.push('<!-- PERF-GUARD -->');
  lines.push('## PERF-GUARD');
  lines.push('');
  if (measure || !blocking) {
    lines.push('**Advisory.** The check does not fail the PR. Frame-time gates start failing the job after the FPS fixes merge, the baseline is refreshed, and `enforce` is set to `true`.');
  } else {
    lines.push('**Enforcing.** A regression fails this job.');
  }
  lines.push('');
  lines.push('Software GL (`--disable-gpu`, SwiftShader). These milliseconds are relative to the host, not a phone, Galaxy, or iPad A10 frame rate.');
  lines.push('');
  const sc = judged.scaleInfo || { mode: 'raw' };
  if (sc.mode === 'scaled') {
    lines.push('CPU calib differs from the baseline host (ratio ' + (sc.ratio || 0).toFixed(2) + '). Median and 1% low are scaled by that ratio before the 5% / 10% gates. Raw times are listed first.');
  } else if (sc.mode === 'skip') {
    lines.push('CPU calib is too far from the baseline host (ratio ' + (sc.ratio || 0).toFixed(2) + '). Median and 1% low are shown and **not** gated. Flicker and steady heap growth still count. Re-baseline on this machine.');
  } else if (sc.mode === 'force') {
    lines.push('Host check overridden with `--force-host`. Gates use raw times.');
  } else {
    lines.push('Host CPU calib matches the baseline. Gates use raw frame times.');
  }
  lines.push('');
  lines.push('| View | Scene | Median ms | vs base | 1% low | vs base | Max | Flicker | DOM | rAF/s | Buffer | Result |');
  lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |');
  for (const r of judged.rows) {
    const medShow = sc.mode === 'scaled' && Number.isFinite(r.adjMedianMs)
      ? fmtMs(r.medianMs) + ' (adj ' + fmtMs(r.adjMedianMs) + ')'
      : fmtMs(r.medianMs);
    const lowShow = sc.mode === 'scaled' && Number.isFinite(r.adjLow1Ms)
      ? fmtMs(r.low1Ms) + ' (adj ' + fmtMs(r.adjLow1Ms) + ')'
      : fmtMs(r.low1Ms);
    const dom = (r.domStart != null ? r.domStart : '—') + (r.domEnd != null && r.domEnd !== r.domStart ? '→' + r.domEnd : '');
    const why = r.fails.length ? r.fails.join(', ') : (r.result === 'NO-BASE' ? 'no baseline' : '');
    const result = why && r.result === 'FAIL' ? 'FAIL: ' + why : r.result;
    lines.push('| ' + [
      r.viewport, r.label, medShow, fmtPct(r.medianPct), lowShow, fmtPct(r.low1Pct),
      fmtMs(r.maxMs), String(r.flickerFrames || 0), dom,
      Number.isFinite(r.rafPerSec) ? r.rafPerSec.toFixed(1) : '—',
      r.buffer || '—', result
    ].join(' | ') + ' |');
  }
  lines.push('');
  const h = judged.heap;
  lines.push('**Heap** (' + (h.viewport || current.heap && current.heap.viewport || '?') + ', ' + Math.round((h.durationMs || 0) / 1000) + 's flight): ' + h.result + ' — ' + (h.reason || ''));
  if (h.steady) lines.push('');
  lines.push('');
  lines.push('Frame ms is the work inside the animation callbacks for that frame (summed when the page schedules more than one). The median is the median of the slower half of those frames, so a cheap frame between paints does not hide the loaded one. It is not the vsync gap, and it is not a Galaxy or A10 frame rate.');
  lines.push('Fail rules: that median worse than 5%, the 1% low (mean of the slowest 1% of frames) worse than 10%, any flicker frame, or a heap that climbs through all three thirds of the flight and does not come back.');
  lines.push('');
  lines.push('Run `' + (current.git && current.git.sha ? current.git.sha.slice(0, 12) : '?') + '` on `' + (current.git && current.git.branch || '?') + '`. Baseline `enforce` is **' + (current.baselineEnforce === true ? 'true' : 'false') + '**' + (current.baselineSha ? ' (baseline sha ' + String(current.baselineSha).slice(0, 12) + ')' : '') + '.');
  lines.push('');
  lines.push('Pages: world.html and world-split.html ' + (current.pages && current.pages.sameBytes ? 'are the same bytes (one bench covers both)' : 'differ (both were measured)') + '. jr.html is the Kid App shell sample. Closet uses a real closet control when the page has one; otherwise the in-house furniture item list.');
  lines.push('');
  lines.push('Local: `node tools/perf-guard.mjs --measure`. Refresh after FPS PR #56 merges: `node tools/perf-guard.mjs --write-baseline`, then set `"enforce": true`.');
  lines.push('');
  const failN = judged.fails;
  lines.push(failN ? ('**' + failN + ' failing row' + (failN === 1 ? '' : 's') + '.**') : '**No failing rows.**');
  return lines.join('\n');
}

function printTable(current, judged) {
  const text = markdownReport(current, judged, { measure: true, strict: false });
  console.log(text.replace(/^<!-- PERF-GUARD -->\n/, ''));
}

function selfTest() {
  const failures = [];
  const eq = (name, cond) => { if (!cond) failures.push(name); };
  const steady = [];
  for (let i = 0; i < 30; i++) steady.push(16 + (i % 2 ? 0.4 : 0));
  const st = frameStats(steady);
  eq('median near 16', st && Math.abs(st.medianMs - 16.2) < 0.5);
  eq('low1 above median', st && st.low1Ms >= st.medianMs - 0.01);
  const split = [];
  for (let i = 0; i < 40; i++) split.push(i % 2 ? 2 : 70);
  const sp = frameStats(split);
  eq('alternating cheap frames do not hide the loaded median', sp && sp.medianMs > 60 && sp.medianMs < 80);

  const shots = [];
  const N = 48 * 27;
  const fill = (v) => { const a = new Array(N); for (let i = 0; i < N; i++) a[i] = v; return a; };
  for (let i = 0; i < 12; i++) shots.push(fill(40));
  eq('stable frames are not flicker', detectFlicker(shots).frames === 0);
  const blanked = shots.slice();
  blanked[8] = fill(0);
  eq('single black frame is flicker', detectFlicker(blanked).frames >= 1);
  const flashed = shots.slice();
  flashed[8] = fill(255);
  eq('single white frame is flicker', detectFlicker(flashed).frames >= 1);
  const drift = [];
  for (let i = 0; i < 12; i++) drift.push(fill(30 + i));
  eq('slow drift is not flicker', detectFlicker(drift).frames === 0);
  const dark = [];
  for (let i = 0; i < 12; i++) dark.push(fill(8));
  eq('dark sky is not flicker', detectFlicker(dark).frames === 0);

  const climb = [];
  for (let i = 0; i < 9; i++) climb.push({ t: i, bytes: (40 + i * 3) * 1048576 });
  eq('steady heap climb fails', heapTrend(climb).steady === true);
  const saw = [];
  for (let i = 0; i < 9; i++) saw.push({ t: i, bytes: (40 + (i % 3) * 4) * 1048576 });
  eq('sawtooth heap passes', heapTrend(saw).steady === false);
  const plateau = [40, 55, 60, 61, 62, 61, 62, 61, 62].map((mb, i) => ({ t: i, bytes: mb * 1048576 }));
  eq('plateau heap passes', heapTrend(plateau).steady === false);

  const cur = {
    host: { calib: 1000 },
    rows: {
      'phone/air': { viewport: 'phone', scene: 'air', medianMs: 42, low1Ms: 55, maxMs: 80, frames: 100, flickerFrames: 0, domStart: 10, domEnd: 10, rafPerSec: 24 }
    },
    heap: { steady: false, reason: 'ok', durationMs: 180000, viewport: 'phone' }
  };
  const base = {
    host: { calib: 1000 },
    rows: { 'phone/air': { medianMs: 40, low1Ms: 50, flickerFrames: 0, hook: '' } }
  };
  const same = compareRuns(cur, base, {});
  eq('5% median is the edge (42 vs 40 is +5%, not over)', same.rows[0].result === 'PASS');
  cur.rows['phone/air'].medianMs = 43;
  const over = compareRuns(cur, base, {});
  eq('median +7.5% fails', over.rows[0].fails.some(f => f.startsWith('median')));
  cur.rows['phone/air'].medianMs = 40;
  cur.rows['phone/air'].low1Ms = 56;
  const low = compareRuns(cur, base, {});
  eq('1% low +12% fails', low.rows[0].fails.some(f => f.startsWith('1% low')));
  cur.rows['phone/air'].low1Ms = 50;
  cur.rows['phone/air'].flickerFrames = 2;
  const fl = compareRuns(cur, base, {});
  eq('flicker fails', fl.rows[0].fails.some(f => f.startsWith('flicker')));
  cur.rows['phone/air'].flickerFrames = 0;
  cur.heap = { steady: true, reason: 'steady climb', durationMs: 180000, viewport: 'phone' };
  const hp = compareRuns(cur, base, {});
  eq('heap fail counted', hp.heap.result === 'FAIL' && hp.fails >= 1);

  const slow = compareRuns({
    host: { calib: 700 },
    rows: { 'phone/air': { viewport: 'phone', scene: 'air', medianMs: 50, low1Ms: 62, maxMs: 90, frames: 80, flickerFrames: 0 } },
    heap: { steady: false, reason: 'ok', durationMs: 180000, viewport: 'phone' }
  }, base, {});
  eq('slower cpu is scaled', slow.scaleInfo.mode === 'scaled');
  eq('scaled 50ms at 0.7x is not a median fail vs 40', !slow.rows[0].fails.some(f => f.startsWith('median')));

  if (failures.length) {
    console.error('SELF-TEST FAIL');
    failures.forEach(f => console.error('  - ' + f));
    process.exit(1);
  }
  console.log('SELF-TEST PASS');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
    '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff'
  })[ext] || 'application/octet-stream';
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + rel); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function launchChrome(port) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zd-perf-guard-'));
  const args = [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--disable-sync',
    '--disable-extensions', '--mute-audio', '--hide-scrollbars',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb',
    '--enable-precise-memory-info', '--autoplay-policy=no-user-gesture-required',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    'about:blank'
  ];
  const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let err = '';
  child.stderr.on('data', d => { err += d.toString(); if (err.length > 8000) err = err.slice(-8000); });
  return { child, dir, err: () => err };
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
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error((msg.error && msg.error.message) || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      }
    });
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 45000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function evaluate(cdp, expression, timeout) {
  const res = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  }, (timeout || 20000) + 5000);
  if (res.exceptionDetails) {
    const d = res.exceptionDetails;
    throw new Error((d.exception && (d.exception.description || d.exception.value)) || d.text || 'eval failed');
  }
  return res.result ? res.result.value : undefined;
}

function pageBootSource() {
  return `(() => {
    if (window.__perfGuard && window.__perfGuard.installed) return;
    const detectFlicker = ${detectFlicker.toString()};
    const native = window.requestAnimationFrame.bind(window);
    const g = window.__perfGuard = {
      installed: true,
      on: false,
      mode: 'time',
      rafRaw: 0,
      frames: [],
      shots: [],
      lastT: 0,
      bucket: 0,
      hold: null,
      hook: '',
      errors: []
    };
    window.addEventListener('error', function (e) {
      g.errors.push(String((e && (e.message || e.error)) || 'error').slice(0, 300));
    });
    const shot = document.createElement('canvas');
    shot.width = 48; shot.height = 27;
    const sg = shot.getContext('2d', { willReadFrequently: true });
    function activeCanvases() {
      const interior = document.getElementById('walk-interior');
      const room = document.getElementById('walk-room-cv');
      const interiorOn = interior && !interior.hidden && interior.classList.contains('show') && room && room.width > 2;
      if (interiorOn) return [room];
      const list = [];
      ['cback', 'cgl', 'c'].forEach(function (id) {
        const c = document.getElementById(id);
        if (c && c.width > 2 && c !== shot) list.push(c);
      });
      if (!list.length) {
        document.querySelectorAll('canvas').forEach(function (c) {
          if (c !== shot && c.width > 2 && c.height > 2) list.push(c);
        });
      }
      return list;
    }
    function takeLum() {
      if (!sg) return null;
      sg.setTransform(1, 0, 0, 1, 0, 0);
      sg.clearRect(0, 0, 48, 27);
      const cans = activeCanvases();
      if (!cans.length) return null;
      for (let i = 0; i < cans.length; i++) {
        try { sg.drawImage(cans[i], 0, 0, 48, 27); } catch (e) {}
      }
      let data;
      try { data = sg.getImageData(0, 0, 48, 27).data; } catch (e) { return null; }
      const lum = new Array(48 * 27);
      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        lum[p] = (data[i] * 54 + data[i + 1] * 183 + data[i + 2] * 19) >> 8;
      }
      return lum;
    }
    window.requestAnimationFrame = function perfGuardFrame(cb) {
      g.rafRaw++;
      return native(function (t) {
        if (typeof g.hold === 'function') { try { g.hold(); } catch (e) {} }
        if (g.on && g.mode === 'flicker' && t !== g.lastT) {
          const lum = takeLum();
          if (lum) {
            g.shots.push(lum);
            if (g.shots.length > 90) g.shots.shift();
          }
        }
        const t0 = g.on ? performance.now() : 0;
        const ret = cb(t);
        if (g.on) {
          const work = performance.now() - t0;
          if (t !== g.lastT) {
            if (g.lastT) g.frames.push(g.bucket);
            g.bucket = work;
            g.lastT = t;
          } else g.bucket += work;
        }
        return ret;
      });
    };
    function meta() {
      const c = document.getElementById('c') || document.querySelector('canvas');
      let gameDpr = null;
      try { if (typeof DPR !== 'undefined') gameDpr = DPR; } catch (e) {}
      let fps = null;
      try { if (window.FLY && typeof FLY.fps === 'number') fps = FLY.fps; } catch (e) {}
      return {
        dom: document.getElementsByTagName('*').length,
        buffer: c ? (c.width + 'x' + c.height) : '',
        css: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
        dpr: window.devicePixelRatio || 1,
        gameDpr: gameDpr,
        fps: fps,
        inside: !!(window.WALK_MODE && WALK_MODE.insideBuilding),
        purpose: (window.WALK_MODE && WALK_MODE.insideDoor && WALK_MODE.insideDoor.purpose) || '',
        tools: document.querySelectorAll('#walk-room-tools button').length,
        hook: g.hook || '',
        title: document.title || ''
      };
    }
    g.meta = meta;
    g.begin = function (mode) {
      g.mode = mode || 'time';
      g.frames = [];
      g.shots = [];
      g.rafRaw = 0;
      g.lastT = 0;
      g.bucket = 0;
      g.on = true;
      g.t0 = performance.now();
      return meta();
    };
    g.end = function () {
      g.on = false;
      if (g.lastT) g.frames.push(g.bucket);
      const frames = g.frames.slice();
      const elapsed = Math.max(1, performance.now() - (g.t0 || performance.now()));
      let flicker = { frames: 0, index: [], considered: 0 };
      if (g.mode === 'flicker') {
        try { flicker = detectFlicker(g.shots); } catch (e) { flicker = { frames: 0, index: [], error: String(e) }; }
      }
      const m = meta();
      const unique = frames.length;
      g.frames = [];
      g.shots = [];
      return {
        frames: frames.slice(0, 2000),
        rafRaw: g.rafRaw,
        elapsed: elapsed,
        rafPerSec: unique / (elapsed / 1000),
        rafPerFrame: unique ? g.rafRaw / unique : 0,
        flickerFrames: flicker.frames || 0,
        flickerIndex: (flicker.index || []).slice(0, 8),
        meta: m
      };
    };
    function wake(keepMenu) {
      try { flying = true; } catch (e) {}
      try { paused = false; } catch (e) {}
      try { if (typeof FLYCAM !== 'undefined') FLYCAM.orbit = null; } catch (e) {}
      const over = document.getElementById('kOver');
      if (over) {
        over.classList.add('hidden');
        over.style.setProperty('display', 'none', 'important');
      }
      if (!keepMenu) {
        const home = document.getElementById('kHome');
        if (home) home.classList.add('hidden');
        const bg = document.getElementById('kPzBg');
        if (bg) bg.classList.add('hidden');
        try { if (typeof kPause === 'function') kPause(false); } catch (e) {}
      }
      const mb = document.getElementById('kMenuB');
      if (mb) mb.classList.remove('hidden');
    }
    function leaveInterior() {
      try {
        if (window.WALK_MODE && WALK_MODE.insideBuilding && typeof WALK_MODE.stepBackOutside === 'function') WALK_MODE.stepBackOutside();
      } catch (e) {}
      try { if (window.WALK_MODE) WALK_MODE.onFoot = false; } catch (e) {}
    }
    function pinFields(p) {
      P.x = p.x; P.z = p.z; P.y = p.y;
      P.yaw = p.yaw; P.hd = p.yaw; P.pitch = p.pitch || 0; P.gam = P.pitch || 0;
      P.bank = 0; P.v = p.v; P.thr = 0; P.vs = 0;
      P.ground = !!p.ground; P.wreck = null; P.stall = false;
      P.gy = p.ground ? p.y : (P.gy || 0);
      P.wings = p.wings ? 1 : 0;
      P.driveMode = p.drive || 'arcade';
    }
    function pinBase(p) {
      pinFields(p);
      try { if (typeof setWings === 'function') setWings(p.wings ? 1 : 0, true); } catch (e) {}
      try { if (typeof setDriveMode === 'function') setDriveMode(p.drive || 'arcade', true); } catch (e) {}
    }
    function ellieDoor() {
      const list = (typeof CITY !== 'undefined' && CITY.BL) || [];
      let b = null;
      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].purpose === 'HOME' && list[i].district === 'SPAWN_SOUTH') { b = list[i]; break; }
      }
      if (!b) {
        for (let i = 0; i < list.length; i++) if (list[i] && list[i].purpose === 'HOME') { b = list[i]; break; }
      }
      if (!b || !b.doors || !b.doors.length) return null;
      const door = b.doors[0];
      return { b: b, x: door[0], z: door[1], nx: door[2] || 0, nz: door[3] || 0 };
    }
    function enterHouse() {
      leaveInterior();
      wake(false);
      const d = ellieDoor();
      if (!d) return { ok: false, error: 'no HOME door on CITY.BL' };
      pinBase({
        x: d.x + d.nx * 4, z: d.z + d.nz * 4, y: 0,
        yaw: Math.atan2(-d.nx, -d.nz), v: 0, wings: 0, ground: true, drive: 'street', pitch: 0
      });
      try { paused = false; } catch (e) {}
      let ok = false;
      try { ok = !!WALK_MODE.enterDoor(); } catch (e) { return { ok: false, error: 'enterDoor ' + e.message }; }
      if (!ok || !WALK_MODE.insideBuilding) {
        try { WALK_MODE.onFoot = true; WALK_MODE.x = P.x; WALK_MODE.z = P.z; ok = !!WALK_MODE.enterDoor(); } catch (e) {}
      }
      if (!WALK_MODE.insideBuilding || (WALK_MODE.insideDoor && WALK_MODE.insideDoor.purpose !== 'HOME')) {
        return { ok: false, error: 'not inside HOME (purpose ' + ((WALK_MODE.insideDoor && WALK_MODE.insideDoor.purpose) || 'none') + ')' };
      }
      try { if (typeof walkFillTools === 'function') walkFillTools('HOME'); } catch (e) {}
      try { if (typeof walkPaintRoom === 'function') walkPaintRoom(); } catch (e) {}
      const tools = document.querySelectorAll('#walk-room-tools button').length;
      if (!tools) return { ok: false, error: 'house item menu has no buttons' };
      g.hold = null;
      return { ok: true, tools: tools };
    }
    function findCloset() {
      const marked = document.querySelector('[data-closet],[data-perf="closet"],#closet');
      if (marked) return { el: marked, hook: 'closet-node' };
      const buttons = document.querySelectorAll('button,a,[role="button"]');
      for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];
        const blob = ((b.textContent || '') + ' ' + (b.id || '') + ' ' + (b.getAttribute('aria-label') || ''));
        if (/closet|wardrobe/i.test(blob)) return { el: b, hook: 'closet-button' };
      }
      return null;
    }
    g.apply = function (id) {
      g.hook = '';
      g.hold = null;
      if (id === 'jr-shell') {
        g.hold = null;
        return { ok: true, hook: 'jr-shell' };
      }
      if (typeof P === 'undefined' || typeof CITY === 'undefined') return { ok: false, error: 'world not booted' };
      if (id === 'air') {
        leaveInterior();
        wake(false);
        pinBase({ x: 0, z: -480, y: 80, yaw: 0.35, v: 36, wings: 1, ground: false, drive: 'arcade', pitch: -0.04 });
        g.hold = function () {
          try { paused = false; flying = true; } catch (e) {}
          P.wings = 1; P.ground = false; P.wreck = null;
          if (P.y < 55 || P.y > 130) P.y = 80;
          if (P.v < 22) P.v = 36;
          if (P.z > -80) { P.z = -480; P.x = 0; }
        };
        g.hook = 'orbit-south';
        return { ok: true, hook: g.hook };
      }
      if (id === 'face') {
        leaveInterior();
        wake(false);
        const pose = { x: 452, z: 1200, y: 36, yaw: Math.PI / 2, v: 0, wings: 1, ground: false, drive: 'arcade', pitch: 0 };
        pinBase(pose);
        g.hold = function () {
          try { paused = true; flying = true; } catch (e) {}
          pinFields(pose);
        };
        g.hook = 'sky-tower-west';
        return { ok: true, hook: g.hook };
      }
      if (id === 'shops') {
        leaveInterior();
        wake(false);
        const pose = { x: 186, z: 1836, y: 8, yaw: 0, v: 0, wings: 1, ground: false, drive: 'arcade', pitch: 0 };
        pinBase(pose);
        g.hold = function () {
          try { paused = true; flying = true; } catch (e) {}
          pinFields(pose);
        };
        g.hook = 'builder-hq';
        return { ok: true, hook: g.hook };
      }
      if (id === 'drive') {
        leaveInterior();
        wake(false);
        pinBase({ x: 250, z: 1000, y: 0, yaw: 0, v: 14, wings: 0, ground: true, drive: 'street', pitch: 0 });
        g.hold = function () {
          try { paused = false; flying = true; } catch (e) {}
          P.x = 250; P.y = 0; P.ground = true; P.yaw = 0; P.hd = 0; P.pitch = 0;
          P.v = 14; P.wings = 0; P.wreck = null; P.driveMode = 'street';
          if (P.z > 1500) P.z = 1000;
        };
        g.hook = 'downtown-x250';
        return { ok: true, hook: g.hook };
      }
      if (id === 'house') {
        const entered = enterHouse();
        if (!entered.ok) return entered;
        try { if (typeof kPause === 'function') kPause(false); } catch (e) {}
        g.hook = 'room-item-menu';
        return { ok: true, hook: g.hook, tools: entered.tools };
      }
      if (id === 'closet') {
        const entered = enterHouse();
        if (!entered.ok) return entered;
        const found = findCloset();
        if (found && found.el) {
          try { found.el.click(); } catch (e) {}
          g.hook = found.hook;
          return { ok: true, hook: g.hook };
        }
        if (typeof window.openCloset === 'function') {
          try { window.openCloset(); g.hook = 'openCloset'; return { ok: true, hook: g.hook }; } catch (e) {}
        }
        try { if (typeof openGarage === 'function') openGarage('furniture'); } catch (e) {}
        try { if (typeof kPause === 'function') kPause(true); } catch (e) {}
        const home = document.getElementById('kHome');
        if (home) home.classList.remove('hidden');
        g.hook = 'furniture-drill';
        return { ok: true, hook: g.hook, note: 'no closet control on this build; furniture item list is open inside the house' };
      }
      return { ok: false, error: 'unknown scene ' + id };
    };
  })();`;
}

async function setViewport(cdp, vp) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.dpr,
    mobile: !!vp.touch
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', {
    enabled: !!vp.touch,
    maxTouchPoints: vp.touch ? 5 : 1
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: vp.cpuThrottle || 1 });
}

async function navigate(cdp, url) {
  await cdp.send('Page.navigate', { url });
}

async function waitBoot(cdp, kind) {
  const expr = kind === 'jr'
    ? '!!document.querySelector("canvas")'
    : '(function(){try{return typeof P!=="undefined" && typeof CITY!=="undefined" && !!document.getElementById("c");}catch(e){return false;}})()';
  const limit = kind === 'jr' ? 45000 : 25000;
  const t0 = Date.now();
  let lastErr = '';
  while (Date.now() - t0 < limit) {
    try {
      const ok = await evaluate(cdp, expr, 8000);
      if (ok) return true;
    } catch (e) { lastErr = e.message || String(e); }
    await sleep(200);
  }
  try {
    const info = await evaluate(cdp, 'JSON.stringify({href:location.href,ready:document.readyState,canvas:!!document.getElementById("c"),city:!!window.CITY,fly:!!window.FLY,P:(function(){try{return typeof P}catch(e){return e.message}})(),CITY:(function(){try{return typeof CITY}catch(e){return e.message}})(),flying:(function(){try{return typeof flying}catch(e){return e.message}})()})', 8000);
    let errs = '';
    try { errs = await evaluate(cdp, 'JSON.stringify((window.__perfGuard&&window.__perfGuard.errors)||[])', 8000); } catch (e) { errs = 'no guard'; }
    console.log('  boot timeout ' + info + ' errors ' + errs + (lastErr ? ' evalerr ' + lastErr.slice(0, 300) : ''));
  } catch (e) {
    console.log('  boot timeout, page eval failed: ' + (e.message || e) + (lastErr ? ' earlier ' + lastErr.slice(0, 200) : ''));
  }
  return false;
}

async function sample(cdp, mode, minFrames, minMs, maxMs) {
  const startMeta = await evaluate(cdp, 'window.__perfGuard.begin(' + JSON.stringify(mode) + ')', 10000);
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    await sleep(200);
    const n = await evaluate(cdp, 'window.__perfGuard.frames.length', 8000);
    if ((n || 0) >= minFrames && Date.now() - t0 >= minMs) break;
  }
  const end = await evaluate(cdp, 'window.__perfGuard.end()', 20000);
  return { startMeta, end };
}

async function shot(cdp, file) {
  const res = await cdp.send('Page.captureScreenshot', { format: 'png' }, 15000);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(res.data, 'base64'));
}

async function runScene(cdp, vp, scene, pageName, opts) {
  const key = vp.id + '/' + scene;
  const row = {
    key, viewport: vp.id, scene, label: SCENE_LABEL[scene] || scene,
    page: pageName
  };
  try {
    if (scene !== 'jr-shell') {
      const applied = await evaluate(cdp, 'window.__perfGuard.apply(' + JSON.stringify(scene) + ')', 20000);
      if (!applied || applied.ok === false) {
        row.error = (applied && applied.error) || 'scene did not start';
        return row;
      }
      row.hook = applied.hook || '';
      if (applied.note) row.note = applied.note;
    } else {
      row.hook = 'jr-shell';
    }
    await sleep(opts.quick ? 250 : 500);
    const minFrames = opts.quick ? 20 : 40;
    const minMs = opts.quick ? 1200 : 4000;
    const maxMs = opts.quick ? 2500 : 9000;
    const timed = await sample(cdp, 'time', minFrames, minMs, maxMs);
    const stats = frameStats(timed.end && timed.end.frames);
    if (!stats) {
      row.error = 'no frames';
      return row;
    }
    row.medianMs = stats.medianMs;
    row.low1Ms = stats.low1Ms;
    row.maxMs = stats.maxMs;
    row.frames = stats.frames;
    row.rafPerSec = timed.end.rafPerSec;
    row.rafPerFrame = timed.end.rafPerFrame;
    row.rafRaw = timed.end.rafRaw;
    row.domStart = timed.startMeta && timed.startMeta.dom;
    row.domEnd = timed.end.meta && timed.end.meta.dom;
    row.buffer = (timed.end.meta && timed.end.meta.buffer) || '';
    row.css = timed.end.meta && timed.end.meta.css;
    row.dpr = timed.end.meta && timed.end.meta.dpr;
    row.gameDpr = timed.end.meta && timed.end.meta.gameDpr;
    row.gameFps = timed.end.meta && timed.end.meta.fps;
    const flick = await sample(cdp, 'flicker', opts.quick ? 8 : 12, opts.quick ? 700 : 1600, opts.quick ? 1500 : 3000);
    row.flickerFrames = (flick.end && flick.end.flickerFrames) || 0;
    row.flickerIndex = (flick.end && flick.end.flickerIndex) || [];
    if (opts.shotDir) {
      const safe = (vp.id + '-' + scene).replace(/[^a-z0-9_-]+/gi, '');
      await shot(cdp, path.join(opts.shotDir, safe + '.png'));
    }
    console.log('  ' + key + '  median ' + row.medianMs.toFixed(1) + ' ms  1% ' + row.low1Ms.toFixed(1) +
      '  max ' + row.maxMs.toFixed(1) + '  flicker ' + row.flickerFrames + '  ' + row.buffer +
      (row.hook ? '  [' + row.hook + ']' : ''));
  } catch (e) {
    row.error = e.message || String(e);
    console.log('  ' + key + '  ERROR ' + row.error);
  }
  return row;
}

async function runHeap(cdp, vp, ms) {
  await evaluate(cdp, 'window.__perfGuard.apply("air")', 20000);
  await sleep(400);
  const samples = [];
  const step = 5000;
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    let bytes = null;
    try {
      const metrics = await cdp.send('Performance.getMetrics', {}, 10000);
      const hit = (metrics.metrics || []).find(m => m.name === 'JSHeapUsedSize');
      if (hit) bytes = hit.value;
    } catch (e) {}
    if (bytes == null) {
      try {
        bytes = await evaluate(cdp, '(performance.memory && performance.memory.usedJSHeapSize) || null', 8000);
      } catch (e) {}
    }
    if (bytes != null) samples.push({ t: Date.now() - t0, bytes });
    const left = ms - (Date.now() - t0);
    if (left <= 0) break;
    await sleep(Math.min(step, left));
  }
  const trend = heapTrend(samples);
  trend.samples = samples.map(s => ({ t: s.t, bytes: Math.round(s.bytes) }));
  trend.durationMs = Date.now() - t0;
  trend.viewport = vp.id;
  trend.scenario = 'air';
  console.log('  heap ' + vp.id + ' ' + Math.round(trend.durationMs / 1000) + 's  ' + trend.reason);
  return trend;
}

function pagesToRun(opts) {
  if (opts.page && opts.page.length) {
    return opts.page.map(p => ({
      urlPath: '/' + p.replace(/^\/+/, ''),
      name: p,
      kind: /jr\.html$/.test(p) ? 'jr' : 'world'
    }));
  }
  const worldHash = fileSha('world.html');
  const splitHash = fileSha('world-split.html');
  const pages = [{ urlPath: '/world-split.html', name: 'world-split.html', kind: 'world' }];
  if (worldHash && splitHash && worldHash !== splitHash) {
    pages.push({ urlPath: '/world.html', name: 'world.html', kind: 'world' });
  }
  pages.push({ urlPath: '/jr.html', name: 'jr.html', kind: 'jr' });
  return pages;
}

async function bench(opts) {
  const git = gitInfo();
  const host = hostInfo();
  let chromeVersion = '';
  try {
    chromeVersion = execSync(CHROME + ' --version', { encoding: 'utf8' }).trim();
  } catch (e) { chromeVersion = ''; }
  const worldHash = fileSha('world.html');
  const splitHash = fileSha('world-split.html');
  const report = {
    schemaVersion: 1,
    enforce: false,
    softwareGl: true,
    softwareGlNote: 'Headless Chrome --disable-gpu uses software GL. Milliseconds are relative to this host, not device FPS.',
    capturedAt: new Date().toISOString(),
    git,
    host: Object.assign({ chrome: chromeVersion }, host),
    viewports: VIEWPORTS,
    thresholds: { medianPct: MEDIAN_LIMIT, low1Pct: LOW1_LIMIT, flickerFrames: 0, heapSteady: true },
    pages: {
      'world.html': worldHash,
      'world-split.html': splitHash,
      sameBytes: !!(worldHash && worldHash === splitHash),
      jr: 'jr.html'
    },
    quick: !!opts.quick,
    rows: {},
    heap: null
  };

  const httpPort = await new Promise((resolve) => {
    const s = http.createServer();
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
  });
  const server = await startServer(httpPort);
  const dbg = await new Promise((resolve) => {
    const s = http.createServer();
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
  });
  const chrome = launchChrome(dbg);
  let cdp = null;
  try {
    const ver = await waitJson('http://127.0.0.1:' + dbg + '/json/version', 80);
    report.host.chrome = ver.Browser || chromeVersion;
    const list = await waitJson('http://127.0.0.1:' + dbg + '/json/list', 40);
    const page = (list || []).find(t => t.type === 'page') || list[0];
    if (!page || !page.webSocketDebuggerUrl) throw new Error('no Chrome page target');
    cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Performance.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: pageBootSource() });

    const pages = pagesToRun(opts);
    const multiWorld = pages.filter(p => p.kind === 'world').length > 1;
    const vps = (opts.viewport && opts.viewport.length ? opts.viewport : Object.keys(VIEWPORTS)).map(id => {
      const vp = VIEWPORTS[id];
      if (!vp) throw new Error('Unknown viewport ' + id);
      return vp;
    });
    const only = opts.only;

    for (const pg of pages) {
      for (const vp of vps) {
        if (pg.kind === 'jr' && vp.id !== 'phone' && !(opts.viewport && opts.viewport.length)) continue;
        console.log('— ' + pg.name + '  ' + vp.label + ' ' + vp.width + 'x' + vp.height + ' dpr' + vp.dpr +
          (vp.cpuThrottle > 1 ? ' cpu×' + vp.cpuThrottle : ''));
        await setViewport(cdp, vp);
        await navigate(cdp, 'http://127.0.0.1:' + httpPort + pg.urlPath + '?perfguard=1');
        const booted = await waitBoot(cdp, pg.kind);
        if (!booted) {
          const scenes = pg.kind === 'jr' ? ['jr-shell'] : WORLD_SCENES;
          for (const scene of scenes) {
            if (only && only.indexOf(scene) < 0) continue;
            const key = vp.id + '/' + scene + (pg.name !== 'world-split.html' && pg.kind === 'world' ? '@' + pg.name : '');
            report.rows[key] = { key, viewport: vp.id, scene, page: pg.name, error: 'page did not boot' };
            console.log('  ' + key + '  ERROR page did not boot');
          }
          continue;
        }
        await sleep(300);
        const scenes = pg.kind === 'jr' ? ['jr-shell'] : WORLD_SCENES;
        for (const scene of scenes) {
          if (only && only.indexOf(scene) < 0) continue;
          const row = await runScene(cdp, vp, scene, pg.name, opts);
          let key = vp.id + '/' + scene;
          if (multiWorld && pg.name !== 'world-split.html') key += '@' + pg.name;
          row.key = key;
          report.rows[key] = row;
        }
        const heapWanted = opts.heapMs > 0 && vp.id === opts.heapViewport && pg.kind === 'world' && (!only || only.indexOf('heap') >= 0);
        if (heapWanted && (pg.name === 'world-split.html' || pg.name === 'world.html' || (opts.page && opts.page.length === 1))) {
          console.log('— heap flight ' + Math.round(opts.heapMs / 1000) + 's on ' + vp.id);
          report.heap = await runHeap(cdp, vp, opts.heapMs);
        }
      }
    }
    if (!report.heap) {
      report.heap = { steady: false, reason: 'heap not run', durationMs: 0, viewport: '', samples: [] };
    }
  } finally {
    if (cdp) cdp.close();
    try { chrome.child.kill('SIGKILL'); } catch (e) {}
    server.close();
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
  }
  return report;
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function slim(report) {
  const rows = {};
  for (const key of Object.keys(report.rows || {})) {
    const r = report.rows[key];
    rows[key] = {
      viewport: r.viewport,
      scene: r.scene,
      label: r.label,
      page: r.page,
      medianMs: round(r.medianMs, 2),
      low1Ms: round(r.low1Ms, 2),
      maxMs: round(r.maxMs, 2),
      frames: r.frames,
      flickerFrames: r.flickerFrames || 0,
      domStart: r.domStart ?? null,
      domEnd: r.domEnd ?? null,
      rafPerSec: round(r.rafPerSec, 2),
      rafPerFrame: round(r.rafPerFrame, 2),
      buffer: r.buffer || '',
      css: r.css || '',
      dpr: r.dpr ?? null,
      gameDpr: r.gameDpr ?? null,
      hook: r.hook || '',
      note: r.note || '',
      error: r.error || ''
    };
  }
  const heap = report.heap || { steady: false, reason: 'heap not run', samples: [] };
  return {
    schemaVersion: 1,
    enforce: report.enforce === true,
    enforceNote: 'Set true after FPS PR #56 merges and this file is refreshed with --write-baseline. While false, PERF-GUARD comments on PRs and does not fail the check.',
    rebaselineAfter: 'PR #56 (flicker, Galaxy pacing, iPad scale). PR #59 is the WebGL prototype and is not the default renderer.',
    softwareGl: true,
    softwareGlNote: report.softwareGlNote,
    capturedAt: report.capturedAt,
    git: report.git,
    host: report.host,
    viewports: {
      phone: { width: 844, height: 390, dpr: 2, cpuThrottle: 1, touch: true },
      ipad: { width: 1024, height: 768, dpr: 2, cpuThrottle: 4, touch: true, note: 'CPU throttle ×4 stands in for an A10. The game may still cap the iPad buffer at DPR 1; buffer is recorded per row.' },
      pc: { width: 1280, height: 720, dpr: 1, cpuThrottle: 1, touch: false }
    },
    thresholds: report.thresholds,
    pages: report.pages,
    quick: !!report.quick,
    rows,
    heap: {
      viewport: heap.viewport || '',
      scenario: heap.scenario || 'air',
      durationMs: heap.durationMs || 0,
      steady: !!heap.steady,
      reason: heap.reason || '',
      first: heap.first || null,
      mid: heap.mid || null,
      last: heap.last || null,
      samples: heap.samples || []
    }
  };
}

function exitFor(judged, baseline, opts) {
  if (opts.measure) return 0;
  const enforce = !!(baseline && baseline.enforce === true);
  if (opts.strict || enforce) return judged.fails > 0 ? 1 : 0;
  return 0;
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) { help(); return; }
  if (opts.selfTest) { selfTest(); return; }
  if (opts.compare) {
    const a = loadJson(opts.compare[0]);
    const b = loadJson(opts.compare[1]);
    const judged = compareRuns(b, a, opts);
    b.baselineEnforce = a.enforce === true;
    b.baselineSha = a.git && a.git.sha;
    printTable(b, judged);
    const md = markdownReport(b, judged, opts);
    if (opts.commentMd) {
      fs.mkdirSync(path.dirname(opts.commentMd), { recursive: true });
      fs.writeFileSync(opts.commentMd, md);
    }
    process.exit(exitFor(judged, a, opts));
  }

  if (opts.writeBaseline && opts.heapMs < 170000 && !opts.allowShortBaseline) {
    console.error('Refusing to write a baseline with a heap flight under 3 minutes. Use a full run, or pass --allow-short-baseline for a scratch file.');
    process.exit(2);
  }

  console.log('PERF-GUARD  ' + (opts.quick ? 'quick ' : '') + (opts.measure ? 'measure ' : '') + 'heap ' + opts.heapMs + 'ms');
  console.log('Software GL numbers are relative, not device FPS.');
  const report = await bench(opts);
  let previousEnforce = false;
  if (opts.writeBaseline && fs.existsSync(opts.baseline)) {
    try { previousEnforce = loadJson(opts.baseline).enforce === true; } catch (e) { previousEnforce = false; }
  }
  report.enforce = opts.writeBaseline ? previousEnforce : false;
  const body = slim(report);

  let baseline = null;
  if (!opts.writeBaseline && fs.existsSync(opts.baseline)) baseline = loadJson(opts.baseline);
  const judged = compareRuns(body, baseline, opts);
  body.baselineEnforce = baseline ? baseline.enforce === true : (opts.writeBaseline ? previousEnforce : false);
  body.baselineSha = baseline && baseline.git ? baseline.git.sha : (opts.writeBaseline ? body.git && body.git.sha : '');
  if (opts.writeBaseline) body.enforce = previousEnforce;

  printTable(body, judged);
  const md = markdownReport(body, judged, opts);
  if (opts.commentMd) {
    fs.mkdirSync(path.dirname(opts.commentMd), { recursive: true });
    fs.writeFileSync(opts.commentMd, md);
  }
  if (opts.out) {
    fs.mkdirSync(path.dirname(opts.out), { recursive: true });
    fs.writeFileSync(opts.out, JSON.stringify(body, null, 2));
    console.log('wrote ' + opts.out);
  }
  if (opts.writeBaseline) {
    fs.mkdirSync(path.dirname(opts.baseline), { recursive: true });
    fs.writeFileSync(opts.baseline, JSON.stringify(body, null, 2));
    console.log('wrote baseline ' + opts.baseline + ' (enforce ' + body.enforce + ')');
  }
  const code = opts.writeBaseline ? 0 : exitFor(judged, baseline, opts);
  if (!opts.writeBaseline && !baseline) {
    console.error('No baseline at ' + opts.baseline + '. Run --write-baseline on main.');
  }
  console.log(judged.fails ? (judged.fails + ' failing row(s)') : 'no failing rows');
  process.exit(code);
}

main().catch((e) => {
  console.error(e && e.stack || e);
  process.exit(1);
});
