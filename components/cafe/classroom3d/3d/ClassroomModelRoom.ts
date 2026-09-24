import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { CameraPreset } from '../types';

// The real 3D classroom model (public/models/classroom.glb) and the room
// layouts the scene switches between.
//
// Model: "Classroom" by stylo0 on Sketchfab (Sketchfab Standard licence).
// It was compressed for the web with gltf-transform (meshopt, 3.7 MB ->
// 0.6 MB); node names are unchanged. Seat, board and lectern positions
// below were measured from this exact file, so if the GLB is swapped for a
// different model these numbers have to be measured again.

export const CLASSROOM_MODEL_URL = '/models/classroom.glb';

export type Vec3 = [number, number, number];

export interface SeatSlotDef {
  code: string;
  row: number;
  col: number;
  x: number;
  y: number;
  z: number;
}

export interface RoomLayout {
  kind: 'auditorium' | 'classroom';
  presets: Record<CameraPreset, { pos: Vec3; look: Vec3 }>;
  camMin: Vec3;
  camMax: Vec3;
  targetMin: Vec3;
  targetMax: Vec3;
  minDistance: number;
  maxDistance: number;
  /** Camera placement when zooming onto a student (relative to their desk). */
  focus: { up: number; forward: number; lookUp: number; lookBack: number };
  /** Chair centre relative to the desk centre (+z = away from the board). */
  chairOffsetZ: number;
  /** "My seat" camera: height above the floor and distance behind the chair. */
  seatEye: { up: number; back: number; side: number };
  /** Where a seated student looks (the board). */
  boardLook: Vec3;
  teacher: { pos: Vec3; rotY: number };
  spotlightY: number;
  dust: { halfX: number; minY: number; maxY: number; halfZ: number; size: number };
}

// The original procedural "grand auditorium" (still used as the fallback if
// the model can't be downloaded).
export const AUDITORIUM_LAYOUT: RoomLayout = {
  kind: 'auditorium',
  presets: {
    teacher: { pos: [-4.0, 1.92, -10.55], look: [0, 1.85, 3.2] },
    board: { pos: [0, 5.2, -5.5], look: [0, 5.2, -13.74] },
    overview: { pos: [10.5, 7.8, 10.5], look: [0, 2.5, -4.0] },
    balcony: { pos: [0, 6.8, 12.8], look: [0, 3.8, -8.0] },
    'student-row1': { pos: [-1.8, 1.4, -2.5], look: [0, 4.8, -13.74] },
    'student-row3': { pos: [2.2, 2.6, 4.2], look: [0, 4.8, -13.74] },
  },
  camMin: [-13.4, 0.8, -12.8],
  camMax: [13.4, 10.2, 13.4],
  targetMin: [-9.0, 0.5, -12.5],
  targetMax: [9.0, 7.5, 11.0],
  minDistance: 2.0,
  maxDistance: 22.5,
  focus: { up: 1.8, forward: 2.8, lookUp: 1.1, lookBack: 0.8 },
  chairOffsetZ: 0.85,
  seatEye: { up: 1.75, back: 0.9, side: 0 },
  boardLook: [0, 4.8, -13.74],
  teacher: { pos: [-4.0, 0, -9.95], rotY: 0.14 },
  spotlightY: 11.2,
  dust: { halfX: 13, minY: 0.5, maxY: 9.0, halfZ: 12, size: 0.08 },
};

// ---------------------------------------------------------------- classroom
// World coordinates after the model is turned 180° so the board faces the
// same way as the auditorium's (board at -z, students looking towards -z,
// windows on the left at -x).

/** Green writing surface of the chalkboard. */
export const CLASSROOM_BOARD = {
  center: new THREE.Vector3(-0.159, 1.6485, -4.808),
  width: 4.354,
  height: 1.135,
  /** A shared screen may overhang the board a little, like a projector image. */
  maxShareHeight: 1.45,
  shareCenterY: 1.7,
};

const LECTERN_POS = new THREE.Vector3(2.85, 0, -3.3);
const LECTERN_ROT_Y = -0.42;

