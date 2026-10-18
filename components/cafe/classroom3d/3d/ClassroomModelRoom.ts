import * as THREE from 'three';
import type { CameraPreset } from '../types';

// Procedural 14x18m modern classroom architecture inspired by new_3d_room.html.
// Generates the room shell, floor, ceiling, sunlit windows, blackboard frame,
// teacher desk/podium, and exactly 10 student desks arranged in 2 rows of 5.

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

// The original procedural "grand auditorium" (fallback if needed).
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
// Coordinates matching new_3d_room.html (ROOM_W = 14, ROOM_H = 4.5, ROOM_D = 18).
// Board at -z (-8.86), students looking towards -z, windows on the left at -x (-7.0).

/** Green writing surface of the classroom chalkboard. */
export const CLASSROOM_BOARD = {
  center: new THREE.Vector3(0, 2.2, -8.86),
  width: 6.4,
  height: 2.6,
  /** A shared screen may overhang the board a little, like a projector image. */
  maxShareHeight: 2.4,
  shareCenterY: 2.2,
};

// 10 Student Desks: 2 rows of 5 columns
export const DESK_COLUMNS_X = [-3.6, -1.8, 0, 1.8, 3.6]; // 5 columns (symmetrical around center)
export const DESK_ROWS_Z = [-1.6, 1.4]; // 2 rows: Row A (front) and Row B (back)

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

export const CLASSROOM_DESK_TOP_Y = 0.74;

const boardCenter: Vec3 = [CLASSROOM_BOARD.center.x, 2.2, CLASSROOM_BOARD.center.z];

export const CLASSROOM_LAYOUT: RoomLayout = {
  kind: 'classroom',
  presets: {
    // Trainer standing in front of the board/desk, looking over the class
    teacher: { pos: [-1.8, 1.7, -4.8], look: [0, 1.1, 1.5] },
    board: { pos: [0, 2.2, -4.0], look: boardCenter },
    overview: { pos: [5.5, 3.8, 5.5], look: [0, 1.5, -2.0] },
    balcony: { pos: [0, 4.2, 7.5], look: boardCenter },
    'student-row1': { pos: [0, 1.35, -1.0], look: boardCenter },
    'student-row3': { pos: [0, 1.45, 2.0], look: boardCenter },
  },
  camMin: [-7.0, 0.5, -9.0],
  camMax: [7.0, 4.5, 9.0],
  targetMin: [-7.0, 0.2, -9.0],
  targetMax: [7.0, 4.0, 9.0],
  minDistance: 1.0,
  maxDistance: 18.0,
  focus: { up: 1.35, forward: 1.8, lookUp: 0.9, lookBack: 0.3 },
  chairOffsetZ: 0.58,
  seatEye: { up: 1.25, back: 0.5, side: 0 },
  boardLook: boardCenter,
  teacher: { pos: [-1.8, 0, -5.2], rotY: 0.35 },
  spotlightY: 4.4,
  dust: { halfX: 6.5, minY: 0.3, maxY: 4.2, halfZ: 8.5, size: 0.03 },
};

export interface ClassroomModel {
  root: THREE.Group;
  lectern: THREE.Object3D | null;
}

const NO_RAYCAST = () => {};

