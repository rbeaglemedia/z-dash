import {
  GLTFLoader
} from "./chunk-FN4W576G.js";
import {
  applyEq,
  boneWorld,
  cloneMaterials,
  createStage,
  findBone,
  lookSnapshot,
  scanFinite,
  scanMaps,
  setWire,
  stamp
} from "./chunk-W4X5YMVY.js";
import {
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  Bone,
  Box3,
  BoxGeometry,
  BufferGeometry,
  ClampToEdgeWrapping,
  Color,
  ColorManagement,
  ConeGeometry,
  Curve,
  CylinderGeometry,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Euler,
  FileLoader,
  Float32BufferAttribute,
  GUI,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Loader,
  LoaderUtils,
  MathUtils,
  Matrix3,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  NumberKeyframeTrack,
  Object3D,
  PerspectiveCamera,
  PointLight,
  PropertyBinding,
  Quaternion,
  QuaternionKeyframeTrack,
  RepeatWrapping,
  SRGBColorSpace,
  ShapeUtils,
  Skeleton,
  SkinnedMesh,
  SphereGeometry,
  SpotLight,
  Texture,
  TextureLoader,
  Uint16BufferAttribute,
  Vector2,
  Vector3,
  Vector4,
  VectorKeyframeTrack,
  clear,
  devUrl,
  el,
  fetchJson,
  readFavs,
  repoUrl,
  shotLabel,
  writeFav
} from "./chunk-BZ6ZX5PL.js";

// ../tmp/viewer-deps/node_modules/three/examples/jsm/libs/fflate.module.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var zls = function(d, dict) {
  if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
    err(6, "invalid zlib data");
  if ((d[1] >> 5 & 1) == +!dict)
    err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
  return (d[1] >> 3 & 4) + 2;
};
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}

// ../tmp/viewer-deps/node_modules/three/examples/jsm/curves/NURBSUtils.js
function findSpan(p, u, U) {
  const n = U.length - p - 1;
  if (u >= U[n]) {
    return n - 1;
  }
  if (u <= U[p]) {
    return p;
  }
  let low = p;
  let high = n;
  let mid = Math.floor((low + high) / 2);
  while (u < U[mid] || u >= U[mid + 1]) {
    if (u < U[mid]) {
      high = mid;
    } else {
      low = mid;
    }
    mid = Math.floor((low + high) / 2);
  }
  return mid;
}
function calcBasisFunctions(span, u, p, U) {
  const N = [];
  const left = [];
  const right = [];
  N[0] = 1;
  for (let j = 1; j <= p; ++j) {
    left[j] = u - U[span + 1 - j];
    right[j] = U[span + j] - u;
    let saved = 0;
    for (let r = 0; r < j; ++r) {
      const rv = right[r + 1];
      const lv = left[j - r];
      const temp = N[r] / (rv + lv);
      N[r] = saved + rv * temp;
      saved = lv * temp;
    }
    N[j] = saved;
  }
  return N;
}
function calcBSplinePoint(p, U, P, u) {
  const span = findSpan(p, u, U);
  const N = calcBasisFunctions(span, u, p, U);
  const C = new Vector4(0, 0, 0, 0);
  for (let j = 0; j <= p; ++j) {
    const point = P[span - p + j];
    const Nj = N[j];
    const wNj = point.w * Nj;
    C.x += point.x * wNj;
    C.y += point.y * wNj;
    C.z += point.z * wNj;
    C.w += point.w * Nj;
  }
  return C;
}
function calcBasisFunctionDerivatives(span, u, p, n, U) {
  const zeroArr = [];
  for (let i2 = 0; i2 <= p; ++i2)
    zeroArr[i2] = 0;
  const ders = [];
  for (let i2 = 0; i2 <= n; ++i2)
    ders[i2] = zeroArr.slice(0);
  const ndu = [];
  for (let i2 = 0; i2 <= p; ++i2)
    ndu[i2] = zeroArr.slice(0);
  ndu[0][0] = 1;
  const left = zeroArr.slice(0);
  const right = zeroArr.slice(0);
  for (let j = 1; j <= p; ++j) {
    left[j] = u - U[span + 1 - j];
    right[j] = U[span + j] - u;
    let saved = 0;
    for (let r2 = 0; r2 < j; ++r2) {
      const rv = right[r2 + 1];
      const lv = left[j - r2];
      ndu[j][r2] = rv + lv;
      const temp = ndu[r2][j - 1] / ndu[j][r2];
      ndu[r2][j] = saved + rv * temp;
      saved = lv * temp;
    }
    ndu[j][j] = saved;
  }
  for (let j = 0; j <= p; ++j) {
    ders[0][j] = ndu[j][p];
  }
  for (let r2 = 0; r2 <= p; ++r2) {
    let s1 = 0;
    let s2 = 1;
    const a = [];
    for (let i2 = 0; i2 <= p; ++i2) {
      a[i2] = zeroArr.slice(0);
    }
    a[0][0] = 1;
    for (let k = 1; k <= n; ++k) {
      let d = 0;
      const rk = r2 - k;
      const pk = p - k;
      if (r2 >= k) {
        a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
        d = a[s2][0] * ndu[rk][pk];
      }
      const j1 = rk >= -1 ? 1 : -rk;
      const j2 = r2 - 1 <= pk ? k - 1 : p - r2;
      for (let j3 = j1; j3 <= j2; ++j3) {
        a[s2][j3] = (a[s1][j3] - a[s1][j3 - 1]) / ndu[pk + 1][rk + j3];
        d += a[s2][j3] * ndu[rk + j3][pk];
      }
      if (r2 <= pk) {
        a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r2];
        d += a[s2][k] * ndu[r2][pk];
      }
      ders[k][r2] = d;
      const j = s1;
      s1 = s2;
      s2 = j;
    }
  }
  let r = p;
  for (let k = 1; k <= n; ++k) {
    for (let j = 0; j <= p; ++j) {
      ders[k][j] *= r;
    }
    r *= p - k;
  }
  return ders;
}
function calcBSplineDerivatives(p, U, P, u, nd) {
  const du = nd < p ? nd : p;
  const CK = [];
  const span = findSpan(p, u, U);
  const nders = calcBasisFunctionDerivatives(span, u, p, du, U);
  const Pw = [];
  for (let i2 = 0; i2 < P.length; ++i2) {
    const point = P[i2].clone();
    const w = point.w;
    point.x *= w;
    point.y *= w;
    point.z *= w;
    Pw[i2] = point;
  }
  for (let k = 0; k <= du; ++k) {
    const point = Pw[span - p].clone().multiplyScalar(nders[k][0]);
    for (let j = 1; j <= p; ++j) {
      point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));
    }
    CK[k] = point;
  }
  for (let k = du + 1; k <= nd + 1; ++k) {
    CK[k] = new Vector4(0, 0, 0);
  }
  return CK;
}
function calcKoverI(k, i2) {
  let nom = 1;
  for (let j = 2; j <= k; ++j) {
    nom *= j;
  }
  let denom = 1;
  for (let j = 2; j <= i2; ++j) {
    denom *= j;
  }
  for (let j = 2; j <= k - i2; ++j) {
    denom *= j;
  }
  return nom / denom;
}
function calcRationalCurveDerivatives(Pders) {
  const nd = Pders.length;
  const Aders = [];
  const wders = [];
  for (let i2 = 0; i2 < nd; ++i2) {
    const point = Pders[i2];
    Aders[i2] = new Vector3(point.x, point.y, point.z);
    wders[i2] = point.w;
  }
  const CK = [];
  for (let k = 0; k < nd; ++k) {
    const v = Aders[k].clone();
    for (let i2 = 1; i2 <= k; ++i2) {
      v.sub(CK[k - i2].clone().multiplyScalar(calcKoverI(k, i2) * wders[i2]));
    }
    CK[k] = v.divideScalar(wders[0]);
  }
  return CK;
}
function calcNURBSDerivatives(p, U, P, u, nd) {
  const Pders = calcBSplineDerivatives(p, U, P, u, nd);
  return calcRationalCurveDerivatives(Pders);
}

// ../tmp/viewer-deps/node_modules/three/examples/jsm/curves/NURBSCurve.js
var NURBSCurve = class extends Curve {
  constructor(degree, knots, controlPoints, startKnot, endKnot) {
    super();
    const knotsLength = knots ? knots.length - 1 : 0;
    const pointsLength = controlPoints ? controlPoints.length : 0;
    this.degree = degree;
    this.knots = knots;
    this.controlPoints = [];
    this.startKnot = startKnot || 0;
    this.endKnot = endKnot || knotsLength;
    for (let i2 = 0; i2 < pointsLength; ++i2) {
      const point = controlPoints[i2];
      this.controlPoints[i2] = new Vector4(point.x, point.y, point.z, point.w);
    }
  }
  getPoint(t, optionalTarget = new Vector3()) {
    const point = optionalTarget;
    const u = this.knots[this.startKnot] + t * (this.knots[this.endKnot] - this.knots[this.startKnot]);
    const hpoint = calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);
    if (hpoint.w !== 1) {
      hpoint.divideScalar(hpoint.w);
    }
    return point.set(hpoint.x, hpoint.y, hpoint.z);
  }
  getTangent(t, optionalTarget = new Vector3()) {
    const tangent = optionalTarget;
    const u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
    const ders = calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
    tangent.copy(ders[1]).normalize();
    return tangent;
  }
  toJSON() {
    const data = super.toJSON();
    data.degree = this.degree;
    data.knots = [...this.knots];
    data.controlPoints = this.controlPoints.map((p) => p.toArray());
    data.startKnot = this.startKnot;
    data.endKnot = this.endKnot;
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.degree = json.degree;
    this.knots = [...json.knots];
    this.controlPoints = json.controlPoints.map((p) => new Vector4(p[0], p[1], p[2], p[3]));
    this.startKnot = json.startKnot;
    this.endKnot = json.endKnot;
    return this;
  }
};