const DESK_COLUMNS_X = [-2.93, -0.99, 0.95, 2.89]; // left -> right as seen by students
const DESK_ROWS_Z = [-1.57, -0.07, 1.44, 2.94]; // front row (A) -> back row (D)

export const CLASSROOM_SEATS: SeatSlotDef[] = [];
DESK_ROWS_Z.forEach((z, r) => {
  DESK_COLUMNS_X.forEach((x, c) => {
    CLASSROOM_SEATS.push({
      code: `${String.fromCharCode(65 + r)}-0${c + 1}`,
      row: r + 1,
      col: c,
      x,
      y: 0,
      z,
    });
  });
});

export const CLASSROOM_DESK_TOP_Y = 0.845;

const boardCenter: Vec3 = [CLASSROOM_BOARD.center.x, 1.6, CLASSROOM_BOARD.center.z];

export const CLASSROOM_LAYOUT: RoomLayout = {
  kind: 'classroom',
  presets: {
    // Trainer standing behind the lectern, looking over the class.
    teacher: { pos: [2.3, 1.9, -4.45], look: [-0.9, 0.75, 1.6] },
    board: { pos: [-0.159, 1.6, -1.25], look: [-0.159, 1.62, -4.808] },
    overview: { pos: [3.5, 2.55, 4.5], look: [-0.7, 0.75, -1.6] },
    balcony: { pos: [0, 2.7, 4.55], look: boardCenter },
    'student-row1': { pos: [-0.97, 1.4, -0.75], look: boardCenter },
    'student-row3': { pos: [0.95, 1.45, 2.3], look: boardCenter },
  },
  camMin: [-4.15, 0.6, -4.55],
  camMax: [3.8, 3.05, 4.7],
  targetMin: [-4.3, 0.3, -4.9],
  targetMax: [4.0, 3.1, 4.8],
  minDistance: 1.0,
  maxDistance: 9.0,
  focus: { up: 1.55, forward: 1.9, lookUp: 1.0, lookBack: 0.3 },
  chairOffsetZ: 0.33,
  seatEye: { up: 1.6, back: 0.78, side: 0.2 },
  boardLook: boardCenter,
  teacher: { pos: [3.2, 0, -3.95], rotY: LECTERN_ROT_Y },
  spotlightY: 3.15,
  dust: { halfX: 4.0, minY: 0.3, maxY: 3.0, halfZ: 4.6, size: 0.025 },
};

export interface ClassroomModel {
  root: THREE.Group;
  lectern: THREE.Object3D | null;
}

let loaderSingleton: GLTFLoader | null = null;
function getLoader() {
  if (!loaderSingleton) {
    loaderSingleton = new GLTFLoader();
    loaderSingleton.setMeshoptDecoder(MeshoptDecoder);
  }
  return loaderSingleton;
}

const NO_RAYCAST = () => {};

/** Downloads the classroom model and prepares it for the scene. */
export async function loadClassroomModel(url: string = CLASSROOM_MODEL_URL): Promise<ClassroomModel> {
  const gltf = await getLoader().loadAsync(url);
  const root = new THREE.Group();
  root.name = 'classroom-model';

  const model = gltf.scene;
  model.rotation.y = Math.PI;
  root.add(model);

  model.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // Only our own seat hit-boxes and the lectern need to be clickable;
    // skipping the 85k-triangle room keeps hover checks cheap.
    mesh.raycast = NO_RAYCAST;
  });
  // Ceiling light fittings: they are the light source, so they shouldn't
  // throw shadows onto the desks.
  ['Object_25', 'Object_26'].forEach((name) => {
    const o = model.getObjectByName(name);
    if (o) o.castShadow = false;
  });

  root.updateMatrixWorld(true);

  // Move the lectern from the middle of the board to the front-right corner
  // so it no longer hides the board (and a shared screen) from the class.
  let lectern: THREE.Object3D | null = null;
  const lecternMesh = model.getObjectByName('Object_31');
  if (lecternMesh) {
    const box = new THREE.Box3().setFromObject(lecternMesh);
    const centre = box.getCenter(new THREE.Vector3());
    const pivot = new THREE.Group();
    pivot.name = 'lectern';
    pivot.position.set(centre.x, 0, centre.z);
    root.add(pivot);
    pivot.updateMatrixWorld(true);
    pivot.attach(lecternMesh);
    pivot.position.copy(LECTERN_POS);
    pivot.rotation.y = LECTERN_ROT_Y;
    (lecternMesh as THREE.Mesh).raycast = THREE.Mesh.prototype.raycast;
    lectern = pivot;
  }

  addRoomClosure(root);
  addOutdoorScenery(root);
  return { root, lectern };
}