/** Builds the procedural 14x18m modern classroom architecture from new_3d_room.html. */
export function buildProceduralClassroomRoom(root: THREE.Group): { lectern: THREE.Object3D | null } {
  const ROOM_W = 14;
  const ROOM_H = 4.5;
  const ROOM_D = 18;

  // 1. Floor: parquet wood
  const floorGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_D);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.55 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.raycast = NO_RAYCAST;
  root.add(floor);

  // 2. Ceiling & Walls
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.95 });

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), wallMat);
  ceiling.position.y = ROOM_H;
  ceiling.rotation.x = Math.PI / 2;
  ceiling.raycast = NO_RAYCAST;
  root.add(ceiling);

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat);
  frontWall.position.set(0, ROOM_H / 2, -ROOM_D / 2);
  frontWall.receiveShadow = true;
  frontWall.raycast = NO_RAYCAST;
  root.add(frontWall);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat);
  backWall.position.set(0, ROOM_H / 2, ROOM_D / 2);
  backWall.rotation.y = Math.PI;
  backWall.raycast = NO_RAYCAST;
  root.add(backWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat);
  rightWall.position.set(ROOM_W / 2, ROOM_H / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.raycast = NO_RAYCAST;
  root.add(rightWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat);
  leftWall.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.raycast = NO_RAYCAST;
  root.add(leftWall);

  // 3. Windows on Left Wall (3 large sunlit windows)
  const winMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.35 });
  const winFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
  [-3.5, 0, 3.5].forEach((z) => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.2), winMat);
    win.rotation.y = Math.PI / 2;
    win.position.set(-ROOM_W / 2 + 0.05, 2.3, z);
    win.raycast = NO_RAYCAST;
    root.add(win);

    // Subtle window frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.3, 2.5), winFrameMat);
    frame.position.set(-ROOM_W / 2 + 0.04, 2.3, z);
    frame.raycast = NO_RAYCAST;
    root.add(frame);
  });

  // 4. Ceiling Light Panels (matching new_3d_room.html)
  const lightPanelMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [[-3.2, -4], [3.2, -4], [-3.2, 2], [3.2, 2]].forEach(([x, z]) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), lightPanelMat);
    panel.position.set(x, ROOM_H - 0.02, z);
    panel.raycast = NO_RAYCAST;
    root.add(panel);

    const pLight = new THREE.PointLight(0xffffff, 0.4, 10);
    pLight.position.set(x, ROOM_H - 0.3, z);
    root.add(pLight);
  });

  // 5. Blackboard Frame & Chalk Tray
  const boardFrameMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.7 });
  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.8, 0.1), boardFrameMat);
  boardFrame.position.set(0, 2.2, -ROOM_D / 2 + 0.08);
  boardFrame.castShadow = true;
  boardFrame.raycast = NO_RAYCAST;
  root.add(boardFrame);

  const trayMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
  const tray = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.08, 0.16), trayMat);
  tray.position.set(0, 0.76, -ROOM_D / 2 + 0.14);
  tray.raycast = NO_RAYCAST;
  root.add(tray);

  // 6. Teacher Desk & Chair & Lectern
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x785338, roughness: 0.6 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  const teacherDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.0), woodMat);
  teacherDesk.position.set(0, 0.4, -6.0);
  teacherDesk.castShadow = true;
  teacherDesk.receiveShadow = true;
  root.add(teacherDesk);

  // Teacher Chair
  const tChairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.46), chairMat);
  tChairSeat.position.set(0, 0.44, -6.8);
  tChairSeat.castShadow = true;
  tChairSeat.raycast = NO_RAYCAST;
  root.add(tChairSeat);

  const tChairBack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.42, 0.04), chairMat);
  tChairBack.position.set(0, 0.72, -6.8 - 0.21);
  tChairBack.castShadow = true;
  tChairBack.raycast = NO_RAYCAST;
  root.add(tChairBack);

  // Lectern / Podium (clickable to jump to teacher view)
  const lecternGroup = new THREE.Group();
  lecternGroup.name = 'lectern';
  lecternGroup.position.set(2.4, 0, -5.5);

  const lecternBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.1, 0.5), woodMat);
  lecternBase.position.y = 0.55;
  lecternBase.castShadow = true;
  lecternGroup.add(lecternBase);

  const lecternTop = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.6), woodMat);
  lecternTop.position.set(0, 1.12, 0);
  lecternTop.rotation.x = -0.15;
  lecternTop.castShadow = true;
  lecternGroup.add(lecternTop);

  lecternGroup.traverse((o) => {
    o.userData = { isPodium: true, isClickable: true };
  });
  root.add(lecternGroup);

  // 7. Exactly 10 Student Desks & Matching Chairs (2 rows x 5 columns)
  const deskTopGeo = new THREE.BoxGeometry(1.4, 0.06, 0.75);
  const deskLegGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.74, 12);
  const notebookGeo = new THREE.BoxGeometry(0.24, 0.015, 0.32);
  const notebookMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });

  const chairSeatGeo = new THREE.BoxGeometry(0.46, 0.04, 0.46);
  const chairBackGeo = new THREE.BoxGeometry(0.46, 0.42, 0.04);
  const chairLegGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.44, 10);

  DESK_ROWS_Z.forEach((z) => {
    DESK_COLUMNS_X.forEach((x) => {
      // Desk
      const deskGroup = new THREE.Group();
      deskGroup.position.set(x, 0, z);

      const top = new THREE.Mesh(deskTopGeo, woodMat);
      top.position.y = 0.74;
      top.castShadow = true;
      top.receiveShadow = true;
      deskGroup.add(top);

      [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(deskLegGeo, metalMat);
        leg.position.set(lx, 0.37, lz);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      // Blue notebook facing student
      const notebook = new THREE.Mesh(notebookGeo, notebookMat);
      notebook.position.set(-0.25, 0.78, 0.05);
      notebook.rotation.y = 0.1;
      deskGroup.add(notebook);

      deskGroup.traverse((o) => {
        (o as THREE.Mesh).raycast = NO_RAYCAST;
      });
      root.add(deskGroup);

      // Chair behind desk at z + 0.58
      const chairGroup = new THREE.Group();
      chairGroup.position.set(x, 0, z + 0.58);

      const seat = new THREE.Mesh(chairSeatGeo, chairMat);
      seat.position.y = 0.44;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Backrest at +Z relative to chair so it sits behind the student facing -Z
      const back = new THREE.Mesh(chairBackGeo, chairMat);
      back.position.set(0, 0.72, 0.21);
      back.castShadow = true;
      chairGroup.add(back);

      [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(chairLegGeo, metalMat);
        leg.position.set(lx, 0.22, lz);
        leg.castShadow = true;
        chairGroup.add(leg);
      });

      chairGroup.traverse((o) => {
        (o as THREE.Mesh).raycast = NO_RAYCAST;
      });
      root.add(chairGroup);
    });
  });

  // 8. Outdoor Scenery outside the windows
  addOutdoorScenery(root);

  return { lectern: lecternGroup };
}