// ../tmp/viewer-deps/node_modules/three/examples/jsm/loaders/FBXLoader.js
var fbxTree;
var connections;
var sceneGraph;
var FBXLoader = class extends Loader {
  constructor(manager) {
    super(manager);
  }
  load(url, onLoad, onProgress, onError) {
    const scope = this;
    const path = scope.path === "" ? LoaderUtils.extractUrlBase(url) : scope.path;
    const loader = new FileLoader(this.manager);
    loader.setPath(scope.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(scope.requestHeader);
    loader.setWithCredentials(scope.withCredentials);
    loader.load(url, function(buffer) {
      try {
        onLoad(scope.parse(buffer, path));
      } catch (e) {
        if (onError) {
          onError(e);
        } else {
          console.error(e);
        }
        scope.manager.itemError(url);
      }
    }, onProgress, onError);
  }
  parse(FBXBuffer, path) {
    if (isFbxFormatBinary(FBXBuffer)) {
      fbxTree = new BinaryParser().parse(FBXBuffer);
    } else {
      const FBXText = convertArrayBufferToString(FBXBuffer);
      if (!isFbxFormatASCII(FBXText)) {
        throw new Error("THREE.FBXLoader: Unknown format.");
      }
      if (getFbxVersion(FBXText) < 7e3) {
        throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + getFbxVersion(FBXText));
      }
      fbxTree = new TextParser().parse(FBXText);
    }
    const textureLoader = new TextureLoader(this.manager).setPath(this.resourcePath || path).setCrossOrigin(this.crossOrigin);
    return new FBXTreeParser(textureLoader, this.manager).parse(fbxTree);
  }
};
var FBXTreeParser = class {
  constructor(textureLoader, manager) {
    this.textureLoader = textureLoader;
    this.manager = manager;
  }
  parse() {
    connections = this.parseConnections();
    const images = this.parseImages();
    const textures = this.parseTextures(images);
    const materials = this.parseMaterials(textures);
    const deformers = this.parseDeformers();
    const geometryMap = new GeometryParser().parse(deformers);
    this.parseScene(deformers, geometryMap, materials);
    return sceneGraph;
  }
  // Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
  // and details the connection type
  parseConnections() {
    const connectionMap = /* @__PURE__ */ new Map();
    if ("Connections" in fbxTree) {
      const rawConnections = fbxTree.Connections.connections;
      rawConnections.forEach(function(rawConnection) {
        const fromID = rawConnection[0];
        const toID = rawConnection[1];
        const relationship = rawConnection[2];
        if (!connectionMap.has(fromID)) {
          connectionMap.set(fromID, {
            parents: [],
            children: []
          });
        }
        const parentRelationship = { ID: toID, relationship };
        connectionMap.get(fromID).parents.push(parentRelationship);
        if (!connectionMap.has(toID)) {
          connectionMap.set(toID, {
            parents: [],
            children: []
          });
        }
        const childRelationship = { ID: fromID, relationship };
        connectionMap.get(toID).children.push(childRelationship);
      });
    }
    return connectionMap;
  }
  // Parse FBXTree.Objects.Video for embedded image data
  // These images are connected to textures in FBXTree.Objects.Textures
  // via FBXTree.Connections.
  parseImages() {
    const images = {};
    const blobs = {};
    if ("Video" in fbxTree.Objects) {
      const videoNodes = fbxTree.Objects.Video;
      for (const nodeID in videoNodes) {
        const videoNode = videoNodes[nodeID];
        const id = parseInt(nodeID);
        images[id] = videoNode.RelativeFilename || videoNode.Filename;
        if ("Content" in videoNode) {
          const arrayBufferContent = videoNode.Content instanceof ArrayBuffer && videoNode.Content.byteLength > 0;
          const base64Content = typeof videoNode.Content === "string" && videoNode.Content !== "";
          if (arrayBufferContent || base64Content) {
            const image = this.parseImage(videoNodes[nodeID]);
            blobs[videoNode.RelativeFilename || videoNode.Filename] = image;
          }
        }
      }
    }
    for (const id in images) {
      const filename = images[id];
      if (blobs[filename] !== void 0) images[id] = blobs[filename];
      else images[id] = images[id].split("\\").pop();
    }
    return images;
  }
  // Parse embedded image data in FBXTree.Video.Content
  parseImage(videoNode) {
    const content = videoNode.Content;
    const fileName = videoNode.RelativeFilename || videoNode.Filename;
    const extension = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
    let type;
    switch (extension) {
      case "bmp":
        type = "image/bmp";
        break;
      case "jpg":
      case "jpeg":
        type = "image/jpeg";
        break;
      case "png":
        type = "image/png";
        break;
      case "tif":
        type = "image/tiff";
        break;
      case "tga":
        if (this.manager.getHandler(".tga") === null) {
          console.warn("FBXLoader: TGA loader not found, skipping ", fileName);
        }
        type = "image/tga";
        break;
      default:
        console.warn('FBXLoader: Image type "' + extension + '" is not supported.');
        return;
    }
    if (typeof content === "string") {
      return "data:" + type + ";base64," + content;
    } else {
      const array = new Uint8Array(content);
      return window.URL.createObjectURL(new Blob([array], { type }));
    }
  }
  // Parse nodes in FBXTree.Objects.Texture
  // These contain details such as UV scaling, cropping, rotation etc and are connected
  // to images in FBXTree.Objects.Video
  parseTextures(images) {
    const textureMap = /* @__PURE__ */ new Map();
    if ("Texture" in fbxTree.Objects) {
      const textureNodes = fbxTree.Objects.Texture;
      for (const nodeID in textureNodes) {
        const texture = this.parseTexture(textureNodes[nodeID], images);
        textureMap.set(parseInt(nodeID), texture);
      }
    }
    return textureMap;
  }
  // Parse individual node in FBXTree.Objects.Texture
  parseTexture(textureNode, images) {
    const texture = this.loadTexture(textureNode, images);
    texture.ID = textureNode.id;
    texture.name = textureNode.attrName;
    const wrapModeU = textureNode.WrapModeU;
    const wrapModeV = textureNode.WrapModeV;
    const valueU = wrapModeU !== void 0 ? wrapModeU.value : 0;
    const valueV = wrapModeV !== void 0 ? wrapModeV.value : 0;
    texture.wrapS = valueU === 0 ? RepeatWrapping : ClampToEdgeWrapping;
    texture.wrapT = valueV === 0 ? RepeatWrapping : ClampToEdgeWrapping;
    if ("Scaling" in textureNode) {
      const values = textureNode.Scaling.value;
      texture.repeat.x = values[0];
      texture.repeat.y = values[1];
    }
    if ("Translation" in textureNode) {
      const values = textureNode.Translation.value;
      texture.offset.x = values[0];
      texture.offset.y = values[1];
    }
    return texture;
  }
  // load a texture specified as a blob or data URI, or via an external URL using TextureLoader
  loadTexture(textureNode, images) {
    const nonNativeExtensions = /* @__PURE__ */ new Set(["tga", "tif", "tiff", "exr", "dds", "hdr", "ktx2"]);
    const extension = textureNode.FileName.split(".").pop().toLowerCase();
    const loader = nonNativeExtensions.has(extension) ? this.manager.getHandler(`.${extension}`) : this.textureLoader;
    if (!loader) {
      console.warn(
        `FBXLoader: ${extension.toUpperCase()} loader not found, creating placeholder texture for`,
        textureNode.RelativeFilename
      );
      return new Texture();
    }
    const loaderPath = loader.path;
    if (!loaderPath) {
      loader.setPath(this.textureLoader.path);
    }
    const children = connections.get(textureNode.id).children;
    let fileName;
    if (children !== void 0 && children.length > 0 && images[children[0].ID] !== void 0) {
      fileName = images[children[0].ID];
      if (fileName.indexOf("blob:") === 0 || fileName.indexOf("data:") === 0) {
        loader.setPath(void 0);
      }
    }
    const texture = loader.load(fileName);
    loader.setPath(loaderPath);
    return texture;
  }
  // Parse nodes in FBXTree.Objects.Material
  parseMaterials(textureMap) {
    const materialMap = /* @__PURE__ */ new Map();
    if ("Material" in fbxTree.Objects) {
      const materialNodes = fbxTree.Objects.Material;
      for (const nodeID in materialNodes) {
        const material = this.parseMaterial(materialNodes[nodeID], textureMap);
        if (material !== null) materialMap.set(parseInt(nodeID), material);
      }
    }
    return materialMap;
  }
  // Parse single node in FBXTree.Objects.Material
  // Materials are connected to texture maps in FBXTree.Objects.Textures
  // FBX format currently only supports Lambert and Phong shading models
  parseMaterial(materialNode, textureMap) {
    const ID = materialNode.id;
    const name = materialNode.attrName;
    let type = materialNode.ShadingModel;
    if (typeof type === "object") {
      type = type.value;
    }
    if (!connections.has(ID)) return null;
    const parameters = this.parseParameters(materialNode, textureMap, ID);
    let material;
    switch (type.toLowerCase()) {
      case "phong":
        material = new MeshPhongMaterial();
        break;
      case "lambert":
        material = new MeshLambertMaterial();
        break;
      default:
        console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type);
        material = new MeshPhongMaterial();
        break;
    }
    material.setValues(parameters);
    material.name = name;
    return material;
  }
  // Parse FBX material and return parameters suitable for a three.js material
  // Also parse the texture map and return any textures associated with the material
  parseParameters(materialNode, textureMap, ID) {
    const parameters = {};
    if (materialNode.BumpFactor) {
      parameters.bumpScale = materialNode.BumpFactor.value;
    }
    if (materialNode.Diffuse) {
      parameters.color = ColorManagement.toWorkingColorSpace(new Color().fromArray(materialNode.Diffuse.value), SRGBColorSpace);
    } else if (materialNode.DiffuseColor && (materialNode.DiffuseColor.type === "Color" || materialNode.DiffuseColor.type === "ColorRGB")) {
      parameters.color = ColorManagement.toWorkingColorSpace(new Color().fromArray(materialNode.DiffuseColor.value), SRGBColorSpace);
    }
    if (materialNode.DisplacementFactor) {
      parameters.displacementScale = materialNode.DisplacementFactor.value;
    }
    if (materialNode.Emissive) {
      parameters.emissive = ColorManagement.toWorkingColorSpace(new Color().fromArray(materialNode.Emissive.value), SRGBColorSpace);
    } else if (materialNode.EmissiveColor && (materialNode.EmissiveColor.type === "Color" || materialNode.EmissiveColor.type === "ColorRGB")) {
      parameters.emissive = ColorManagement.toWorkingColorSpace(new Color().fromArray(materialNode.EmissiveColor.value), SRGBColorSpace);
    }
    if (materialNode.EmissiveFactor) {
      parameters.emissiveIntensity = parseFloat(materialNode.EmissiveFactor.value);
    }
    parameters.opacity = 1 - (materialNode.TransparencyFactor ? parseFloat(materialNode.TransparencyFactor.value) : 0);
    if (parameters.opacity === 1 || parameters.opacity === 0) {
      parameters.opacity = materialNode.Opacity ? parseFloat(materialNode.Opacity.value) : null;
      if (parameters.opacity === null) {
        parameters.opacity = 1 - (materialNode.TransparentColor ? parseFloat(materialNode.TransparentColor.value[0]) : 0);
      }
    }
    if (parameters.opacity < 1) {
      parameters.transparent = true;
    }
    if (materialNode.ReflectionFactor) {
      parameters.reflectivity = materialNode.ReflectionFactor.value;
    }
    if (materialNode.Shininess) {
      parameters.shininess = materialNode.Shininess.value;
    }
    if (materialNode.Specular) {
      parameters.specular = ColorManagement.toWorkingColorSpace(new Color().fromArray(materialNode.Specular.value), SRGBColorSpace);
    } else if (materialNode.SpecularColor && materialNode.SpecularColor.type === "Color") {
      parameters.specular = ColorManagement.toWorkingColorSpace(new Color().fromArray(materialNode.SpecularColor.value), SRGBColorSpace);
    }
    const scope = this;
    connections.get(ID).children.forEach(function(child) {
      const type = child.relationship;
      switch (type) {
        case "Bump":
          parameters.bumpMap = scope.getTexture(textureMap, child.ID);
          break;
        case "Maya|TEX_ao_map":
          parameters.aoMap = scope.getTexture(textureMap, child.ID);
          break;
        case "DiffuseColor":
        case "Maya|TEX_color_map":
          parameters.map = scope.getTexture(textureMap, child.ID);
          if (parameters.map !== void 0) {
            parameters.map.colorSpace = SRGBColorSpace;
          }
          break;
        case "DisplacementColor":
          parameters.displacementMap = scope.getTexture(textureMap, child.ID);
          break;
        case "EmissiveColor":
          parameters.emissiveMap = scope.getTexture(textureMap, child.ID);
          if (parameters.emissiveMap !== void 0) {
            parameters.emissiveMap.colorSpace = SRGBColorSpace;
          }
          break;
        case "NormalMap":
        case "Maya|TEX_normal_map":
          parameters.normalMap = scope.getTexture(textureMap, child.ID);
          break;
        case "ReflectionColor":
          parameters.envMap = scope.getTexture(textureMap, child.ID);
          if (parameters.envMap !== void 0) {
            parameters.envMap.mapping = EquirectangularReflectionMapping;
            parameters.envMap.colorSpace = SRGBColorSpace;
          }
          break;
        case "SpecularColor":
          parameters.specularMap = scope.getTexture(textureMap, child.ID);
          if (parameters.specularMap !== void 0) {
            parameters.specularMap.colorSpace = SRGBColorSpace;
          }
          break;
        case "TransparentColor":
        case "TransparencyFactor":
          parameters.alphaMap = scope.getTexture(textureMap, child.ID);
          parameters.transparent = true;
          break;
        case "AmbientColor":
        case "ShininessExponent":
        // AKA glossiness map
        case "SpecularFactor":
        // AKA specularLevel
        case "VectorDisplacementColor":
        // NOTE: Seems to be a copy of DisplacementColor
        default:
          console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.", type);
          break;
      }
    });
    return parameters;
  }
  // get a texture from the textureMap for use by a material.
  getTexture(textureMap, id) {
    if ("LayeredTexture" in fbxTree.Objects && id in fbxTree.Objects.LayeredTexture) {
      console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.");
      id = connections.get(id).children[0].ID;
    }
    return textureMap.get(id);
  }
  // Parse nodes in FBXTree.Objects.Deformer
  // Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
  // Generates map of Skeleton-like objects for use later when generating and binding skeletons.
  parseDeformers() {
    const skeletons = {};
    const morphTargets = {};
    if ("Deformer" in fbxTree.Objects) {
      const DeformerNodes = fbxTree.Objects.Deformer;
      for (const nodeID in DeformerNodes) {
        const deformerNode = DeformerNodes[nodeID];
        const relationships = connections.get(parseInt(nodeID));
        if (deformerNode.attrType === "Skin") {
          const skeleton = this.parseSkeleton(relationships, DeformerNodes);
          skeleton.ID = nodeID;
          if (relationships.parents.length > 1) console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported.");
          skeleton.geometryID = relationships.parents[0].ID;
          skeletons[nodeID] = skeleton;
        } else if (deformerNode.attrType === "BlendShape") {
          const morphTarget = {
            id: nodeID
          };
          morphTarget.rawTargets = this.parseMorphTargets(relationships, DeformerNodes);
          morphTarget.id = nodeID;
          if (relationships.parents.length > 1) console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported.");
          morphTargets[nodeID] = morphTarget;
        }
      }
    }
    return {
      skeletons,
      morphTargets
    };
  }
  // Parse single nodes in FBXTree.Objects.Deformer
  // The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
  // Each skin node represents a skeleton and each cluster node represents a bone
  parseSkeleton(relationships, deformerNodes) {
    const rawBones = [];
    relationships.children.forEach(function(child) {
      const boneNode = deformerNodes[child.ID];
      if (boneNode.attrType !== "Cluster") return;
      const rawBone = {
        ID: child.ID,
        indices: [],
        weights: [],
        transformLink: new Matrix4().fromArray(boneNode.TransformLink.a)
        // transform: new Matrix4().fromArray( boneNode.Transform.a ),
        // linkMode: boneNode.Mode,
      };
      if ("Indexes" in boneNode) {
        rawBone.indices = boneNode.Indexes.a;
        rawBone.weights = boneNode.Weights.a;
      }
      rawBones.push(rawBone);
    });
    return {
      rawBones,
      bones: []
    };
  }
  // The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
  parseMorphTargets(relationships, deformerNodes) {
    const rawMorphTargets = [];
    for (let i2 = 0; i2 < relationships.children.length; i2++) {
      const child = relationships.children[i2];
      const morphTargetNode = deformerNodes[child.ID];
      const rawMorphTarget = {
        name: morphTargetNode.attrName,
        initialWeight: morphTargetNode.DeformPercent,
        id: morphTargetNode.id,
        fullWeights: morphTargetNode.FullWeights.a
      };
      if (morphTargetNode.attrType !== "BlendShapeChannel") return;
      rawMorphTarget.geoID = connections.get(parseInt(child.ID)).children.filter(function(child2) {
        return child2.relationship === void 0;
      })[0].ID;
      rawMorphTargets.push(rawMorphTarget);
    }
    return rawMorphTargets;
  }
  // create the main Group() to be returned by the loader
  parseScene(deformers, geometryMap, materialMap) {
    sceneGraph = new Group();
    const modelMap = this.parseModels(deformers.skeletons, geometryMap, materialMap);
    const modelNodes = fbxTree.Objects.Model;
    const scope = this;
    modelMap.forEach(function(model) {
      const modelNode = modelNodes[model.ID];
      scope.setLookAtProperties(model, modelNode);
      const parentConnections = connections.get(model.ID).parents;
      parentConnections.forEach(function(connection) {
        const parent = modelMap.get(connection.ID);
        if (parent !== void 0) parent.add(model);
      });
      if (model.parent === null) {
        sceneGraph.add(model);
      }
    });
    this.bindSkeleton(deformers.skeletons, geometryMap, modelMap);
    this.addGlobalSceneSettings();
    sceneGraph.traverse(function(node) {
      if (node.userData.transformData) {
        if (node.parent) {
          node.userData.transformData.parentMatrix = node.parent.matrix;
          node.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;
        }
        const transform = generateTransform(node.userData.transformData);
        node.applyMatrix4(transform);
        node.updateWorldMatrix();
      }
    });
    const animations = new AnimationParser().parse();
    if (sceneGraph.children.length === 1 && sceneGraph.children[0].isGroup) {
      sceneGraph.children[0].animations = animations;
      sceneGraph = sceneGraph.children[0];
    }
    sceneGraph.animations = animations;
  }
  // parse nodes in FBXTree.Objects.Model
  parseModels(skeletons, geometryMap, materialMap) {
    const modelMap = /* @__PURE__ */ new Map();
    const modelNodes = fbxTree.Objects.Model;
    for (const nodeID in modelNodes) {
      const id = parseInt(nodeID);
      const node = modelNodes[nodeID];
      const relationships = connections.get(id);
      let model = this.buildSkeleton(relationships, skeletons, id, node.attrName);
      if (!model) {
        switch (node.attrType) {
          case "Camera":
            model = this.createCamera(relationships);
            break;
          case "Light":
            model = this.createLight(relationships);
            break;
          case "Mesh":
            model = this.createMesh(relationships, geometryMap, materialMap);
            break;
          case "NurbsCurve":
            model = this.createCurve(relationships, geometryMap);
            break;
          case "LimbNode":
          case "Root":
            model = new Bone();
            break;
          case "Null":
          default:
            model = new Group();
            break;
        }
        model.name = node.attrName ? PropertyBinding.sanitizeNodeName(node.attrName) : "";
        model.userData.originalName = node.attrName;
        model.ID = id;
      }
      this.getTransformData(model, node);
      modelMap.set(id, model);
    }
    return modelMap;
  }
  buildSkeleton(relationships, skeletons, id, name) {
    let bone2 = null;
    relationships.parents.forEach(function(parent) {
      for (const ID in skeletons) {
        const skeleton = skeletons[ID];
        skeleton.rawBones.forEach(function(rawBone, i2) {
          if (rawBone.ID === parent.ID) {
            const subBone = bone2;
            bone2 = new Bone();
            bone2.matrixWorld.copy(rawBone.transformLink);
            bone2.name = name ? PropertyBinding.sanitizeNodeName(name) : "";
            bone2.userData.originalName = name;
            bone2.ID = id;
            skeleton.bones[i2] = bone2;
            if (subBone !== null) {
              bone2.add(subBone);
            }
          }
        });
      }
    });
    return bone2;
  }
  // create a PerspectiveCamera or OrthographicCamera
  createCamera(relationships) {
    let model;
    let cameraAttribute;
    relationships.children.forEach(function(child) {
      const attr = fbxTree.Objects.NodeAttribute[child.ID];
      if (attr !== void 0) {
        cameraAttribute = attr;
      }
    });
    if (cameraAttribute === void 0) {
      model = new Object3D();
    } else {
      let type = 0;
      if (cameraAttribute.CameraProjectionType !== void 0 && cameraAttribute.CameraProjectionType.value === 1) {
        type = 1;
      }
      let nearClippingPlane = 1;
      if (cameraAttribute.NearPlane !== void 0) {
        nearClippingPlane = cameraAttribute.NearPlane.value / 1e3;
      }
      let farClippingPlane = 1e3;
      if (cameraAttribute.FarPlane !== void 0) {
        farClippingPlane = cameraAttribute.FarPlane.value / 1e3;
      }
      let width = window.innerWidth;
      let height = window.innerHeight;
      if (cameraAttribute.AspectWidth !== void 0 && cameraAttribute.AspectHeight !== void 0) {
        width = cameraAttribute.AspectWidth.value;
        height = cameraAttribute.AspectHeight.value;
      }
      const aspect = width / height;
      let fov = 45;
      if (cameraAttribute.FieldOfView !== void 0) {
        fov = cameraAttribute.FieldOfView.value;
      }
      const focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;
      switch (type) {
        case 0:
          model = new PerspectiveCamera(fov, aspect, nearClippingPlane, farClippingPlane);
          if (focalLength !== null) model.setFocalLength(focalLength);
          break;
        case 1:
          console.warn("THREE.FBXLoader: Orthographic cameras not supported yet.");
          model = new Object3D();
          break;
        default:
          console.warn("THREE.FBXLoader: Unknown camera type " + type + ".");
          model = new Object3D();
          break;
      }
    }
    return model;
  }
  // Create a DirectionalLight, PointLight or SpotLight
  createLight(relationships) {
    let model;
    let lightAttribute;
    relationships.children.forEach(function(child) {
      const attr = fbxTree.Objects.NodeAttribute[child.ID];
      if (attr !== void 0) {
        lightAttribute = attr;
      }
    });
    if (lightAttribute === void 0) {
      model = new Object3D();
    } else {
      let type;
      if (lightAttribute.LightType === void 0) {
        type = 0;
      } else {
        type = lightAttribute.LightType.value;
      }
      let color = 16777215;
      if (lightAttribute.Color !== void 0) {
        color = ColorManagement.toWorkingColorSpace(new Color().fromArray(lightAttribute.Color.value), SRGBColorSpace);
      }
      let intensity = lightAttribute.Intensity === void 0 ? 1 : lightAttribute.Intensity.value / 100;
      if (lightAttribute.CastLightOnObject !== void 0 && lightAttribute.CastLightOnObject.value === 0) {
        intensity = 0;
      }
      let distance = 0;
      if (lightAttribute.FarAttenuationEnd !== void 0) {
        if (lightAttribute.EnableFarAttenuation !== void 0 && lightAttribute.EnableFarAttenuation.value === 0) {
          distance = 0;
        } else {
          distance = lightAttribute.FarAttenuationEnd.value;
        }
      }
      const decay = 1;
      switch (type) {
        case 0:
          model = new PointLight(color, intensity, distance, decay);
          break;
        case 1:
          model = new DirectionalLight(color, intensity);
          break;
        case 2:
          let angle = Math.PI / 3;
          if (lightAttribute.InnerAngle !== void 0) {
            angle = MathUtils.degToRad(lightAttribute.InnerAngle.value);
          }
          let penumbra = 0;
          if (lightAttribute.OuterAngle !== void 0) {
            penumbra = MathUtils.degToRad(lightAttribute.OuterAngle.value);
            penumbra = Math.max(penumbra, 1);
          }
          model = new SpotLight(color, intensity, distance, angle, penumbra, decay);
          break;
        default:
          console.warn("THREE.FBXLoader: Unknown light type " + lightAttribute.LightType.value + ", defaulting to a PointLight.");
          model = new PointLight(color, intensity);
          break;
      }
      if (lightAttribute.CastShadows !== void 0 && lightAttribute.CastShadows.value === 1) {
        model.castShadow = true;
      }
    }
    return model;
  }
  createMesh(relationships, geometryMap, materialMap) {
    let model;
    let geometry = null;
    let material = null;
    const materials = [];
    relationships.children.forEach(function(child) {
      if (geometryMap.has(child.ID)) {
        geometry = geometryMap.get(child.ID);
      }
      if (materialMap.has(child.ID)) {
        materials.push(materialMap.get(child.ID));
      }
    });
    if (materials.length > 1) {
      material = materials;
    } else if (materials.length > 0) {
      material = materials[0];
    } else {
      material = new MeshPhongMaterial({
        name: Loader.DEFAULT_MATERIAL_NAME,
        color: 13421772
      });
      materials.push(material);
    }
    if ("color" in geometry.attributes) {
      materials.forEach(function(material2) {
        material2.vertexColors = true;
      });
    }
    if (geometry.FBX_Deformer) {
      model = new SkinnedMesh(geometry, material);
      model.normalizeSkinWeights();
    } else {
      model = new Mesh(geometry, material);
    }
    return model;
  }
  createCurve(relationships, geometryMap) {
    const geometry = relationships.children.reduce(function(geo, child) {
      if (geometryMap.has(child.ID)) geo = geometryMap.get(child.ID);
      return geo;
    }, null);
    const material = new LineBasicMaterial({
      name: Loader.DEFAULT_MATERIAL_NAME,
      color: 3342591,
      linewidth: 1
    });
    return new Line(geometry, material);
  }
  // parse the model node for transform data
  getTransformData(model, modelNode) {
    const transformData = {};
    if ("InheritType" in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);
    if ("RotationOrder" in modelNode) transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
    else transformData.eulerOrder = getEulerOrder(0);
    if ("Lcl_Translation" in modelNode) transformData.translation = modelNode.Lcl_Translation.value;
    if ("PreRotation" in modelNode) transformData.preRotation = modelNode.PreRotation.value;
    if ("Lcl_Rotation" in modelNode) transformData.rotation = modelNode.Lcl_Rotation.value;
    if ("PostRotation" in modelNode) transformData.postRotation = modelNode.PostRotation.value;
    if ("Lcl_Scaling" in modelNode) transformData.scale = modelNode.Lcl_Scaling.value;
    if ("ScalingOffset" in modelNode) transformData.scalingOffset = modelNode.ScalingOffset.value;
    if ("ScalingPivot" in modelNode) transformData.scalingPivot = modelNode.ScalingPivot.value;
    if ("RotationOffset" in modelNode) transformData.rotationOffset = modelNode.RotationOffset.value;
    if ("RotationPivot" in modelNode) transformData.rotationPivot = modelNode.RotationPivot.value;
    model.userData.transformData = transformData;
  }
  setLookAtProperties(model, modelNode) {
    if ("LookAtProperty" in modelNode) {
      const children = connections.get(model.ID).children;
      children.forEach(function(child) {
        if (child.relationship === "LookAtProperty") {
          const lookAtTarget = fbxTree.Objects.Model[child.ID];
          if ("Lcl_Translation" in lookAtTarget) {
            const pos = lookAtTarget.Lcl_Translation.value;
            if (model.target !== void 0) {
              model.target.position.fromArray(pos);
              sceneGraph.add(model.target);
            } else {
              model.lookAt(new Vector3().fromArray(pos));
            }
          }
        }
      });
    }
  }
  bindSkeleton(skeletons, geometryMap, modelMap) {
    const bindMatrices = this.parsePoseNodes();
    for (const ID in skeletons) {
      const skeleton = skeletons[ID];
      const parents = connections.get(parseInt(skeleton.ID)).parents;
      parents.forEach(function(parent) {
        if (geometryMap.has(parent.ID)) {
          const geoID = parent.ID;
          const geoRelationships = connections.get(geoID);
          geoRelationships.parents.forEach(function(geoConnParent) {
            if (modelMap.has(geoConnParent.ID)) {
              const model = modelMap.get(geoConnParent.ID);
              model.bind(new Skeleton(skeleton.bones), bindMatrices[geoConnParent.ID]);
            }
          });
        }
      });
    }
  }
  parsePoseNodes() {
    const bindMatrices = {};
    if ("Pose" in fbxTree.Objects) {
      const BindPoseNode = fbxTree.Objects.Pose;
      for (const nodeID in BindPoseNode) {
        if (BindPoseNode[nodeID].attrType === "BindPose" && BindPoseNode[nodeID].NbPoseNodes > 0) {
          const poseNodes = BindPoseNode[nodeID].PoseNode;
          if (Array.isArray(poseNodes)) {
            poseNodes.forEach(function(poseNode) {
              bindMatrices[poseNode.Node] = new Matrix4().fromArray(poseNode.Matrix.a);
            });
          } else {
            bindMatrices[poseNodes.Node] = new Matrix4().fromArray(poseNodes.Matrix.a);
          }
        }
      }
    }
    return bindMatrices;
  }
  addGlobalSceneSettings() {
    if ("GlobalSettings" in fbxTree) {
      if ("AmbientColor" in fbxTree.GlobalSettings) {
        const ambientColor = fbxTree.GlobalSettings.AmbientColor.value;
        const r = ambientColor[0];
        const g = ambientColor[1];
        const b = ambientColor[2];
        if (r !== 0 || g !== 0 || b !== 0) {
          const color = new Color().setRGB(r, g, b, SRGBColorSpace);
          sceneGraph.add(new AmbientLight(color, 1));
        }
      }
      if ("UnitScaleFactor" in fbxTree.GlobalSettings) {
        sceneGraph.userData.unitScaleFactor = fbxTree.GlobalSettings.UnitScaleFactor.value;
      }
    }
  }
};
var GeometryParser = class {
  constructor() {
    this.negativeMaterialIndices = false;
  }
  // Parse nodes in FBXTree.Objects.Geometry
  parse(deformers) {
    const geometryMap = /* @__PURE__ */ new Map();
    if ("Geometry" in fbxTree.Objects) {
      const geoNodes = fbxTree.Objects.Geometry;
      for (const nodeID in geoNodes) {
        const relationships = connections.get(parseInt(nodeID));
        const geo = this.parseGeometry(relationships, geoNodes[nodeID], deformers);
        geometryMap.set(parseInt(nodeID), geo);
      }
    }
    if (this.negativeMaterialIndices === true) {
      console.warn("THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected.");
    }
    return geometryMap;
  }
  // Parse single node in FBXTree.Objects.Geometry
  parseGeometry(relationships, geoNode, deformers) {
    switch (geoNode.attrType) {
      case "Mesh":
        return this.parseMeshGeometry(relationships, geoNode, deformers);
        break;
      case "NurbsCurve":
        return this.parseNurbsGeometry(geoNode);
        break;
    }
  }
  // Parse single node mesh geometry in FBXTree.Objects.Geometry
  parseMeshGeometry(relationships, geoNode, deformers) {
    const skeletons = deformers.skeletons;
    const morphTargets = [];
    const modelNodes = relationships.parents.map(function(parent) {
      return fbxTree.Objects.Model[parent.ID];
    });
    if (modelNodes.length === 0) return;
    const skeleton = relationships.children.reduce(function(skeleton2, child) {
      if (skeletons[child.ID] !== void 0) skeleton2 = skeletons[child.ID];
      return skeleton2;
    }, null);
    relationships.children.forEach(function(child) {
      if (deformers.morphTargets[child.ID] !== void 0) {
        morphTargets.push(deformers.morphTargets[child.ID]);
      }
    });
    const modelNode = modelNodes[0];
    const transformData = {};
    if ("RotationOrder" in modelNode) transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
    if ("InheritType" in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);
    if ("GeometricTranslation" in modelNode) transformData.translation = modelNode.GeometricTranslation.value;
    if ("GeometricRotation" in modelNode) transformData.rotation = modelNode.GeometricRotation.value;
    if ("GeometricScaling" in modelNode) transformData.scale = modelNode.GeometricScaling.value;
    const transform = generateTransform(transformData);
    return this.genGeometry(geoNode, skeleton, morphTargets, transform);
  }
  // Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
  genGeometry(geoNode, skeleton, morphTargets, preTransform) {
    const geo = new BufferGeometry();
    if (geoNode.attrName) geo.name = geoNode.attrName;
    const geoInfo = this.parseGeoNode(geoNode, skeleton);
    const buffers = this.genBuffers(geoInfo);
    const positionAttribute = new Float32BufferAttribute(buffers.vertex, 3);
    positionAttribute.applyMatrix4(preTransform);
    geo.setAttribute("position", positionAttribute);
    if (buffers.colors.length > 0) {
      geo.setAttribute("color", new Float32BufferAttribute(buffers.colors, 3));
    }
    if (skeleton) {
      geo.setAttribute("skinIndex", new Uint16BufferAttribute(buffers.weightsIndices, 4));
      geo.setAttribute("skinWeight", new Float32BufferAttribute(buffers.vertexWeights, 4));
      geo.FBX_Deformer = skeleton;
    }
    if (buffers.normal.length > 0) {
      const normalMatrix = new Matrix3().getNormalMatrix(preTransform);
      const normalAttribute = new Float32BufferAttribute(buffers.normal, 3);
      normalAttribute.applyNormalMatrix(normalMatrix);
      geo.setAttribute("normal", normalAttribute);
    }
    buffers.uvs.forEach(function(uvBuffer, i2) {
      const name = i2 === 0 ? "uv" : `uv${i2}`;
      geo.setAttribute(name, new Float32BufferAttribute(buffers.uvs[i2], 2));
    });
    if (geoInfo.material && geoInfo.material.mappingType !== "AllSame") {
      let prevMaterialIndex = buffers.materialIndex[0];
      let startIndex = 0;
      buffers.materialIndex.forEach(function(currentIndex, i2) {
        if (currentIndex !== prevMaterialIndex) {
          geo.addGroup(startIndex, i2 - startIndex, prevMaterialIndex);
          prevMaterialIndex = currentIndex;
          startIndex = i2;
        }
      });
      if (geo.groups.length > 0) {
        const lastGroup = geo.groups[geo.groups.length - 1];
        const lastIndex = lastGroup.start + lastGroup.count;
        if (lastIndex !== buffers.materialIndex.length) {
          geo.addGroup(lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex);
        }
      }
      if (geo.groups.length === 0) {
        geo.addGroup(0, buffers.materialIndex.length, buffers.materialIndex[0]);
      }
    }
    this.addMorphTargets(geo, geoNode, morphTargets, preTransform);
    return geo;
  }
  parseGeoNode(geoNode, skeleton) {
    const geoInfo = {};
    geoInfo.vertexPositions = geoNode.Vertices !== void 0 ? geoNode.Vertices.a : [];
    geoInfo.vertexIndices = geoNode.PolygonVertexIndex !== void 0 ? geoNode.PolygonVertexIndex.a : [];
    if (geoNode.LayerElementColor) {
      geoInfo.color = this.parseVertexColors(geoNode.LayerElementColor[0]);
    }
    if (geoNode.LayerElementMaterial) {
      geoInfo.material = this.parseMaterialIndices(geoNode.LayerElementMaterial[0]);
    }
    if (geoNode.LayerElementNormal) {
      geoInfo.normal = this.parseNormals(geoNode.LayerElementNormal[0]);
    }
    if (geoNode.LayerElementUV) {
      geoInfo.uv = [];
      let i2 = 0;
      while (geoNode.LayerElementUV[i2]) {
        if (geoNode.LayerElementUV[i2].UV) {
          geoInfo.uv.push(this.parseUVs(geoNode.LayerElementUV[i2]));
        }
        i2++;
      }
    }
    geoInfo.weightTable = {};
    if (skeleton !== null) {
      geoInfo.skeleton = skeleton;
      skeleton.rawBones.forEach(function(rawBone, i2) {
        rawBone.indices.forEach(function(index, j) {
          if (geoInfo.weightTable[index] === void 0) geoInfo.weightTable[index] = [];
          geoInfo.weightTable[index].push({
            id: i2,
            weight: rawBone.weights[j]
          });
        });
      });
    }
    return geoInfo;
  }
  genBuffers(geoInfo) {
    const buffers = {
      vertex: [],
      normal: [],
      colors: [],
      uvs: [],
      materialIndex: [],
      vertexWeights: [],
      weightsIndices: []
    };
    let polygonIndex = 0;
    let faceLength = 0;
    let displayedWeightsWarning = false;
    let facePositionIndexes = [];
    let faceNormals = [];
    let faceColors = [];
    let faceUVs = [];
    let faceWeights = [];
    let faceWeightIndices = [];
    const scope = this;
    geoInfo.vertexIndices.forEach(function(vertexIndex, polygonVertexIndex) {
      let materialIndex;
      let endOfFace = false;
      if (vertexIndex < 0) {
        vertexIndex = vertexIndex ^ -1;
        endOfFace = true;
      }
      let weightIndices = [];
      let weights = [];
      facePositionIndexes.push(vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);
      if (geoInfo.color) {
        const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color);
        faceColors.push(data[0], data[1], data[2]);
      }
      if (geoInfo.skeleton) {
        if (geoInfo.weightTable[vertexIndex] !== void 0) {
          geoInfo.weightTable[vertexIndex].forEach(function(wt) {
            weights.push(wt.weight);
            weightIndices.push(wt.id);
          });
        }
        if (weights.length > 4) {
          if (!displayedWeightsWarning) {
            console.warn("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.");
            displayedWeightsWarning = true;
          }
          const wIndex = [0, 0, 0, 0];
          const Weight = [0, 0, 0, 0];
          weights.forEach(function(weight, weightIndex) {
            let currentWeight = weight;
            let currentIndex = weightIndices[weightIndex];
            Weight.forEach(function(comparedWeight, comparedWeightIndex, comparedWeightArray) {
              if (currentWeight > comparedWeight) {
                comparedWeightArray[comparedWeightIndex] = currentWeight;
                currentWeight = comparedWeight;
                const tmp = wIndex[comparedWeightIndex];
                wIndex[comparedWeightIndex] = currentIndex;
                currentIndex = tmp;
              }
            });
          });
          weightIndices = wIndex;
          weights = Weight;
        }
        while (weights.length < 4) {
          weights.push(0);
          weightIndices.push(0);
        }
        for (let i2 = 0; i2 < 4; ++i2) {
          faceWeights.push(weights[i2]);
          faceWeightIndices.push(weightIndices[i2]);
        }
      }
      if (geoInfo.normal) {
        const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal);
        faceNormals.push(data[0], data[1], data[2]);
      }
      if (geoInfo.material && geoInfo.material.mappingType !== "AllSame") {
        materialIndex = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material)[0];
        if (materialIndex < 0) {
          scope.negativeMaterialIndices = true;
          materialIndex = 0;
        }
      }
      if (geoInfo.uv) {
        geoInfo.uv.forEach(function(uv, i2) {
          const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, uv);
          if (faceUVs[i2] === void 0) {
            faceUVs[i2] = [];
          }
          faceUVs[i2].push(data[0]);
          faceUVs[i2].push(data[1]);
        });
      }
      faceLength++;
      if (endOfFace) {
        scope.genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength);
        polygonIndex++;
        faceLength = 0;
        facePositionIndexes = [];
        faceNormals = [];
        faceColors = [];
        faceUVs = [];
        faceWeights = [];
        faceWeightIndices = [];
      }
    });
    return buffers;
  }
  // See https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
  getNormalNewell(vertices) {
    const normal = new Vector3(0, 0, 0);
    for (let i2 = 0; i2 < vertices.length; i2++) {
      const current = vertices[i2];
      const next = vertices[(i2 + 1) % vertices.length];
      normal.x += (current.y - next.y) * (current.z + next.z);
      normal.y += (current.z - next.z) * (current.x + next.x);
      normal.z += (current.x - next.x) * (current.y + next.y);
    }
    normal.normalize();
    return normal;
  }
  getNormalTangentAndBitangent(vertices) {
    const normalVector = this.getNormalNewell(vertices);
    const up = Math.abs(normalVector.z) > 0.5 ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1);
    const tangent = up.cross(normalVector).normalize();
    const bitangent = normalVector.clone().cross(tangent).normalize();
    return {
      normal: normalVector,
      tangent,
      bitangent
    };
  }
  flattenVertex(vertex, normalTangent, normalBitangent) {
    return new Vector2(
      vertex.dot(normalTangent),
      vertex.dot(normalBitangent)
    );
  }
  // Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
  genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength) {
    let triangles;
    if (faceLength > 3) {
      const vertices = [];
      const positions = geoInfo.baseVertexPositions || geoInfo.vertexPositions;
      for (let i2 = 0; i2 < facePositionIndexes.length; i2 += 3) {
        vertices.push(
          new Vector3(
            positions[facePositionIndexes[i2]],
            positions[facePositionIndexes[i2 + 1]],
            positions[facePositionIndexes[i2 + 2]]
          )
        );
      }
      const { tangent, bitangent } = this.getNormalTangentAndBitangent(vertices);
      const triangulationInput = [];
      for (const vertex of vertices) {
        triangulationInput.push(this.flattenVertex(vertex, tangent, bitangent));
      }
      triangles = ShapeUtils.triangulateShape(triangulationInput, []);
    } else {
      triangles = [[0, 1, 2]];
    }
    for (const [i0, i1, i2] of triangles) {
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i0 * 3]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i0 * 3 + 1]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i0 * 3 + 2]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i1 * 3]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i1 * 3 + 1]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i1 * 3 + 2]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i2 * 3]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i2 * 3 + 1]]);
      buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i2 * 3 + 2]]);
      if (geoInfo.skeleton) {
        buffers.vertexWeights.push(faceWeights[i0 * 4]);
        buffers.vertexWeights.push(faceWeights[i0 * 4 + 1]);
        buffers.vertexWeights.push(faceWeights[i0 * 4 + 2]);
        buffers.vertexWeights.push(faceWeights[i0 * 4 + 3]);
        buffers.vertexWeights.push(faceWeights[i1 * 4]);
        buffers.vertexWeights.push(faceWeights[i1 * 4 + 1]);
        buffers.vertexWeights.push(faceWeights[i1 * 4 + 2]);
        buffers.vertexWeights.push(faceWeights[i1 * 4 + 3]);
        buffers.vertexWeights.push(faceWeights[i2 * 4]);
        buffers.vertexWeights.push(faceWeights[i2 * 4 + 1]);
        buffers.vertexWeights.push(faceWeights[i2 * 4 + 2]);
        buffers.vertexWeights.push(faceWeights[i2 * 4 + 3]);
        buffers.weightsIndices.push(faceWeightIndices[i0 * 4]);
        buffers.weightsIndices.push(faceWeightIndices[i0 * 4 + 1]);
        buffers.weightsIndices.push(faceWeightIndices[i0 * 4 + 2]);
        buffers.weightsIndices.push(faceWeightIndices[i0 * 4 + 3]);
        buffers.weightsIndices.push(faceWeightIndices[i1 * 4]);
        buffers.weightsIndices.push(faceWeightIndices[i1 * 4 + 1]);
        buffers.weightsIndices.push(faceWeightIndices[i1 * 4 + 2]);
        buffers.weightsIndices.push(faceWeightIndices[i1 * 4 + 3]);
        buffers.weightsIndices.push(faceWeightIndices[i2 * 4]);
        buffers.weightsIndices.push(faceWeightIndices[i2 * 4 + 1]);
        buffers.weightsIndices.push(faceWeightIndices[i2 * 4 + 2]);
        buffers.weightsIndices.push(faceWeightIndices[i2 * 4 + 3]);
      }
      if (geoInfo.color) {
        buffers.colors.push(faceColors[i0 * 3]);
        buffers.colors.push(faceColors[i0 * 3 + 1]);
        buffers.colors.push(faceColors[i0 * 3 + 2]);
        buffers.colors.push(faceColors[i1 * 3]);
        buffers.colors.push(faceColors[i1 * 3 + 1]);
        buffers.colors.push(faceColors[i1 * 3 + 2]);
        buffers.colors.push(faceColors[i2 * 3]);
        buffers.colors.push(faceColors[i2 * 3 + 1]);
        buffers.colors.push(faceColors[i2 * 3 + 2]);
      }
      if (geoInfo.material && geoInfo.material.mappingType !== "AllSame") {
        buffers.materialIndex.push(materialIndex);
        buffers.materialIndex.push(materialIndex);
        buffers.materialIndex.push(materialIndex);
      }
      if (geoInfo.normal) {
        buffers.normal.push(faceNormals[i0 * 3]);
        buffers.normal.push(faceNormals[i0 * 3 + 1]);
        buffers.normal.push(faceNormals[i0 * 3 + 2]);
        buffers.normal.push(faceNormals[i1 * 3]);
        buffers.normal.push(faceNormals[i1 * 3 + 1]);
        buffers.normal.push(faceNormals[i1 * 3 + 2]);
        buffers.normal.push(faceNormals[i2 * 3]);
        buffers.normal.push(faceNormals[i2 * 3 + 1]);
        buffers.normal.push(faceNormals[i2 * 3 + 2]);
      }
      if (geoInfo.uv) {
        geoInfo.uv.forEach(function(uv, j) {
          if (buffers.uvs[j] === void 0) buffers.uvs[j] = [];
          buffers.uvs[j].push(faceUVs[j][i0 * 2]);
          buffers.uvs[j].push(faceUVs[j][i0 * 2 + 1]);
          buffers.uvs[j].push(faceUVs[j][i1 * 2]);
          buffers.uvs[j].push(faceUVs[j][i1 * 2 + 1]);
          buffers.uvs[j].push(faceUVs[j][i2 * 2]);
          buffers.uvs[j].push(faceUVs[j][i2 * 2 + 1]);
        });
      }
    }
  }
  addMorphTargets(parentGeo, parentGeoNode, morphTargets, preTransform) {
    if (morphTargets.length === 0) return;
    parentGeo.morphTargetsRelative = true;
    parentGeo.morphAttributes.position = [];
    const scope = this;
    morphTargets.forEach(function(morphTarget) {
      morphTarget.rawTargets.forEach(function(rawTarget) {
        const morphGeoNode = fbxTree.Objects.Geometry[rawTarget.geoID];
        if (morphGeoNode !== void 0) {
          scope.genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, rawTarget.name);
        }
      });
    });
  }
  // a morph geometry node is similar to a standard  node, and the node is also contained
  // in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
  // and a special attribute Index defining which vertices of the original geometry are affected
  // Normal and position attributes only have data for the vertices that are affected by the morph
  genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, name) {
    const basePositions = parentGeoNode.Vertices !== void 0 ? parentGeoNode.Vertices.a : [];
    const baseIndices = parentGeoNode.PolygonVertexIndex !== void 0 ? parentGeoNode.PolygonVertexIndex.a : [];
    const morphPositionsSparse = morphGeoNode.Vertices !== void 0 ? morphGeoNode.Vertices.a : [];
    const morphIndices = morphGeoNode.Indexes !== void 0 ? morphGeoNode.Indexes.a : [];
    const length = parentGeo.attributes.position.count * 3;
    const morphPositions = new Float32Array(length);
    for (let i2 = 0; i2 < morphIndices.length; i2++) {
      const morphIndex = morphIndices[i2] * 3;
      morphPositions[morphIndex] = morphPositionsSparse[i2 * 3];
      morphPositions[morphIndex + 1] = morphPositionsSparse[i2 * 3 + 1];
      morphPositions[morphIndex + 2] = morphPositionsSparse[i2 * 3 + 2];
    }
    const morphGeoInfo = {
      vertexIndices: baseIndices,
      vertexPositions: morphPositions,
      baseVertexPositions: basePositions
    };
    const morphBuffers = this.genBuffers(morphGeoInfo);
    const positionAttribute = new Float32BufferAttribute(morphBuffers.vertex, 3);
    positionAttribute.name = name || morphGeoNode.attrName;
    positionAttribute.applyMatrix4(preTransform);
    parentGeo.morphAttributes.position.push(positionAttribute);
  }
  // Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
  parseNormals(NormalNode) {
    const mappingType = NormalNode.MappingInformationType;
    const referenceType = NormalNode.ReferenceInformationType;
    const buffer = NormalNode.Normals.a;
    let indexBuffer = [];
    if (referenceType === "IndexToDirect") {
      if ("NormalIndex" in NormalNode) {
        indexBuffer = NormalNode.NormalIndex.a;
      } else if ("NormalsIndex" in NormalNode) {
        indexBuffer = NormalNode.NormalsIndex.a;
      }
    }
    return {
      dataSize: 3,
      buffer,
      indices: indexBuffer,
      mappingType,
      referenceType
    };
  }
  // Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
  parseUVs(UVNode) {
    const mappingType = UVNode.MappingInformationType;
    const referenceType = UVNode.ReferenceInformationType;
    const buffer = UVNode.UV.a;
    let indexBuffer = [];
    if (referenceType === "IndexToDirect") {
      indexBuffer = UVNode.UVIndex.a;
    }
    return {
      dataSize: 2,
      buffer,
      indices: indexBuffer,
      mappingType,
      referenceType
    };
  }
  // Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
  parseVertexColors(ColorNode) {
    const mappingType = ColorNode.MappingInformationType;
    const referenceType = ColorNode.ReferenceInformationType;
    const buffer = ColorNode.Colors.a;
    let indexBuffer = [];
    if (referenceType === "IndexToDirect") {
      indexBuffer = ColorNode.ColorIndex.a;
    }
    for (let i2 = 0, c = new Color(); i2 < buffer.length; i2 += 4) {
      c.fromArray(buffer, i2);
      ColorManagement.toWorkingColorSpace(c, SRGBColorSpace);
      c.toArray(buffer, i2);
    }
    return {
      dataSize: 4,
      buffer,
      indices: indexBuffer,
      mappingType,
      referenceType
    };
  }
  // Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
  parseMaterialIndices(MaterialNode) {
    const mappingType = MaterialNode.MappingInformationType;
    const referenceType = MaterialNode.ReferenceInformationType;
    if (mappingType === "NoMappingInformation") {
      return {
        dataSize: 1,
        buffer: [0],
        indices: [0],
        mappingType: "AllSame",
        referenceType
      };
    }
    const materialIndexBuffer = MaterialNode.Materials.a;
    const materialIndices = [];
    for (let i2 = 0; i2 < materialIndexBuffer.length; ++i2) {
      materialIndices.push(i2);
    }
    return {
      dataSize: 1,
      buffer: materialIndexBuffer,
      indices: materialIndices,
      mappingType,
      referenceType
    };
  }
  // Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
  parseNurbsGeometry(geoNode) {
    const order = parseInt(geoNode.Order);
    if (isNaN(order)) {
      console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s", geoNode.Order, geoNode.id);
      return new BufferGeometry();
    }
    const degree = order - 1;
    const knots = geoNode.KnotVector.a;
    const controlPoints = [];
    const pointsValues = geoNode.Points.a;
    for (let i2 = 0, l = pointsValues.length; i2 < l; i2 += 4) {
      controlPoints.push(new Vector4().fromArray(pointsValues, i2));
    }
    let startKnot, endKnot;
    if (geoNode.Form === "Closed") {
      controlPoints.push(controlPoints[0]);
    } else if (geoNode.Form === "Periodic") {
      startKnot = degree;
      endKnot = knots.length - 1 - startKnot;
      for (let i2 = 0; i2 < degree; ++i2) {
        controlPoints.push(controlPoints[i2]);
      }
    }
    const curve = new NURBSCurve(degree, knots, controlPoints, startKnot, endKnot);
    const points = curve.getPoints(controlPoints.length * 12);
    return new BufferGeometry().setFromPoints(points);
  }
};
var AnimationParser = class {
  // take raw animation clips and turn them into three.js animation clips
  parse() {
    const animationClips = [];
    const rawClips = this.parseClips();
    if (rawClips !== void 0) {
      for (const key in rawClips) {
        const rawClip = rawClips[key];
        const clip = this.addClip(rawClip);
        animationClips.push(clip);
      }
    }
    return animationClips;
  }
  parseClips() {
    if (fbxTree.Objects.AnimationCurve === void 0) return void 0;
    const curveNodesMap = this.parseAnimationCurveNodes();
    this.parseAnimationCurves(curveNodesMap);
    const layersMap = this.parseAnimationLayers(curveNodesMap);
    const rawClips = this.parseAnimStacks(layersMap);
    return rawClips;
  }
  // parse nodes in FBXTree.Objects.AnimationCurveNode
  // each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
  // and is referenced by an AnimationLayer
  parseAnimationCurveNodes() {
    const rawCurveNodes = fbxTree.Objects.AnimationCurveNode;
    const curveNodesMap = /* @__PURE__ */ new Map();
    for (const nodeID in rawCurveNodes) {
      const rawCurveNode = rawCurveNodes[nodeID];
      if (rawCurveNode.attrName.match(/S|R|T|DeformPercent/) !== null) {
        const curveNode = {
          id: rawCurveNode.id,
          attr: rawCurveNode.attrName,
          curves: {}
        };
        curveNodesMap.set(curveNode.id, curveNode);
      }
    }
    return curveNodesMap;
  }
  // parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
  // previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
  // axis ( e.g. times and values of x rotation)
  parseAnimationCurves(curveNodesMap) {
    const rawCurves = fbxTree.Objects.AnimationCurve;
    for (const nodeID in rawCurves) {
      const animationCurve = {
        id: rawCurves[nodeID].id,
        times: rawCurves[nodeID].KeyTime.a.map(convertFBXTimeToSeconds),
        values: rawCurves[nodeID].KeyValueFloat.a
      };
      const relationships = connections.get(animationCurve.id);
      if (relationships !== void 0) {
        const animationCurveID = relationships.parents[0].ID;
        const animationCurveRelationship = relationships.parents[0].relationship;
        if (animationCurveRelationship.match(/X/)) {
          curveNodesMap.get(animationCurveID).curves["x"] = animationCurve;
        } else if (animationCurveRelationship.match(/Y/)) {
          curveNodesMap.get(animationCurveID).curves["y"] = animationCurve;
        } else if (animationCurveRelationship.match(/Z/)) {
          curveNodesMap.get(animationCurveID).curves["z"] = animationCurve;
        } else if (animationCurveRelationship.match(/DeformPercent/) && curveNodesMap.has(animationCurveID)) {
          curveNodesMap.get(animationCurveID).curves["morph"] = animationCurve;
        }
      }
    }
  }
  // parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
  // to various AnimationCurveNodes and is referenced by an AnimationStack node
  // note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack
  parseAnimationLayers(curveNodesMap) {
    const rawLayers = fbxTree.Objects.AnimationLayer;
    const layersMap = /* @__PURE__ */ new Map();
    for (const nodeID in rawLayers) {
      const layerCurveNodes = [];
      const connection = connections.get(parseInt(nodeID));
      if (connection !== void 0) {
        const children = connection.children;
        children.forEach(function(child, i2) {
          if (curveNodesMap.has(child.ID)) {
            const curveNode = curveNodesMap.get(child.ID);
            if (curveNode.curves.x !== void 0 || curveNode.curves.y !== void 0 || curveNode.curves.z !== void 0) {
              if (layerCurveNodes[i2] === void 0) {
                const modelID = connections.get(child.ID).parents.filter(function(parent) {
                  return parent.relationship !== void 0;
                })[0].ID;
                if (modelID !== void 0) {
                  const rawModel = fbxTree.Objects.Model[modelID.toString()];
                  if (rawModel === void 0) {
                    console.warn("THREE.FBXLoader: Encountered a unused curve.", child);
                    return;
                  }
                  const node = {
                    modelName: rawModel.attrName ? PropertyBinding.sanitizeNodeName(rawModel.attrName) : "",
                    ID: rawModel.id,
                    initialPosition: [0, 0, 0],
                    initialRotation: [0, 0, 0],
                    initialScale: [1, 1, 1]
                  };
                  sceneGraph.traverse(function(child2) {
                    if (child2.ID === rawModel.id) {
                      node.transform = child2.matrix;
                      if (child2.userData.transformData) node.eulerOrder = child2.userData.transformData.eulerOrder;
                    }
                  });
                  if (!node.transform) node.transform = new Matrix4();
                  if ("PreRotation" in rawModel) node.preRotation = rawModel.PreRotation.value;
                  if ("PostRotation" in rawModel) node.postRotation = rawModel.PostRotation.value;
                  layerCurveNodes[i2] = node;
                }
              }
              if (layerCurveNodes[i2]) layerCurveNodes[i2][curveNode.attr] = curveNode;
            } else if (curveNode.curves.morph !== void 0) {
              if (layerCurveNodes[i2] === void 0) {
                const deformerID = connections.get(child.ID).parents.filter(function(parent) {
                  return parent.relationship !== void 0;
                })[0].ID;
                const morpherID = connections.get(deformerID).parents[0].ID;
                const geoID = connections.get(morpherID).parents[0].ID;
                const modelID = connections.get(geoID).parents[0].ID;
                const rawModel = fbxTree.Objects.Model[modelID];
                const node = {
                  modelName: rawModel.attrName ? PropertyBinding.sanitizeNodeName(rawModel.attrName) : "",
                  morphName: fbxTree.Objects.Deformer[deformerID].attrName
                };
                layerCurveNodes[i2] = node;
              }
              layerCurveNodes[i2][curveNode.attr] = curveNode;
            }
          }
        });
        layersMap.set(parseInt(nodeID), layerCurveNodes);
      }
    }
    return layersMap;
  }
  // parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
  // hierarchy. Each Stack node will be used to create a AnimationClip
  parseAnimStacks(layersMap) {
    const rawStacks = fbxTree.Objects.AnimationStack;
    const rawClips = {};
    for (const nodeID in rawStacks) {
      const children = connections.get(parseInt(nodeID)).children;
      if (children.length > 1) {
        console.warn("THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.");
      }
      const layer = layersMap.get(children[0].ID);
      rawClips[nodeID] = {
        name: rawStacks[nodeID].attrName,
        layer
      };
    }
    return rawClips;
  }
  addClip(rawClip) {
    let tracks = [];
    const scope = this;
    rawClip.layer.forEach(function(rawTracks) {
      tracks = tracks.concat(scope.generateTracks(rawTracks));
    });
    return new AnimationClip(rawClip.name, -1, tracks);
  }
  generateTracks(rawTracks) {
    const tracks = [];
    let initialPosition = new Vector3();
    let initialScale = new Vector3();
    if (rawTracks.transform) rawTracks.transform.decompose(initialPosition, new Quaternion(), initialScale);
    initialPosition = initialPosition.toArray();
    initialScale = initialScale.toArray();
    if (rawTracks.T !== void 0 && Object.keys(rawTracks.T.curves).length > 0) {
      const positionTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.T.curves, initialPosition, "position");
      if (positionTrack !== void 0) tracks.push(positionTrack);
    }
    if (rawTracks.R !== void 0 && Object.keys(rawTracks.R.curves).length > 0) {
      const rotationTrack = this.generateRotationTrack(rawTracks.modelName, rawTracks.R.curves, rawTracks.preRotation, rawTracks.postRotation, rawTracks.eulerOrder);
      if (rotationTrack !== void 0) tracks.push(rotationTrack);
    }
    if (rawTracks.S !== void 0 && Object.keys(rawTracks.S.curves).length > 0) {
      const scaleTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.S.curves, initialScale, "scale");
      if (scaleTrack !== void 0) tracks.push(scaleTrack);
    }
    if (rawTracks.DeformPercent !== void 0) {
      const morphTrack = this.generateMorphTrack(rawTracks);
      if (morphTrack !== void 0) tracks.push(morphTrack);
    }
    return tracks;
  }
  generateVectorTrack(modelName, curves, initialValue, type) {
    const times = this.getTimesForAllAxes(curves);
    const values = this.getKeyframeTrackValues(times, curves, initialValue);
    return new VectorKeyframeTrack(modelName + "." + type, times, values);
  }
  generateRotationTrack(modelName, curves, preRotation, postRotation, eulerOrder) {
    let times;
    let values;
    if (curves.x !== void 0 && curves.y !== void 0 && curves.z !== void 0) {
      const result = this.interpolateRotations(curves.x, curves.y, curves.z, eulerOrder);
      times = result[0];
      values = result[1];
    }
    const defaultEulerOrder = getEulerOrder(0);
    if (preRotation !== void 0) {
      preRotation = preRotation.map(MathUtils.degToRad);
      preRotation.push(defaultEulerOrder);
      preRotation = new Euler().fromArray(preRotation);
      preRotation = new Quaternion().setFromEuler(preRotation);
    }
    if (postRotation !== void 0) {
      postRotation = postRotation.map(MathUtils.degToRad);
      postRotation.push(defaultEulerOrder);
      postRotation = new Euler().fromArray(postRotation);
      postRotation = new Quaternion().setFromEuler(postRotation).invert();
    }
    const quaternion = new Quaternion();
    const euler = new Euler();
    const quaternionValues = [];
    if (!values || !times) return new QuaternionKeyframeTrack(modelName + ".quaternion", [0], [0]);
    for (let i2 = 0; i2 < values.length; i2 += 3) {
      euler.set(values[i2], values[i2 + 1], values[i2 + 2], eulerOrder);
      quaternion.setFromEuler(euler);
      if (preRotation !== void 0) quaternion.premultiply(preRotation);
      if (postRotation !== void 0) quaternion.multiply(postRotation);
      if (i2 > 2) {
        const prevQuat = new Quaternion().fromArray(
          quaternionValues,
          (i2 - 3) / 3 * 4
        );
        if (prevQuat.dot(quaternion) < 0) {
          quaternion.set(-quaternion.x, -quaternion.y, -quaternion.z, -quaternion.w);
        }
      }
      quaternion.toArray(quaternionValues, i2 / 3 * 4);
    }
    return new QuaternionKeyframeTrack(modelName + ".quaternion", times, quaternionValues);
  }
  generateMorphTrack(rawTracks) {
    const curves = rawTracks.DeformPercent.curves.morph;
    const values = curves.values.map(function(val) {
      return val / 100;
    });
    const morphNum = sceneGraph.getObjectByName(rawTracks.modelName).morphTargetDictionary[rawTracks.morphName];
    return new NumberKeyframeTrack(rawTracks.modelName + ".morphTargetInfluences[" + morphNum + "]", curves.times, values);
  }
  // For all animated objects, times are defined separately for each axis
  // Here we'll combine the times into one sorted array without duplicates
  getTimesForAllAxes(curves) {
    let times = [];
    if (curves.x !== void 0) times = times.concat(curves.x.times);
    if (curves.y !== void 0) times = times.concat(curves.y.times);
    if (curves.z !== void 0) times = times.concat(curves.z.times);
    times = times.sort(function(a, b) {
      return a - b;
    });
    if (times.length > 1) {
      let targetIndex = 1;
      let lastValue = times[0];
      for (let i2 = 1; i2 < times.length; i2++) {
        const currentValue = times[i2];
        if (currentValue !== lastValue) {
          times[targetIndex] = currentValue;
          lastValue = currentValue;
          targetIndex++;
        }
      }
      times = times.slice(0, targetIndex);
    }
    return times;
  }
  getKeyframeTrackValues(times, curves, initialValue) {
    const prevValue = initialValue;
    const values = [];
    let xIndex = -1;
    let yIndex = -1;
    let zIndex = -1;
    times.forEach(function(time) {
      if (curves.x) xIndex = curves.x.times.indexOf(time);
      if (curves.y) yIndex = curves.y.times.indexOf(time);
      if (curves.z) zIndex = curves.z.times.indexOf(time);
      if (xIndex !== -1) {
        const xValue = curves.x.values[xIndex];
        values.push(xValue);
        prevValue[0] = xValue;
      } else {
        values.push(prevValue[0]);
      }
      if (yIndex !== -1) {
        const yValue = curves.y.values[yIndex];
        values.push(yValue);
        prevValue[1] = yValue;
      } else {
        values.push(prevValue[1]);
      }
      if (zIndex !== -1) {
        const zValue = curves.z.values[zIndex];
        values.push(zValue);
        prevValue[2] = zValue;
      } else {
        values.push(prevValue[2]);
      }
    });
    return values;
  }
  // Rotations are defined as Euler angles which can have values  of any size
  // These will be converted to quaternions which don't support values greater than
  // PI, so we'll interpolate large rotations
  interpolateRotations(curvex, curvey, curvez, eulerOrder) {
    const times = [];
    const values = [];
    times.push(curvex.times[0]);
    values.push(MathUtils.degToRad(curvex.values[0]));
    values.push(MathUtils.degToRad(curvey.values[0]));
    values.push(MathUtils.degToRad(curvez.values[0]));
    for (let i2 = 1; i2 < curvex.values.length; i2++) {
      const initialValue = [
        curvex.values[i2 - 1],
        curvey.values[i2 - 1],
        curvez.values[i2 - 1]
      ];
      if (isNaN(initialValue[0]) || isNaN(initialValue[1]) || isNaN(initialValue[2])) {
        continue;
      }
      const initialValueRad = initialValue.map(MathUtils.degToRad);
      const currentValue = [
        curvex.values[i2],
        curvey.values[i2],
        curvez.values[i2]
      ];
      if (isNaN(currentValue[0]) || isNaN(currentValue[1]) || isNaN(currentValue[2])) {
        continue;
      }
      const currentValueRad = currentValue.map(MathUtils.degToRad);
      const valuesSpan = [
        currentValue[0] - initialValue[0],
        currentValue[1] - initialValue[1],
        currentValue[2] - initialValue[2]
      ];
      const absoluteSpan = [
        Math.abs(valuesSpan[0]),
        Math.abs(valuesSpan[1]),
        Math.abs(valuesSpan[2])
      ];
      if (absoluteSpan[0] >= 180 || absoluteSpan[1] >= 180 || absoluteSpan[2] >= 180) {
        const maxAbsSpan = Math.max(...absoluteSpan);
        const numSubIntervals = maxAbsSpan / 180;
        const E1 = new Euler(...initialValueRad, eulerOrder);
        const E2 = new Euler(...currentValueRad, eulerOrder);
        const Q1 = new Quaternion().setFromEuler(E1);
        const Q2 = new Quaternion().setFromEuler(E2);
        if (Q1.dot(Q2)) {
          Q2.set(-Q2.x, -Q2.y, -Q2.z, -Q2.w);
        }
        const initialTime = curvex.times[i2 - 1];
        const timeSpan = curvex.times[i2] - initialTime;
        const Q = new Quaternion();
        const E = new Euler();
        for (let t = 0; t < 1; t += 1 / numSubIntervals) {
          Q.copy(Q1.clone().slerp(Q2.clone(), t));
          times.push(initialTime + t * timeSpan);
          E.setFromQuaternion(Q, eulerOrder);
          values.push(E.x);
          values.push(E.y);
          values.push(E.z);
        }
      } else {
        times.push(curvex.times[i2]);
        values.push(MathUtils.degToRad(curvex.values[i2]));
        values.push(MathUtils.degToRad(curvey.values[i2]));
        values.push(MathUtils.degToRad(curvez.values[i2]));
      }
    }
    return [times, values];
  }
};
var TextParser = class {
  getPrevNode() {
    return this.nodeStack[this.currentIndent - 2];
  }
  getCurrentNode() {
    return this.nodeStack[this.currentIndent - 1];
  }
  getCurrentProp() {
    return this.currentProp;
  }
  pushStack(node) {
    this.nodeStack.push(node);
    this.currentIndent += 1;
  }
  popStack() {
    this.nodeStack.pop();
    this.currentIndent -= 1;
  }
  setCurrentProp(val, name) {
    this.currentProp = val;
    this.currentPropName = name;
  }
  parse(text) {
    this.currentIndent = 0;
    this.allNodes = new FBXTree();
    this.nodeStack = [];
    this.currentProp = [];
    this.currentPropName = "";
    const scope = this;
    const split = text.split(/[\r\n]+/);
    split.forEach(function(line, i2) {
      const matchComment = line.match(/^[\s\t]*;/);
      const matchEmpty = line.match(/^[\s\t]*$/);
      if (matchComment || matchEmpty) return;
      const matchBeginning = line.match("^\\t{" + scope.currentIndent + "}(\\w+):(.*){", "");
      const matchProperty = line.match("^\\t{" + scope.currentIndent + "}(\\w+):[\\s\\t\\r\\n](.*)");
      const matchEnd = line.match("^\\t{" + (scope.currentIndent - 1) + "}}");
      if (matchBeginning) {
        scope.parseNodeBegin(line, matchBeginning);
      } else if (matchProperty) {
        scope.parseNodeProperty(line, matchProperty, split[++i2]);
      } else if (matchEnd) {
        scope.popStack();
      } else if (line.match(/^[^\s\t}]/)) {
        scope.parseNodePropertyContinued(line);
      }
    });
    return this.allNodes;
  }
  parseNodeBegin(line, property) {
    const nodeName = property[1].trim().replace(/^"/, "").replace(/"$/, "");
    const nodeAttrs = property[2].split(",").map(function(attr) {
      return attr.trim().replace(/^"/, "").replace(/"$/, "");
    });
    const node = { name: nodeName };
    const attrs = this.parseNodeAttr(nodeAttrs);
    const currentNode = this.getCurrentNode();
    if (this.currentIndent === 0) {
      this.allNodes.add(nodeName, node);
    } else {
      if (nodeName in currentNode) {
        if (nodeName === "PoseNode") {
          currentNode.PoseNode.push(node);
        } else if (currentNode[nodeName].id !== void 0) {
          currentNode[nodeName] = {};
          currentNode[nodeName][currentNode[nodeName].id] = currentNode[nodeName];
        }
        if (attrs.id !== "") currentNode[nodeName][attrs.id] = node;
      } else if (typeof attrs.id === "number") {
        currentNode[nodeName] = {};
        currentNode[nodeName][attrs.id] = node;
      } else if (nodeName !== "Properties70") {
        if (nodeName === "PoseNode") currentNode[nodeName] = [node];
        else currentNode[nodeName] = node;
      }
    }
    if (typeof attrs.id === "number") node.id = attrs.id;
    if (attrs.name !== "") node.attrName = attrs.name;
    if (attrs.type !== "") node.attrType = attrs.type;
    this.pushStack(node);
  }
  parseNodeAttr(attrs) {
    let id = attrs[0];
    if (attrs[0] !== "") {
      id = parseInt(attrs[0]);
      if (isNaN(id)) {
        id = attrs[0];
      }
    }
    let name = "", type = "";
    if (attrs.length > 1) {
      name = attrs[1].replace(/^(\w+)::/, "");
      type = attrs[2];
    }
    return { id, name, type };
  }
  parseNodeProperty(line, property, contentLine) {
    let propName = property[1].replace(/^"/, "").replace(/"$/, "").trim();
    let propValue = property[2].replace(/^"/, "").replace(/"$/, "").trim();
    if (propName === "Content" && propValue === ",") {
      propValue = contentLine.replace(/"/g, "").replace(/,$/, "").trim();
    }
    const currentNode = this.getCurrentNode();
    const parentName = currentNode.name;
    if (parentName === "Properties70") {
      this.parseNodeSpecialProperty(line, propName, propValue);
      return;
    }
    if (propName === "C") {
      const connProps = propValue.split(",").slice(1);
      const from = parseInt(connProps[0]);
      const to = parseInt(connProps[1]);
      let rest = propValue.split(",").slice(3);
      rest = rest.map(function(elem) {
        return elem.trim().replace(/^"/, "");
      });
      propName = "connections";
      propValue = [from, to];
      append(propValue, rest);
      if (currentNode[propName] === void 0) {
        currentNode[propName] = [];
      }
    }
    if (propName === "Node") currentNode.id = propValue;
    if (propName in currentNode && Array.isArray(currentNode[propName])) {
      currentNode[propName].push(propValue);
    } else {
      if (propName !== "a") currentNode[propName] = propValue;
      else currentNode.a = propValue;
    }
    this.setCurrentProp(currentNode, propName);
    if (propName === "a" && propValue.slice(-1) !== ",") {
      currentNode.a = parseNumberArray(propValue);
    }
  }
  parseNodePropertyContinued(line) {
    const currentNode = this.getCurrentNode();
    currentNode.a += line;
    if (line.slice(-1) !== ",") {
      currentNode.a = parseNumberArray(currentNode.a);
    }
  }
  // parse "Property70"
  parseNodeSpecialProperty(line, propName, propValue) {
    const props = propValue.split('",').map(function(prop) {
      return prop.trim().replace(/^\"/, "").replace(/\s/, "_");
    });
    const innerPropName = props[0];
    const innerPropType1 = props[1];
    const innerPropType2 = props[2];
    const innerPropFlag = props[3];
    let innerPropValue = props[4];
    switch (innerPropType1) {
      case "int":
      case "enum":
      case "bool":
      case "ULongLong":
      case "double":
      case "Number":
      case "FieldOfView":
        innerPropValue = parseFloat(innerPropValue);
        break;
      case "Color":
      case "ColorRGB":
      case "Vector3D":
      case "Lcl_Translation":
      case "Lcl_Rotation":
      case "Lcl_Scaling":
        innerPropValue = parseNumberArray(innerPropValue);
        break;
    }
    this.getPrevNode()[innerPropName] = {
      "type": innerPropType1,
      "type2": innerPropType2,
      "flag": innerPropFlag,
      "value": innerPropValue
    };
    this.setCurrentProp(this.getPrevNode(), innerPropName);
  }
};
var BinaryParser = class {
  parse(buffer) {
    const reader = new BinaryReader(buffer);
    reader.skip(23);
    const version = reader.getUint32();
    if (version < 6400) {
      throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + version);
    }
    const allNodes = new FBXTree();
    while (!this.endOfContent(reader)) {
      const node = this.parseNode(reader, version);
      if (node !== null) allNodes.add(node.name, node);
    }
    return allNodes;
  }
  // Check if reader has reached the end of content.
  endOfContent(reader) {
    if (reader.size() % 16 === 0) {
      return (reader.getOffset() + 160 + 16 & ~15) >= reader.size();
    } else {
      return reader.getOffset() + 160 + 16 >= reader.size();
    }
  }
  // recursively parse nodes until the end of the file is reached
  parseNode(reader, version) {
    const node = {};
    const endOffset = version >= 7500 ? reader.getUint64() : reader.getUint32();
    const numProperties = version >= 7500 ? reader.getUint64() : reader.getUint32();
    version >= 7500 ? reader.getUint64() : reader.getUint32();
    const nameLen = reader.getUint8();
    const name = reader.getString(nameLen);
    if (endOffset === 0) return null;
    const propertyList = [];
    for (let i2 = 0; i2 < numProperties; i2++) {
      propertyList.push(this.parseProperty(reader));
    }
    const id = propertyList.length > 0 ? propertyList[0] : "";
    const attrName = propertyList.length > 1 ? propertyList[1] : "";
    const attrType = propertyList.length > 2 ? propertyList[2] : "";
    node.singleProperty = numProperties === 1 && reader.getOffset() === endOffset ? true : false;
    while (endOffset > reader.getOffset()) {
      const subNode = this.parseNode(reader, version);
      if (subNode !== null) this.parseSubNode(name, node, subNode);
    }
    node.propertyList = propertyList;
    if (typeof id === "number") node.id = id;
    if (attrName !== "") node.attrName = attrName;
    if (attrType !== "") node.attrType = attrType;
    if (name !== "") node.name = name;
    return node;
  }
  parseSubNode(name, node, subNode) {
    if (subNode.singleProperty === true) {
      const value = subNode.propertyList[0];
      if (Array.isArray(value)) {
        node[subNode.name] = subNode;
        subNode.a = value;
      } else {
        node[subNode.name] = value;
      }
    } else if (name === "Connections" && subNode.name === "C") {
      const array = [];
      subNode.propertyList.forEach(function(property, i2) {
        if (i2 !== 0) array.push(property);
      });
      if (node.connections === void 0) {
        node.connections = [];
      }
      node.connections.push(array);
    } else if (subNode.name === "Properties70") {
      const keys = Object.keys(subNode);
      keys.forEach(function(key) {
        node[key] = subNode[key];
      });
    } else if (name === "Properties70" && subNode.name === "P") {
      let innerPropName = subNode.propertyList[0];
      let innerPropType1 = subNode.propertyList[1];
      const innerPropType2 = subNode.propertyList[2];
      const innerPropFlag = subNode.propertyList[3];
      let innerPropValue;
      if (innerPropName.indexOf("Lcl ") === 0) innerPropName = innerPropName.replace("Lcl ", "Lcl_");
      if (innerPropType1.indexOf("Lcl ") === 0) innerPropType1 = innerPropType1.replace("Lcl ", "Lcl_");
      if (innerPropType1 === "Color" || innerPropType1 === "ColorRGB" || innerPropType1 === "Vector" || innerPropType1 === "Vector3D" || innerPropType1.indexOf("Lcl_") === 0) {
        innerPropValue = [
          subNode.propertyList[4],
          subNode.propertyList[5],
          subNode.propertyList[6]
        ];
      } else {
        innerPropValue = subNode.propertyList[4];
      }
      node[innerPropName] = {
        "type": innerPropType1,
        "type2": innerPropType2,
        "flag": innerPropFlag,
        "value": innerPropValue
      };
    } else if (node[subNode.name] === void 0) {
      if (typeof subNode.id === "number") {
        node[subNode.name] = {};
        node[subNode.name][subNode.id] = subNode;
      } else {
        node[subNode.name] = subNode;
      }
    } else {
      if (subNode.name === "PoseNode") {
        if (!Array.isArray(node[subNode.name])) {
          node[subNode.name] = [node[subNode.name]];
        }
        node[subNode.name].push(subNode);
      } else if (node[subNode.name][subNode.id] === void 0) {
        node[subNode.name][subNode.id] = subNode;
      }
    }
  }
  parseProperty(reader) {
    const type = reader.getString(1);
    let length;
    switch (type) {
      case "C":
        return reader.getBoolean();
      case "D":
        return reader.getFloat64();
      case "F":
        return reader.getFloat32();
      case "I":
        return reader.getInt32();
      case "L":
        return reader.getInt64();
      case "R":
        length = reader.getUint32();
        return reader.getArrayBuffer(length);
      case "S":
        length = reader.getUint32();
        return reader.getString(length);
      case "Y":
        return reader.getInt16();
      case "b":
      case "c":
      case "d":
      case "f":
      case "i":
      case "l":
        const arrayLength = reader.getUint32();
        const encoding = reader.getUint32();
        const compressedLength = reader.getUint32();
        if (encoding === 0) {
          switch (type) {
            case "b":
            case "c":
              return reader.getBooleanArray(arrayLength);
            case "d":
              return reader.getFloat64Array(arrayLength);
            case "f":
              return reader.getFloat32Array(arrayLength);
            case "i":
              return reader.getInt32Array(arrayLength);
            case "l":
              return reader.getInt64Array(arrayLength);
          }
        }
        const data = unzlibSync(new Uint8Array(reader.getArrayBuffer(compressedLength)));
        const reader2 = new BinaryReader(data.buffer);
        switch (type) {
          case "b":
          case "c":
            return reader2.getBooleanArray(arrayLength);
          case "d":
            return reader2.getFloat64Array(arrayLength);
          case "f":
            return reader2.getFloat32Array(arrayLength);
          case "i":
            return reader2.getInt32Array(arrayLength);
          case "l":
            return reader2.getInt64Array(arrayLength);
        }
        break;
      // cannot happen but is required by the DeepScan
      default:
        throw new Error("THREE.FBXLoader: Unknown property type " + type);
    }
  }
};
var BinaryReader = class {
  constructor(buffer, littleEndian) {
    this.dv = new DataView(buffer);
    this.offset = 0;
    this.littleEndian = littleEndian !== void 0 ? littleEndian : true;
    this._textDecoder = new TextDecoder();
  }
  getOffset() {
    return this.offset;
  }
  size() {
    return this.dv.buffer.byteLength;
  }
  skip(length) {
    this.offset += length;
  }
  // seems like true/false representation depends on exporter.
  // true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
  // then sees LSB.
  getBoolean() {
    return (this.getUint8() & 1) === 1;
  }
  getBooleanArray(size) {
    const a = [];
    for (let i2 = 0; i2 < size; i2++) {
      a.push(this.getBoolean());
    }
    return a;
  }
  getUint8() {
    const value = this.dv.getUint8(this.offset);
    this.offset += 1;
    return value;
  }
  getInt16() {
    const value = this.dv.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  getInt32() {
    const value = this.dv.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  getInt32Array(size) {
    const a = [];
    for (let i2 = 0; i2 < size; i2++) {
      a.push(this.getInt32());
    }
    return a;
  }
  getUint32() {
    const value = this.dv.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  // JavaScript doesn't support 64-bit integer so calculate this here
  // 1 << 32 will return 1 so using multiply operation instead here.
  // There's a possibility that this method returns wrong value if the value
  // is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
  // TODO: safely handle 64-bit integer
  getInt64() {
    let low, high;
    if (this.littleEndian) {
      low = this.getUint32();
      high = this.getUint32();
    } else {
      high = this.getUint32();
      low = this.getUint32();
    }
    if (high & 2147483648) {
      high = ~high & 4294967295;
      low = ~low & 4294967295;
      if (low === 4294967295) high = high + 1 & 4294967295;
      low = low + 1 & 4294967295;
      return -(high * 4294967296 + low);
    }
    return high * 4294967296 + low;
  }
  getInt64Array(size) {
    const a = [];
    for (let i2 = 0; i2 < size; i2++) {
      a.push(this.getInt64());
    }
    return a;
  }
  // Note: see getInt64() comment
  getUint64() {
    let low, high;
    if (this.littleEndian) {
      low = this.getUint32();
      high = this.getUint32();
    } else {
      high = this.getUint32();
      low = this.getUint32();
    }
    return high * 4294967296 + low;
  }
  getFloat32() {
    const value = this.dv.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  getFloat32Array(size) {
    const a = [];
    for (let i2 = 0; i2 < size; i2++) {
      a.push(this.getFloat32());
    }
    return a;
  }
  getFloat64() {
    const value = this.dv.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  getFloat64Array(size) {
    const a = [];
    for (let i2 = 0; i2 < size; i2++) {
      a.push(this.getFloat64());
    }
    return a;
  }
  getArrayBuffer(size) {
    const value = this.dv.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return value;
  }
  getString(size) {
    const start = this.offset;
    let a = new Uint8Array(this.dv.buffer, start, size);
    this.skip(size);
    const nullByte = a.indexOf(0);
    if (nullByte >= 0) a = new Uint8Array(this.dv.buffer, start, nullByte);
    return this._textDecoder.decode(a);
  }
};
var FBXTree = class {
  add(key, val) {
    this[key] = val;
  }
};
function isFbxFormatBinary(buffer) {
  const CORRECT = "Kaydara FBX Binary  \0";
  return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString(buffer, 0, CORRECT.length);
}
function isFbxFormatASCII(text) {
  const CORRECT = ["K", "a", "y", "d", "a", "r", "a", "\\", "F", "B", "X", "\\", "B", "i", "n", "a", "r", "y", "\\", "\\"];
  let cursor = 0;
  function read(offset) {
    const result = text[offset - 1];
    text = text.slice(cursor + offset);
    cursor++;
    return result;
  }
  for (let i2 = 0; i2 < CORRECT.length; ++i2) {
    const num = read(1);
    if (num === CORRECT[i2]) {
      return false;
    }
  }
  return true;
}
function getFbxVersion(text) {
  const versionRegExp = /FBXVersion: (\d+)/;
  const match = text.match(versionRegExp);
  if (match) {
    const version = parseInt(match[1]);
    return version;
  }
  throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.");
}
function convertFBXTimeToSeconds(time) {
  return time / 46186158e3;
}
var dataArray = [];
function getData(polygonVertexIndex, polygonIndex, vertexIndex, infoObject) {
  let index;
  switch (infoObject.mappingType) {
    case "ByPolygonVertex":
      index = polygonVertexIndex;
      break;
    case "ByPolygon":
      index = polygonIndex;
      break;
    case "ByVertice":
      index = vertexIndex;
      break;
    case "AllSame":
      index = infoObject.indices[0];
      break;
    default:
      console.warn("THREE.FBXLoader: unknown attribute mapping type " + infoObject.mappingType);
  }
  if (infoObject.referenceType === "IndexToDirect") index = infoObject.indices[index];
  const from = index * infoObject.dataSize;
  const to = from + infoObject.dataSize;
  return slice(dataArray, infoObject.buffer, from, to);
}
var tempEuler = new Euler();
var tempVec = new Vector3();
function generateTransform(transformData) {
  const lTranslationM = new Matrix4();
  const lPreRotationM = new Matrix4();
  const lRotationM = new Matrix4();
  const lPostRotationM = new Matrix4();
  const lScalingM = new Matrix4();
  const lScalingPivotM = new Matrix4();
  const lScalingOffsetM = new Matrix4();
  const lRotationOffsetM = new Matrix4();
  const lRotationPivotM = new Matrix4();
  const lParentGX = new Matrix4();
  const lParentLX = new Matrix4();
  const lGlobalT = new Matrix4();
  const inheritType = transformData.inheritType ? transformData.inheritType : 0;
  if (transformData.translation) lTranslationM.setPosition(tempVec.fromArray(transformData.translation));
  const defaultEulerOrder = getEulerOrder(0);
  if (transformData.preRotation) {
    const array = transformData.preRotation.map(MathUtils.degToRad);
    array.push(defaultEulerOrder);
    lPreRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
  }
  if (transformData.rotation) {
    const array = transformData.rotation.map(MathUtils.degToRad);
    array.push(transformData.eulerOrder || defaultEulerOrder);
    lRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
  }
  if (transformData.postRotation) {
    const array = transformData.postRotation.map(MathUtils.degToRad);
    array.push(defaultEulerOrder);
    lPostRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
    lPostRotationM.invert();
  }
  if (transformData.scale) lScalingM.scale(tempVec.fromArray(transformData.scale));
  if (transformData.scalingOffset) lScalingOffsetM.setPosition(tempVec.fromArray(transformData.scalingOffset));
  if (transformData.scalingPivot) lScalingPivotM.setPosition(tempVec.fromArray(transformData.scalingPivot));
  if (transformData.rotationOffset) lRotationOffsetM.setPosition(tempVec.fromArray(transformData.rotationOffset));
  if (transformData.rotationPivot) lRotationPivotM.setPosition(tempVec.fromArray(transformData.rotationPivot));
  if (transformData.parentMatrixWorld) {
    lParentLX.copy(transformData.parentMatrix);
    lParentGX.copy(transformData.parentMatrixWorld);
  }
  const lLRM = lPreRotationM.clone().multiply(lRotationM).multiply(lPostRotationM);
  const lParentGRM = new Matrix4();
  lParentGRM.extractRotation(lParentGX);
  const lParentTM = new Matrix4();
  lParentTM.copyPosition(lParentGX);
  const lParentGRSM = lParentTM.clone().invert().multiply(lParentGX);
  const lParentGSM = lParentGRM.clone().invert().multiply(lParentGRSM);
  const lLSM = lScalingM;
  const lGlobalRS = new Matrix4();
  if (inheritType === 0) {
    lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM).multiply(lLSM);
  } else if (inheritType === 1) {
    lGlobalRS.copy(lParentGRM).multiply(lParentGSM).multiply(lLRM).multiply(lLSM);
  } else {
    const lParentLSM = new Matrix4().scale(new Vector3().setFromMatrixScale(lParentLX));
    const lParentLSM_inv = lParentLSM.clone().invert();
    const lParentGSM_noLocal = lParentGSM.clone().multiply(lParentLSM_inv);
    lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM_noLocal).multiply(lLSM);
  }
  const lRotationPivotM_inv = lRotationPivotM.clone().invert();
  const lScalingPivotM_inv = lScalingPivotM.clone().invert();
  let lTransform = lTranslationM.clone().multiply(lRotationOffsetM).multiply(lRotationPivotM).multiply(lPreRotationM).multiply(lRotationM).multiply(lPostRotationM).multiply(lRotationPivotM_inv).multiply(lScalingOffsetM).multiply(lScalingPivotM).multiply(lScalingM).multiply(lScalingPivotM_inv);
  const lLocalTWithAllPivotAndOffsetInfo = new Matrix4().copyPosition(lTransform);
  const lGlobalTranslation = lParentGX.clone().multiply(lLocalTWithAllPivotAndOffsetInfo);
  lGlobalT.copyPosition(lGlobalTranslation);
  lTransform = lGlobalT.clone().multiply(lGlobalRS);
  lTransform.premultiply(lParentGX.invert());
  return lTransform;
}
function getEulerOrder(order) {
  order = order || 0;
  const enums = [
    "ZYX",
    // -> XYZ extrinsic
    "YZX",
    // -> XZY extrinsic
    "XZY",
    // -> YZX extrinsic
    "ZXY",
    // -> YXZ extrinsic
    "YXZ",
    // -> ZXY extrinsic
    "XYZ"
    // -> ZYX extrinsic
    //'SphericXYZ', // not possible to support
  ];
  if (order === 6) {
    console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.");
    return enums[0];
  }
  return enums[order];
}
function parseNumberArray(value) {
  const array = value.split(",").map(function(val) {
    return parseFloat(val);
  });
  return array;
}
function convertArrayBufferToString(buffer, from, to) {
  if (from === void 0) from = 0;
  if (to === void 0) to = buffer.byteLength;
  return new TextDecoder().decode(new Uint8Array(buffer, from, to));
}
function append(a, b) {
  for (let i2 = 0, j = a.length, l = b.length; i2 < l; i2++, j++) {
    a[j] = b[i2];
  }
}
function slice(a, b, from, to) {
  for (let i2 = from, j = 0; i2 < to; i2++, j++) {
    a[j] = b[i2];
  }
  return a;
}

// ../tmp/viewer-deps/node_modules/three/examples/jsm/utils/SkeletonUtils.js
function clone(source) {
  const sourceLookup = /* @__PURE__ */ new Map();
  const cloneLookup = /* @__PURE__ */ new Map();
  const clone2 = source.clone();
  parallelTraverse(source, clone2, function(sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });
  clone2.traverse(function(node) {
    if (!node.isSkinnedMesh) return;
    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;
    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
    clonedMesh.skeleton.bones = sourceBones.map(function(bone2) {
      return cloneLookup.get(bone2);
    });
    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });
  return clone2;
}
function parallelTraverse(a, b, callback) {
  callback(a, b);
  for (let i2 = 0; i2 < a.children.length; i2++) {
    parallelTraverse(a.children[i2], b.children[i2], callback);
  }
}

// tools/dev/src/adventure-look.js
var _v = new Vector3();
function skinnedBox(root) {
  const box = new Box3();
  let any = false;
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isSkinnedMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pos = o.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 4e3));
    for (let i2 = 0; i2 < pos.count; i2 += step) {
      _v.fromBufferAttribute(pos, i2);
      o.applyBoneTransform(i2, _v);
      _v.applyMatrix4(o.matrixWorld);
      box.expandByPoint(_v);
      any = true;
    }
  });
  if (!any) box.setFromObject(root);
  return box;
}
function fitHeight(root, meters) {
  root.updateMatrixWorld(true);
  let box = skinnedBox(root);
  let sizeY = box.getSize(new Vector3()).y;
  if (!(sizeY > 0.05)) {
    box = new Box3().setFromObject(root);
    sizeY = box.getSize(new Vector3()).y;
  }
  const s = meters / Math.max(1e-3, sizeY);
  root.scale.multiplyScalar(s);
  root.updateMatrixWorld(true);
  box = skinnedBox(root);
  if (!(box.getSize(new Vector3()).y > 0.05)) box = new Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  return skinnedBox(root);
}
function fitPack(root, ellieRawHeight) {
  const s = 1.5 / Math.max(1e-3, ellieRawHeight);
  root.scale.set(1, 1, 1);
  root.scale.multiplyScalar(s);
  root.updateMatrixWorld(true);
  let box = skinnedBox(root);
  if (!(box.getSize(new Vector3()).y > 0.05)) box = new Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  return skinnedBox(root);
}
function rawHeight(root) {
  root.updateMatrixWorld(true);
  let box = skinnedBox(root);
  let sizeY = box.getSize(new Vector3()).y;
  if (!(sizeY > 0.05)) {
    box = new Box3().setFromObject(root);
    sizeY = box.getSize(new Vector3()).y;
  }
  return sizeY;
}
function prepareModel(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;
      if (o.isSkinnedMesh) m.skinning = true;
      m.transparent = false;
      m.opacity = 1;
      m.alphaTest = 0;
      m.depthWrite = true;
      if (m.map) m.map.colorSpace = SRGBColorSpace;
      const name = (m.name || "").toLowerCase();
      if (m.color && !m.map) {
        if (name.includes("face") || name.includes("skin")) m.color.set("#f0c2a0");
        else if (name.includes("hair")) m.color.set("#c9853a");
        else if (name.includes("shirt") || name.includes("top") || name.includes("jacket")) m.color.set("#3a7bd5");
        else if (name.includes("pant")) m.color.set("#2a3358");
        else if (name.includes("belt") || name.includes("shoe") || name.includes("boot")) m.color.set("#2a211c");
        else if (name.includes("dog") || name.includes("fur")) m.color.set("#e0b060");
        else if (name.includes("grey") || name.includes("gray")) m.color.set("#7d8494");
        else if (Math.max(m.color.r, m.color.g, m.color.b) < 0.12) m.color.multiplyScalar(8);
      }
      if (m.map && name.includes("fox")) m.color.set("#d9783a");
    }
    const flat = mats.map((m) => asLambert(m, o.isSkinnedMesh));
    o.material = Array.isArray(o.material) ? flat : flat[0];
    if (o.geometry && o.geometry.getAttribute("normal")) o.geometry.deleteAttribute("normal");
    coalesceGroups(o.geometry);
  });
}
function coalesceGroups(geometry) {
  const groups = geometry && geometry.groups;
  if (!groups || groups.length < 8 || geometry.index) return;
  if (geometry.morphAttributes && Object.keys(geometry.morphAttributes).length) return;
  const names = Object.keys(geometry.attributes);
  const byMat = /* @__PURE__ */ new Map();
  for (const g of groups) {
    if (!byMat.has(g.materialIndex)) byMat.set(g.materialIndex, []);
    byMat.get(g.materialIndex).push(g);
  }
  const copies = {};
  for (const name of names) {
    const src = geometry.attributes[name].array;
    copies[name] = new src.constructor(src.length);
  }
  const next = [];
  let cursor = 0;
  for (const mi of [...byMat.keys()].sort((a, b) => a - b)) {
    const start = cursor;
    for (const g of byMat.get(mi)) {
      for (const name of names) {
        const attr = geometry.attributes[name];
        const item = attr.itemSize;
        copies[name].set(attr.array.subarray(g.start * item, (g.start + g.count) * item), cursor * item);
      }
      cursor += g.count;
    }
    next.push({ start, count: cursor - start, materialIndex: mi });
  }
  for (const name of names) {
    geometry.attributes[name].array.set(copies[name]);
    geometry.attributes[name].needsUpdate = true;
  }
  geometry.clearGroups();
  for (const g of next) geometry.addGroup(g.start, g.count, g.materialIndex);
}
function asLambert(m, skinned) {
  if (!m) return m;
  const next = new MeshBasicMaterial({
    name: m.name,
    color: m.color ? m.color.clone() : 16777215,
    map: null
  });
  next.skinning = !!skinned;
  next.fog = false;
  next.transparent = false;
  next.opacity = 1;
  next.alphaTest = 0;
  next.depthWrite = true;
  if (next.map) next.map.colorSpace = SRGBColorSpace;
  if (m !== next) m.dispose();
  return next;
}
function clipNamed(clips, fragment) {
  const f = fragment.toLowerCase();
  const exact = clips.find((c) => c.name.toLowerCase().endsWith("|" + f) || c.name.toLowerCase() === f);
  if (exact) return exact;
  return clips.find((c) => {
    const n = c.name.toLowerCase();
    return n.includes(f) && !n.includes("carry");
  }) || null;
}

