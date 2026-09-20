import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HOTSPOTS_DATA, FLOW_CONNECTIONS, THEME_COLORS } from '../data/poultryData';
import { HotspotData } from '../types';

interface ThreeStageProps {
  selectedId: string | null;
  onSelectHotspot: (id: string) => void;
  isTourMode?: boolean;
}

export const ThreeStage: React.FC<ThreeStageProps> = ({
  selectedId,
  onSelectHotspot,
  isTourMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<string | null>(selectedId);
  selectedIdRef.current = selectedId;

  // Store references to animate camera transitions
  const cameraTargetPos = useRef<THREE.Vector3 | null>(null);
  const controlsTargetPos = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene & Fog ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcdeaf0);
    scene.fog = new THREE.Fog(0xdbeedd, 24, 64);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(16, 13, 20);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 45;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.update();

    // --- Lighting ---
    const hemiLight = new THREE.HemisphereLight(0xbfe3ea, 0x4a6b3a, 0.95);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff2d6, 1.15);
    sunLight.position.set(15, 22, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -28;
    sunLight.shadow.camera.right = 28;
    sunLight.shadow.camera.top = 28;
    sunLight.shadow.camera.bottom = -28;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // --- Ground Disc ---
    const groundGeo = new THREE.CircleGeometry(42, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x6f9450,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // A clean concrete service apron visually anchors the central farm complex.
    const apron = new THREE.Mesh(
      new THREE.CircleGeometry(8.7, 64),
      new THREE.MeshStandardMaterial({ color: 0x8da66f, roughness: 1 })
    );
    apron.rotation.x = -Math.PI / 2;
    apron.position.y = 0.012;
    apron.receiveShadow = true;
    scene.add(apron);

    // --- Pathway to Market & Trail to School ---
    const posMap: Record<string, { x: number; y: number; z: number }> = {};
    HOTSPOTS_DATA.forEach((h) => {
      posMap[h.id] = h.position3D;
    });

    // Market Road
    const poultryPos = posMap['poultry'];
    const marketPos = posMap['market'];
    const roadDx = marketPos.x - poultryPos.x;
    const roadDz = marketPos.z - poultryPos.z;
    const roadLen = Math.sqrt(roadDx * roadDx + roadDz * roadDz);
    const roadMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(roadLen, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xcbb27a, transparent: true, opacity: 0.85 })
    );
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.rotation.z = -Math.atan2(roadDz, roadDx);
    roadMesh.position.set((poultryPos.x + marketPos.x) / 2, 0.02, (poultryPos.z + marketPos.z) / 2);
    scene.add(roadMesh);

    // School Dotted Stepping Stones
    const schoolPos = posMap['school'];
    const stepsCount = 14;
    for (let i = 2; i < stepsCount - 1; i++) {
      if (i % 2 !== 0) continue;
      const t = i / stepsCount;
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.22, 12),
        new THREE.MeshBasicMaterial({ color: 0xe3a93a, transparent: true, opacity: 0.75 })
      );
      dot.rotation.x = -Math.PI / 2;
      dot.position.set(
        poultryPos.x + (schoolPos.x - poultryPos.x) * t,
        0.03,
        poultryPos.z + (schoolPos.z - poultryPos.z) * t
      );
      scene.add(dot);
    }

    // --- Hotspots Building Objects ---
    const hotspotGroups: Record<string, THREE.Group> = {};

    const createBox = (w: number, h: number, d: number, color: number, rough = 0.8) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color, roughness: rough })
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const createCyl = (rt: number, rb: number, h: number, color: number, seg = 16, rough = 0.7) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(rt, rb, h, seg),
        new THREE.MeshStandardMaterial({ color, roughness: rough })
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const createCone = (r: number, h: number, seg: number, color: number) => {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(r, h, seg),
        new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
      );
      mesh.castShadow = true;
      return mesh;
    };

    const addGableRoof = (group: THREE.Group, width: number, depth: number, y: number, color: number) => {
      const roofMat = new THREE.MeshStandardMaterial({ color, roughness: 0.56, metalness: 0.12 });
      [-1, 1].forEach((side) => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(width * 0.58, 0.12, depth + 0.34), roofMat);
        panel.rotation.z = side * 0.48;
        panel.position.set(side * width * 0.22, y, 0);
        panel.castShadow = true;
        group.add(panel);
      });
      const ridge = createCyl(0.055, 0.055, depth + 0.42, 0x4d3327, 8);
      ridge.rotation.x = Math.PI / 2;
      ridge.position.y = y + width * 0.23;
      group.add(ridge);
    };

    const addDoor = (group: THREE.Group, x: number, y: number, z: number, color = 0x405845) => {
      const door = createBox(0.62, 1.12, 0.08, color, 0.55);
      door.position.set(x, y, z);
      group.add(door);
      const handle = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xe3a93a, metalness: 0.6 }));
      handle.position.set(x + 0.2, y, z + 0.065);
      group.add(handle);
    };

    const addWindow = (group: THREE.Group, x: number, y: number, z: number, w = 0.62) => {
      const frame = createBox(w + 0.1, 0.58, 0.07, 0xf1ecda);
      frame.position.set(x, y, z);
      group.add(frame);
      const glass = createBox(w, 0.48, 0.085, 0x78b8c7, 0.22);
      glass.position.set(x, y, z + 0.015);
      gAddMuntins(group, x, y, z + 0.07, w);
      group.add(glass);
    };

    const gAddMuntins = (group: THREE.Group, x: number, y: number, z: number, w: number) => {
      const v = createBox(0.035, 0.5, 0.03, 0xe7e0cd); v.position.set(x, y, z); group.add(v);
      const h = createBox(w, 0.035, 0.03, 0xe7e0cd); h.position.set(x, y, z); group.add(h);
    };

    const registerGroup = (id: string, group: THREE.Group) => {
      group.userData.hotspotId = id;
      const p = posMap[id];
      group.position.set(p.x, 0, p.z);
      scene.add(group);
      hotspotGroups[id] = group;
      return group;
    };

    // 1. Poultry House
    {
      const g = new THREE.Group();
      const slab = createBox(4.8, 0.16, 3.15, 0xb8b7a9); slab.position.y = 0.08; g.add(slab);
      const body = createBox(4.45, 1.72, 2.85, 0xe3d7b7);
      body.position.y = 0.95;
      g.add(body);
      addGableRoof(g, 4.75, 3.05, 1.94, 0x804b35);
      addDoor(g, 0, 0.73, 1.47, 0x496249);
      [-1.45, 1.45].forEach((x) => addWindow(g, x, 1.15, 1.47, 0.72));
      // Raised ventilation openings and a defined fenced run.
      for (let x = -1.75; x <= 1.75; x += 0.7) {
        const vent = createBox(0.42, 0.18, 0.06, 0x315b58); vent.position.set(x, 1.58, -1.445); g.add(vent);
      }
      const fenceMat = new THREE.MeshStandardMaterial({ color: 0x8d8066, roughness: 0.9 });
      for (let x = -2.55; x <= 2.55; x += 0.65) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.88, 0.045), fenceMat); post.position.set(x, 0.44, 2.65); g.add(post);
      }
      const rail = createBox(5.2, 0.045, 0.045, 0x8d8066); rail.position.set(0, 0.78, 2.65); g.add(rail);
      // Simple birds make the purpose readable without pretending to be a detailed site plan.
      [-1.25, 0, 1.15].forEach((x, i) => {
        const bird = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshStandardMaterial({ color: i === 1 ? 0xb95d36 : 0xf0e4cc, roughness: 1 }));
        bird.scale.set(1.25, 0.85, 0.8); bird.position.set(x, 0.24, 2.05 + (i % 2) * 0.25); bird.castShadow = true; g.add(bird);
      });
      registerGroup('poultry', g);
    }

    // 2. Biogas Digester
    {
      const g = new THREE.Group();
      const base = createCyl(1.5, 1.62, 0.3, 0xb9b6a6, 32); base.position.y = 0.15; g.add(base);
      const tank = createCyl(1.22, 1.28, 1.55, 0x315b46, 32, 0.42);
      tank.position.y = 0.95;
      g.add(tank);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.22, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x244c3a, roughness: 0.38, metalness: 0.08 })
      );
      dome.position.y = 1.72;
      dome.castShadow = true;
      g.add(dome);

      const pipe = createCyl(0.09, 0.09, 1.85, 0xb4b8af, 12, 0.3);
      pipe.rotation.z = Math.PI / 2.2;
      pipe.position.set(1.05, 1.72, 0);
      g.add(pipe);
      const inlet = createBox(0.85, 0.48, 0.72, 0xb6ad91); inlet.position.set(-1.58, 0.3, 0); g.add(inlet);
      const outlet = createBox(0.72, 0.34, 0.62, 0x9b9278); outlet.position.set(1.52, 0.23, 0); g.add(outlet);
      [0.52, 1.05, 1.55].forEach((y) => { const band = createCyl(1.235, 1.235, 0.035, 0x86a896, 32, 0.35); band.position.y = y; g.add(band); });
      registerGroup('biogas', g);
    }

    // 3. Composting Bay
    {
      const g = new THREE.Group();
      for (let i = -1; i <= 1; i++) {
        const bin = createBox(0.95, 0.55, 0.95, 0x7a5a3a);
        bin.position.set(i * 1.1, 0.275, 0);
        g.add(bin);

        const pile = new THREE.Mesh(
          new THREE.SphereGeometry(0.48, 10, 8),
          new THREE.MeshStandardMaterial({ color: 0x4a341f, roughness: 1 })
        );
        pile.scale.set(1, 0.55, 1);
        pile.position.set(i * 1.1, 0.6, 0);
        pile.castShadow = true;
        g.add(pile);
      }
      registerGroup('composting', g);
    }

    // 4. Black Soldier Fly Unit
    let flyPoints: THREE.Points | null = null;
    {
      const g = new THREE.Group();
      const shed = createBox(1.6, 1.15, 1.3, 0x5b6b73);
      shed.position.y = 0.575;
      g.add(shed);

      const roof = createBox(1.8, 0.12, 1.5, 0x3b464c);
      roof.position.y = 1.2;
      g.add(roof);

      for (let i = 0; i < 3; i++) {
        const tray = createBox(1.3, 0.07, 0.95, 0xcbb27a);
        tray.position.set(0, 1.35 + i * 0.001, 0.9 + i * 0.35);
        g.add(tray);
      }

      // Buzzing soldier flies
      const flyCount = 28;
      const flyGeo = new THREE.BufferGeometry();
      const flyPositions = new Float32Array(flyCount * 3);
      for (let j = 0; j < flyCount; j++) {
        flyPositions[j * 3] = (Math.random() - 0.5) * 1.8;
        flyPositions[j * 3 + 1] = 1.45 + Math.random() * 0.6;
        flyPositions[j * 3 + 2] = (Math.random() - 0.5) * 1.8;
      }
      flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPositions, 3));
      flyPoints = new THREE.Points(
        flyGeo,
        new THREE.PointsMaterial({ color: 0x181818, size: 0.055 })
      );
      g.add(flyPoints);
      registerGroup('bsf', g);
    }

    // 5. Cassava Feed Plot
    {
      const g = new THREE.Group();
      const soil = new THREE.Mesh(
        new THREE.CircleGeometry(2.3, 24),
        new THREE.MeshStandardMaterial({ color: 0x5c3f26, roughness: 1 })
      );
      soil.rotation.x = -Math.PI / 2;
      soil.position.y = 0.01;
      soil.receiveShadow = true;
      g.add(soil);

      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const stem = createCyl(0.045, 0.055, 0.55, 0x8a6a3f, 6);
          stem.position.set(r * 0.72, 0.275, c * 0.72);
          g.add(stem);

          const leaf = createCone(0.32, 0.6, 6, 0x5c9a4a);
          leaf.position.set(r * 0.72, 0.7, c * 0.72);
          g.add(leaf);
        }
      }
      for (let row = -2; row <= 2; row++) {
        const irrigation = createCyl(0.025, 0.025, 3.8, 0x202b25, 6);
        irrigation.rotation.z = Math.PI / 2;
        irrigation.position.set(0, 0.05, row * 0.38);
        g.add(irrigation);
      }
      registerGroup('cassava', g);
    }

    // 6. Solar Array
    {
      const g = new THREE.Group();
      for (let i = -1; i <= 1; i++) {
        const leg = createCyl(0.05, 0.05, 0.95, 0x4a4a4a, 6);
        leg.position.set(i * 1.15, 0.475, 0);
        g.add(leg);

        const panel = createBox(1.05, 0.06, 1.45, 0x1f3b57, 0.35);
        panel.position.set(i * 1.15, 1.0, 0.1);
        panel.rotation.x = -0.52;
        g.add(panel);
      }
      registerGroup('solar', g);
    }

    // 7. Rainwater Tank
    {
      const g = new THREE.Group();
      for (let i = -1; i <= 1; i += 2) {
        const leg = createBox(0.1, 0.75, 0.1, 0x8a8a8a);
        leg.position.set(i * 0.38, 0.375, 0);
        g.add(leg);
      }
      const tank = createCyl(0.58, 0.58, 1.15, 0x9db3bb, 16);
      tank.position.y = 1.32;
      g.add(tank);
      registerGroup('rainwater', g);
    }

    // 8. Biosecurity Station
    {
      const g = new THREE.Group();
      const bath = createCyl(0.52, 0.58, 0.15, 0x3d7ea6, 14);
      bath.position.y = 0.08;
      g.add(bath);

      for (let i = -1; i <= 1; i += 2) {
        const post = createCyl(0.05, 0.05, 1.45, 0xcbb27a, 6);
        post.position.set(i * 0.7, 0.725, 0);
        g.add(post);
      }
      const archBar = createBox(1.48, 0.08, 0.08, 0xcbb27a);
      archBar.position.y = 1.45;
      g.add(archBar);
      registerGroup('biosecurity', g);
    }

    // 9. Processing & Market Hub
    {
      const g = new THREE.Group();
      const body = createBox(2.8, 1.8, 2.0, 0xe7e0cd);
      body.position.y = 0.9;
      g.add(body);

      const roof = createBox(3.2, 0.18, 2.3, 0x9c7b4e);
      roof.position.y = 1.88;
      g.add(roof);

      const cart = createBox(0.75, 0.38, 0.48, 0xb85c3a);
      cart.position.set(1.8, 0.38, 1.3);
      g.add(cart);

      for (let i = -1; i <= 1; i += 2) {
        const wheel = createCyl(0.18, 0.18, 0.08, 0x2b2b2b, 10);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(1.8 + i * 0.22, 0.18, 1.3);
        g.add(wheel);
      }
      registerGroup('market', g);
    }

    // 10. School Demonstration Site
    {
      const g = new THREE.Group();
      const slab = createBox(3.4, 0.14, 2.5, 0xb9b6a6); slab.position.y = 0.07; g.add(slab);
      const body = createBox(3.1, 1.75, 2.2, 0xf0e3bd);
      body.position.y = 0.95;
      g.add(body);
      addGableRoof(g, 3.35, 2.4, 1.92, 0x397c91);
      addDoor(g, 0, 0.75, 1.14, 0x315b58);
      [-1.02, 1.02].forEach((x) => addWindow(g, x, 1.18, 1.14, 0.62));
      const step1 = createBox(1.12, 0.12, 0.46, 0xaaa694); step1.position.set(0, 0.06, 1.42); g.add(step1);
      const sign = createBox(1.85, 0.38, 0.08, 0x173d33); sign.position.set(0, 1.68, 1.14); g.add(sign);

      const pole = createCyl(0.035, 0.035, 1.7, 0x9c9c9c, 6);
      pole.position.set(1.5, 0.85, -1.1);
      g.add(pole);

      const flag = createBox(0.45, 0.3, 0.02, 0xe3a93a);
      flag.position.set(1.72, 1.55, -1.1);
      g.add(flag);
      // Outdoor training circle: benches around a demonstration point.
      [-1, 0, 1].forEach((i) => {
        const bench = createBox(0.72, 0.13, 0.24, 0x8c633f); bench.position.set(i * 0.9, 0.3, 2.25); g.add(bench);
        const legs = createBox(0.48, 0.25, 0.12, 0x5f4a35); legs.position.set(i * 0.9, 0.15, 2.25); g.add(legs);
      });
      registerGroup('school', g);
    }

    // --- Circular Flow Tubes & Animated Moving Particles ---
    interface ParticleFlow {
      curve: THREE.QuadraticBezierCurve3;
      mesh: THREE.Mesh;
      speed: number;
      offset: number;
    }
    const particleFlows: ParticleFlow[] = [];

    FLOW_CONNECTIONS.forEach((conn, idx) => {
      const a = posMap[conn.fromId];
      const b = posMap[conn.toId];
      if (!a || !b) return;

      const sway = conn.sway || 0;
      const start = new THREE.Vector3(a.x, 1.1, a.z);
      const end = new THREE.Vector3(b.x, 1.0, b.z);
      const mid = new THREE.Vector3(
        (a.x + b.x) / 2 + sway,
        conn.height,
        (a.z + b.z) / 2 + sway
      );
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: conn.colorNum,
        transparent: true,
        opacity: 0.3
      });
      scene.add(new THREE.Mesh(tubeGeo, tubeMat));

      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 10),
        new THREE.MeshBasicMaterial({ color: conn.colorNum })
      );
      scene.add(particle);
      particleFlows.push({
        curve,
        mesh: particle,
        speed: 0.09 + (idx % 4) * 0.015,
        offset: idx * 0.12
      });
    });

    // --- Selection Glow Ring ---
    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.0, 1.4, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide
      })
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.03;
    scene.add(glowRing);

    // --- Raycasting for Clicks & Taps ---
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let pointerDownPos: { x: number; y: number } | null = null;

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!pointerDownPos) return;
      const dx = ev.clientX - pointerDownPos.x;
      const dy = ev.clientY - pointerDownPos.y;
      pointerDownPos = null;
      if (Math.sqrt(dx * dx + dy * dy) > 8) return; // ignore drags

      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointerNDC, camera);
      const allMeshes: THREE.Mesh[] = [];
      Object.keys(hotspotGroups).forEach((id) => {
        hotspotGroups[id].traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            allMeshes.push(child as THREE.Mesh);
          }
        });
      });

      const hits = raycaster.intersectObjects(allMeshes, false);
      if (hits.length > 0) {
        let currentObj: THREE.Object3D | null = hits[0].object;
        while (currentObj && !currentObj.userData.hotspotId) {
          currentObj = currentObj.parent;
        }
        if (currentObj && currentObj.userData.hotspotId) {
          onSelectHotspot(currentObj.userData.hotspotId);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    domEl.addEventListener('pointerup', onPointerUp);

    // --- Resize Handler ---
    const resize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Animate flow particles
      particleFlows.forEach((fp) => {
        const tt = (t * fp.speed + fp.offset) % 1;
        fp.mesh.position.copy(fp.curve.getPointAt(tt));
      });

      // Animate BSF flies
      if (flyPoints) {
        flyPoints.rotation.y = t * 0.65;
        flyPoints.position.y = Math.sin(t * 3.2) * 0.05;
      }

      // Update Glow Ring for current selected element
      const activeId = selectedIdRef.current;
      if (activeId && posMap[activeId]) {
        const p = posMap[activeId];
        glowRing.position.set(p.x, 0.03, p.z);
        const meta = HOTSPOTS_DATA.find((m) => m.id === activeId);
        if (meta) {
          glowRing.material.color.setHex(meta.colorNum);
        }
        glowRing.material.opacity += (0.6 - glowRing.material.opacity) * 0.1;
        glowRing.scale.setScalar(1 + Math.sin(t * 2.8) * 0.05);
      } else {
        glowRing.material.opacity += (0 - glowRing.material.opacity) * 0.15;
      }

      // Smooth camera interpolation toward target if in walkthrough or focus
      if (cameraTargetPos.current) {
        camera.position.lerp(cameraTargetPos.current, 0.06);
        if (camera.position.distanceTo(cameraTargetPos.current) < 0.05) {
          cameraTargetPos.current = null;
        }
      }
      if (controlsTargetPos.current) {
        controls.target.lerp(controlsTargetPos.current, 0.06);
        if (controls.target.distanceTo(controlsTargetPos.current) < 0.05) {
          controlsTargetPos.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointerup', onPointerUp);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  // Whenever selectedId changes, smoothly glide the camera to frame that building
  useEffect(() => {
    if (!selectedId) return;
    const meta = HOTSPOTS_DATA.find((h) => h.id === selectedId);
    if (!meta) return;

    cameraTargetPos.current = new THREE.Vector3(
      meta.cameraFocus.camX,
      meta.cameraFocus.camY,
      meta.cameraFocus.camZ
    );
    controlsTargetPos.current = new THREE.Vector3(
      meta.cameraFocus.x,
      meta.cameraFocus.y,
      meta.cameraFocus.z
    );
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      id="threejs-canvas-wrap"
      className="relative w-full h-full min-h-[350px] overflow-hidden select-none bg-gradient-to-b from-[#bfe3ea] via-[#dff0d8] to-[#e8f2d9] rounded-2xl"
    >
      <div 
        id="canvas-hint"
        className="absolute left-3 top-3 z-10 font-mono text-[11px] text-[#28321f] bg-white/75 backdrop-blur-sm border border-black/5 px-3 py-1.5 rounded-full pointer-events-none shadow-sm flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#8bbf6f] animate-pulse" />
        <span>Drag to orbit &middot; Scroll to zoom &middot; Tap any station to open</span>
      </div>
    </div>
  );
};
