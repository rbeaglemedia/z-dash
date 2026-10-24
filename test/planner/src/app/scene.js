// Lane: scene, camera, renderer, lights and effects.
import { ESP } from './runtime.js';
import { BRAND, hex } from '../brand.js';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MAX } from '../grid.js';
import { wallBounds } from '../walls.js';


ESP.R.setPixelRatio(Math.min(devicePixelRatio, 2));
ESP.scene = new THREE.Scene(),
  ESP.camera = new THREE.PerspectiveCamera(40, 1, 0.3, 8e3);
ESP.scene.add(new THREE.HemisphereLight(16777215, 2241348, 1.7));
ESP.sun = new THREE.DirectionalLight(16777215, 1.3);
ESP.sun.position.set(30, 60, 20);
ESP.scene.add(ESP.sun);
ESP.ground = new THREE.Mesh(new THREE.PlaneGeometry(MAX, MAX), new THREE.MeshLambertMaterial({
  color: 858664
}));
ESP.ground.rotation.x = -Math.PI / 2;
ESP.ground.position.y = -0.02;
ESP.scene.add(ESP.ground);
ESP.grid1 = new THREE.GridHelper(MAX, MAX, 2771560, 1716296);
ESP.grid1.position.y = 1e-3;
ESP.scene.add(ESP.grid1);
ESP.grid10 = new THREE.GridHelper(MAX, MAX / 10, 2771560, 2771560);
ESP.grid10.position.y = 0.012;
ESP.grid10.visible = false;
ESP.scene.add(ESP.grid10);
ESP.grid100 = new THREE.GridHelper(MAX, MAX / 100, 2771560, 2771560);
ESP.grid100.position.y = 0.014;
ESP.grid100.visible = false;
ESP.scene.add(ESP.grid100);
ESP.floorG = new THREE.Group();
ESP.scene.add(ESP.floorG);
ESP.floorTex = new THREE.DataTexture(new Uint8Array(16), 2, 2);
ESP.floorTex.magFilter = ESP.floorTex.minFilter = THREE.NearestFilter;
ESP.floorTex.wrapS = ESP.floorTex.wrapT = THREE.RepeatWrapping;
ESP.floorTex.repeat.set(0.5, 0.5);
ESP.floorTex.colorSpace = THREE.SRGBColorSpace;
ESP.setFloorColors = function setFloorColors(e, t) {
  const n = ESP.floorTex.image.data,
    a = new THREE.Color(e),
    o = new THREE.Color(t);
  [a, o, o, a].forEach((s, l) => {
    n[l * 4] = Math.round(s.r * 255), n[l * 4 + 1] = Math.round(s.g * 255), n[l * 4 + 2] = Math.round(s.b * 255), n[l * 4 + 3] = 255;
  }), ESP.floorTex.needsUpdate = true;
}
ESP.floorMat = new THREE.MeshLambertMaterial({
  color: 16777215,
  map: ESP.floorTex
});
new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
ESP.dotGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 20),
  ESP.dotMat = new THREE.MeshBasicMaterial({
    color: ESP.HL
  }),
  ESP.dotStartMat = new THREE.MeshBasicMaterial({
    color: ESP.AC
  }),
  ESP.cursorDot = new THREE.Mesh(ESP.dotGeo, new THREE.MeshBasicMaterial({
    color: ESP.HL,
    transparent: true,
    opacity: 0.6
  }));
ESP.cursorDot.visible = false;
ESP.scene.add(ESP.cursorDot);
ESP.doorGhost = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({
  color: 8381439,
  transparent: true,
  opacity: 0.55,
  depthWrite: false
}));
ESP.doorGhost.visible = false;
ESP.doorGhost.renderOrder = 4;
ESP.scene.add(ESP.doorGhost);
ESP.handlesG = new THREE.Group();
ESP.scene.add(ESP.handlesG);
ESP.venueG = new THREE.Group();
ESP.scene.add(ESP.venueG);
ESP.fillG = new THREE.Group();
ESP.scene.add(ESP.fillG);
ESP.fillOpen = false;
ESP.fG = {
  carpet: new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20).translate(0, 0.5, 0)
};
ESP.fG.chair = mergeGeometries([new THREE.BoxGeometry(1.4, 0.15, 1.4).translate(0, 1.5, 0), new THREE.BoxGeometry(1.4, 1.4, 0.12).translate(0, 2.2, -0.64)]);
ESP.vcol = (e, t) => {
    const n = new THREE.Color(t),
      a = e.attributes.position.count,
      o = new Float32Array(a * 3);
    for (let s = 0; s < a; s++) o[s * 3] = n.r, o[s * 3 + 1] = n.g, o[s * 3 + 2] = n.b;
    return e.setAttribute("color", new THREE.BufferAttribute(o, 3)), e;
  },
  ESP.nI = e => e.index ? e.toNonIndexed() : e;
