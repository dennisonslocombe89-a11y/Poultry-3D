import * as THREE from 'three';

/**
 * Procedural scene kit: textures, small builders and the detailed poultry house,
 * biogas digester, school and training hub used by ThreeStage.
 * Everything here is illustrative geometry - no dimensions or equipment schedules
 * are project facts.
 */

type Pos = { x: number; y: number; z: number };
export type FlockMember = { mesh: THREE.Object3D; phase: number };

const hexCss = (n: number) => '#' + n.toString(16).padStart(6, '0');

/* ---------------- textures ---------------- */
function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, rx = 1, ry = 1) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export const TEX = {
  corrugated: (base: string, rx = 6) =>
    canvasTex(128, 64, (g, w, h) => {
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 16) {
        const gr = g.createLinearGradient(x, 0, x + 16, 0);
        gr.addColorStop(0, 'rgba(255,255,255,0.26)');
        gr.addColorStop(0.5, 'rgba(255,255,255,0)');
        gr.addColorStop(1, 'rgba(0,0,0,0.28)');
        g.fillStyle = gr;
        g.fillRect(x, 0, 16, h);
      }
    }, rx, 1),
  plaster: (base: string, rx = 1, ry = 1) =>
    canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) {
        g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.045)';
        g.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2 + Math.random() * 5);
      }
    }, rx, ry),
  grass: () =>
    canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#688f4c';
      g.fillRect(0, 0, w, h);
      const tones = ['rgba(88,130,62,0.35)', 'rgba(118,160,86,0.28)', 'rgba(80,120,58,0.3)'];
      for (let i = 0; i < 240; i++) {
        g.fillStyle = tones[i % 3];
        g.beginPath();
        g.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 16, 4 + Math.random() * 9, Math.random() * 3, 0, Math.PI * 2);
        g.fill();
      }
    }, 9, 9),
  rows: (soil: string, crop: string, rx = 4, ry = 4) =>
    canvasTex(64, 64, (g, w, h) => {
      g.fillStyle = soil;
      g.fillRect(0, 0, w, h);
      g.fillStyle = crop;
      for (let y = 6; y < h; y += 16) g.fillRect(0, y, w, 6);
    }, rx, ry),
  mesh: (rx = 8, ry = 4) =>
    canvasTex(32, 32, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.strokeStyle = 'rgba(70,74,70,0.75)';
      g.lineWidth = 1.5;
      g.beginPath();
      for (let i = 0; i <= w; i += 8) {
        g.moveTo(i, 0); g.lineTo(i, h);
        g.moveTo(0, i); g.lineTo(w, i);
      }
      g.stroke();
    }, rx, ry),
  concrete: (rx = 2, ry = 2) =>
    canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = '#c4beae';
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 300; i++) {
        g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(60,50,30,0.07)';
        g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 4, 1 + Math.random() * 3);
      }
    }, rx, ry),
};

/* ---------------- primitive helpers ---------------- */
type StdMesh<G extends THREE.BufferGeometry = THREE.BufferGeometry> = THREE.Mesh<G, THREE.MeshStandardMaterial>;

export function edged<T extends THREE.Mesh>(mesh: T, color = 0x1b1710, opacity = 0.28): T {
  const e = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  );
  mesh.add(e);
  return mesh;
}

export function box(w: number, h: number, d: number, color: number, rough = 0.85): StdMesh<THREE.BoxGeometry> {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: rough }));
  m.castShadow = true;
  m.receiveShadow = true;
  if (Math.min(w, h, d) >= 0.09) edged(m);
  return m;
}

export function cyl(rt: number, rb: number, h: number, color: number, seg = 16, rough = 0.7): StdMesh<THREE.CylinderGeometry> {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), new THREE.MeshStandardMaterial({ color, roughness: rough }));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function cone(r: number, h: number, seg: number, color: number): StdMesh<THREE.ConeGeometry> {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
  m.castShadow = true;
  return m;
}

function texBox(w: number, h: number, d: number, map: THREE.Texture, rough = 0.85) {
  const m = box(w, h, d, 0xffffff, rough);
  m.material.map = map;
  m.material.needsUpdate = true;
  return m;
}

function table(w: number, h: number, d: number, color: number) {
  const grp = new THREE.Group();
  const top = box(w, 0.05, d, color, 0.6);
  top.position.y = h;
  grp.add(top);
  [[-w / 2 + 0.05, -d / 2 + 0.05], [w / 2 - 0.05, -d / 2 + 0.05], [-w / 2 + 0.05, d / 2 - 0.05], [w / 2 - 0.05, d / 2 - 0.05]].forEach((o) => {
    const leg = cyl(0.02, 0.02, h, 0x555555, 6);
    leg.position.set(o[0], h / 2, o[1]);
    grp.add(leg);
  });
  return grp;
}

