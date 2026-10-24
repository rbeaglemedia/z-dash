/* Planner-port proof viewer.
   Stand-in geometry only. The private planner repo was not readable,
   so nothing here is copied from event-space-planner.
   One instanced box draw. No shadowBlur. One 256×144 canvas texture. */
'use strict';

import { bakeBuilding, drawParts } from './bake.js';
import { place, screen, sofa, table, tvStand, speaker, trussSeg, ledTrailer, remix } from './catalog.js';

const params = new URLSearchParams(location.search);
const sceneId = params.get('scene') || 'house';
const shot = params.get('shot') === '1';

const glCanvas = document.getElementById('view');
const caption = document.getElementById('cap');
const banner = document.getElementById('banner');
if (shot) document.body.classList.add('shot');

const gl = glCanvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
if (!gl) {
  banner.textContent = 'WebGL unavailable in this browser.';
  throw new Error('no webgl');
}
const ext = gl.getExtension('ANGLE_instanced_arrays');
if (!ext) throw new Error('no instancing');

const VS = `
attribute vec3 aPos;
attribute vec3 aN;
attribute vec2 aUv;
attribute vec3 iCen;
attribute vec3 iSize;
attribute vec3 iRot;
attribute vec3 iCol;
uniform mat4 uView;
uniform mat4 uProj;
varying vec3 vCol;
varying vec3 vN;
varying vec2 vUv;
varying float vMode;
void main() {
  float cy = cos(iRot.x), sy = sin(iRot.x);
  float cp = cos(iRot.y), sp = sin(iRot.y);
  vec3 p = aPos * iSize;
  vec3 n = aN;
  float y1 = cp * p.y - sp * p.z;
  float z1 = sp * p.y + cp * p.z;
  p = vec3(p.x, y1, z1);
  y1 = cp * n.y - sp * n.z;
  z1 = sp * n.y + cp * n.z;
  n = vec3(n.x, y1, z1);
  float x2 = cy * p.x + sy * p.z;
  float z2 = -sy * p.x + cy * p.z;
  p = vec3(x2, p.y, z2) + iCen;
  x2 = cy * n.x + sy * n.z;
  z2 = -sy * n.x + cy * n.z;
  n = vec3(x2, n.y, z2);
  gl_Position = uProj * uView * vec4(p, 1.0);
  vCol = iCol;
  vN = n;
  vUv = aUv;
  vMode = iRot.z;
}`;

