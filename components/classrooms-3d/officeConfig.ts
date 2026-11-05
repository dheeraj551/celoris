// Settings for the 3D office lobby (components/classrooms-3d/OfficeLobby.tsx).
// Scene: "free Loft 18 mini office" (Free Standard licence), lit and baked in
// Blender 5.1 Cycles. Working file: E:\Celoris\blender\free-loft-18-mini-office-voptimization\loft_web_working.blend
// Coordinates are three.js (Y up). Blender (x, y, z) → three (x, z, -y).

export type Vec3 = [number, number, number];

export const OFFICE = {
  modelUrl: "/models/celoris-office/loft.glb",
  // Baked diffuse lighting (Blender "Diffuse" bake, direct + indirect, no colour),
  // stored as sRGB(value / 3). MeshBasicMaterial divides the light map by π,
  // so intensity = 3 × π puts the brightness back to what Blender rendered.
  lightmapUrl: "/models/celoris-office/lightmap.webp",
  // Digital-signage totem that shows each classroom (Blender: Props_Totem collection).
  totemUrl: "/models/celoris-office/totem.glb",
  // 12 desk monitors placed on the office desks (Blender: Props_Monitor).
  monitorsUrl: "/models/celoris-office/monitors.glb",
  lightmapIntensity: 3 * Math.PI,
  // Blender used AgX with exposure -0.3 → 2^-0.3.
  exposure: 0.81,
  spawn: [7.19, 1.92, -0.63] as Vec3,
  spawnLookAt: [-2, 1.7, 0] as Vec3,
  bounds: { min: [-7.1, -1, -4.3] as Vec3, max: [7.85, 8, 7.1] as Vec3 },
  // Looping office ambience. Starts on the first "Click to walk" (browsers
  // only allow sound after a click). Put the file in public/audio/.
  ambienceUrl: "/audio/office-ambience.mp3",
  ambienceVolume: 0.35,
};

// Wall TVs: living room (Blender Plane.027 ground floor, Plane.028 upstairs,
// 2.07 m × 1.15 m, facing +x) and the ground-floor office (Plane.031).
// videoId = the YouTube video ID (the part after watch?v=). Leave empty to
// keep the TV dark. Videos play muted and on loop.
export const TV_SCREENS: { position: Vec3; rotationY: number; width: number; height: number; videoId: string }[] = [
  { position: [-4.68, 1.505, -0.345], rotationY: Math.PI / 2, width: 2.07, height: 1.15, videoId: "buSEoVEUzmU" },
  { position: [-4.68, 4.13, -0.345], rotationY: Math.PI / 2, width: 2.07, height: 1.15, videoId: "yhy3hREJtFU" },
  // Ground-floor office, wall above the desks (Blender Plane.031), 1.64 m × 0.77 m.
  { position: [-1.708, 1.659, 5.5635], rotationY: Math.PI / 2, width: 1.635, height: 0.77, videoId: "QwFY4khu2c4" },
];

// Invisible ramps laid over staircases so walking up/down is smooth (the
// floating steps have gaps). Four corners each: bottom-left, bottom-right,
// top-right, top-left. Main stair (Blender Cube.001): bottom at x 3.0 on the
// ground floor, top at x -1.3 on the upper floor (2.594 m), 0.85 m wide.
export const STAIR_RAMPS: [Vec3, Vec3, Vec3, Vec3][] = [
  [
    [3.3, -0.18, -2.65],
    [3.3, -0.18, -1.8],
    [-1.3, 2.594, -1.8],
    [-1.3, 2.594, -2.65],
  ],
];

// Open floor spots on the ground floor (checked in Blender for clearance and
// visibility from the entrance). Each holds one classroom totem; rooms fill
// them in order: live first, then soonest start. position = floor point
// (totem base), rotationY = turned to face the entrance.
// Add more slots here to show more classrooms at once.
export const PORTAL_SLOTS: { position: Vec3; rotationY: number }[] = [
  { position: [4.5, 0, 2.0], rotationY: 2.345 },
  { position: [4.5, 0, -1.5], rotationY: 1.258 },
  { position: [2.5, 0.23, 2.0], rotationY: 2.082 },
  { position: [2.0, 0, -1.0], rotationY: 1.5 },
  { position: [0.0, 0, 2.0], rotationY: 1.921 },
  { position: [-1.0, 0, -0.5], rotationY: 1.587 },
];