/** The model is a cut-away (no ceiling, no right or back wall): close it up. */
function addRoomClosure(root: THREE.Group) {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe3e3e3, roughness: 0.92 });
  // Slightly self-lit: a real ceiling is brightened by the tube lights
  // hanging just below it, which a directional light can't reproduce.
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf2f2f0,
    roughness: 0.95,
    emissive: 0xf2f2f0,
    emissiveIntensity: 0.28,
  });
  const skirtingMat = new THREE.MeshStandardMaterial({ color: 0xa56743, roughness: 0.7 });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, cast = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    m.raycast = NO_RAYCAST;
    root.add(m);
    return m;
  };

  // Right wall (x = 4.02) and back wall (z = 4.87), full height 3.24 m.
  add(new THREE.BoxGeometry(0.3, 3.54, 10.34), wallMat, 4.17, 1.47, 0);
  add(new THREE.BoxGeometry(9.1, 3.54, 0.3), wallMat, -0.22, 1.47, 5.02);
  // Ceiling. It doesn't cast shadows, so the overhead "ceiling lights"
  // (a directional light above the room) still reach the desks.
  add(new THREE.BoxGeometry(9.2, 0.16, 10.4), ceilingMat, -0.22, 3.32, 0, false);
  // Skirting boards matching the board frames' wood.
  add(new THREE.BoxGeometry(0.02, 0.1, 9.7), skirtingMat, 4.01, 0.05, 0);
  add(new THREE.BoxGeometry(8.4, 0.1, 0.02), skirtingMat, -0.2, 0.05, 4.86);
}

/** Grass and a few trees so the windows don't look out onto nothing. */
function addOutdoorScenery(root: THREE.Group) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(60, 48),
    new THREE.MeshStandardMaterial({ color: 0x6f8f4e, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.32;
  ground.receiveShadow = true;
  ground.raycast = NO_RAYCAST;
  root.add(ground);

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.9 });
  const leafMats = [0x4f7a3a, 0x5d8a41, 0x44693a].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true })
  );
  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.6, 7);
  const leafGeo = new THREE.IcosahedronGeometry(1.25, 0);
  const trees: Array<[number, number, number]> = [
    [-9.5, -6.5, 1.1], [-11, -1.5, 1.35], [-9.8, 3.2, 1.0], [-12.5, 7.5, 1.4],
    [-15, -9, 1.6], [-16.5, 1.5, 1.7], [-14, 11, 1.5], [-19, -4, 1.9], [-20, 7, 1.8],
  ];
  trees.forEach(([x, z, s], i) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.8;
    const leaves = new THREE.Mesh(leafGeo, leafMats[i % leafMats.length]);
    leaves.position.y = 2.2;
    leaves.scale.set(1, 1.15, 1);
    tree.add(trunk, leaves);
    tree.position.set(x, -0.32, z);
    tree.scale.setScalar(s);
    tree.traverse((o) => {
      (o as THREE.Mesh).raycast = NO_RAYCAST;
    });
    root.add(tree);
  });
}

/** Frees GPU memory for everything under `obj` (geometries, materials, textures). */
export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const anyObj = o as THREE.Mesh;
    if (anyObj.geometry) anyObj.geometry.dispose();
    const mat = anyObj.material as THREE.Material | THREE.Material[] | undefined;
    if (!mat) return;
    const list = Array.isArray(mat) ? mat : [mat];
    list.forEach((m) => {
      const withMap = m as THREE.Material & { map?: THREE.Texture | null };
      if (withMap.map) withMap.map.dispose();
      m.dispose();
    });
  });
}