export function signBoard(text: string, w: number, h: number, bg: string, fg: string, fontPx = 30) {
  const g = new THREE.Group();
  const tex = canvasTex(256, Math.round((256 * h) / w), (c, cw, ch) => {
    c.fillStyle = bg;
    c.fillRect(0, 0, cw, ch);
    c.strokeStyle = fg;
    c.lineWidth = 6;
    c.strokeRect(6, 6, cw - 12, ch - 12);
    c.fillStyle = fg;
    c.font = `bold ${fontPx}px Arial, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const lines = text.split('|');
    lines.forEach((line, i) => c.fillText(line, cw / 2, ch / 2 + (i - (lines.length - 1) / 2) * fontPx * 1.18));
  });
  const face = new THREE.MeshBasicMaterial({ map: tex });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(w, h), face);
  front.position.z = 0.026;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), face);
  back.rotation.y = Math.PI;
  back.position.z = -0.026;
  g.add(box(w + 0.05, h + 0.05, 0.04, 0x3b3a34, 0.8));
  g.add(front);
  g.add(back);
  return g;
}

function person(shirt: number, pants: number, skin: number, scale = 1) {
  const p = new THREE.Group();
  const legs = cyl(0.075, 0.085, 0.3, pants, 8); legs.position.y = 0.15; p.add(legs);
  const torso = cyl(0.09, 0.1, 0.3, shirt, 8); torso.position.y = 0.45; p.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshStandardMaterial({ color: skin, roughness: 0.8 }));
  head.position.y = 0.68; head.castShadow = true; p.add(head);
  [-1, 1].forEach((s) => {
    const arm = cyl(0.028, 0.028, 0.26, shirt, 6);
    arm.position.set(s * 0.13, 0.46, 0);
    arm.rotation.z = s * 0.12;
    p.add(arm);
  });
  p.scale.setScalar(scale);
  return p;
}

function fenceRun(parent: THREE.Object3D, x1: number, z1: number, x2: number, z2: number, color = 0xcbb27a) {
  const dx = x2 - x1, dz = z2 - z1, len = Math.sqrt(dx * dx + dz * dz);
  const n = Math.max(1, Math.round(len / 0.75));
  for (let i = 0; i <= n; i++) {
    const post = cyl(0.035, 0.035, 0.6, color, 6);
    post.position.set(x1 + (dx * i) / n, 0.3, z1 + (dz * i) / n);
    parent.add(post);
  }
  [0.22, 0.46].forEach((y) => {
    const rail = box(len, 0.03, 0.03, color, 0.7);
    rail.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
    rail.rotation.y = -Math.atan2(dz, dx);
    parent.add(rail);
  });
}

export function buildChicken(bodyColor: number) {
  const c = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), bodyMat);
  body.scale.set(1, 0.85, 1.3); body.position.y = 0.18; body.castShadow = true; c.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), bodyMat);
  head.position.set(0, 0.32, 0.2); head.castShadow = true; c.add(head);
  const comb = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 4), new THREE.MeshStandardMaterial({ color: 0xc0392b }));
  comb.position.set(0, 0.41, 0.2); c.add(comb);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.07, 4), new THREE.MeshStandardMaterial({ color: 0xe3a93a }));
  beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.31, 0.3); c.add(beak);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 4), bodyMat);
  tail.position.set(0, 0.3, -0.22); tail.rotation.x = -0.95; c.add(tail);
  [-1, 1].forEach((s) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 5), new THREE.MeshStandardMaterial({ color: 0xd98a3d }));
    leg.position.set(s * 0.06, 0.07, 0.02); c.add(leg);
  });
  return c;
}

/** Two-slope corrugated roof; local origin sits on the eave line. */
export function gableRoof(width: number, depth: number, ridgeHeight: number, overhang: number, roofColor: number) {
  const g = new THREE.Group();
  const halfDepth = depth / 2 + overhang;
  const halfWidthEx = width / 2 + overhang;
  const slopeLen = Math.sqrt(halfDepth * halfDepth + ridgeHeight * ridgeHeight);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.45, metalness: 0.15,
    map: TEX.corrugated(hexCss(roofColor), Math.max(3, Math.round((halfWidthEx * 2) / 0.32))),
  });
  [-1, 1].forEach((side) => {
    const eave = new THREE.Vector3(0, 0, side * halfDepth);
    const ridge = new THREE.Vector3(0, ridgeHeight, 0);
    const mid = eave.clone().add(ridge).multiplyScalar(0.5);
    const dir = ridge.clone().sub(eave).normalize();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(halfWidthEx * 2, 0.07, slopeLen), mat);
    panel.position.copy(mid);
    panel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    panel.castShadow = true;
    panel.receiveShadow = true;
    g.add(panel);
  });
  const cap = new THREE.Mesh(new THREE.BoxGeometry(halfWidthEx * 2 + 0.06, 0.12, 0.18), new THREE.MeshStandardMaterial({ color: 0x33403a, roughness: 0.6 }));
  cap.position.set(0, ridgeHeight, 0);
  cap.castShadow = true;
  g.add(cap);
  return g;
}

/* ---------------- planting ---------------- */
function palmTree(h: number, lean: number) {
  const g = new THREE.Group();
  const segs = 4;
  let x = 0, y = 0;
  for (let i = 0; i < segs; i++) {
    const seg = cyl(0.085 - i * 0.012, 0.11 - i * 0.012, h / segs, 0x8a6a45, 7);
    y += h / segs / 2;
    seg.position.set(x, y, 0);
    seg.rotation.z = -lean * 0.08;
    seg.castShadow = false;
    g.add(seg);
    y += h / segs / 2;
    x += (lean * 0.08 * h) / segs;
  }
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x4c8a3c, roughness: 0.8, flatShading: true });
  for (let f = 0; f < 7; f++) {
    const frond = new THREE.Mesh(new THREE.ConeGeometry(0.15, 1.15, 4), frondMat);
    frond.scale.z = 0.3;
    const ang = (f / 7) * Math.PI * 2;
    frond.position.set(x + Math.cos(ang) * 0.42, y - 0.02, Math.sin(ang) * 0.42);
    frond.rotation.order = 'YZX';
    frond.rotation.y = -ang;
    frond.rotation.z = -1.35 - (f % 2) * 0.35;
    g.add(frond);
  }
  const nut = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), new THREE.MeshStandardMaterial({ color: 0x6b4a2e }));
  nut.position.set(x, y - 0.08, 0.06);
  g.add(nut);
  return g;
}

function bananaClump() {
  const g = new THREE.Group();
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x5fa244, roughness: 0.75, side: THREE.DoubleSide });
  [[0, 0, 0.7], [0.35, 0.2, 0.55], [-0.3, 0.25, 0.62]].forEach((p) => {
    const trunk = cyl(0.05, 0.065, p[2], 0x8fb66a, 6);
    trunk.position.set(p[0], p[2] / 2, p[1]);
    trunk.castShadow = false;
    g.add(trunk);
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.72), leafMat);
      const ang = (i / 4) * Math.PI * 2 + p[0];
      leaf.position.set(p[0] + Math.cos(ang) * 0.3, p[2] + 0.02, p[1] + Math.sin(ang) * 0.3);
      leaf.rotation.order = 'YXZ';
      leaf.rotation.y = -ang + Math.PI / 2;
      leaf.rotation.x = 0.5;
      g.add(leaf);
    }
  });
  return g;
}

function mangoTree(scale: number) {
  const g = new THREE.Group();
  const trunk = cyl(0.11, 0.15, 0.9, 0x6f5237, 7);
  trunk.position.y = 0.45;
  trunk.castShadow = false;
  g.add(trunk);
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), new THREE.MeshStandardMaterial({ color: 0x4f8b3f, roughness: 0.9, flatShading: true }));
  crown.position.y = 1.35;
  crown.scale.set(1.15, 0.85, 1.15);
  g.add(crown);
  g.scale.setScalar(scale);
  return g;
}

function shrub(color: number, s: number) {
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true }));
  m.scale.set(s, s * 0.75, s);
  m.position.y = 0.16 * s;
  return m;
}

function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- island environment ---------------- */
export function buildEnvironment(scene: THREE.Scene, posMap: Record<string, Pos>) {
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x86cbd6, roughness: 0.4, metalness: 0.05 }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -0.08;
  scene.add(sea);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, map: TEX.grass(), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const beach = new THREE.Mesh(new THREE.RingGeometry(39.6, 41.8, 64), new THREE.MeshStandardMaterial({ color: 0xe6d8a8, roughness: 1 }));
  beach.rotation.x = -Math.PI / 2;
  beach.position.y = 0.006;
  scene.add(beach);

  const strip = (from: Pos, to: Pos, width: number, color: number, opacity: number, y: number) => {
    const dx = to.x - from.x, dz = to.z - from.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(len, width), new THREE.MeshBasicMaterial({ color, transparent: true, opacity }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -Math.atan2(dz, dx);
    mesh.position.set((from.x + to.x) / 2, y, (from.z + to.z) / 2);
    scene.add(mesh);
  };
  if (posMap.poultry && posMap.market) strip(posMap.poultry, posMap.market, 1.1, 0xcbb27a, 0.9, 0.02);
  [['poultry', 'biosecurity'], ['poultry', 'solar'], ['poultry', 'bsf'], ['poultry', 'biogas'], ['biogas', 'composting'], ['composting', 'cassava'], ['poultry', 'training']].forEach(([a, b]) => {
    if (posMap[a] && posMap[b]) strip(posMap[a], posMap[b], 0.62, 0xd2bd88, 0.85, 0.018);
  });

  if (posMap.training && posMap.school) {
    const from = posMap.training, to = posMap.school, steps = 14;
    for (let i = 2; i < steps; i += 2) {
      const t = i / steps;
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), new THREE.MeshBasicMaterial({ color: 0x8f7fd1, transparent: true, opacity: 0.75 }));
      dot.rotation.x = -Math.PI / 2;
      dot.position.set(from.x + (to.x - from.x) * t, 0.03, from.z + (to.z - from.z) * t);
      scene.add(dot);
    }
  }

  const fields = [
    { x: -14.5, z: -2.0, w: 5.2, d: 3.2, soil: '#6b4a2e', crop: '#5f9a3f' },
    { x: 9.5, z: -8.5, w: 5.0, d: 3.0, soil: '#73522f', crop: '#86b24a' },
    { x: 14.5, z: -2.0, w: 4.0, d: 3.0, soil: '#6b4a2e', crop: '#c9a83e' },
  ];
  fields.forEach((f) => {
    const field = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.d), new THREE.MeshStandardMaterial({ color: 0xffffff, map: TEX.rows(f.soil, f.crop, f.w * 1.2, f.d * 1.2), roughness: 1 }));
    field.rotation.x = -Math.PI / 2;
    field.position.set(f.x, 0.012, f.z);
    field.receiveShadow = true;
    scene.add(field);
    const fence = new THREE.Group();
    const hx = f.w / 2 + 0.2, hz = f.d / 2 + 0.2;
    fenceRun(fence, -hx, -hz, hx, -hz);
    fenceRun(fence, hx, -hz, hx, hz);
    fenceRun(fence, hx, hz, -hx, hz);
    fenceRun(fence, -hx, hz, -hx, -hz);
    fence.position.set(f.x, 0, f.z);
    scene.add(fence);
  });

  const rndHills = seededRandom(11);
  for (let i = 0; i < 15; i++) {
    const ang = Math.PI * 0.5 + (i / 14) * Math.PI * 1.4;
    const r = 35 + rndHills() * 4;
    const size = 4.5 + rndHills() * 3;
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(size, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0x4a7a3c : 0x3d6b36, roughness: 1, flatShading: true })
    );
    hill.scale.y = 0.38 + rndHills() * 0.22;
    hill.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r);
    scene.add(hill);
  }

  const rnd = seededRandom(7);
  const keys = Object.keys(posMap);
  const clear = (x: number, z: number, minD: number) => {
    for (const k of keys) if (Math.hypot(posMap[k].x - x, posMap[k].z - z) < minD) return false;
    if (Math.abs(x + 14.5) < 3.4 && Math.abs(z + 2) < 2.4) return false;
    if (Math.abs(x - 9.5) < 3.4 && Math.abs(z + 8.5) < 2.4) return false;
    if (Math.abs(x - 14.5) < 2.8 && Math.abs(z + 2) < 2.4) return false;
    const a = posMap.poultry, b = posMap.market;
    const t = ((x - a.x) * (b.x - a.x) + (z - a.z) * (b.z - a.z)) / (Math.pow(b.x - a.x, 2) + Math.pow(b.z - a.z, 2));
    if (t > 0 && t < 1 && Math.hypot(a.x + (b.x - a.x) * t - x, a.z + (b.z - a.z) * t - z) < 1.4) return false;
    return true;
  };
  const place = (make: () => THREE.Object3D, count: number, rMin: number, rMax: number, minD: number) => {
    let placed = 0, tries = 0;
    while (placed < count && tries < 400) {
      tries++;
      const ang = rnd() * Math.PI * 2, r = rMin + rnd() * (rMax - rMin);
      const x = Math.cos(ang) * r, z = Math.sin(ang) * r;
      if (!clear(x, z, minD)) continue;
      const obj = make();
      obj.position.set(x, 0, z);
      obj.rotation.y = rnd() * Math.PI * 2;
      scene.add(obj);
      placed++;
    }
  };
  place(() => palmTree(1.9 + rnd() * 1.1, (rnd() - 0.5) * 1.6), 15, 13, 36, 4.2);
  place(() => mangoTree(0.85 + rnd() * 0.5), 11, 9, 32, 4.4);
  place(() => shrub(rnd() < 0.5 ? 0x5a9445 : 0x4a8039, 0.8 + rnd() * 0.9), 34, 5, 35, 2.6);
  [[-12.4, -4.6], [-8.6, -9.2], [-13.0, 6.2], [-11.5, 5.4]].forEach((p) => {
    const b = bananaClump();
    b.position.set(p[0], 0, p[1]);
    scene.add(b);
  });
}

/* ---------------- station builders ---------------- */
export function buildPoultryHouse(flock: FlockMember[]) {
  const g = new THREE.Group();
  const W = 3.6, D = 2.2, KICK = 0.55, WALLH = 1.5, SLAB = 0.12, RIDGE = 1.05;

  const slab = texBox(W + 0.32, SLAB, D + 0.32, TEX.concrete(3, 2), 0.9);
  slab.position.y = SLAB / 2;
  g.add(slab);
  const plinth = box(W + 0.06, 0.16, D + 0.06, 0x9d9887, 0.9);
  plinth.position.y = SLAB + 0.08;
  g.add(plinth);
  const kick = texBox(W, KICK, D, TEX.plaster('#eadfbd', 3, 1));
  kick.position.y = SLAB + KICK / 2;
  g.add(kick);

  [-1, 1].forEach((side) => {
    const endWall = texBox(0.08, WALLH - KICK, D, TEX.plaster('#e2d5ae', 2, 1));
    endWall.position.set(side * (W / 2), SLAB + KICK + (WALLH - KICK) / 2, 0);
    g.add(endWall);
  });
  [-1, -0.34, 0.34, 1].forEach((fx) => {
    [-1, 1].forEach((fz) => {
      const post = box(0.09, WALLH - KICK, 0.09, 0x6b5a3e, 0.8);
      post.position.set(fx * (W / 2), SLAB + KICK + (WALLH - KICK) / 2, fz * (D / 2));
      g.add(post);
    });
  });
  [-1, 1].forEach((fz) => {
    const plate = box(W + 0.12, 0.09, 0.11, 0x5c4a34, 0.8);
    plate.position.set(0, SLAB + WALLH - 0.045, fz * (D / 2));
    g.add(plate);
  });

  const meshMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: TEX.mesh(20, 6), transparent: true, alphaTest: 0.05, roughness: 0.8, side: THREE.DoubleSide });
  [-1, 1].forEach((fz) => {
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.1, WALLH - KICK - 0.2), meshMat);
    screen.position.set(0, SLAB + KICK + (WALLH - KICK - 0.2) / 2, fz * (D / 2));
    g.add(screen);
    const curtain = box(W - 0.16, 0.14, 0.07, 0x3a86b0, 0.7);
    curtain.position.set(0, SLAB + WALLH - 0.19, fz * (D / 2 + 0.02));
    g.add(curtain);
  });

  const roof = gableRoof(W + 0.1, D + 0.1, RIDGE, 0.3, 0xb3563a);
  roof.position.y = SLAB + WALLH;
  g.add(roof);

  const monitor = new THREE.Group();
  const monBase = box(W * 0.8, 0.22, 0.34, 0x4a3d34, 0.7);
  monBase.position.y = 0.08;
  monitor.add(monBase);
  for (let ls = 0; ls < 5; ls++) {
    [-1, 1].forEach((side) => {
      const slat = box(W * 0.76, 0.025, 0.07, 0x8f8574, 0.6);
      slat.position.set(0, -0.02 + ls * 0.05, side * 0.18);
      slat.rotation.x = side * 0.5;
      monitor.add(slat);
    });
  }
  const monCap = box(W * 0.86, 0.05, 0.54, 0x3d332a, 0.6);
  monCap.position.y = 0.21;
  monitor.add(monCap);
  monitor.position.y = SLAB + WALLH + RIDGE + 0.06;
  g.add(monitor);

  const gableShape = new THREE.Shape();
  gableShape.moveTo(-1.4, 0); gableShape.lineTo(1.4, 0); gableShape.lineTo(0, 1.03);
  const gableMat = new THREE.MeshStandardMaterial({ color: 0xe2d5ae, roughness: 0.85, side: THREE.DoubleSide });
  [-1, 1].forEach((side) => {
    const gable = new THREE.Mesh(new THREE.ShapeGeometry(gableShape), gableMat);
    gable.rotation.y = Math.PI / 2;
    gable.position.set(side * (W / 2 + 0.05), SLAB + WALLH, 0);
    g.add(gable);
  });

  [-1, 1].forEach((fz) => {
    const gutter = cyl(0.045, 0.045, W + 0.5, 0x9aa0a3, 8, 0.5);
    gutter.rotation.z = Math.PI / 2;
    gutter.position.set(0, SLAB + WALLH - 0.02, fz * 1.47);
    gutter.castShadow = false;
    g.add(gutter);
  });
  const downpipe = cyl(0.03, 0.03, SLAB + WALLH - 0.06, 0x9aa0a3, 8, 0.5);
  downpipe.position.set(W / 2 + 0.05, (SLAB + WALLH - 0.06) / 2, 1.47);
  g.add(downpipe);
  const pipeToTank = cyl(0.03, 0.03, 0.9, 0x9aa0a3, 8, 0.5);
  pipeToTank.rotation.x = Math.PI / 2;
  pipeToTank.rotation.z = -0.35;
  pipeToTank.position.set(W / 2 + 0.2, 0.05, 1.9);
  g.add(pipeToTank);

  [-0.5, 0.5].forEach((fz) => {
    const fan = new THREE.Group();
    const ring = cyl(0.22, 0.22, 0.07, 0x3b464c, 16, 0.5);
    ring.rotation.z = Math.PI / 2;
    fan.add(ring);
    const hub = cyl(0.045, 0.045, 0.1, 0x8a8f92, 8, 0.4);
    hub.rotation.z = Math.PI / 2;
    fan.add(hub);
    for (let b = 0; b < 3; b++) {
      const blade = box(0.02, 0.36, 0.07, 0x9aa0a3, 0.5);
      blade.position.x = 0.03;
      blade.rotation.x = (b * Math.PI) / 3;
      fan.add(blade);
    }
    fan.position.set(W / 2 + 0.09, SLAB + KICK + 0.5, fz);
    g.add(fan);
  });

  const door = box(0.62, KICK * 0.92, 0.05, 0x2b2118, 0.9);
  door.position.set(-0.9, SLAB + (KICK * 0.92) / 2, D / 2 + 0.03);
  g.add(door);
  const ramp = box(0.62, 0.05, 0.55, 0x9c8a63, 0.9);
  ramp.position.set(-0.9, 0.14, D / 2 + 0.32);
  ramp.rotation.x = -0.28;
  g.add(ramp);
  const feeder = cyl(0.16, 0.2, 0.28, 0xb5651d, 10);
  feeder.position.set(0.55, 0.14, D / 2 + 0.5);
  g.add(feeder);
  const drinker = cyl(0.14, 0.14, 0.05, 0x9db3bb, 10);
  drinker.position.set(1.0, 0.12, D / 2 + 0.45);
  g.add(drinker);

  const siloX = -W / 2 - 0.85, siloZ = -0.55;
  [[-0.16, -0.16], [0.16, -0.16], [0, 0.2]].forEach((o) => {
    const leg = cyl(0.025, 0.025, 0.4, 0x6f757a, 6);
    leg.position.set(siloX + o[0], 0.2, siloZ + o[1]);
    g.add(leg);
  });
  const silo = cyl(0.27, 0.27, 0.8, 0xb9c1c5, 16, 0.4);
  silo.position.set(siloX, 0.8, siloZ);
  g.add(silo);
  const siloTop = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.24, 16), new THREE.MeshStandardMaterial({ color: 0xa3acb0, roughness: 0.4, metalness: 0.2 }));
  siloTop.position.set(siloX, 1.32, siloZ);
  siloTop.castShadow = true;
  g.add(siloTop);
  const siloCone = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0xa3acb0, roughness: 0.4, metalness: 0.2 }));
  siloCone.rotation.x = Math.PI;
  siloCone.position.set(siloX, 0.31, siloZ);
  g.add(siloCone);

  const sign = signBoard('POULTRY HOUSE', 1.25, 0.34, '#1c3c2d', '#f1ecda', 30);
  sign.position.set(-1.55, 0.72, D / 2 + 1.15);
  g.add(sign);
  [-0.5, 0.5].forEach((dx) => {
    const sp = cyl(0.03, 0.03, 0.62, 0x6b5a3e, 6);
    sp.position.set(-1.55 + dx, 0.31, D / 2 + 1.15);
    g.add(sp);
  });

  const yardCenterX = W / 2 + 1.35, yardW = 2.5, yardD = D + 0.4;
  const scratch = new THREE.Mesh(new THREE.PlaneGeometry(yardW, yardD), new THREE.MeshStandardMaterial({ color: 0x8a7a54, roughness: 1 }));
  scratch.rotation.x = -Math.PI / 2;
  scratch.position.set(yardCenterX, 0.015, 0);
  scratch.receiveShadow = true;
  g.add(scratch);
  fenceRun(g, yardCenterX - yardW / 2, -yardD / 2, yardCenterX + yardW / 2, -yardD / 2);
  fenceRun(g, yardCenterX + yardW / 2, -yardD / 2, yardCenterX + yardW / 2, yardD / 2);
  fenceRun(g, yardCenterX + yardW / 2, yardD / 2, yardCenterX - yardW / 2, yardD / 2);

  const colors = [0xefe6d3, 0x8a5a34, 0x3a332c, 0xefe6d3, 0x8a5a34];
  [
    { x: yardCenterX - 0.7, z: -0.5 }, { x: yardCenterX + 0.4, z: 0.3 }, { x: yardCenterX - 0.2, z: 0.7 },
    { x: -0.2, z: D / 2 + 0.75 }, { x: 0.7, z: D / 2 + 0.95 },
  ].forEach((spot, idx) => {
    const chick = buildChicken(colors[idx % colors.length]);
    chick.position.set(spot.x, 0, spot.z);
    chick.rotation.y = Math.random() * Math.PI * 2;
    g.add(chick);
    flock.push({ mesh: chick, phase: Math.random() * Math.PI * 2 });
  });
  return g;
}

export function buildBiogas() {
  const g = new THREE.Group();
  const BASE = 0.08, BODYH = 1.15;

  const pad = cyl(1.95, 1.95, BASE, 0xffffff, 40, 0.95);
  pad.material.map = TEX.concrete(3, 3);
  pad.position.y = BASE / 2;
  g.add(pad);
  const body = cyl(1.0, 1.0, BODYH, 0xffffff, 40, 0.9);
  body.material.map = TEX.concrete(7, 1);
  body.position.y = BASE + BODYH / 2;
  g.add(body);
  [0.32, 0.72].forEach((y) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.004, 0.017, 6, 48), new THREE.MeshStandardMaterial({ color: 0x8e8878, roughness: 0.9 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = BASE + y;
    g.add(ring);
  });
  const beam = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.06, 8, 48), new THREE.MeshStandardMaterial({ color: 0x9d9887, roughness: 0.9 }));
  beam.rotation.x = Math.PI / 2;
  beam.position.y = BASE + BODYH;
  beam.castShadow = true;
  g.add(beam);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.0, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3f8f57, roughness: 0.4, metalness: 0.05 }));
  dome.scale.y = 0.72;
  dome.position.y = BASE + BODYH;
  dome.castShadow = true;
  g.add(dome);
  const clamp = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.03, 6, 48), new THREE.MeshStandardMaterial({ color: 0x2d3a33, roughness: 0.6 }));
  clamp.rotation.x = Math.PI / 2;
  clamp.position.y = BASE + BODYH + 0.02;
  g.add(clamp);

  const topY = BASE + BODYH + 0.72;
  const cap = cyl(0.1, 0.12, 0.1, 0x3a3f3d, 12, 0.6);
  cap.position.y = topY + 0.03;
  g.add(cap);

  const GAS = 0xe3b93a, GASY = topY + 0.42, STOVEX = 2.25;
  const rise = cyl(0.04, 0.04, GASY - topY, GAS, 8, 0.5);
  rise.position.y = (GASY + topY) / 2;
  g.add(rise);
  const run = cyl(0.04, 0.04, STOVEX, GAS, 8, 0.5);
  run.rotation.z = Math.PI / 2;
  run.position.set(STOVEX / 2, GASY, 0);
  g.add(run);
  const drop = cyl(0.04, 0.04, GASY - 0.4, GAS, 8, 0.5);
  drop.position.set(STOVEX, (GASY + 0.4) / 2, 0);
  g.add(drop);
  [1.3, STOVEX - 0.4].forEach((px) => {
    const support = cyl(0.03, 0.03, GASY, 0x6b5a3e, 6);
    support.position.set(px, GASY / 2, 0);
    support.castShadow = false;
    g.add(support);
  });
  const valve = cyl(0.1, 0.1, 0.03, 0xc0392b, 12, 0.5);
  valve.rotation.x = Math.PI / 2;
  valve.position.set(1.05, GASY + 0.1, 0);
  g.add(valve);
  const gauge = cyl(0.075, 0.075, 0.03, 0xf1ecda, 14, 0.4);
  gauge.rotation.x = Math.PI / 2;
  gauge.position.set(0.5, GASY + 0.1, 0.05);
  g.add(gauge);

  const stove = box(0.56, 0.3, 0.5, 0x50565a, 0.6);
  stove.position.set(STOVEX, 0.23, 0);
  g.add(stove);
  const burner = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 6, 16), new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.6 }));
  burner.rotation.x = Math.PI / 2;
  burner.position.set(STOVEX, 0.4, 0);
  g.add(burner);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 8), new THREE.MeshBasicMaterial({ color: 0xffa040 }));
  flame.position.set(STOVEX, 0.48, 0);
  g.add(flame);

  const inTank = texBox(0.75, 0.55, 0.75, TEX.concrete(2, 1));
  inTank.position.set(-1.75, BASE + 0.275, 0.55);
  g.add(inTank);
  const inSlurry = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0x5b4630, roughness: 0.4 }));
  inSlurry.rotation.x = -Math.PI / 2;
  inSlurry.position.set(-1.75, BASE + 0.556, 0.55);
  g.add(inSlurry);
  const inPipe = cyl(0.07, 0.07, 0.56, 0x6f757a, 8, 0.5);
  inPipe.rotation.z = Math.PI / 2;
  inPipe.position.set(-1.105, 0.42, 0.55);
  g.add(inPipe);

  const outTank = texBox(1.1, 0.4, 0.85, TEX.concrete(2, 1));
  outTank.position.set(1.75, BASE + 0.2, -0.75);
  g.add(outTank);
  const outLiquid = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.7), new THREE.MeshStandardMaterial({ color: 0x6a7a36, roughness: 0.3 }));
  outLiquid.rotation.x = -Math.PI / 2;
  outLiquid.position.set(1.75, BASE + 0.404, -0.75);
  g.add(outLiquid);
  const outPipe = cyl(0.06, 0.06, 0.56, 0x6f757a, 8, 0.5);
  outPipe.rotation.z = Math.PI / 2;
  outPipe.position.set(0.93, 0.33, -0.75);
  g.add(outPipe);

  const warn = signBoard('BIOGAS|NO FLAMES', 0.85, 0.46, '#e3a93a', '#0c1e17', 26);
  warn.position.set(-0.55, 0.62, 1.62);
  g.add(warn);
  [-0.35, 0.35].forEach((dx) => {
    const wp = cyl(0.03, 0.03, 0.56, 0x6b5a3e, 6);
    wp.position.set(-0.55 + dx, 0.28, 1.62);
    g.add(wp);
  });
  return g;
}

export function buildSchool(flock: FlockMember[]) {
  const g = new THREE.Group();
  const BASEY = 0.1, WW = 3.6, WD = 1.4, WH = 1.25, Z0 = -0.35, BLUE = 0x3d7ea6;

  const terrace = texBox(5.2, BASEY, 3.0, TEX.concrete(4, 2));
  terrace.position.set(0, BASEY / 2, 0);
  g.add(terrace);
  const plinth = box(WW + 0.05, 0.22, WD + 0.05, BLUE, 0.8);
  plinth.position.set(0, BASEY + 0.11, Z0);
  g.add(plinth);
  const wall = texBox(WW, WH - 0.22, WD, TEX.plaster('#f0e7c9', 4, 1));
  wall.position.set(0, BASEY + 0.22 + (WH - 0.22) / 2, Z0);
  g.add(wall);
  const band = box(WW + 0.05, 0.1, WD + 0.05, BLUE, 0.8);
  band.position.set(0, BASEY + WH - 0.05, Z0);
  g.add(band);
  const roof = gableRoof(WW, WD, 0.55, 0.28, 0x4a8fb8);
  roof.position.set(0, BASEY + WH, Z0);
  g.add(roof);

  const frontZ = Z0 + WD / 2;
  [-1.35, -0.7, 0.7, 1.35].forEach((wx) => {
    const frame = box(0.5, 0.48, 0.05, 0xffffff, 0.6);
    frame.position.set(wx, BASEY + 0.78, frontZ + 0.02);
    g.add(frame);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.38), new THREE.MeshStandardMaterial({ color: 0x9fd0e0, emissive: 0x1d3a44, roughness: 0.2, metalness: 0.1 }));
    glass.position.set(wx, BASEY + 0.78, frontZ + 0.05);
    g.add(glass);
    const mv = box(0.02, 0.38, 0.02, 0xffffff, 0.6);
    mv.position.set(wx, BASEY + 0.78, frontZ + 0.06);
    g.add(mv);
    const mh = box(0.4, 0.02, 0.02, 0xffffff, 0.6);
    mh.position.set(wx, BASEY + 0.78, frontZ + 0.06);
    g.add(mh);
  });
  const door = box(0.5, 0.85, 0.05, 0x7a4b2a, 0.8);
  door.position.set(0, BASEY + 0.425, frontZ + 0.03);
  g.add(door);
  const lintel = box(0.64, 0.07, 0.08, BLUE, 0.8);
  lintel.position.set(0, BASEY + 0.9, frontZ + 0.04);
  g.add(lintel);

  const vRoof = texBox(WW + 0.2, 0.05, 0.85, TEX.corrugated('#4a8fb8', 12), 0.5);
  vRoof.position.set(0, BASEY + 1.05, frontZ + 0.42);
  vRoof.rotation.x = 0.12;
  g.add(vRoof);
  for (let vc = -2; vc <= 2; vc++) {
    const col = cyl(0.04, 0.04, 0.96, 0xf1ecda, 8, 0.7);
    col.position.set(vc * 0.8, BASEY + 0.48, frontZ + 0.8);
    g.add(col);
  }

  const slope = Math.atan(0.55 / (WD / 2 + 0.28));
  [-1.0, 0, 1.0].forEach((px) => {
    const panel = box(0.9, 0.04, 0.55, 0x1f3b57, 0.3);
    panel.position.set(px, BASEY + WH + 0.275 + 0.06 * Math.cos(slope), Z0 + 0.49 + 0.06 * Math.sin(slope));
    panel.rotation.x = slope;
    g.add(panel);
  });

  const sign = signBoard('SCHOOL DEMO SITE', 1.3, 0.34, '#122a20', '#e3a93a', 26);
  sign.position.set(-1.95, 0.72, 1.85);
  g.add(sign);
  [-0.5, 0.5].forEach((dx) => {
    const sp = cyl(0.03, 0.03, 0.62, 0x6b5a3e, 6);
    sp.position.set(-1.95 + dx, 0.31, 1.85);
    g.add(sp);
  });

  const pole = cyl(0.025, 0.025, 2.4, 0x9c9c9c, 6);
  pole.position.set(2.75, 1.2, -1.1);
  g.add(pole);
  [[0xe3a93a, 2.2], [BLUE, 1.98]].forEach((f) => {
    const pennant = box(0.55, 0.2, 0.02, f[0], 0.7);
    pennant.position.set(3.03, f[1], -1.1);
    g.add(pennant);
  });

  const tank = cyl(0.3, 0.3, 0.8, 0x4a8fb8, 14, 0.5);
  tank.position.set(-1.95, BASEY + 0.4, -1.3);
  g.add(tank);
  const tankLid = cyl(0.32, 0.32, 0.05, 0x2f6b8e, 14, 0.5);
  tankLid.position.set(-1.95, BASEY + 0.83, -1.3);
  g.add(tankLid);
  const bin = box(0.6, 0.4, 0.6, 0x7a5a3a, 0.9);
  bin.position.set(2.1, BASEY + 0.2, -1.35);
  g.add(bin);
  const pile = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshStandardMaterial({ color: 0x4a341f, roughness: 1 }));
  pile.scale.y = 0.55;
  pile.position.set(2.1, BASEY + 0.44, -1.35);
  g.add(pile);

  [-0.75, 0.0, 0.75].forEach((bz, bi) => {
    const bed = box(1.1, 0.14, 0.5, 0x6b4a2e, 0.95);
    bed.position.set(-3.1, 0.07, bz);
    g.add(bed);
    for (let pl = 0; pl < 4; pl++) {
      const plant = cone(0.09, 0.26, 6, bi === 1 ? 0xc9a83e : 0x5fa244);
      plant.position.set(-3.45 + pl * 0.23, 0.27, bz);
      g.add(plant);
    }
  });

  const coopWall = texBox(1.0, 0.5, 0.8, TEX.plaster('#efe3bf', 2, 1));
  coopWall.position.set(3.35, 0.25, 0);
  g.add(coopWall);
  const coopRoof = gableRoof(1.0, 0.8, 0.3, 0.14, 0xd98a3d);
  coopRoof.position.set(3.35, 0.5, 0);
  g.add(coopRoof);
  const coopDoor = box(0.24, 0.3, 0.04, 0x2b2118, 0.9);
  coopDoor.position.set(3.35, 0.16, 0.41);
  g.add(coopDoor);
  const runGround = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.6), new THREE.MeshStandardMaterial({ color: 0x8a7a54, roughness: 1 }));
  runGround.rotation.x = -Math.PI / 2;
  runGround.position.set(4.65, 0.014, 0);
  runGround.receiveShadow = true;
  g.add(runGround);
  fenceRun(g, 3.9, -0.8, 5.4, -0.8);
  fenceRun(g, 5.4, -0.8, 5.4, 0.8);
  fenceRun(g, 5.4, 0.8, 3.9, 0.8);
  ([[4.3, -0.3, 0xefe6d3], [4.85, 0.25, 0x8a5a34], [4.55, 0.5, 0x3a332c]] as [number, number, number][]).forEach((c) => {
    const hen = buildChicken(c[2]);
    hen.scale.setScalar(0.85);
    hen.position.set(c[0], 0, c[1]);
    hen.rotation.y = Math.random() * Math.PI * 2;
    g.add(hen);
    flock.push({ mesh: hen, phase: Math.random() * Math.PI * 2 });
  });

  const skins = [0x8d5a3b, 0x6b4128, 0xc68e62, 0x7a4b30];
  ([[-0.9, 2.0, 0], [-0.3, 2.2, 1], [0.5, 2.05, 2], [1.2, 2.25, 3], [-3.0, 1.4, 1], [2.7, 1.1, 0]] as [number, number, number][]).forEach((s, i) => {
    const st = person(0xf6f6f6, 0x1f3550, skins[s[2] % skins.length], 1);
    st.position.set(s[0], 0, s[1]);
    st.rotation.y = i % 2 ? 0.4 : -0.3;
    g.add(st);
  });

  const FC = 0xe8e2cf;
  fenceRun(g, -4.2, 2.9, -0.7, 2.9, FC);
  fenceRun(g, 0.7, 2.9, 6.0, 2.9, FC);
  fenceRun(g, 6.0, 2.9, 6.0, -2.3, FC);
  fenceRun(g, 6.0, -2.3, -4.2, -2.3, FC);
  fenceRun(g, -4.2, -2.3, -4.2, 2.9, FC);
  return g;
}

export function buildTrainingHub() {
  const g = new THREE.Group();
  const BASEY = 0.1;
  const slab = texBox(4.2, BASEY, 2.8, TEX.concrete(3, 2));
  slab.position.y = BASEY / 2;
  g.add(slab);
  [-1.7, 0, 1.7].forEach((px) => {
    [-1.1, 1.1].forEach((pz) => {
      const post = box(0.1, 1.5, 0.1, 0x6b5a3e, 0.8);
      post.position.set(px, BASEY + 0.75, pz);
      g.add(post);
    });
  });
  [-1.1, 1.1].forEach((pz) => {
    const plate = box(3.9, 0.09, 0.11, 0x5c4a34, 0.8);
    plate.position.set(0, BASEY + 1.5 - 0.045, pz);
    g.add(plate);
  });
  const roof = gableRoof(3.9, 2.3, 0.5, 0.3, 0x4fa697);
  roof.position.y = BASEY + 1.5;
  g.add(roof);

  const board = signBoard('CIRCULAR POULTRY|TRAINING', 1.7, 0.82, '#f4f1e6', '#1c3c2d', 28);
  board.position.set(0, BASEY + 0.98, -1.0);
  g.add(board);
  [-0.75, 0.75].forEach((dx) => {
    const bp = cyl(0.03, 0.03, 0.6, 0x6b5a3e, 6);
    bp.position.set(dx, BASEY + 0.3, -1.0);
    g.add(bp);
  });

  [[-0.9, 0.35], [0.9, 0.35], [-0.9, 0.95], [0.9, 0.95]].forEach((b) => {
    const seat = box(1.3, 0.06, 0.26, 0xa88a5a, 0.8);
    seat.position.set(b[0], BASEY + 0.28, b[1]);
    g.add(seat);
    [-0.55, 0.55].forEach((lx) => {
      const leg = box(0.06, 0.26, 0.2, 0x6b5a3e, 0.8);
      leg.position.set(b[0] + lx, BASEY + 0.13, b[1]);
      g.add(leg);
    });
  });

  const shirts = [0x8f7fd1, 0xe3a93a, 0x4fa697, 0xc0603a, 0xf1ecda, 0x8bbf6f, 0x4a8fb8, 0xd98a3d];
  const skins = [0x8d5a3b, 0x6b4128, 0xc68e62, 0x7a4b30];
  [[-1.3, 0.35], [-0.6, 0.35], [0.6, 0.35], [1.3, 0.35], [-1.3, 0.95], [-0.6, 0.95], [0.6, 0.95], [1.3, 0.95]].forEach((p, i) => {
    const pp = person(shirts[i], 0x2f3a45, skins[i % skins.length], 0.95);
    pp.position.set(p[0], BASEY + 0.06, p[1] - 0.02);
    pp.rotation.y = Math.PI;
    g.add(pp);
  });
  const trainer = person(0xe3a93a, 0x2f3a45, 0x8d5a3b, 1.05);
  trainer.position.set(-0.3, BASEY, -0.55);
  g.add(trainer);

  const demo = table(1.0, 0.5, 0.4, 0xa88a5a);
  demo.position.set(1.35, BASEY, -0.6);
  g.add(demo);
  const demoFeeder = cyl(0.1, 0.13, 0.16, 0xb5651d, 10);
  demoFeeder.position.set(1.15, BASEY + 0.58, -0.6);
  g.add(demoFeeder);
  const demoBox = box(0.22, 0.14, 0.18, 0xe5ddc8, 0.8);
  demoBox.position.set(1.55, BASEY + 0.58, -0.6);
  g.add(demoBox);

  const sp = cyl(0.05, 0.05, 2.3, 0x6b5a3e, 8);
  sp.position.set(3.1, 1.15, 0.8);
  g.add(sp);
  const s1 = signBoard('PANAMA|STUDY TOUR', 0.95, 0.4, '#8f7fd1', '#0c1e17', 24);
  s1.position.set(3.1, 2.0, 0.8);
  s1.rotation.y = -0.6;
  g.add(s1);
  const s2 = signBoard('ST LUCIA / ST KITTS|EXCHANGE', 1.15, 0.4, '#f1ecda', '#1c3c2d', 20);
  s2.position.set(3.1, 1.55, 0.8);
  s2.rotation.y = 0.5;
  g.add(s2);

  const globeTex = canvasTex(256, 128, (c, w, h) => {
    c.fillStyle = '#2c6f9a';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#5fa050';
    [[60, 50, 34, 20], [120, 44, 22, 14], [150, 70, 26, 30], [210, 52, 28, 16], [90, 96, 18, 10], [230, 100, 14, 8]].forEach((b) => {
      c.beginPath();
      c.ellipse(b[0], b[1], b[2], b[3], 0.3, 0, Math.PI * 2);
      c.fill();
    });
    c.strokeStyle = 'rgba(255,255,255,0.35)';
    c.lineWidth = 1;
    for (let x = 0; x < w; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y < h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), new THREE.MeshStandardMaterial({ map: globeTex, roughness: 0.6 }));
  globe.position.set(3.95, 0.72, -0.2);
  globe.castShadow = true;
  g.add(globe);
  const stand = cyl(0.05, 0.08, 0.4, 0x3b3a34, 8, 0.6);
  stand.position.set(3.95, 0.2, -0.2);
  g.add(stand);
  g.userData.globe = globe;
  return g;
}
