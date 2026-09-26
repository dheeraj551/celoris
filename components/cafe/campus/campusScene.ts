// Blocky ("voxel") campus for the Classrooms lobby. Every building is a real
// classroom from cafe_classrooms; its sign shows the trainer and the real next
// class time. All art (pixel textures, block people) is drawn in code — our
// own style, no assets from any existing game.
//
// Performance notes: blocks are InstancedMeshes (one draw call per block
// type), textures are 16x16 with nearest filtering, and the scene only
// re-renders when the camera moves (plus a slow pulse for LIVE rooms).

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface CampusRoom {
  id: string;
  name: string;
  trainer: string;
  /** "LIVE NOW", "Next: Fri 7:00 PM", "New batch 1 Oct"… */
  subtitle: string;
  isLive: boolean;
  isWhiteboard: boolean;
  /** People drawn at the door of a live room (host-set present count, max 5). */
  presentCount: number;
}

type BlockKind =
  | 'grass' | 'dirt' | 'path' | 'planks' | 'bricks' | 'white' | 'roof' | 'log' | 'leaves' | 'window' | 'water';

const W = 9; // building footprint (x)
const D = 7; // building footprint (z)
const H = 5; // wall height

// Small deterministic random so the campus looks the same on every visit.
function makeRandom(seedStart: number) {
  let seed = seedStart;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

export class CampusScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private root = new THREE.Group();
  private pickables: THREE.Object3D[] = [];
  private liveBeams: THREE.Mesh[] = [];
  private raycaster = new THREE.Raycaster();
  private disposed = false;
  private pulseFrame = 0;
  private resizeObserver: ResizeObserver;
  private rnd = makeRandom(7);
  private textures: THREE.Texture[] = [];
  private materials: Record<string, THREE.MeshLambertMaterial> = {};
  // Later blocks replace earlier ones at the same spot (no overlapping faces).
  private blocks = new Map<string, BlockKind>();
  private downAt: { x: number; y: number } | null = null;

  constructor(private container: HTMLElement, rooms: CampusRoom[], private onPick: (roomId: string) => void) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.touchAction = 'none';
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x8fd0ff);
    this.scene.fog = new THREE.Fog(0x8fd0ff, 80, 170);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 400);

    this.scene.add(new THREE.HemisphereLight(0xdff2ff, 0x5b7a3a, 1.35));
    const sun = new THREE.DirectionalLight(0xfff2d6, 2.2);
    sun.position.set(40, 60, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 1, far: 180 });
    this.scene.add(sun);
    this.scene.add(this.root);

    this.buildMaterials();
    if ((container.clientWidth || 1) / (container.clientHeight || 1) < 1) this.labelScale = 0.21;
    const extent = this.buildCampus(rooms);

    // Camera: 3/4 view over the whole campus.
    const aspect = Math.max(0.5, (container.clientWidth || 1) / (container.clientHeight || 1));
    // Narrow (phone) screens need the camera further back to fit the campus.
    const narrow = aspect < 1;
    const dist = Math.max(40, extent * (narrow ? 2.3 : 1.8));
    // Phones get a steeper, more top-down view so the rows of buildings
    // (and their labels) spread out vertically instead of overlapping.
    if (narrow) this.camera.position.set(dist * 0.18, dist * 1.05, dist * 0.42);
    else this.camera.position.set(dist * 0.62, dist * 0.72, dist * 0.8);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, -1);
    this.controls.enablePan = false;
    this.controls.minDistance = 18;
    this.controls.maxDistance = dist * 1.6;
    this.controls.minPolarAngle = 0.15;
    this.controls.maxPolarAngle = 1.2;
    this.controls.update();
    this.controls.addEventListener('change', this.render);

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointermove', this.onPointerMove);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    // Gentle pulse on LIVE beams: a few frames per second via rAF (pauses
    // automatically in background tabs and never floods slow devices).
    if (this.liveBeams.length) {
      let last = 0;
      const tick = (now: number) => {
        if (this.disposed) return;
        if (now - last > 250) {
          last = now;
          const o = 0.25 + 0.15 * Math.sin(now / 400);
          for (const b of this.liveBeams) (b.material as THREE.MeshBasicMaterial).opacity = o;
          this.render();
        }
        this.pulseFrame = requestAnimationFrame(tick);
      };
      this.pulseFrame = requestAnimationFrame(tick);
    }
  }

  // -------------------------------------------------------------------------
  // Textures & materials
  // -------------------------------------------------------------------------

  private pixelTex(draw: (g: CanvasRenderingContext2D, s: number) => void, size = 16) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d')!;
    draw(g, size);
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    this.textures.push(t);
    return t;
  }

  private noise(g: CanvasRenderingContext2D, s: number, base: [number, number, number], spread: number) {
    for (let x = 0; x < s; x++)
      for (let y = 0; y < s; y++) {
        const k = (this.rnd() - 0.5) * spread;
        g.fillStyle = `rgb(${base[0] + k},${base[1] + k},${base[2] + k})`;
        g.fillRect(x, y, 1, 1);
      }
  }

  private buildMaterials() {
    const tex = {
      grassTop: this.pixelTex((g, s) => this.noise(g, s, [98, 170, 72], 34)),
      grassSide: this.pixelTex((g, s) => {
        this.noise(g, s, [134, 96, 67], 30);
        for (let x = 0; x < s; x++) {
          const h = 3 + Math.floor(this.rnd() * 3);
          for (let y = 0; y < h; y++) {
            g.fillStyle = `rgb(${90 + this.rnd() * 30},${160 + this.rnd() * 25},66)`;
            g.fillRect(x, y, 1, 1);
          }
        }
      }),
      dirt: this.pixelTex((g, s) => this.noise(g, s, [134, 96, 67], 30)),
      path: this.pixelTex((g, s) => this.noise(g, s, [176, 170, 160], 30)),
      planks: this.pixelTex((g, s) => {
        this.noise(g, s, [176, 134, 82], 18);
        g.fillStyle = 'rgba(80,50,25,.55)';
        for (let y = 3; y < s; y += 4) g.fillRect(0, y, s, 1);
        g.fillRect(5, 0, 1, 4); g.fillRect(11, 4, 1, 4); g.fillRect(3, 8, 1, 4); g.fillRect(12, 12, 1, 4);
      }),
      bricks: this.pixelTex((g, s) => {
        this.noise(g, s, [168, 78, 62], 22);
        g.fillStyle = '#d9cfc4';
        for (let y = 0; y < s; y += 4) g.fillRect(0, y, s, 1);
        for (let y = 0; y < s; y += 4) {
          const o = (y / 4) % 2 ? 4 : 0;
          for (let x = o; x < s; x += 8) g.fillRect(x, y, 1, 4);
        }
      }),
      white: this.pixelTex((g, s) => this.noise(g, s, [232, 228, 218], 12)),
      roof: this.pixelTex((g, s) => {
        this.noise(g, s, [70, 84, 110], 16);
        g.fillStyle = 'rgba(0,0,0,.25)';
        for (let y = 0; y < s; y += 4) g.fillRect(0, y, s, 1);
      }),
      log: this.pixelTex((g, s) => {
        this.noise(g, s, [104, 76, 46], 22);
        g.fillStyle = 'rgba(40,25,10,.4)';
        for (let x = 1; x < s; x += 3) g.fillRect(x, 0, 1, s);
      }),
      leaves: this.pixelTex((g, s) => this.noise(g, s, [58, 132, 52], 50)),
      window: this.pixelTex((g, s) => {
        g.fillStyle = '#ffe9a8'; g.fillRect(0, 0, s, s);
        g.fillStyle = '#e8c979'; g.fillRect(0, 7, s, 2); g.fillRect(7, 0, 2, s);
        g.fillStyle = '#6b4a2b';
        g.fillRect(0, 0, s, 1); g.fillRect(0, s - 1, s, 1); g.fillRect(0, 0, 1, s); g.fillRect(s - 1, 0, 1, s);
      }),
      water: this.pixelTex((g, s) => this.noise(g, s, [60, 130, 210], 26)),
    };
    for (const [k, t] of Object.entries(tex)) this.materials[k] = new THREE.MeshLambertMaterial({ map: t });
    this.materials.window.emissive = new THREE.Color(0x5a4210);
    this.materials.water.transparent = true;
    this.materials.water.opacity = 0.9;
  }

  // -------------------------------------------------------------------------
  // Blocks
  // -------------------------------------------------------------------------

  private block(x: number, y: number, z: number, kind: BlockKind) {
    this.blocks.set(`${x},${y},${z}`, kind);
  }

  private flushBlocks() {
    const cube = new THREE.BoxGeometry(1, 1, 1);
    const m = this.materials;
    const dummy = new THREE.Object3D();
    const buckets: Partial<Record<BlockKind, Array<[number, number, number]>>> = {};
    this.blocks.forEach((kind, key) => {
      const [x, y, z] = key.split(',').map(Number);
      (buckets[kind] ||= []).push([x, y, z]);
    });
    for (const [kind, list] of Object.entries(buckets) as Array<[BlockKind, Array<[number, number, number]>]>) {
      const material: THREE.Material | THREE.Material[] =
        kind === 'grass' ? [m.grassSide, m.grassSide, m.grassTop, m.dirt, m.grassSide, m.grassSide] : m[kind];
      const mesh = new THREE.InstancedMesh(cube, material, list.length);
      list.forEach(([x, y, z], i) => {
        dummy.position.set(x + 0.5, y + 0.5, z + 0.5);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.castShadow = kind !== 'water';
      mesh.receiveShadow = true;
      this.root.add(mesh);
    }
    this.blocks.clear();
  }

  // -------------------------------------------------------------------------
  // Text (signs & floating labels)
  // -------------------------------------------------------------------------

  private fitFont(g: CanvasRenderingContext2D, text: string, start: number, maxWidth: number) {
    let size = start;
    do {
      g.font = `bold ${size}px "Courier New", monospace`;
      size -= 2;
    } while (g.measureText(text).width > maxWidth && size > 16);
  }

  private canvasTexture(c: HTMLCanvasElement) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    this.textures.push(t);
    return t;
  }

  private doorSign(room: CampusRoom) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#6b4a2b'; g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#8a6238'; g.fillRect(10, 10, 492, 236);
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4;
    for (let y = 60; y < 256; y += 60) { g.beginPath(); g.moveTo(10, y); g.lineTo(502, y); g.stroke(); }
    g.textAlign = 'center';
    g.fillStyle = '#fff7e0'; this.fitFont(g, room.name.toUpperCase(), 38, 470); g.fillText(room.name.toUpperCase(), 256, 70);
    g.fillStyle = '#f5deb3'; this.fitFont(g, `with ${room.trainer}`, 30, 470); g.fillText(`with ${room.trainer}`, 256, 132);
    g.fillStyle = room.isLive ? '#ff5a4f' : '#ffe08a';
    const sub = room.isLive ? '● LIVE NOW' : room.subtitle;
    this.fitFont(g, sub, 34, 470); g.fillText(sub, 256, 200);
    return new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.6), new THREE.MeshBasicMaterial({ map: this.canvasTexture(c) }));
  }

  private labelScale = 0.26;

  private floatLabel(room: CampusRoom) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 160;
    const g = c.getContext('2d')!;
    g.fillStyle = room.isLive ? '#b91c1c' : 'rgba(15,23,42,0.92)';
    g.fillRect(0, 0, 512, 160);
    g.fillStyle = room.isLive ? '#fecaca' : '#fbbf24';
    g.fillRect(0, 150, 512, 10);
    g.textAlign = 'center';
    g.fillStyle = '#ffffff';
    this.fitFont(g, room.name.toUpperCase(), 48, 480);
    g.fillText(room.name.toUpperCase(), 256, 66);
    g.fillStyle = room.isLive ? '#ffffff' : '#fde68a';
    const sub = room.isLive ? '● LIVE NOW' : room.subtitle;
    this.fitFont(g, sub, 36, 480);
    g.fillText(sub, 256, 122);
    // Fixed on-screen size (not shrinking with distance) so labels stay readable on phones.
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.canvasTexture(c), depthTest: false, sizeAttenuation: false }));
    sprite.scale.set(this.labelScale, this.labelScale * 0.3125, 1);
    sprite.renderOrder = 10;
    return sprite;
  }

  // -------------------------------------------------------------------------
  // Block people (decorative)
  // -------------------------------------------------------------------------

  private person(x: number, z: number, rotY: number, wave = false) {
    const SKINS = ['#e0ac82', '#c68a5f', '#8d5a3b', '#f1c9a5', '#a96f47'];
    const HAIRS = ['#2a1c12', '#4a2f1b', '#111111', '#6b3f20', '#1d1a2a'];
    const SHIRTS = [0x3b82f6, 0xef4444, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899, 0x14b8a6, 0xf97316];
    const skin = SKINS[Math.floor(this.rnd() * SKINS.length)];
    const hair = HAIRS[Math.floor(this.rnd() * HAIRS.length)];
    const face = this.pixelTex((g, s) => {
      g.fillStyle = skin; g.fillRect(0, 0, s, s);
      g.fillStyle = hair; g.fillRect(0, 0, s, 4); g.fillRect(0, 4, 2, 3); g.fillRect(14, 4, 2, 3);
      g.fillStyle = '#ffffff'; g.fillRect(3, 7, 3, 2); g.fillRect(10, 7, 3, 2);
      g.fillStyle = '#2b2b3a'; g.fillRect(4, 7, 2, 2); g.fillRect(10, 7, 2, 2);
      g.fillStyle = '#b5654f'; g.fillRect(6, 11, 4, 1);
    });
    const skinMat = new THREE.MeshLambertMaterial({ color: skin });
    const hairMat = new THREE.MeshLambertMaterial({ color: hair });
    const faceMat = new THREE.MeshLambertMaterial({ map: face });
    const shirtMat = new THREE.MeshLambertMaterial({ color: SHIRTS[Math.floor(this.rnd() * SHIRTS.length)] });
    const pantsMat = new THREE.MeshLambertMaterial({ color: 0x2c3e66 });
    const g = new THREE.Group();
    const s = 1 / 16;
    const part = (w: number, h: number, d: number, mat: THREE.Material, px: number, py: number, pz: number, pivotTop = false) => {
      const geo = new THREE.BoxGeometry(w * s, h * s, d * s);
      if (pivotTop) geo.translate(0, (-h / 2) * s, 0);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(px * s, py * s, pz * s);
      m.castShadow = true;
      g.add(m);
      return m;
    };
    part(4, 12, 4, pantsMat, -2, 6, 0);
    part(4, 12, 4, pantsMat, 2, 6, 0);
    part(8, 12, 4, shirtMat, 0, 18, 0);
    part(4, 12, 4, shirtMat, -6, 24, 0, true);
    const armR = part(4, 12, 4, shirtMat, 6, 24, 0, true);
    if (wave) armR.rotation.z = 2.7;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), [hairMat, hairMat, hairMat, skinMat, faceMat, hairMat]);
    head.position.set(0, 28 * s, 0);
    head.castShadow = true;
    g.add(head);
    g.position.set(x, 1, z);
    g.rotation.y = rotY;
    this.root.add(g);
  }

  // -------------------------------------------------------------------------
  // Campus layout
  // -------------------------------------------------------------------------

  private tree(x: number, z: number, h = 4) {
    for (let y = 1; y <= h; y++) this.block(x, y, z, 'log');
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++)
        for (let dy = h - 1; dy <= h; dy++) {
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
          if (dx === 0 && dz === 0 && dy < h) continue;
          this.block(x + dx, dy + 1, z + dz, 'leaves');
        }
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) this.block(x + dx, h + 2, z + dz, 'leaves');
  }

  private building(room: CampusRoom, index: number, bx: number, bz: number, facing: 1 | -1) {
    const walls: BlockKind[] = ['bricks', 'white', 'planks'];
    const wall: BlockKind = room.isWhiteboard ? 'white' : walls[index % walls.length];
    for (let x = 0; x < W; x++)
      for (let z = 0; z < D; z++) {
        this.block(bx + x, 0, bz + z, 'planks');
        for (let y = 1; y <= H; y++) {
          const edge = x === 0 || x === W - 1 || z === 0 || z === D - 1;
          if (!edge) continue;
          const doorSide = facing > 0 ? x === W - 1 : x === 0;
          if (doorSide && z === 3 && y <= 2) continue;
          const corner = (x === 0 || x === W - 1) && (z === 0 || z === D - 1);
          const isWindow = !corner && y === 3 && (z === 0 || z === D - 1 ? x % 2 === 1 : z % 2 === 1 && z !== 3);
          this.block(bx + x, y, bz + z, corner ? 'log' : isWindow ? 'window' : wall);
        }
      }
    for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) this.block(bx + x, H + 1, bz + z, 'roof');
    for (let x = 1; x < W - 1; x++) for (let z = 1; z < D - 1; z++) this.block(bx + x, H + 2, bz + z, 'roof');

    // Door sign
    const sign = this.doorSign(room);
    const doorX = facing > 0 ? bx + W + 0.02 : bx - 0.02;
    sign.position.set(doorX, 4.1, bz + 3.5);
    sign.rotation.y = facing > 0 ? Math.PI / 2 : -Math.PI / 2;
    this.root.add(sign);

    // Floating label (always faces the camera)
    const label = this.floatLabel(room);
    label.position.set(bx + W / 2, H + 5.2, bz + D / 2);
    this.root.add(label);

    // Invisible pick box covering the building
    const pick = new THREE.Mesh(
      new THREE.BoxGeometry(W + 1, H + 2.5, D + 1),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    pick.position.set(bx + W / 2, (H + 2.5) / 2, bz + D / 2);
    pick.userData.roomId = room.id;
    label.userData.roomId = room.id;
    this.root.add(pick);
    this.pickables.push(pick, label);

    // Path from door to the main path
    const doorZ = bz + 3;
    const [from, to] = facing > 0 ? [bx + W, -2] : [2, bx - 1];
    for (let x = from; x <= to; x++) this.block(x, 0, doorZ, 'path');

    if (room.isLive) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 14, 0.8),
        new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0.35 })
      );
      beam.position.set(bx + W / 2, H + 9, bz + D / 2);
      this.root.add(beam);
      this.liveBeams.push(beam);
      const glow = new THREE.PointLight(0xff5a4f, 12, 9);
      glow.position.set(doorX + (facing > 0 ? 1.2 : -1.2), 3, bz + 3.5);
      this.root.add(glow);
      // People at the door = the room's present count (max 5)
      const n = Math.min(5, Math.max(0, room.presentCount));
      for (let i = 0; i < n; i++) {
        const px = facing > 0 ? bx + W + 1.3 + i * 0.95 : bx - 1.3 - i * 0.95;
        this.person(px, bz + 3.5, facing > 0 ? -Math.PI / 2 : Math.PI / 2, i === n - 1);
      }
    }
  }

  /** Builds everything; returns the campus half-size (for camera distance). */
  private buildCampus(rooms: CampusRoom[]) {
    const rows = Math.max(1, Math.ceil(rooms.length / 2));
    const rowSpacing = 13;
    const halfZ = Math.ceil((rows * rowSpacing) / 2) + 8;
    const halfX = 26;
    const firstRowZ = -Math.floor((rows * rowSpacing) / 2) + 2;

    for (let x = -halfX; x < halfX; x++)
      for (let z = -halfZ; z < halfZ; z++) {
        const onMain = Math.abs(x) <= 1;
        const pond = (x - 18) ** 2 / 20 + (z - (halfZ - 9)) ** 2 / 12 < 1;
        if (pond) {
          this.block(x, -1, z, 'dirt');
          this.block(x, 0, z, 'water');
          continue;
        }
        this.block(x, 0, z, onMain ? 'path' : 'grass');
      }

    rooms.forEach((room, i) => {
      const left = i % 2 === 0;
      const bz = firstRowZ + Math.floor(i / 2) * rowSpacing;
      const bx = left ? -13 : 4;
      this.building(room, i, bx, bz, left ? 1 : -1);
    });

    // Gate at the south end
    const gateZ = halfZ - 3;
    for (let y = 1; y <= 5; y++) {
      this.block(-3, y, gateZ, 'log');
      this.block(3, y, gateZ, 'log');
    }
    for (let x = -3; x <= 3; x++) this.block(x, 6, gateZ, 'planks');
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#6b4a2b'; g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#8a6238'; g.fillRect(10, 10, 492, 236);
    g.textAlign = 'center';
    g.fillStyle = '#fff7e0'; g.font = 'bold 58px "Courier New", monospace'; g.fillText('CELORIS CAMPUS', 256, 110);
    g.fillStyle = '#ffe08a'; g.font = 'bold 30px "Courier New", monospace'; g.fillText('Live classes · Small batches', 256, 180);
    const gateSign = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), new THREE.MeshBasicMaterial({ map: this.canvasTexture(c) }));
    gateSign.position.set(0, 7.9, gateZ + 1.05);
    this.root.add(gateSign);

    // Trees along the edges
    const treeSpots: Array<[number, number]> = [];
    for (let z = -halfZ + 4; z < halfZ - 4; z += 11) {
      treeSpots.push([-22, z], [21, z + 5]);
    }
    treeSpots.push([-8, gateZ - 2], [9, gateZ - 3]);
    treeSpots.forEach(([x, z], k) => this.tree(x, z, 4 + (k % 2)));

    this.flushBlocks();

    // Two people walking up the main path (decoration)
    this.person(0.4, gateZ - 6, Math.PI);
    this.person(-0.6, gateZ - 12, Math.PI, true);

    return Math.max(halfX, halfZ);
  }

  // -------------------------------------------------------------------------
  // Interaction, rendering, cleanup
  // -------------------------------------------------------------------------

  private pickAt(clientX: number, clientY: number): string | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    // Labels are drawn on top of everything, so a label under the finger wins.
    const hit = hits.find((h) => h.object.type === 'Sprite') || hits[0];
    return (hit?.object.userData.roomId as string) || null;
  }

  private onPointerDown = (e: PointerEvent) => {
    this.downAt = { x: e.clientX, y: e.clientY };
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.downAt) return;
    const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y);
    this.downAt = null;
    if (moved > 6) return; // it was a drag (rotating the camera), not a tap
    const id = this.pickAt(e.clientX, e.clientY);
    if (id) this.onPick(id);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || this.downAt) return;
    this.renderer.domElement.style.cursor = this.pickAt(e.clientX, e.clientY) ? 'pointer' : 'grab';
  };

  private resize() {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  render = () => {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.pulseFrame);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointermove', this.onPointerMove);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = (mesh as any).material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    this.textures.forEach((t) => t.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    el.remove();
  }
}