// tools/dev/src/measure.js
var _v2 = new Vector3();
function actorBox(root) {
  const box = skinnedBox(root);
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isMesh || o.isSkinnedMesh || !o.geometry) return;
    if (o.userData.attach) return;
    box.union(new Box3().setFromObject(o));
  });
  return box;
}
function spanLength(root) {
  const q = root.quaternion.clone();
  const pos = root.position.clone();
  root.quaternion.identity();
  root.updateMatrixWorld(true);
  const box = skinnedBox(root);
  const size = box.getSize(new Vector3());
  root.quaternion.copy(q);
  root.position.copy(pos);
  root.updateMatrixWorld(true);
  return Math.max(size.x, size.z);
}
function measureActor(root) {
  root.updateMatrixWorld(true);
  const box = actorBox(root);
  const size = box.getSize(new Vector3());
  const head = findBone(root, "Head");
  const neck = findBone(root, "Neck");
  const hips = findBone(root, "Hips") || findBone(root, "Hip") || findBone(root, "Pelvis");
  const headEnd = findBone(root, "Head_end");
  const headY = head ? boneWorld(head, _v2).y : box.max.y;
  const neckY = neck ? boneWorld(neck, _v2).y : headY;
  const hipY = hips ? boneWorld(hips, _v2).y : box.min.y + size.y * 0.5;
  const headTop = headEnd ? boneWorld(headEnd, _v2).y : box.max.y;
  const headFrac = (Math.max(headTop, headY) - Math.min(headY, neckY)) / Math.max(1e-3, size.y);
  const feet = [];
  root.traverse((o) => {
    if (!o.isBone) return;
    const n = o.name.toLowerCase();
    if (n.includes("foot") || n.includes("paw")) feet.push(boneWorld(o, _v2).y);
  });
  return {
    height: size.y,
    minY: box.min.y,
    maxY: box.max.y,
    length: Math.max(size.x, size.z, spanLength(root)),
    headFrac,
    headY,
    neckY,
    hipY,
    footY: feet,
    bones: {
      head: !!head,
      neck: !!neck,
      hips: !!hips
    }
  };
}
function anatomyLines(root, kind, rules) {
  const m = measureActor(root);
  const lines = [];
  let pass = true;
  const fail = (text) => {
    pass = false;
    lines.push("FAIL  " + text);
  };
  const ok = (text) => lines.push("PASS  " + text);
  lines.push("height " + m.height.toFixed(2) + " m   feet " + m.minY.toFixed(3) + " m");
  const feetOk = m.minY <= rules.feet[1] && m.minY >= rules.feet[0];
  if (feetOk) ok("feet meet the ground");
  else fail("feet at " + m.minY.toFixed(3) + " m");
  const pet = kind === "pet" || kind === "neon-pet";
  if (pet) {
    if (m.height >= rules.petMin) ok("pet height " + m.height.toFixed(2) + " m");
    else fail("pet height " + m.height.toFixed(2) + " m is under " + rules.petMin);
    if (m.length > m.height * rules.petLong) ok("longer than tall (" + m.length.toFixed(2) + " m)");
    else fail("length " + m.length.toFixed(2) + " m is not above height \xD7 " + rules.petLong);
    if (m.maxY <= m.hipY + rules.petAboveHip) ok("back stays near the hip");
    else fail("top " + m.maxY.toFixed(2) + " m is above the hip line");
  } else {
    const [lo, hi] = rules.humanHeight;
    if (m.height >= lo && m.height <= hi) ok("standing height " + m.height.toFixed(2) + " m");
    else fail("standing height " + m.height.toFixed(2) + " m outside " + lo + "\u2013" + hi);
    const pct = Math.round(m.headFrac * 100);
    const [a, b] = rules.headFrac;
    if (m.headFrac >= a && m.headFrac <= b) ok("bone head span " + pct + "%");
    else fail("bone head span " + pct + "% outside " + Math.round(a * 100) + "\u2013" + Math.round(b * 100));
    if (m.bones.head && m.bones.neck) ok("head sits on a neck bone");
    else fail("missing head or neck bone");
  }
  return { lines, pass, measure: m };
}

