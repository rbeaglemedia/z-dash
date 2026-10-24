/* Locks the humanoid priorities: head on the neck, limbs on the right joints, planted feet. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(parts) {
  const store = {};
  if (parts) {
    store['zdash.char.v1'] = JSON.stringify({
      v: 2, gender: 'female', parts: parts,
      colors: { skin: '#f2c7a5', hair: '#3a2418', top: '#ff3df2', bottom: '#2a6fdb', shoes: '#fff', hands: '#f2c7a5', eye: '#3ee6ff' },
      outfits: []
    });
  }
  const sandbox = {
    console: console,
    localStorage: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
      setItem: function (k, v) { store[k] = String(v); }
    },
    performance: { now: function () { return 0; } },
    URLSearchParams: URLSearchParams
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../shared/char-closet.js'), 'utf8'), sandbox, { filename: 'char-closet.js' });
  return sandbox.CHARCLOSET;
}

function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }
function screenX(p, yaw) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const xr = p[0] * c + p[2] * s, zr = -p[0] * s + p[2] * c;
  return xr / (2.7 - zr);
}
function torsoSpan(J, yaw) {
  const keys = ['chestFL', 'chestFR', 'chestBR', 'chestBL', 'bellyFL', 'bellyFR', 'bellyBR', 'bellyBL', 'hipFL', 'hipFR', 'hipBR', 'hipBL'];
  let min = 99, max = -99;
  keys.forEach(function (k) {
    const x = screenX(J[k], yaw);
    if (x < min) min = x;
    if (x > max) max = x;
  });
  return max - min;
}
function fail(msg) { console.error('FAIL ' + msg); process.exitCode = 1; }
function near(a, b, eps, msg) {
  if (Math.abs(a - b) > eps) fail(msg + ' got ' + a + ' want ' + b);
}

function check(label, api) {
  const m = api.metrics().m;
  const reach = m.thigh + m.shin - 0.001;
  let bobMin = 99, bobMax = -99, liftMaxL = 0, liftMaxR = 0;
  for (let i = 0; i <= 48; i++) {
    const phase = i / 48;
    const J = api.joints('walk', phase);
    const headGapNow = dist(J.head, J.neck);
    if (Math.abs(J.head[0] - J.neck[0]) > 0.004) fail(label + ' head x off neck at ' + phase);
    if (J.head[1] <= J.neck[1]) fail(label + ' head not above neck at ' + phase);
    if (Math.abs(headGapNow - m.headR) > 0.004) fail(label + ' head not centered on neck radius at ' + phase + ' d=' + headGapNow);
    [['L', 'shoulderL', 'elbowL', 'wristL', 'handL', m.uarm, m.farm, m.hand], ['R', 'shoulderR', 'elbowR', 'wristR', 'handR', m.uarm, m.farm, m.hand]].forEach(function (row) {
      const sh = J[row[1]], el = J[row[2]], wr = J[row[3]], hd = J[row[4]];
      near(dist(sh, el), row[5], 0.004, label + ' upper arm ' + row[0] + ' @' + phase);
      near(dist(el, wr), row[6], 0.004, label + ' forearm ' + row[0] + ' @' + phase);
      near(dist(wr, hd), row[7], 0.004, label + ' hand ' + row[0] + ' @' + phase);
      if (dist(el, hd) <= dist(el, wr) + 0.02) fail(label + ' hand not past wrist ' + row[0] + ' @' + phase);
      if (hd[1] >= sh[1] - 0.02) fail(label + ' hand not below shoulder ' + row[0] + ' @' + phase);
    });
    if (J.handL[0] > -0.04) fail(label + ' left hand crossed in @' + phase + ' x=' + J.handL[0]);
    if (J.handR[0] < 0.04) fail(label + ' right hand crossed in @' + phase + ' x=' + J.handR[0]);
    [['L', 'hipL', 'kneeL', 'ankleL'], ['R', 'hipR', 'kneeR', 'ankleR']].forEach(function (row) {
      const hip = J[row[1]], kn = J[row[2]], an = J[row[3]];
      near(dist(hip, kn), m.thigh, 0.004, label + ' thigh ' + row[0] + ' @' + phase);
      near(dist(kn, an), m.shin, 0.004, label + ' shin ' + row[0] + ' @' + phase);
      if (kn[1] >= hip[1]) fail(label + ' knee not below hip ' + row[0]);
      if (an[1] >= kn[1]) fail(label + ' ankle not below knee ' + row[0]);
      if (dist(hip, an) > reach + 0.002) fail(label + ' leg over-reached ' + row[0] + ' @' + phase);
    });
    const bottomL = J.soleL[1] - m.shoeR;
    const bottomR = J.soleR[1] - m.shoeR;
    if (bottomL < -0.001 || bottomR < -0.001) fail(label + ' sole below ground @' + phase);
    if (J.plantedL) near(bottomL, 0, 0.001, label + ' planted left sole @' + phase);
    if (J.plantedR) near(bottomR, 0, 0.001, label + ' planted right sole @' + phase);
    if (!J.plantedL && bottomL > liftMaxL) liftMaxL = bottomL;
    if (!J.plantedR && bottomR > liftMaxR) liftMaxR = bottomR;
    near(J.soleL[2] + phase * api.stride, api.worldSoleZ(phase, 'L'), 0.002, label + ' left world sole @' + phase);
    near(J.soleR[2] + phase * api.stride, api.worldSoleZ(phase, 'R'), 0.002, label + ' right world sole @' + phase);
    const footLead = J.ankleL[2] - J.ankleR[2];
    const handLead = J.handL[2] - J.handR[2];
    if (Math.abs(footLead) > 0.03 && footLead * handLead >= 0) fail(label + ' arms not opposite legs @' + phase + ' foot ' + footLead + ' hand ' + handLead);
    bobMin = Math.min(bobMin, J.head[1]);
    bobMax = Math.max(bobMax, J.head[1]);
    if (dist(J.chestF, J.chestB) < m.torsoR * 1.3) fail(label + ' chest has no depth @' + phase);
    if (dist(J.bellyF, J.bellyB) < dist(J.chestF, J.chestB)) fail(label + ' belly thinner than chest @' + phase);
    if (!(J.neckBase[1] < J.neck[1] && J.neck[1] < J.head[1])) fail(label + ' neck does not join head and torso @' + phase);
    if (Math.abs(J.neckBase[0]) > 0.01 || Math.abs(J.neck[0]) > 0.01) fail(label + ' neck off center @' + phase);
    if (dist(J.neckBase, J.neck) < 0.03) fail(label + ' neck too short @' + phase);
    const hipSideL = [(J.hipFL[0] + J.hipBL[0]) * 0.5, (J.hipFL[1] + J.hipBL[1]) * 0.5, (J.hipFL[2] + J.hipBL[2]) * 0.5];
    const hipSideR = [(J.hipFR[0] + J.hipBR[0]) * 0.5, (J.hipFR[1] + J.hipBR[1]) * 0.5, (J.hipFR[2] + J.hipBR[2]) * 0.5];
    if (dist(hipSideL, J.hipL) > 0.02 || dist(hipSideR, J.hipR) > 0.02) fail(label + ' hips not on the torso @' + phase);
    if (dist(J.shoulderL, J.chestFL) > m.torsoR * 1.2 && dist(J.shoulderL, J.chestBL) > m.torsoR * 1.2) fail(label + ' left arm not on the torso @' + phase);
    ['front', 'three', 'side', 'back'].forEach(function (name, yi) {
      const yaw = [0, 0.65, Math.PI / 2, Math.PI][yi];
      const span = torsoSpan(J, yaw);
      if (span < 0.045) fail(label + ' torso flat at ' + name + ' @' + phase + ' span ' + span);
    });
    const sideSpan = torsoSpan(J, Math.PI / 2);
    const frontSpan = torsoSpan(J, 0);
    if (sideSpan < frontSpan * 0.65) fail(label + ' side torso thinner than the front @' + phase);
  }
  const bob = bobMax - bobMin;
  if (bob < 0.006 || bob > 0.04) fail(label + ' bob out of range ' + bob);
  if (liftMaxL < 0.03 || liftMaxR < 0.03) fail(label + ' swing lift too small L ' + liftMaxL + ' R ' + liftMaxR);
  const leftMark = api.worldSoleZ(0, 'L');
  for (let p = 0; p <= 0.6; p += 0.05) near(api.worldSoleZ(p, 'L'), leftMark, 0.0005, label + ' left plant slide @' + p);
  const rightMark = api.worldSoleZ(0.5, 'R');
  for (let p = 0.5; p <= 1.1; p += 0.05) near(api.worldSoleZ(p, 'R'), rightMark, 0.0005, label + ' right plant slide @' + p);
  const idle = api.joints('idle', 0.2);
  near(idle.soleL[1] - m.shoeR, 0, 0.001, label + ' idle left foot');
  near(idle.soleR[1] - m.shoeR, 0, 0.001, label + ' idle right foot');
  if (Math.abs(idle.head[0] - idle.neck[0]) > 0.004) fail(label + ' idle head off center');
  console.log('ok ' + label + ' bob ' + bob.toFixed(3) + ' head/height ' + api.heightRatio().toFixed(3));
}

const standard = load(null);
check('standard', standard);
const outfits = standard.wear().outfits.map(function (o) { return o.id; });
if (outfits.join(',') !== 'everyday,sunny') fail('starter looks ' + outfits.join(','));
check('short', load({ body: 'short', hair: 'bob', top: 'tee', bottom: 'shorts', shoes: 'sneakers', hands: 'mittens' }));
check('boots', load({ body: 'standard', hair: 'long', top: 'hoodie', bottom: 'jeans', shoes: 'boots', hands: 'gloves' }));
if (!process.exitCode) console.log('anatomy check passed');