ESP.fG.chairHi = mergeGeometries([ESP.vcol(ESP.nI(new THREE.BoxGeometry(1.4, 0.18, 1.3).translate(0, 1.5, 0.08)), 4872294), ESP.vcol(ESP.nI(new THREE.BoxGeometry(1.36, 1.25, 0.14).rotateX(-0.08).translate(0, 2.25, -0.62)), 4872294), ESP.vcol(ESP.nI(new THREE.BoxGeometry(1.42, 0.06, 0.06).translate(0, 2.9, -0.66)), 13225686), ...[[-0.62, 0.55], [0.62, 0.55], [-0.62, -0.62], [0.62, -0.62]].map(([e, t]) => ESP.vcol(ESP.nI(new THREE.BoxGeometry(0.07, 1.42, 0.07).translate(e, 0.71, t)), 13225686)), ...[-0.62, 0.62].map(e => ESP.vcol(ESP.nI(new THREE.BoxGeometry(0.05, 0.05, 1.15).translate(e, 0.35, -0.03)), 13225686))]);
ESP.fG.roundHi = mergeGeometries([ESP.vcol(ESP.nI(new THREE.LatheGeometry([[0, 1], [0.5, 1], [0.505, 0.985], [0.52, 0.02], [0.52, 0], [0, 0]].map(([e, t]) => new THREE.Vector2(e, t)), 32)), 16184559), ESP.vcol(ESP.nI(new THREE.CylinderGeometry(0.48, 0.48, 4e-3, 32).translate(0, 1.002, 0)), 16777215)]);
ESP.FILL_HI_MAX = 3e3;
ESP.fillHiLast = null;
ESP.fM = {
    chairV: new THREE.MeshLambertMaterial({
      vertexColors: true
    }),
    roundV: new THREE.MeshLambertMaterial({
      vertexColors: true
    }),
    stageSkirt: new THREE.MeshLambertMaterial({
      color: 1382429
    }),
    carpet: new THREE.MeshLambertMaterial({
      color: 16777215
    }),
    panel: new THREE.MeshLambertMaterial({
      color: 14212579
    }),
    table: new THREE.MeshLambertMaterial({
      color: 15921128
    }),
    chair: new THREE.MeshLambertMaterial({
      color: 4872294
    }),
    stage: new THREE.MeshLambertMaterial({
      color: 2830138
    })
  },
  ESP.BOOTH_COL = {
    i: 4026288,
    c: 3120783,
    p: 13208110,
    s: 11554938
  },
  ESP.ZONE_COL = {
    reg: 2941126,
    fnb: 16757575,
    stage: 11832575,
    lounge: 8377195,
    buffet: 16757575,
    av: 7317759
  };
ESP.fillKey = "";
ESP.ghostG = new THREE.Group();
ESP.scene.add(ESP.ghostG);
ESP.colBoxGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
  ESP.colCylGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16).translate(0, 0.5, 0),
  ESP.boxPadGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
  ESP.colMat = new THREE.MeshLambertMaterial({
    color: 10134445
  }),
  ESP.boxPadMat = new THREE.MeshBasicMaterial({
    color: 16762941
  }),
  ESP.COL_H = 9;
ESP.venueKey = "";
ESP.wallsG = new THREE.Group();
ESP.scene.add(ESP.wallsG);
ESP.doorsG = new THREE.Group();
ESP.scene.add(ESP.doorsG);
ESP.dockMat = new THREE.MeshBasicMaterial({
    color: 15901498
  }),
  ESP.lintelMat = new THREE.MeshBasicMaterial({
    color: 9067036
  }),
  ESP.svcMat = new THREE.MeshBasicMaterial({
    color: 8359846
  }),
  ESP.doorEndMat = new THREE.MeshBasicMaterial({
    color: 16765503
  });
ESP.doorDrag = null,
  ESP.ghostAt = null;
ESP.doorMat = new THREE.MeshBasicMaterial({
    color: 15328472,
    transparent: true,
    opacity: 0.85
  }),
  ESP.doorSelMat = new THREE.MeshBasicMaterial({
    color: ESP.HL
  }),
  ESP.unitBox = new THREE.BoxGeometry(1, 1, 1),
  ESP.wallMat = new THREE.MeshLambertMaterial({
    color: 14275786
  }),
  ESP.wallSelMat = new THREE.MeshLambertMaterial({
    color: ESP.HL
  }),
  ESP.fenceMat = new THREE.MeshLambertMaterial({
    color: 16052198
  }),
  ESP.WALL_H = 1.5,
  ESP.wallOkMat = new THREE.MeshLambertMaterial({
    color: 2278750
  }),
  ESP.wallBadMat = new THREE.MeshLambertMaterial({
    color: 15680580
  }),
  ESP.midMat = new THREE.MeshBasicMaterial({
    color: ESP.AC
  }),
  ESP.midGeo = new THREE.BoxGeometry(0.5, 0.2, 1.5);