/** Grass and trees outside the windows so the room feels bright and natural. */
function addOutdoorScenery(root: THREE.Group) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(50, 36),
    new THREE.MeshStandardMaterial({ color: 0x6f8f4e, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(-18, -0.05, 0);
  ground.receiveShadow = true;
  ground.raycast = NO_RAYCAST;
  root.add(ground);

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.9 });
  const leafMats = [0x4f7a3a, 0x5d8a41, 0x44693a].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true })
  );
  const trunkGeo = new THREE.CylinderGeometry(0.14, 0.18, 2.0, 7);
  const leafGeo = new THREE.IcosahedronGeometry(1.4, 0);

  const trees: Array<[number, number, number]> = [
    [-11.5, -6.5, 1.1], [-13, -1.5, 1.35], [-11.8, 3.2, 1.0], [-14.5, 7.5, 1.4],
    [-17, -9, 1.6], [-18.5, 1.5, 1.7], [-16, 11, 1.5], [-21, -4, 1.9], [-22, 7, 1.8],
  ];
  trees.forEach(([x, z, s], i) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.0;
    const leaves = new THREE.Mesh(leafGeo, leafMats[i % leafMats.length]);
    leaves.position.y = 2.6;
    leaves.scale.set(1, 1.2, 1);
    tree.add(trunk, leaves);
    tree.position.set(x, -0.05, z);
    tree.scale.setScalar(s);
    tree.traverse((o) => {
      (o as THREE.Mesh).raycast = NO_RAYCAST;
    });
    root.add(tree);
  });
}

/** Asynchronously resolves the procedural 3D room model without relying on external network downloads. */
export async function loadClassroomModel(_url: string = CLASSROOM_MODEL_URL): Promise<ClassroomModel> {
  const root = new THREE.Group();
  root.name = 'classroom-model';
  const { lectern } = buildProceduralClassroomRoom(root);
  return { root, lectern };
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