const FS = `
precision mediump float;
varying vec3 vCol;
varying vec3 vN;
varying vec2 vUv;
varying float vMode;
uniform sampler2D uVid;
uniform float uVidOn;
void main() {
  vec3 L = normalize(vec3(0.25, 0.9, 0.35));
  float lit = 0.62 + 0.38 * max(0.0, dot(normalize(vN), L));
  vec3 col = vCol * lit;
  if (vMode > 1.5 && uVidOn > 0.5 && vUv.x + vUv.y > 0.01) col = texture2D(uVid, vUv).rgb;
  else if (vMode > 0.5) col = vCol;
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
const prog = gl.createProgram();
gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);

function boxGeom() {
  const pos = [], nrm = [], uv = [];
  const faces = [
    [[0.5, 0, 0], [0, 0, -0.5], [0, 0.5, 0]],
    [[-0.5, 0, 0], [0, 0, 0.5], [0, 0.5, 0]],
    [[0, 0.5, 0], [0.5, 0, 0], [0, 0, 0.5]],
    [[0, -0.5, 0], [0.5, 0, 0], [0, 0, -0.5]],
    [[0, 0, 0.5], [0.5, 0, 0], [0, 0.5, 0]],
    [[0, 0, -0.5], [-0.5, 0, 0], [0, 0.5, 0]]
  ];
  faces.forEach((f, fi) => {
    const [o, u, v] = f;
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
    corners.forEach(([a, b]) => {
      pos.push(o[0] + u[0] * a + v[0] * b, o[1] + u[1] * a + v[1] * b, o[2] + u[2] * a + v[2] * b);
      nrm.push(o[0] * 2, o[1] * 2, o[2] * 2);
      if (fi === 4) uv.push((a + 1) / 2, (b + 1) / 2);
      else uv.push(0, 0);
    });
  });
  return { pos: new Float32Array(pos), nrm: new Float32Array(nrm), uv: new Float32Array(uv), count: pos.length / 3 };
}
const geom = boxGeom();

function bindAttr(loc, buf, size, stride, offset, div) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
  ext.vertexAttribDivisorANGLE(loc, div);
}
const bPos = gl.createBuffer();
const bN = gl.createBuffer();
const bUv = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bPos);
gl.bufferData(gl.ARRAY_BUFFER, geom.pos, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, bN);
gl.bufferData(gl.ARRAY_BUFFER, geom.nrm, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, bUv);
gl.bufferData(gl.ARRAY_BUFFER, geom.uv, gl.STATIC_DRAW);
bindAttr(gl.getAttribLocation(prog, 'aPos'), bPos, 3, 0, 0, 0);
bindAttr(gl.getAttribLocation(prog, 'aN'), bN, 3, 0, 0, 0);
bindAttr(gl.getAttribLocation(prog, 'aUv'), bUv, 2, 0, 0, 0);

const iBuf = gl.createBuffer();
const stride = 12 * 4;
bindAttr(gl.getAttribLocation(prog, 'iCen'), iBuf, 3, stride, 0, 1);
bindAttr(gl.getAttribLocation(prog, 'iSize'), iBuf, 3, stride, 12, 1);
bindAttr(gl.getAttribLocation(prog, 'iRot'), iBuf, 3, stride, 24, 1);
bindAttr(gl.getAttribLocation(prog, 'iCol'), iBuf, 3, stride, 36, 1);

const uView = gl.getUniformLocation(prog, 'uView');
const uProj = gl.getUniformLocation(prog, 'uProj');
const uVidOn = gl.getUniformLocation(prog, 'uVidOn');

const vid = document.createElement('canvas');
vid.width = 256;
vid.height = 144;
const vctx = vid.getContext('2d');
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

let loopKind = 'cyan';
let videoEl = null;
let videoUploads = 0;
let videoPaused = false;

function paintLoop(t) {
  const g = vctx;
  if (loopKind === 'dance') {
    g.fillStyle = '#140818';
    g.fillRect(0, 0, 256, 144);
    for (let i = 0; i < 8; i++) {
      const h = 30 + Math.abs(Math.sin(t * 3 + i)) * 90;
      g.fillStyle = i % 2 ? '#ff4fd8' : '#3ee6ff';
      g.fillRect(12 + i * 30, 130 - h, 18, h);
    }
  } else if (loopKind === 'magenta') {
    g.fillStyle = '#2a0a22';
    g.fillRect(0, 0, 256, 144);
    g.fillStyle = '#ff4fd8';
    g.fillRect(18, 28, 220, 88);
    g.fillStyle = '#fff';
    g.font = '700 28px sans-serif';
    g.fillText('LOOP', 86, 82);
  } else {
    g.fillStyle = '#062028';
    g.fillRect(0, 0, 256, 144);
    g.fillStyle = '#3ee6ff';
    const x = (t * 80) % 280 - 20;
    g.fillRect(x, 36, 70, 72);
    g.fillStyle = '#7dff6b';
    g.fillRect(0, 118, 256, 8);
  }
}

function drawVideoToTexture(t, allow) {
  if (videoEl && videoEl.readyState >= 2 && !videoEl.paused) {
    vctx.drawImage(videoEl, 0, 0, 256, 144);
  } else {
    paintLoop(t);
  }
  if (!allow) { videoPaused = true; return; }
  videoPaused = false;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vid);
  videoUploads++;
}

document.getElementById('loops').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b || !b.dataset.loop) return;
  loopKind = b.dataset.loop;
  if (videoEl) { videoEl.pause(); videoEl.src = ''; videoEl = null; }
});
document.getElementById('file').addEventListener('change', (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  if (videoEl) { videoEl.pause(); URL.revokeObjectURL(videoEl.src); }
  videoEl = document.createElement('video');
  videoEl.muted = true;
  videoEl.loop = true;
  videoEl.playsInline = true;
  videoEl.src = URL.createObjectURL(file);
  videoEl.play().catch(() => {});
});

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function norm(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function lookAt(eye, target) {
  const f = norm(sub(target, eye));
  const s = norm(cross(f, [0, 1, 0]));
  const u = cross(s, f);
  return new Float32Array([
    s[0], s[1], s[2], 0,
    u[0], u[1], u[2], 0,
    -f[0], -f[1], -f[2], 0,
    -dot(s, eye), -dot(u, eye), dot(f, eye), 1
  ]);
}
function persp(fov, aspect, n, f) {
  const t = 1 / Math.tan(fov / 2);
  const nf = 1 / (n - f);
  return new Float32Array([
    t / aspect, 0, 0, 0,
    0, t, 0, 0,
    0, 0, (f + n) * nf, -1,
    0, 0, 2 * f * n * nf, 0
  ]);
}

function houseParts() {
  const parts = [];
  parts.push({ x: 0, y: -0.06, z: 0, sx: 24, sy: 0.12, sz: 18, yaw: 0, pitch: 0, r: 0.86, g: 0.75, b: 0.58, mode: 0 });
  parts.push({ x: 0, y: 4.8, z: 0, sx: 24, sy: 0.1, sz: 18, yaw: 0, pitch: 0, r: 0.96, g: 0.96, b: 0.94, mode: 0 });
  const wall = (x, y, z, sx, sy, sz) => parts.push({ x, y, z, sx, sy, sz, yaw: 0, pitch: 0, r: 0.97, g: 0.96, b: 0.93, mode: 0 });
  wall(0, 2.4, 9, 24, 4.8, 0.16);
  wall(-12, 2.4, 0, 0.16, 4.8, 18);
  wall(12, 2.4, 0, 0.16, 4.8, 18);
  for (let i = 0; i < 4; i++) {
    parts.push({ x: -9 + i * 6, y: 2.5, z: -9, sx: 5.2, sy: 4.2, sz: 0.06, yaw: 0, pitch: 0, r: 0.72, g: 0.9, b: 0.94, mode: 0 });
  }
  parts.push({ x: 0, y: 4.62, z: -8.55, sx: 22, sy: 0.08, sz: 0.12, yaw: 0, pitch: 0, r: 0.24, g: 0.9, b: 1, mode: 1 });
  place(parts, sofa({ w: 2.4, color: '#f4efe6' }), -3.2, 0, 1.2, 0);
  place(parts, table({ w: 1.15, d: 0.65, color: '#e7d3b4' }), -3.1, 0, 2.5, 0);
  place(parts, [
    { x: 0, y: 0.12, z: 0, sx: 0.9, sy: 0.18, sz: 0.7, yaw: 0, pitch: 0, r: 0.55, g: 0.85, b: 0.7, mode: 0 }
  ], -6.5, 0, -5.5, 0);
  place(parts, tvStand({ w: 1.4, h: 0.48, video: true, glow: '#3ee6ff' }), 4.6, 0, 2.4, Math.PI);
  place(parts, screen({ w: 3.2, h: 1.8, color: '#1b1e26', glow: '#3ee6ff', video: false }), 11.7, 1.3, -1, -Math.PI / 2);
  place(parts, speaker({ glow: '#ff4fd8' }), 8.2, 0, 6.2, Math.PI);
  place(parts, [
    { x: 0, y: 0.35, z: 0, sx: 0.7, sy: 0.7, sz: 0.7, yaw: 0, pitch: 0, r: 0.45, g: 0.62, b: 0.4, mode: 0 },
    { x: 0, y: 0.9, z: 0, sx: 0.9, sy: 0.5, sz: 0.9, yaw: 0, pitch: 0, r: 0.35, g: 0.65, b: 0.38, mode: 0 }
  ], 7.5, 0, -6.2, 0);
  // Scale only. Not the crew rig. Ellie 1.7 m to the top of the head. Pet 0.74 m.
  place(parts, [
    { x: 0, y: 0.85, z: 0, sx: 0.38, sy: 0.9, sz: 0.22, yaw: 0, pitch: 0, r: 1, g: 0.31, b: 0.85, mode: 0 },
    { x: 0, y: 1.55, z: 0, sx: 0.28, sy: 0.3, sz: 0.28, yaw: 0, pitch: 0, r: 0.94, g: 0.78, b: 0.66, mode: 0 }
  ], -1.1, 0, 3.4, 0);
  place(parts, [
    { x: 0, y: 0.28, z: 0, sx: 0.5, sy: 0.36, sz: 0.72, yaw: 0, pitch: 0, r: 1, g: 0.69, b: 0.13, mode: 0 },
    { x: 0.22, y: 0.62, z: 0, sx: 0.24, sy: 0.24, sz: 0.24, yaw: 0, pitch: 0, r: 1, g: 0.69, b: 0.13, mode: 0 }
  ], -5.6, 0, -4.2, 0);
  return parts;
}

function propParts() {
  const parts = [];
  parts.push({ x: 0, y: -0.05, z: 0, sx: 16, sy: 0.08, sz: 8, yaw: 0, pitch: 0, r: 0.9, g: 0.92, b: 0.94, mode: 0 });
  place(parts, screen({ w: 1.6, h: 0.9, glow: '#3ee6ff', video: true }), -6, 0.4, 0, 0);
  place(parts, sofa({}), -3.2, 0, 0, 0);
  place(parts, table({}), -0.6, 0, 0, 0);
  place(parts, tvStand({ video: false, glow: '#7dff6b' }), 2.2, 0, 0, 0);
  place(parts, speaker({ glow: '#ff4fd8' }), 4.4, 0, 0, 0);
  place(parts, trussSeg({ len: 1.6 }), 6.2, 0.2, 0, 0);
  return parts;
}

function carBoxes(yaw) {
  const body = '#1aa6c8', glass = '#9fd8ea';
  return [
    { x: 0, y: 0.48, z: 0.15, sx: 1.85, sy: 0.48, sz: 4.25, yaw, pitch: 0, r: 0.1, g: 0.65, b: 0.78, mode: 0 },
    { x: 0, y: 0.95, z: -0.15, sx: 1.65, sy: 0.42, sz: 1.7, yaw, pitch: 0, r: 0.62, g: 0.85, b: 0.92, mode: 0 },
    { x: 0.75, y: 0.28, z: 1.25, sx: 0.42, sy: 0.42, sz: 0.42, yaw, pitch: 0, r: 0.12, g: 0.13, b: 0.15, mode: 0 },
    { x: -0.75, y: 0.28, z: 1.25, sx: 0.42, sy: 0.42, sz: 0.42, yaw, pitch: 0, r: 0.12, g: 0.13, b: 0.15, mode: 0 },
    { x: 0.75, y: 0.28, z: -1.25, sx: 0.42, sy: 0.42, sz: 0.42, yaw, pitch: 0, r: 0.12, g: 0.13, b: 0.15, mode: 0 },
    { x: -0.75, y: 0.28, z: -1.25, sx: 0.42, sy: 0.42, sz: 0.42, yaw, pitch: 0, r: 0.12, g: 0.13, b: 0.15, mode: 0 }
  ].map((p) => {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    return Object.assign({}, p, { x: p.x * c + p.z * s, z: -p.x * s + p.z * c, sx: p.sx, sy: p.sy, sz: p.sz });
  }).concat([]);
}

const rig = { x: 0, z: 0, yaw: 0, y: 0, v: 7, tyaw: 0.4, tx: 0, tz: -4, detached: false, air: false };
function wrap(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
function stepRig(dt) {
  if (!rig.air) {
    rig.yaw += Math.sin(performance.now() / 1000 * 0.55) * 0.7 * dt;
    rig.x += Math.sin(rig.yaw) * rig.v * dt;
    rig.z += Math.cos(rig.yaw) * rig.v * dt;
  } else {
    rig.y = Math.min(8, rig.y + dt * 4);
  }
  const rear = 2.2;
  const hx = rig.x - Math.sin(rig.yaw) * rear;
  const hz = rig.z - Math.cos(rig.yaw) * rear;
  const L = 3.4;
  const ang = wrap(rig.yaw - rig.tyaw);
  if (rig.air || rig.y > 0.4 || Math.abs(ang) > 1.15) rig.detached = true;
  if (!rig.detached) {
    rig.tyaw += (rig.v / L) * Math.sin(ang) * dt;
    rig.tx = hx - Math.sin(rig.tyaw) * L;
    rig.tz = hz - Math.cos(rig.tyaw) * L;
  }
}
function trailerParts() {
  const parts = [];
  parts.push({ x: 0, y: -0.04, z: 0, sx: 40, sy: 0.06, sz: 40, yaw: 0, pitch: 0, r: 0.75, g: 0.82, b: 0.78, mode: 0 });
  const c = Math.cos(rig.yaw), s = Math.sin(rig.yaw);
  carBoxes(0).forEach((p) => {
    const x = p.x * c + p.z * s + rig.x;
    const z = -p.x * s + p.z * c + rig.z;
    parts.push(Object.assign({}, p, { x, y: p.y + rig.y, z, yaw: p.yaw + rig.yaw }));
  });
  place(parts, ledTrailer({ video: !rig.detached, glow: '#3ee6ff', color: '#f4f1ea' }), rig.tx, 0, rig.tz, rig.tyaw);
  if (!rig.detached) {
    const hx = rig.x - Math.sin(rig.yaw) * 2.2;
    const hz = rig.z - Math.cos(rig.yaw) * 2.2;
    parts.push({ x: (hx + rig.tx) / 2, y: 0.45, z: (hz + rig.tz) / 2, sx: 0.08, sy: 0.08, sz: 1.3, yaw: rig.tyaw, pitch: 0, r: 0.7, g: 0.72, b: 0.75, mode: 0 });
  }
  return parts;
}

let shellParts = [];
let staticParts = null;
let cam = { eye: [18, 12, 22], target: [6, 2, 3], fov: 0.7 };
let title = '';

function frameCam(parts, pad) {
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  parts.forEach((p) => {
    minX = Math.min(minX, p.x - p.sx / 2); maxX = Math.max(maxX, p.x + p.sx / 2);
    minY = Math.min(minY, p.y - p.sy / 2); maxY = Math.max(maxY, p.y + p.sy / 2);
    minZ = Math.min(minZ, p.z - p.sz / 2); maxZ = Math.max(maxZ, p.z + p.sz / 2);
  });
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
  const sx = maxX - minX, sy = maxY - minY, sz = maxZ - minZ;
  const dist = Math.max(sx, sy, sz) * (pad || 0.95);
  return { eye: [cx + dist * 0.85, cy + dist * 0.42, cz + dist * 0.95], target: [cx, cy, cz], fov: 0.62 };
}

async function boot() {
  if (sceneId === 'house') {
    staticParts = houseParts();
    cam = { eye: [0.2, 1.7, 6.2], target: [0.4, 1.5, -1.5], fov: 0.95 };
    title = "Ellie's house — glass, one cyan strip, stand-in furniture and a screen";
  } else if (sceneId === 'props') {
    staticParts = propParts();
    cam = frameCam(staticParts, 1.15);
    title = 'Stand-in props: screen, sofa, table, TV stand, speaker, truss';
  } else if (sceneId === 'shell') {
    const doc = await (await fetch('planner-port/shell.json')).json();
    shellParts = drawParts(bakeBuilding(doc));
    staticParts = shellParts;
    cam = { eye: [20, 11, 20], target: [7, 2.4, 3.2], fov: 0.7 };
    title = 'Exported shell: walls, door, windows, flat roof, pitch, dome, canopy';
  } else if (sceneId === 'remix') {
    const id = params.get('remix') || 'food-truck';
    const local = remix(id);
    cam = frameCam(local, 1.25);
    cam.eye[1] = Math.max(cam.eye[1] * 0.72, cam.target[1] + 1.4);
    const ground = { x: cam.target[0], y: -0.04, z: cam.target[2], sx: 28, sy: 0.06, sz: 20, yaw: 0, pitch: 0, r: 0.86, g: 0.9, b: 0.88, mode: 0 };
    staticParts = local.concat([ground]);
    title = 'Remix: ' + id;
  } else if (sceneId === 'remix-row') {
    const ids = ['food-truck', 'welcome-gate', 'ticket-booth', 'speaker-tower', 'snack-counter'];
    const parts = [];
    ids.forEach((id, i) => {
      const local = remix(id);
      local.forEach((p) => parts.push(Object.assign({}, p, { x: p.x + i * 16 })));
    });
    parts.push({ x: 32, y: -0.05, z: 0, sx: 90, sy: 0.08, sz: 20, yaw: 0, pitch: 0, r: 0.86, g: 0.9, b: 0.88, mode: 0 });
    staticParts = parts;
    cam = frameCam(parts, 0.85);
    title = 'Five remixes, one shared box mesh';
  } else if (sceneId === 'trailer') {
    title = rig.air ? 'Trailer detached before flight' : '370Z towing the LED trailer';
    cam = { eye: [10, 6, 12], target: [0, 1, 0], fov: 0.7 };
  } else if (sceneId === 'budget') {
    const parts = houseParts().map((p) => Object.assign({}, p, { x: p.x - 30 }));
    const doc = await (await fetch('planner-port/shell.json')).json();
    drawParts(bakeBuilding(doc)).forEach((p) => parts.push(p));
    ['food-truck', 'welcome-gate', 'ticket-booth', 'speaker-tower', 'snack-counter'].forEach((id, i) => {
      remix(id).forEach((p) => parts.push(Object.assign({}, p, { x: p.x + 24 + i * 14, z: p.z - 16 })));
    });
    staticParts = parts;
    cam = frameCam(parts, 0.7);
    title = 'Budget frame: house + shell + five remixes';
  }
  caption.textContent = title;
  requestAnimationFrame(loop);
}

document.getElementById('air').addEventListener('click', () => {
  rig.air = !rig.air;
  if (!rig.air) { rig.y = 0; rig.detached = false; }
});

let frame = 0;
let last = performance.now();
const samples = [];
const rafHeavy = [];
let heavyPending = false;
let draws = 0;

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = glCanvas.clientWidth || innerWidth;
  const h = glCanvas.clientHeight || innerHeight;
  const W = Math.max(2, Math.floor(w * dpr));
  const H = Math.max(2, Math.floor(h * dpr));
  if (glCanvas.width !== W || glCanvas.height !== H) {
    glCanvas.width = W; glCanvas.height = H;
  }
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
}

function upload(parts) {
  const data = new Float32Array(parts.length * 12);
  parts.forEach((p, i) => {
    const o = i * 12;
    data[o] = p.x; data[o + 1] = p.y; data[o + 2] = p.z;
    data[o + 3] = p.sx; data[o + 4] = p.sy; data[o + 5] = p.sz;
    data[o + 6] = p.yaw || 0; data[o + 7] = p.pitch || 0; data[o + 8] = p.mode || 0;
    data[o + 9] = p.r; data[o + 10] = p.g; data[o + 11] = p.b;
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, iBuf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  return parts.length;
}

function loop(now) {
  const rawMs = now - last;
  const dt = Math.min(0.05, rawMs / 1000);
  last = now;
  if (heavyPending) { rafHeavy.push(rawMs); heavyPending = false; }
  frame++;
  resize();
  if (sceneId === 'trailer') {
    if (shot) {
      rig.x = 0; rig.z = 0; rig.y = 0; rig.yaw = 0.55; rig.air = false; rig.detached = false;
      const rear = 2.2, L = 3.4;
      const hx = rig.x - Math.sin(rig.yaw) * rear;
      const hz = rig.z - Math.cos(rig.yaw) * rear;
      rig.tyaw = 0.12;
      rig.tx = hx - Math.sin(rig.tyaw) * L;
      rig.tz = hz - Math.cos(rig.tyaw) * L;
    } else {
      stepRig(dt);
    }
    const parts = trailerParts();
    const follow = [(rig.x + rig.tx) / 2, 1.1, (rig.z + rig.tz) / 2];
    cam.eye = [follow[0] + 8, 4.2, follow[2] + 9];
    cam.target = follow;
    staticParts = parts;
    caption.textContent = rig.detached ? 'Detached — trailer stays, car climbs' : 'Attached — hitch pivot, trailer follows the turn';
  }
  const parts = staticParts || [];
  const hasVideo = parts.some((p) => p.mode === 2);
  const costMean = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
  const low = samples.length >= 5 && costMean > 14;
  if (frame % 2 === 0) drawVideoToTexture(now / 1000, hasVideo && !low && !document.hidden);
  gl.uniform1f(uVidOn, hasVideo && !videoPaused ? 1 : 0);
  const n = upload(parts);
  const aspect = glCanvas.width / Math.max(1, glCanvas.height);
  gl.uniformMatrix4fv(uView, false, lookAt(cam.eye, cam.target));
  gl.uniformMatrix4fv(uProj, false, persp(cam.fov, aspect, 0.15, 400));
  gl.clearColor(0.78, 0.88, 0.93, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  draws = 0;
  if (n && !(frame > 30 && samples.length < 5)) {
    ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, geom.count, n);
    draws = 1;
  }
  if (frame > 30 && samples.length < 5 && n) {
    const nRep = 40;
    const tCost = performance.now();
    for (let i = 0; i < nRep; i++) ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, geom.count, n);
    gl.finish();
    samples.push((performance.now() - tCost) / nRep);
    heavyPending = rafHeavy.length < 5;
    draws = 1;
  }
  const fps = samples.length ? Math.round(1000 / (samples.reduce((a, b) => a + b, 0) / samples.length)) : 0;
  window.__PROOF = {
    scene: sceneId,
    remix: params.get('remix') || '',
    instances: n,
    draws,
    tris: n * geom.count / 3,
    videoUploads,
    videoPaused: videoPaused || !hasVideo,
    videoRes: '256x144',
    samples: samples.slice(),
    rafHeavy: rafHeavy.slice(),
    meanMs: samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0,
    rafMs: dt * 1000,
    fps,
    ready: samples.length >= 5 && rafHeavy.length >= 5,
    standIn: true,
    detached: rig.detached,
    dpr: window.devicePixelRatio || 1,
    css: [glCanvas.clientWidth, glCanvas.clientHeight],
    buffer: [glCanvas.width, glCanvas.height]
  };
  const read = document.getElementById('read');
  if (read) read.textContent = n + ' instances · ' + draws + ' draw · ' + (samples.length ? (window.__PROOF.meanMs.toFixed(2) + ' ms') : '…');
  requestAnimationFrame(loop);
}

gl.enable(gl.DEPTH_TEST);
boot().catch((err) => {
  banner.textContent = 'Proof failed to start: ' + err.message;
  window.__PROOF = { ready: false, error: String(err) };
});