// tools/dev/src/neon.js
function bone(name, parent, x2, y, z) {
  const b = new Bone();
  b.name = name;
  b.position.set(x2, y, z);
  parent.add(b);
  return b;
}
function mat(name, color) {
  const m = new MeshLambertMaterial({ name, color });
  m.skinning = false;
  return m;
}
function mesh(geo, material, parent, x2, y, z, sx, sy, sz) {
  const o = new Mesh(geo, material);
  o.castShadow = false;
  o.receiveShadow = false;
  o.frustumCulled = false;
  o.position.set(x2 || 0, y || 0, z || 0);
  if (sx != null) o.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
  parent.add(o);
  return o;
}
function idleClip(boneName, y) {
  const track = new VectorKeyframeTrack(
    boneName + ".position",
    [0, 0.5, 1],
    [0, y, 0, 0, y + 0.03, 0, 0, y, 0]
  );
  return new AnimationClip("Idle", 1, [track]);
}
function buildNeon(model) {
  if (model.kind === "neon-pet") return buildPet(model);
  return buildHuman(model);
}
function buildHuman(model) {
  const root = new Group();
  root.name = model.id;
  const H = model.height || 1.75;
  const hipsY = H * 0.52;
  const hips = bone("Hips", root, 0, hipsY, 0);
  const spine = bone("Spine", hips, 0, H * 0.12, 0);
  const neck = bone("Neck", spine, 0, H * 0.2, 0);
  const head = bone("Head", neck, 0, H * 0.06, 0);
  bone("Head_end", head, 0, H * 0.1, 0);
  const legL = bone("UpperLeg.L", hips, -0.08, -H * 0.02, 0);
  const legR = bone("UpperLeg.R", hips, 0.08, -H * 0.02, 0);
  bone("Foot.L", legL, 0, -hipsY + 0.04, 0.02);
  bone("Foot.R", legR, 0, -hipsY + 0.04, 0.02);
  bone("UpperArm.L", spine, -0.16, H * 0.12, 0);
  bone("UpperArm.R", spine, 0.16, H * 0.12, 0);
  const skin = mat("Skin", model.skin || "#f0c8a8");
  const face = mat("Face", model.skin || "#f0c8a8");
  const shirt = mat("Shirt", model.outfit || "#ff3df2");
  const pants = mat("Pants", "#2a1434");
  const shoes = mat("Shoes", "#2a211c");
  const hair = mat("Hair", model.outfit || "#ff4ad8");
  mesh(new BoxGeometry(0.28, H * 0.28, 0.16), shirt, spine, 0, H * 0.06, 0);
  mesh(new BoxGeometry(0.26, H * 0.12, 0.15), pants, hips, 0, -0.02, 0);
  mesh(new SphereGeometry(H * 0.07, 14, 10), skin, head, 0, H * 0.02, 0);
  mesh(new SphereGeometry(0.012, 8, 6), face, head, -0.025, H * 0.02, H * 0.055);
  mesh(new SphereGeometry(0.012, 8, 6), face, head, 0.025, H * 0.02, H * 0.055);
  mesh(new SphereGeometry(0.07, 12, 8), hair, head, 0, H * 0.05, -0.01);
  mesh(new CylinderGeometry(0.025, 0.03, H * 0.16, 8), hair, head, 0, -0.02, -0.06);
  mesh(new BoxGeometry(0.08, 0.04, 0.14), shoes, root.getObjectByName("Foot.L"), 0, 0, 0.02);
  mesh(new BoxGeometry(0.08, 0.04, 0.14), shoes, root.getObjectByName("Foot.R"), 0, 0, 0.02);
  root.animations = [idleClip("Hips", hipsY)];
  return root;
}
function buildPet(model) {
  const rig = model.rig || {};
  const root = new Group();
  root.name = model.id;
  const color = rig.color || "#ffb020";
  const len = rig.len || 0.26;
  const leg = rig.leg || 0.15;
  const hips = bone("Hips", root, 0, leg, 0);
  const spine = bone("Spine", hips, -len * 0.1, rig.body || 0.06, 0);
  const neck = bone("Neck", hips, len * 0.35, (rig.body || 0.06) * 0.4, 0);
  const head = bone("Head", neck, len * 0.2, (rig.head || 0.08) * 0.2, 0);
  bone("Head_end", head, rig.head || 0.08, (rig.head || 0.08) * 0.3, 0);
  bone("Foot.L", hips, len * 0.2, -leg + 0.02, 0.05);
  bone("Foot.R", hips, len * 0.2, -leg + 0.02, -0.05);
  bone("Foot.L2", hips, -len * 0.25, -leg + 0.02, 0.05);
  bone("Foot.R2", hips, -len * 0.25, -leg + 0.02, -0.05);
  const fur = mat("Fur", color);
  const nose = mat("Face", "#2a211c");
  mesh(new BoxGeometry(len, rig.body || 0.07, (rig.body || 0.07) * 0.8), fur, hips, 0, 0, 0);
  mesh(new SphereGeometry(rig.head || 0.08, 12, 8), fur, head, 0, 0, 0);
  mesh(new SphereGeometry(0.015, 8, 6), nose, head, (rig.head || 0.08) * 0.8, 0, 0);
  if (rig.ear === "point" || rig.ear === "horn") {
    mesh(new ConeGeometry(0.02, rig.earL || 0.06, 6), fur, head, 0, rig.head || 0.08, 0.03);
    mesh(new ConeGeometry(0.02, rig.earL || 0.06, 6), fur, head, 0, rig.head || 0.08, -0.03);
  } else {
    mesh(new CylinderGeometry(8e-3, 8e-3, rig.earL || 0.08, 6), fur, head, 0, rig.head || 0.08, 0);
  }
  mesh(new CylinderGeometry(0.015, 8e-3, rig.tail || 0.12, 6), fur, spine, -(len * 0.55), 0.02, 0);
  if (rig.wings) {
    const wing = mat("Shirt", "#d8ffe4");
    mesh(new BoxGeometry(0.02, 0.08, 0.16), wing, spine, 0, 0.04, 0.1);
    mesh(new BoxGeometry(0.02, 0.08, 0.16), wing, spine, 0, 0.04, -0.1);
  }
  root.animations = [idleClip("Hips", leg)];
  root.position.y = 0;
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  root.position.y -= box.min.y;
  return root;
}