ESP.fx = null;
ESP.fxMat = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    depthWrite: false
  }),
  ESP.FX_COLORS = [BRAND.colors.action, BRAND.colors.accent, "#ffffff", BRAND.colors.highlight].map(e => new THREE.Color(e)),
  ESP.reducedMotion = () => {
    try {
      return matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  };
ESP.burst = function burst(e, t, n = 110) {
  if (ESP.endFx(), ESP.reducedMotion()) return;
  const a = new Float32Array(n * 3),
    o = new Float32Array(n * 3),
    s = new Float32Array(n * 3);
  for (let r = 0; r < n; r++) {
    const h = Math.random() * Math.PI * 2,
      y = 0.3 + Math.random() * 0.7,
      f = ESP.FX_COLORS[r % 4];
    a.set([e, 2, t], r * 3), s.set([Math.cos(h) * y * 13, 10 + Math.random() * 10, Math.sin(h) * y * 13], r * 3), o.set([f.r, f.g, f.b], r * 3);
  }
  const l = new THREE.BufferGeometry();
  l.setAttribute("position", new THREE.BufferAttribute(a, 3)), l.setAttribute("color", new THREE.BufferAttribute(o, 3));
  const i = new THREE.Points(l, ESP.fxMat);
  i.frustumCulled = false, ESP.scene.add(i), ESP.fx = {
    pts: i,
    vel: s,
    t: performance.now(),
    last: performance.now()
  }, ESP.fxMat.opacity = 1, ESP.frame();
}
ESP.stepFx = function stepFx() {
  const e = performance.now(),
    t = (e - ESP.fx.t) / 1e3,
    n = Math.min(0.05, (e - ESP.fx.last) / 1e3);
  if (ESP.fx.last = e, t > 1.5) return ESP.endFx();
  const a = ESP.fx.pts.geometry.attributes.position,
    o = ESP.fx.vel;
  for (let s = 0; s < a.count; s++) o[s * 3 + 1] -= 26 * n, a.array[s * 3] += o[s * 3] * n, a.array[s * 3 + 1] = Math.max(0.05, a.array[s * 3 + 1] + o[s * 3 + 1] * n), a.array[s * 3 + 2] += o[s * 3 + 2] * n;
  a.needsUpdate = true, ESP.fxMat.opacity = Math.max(0, 1 - t / 1.5);
}
ESP.endFx = function endFx() {
  ESP.fx && (ESP.scene.remove(ESP.fx.pts), ESP.fx.pts.geometry.dispose(), ESP.fx = null);
}
ESP.celebrate = e => {
    if (!e || !e.closed) return;
    const t = wallBounds([e]);
    ESP.burst((t.minX + t.maxX) / 2, (t.minZ + t.maxZ) / 2), ESP.tone(660, 990, 0.18, 0.08);
  },
  ESP.rubber = new THREE.Mesh(ESP.unitBox, new THREE.MeshBasicMaterial({
    color: ESP.HL,
    transparent: true,
    opacity: 0.7
  }));
ESP.rubber.visible = false;
ESP.scene.add(ESP.rubber);
ESP.ghostWallMat = new THREE.MeshBasicMaterial({
    color: ESP.AC,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  }),
  ESP.closeGhosts = [0, 1].map(() => {
    const e = new THREE.Mesh(ESP.unitBox, ESP.ghostWallMat);
    return e.visible = false, ESP.scene.add(e), e;
  }),
  ESP.guideMat = new THREE.LineDashedMaterial({
    color: ESP.AC,
    dashSize: 0.8,
    gapSize: 0.5
  }),
  ESP.guides = [0, 1].map(() => {
    const e = new THREE.BufferGeometry();
    e.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(6), 3));
    const t = new THREE.Line(e, ESP.guideMat);
    return t.visible = false, t.frustumCulled = false, ESP.scene.add(t), t;
  }),
  ESP.itemsG = new THREE.Group();
ESP.scene.add(ESP.itemsG);
ESP.selMark = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
  color: 2278750,
  transparent: true,
  opacity: 0.45,
  depthWrite: false
}));
ESP.selMark.visible = false;
ESP.selMark.renderOrder = 2;
ESP.scene.add(ESP.selMark);
ESP.selRectGeo = ESP.selMark.geometry,
  ESP.selCircGeo = new THREE.CircleGeometry(0.5, 40).rotateX(-Math.PI / 2),
  ESP.hlItem = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
    color: ESP.AC,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  }));
ESP.hlItem.visible = false;
ESP.scene.add(ESP.hlItem);
ESP.hlSeg = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.12), new THREE.MeshBasicMaterial({
  color: ESP.AC,
  transparent: true,
  opacity: 0.55,
  depthWrite: false
}));
ESP.hlSeg.visible = false;
ESP.scene.add(ESP.hlSeg);
ESP.ENV_COL = {
  indoor: {
    a: 9081763,
    b: 8160662,
    bg: hex(BRAND.colors.bg),
    gr: 858664
  },
  outdoor: {
    a: 6265418,
    b: 5672003,
    bg: 1058874,
    gr: 1320474
  }
};
ESP.applyEnv = function applyEnv() {
  const e = ESP.ENV_COL[ESP.S.env];
  ESP.scene.background = new THREE.Color(e.bg), ESP.ground.material.color.set(e.gr), ESP.rebuild();
}
new THREE.Matrix4();
new THREE.Color();