// tools/dev/src/character.js
var fbxLoader = new FBXLoader();
var gltfLoader = new GLTFLoader();
function clipTitle(clip) {
  if (!clip) return "still";
  const bit = String(clip.name || "clip").split("|").pop();
  return bit || "clip";
}
function createModule() {
  let alive = false;
  let unhook = () => {
  };
  let stage = null;
  let gui = null;
  let catalog = null;
  let assets = null;
  let scale = null;
  let host = null;
  let ctx = null;
  const templates = /* @__PURE__ */ new Map();
  const panes = { a: null, b: null };
  let eqA = null;
  let eqB = null;
  let edit = "a";
  let lightId = "game";
  let angleId = "front";
  let compare = false;
  let overlay = false;
  let turn = true;
  let playing = true;
  let speed = 1;
  let wire = false;
  let bonesOn = false;
  let gridOn = true;
  let ready = false;
  let pending = null;
  const errors = [];
  let checkerNote = "";
  let boneLines = null;
  const ui = {};
  function eqOf(which) {
    return which === "b" ? eqB : eqA;
  }
  function defaults() {
    return Object.assign({}, catalog.defaults);
  }
  function hookErrors() {
    const orig = console.error;
    console.error = (...args) => {
      errors.push(args.map((x2) => x2 && x2.message || String(x2)).join(" "));
      orig.apply(console, args);
    };
    const onErr = (e) => errors.push(String(e.message || e.error || e));
    const onRej = (e) => errors.push(String(e.reason && e.reason.message || e.reason || e));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      console.error = orig;
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }
  function modelById(id) {
    return assets.models.find((m) => m.id === id) || assets.models[0];
  }
  async function loadTemplate(model) {
    if (templates.has(model.id)) return templates.get(model.id);
    let root;
    let clips = [];
    if (String(model.kind || "").startsWith("neon")) {
      root = buildNeon(model);
      clips = root.animations || [];
      if (model.height) fitHeight(root, model.height);
    } else {
      const url = repoUrl(model.file);
      if (model.format === "fbx") {
        root = await fbxLoader.loadAsync(url);
        clips = root.animations || [];
      } else {
        const gltf = await gltfLoader.loadAsync(url);
        root = gltf.scene;
        clips = gltf.animations || [];
        root.animations = clips;
      }
      if (model.yaw) root.rotation.y = model.yaw;
      prepareModel(root);
      const raw = rawHeight(root);
      if (model.fit === "pack" && model.id !== "ellie") {
        const ellie = modelById("ellie");
        if (!templates.has("ellie")) await loadTemplate(ellie);
        const ellieRaw = templates.get("ellie").raw;
        fitPack(root, ellieRaw);
      } else {
        fitHeight(root, model.height || 1.5);
      }
      root.userData.raw = raw;
    }
    root.userData.raw = root.userData.raw || rawHeight(root);
    const box = new Box3().setFromObject(root);
    const rec = { model, root, clips, raw: root.userData.raw, height: box.getSize(new Vector3()).y };
    templates.set(model.id, rec);
    return rec;
  }
  function disposeInstance(inst) {
    if (!inst) return;
    inst.mixer.stopAllAction();
    const list = inst.root.userData.attached || [];
    for (const mesh2 of list) {
      if (mesh2.parent) mesh2.parent.remove(mesh2);
      if (mesh2.geometry) mesh2.geometry.dispose();
      if (mesh2.material && mesh2.material.dispose) mesh2.material.dispose();
    }
    inst.root.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (m && m.dispose) m.dispose();
      });
    });
    if (inst.wrapper.parent) inst.wrapper.parent.remove(inst.wrapper);
  }
  function makeInstance(rec) {
    const root = clone(rec.root);
    root.animations = rec.clips;
    cloneMaterials(root);
    stamp(root);
    const wrapper = new Group();
    wrapper.name = "pane-" + rec.model.id;
    wrapper.add(root);
    const mixer = new AnimationMixer(root);
    mixer.timeScale = speed;
    const inst = { model: rec.model, root, wrapper, mixer, clips: rec.clips, clip: null, action: null, height: rec.height };
    const idle = clipNamed(rec.clips, "idle") || rec.clips[0] || null;
    if (idle) {
      const action = mixer.clipAction(idle);
      action.play();
      mixer.setTime(Math.min(0.15 * idle.duration, idle.duration * 0.15));
      inst.clip = idle;
      inst.action = action;
    }
    return inst;
  }
  function applyPane(which) {
    const inst = panes[which];
    if (!inst) return;
    applyEq(inst.root, inst.wrapper, catalog, eqOf(which), inst.height);
    setWire(inst.root, wire);
    if (overlay && which === "b") setOverlayMats(inst, true);
    inst.mixer.timeScale = speed;
  }
  function frame(which) {
    const inst = panes[which];
    if (!inst) return;
    inst.wrapper.updateMatrixWorld(true);
    const box = new Box3().setFromObject(inst.wrapper);
    const size = box.getSize(new Vector3());
    const centerY = Math.max(0.15, (box.min.y + box.max.y) * 0.5);
    const fov = MathUtils.degToRad(stage.camera.fov);
    const dist = Math.max(size.y, 0.4) * 0.5 / Math.tan(fov / 2) * 1.65;
    if (which === "a") stage.setTarget("a", centerY, dist);
    else {
      stage.targetB.set(0, centerY, 0);
      stage.setTarget("b", centerY, null);
    }
    const side = Math.max(0.35, size.x * 0.5 + 0.28);
    stage.ruler.position.x = -side;
  }
  async function setModel(which, id) {
    const model = modelById(id);
    ui.status.textContent = "Loading " + model.name + "\u2026";
    let rec;
    try {
      rec = await loadTemplate(model);
    } catch (err2) {
      if (model.optional) {
        ui.status.textContent = model.name + " is not in this build. " + (model.note || "");
        return { missing: true, error: String(err2 && err2.message || err2) };
      }
      throw err2;
    }
    if (!alive) return null;
    disposeInstance(panes[which]);
    const inst = makeInstance(rec);
    panes[which] = inst;
    stage.scene.add(inst.wrapper);
    applyPane(which);
    frame("a");
    if (panes.b) frame("b");
    fillClips();
    paintBar();
    ui.status.textContent = model.name + (String(model.kind).startsWith("neon") ? " \xB7 Neon tubes" : " \xB7 Adventure rig");
    return inst;
  }
  function angleName() {
    const a = catalog.angles.find((x2) => x2.id === angleId);
    return a ? a.name : "Front";
  }
  function makeLabel() {
    const inst = panes.a;
    const name = inst ? inst.model.name : "model";
    const clip = inst && inst.clip ? clipTitle(inst.clip) : "still";
    const time = inst ? inst.mixer.time : 0;
    const frame2 = Math.round(time * 30);
    return name + " \xB7 " + angleName() + " \xB7 " + clip + " \xB7 f" + frame2;
  }
  function paintBar() {
    const inst = panes[edit] || panes.a;
    if (!inst || !catalog) return;
    const report = anatomyLines(inst.root, inst.model.kind, catalog.anatomy);
    const lines = [
      inst.model.name + "  " + (String(inst.model.kind).startsWith("neon") ? "NEON TUBES" : "GAME RIG"),
      "Ellie " + scale.ellie.toFixed(2) + " m \xB7 this " + report.measure.height.toFixed(2) + " m \xB7 370Z height " + scale.z.h + " m",
      checkerNote
    ].concat(report.lines);
    ui.bar.textContent = lines.filter(Boolean).join("\n");
  }
  function paintChips() {
    clear(ui.chips);
    const sections = el("div", "zsecs");
    for (const sec of catalog.sections) {
      const b = el("button", "zsec" + (ui.section === sec.id ? " on" : ""), sec.name);
      b.type = "button";
      b.addEventListener("click", () => {
        ui.section = sec.id;
        paintChips();
      });
      sections.appendChild(b);
    }
    ui.chips.appendChild(sections);
    const row = el("div", "zitems");
    const eq = eqOf(edit);
    if (ui.section === "model") {
      const groups = {};
      for (const model of assets.models) {
        (groups[model.group] || (groups[model.group] = [])).push(model);
      }
      for (const [group, list] of Object.entries(groups)) {
        row.appendChild(el("div", "zgroup", group));
        for (const model of list) {
          const on = panes[edit] && panes[edit].model.id === model.id;
          const b = el("button", "zchip" + (on ? " on" : ""), model.name);
          b.type = "button";
          b.addEventListener("click", () => {
            setModel(edit, model.id).then(() => {
              saveSoon();
              paintChips();
            });
          });
          row.appendChild(b);
        }
      }
    } else if (ui.section === "looks") {
      for (const preset of catalog.presets) {
        const b = el("button", "zchip", preset.name);
        b.type = "button";
        b.addEventListener("click", () => {
          const next = Object.assign(defaults(), preset.eq || {});
          if (edit === "b") eqB = next;
          else eqA = next;
          applyPane(edit);
          refreshGui();
          paintChips();
          paintBar();
          saveSoon();
        });
        row.appendChild(b);
      }
      const name = el("input", "zname");
      name.placeholder = "Favorite name";
      name.maxLength = 32;
      const save = el("button", "zchip", "SAVE LOOK");
      save.type = "button";
      save.addEventListener("click", () => {
        const title = (name.value || "Look").trim();
        writeFav("character", title, Object.assign({}, eqOf(edit)));
        paintChips();
      });
      row.appendChild(name);
      row.appendChild(save);
      const favs = readFavs("character");
      for (const [title, saved] of Object.entries(favs)) {
        const b = el("button", "zchip", title);
        b.type = "button";
        b.addEventListener("click", () => {
          const next = Object.assign(defaults(), saved);
          if (edit === "b") eqB = next;
          else eqA = next;
          applyPane(edit);
          refreshGui();
          paintChips();
          paintBar();
        });
        row.appendChild(b);
      }
    } else {
      const sec = catalog.sections.find((s) => s.id === ui.section);
      for (const slot of sec && sec.slots || []) {
        const spec = catalog.slots[slot];
        if (!spec) continue;
        row.appendChild(el("div", "zgroup", spec.name));
        for (const opt of spec.options) {
          const on = eq[slot] === opt.id;
          const b = el("button", "zchip" + (on ? " on" : ""), opt.name);
          b.type = "button";
          if (opt.color) b.style.setProperty("--swatch", opt.color);
          b.addEventListener("click", () => {
            eq[slot] = opt.id;
            if (ui.ctrls[slot]) {
              ui.silent = true;
              ui.ctrls[slot].setValue(opt.id);
              ui.silent = false;
            }
            applyPane(edit);
            paintChips();
            paintBar();
            saveSoon();
          });
          row.appendChild(b);
        }
      }
    }
    ui.chips.appendChild(row);
    const panesRow = el("div", "zitems");
    for (const id of ["a", "b"]) {
      const b = el("button", "zchip" + (edit === id ? " on" : ""), "EDIT " + id.toUpperCase());
      b.type = "button";
      b.disabled = id === "b" && !compare;
      b.addEventListener("click", () => {
        edit = id;
        refreshGui();
        paintChips();
        paintBar();
      });
      panesRow.appendChild(b);
    }
    ui.chips.appendChild(panesRow);
  }
  function refreshGui() {
    if (!gui) return;
    const eq = eqOf(edit);
    ui.silent = true;
    for (const [slot, ctrl] of Object.entries(ui.ctrls)) {
      if (eq[slot] != null) ctrl.setValue(eq[slot]);
    }
    ui.silent = false;
  }
  function buildGui() {
    gui = new GUI({ container: ui.gui, title: "OPTIONS", autoPlace: false });
    gui.domElement.style.width = "100%";
    ui.viewEq = Object.assign({}, eqA);
    ui.ctrls = {};
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      const choices = {};
      for (const opt of spec.options) choices[opt.name] = opt.id;
      ui.ctrls[slot] = gui.add(ui.viewEq, slot, choices).name(spec.name).onChange((value) => {
        if (ui.silent) return;
        eqOf(edit)[slot] = value;
        applyPane(edit);
        paintChips();
        paintBar();
        saveSoon();
      });
    }
    const view = { light: lightId, speed, wire, bones: bonesOn, grid: gridOn };
    ui.view = view;
    const lights = {};
    for (const lit of catalog.lights) lights[lit.name] = lit.id;
    gui.add(view, "light", lights).name("LIGHT").onChange((id) => pickLight(id));
    gui.add(view, "speed", { "\xBC": 0.25, "\xBD": 0.5, "1\xD7": 1, "2\xD7": 2 }).name("SPEED").onChange((v) => {
      speed = Number(v);
      if (panes.a) panes.a.mixer.timeScale = speed;
      if (panes.b) panes.b.mixer.timeScale = speed;
    });
    gui.add(view, "wire").name("WIRE").onChange((v) => {
      wire = !!v;
      if (panes.a) setWire(panes.a.root, wire);
      if (panes.b) setWire(panes.b.root, wire);
    });
    gui.add(view, "bones").name("BONES").onChange((v) => {
      bonesOn = !!v;
    });
    gui.add(view, "grid").name("GRID").onChange((v) => {
      gridOn = !!v;
      stage.grid.visible = gridOn;
      stage.rings.visible = gridOn;
      stage.ruler.visible = gridOn;
    });
  }
  function pickLight(id) {
    lightId = id;
    const preset = catalog.lights.find((l) => l.id === id) || catalog.lights[0];
    stage.setLights(preset);
    if (ui.view) ui.view.light = id;
  }
  function pickAngle(id) {
    const angle = catalog.angles.find((a) => a.id === id) || catalog.angles[0];
    angleId = angle.id;
    stage.setAngle(angle.azimuth, angle.polar);
    for (const btn of ui.angles.querySelectorAll("button")) btn.classList.toggle("on", btn.dataset.id === angle.id);
  }
  function fillClips() {
    clear(ui.clips);
    const inst = panes.a;
    const clips = inst && inst.clips || [];
    if (!clips.length) {
      ui.clips.appendChild(el("span", "zmeta", "No clip"));
      return;
    }
    for (const clip of clips) {
      const b = el("button", "zchip" + (inst.clip === clip ? " on" : ""), clipTitle(clip));
      b.type = "button";
      b.addEventListener("click", () => {
        inst.mixer.stopAllAction();
        const action = inst.mixer.clipAction(clip);
        action.play();
        inst.mixer.setTime(0);
        inst.clip = clip;
        inst.action = action;
        playing = true;
        ui.play.textContent = "PAUSE";
        fillClips();
      });
      ui.clips.appendChild(b);
    }
  }
  function updateBones() {
    if (boneLines) {
      stage.scene.remove(boneLines);
      boneLines.geometry && boneLines.geometry.dispose();
      boneLines.material && boneLines.material.dispose();
      boneLines = null;
    }
    if (!bonesOn || !panes[edit]) return;
    const root = panes[edit].root;
    root.updateMatrixWorld(true);
    const pos = [];
    const a = new Vector3();
    const b = new Vector3();
    root.traverse((o) => {
      if (!o.isBone || !o.parent || !o.parent.isBone) return;
      o.parent.getWorldPosition(a);
      o.getWorldPosition(b);
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });
    if (!pos.length) return;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    boneLines = new LineSegments(geo, new LineBasicMaterial({ color: 4122367 }));
    boneLines.frustumCulled = false;
    stage.scene.add(boneLines);
  }
  function showPanes(which) {
    if (panes.a) panes.a.wrapper.visible = which !== "b";
    if (panes.b) panes.b.wrapper.visible = compare && which !== "a";
    if (boneLines) boneLines.visible = which !== "b";
  }
  function layout() {
    host.innerHTML = "";
    const spin = el("div", "zspin");
    const stageHost = el("div", "zstage");
    ui.ruler = el("div", "zruler");
    ui.angles = el("div", "zangles");
    ui.scrub = el("div", "zscrub");
    ui.clips = el("div", "zclips");
    const menu = el("aside", "zmenu");
    ui.status = el("div", "zstatus", "Loading characters\u2026");
    ui.chips = el("div", "zchips");
    ui.gui = el("div", "zgui");
    ui.bar = el("pre", "zbar");
    stageHost.append(ui.ruler, ui.angles, ui.scrub);
    ui.scrub.append(ui.clips);
    menu.append(ui.status, ui.chips, ui.gui, ui.bar);
    spin.append(stageHost, menu);
    host.appendChild(spin);
    stage = createStage(stageHost, { fov: 38, bg: 14149362, rings: [0.5, 0.8, 1.1], grid: 4, ellie: 1.5 });
    stage.beforePane = showPanes;
    stage.onTick = (dt) => {
      if (playing) {
        if (panes.a) panes.a.mixer.update(dt);
        if (compare && panes.b) panes.b.mixer.update(dt);
      }
      updateBones();
      const inst = panes.a;
      if (inst) {
        const h = inst.height * (inst.wrapper.scale.y || 1);
        ui.ruler.textContent = "Ellie " + scale.ellie.toFixed(2) + " m \xB7 this " + h.toFixed(2) + " m \xB7 f" + Math.round(inst.mixer.time * 30);
      }
    };
    for (const angle of catalog.angles) {
      const b = el("button", "zbtn" + (angle.id === angleId ? " on" : ""), angle.name);
      b.type = "button";
      b.dataset.id = angle.id;
      b.addEventListener("click", () => pickAngle(angle.id));
      ui.angles.appendChild(b);
    }
    const turnBtn = el("button", "zbtn on", "TURN");
    turnBtn.type = "button";
    turnBtn.addEventListener("click", () => {
      turn = !turn;
      stage.setTurn(turn);
      turnBtn.classList.toggle("on", turn);
    });
    ui.angles.appendChild(turnBtn);
    ui.play = el("button", "zbtn on", "PAUSE");
    ui.play.type = "button";
    ui.play.addEventListener("click", () => {
      playing = !playing;
      ui.play.textContent = playing ? "PAUSE" : "PLAY";
      ui.play.classList.toggle("on", playing);
    });
    const range = el("input", "zrange");
    range.type = "range";
    range.min = "0";
    range.max = "1";
    range.step = "0.001";
    range.value = "0";
    range.addEventListener("input", () => {
      playing = false;
      ui.play.textContent = "PLAY";
      ui.play.classList.remove("on");
      const inst = panes.a;
      if (!inst || !inst.clip) return;
      inst.mixer.setTime(Number(range.value) * inst.clip.duration);
    });
    ui.scrub.append(ui.play, range);
    const compareBtn = el("button", "zbtn", "COMPARE");
    compareBtn.type = "button";
    compareBtn.addEventListener("click", () => toggleCompare());
    const ellieBtn = el("button", "zbtn", "WITH ELLIE");
    ellieBtn.type = "button";
    ellieBtn.addEventListener("click", () => withEllie());
    const overBtn = el("button", "zbtn", "OVERLAY");
    overBtn.type = "button";
    overBtn.addEventListener("click", () => {
      overlay = !overlay;
      stage.setOverlay(overlay);
      overBtn.classList.toggle("on", overlay);
      setOverlayMats(panes.b, overlay);
      showPanes(overlay ? "both" : "a");
    });
    const shot = el("button", "zbtn", "SAVE SHOT");
    shot.type = "button";
    shot.addEventListener("click", () => capture(true));
    ui.angles.append(compareBtn, ellieBtn, overBtn, shot);
    ui.compareBtn = compareBtn;
    ui.overBtn = overBtn;
    ui.section = "model";
    buildGui();
    pickLight(lightId);
    pickAngle(angleId);
    stage.setTurn(turn);
  }
  async function toggleCompare() {
    compare = !compare;
    stage.setCompare(compare);
    ui.compareBtn.classList.toggle("on", compare);
    if (compare && !panes.b) {
      const id = panes.a && panes.a.model.id === "ellie" ? "fox" : "ellie";
      eqB = defaults();
      await setModel("b", id);
    }
    showPanes("a");
    paintChips();
  }
  async function withEllie() {
    compare = true;
    stage.setCompare(true);
    ui.compareBtn.classList.add("on");
    const id = panes.a && panes.a.model.id === "ellie" ? "fox" : "ellie";
    if (!eqB) eqB = defaults();
    await setModel("b", id);
    showPanes("a");
    paintChips();
  }
  function setOverlayMats(inst, on) {
    if (!inst) return;
    inst.root.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m) continue;
        if (on) {
          if (m.userData.over == null) m.userData.over = m.opacity;
          m.transparent = true;
          m.opacity = 0.45;
          m.depthWrite = false;
        } else if (m.userData.over != null) {
          m.opacity = m.userData.src ? m.userData.src.opacity : m.userData.over;
          m.transparent = m.userData.src ? m.userData.src.transparent : false;
          m.depthWrite = m.userData.src ? m.userData.src.depthWrite : true;
          delete m.userData.over;
        }
      }
    });
  }
  function capture(download) {
    showPanes(overlay ? "both" : "a");
    stage.render();
    const label = makeLabel();
    const shot = shotLabel(stage.canvas, label);
    ui.status.dataset.shot = label;
    if (download) {
      const a = document.createElement("a");
      a.href = shot.url;
      a.download = label.replace(/[^\w.]+/g, "-").replace(/^-|-$/g, "") + ".png";
      a.click();
    }
    return { label, url: shot.url, bright: shot.bright };
  }
  async function gameMatch() {
    await setModel("a", "ellie");
    eqA = defaults();
    applyPane("a");
    const wasCompare = compare;
    compare = false;
    stage.setCompare(false);
    stage.hold(true);
    const wrap = panes.a.wrapper;
    const savedRot = wrap.rotation.y;
    const savedFov = stage.camera.fov;
    const savedNear = stage.camera.near;
    stage.grid.visible = false;
    stage.rings.visible = false;
    stage.ruler.visible = false;
    if (boneLines) boneLines.visible = false;
    if (panes.b) panes.b.wrapper.visible = false;
    wrap.visible = true;
    wrap.rotation.y = Math.PI;
    wrap.position.set(0, 0, 0);
    const clip = clipNamed(panes.a.clips, "idle") || panes.a.clips[0];
    if (clip) {
      panes.a.mixer.stopAllAction();
      const action = panes.a.mixer.clipAction(clip);
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.play();
      panes.a.clip = clip;
      panes.a.action = action;
      panes.a.mixer.setTime(0.15 * clip.duration);
      panes.a.root.updateMatrixWorld(true);
    }
    const preset = catalog.lights.find((l) => l.id === "game");
    stage.setLights(preset);
    const height = 1.55;
    const lookY = height * 0.48;
    const fov = 38;
    const dist = height / (2 * Math.tan(MathUtils.degToRad(fov) / 2)) * 1.42;
    stage.renderer.setPixelRatio(1);
    stage.renderer.setSize(520, 760, false);
    stage.renderer.setScissorTest(false);
    stage.renderer.setViewport(0, 0, 520, 760);
    stage.camera.fov = fov;
    stage.camera.near = 0.08;
    stage.camera.far = 80;
    stage.camera.aspect = 520 / 760;
    stage.camera.position.set(0, lookY, dist);
    stage.camera.lookAt(0, lookY, 0);
    stage.camera.updateProjectionMatrix();
    stage.renderer.render(stage.scene, stage.camera);
    const url = stage.canvas.toDataURL("image/png");
    const measure = measureActor(panes.a.root);
    wrap.rotation.y = savedRot;
    stage.camera.fov = savedFov;
    stage.camera.near = savedNear;
    stage.grid.visible = gridOn;
    stage.rings.visible = gridOn;
    stage.ruler.visible = gridOn;
    compare = wasCompare;
    stage.setCompare(compare);
    pickLight(lightId);
    pickAngle(angleId);
    stage.resize();
    stage.hold(false);
    return { url, measure };
  }
  function saveSoon() {
    if (ctx && ctx.onSave) ctx.onSave();
  }
  function settings() {
    return {
      modelA: panes.a && panes.a.model.id,
      modelB: panes.b && panes.b.model.id,
      eqA: Object.assign({}, eqA),
      eqB: eqB ? Object.assign({}, eqB) : null,
      light: lightId,
      angle: angleId,
      speed,
      wire,
      bones: bonesOn,
      grid: gridOn,
      compare,
      overlay,
      turn,
      edit
    };
  }
  async function applySettings(s) {
    if (!s) return;
    if (s.eqA) eqA = Object.assign(defaults(), s.eqA);
    if (s.eqB) eqB = Object.assign(defaults(), s.eqB);
    if (s.modelA) await setModel("a", s.modelA);
    if (s.compare && s.modelB) {
      compare = true;
      stage.setCompare(true);
      ui.compareBtn.classList.add("on");
      await setModel("b", s.modelB);
    }
    applyPane("a");
    if (panes.b) applyPane("b");
    if (s.light) pickLight(s.light);
    if (s.angle) pickAngle(s.angle);
    if (s.speed) speed = s.speed;
    wire = !!s.wire;
    bonesOn = !!s.bones;
    if (s.grid != null) {
      gridOn = !!s.grid;
      stage.grid.visible = gridOn;
      stage.rings.visible = gridOn;
      stage.ruler.visible = gridOn;
    }
    turn = s.turn != null ? !!s.turn : turn;
    stage.setTurn(turn);
    overlay = !!s.overlay;
    stage.setOverlay(overlay);
    edit = s.edit === "b" ? "b" : "a";
    refreshGui();
    paintChips();
    paintBar();
  }
  async function setView(opts) {
    opts = opts || {};
    if (opts.model) await setModel("a", opts.model);
    if (opts.eq) {
      eqA = Object.assign(defaults(), opts.eq);
      applyPane("a");
    }
    if (opts.compare) {
      compare = true;
      stage.setCompare(true);
      ui.compareBtn.classList.add("on");
      if (!eqB) eqB = defaults();
      if (opts.eqB) eqB = Object.assign(defaults(), opts.eqB);
      await setModel("b", opts.compare);
    } else if (opts.compare === false) {
      compare = false;
      stage.setCompare(false);
      ui.compareBtn.classList.remove("on");
    }
    if (opts.overlay != null) {
      overlay = !!opts.overlay;
      stage.setOverlay(overlay);
      ui.overBtn.classList.toggle("on", overlay);
    }
    if (opts.light) pickLight(opts.light);
    if (opts.angle) pickAngle(opts.angle);
    if (opts.turn != null) {
      turn = !!opts.turn;
      stage.setTurn(turn);
    }
    if (opts.scrub != null && panes.a && panes.a.clip) {
      playing = false;
      ui.play.textContent = "PLAY";
      panes.a.mixer.setTime(Number(opts.scrub) * panes.a.clip.duration);
    }
    if (opts.play != null) playing = !!opts.play;
    showPanes(overlay ? "both" : "a");
    paintChips();
    paintBar();
  }
  function angDelta(a, b) {
    let d = Math.abs(a - b) % (Math.PI * 2);
    if (d > Math.PI) d = Math.PI * 2 - d;
    return d;
  }
  async function sweep() {
    const fails = [];
    const notes = [];
    const before = errors.length;
    stage.setTurn(false);
    playing = false;
    compare = false;
    stage.setCompare(false);
    for (const model of assets.models) {
      try {
        const inst = await setModel("a", model.id);
        if (!inst) continue;
        if (inst.missing) {
          notes.push(model.id + " not in this build");
          continue;
        }
      } catch (err2) {
        if (model.optional) {
          notes.push(model.id + " skipped");
          continue;
        }
        fails.push(model.id + " load " + (err2 && err2.message || err2));
        continue;
      }
      eqA = defaults();
      applyPane("a");
      panes.a.mixer.update(1 / 60);
      const bad0 = scanFinite(panes.a.wrapper).concat(scanMaps(panes.a.root));
      if (bad0.length) fails.push(model.id + " base " + bad0.join(","));
      const base = lookSnapshot(panes.a.root, panes.a.wrapper);
      for (const [slot, spec] of Object.entries(catalog.slots)) {
        for (const opt of spec.options) {
          eqA = defaults();
          eqA[slot] = opt.id;
          try {
            applyPane("a");
            panes.a.mixer.update(1 / 60);
          } catch (err2) {
            fails.push(model.id + " " + slot + "=" + opt.id + " " + (err2 && err2.message || err2));
            continue;
          }
          const bad = scanFinite(panes.a.wrapper).concat(scanMaps(panes.a.root));
          if (bad.length) fails.push(model.id + " " + slot + "=" + opt.id + " " + bad.join(","));
        }
      }
      const mixed = defaults();
      for (const [slot, spec] of Object.entries(catalog.slots)) {
        const alt = spec.options.find((o) => o.id !== catalog.defaults[slot]);
        if (alt) mixed[slot] = alt.id;
      }
      eqA = mixed;
      applyPane("a");
      panes.a.mixer.update(1 / 60);
      const mixedBad = scanFinite(panes.a.wrapper).concat(scanMaps(panes.a.root));
      if (mixedBad.length) fails.push(model.id + " mixed " + mixedBad.join(","));
      const mixedSnap = lookSnapshot(panes.a.root, panes.a.wrapper);
      eqA = defaults();
      applyPane("a");
      const back = lookSnapshot(panes.a.root, panes.a.wrapper);
      if (back !== base) fails.push(model.id + " leftover after reset");
      if (mixedSnap === base) notes.push(model.id + " mixed look matched the default (check that options are visible)");
    }
    await setModel("a", "ellie");
    eqA = defaults();
    applyPane("a");
    if (!eqB) eqB = defaults();
    await setModel("b", "fox");
    compare = true;
    stage.setCompare(true);
    stage.setAngle(0.5, 1.1);
    stage.setAngle(1.15, 0.95);
    const sync = stage.syncState();
    if (angDelta(sync.thetaA, sync.thetaB) > 0.02 || angDelta(sync.phiA, sync.phiB) > 0.02 || Math.abs(sync.radiusA - sync.radiusB) > 0.05) {
      fails.push("compare cameras drifted " + JSON.stringify(sync));
    }
    compare = false;
    stage.setCompare(false);
    playing = false;
    if (panes.a && panes.a.clip) panes.a.mixer.setTime(0);
    pickAngle("front");
    const shot = capture(false);
    const expect = makeLabel();
    if (shot.label !== expect) fails.push("shot label " + shot.label + " != " + expect);
    if (!(shot.bright > 8)) fails.push("shot label did not draw (" + shot.bright + " px)");
    const fresh = errors.slice(before).filter((e) => !/skin weight/i.test(e));
    for (const e of fresh) fails.push("error " + e);
    stage.setTurn(turn);
    playing = true;
    return { fails, notes, label: shot.label, sync, errors: fresh };
  }
  function publish() {
    const api = {
      id: "character",
      sweep,
      capture,
      gameMatch,
      setView,
      syncState: () => stage ? stage.syncState() : null,
      frames: () => stage ? stage.samples() : [],
      measure: () => panes.a ? measureActor(panes.a.root) : null,
      errors: () => errors.slice()
    };
    if (window.__SPIN) window.__SPIN.character = api;
    return api;
  }
  return {
    id: "character",
    title: "CHARACTERS",
    async mount(container, context) {
      alive = true;
      host = container;
      ctx = context || { onSave() {
      } };
      unhook = hookErrors();
      try {
        catalog = await fetchJson(devUrl("catalogs/character.json"));
        assets = await fetchJson(devUrl("assets.json"));
        scale = await fetchJson(devUrl("scale.json"));
        try {
          const res = await fetch(repoUrl(catalog.anatomy.checker));
          checkerNote = res.ok ? "Anatomy checker file is in this branch. Numbers below use the same metre rules." : "Anatomy checker file was not found. Numbers below are the live metre rules.";
        } catch (err2) {
          checkerNote = "Anatomy checker file was not found. Numbers below are the live metre rules.";
        }
        eqA = defaults();
        eqB = defaults();
        layout();
        const first = pending && pending.modelA || "ellie";
        await setModel("a", first);
        if (pending) await applySettings(pending);
        pending = null;
        ready = true;
        paintChips();
        paintBar();
        publish();
        if (ctx.signal) ctx.signal.addEventListener("abort", () => this.unmount());
      } catch (err2) {
        this.unmount();
        throw err2;
      }
    },
    unmount() {
      if (!alive && !stage) return;
      alive = false;
      ready = false;
      try {
        unhook();
      } catch (err2) {
      }
      disposeInstance(panes.a);
      disposeInstance(panes.b);
      panes.a = null;
      panes.b = null;
      if (gui) {
        gui.destroy();
        gui = null;
      }
      if (stage) {
        stage.dispose();
        stage = null;
      }
      if (host) host.innerHTML = "";
      for (const rec of templates.values()) {
        rec.root.traverse((o) => {
          if (o.geometry && o.geometry.dispose) o.geometry.dispose();
          if (!o.isMesh) return;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if (m && m.dispose) m.dispose();
          });
        });
      }
      templates.clear();
    },
    save() {
      return settings();
    },
    load(settingsIn) {
      if (!ready) {
        pending = settingsIn;
        return;
      }
      applySettings(settingsIn);
    }
  };
}
export {
  createModule
};
/*! Bundled license information:

three/examples/jsm/libs/fflate.module.js:
  (*!
  fflate - fast JavaScript compression/decompression
  <https://101arrowz.github.io/fflate>
  Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
  version 0.8.2
  *)
*/
