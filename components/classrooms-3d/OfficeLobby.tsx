"use client";

// Celoris 3D Office — a walk-through lobby for /classrooms.
// The loft was lit and baked in Blender (Cycles diffuse lightmap), so the
// browser only shows textures × lightmap: no real-time lights, cheap to run.
// Each classroom is a glowing "portal" panel in the office; walking up and
// pressing E (or clicking the panel) joins it through the page's normal
// join flow (onJoinRoom), so queue / Pro seats / trainer-code rules are
// exactly the same as the card list.

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PointerLockControls, useGLTF, useProgress, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import type { Room } from "@/components/cafe/types";
import { nextSession } from "@/lib/class-schedule";
import { OFFICE, PORTAL_SLOTS, STAIR_RAMPS, TV_SCREENS, type Vec3 } from "./officeConfig";

interface OfficeLobbyProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onShowList: () => void;
}

type RoomState = { live: boolean; label: string; tone: "live" | "soon" | "today" | "later" | "full" | "idle" };

function roomState(room: Room, now: Date): RoomState {
  const session = nextSession(
    { next_class_at: room.nextClassAt, class_duration_minutes: room.classDurationMinutes, repeats_weekly: room.repeatsWeekly },
    now,
  );
  const s = (room.status || "").toLowerCase();
  if (session?.isLive || s.includes("live")) return { live: true, label: "LIVE NOW", tone: "live" };
  if (room.status === "Full") return { live: false, label: "FULL", tone: "full" };
  if (session) {
    const ms = session.start.getTime() - now.getTime();
    if (ms > 0 && ms <= 45 * 60 * 1000) return { live: false, label: `STARTS IN ${Math.max(1, Math.round(ms / 60000))} MIN`, tone: "soon" };
    const sameDay =
      now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) ===
      session.start.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const time = session.start.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
    if (sameDay) return { live: false, label: `TODAY · ${time.toUpperCase()}`, tone: "today" };
    const day = session.start.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" });
    return { live: false, label: `${day} · ${time.toUpperCase()}`, tone: "later" };
  }
  return { live: false, label: "OPEN", tone: "idle" };
}

const TONE_COLOR: Record<RoomState["tone"], string> = {
  live: "#ef4444",
  soon: "#f59e0b",
  today: "#a855f7",
  later: "#8b5cf6",
  full: "#71717a",
  idle: "#10b981",
};

// Live rooms first, then the ones starting soonest — they get the best slots.
function orderRooms(rooms: Room[], now: Date) {
  const score = (r: Room) => {
    const st = roomState(r, now);
    const session = nextSession({ next_class_at: r.nextClassAt, class_duration_minutes: r.classDurationMinutes, repeats_weekly: r.repeatsWeekly }, now);
    if (st.live) return -1e15;
    return session ? session.start.getTime() : 1e15;
  };
  return [...rooms].sort((a, b) => score(a) - score(b));
}

// Every <Html> must share ONE z-index range: in "blending" mode each one sets
// the canvas z-index to half of its range, so mixed ranges let some screens
// float above the 3D scene (visible through walls). The range must also be
// wide: screens are stacked by distance inside it, and a tiny range put the
// far office TV on top of a near totem. The <Canvas> wrapper is its own
// stacking context (zIndex 0), so these big numbers never cover the overlays.
const HTML_Z_RANGE: [number, number] = [100000, 0];

// The office screens (TVs, totems) are real web pages placed BEHIND the 3D
// canvas and shown through "holes" in it, so walls can cover them. That only
// works if every solid surface writes full alpha; some loft textures carry an
// alpha channel, which let those pages show through walls. Force alpha = 1.
function forceOpaque<T extends THREE.Material>(m: T): T {
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      "#include <dithering_fragment>\n\tgl_FragColor.a = 1.0;",
    );
  };
  m.customProgramCacheKey = () => "celoris-opaque";
  return m;
}

/* ------------------------------------------------------------------ */
/* The baked loft                                                      */
/* ------------------------------------------------------------------ */

function Loft({ onReady }: { onReady: (colliders: THREE.Object3D[]) => void }) {
  const gltf = useGLTF(OFFICE.modelUrl);
  const lightmap = useTexture(OFFICE.lightmapUrl);

  const scene = useMemo(() => {
    lightmap.flipY = false;
    lightmap.channel = 1; // second UV set (TEXCOORD_1 "Lightmap" from Blender)
    lightmap.colorSpace = THREE.SRGBColorSpace;
    lightmap.anisotropy = 8;

    const root = gltf.scene;
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const isGlass = mesh.name.startsWith("Loft_Glass") || mesh.parent?.name.startsWith("Loft_Glass");
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = mats.map((m) => {
        const src = m as THREE.MeshStandardMaterial;
        if (isGlass) {
          return new THREE.MeshBasicMaterial({ color: "#9fb7c9", transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
        }
        const hasAlpha = src.transparent || src.alphaTest > 0;
        return forceOpaque(new THREE.MeshBasicMaterial({
          map: src.map ?? null,
          color: src.color ?? new THREE.Color(1, 1, 1),
          lightMap: mesh.geometry.getAttribute("uv1") ? lightmap : null,
          lightMapIntensity: OFFICE.lightmapIntensity,
          alphaTest: hasAlpha ? 0.5 : 0,
          transparent: false,
          side: src.side,
        }));
      });
      mesh.material = Array.isArray(mesh.material) ? next : next[0];
      mesh.userData.collider = !isGlass;
    });
    return root;
  }, [gltf, lightmap]);

  useEffect(() => {
    const colliders: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o.userData.collider) colliders.push(o);
    });
    onReady(colliders);
  }, [scene, onReady]);

  return <primitive object={scene} />;
}

/* ------------------------------------------------------------------ */
/* First-person walking with simple ray collision                      */
/* ------------------------------------------------------------------ */

const EYE = 1.6;
const SPEED = 3.2;
const RADIUS = 0.3;
const STEP = 0.5;

function Player({ colliders, extra, enabled }: { colliders: THREE.Object3D[]; extra: React.MutableRefObject<Set<THREE.Object3D>>; enabled: boolean }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const vel = useRef(0);

  useEffect(() => {
    camera.position.set(...OFFICE.spawn);
    camera.lookAt(...OFFICE.spawnLookAt);
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    const clear = () => (keys.current = {});
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  // Esc while holding W can swallow the key-up; forget held keys on pause so
  // the player doesn't keep walking by itself after clicking back in.
  useEffect(() => {
    if (!enabled) keys.current = {};
  }, [enabled]);

  // Invisible stair ramps: only used to find the floor, never drawn.
  const ramps = useMemo(
    () =>
      STAIR_RAMPS.map(([a, b, c, d]) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3));
        const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
        m.visible = false;
        m.updateMatrixWorld(true);
        return m;
      }),
    [],
  );
  const floorTargets = useMemo(() => [...colliders, ...ramps], [colliders, ramps]);

  const fwd = useMemo(() => new THREE.Vector3(), []);
  const side = useMemo(() => new THREE.Vector3(), []);
  const move = useMemo(() => new THREE.Vector3(), []);
  const origin = useMemo(() => new THREE.Vector3(), []);
  const down = useMemo(() => new THREE.Vector3(0, -1, 0), []);

  const blocked = (dir: THREE.Vector3, dist: number) => {
    // Check at knee and chest height so low furniture and walls both block.
    for (const h of [0.45, 1.1]) {
      origin.set(camera.position.x, camera.position.y - EYE + h, camera.position.z);
      ray.set(origin, dir);
      ray.far = dist + RADIUS;
      if (ray.intersectObjects(colliders, false).length) return true;
      // Totems block walking too (checked recursively: they are groups).
      if (extra.current.size && ray.intersectObjects(Array.from(extra.current), true).length) return true;
    }
    return false;
  };

  useFrame((_, dtRaw) => {
    if (!colliders.length) return;
    const dt = Math.min(dtRaw, 0.05);

    if (enabled) {
      camera.getWorldDirection(fwd);
      fwd.y = 0;
      fwd.normalize();
      side.crossVectors(fwd, camera.up).normalize();
      move.set(0, 0, 0);
      const k = keys.current;
      if (k.KeyW || k.ArrowUp) move.add(fwd);
      if (k.KeyS || k.ArrowDown) move.sub(fwd);
      if (k.KeyD || k.ArrowRight) move.add(side);
      if (k.KeyA || k.ArrowLeft) move.sub(side);
      if (move.lengthSq() > 0) {
        const speed = SPEED * (k.ShiftLeft || k.ShiftRight ? 1.8 : 1);
        move.normalize();
        const dist = speed * dt;
        // Slide along walls: try X and Z separately.
        const stepX = new THREE.Vector3(Math.sign(move.x), 0, 0);
        const stepZ = new THREE.Vector3(0, 0, Math.sign(move.z));
        if (move.x && !blocked(stepX, Math.abs(move.x * dist))) camera.position.x += move.x * dist;
        if (move.z && !blocked(stepZ, Math.abs(move.z * dist))) camera.position.z += move.z * dist;
      }
    }

    // Floor following (stairs, steps) + gravity.
    origin.set(camera.position.x, camera.position.y - EYE + STEP + 0.05, camera.position.z);
    ray.set(origin, down);
    ray.far = 20;
    const hit = ray.intersectObjects(floorTargets, false)[0];
    if (hit) {
      const target = hit.point.y + EYE;
      if (target >= camera.position.y - 0.02) {
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, target, Math.min(1, dt * 14));
        vel.current = 0;
      } else {
        vel.current -= 9.8 * dt;
        camera.position.y = Math.max(target, camera.position.y + vel.current * dt);
        if (camera.position.y === target) vel.current = 0;
      }
    }
    // Never leave the building's footprint.
    const b = OFFICE.bounds;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, b.min[0], b.max[0]);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, b.min[2], b.max[2]);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Classroom totems: a digital-signage stand (modelled in Blender,     */
/* public/models/celoris-office/totem.glb) whose screen shows the class */
/* ------------------------------------------------------------------ */

// Screen on the totem's front, in the totem's own space (metres).
const TOTEM_SCREEN = { center: [0, 1.29, 0.05] as Vec3, width: 0.68, height: 1.21 };
const TOTEM_PX_WIDTH = 340;
const TOTEM_PX_HEIGHT = Math.round((TOTEM_PX_WIDTH * TOTEM_SCREEN.height) / TOTEM_SCREEN.width);

function Portal({
  room,
  state,
  position,
  rotationY,
  focused,
  now,
  onJoin,
  registerHit,
  colliders,
}: {
  room: Room;
  state: RoomState;
  position: Vec3;
  rotationY: number;
  focused: boolean;
  now: Date;
  onJoin: () => void;
  registerHit: (id: string, mesh: THREE.Object3D | null) => void;
  colliders: React.MutableRefObject<Set<THREE.Object3D>>;
}) {
  const color = TONE_COLOR[state.tone];
  const { scene } = useGLTF(OFFICE.totemUrl);

  // Own copy of the totem with its own LED-strip material (colour = status).
  const { totem, led } = useMemo(() => {
    const t = scene.clone(true);
    let ledMat: THREE.MeshBasicMaterial | null = null;
    t.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (!m.name.startsWith("Totem_Accent")) {
        const src = m.material as THREE.Material;
        m.material = forceOpaque(src.clone());
      }
      if (m.name.startsWith("Totem_Accent")) {
        ledMat = forceOpaque(new THREE.MeshBasicMaterial({ color, toneMapped: false }));
        m.material = ledMat;
      }
    });
    return { totem: t, led: ledMat as THREE.MeshBasicMaterial | null };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useEffect(() => {
    led?.color.set(color);
  }, [led, color]);

  useEffect(() => {
    const set = colliders.current;
    set.add(totem);
    return () => {
      set.delete(totem);
    };
  }, [totem, colliders]);

  useFrame(({ clock }) => {
    if (!led) return;
    const base = new THREE.Color(color);
    const k = focused ? 1.6 : state.live ? 0.75 + 0.45 * Math.sin(clock.elapsedTime * 3) : 0.9;
    led.color.copy(base).multiplyScalar(k);
  });

  const seats = room.maxStudents ?? 15;
  const taken = Math.max(0, room.onlineCount ?? 0);
  const fill = Math.min(100, Math.round((taken / Math.max(1, seats)) * 100));
  const session = nextSession(
    { next_class_at: room.nextClassAt, class_duration_minutes: room.classDurationMinutes, repeats_weekly: room.repeatsWeekly },
    now,
  );
  const bigTime = session
    ? session.start.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase()
    : "OPEN";
  const dateLine = session
    ? session.isLive
      ? "Class in progress"
      : session.start.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "short" })
    : "Join any time";

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive object={totem} />
      {/* Invisible hit area over the whole totem for the crosshair / E key */}
      <mesh ref={(m) => registerHit(room.id, m)} userData={{ roomId: room.id }} position={[0, 1.0, 0.04]}>
        <planeGeometry args={[0.8, 1.95]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html
        transform
        occlude="blending"
        position={TOTEM_SCREEN.center}
        distanceFactor={(TOTEM_SCREEN.width * 400) / TOTEM_PX_WIDTH}
        zIndexRange={HTML_Z_RANGE}
      >
        <div
          onClick={onJoin}
          className="flex cursor-pointer select-none flex-col overflow-hidden text-left text-white"
          style={{
            width: TOTEM_PX_WIDTH,
            height: TOTEM_PX_HEIGHT,
            background: `radial-gradient(120% 60% at 50% 0%, ${color}33 0%, transparent 60%), linear-gradient(180deg, #0b0e16 0%, #05070b 100%)`,
            boxShadow: focused ? `inset 0 0 0 3px ${color}` : "none",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">Celoris</span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wider" style={{ background: `${color}26`, color }}>
              {state.live && <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: color }} />}
              {state.live ? "LIVE" : state.tone === "soon" ? "SOON" : state.tone === "full" ? "FULL" : "UPCOMING"}
            </span>
          </div>

          {/* Category */}
          <div className="mt-6 px-5 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
            {room.category === "whiteboard" ? "Whiteboard Studio" : "3D Virtual Aula"}
          </div>

          {/* Title */}
          <div className="mt-2 px-5 text-[26px] font-black uppercase leading-[1.05]" style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {room.name}
          </div>
          <div className="mt-3 px-5 text-sm text-white/60">with {room.host?.name || "Trainer"}</div>

          <div className="flex-1" />

          {/* Time */}
          <div className="px-5">
            <div className="text-[44px] font-black leading-none tracking-tight">{state.live ? "NOW" : bigTime}</div>
            <div className="mt-1 text-sm font-semibold text-white/60">{state.tone === "soon" ? state.label.toLowerCase().replace(/^./, (c) => c.toUpperCase()) : dateLine}</div>
          </div>

          {/* Seats */}
          <div className="mt-5 px-5">
            <div className="flex items-center justify-between text-xs font-semibold text-white/60">
              <span>Seats</span>
              <span>
                {taken}/{seats}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${fill}%`, background: color }} />
            </div>
          </div>

          {/* Call to action */}
          <div className="m-5 rounded-xl py-3 text-center text-sm font-extrabold text-black" style={{ background: color }}>
            {focused ? "Press E to enter" : "Enter classroom"}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Portals({
  rooms,
  now,
  onJoinRoom,
  setFocusedId,
  focusedId,
  locked,
  colliders,
}: {
  colliders: React.MutableRefObject<Set<THREE.Object3D>>;
  rooms: Room[];
  now: Date;
  onJoinRoom: (id: string) => void;
  setFocusedId: (id: string | null) => void;
  focusedId: string | null;
  locked: boolean;
}) {
  const { camera } = useThree();
  const hits = useRef<Map<string, THREE.Object3D>>(new Map());
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const center = useMemo(() => new THREE.Vector2(0, 0), []);
  const ordered = useMemo(() => orderRooms(rooms, now).slice(0, PORTAL_SLOTS.length), [rooms, now]);

  const registerHit = (id: string, mesh: THREE.Object3D | null) => {
    if (mesh) hits.current.set(id, mesh);
    else hits.current.delete(id);
  };

  // Crosshair targeting: the portal you look at (within 4 m) gets focus.
  useFrame(() => {
    if (!locked) return;
    ray.setFromCamera(center, camera);
    ray.far = 4;
    const hit = ray.intersectObjects(Array.from(hits.current.values()), false)[0];
    const id = (hit?.object.userData.roomId as string) || null;
    if (id !== focusedId) setFocusedId(id);
  });

  return (
    <>
      {ordered.map((room, i) => {
        const slot = PORTAL_SLOTS[i];
        return (
          <Portal
            key={room.id}
            room={room}
            state={roomState(room, now)}
            position={slot.position}
            rotationY={slot.rotationY}
            focused={focusedId === room.id}
            now={now}
            onJoin={() => onJoinRoom(room.id)}
            registerHit={registerHit}
            colliders={colliders}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desk monitors (Blender: Props_Monitor, 12 linked copies on the       */
/* office desks). Lit by the scene lights; the screen glows on its own.  */
/* ------------------------------------------------------------------ */

function DeskMonitors() {
  const { scene } = useGLTF(OFFICE.monitorsUrl);
  useMemo(() => {
    const screens = new Map<THREE.Material, THREE.Material>();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const swap = (m: THREE.Material) => {
        if (!m.name.startsWith("Monitor_Screen")) return forceOpaque(m);
        if (!screens.has(m)) {
          const src = m as THREE.MeshStandardMaterial;
          screens.set(m, forceOpaque(new THREE.MeshBasicMaterial({ map: src.map ?? null, color: "#d8dce6" })));
        }
        return screens.get(m)!;
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
    });
  }, [scene]);
  return <primitive object={scene} />;
}

/* ------------------------------------------------------------------ */
/* Wall TVs playing muted YouTube videos                               */
/* ------------------------------------------------------------------ */

// 1 CSS px = distanceFactor / 400 world units in drei's <Html transform>.
const TV_PX_WIDTH = 1280;

function TvScreen({ position, rotationY, width, height, videoId }: (typeof TV_SCREENS)[number]) {
  if (!videoId) return null;
  const pxHeight = Math.round((TV_PX_WIDTH * height) / width);
  const src =
    `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` +
    `?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(videoId)}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1`;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Black backing so the screen edge never shows the wall */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#000000" onBeforeCompile={(sh) => { sh.fragmentShader = sh.fragmentShader.replace("#include <dithering_fragment>", "#include <dithering_fragment>\n\tgl_FragColor.a = 1.0;"); }} />
      </mesh>
      <Html transform occlude="blending" distanceFactor={(width * 400) / TV_PX_WIDTH} zIndexRange={HTML_Z_RANGE} style={{ pointerEvents: "none" }}>
        <iframe
          src={src}
          title="Celoris TV"
          width={TV_PX_WIDTH}
          height={pxHeight}
          allow="autoplay; encrypted-media; picture-in-picture"
          style={{ border: 0, display: "block", pointerEvents: "none", background: "#000" }}
          tabIndex={-1}
        />
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Page-level wrapper: canvas + overlays                               */
/* ------------------------------------------------------------------ */

function Loader() {
  const { progress, active } = useProgress();
  if (!active && progress >= 100) return null;
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#070707]">
      <div className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Entering Celoris Office</div>
      <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${Math.round(progress)}%` }} />
      </div>
      <div className="font-mono text-[11px] text-slate-500">{Math.round(progress)}%</div>
    </div>
  );
}

export default function OfficeLobby({ rooms, onJoinRoom, onShowList }: OfficeLobbyProps) {
  const [colliders, setColliders] = useState<THREE.Object3D[]>([]);
  const totemColliders = useRef<Set<THREE.Object3D>>(new Set());
  const [locked, setLocked] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const controls = useRef<any>(null);
  // After Esc, Chrome refuses a new pointer lock for about a second, so the
  // button waits briefly instead of silently doing nothing.
  const [cooldown, setCooldown] = useState(false);
  const [paused, setPaused] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Office ambience: starts on the first click into the office (browsers
  // block sound before a click), loops, and remembers the mute choice.
  const ambience = useRef<HTMLAudioElement | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  useEffect(() => {
    try {
      if (window.localStorage.getItem("celoris-office-sound") === "off") setSoundOn(false);
    } catch {
      /* ignore */
    }
    if (!OFFICE.ambienceUrl) return;
    const a = new Audio(OFFICE.ambienceUrl);
    a.loop = true;
    a.volume = OFFICE.ambienceVolume;
    a.preload = "auto";
    ambience.current = a;
    return () => {
      a.pause();
      ambience.current = null;
    };
  }, []);
  useEffect(() => {
    const a = ambience.current;
    if (!a) return;
    if (!soundOn) a.pause();
    else if (locked || paused) a.play().catch(() => {});
  }, [soundOn, locked, paused]);
  const toggleSound = () => {
    setSoundOn((on) => {
      const next = !on;
      try {
        window.localStorage.setItem("celoris-office-sound", next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  const handleLock = () => {
    setLocked(true);
    if (soundOn) ambience.current?.play().catch(() => {});
  };
  const handleUnlock = () => {
    setLocked(false);
    setPaused(true);
    setFocusedId(null);
    setCooldown(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => setCooldown(false), 1200);
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => {
      clearInterval(t);
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  const join = (id: string) => {
    try {
      controls.current?.unlock?.();
    } catch {
      /* ignore */
    }
    onJoinRoom(id);
  };

  // E to enter the classroom you're looking at.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && focusedId) join(focusedId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId]);

  // Fullscreen: the whole office (canvas + overlays) fills the screen.
  const shell = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else shell.current?.requestFullscreen().catch(() => {});
  };
  // F = fullscreen on/off.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.code === "KeyF" && !e.repeat) toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const quick = useMemo(() => orderRooms(rooms, now), [rooms, now]);

  return (
    <div
      ref={shell}
      className={`relative w-full overflow-hidden bg-[#070707] ${
        isFullscreen ? "h-screen" : "h-[calc(100vh-180px)] min-h-[560px] rounded-3xl border border-white/[0.08]"
      }`}
    >
      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        camera={{ fov: 70, near: 0.05, far: 200 }}
        gl={{ antialias: true, toneMapping: THREE.AgXToneMapping, toneMappingExposure: OFFICE.exposure }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#cfd9e4"]} />
        {/* Only the totems use lit materials; the loft is fully baked. */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 8, -4]} intensity={1.6} />
        <directionalLight position={[-6, 4, 6]} intensity={0.5} />
        <Suspense fallback={null}>
          <Loft onReady={setColliders} />
          <Portals rooms={rooms} now={now} onJoinRoom={join} focusedId={focusedId} setFocusedId={setFocusedId} locked={locked} colliders={totemColliders} />
          <DeskMonitors />
          {TV_SCREENS.map((tv, i) => (
            <TvScreen key={i} {...tv} />
          ))}
        </Suspense>
        <Player colliders={colliders} extra={totemColliders} enabled={locked} />
        <PointerLockControls ref={controls} selector="#celoris-office-start" onLock={handleLock} onUnlock={handleUnlock} />
      </Canvas>

      <Loader />

      {/* Crosshair */}
      {locked && <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow" />}

      {/* Start / paused overlay.
          Always mounted (only hidden while walking): PointerLockControls binds
          its click handler to this exact element once, so unmounting it on
          lock left a dead button after Esc. */}
      <div className={`absolute inset-x-0 bottom-6 z-20 flex justify-center ${locked ? "pointer-events-none invisible" : ""}`}>
        <button
          id="celoris-office-start"
          type="button"
          disabled={cooldown}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-sm font-extrabold text-black shadow-xl shadow-emerald-500/20 hover:scale-[1.03] transition-transform disabled:opacity-60 disabled:hover:scale-100"
        >
          {cooldown
            ? "Paused…"
            : paused
              ? "Click to keep walking · WASD to move · E to enter · Esc to stop"
              : "Click to walk around · WASD to move · Mouse to look · E to enter · F fullscreen · Esc to stop"}
        </button>
      </div>

      {/* Top-left controls: fullscreen + sound */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#07090f]/85 px-3 py-2 text-[11px] font-bold text-white backdrop-blur hover:bg-[#07090f]"
          title="Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        </button>
        {OFFICE.ambienceUrl && (
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#07090f]/85 px-3 py-2 text-[11px] font-bold text-white backdrop-blur hover:bg-[#07090f]"
            title="Office sound"
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            {soundOn ? "Sound on" : "Sound off"}
          </button>
        )}
      </div>

      {/* Quick join — always there, so nobody has to walk to be on time */}
      <div className="absolute right-4 top-4 z-20 w-72 rounded-2xl border border-white/[0.1] bg-[#07090f]/85 p-3 text-white backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Quick join</span>
          <button onClick={onShowList} className="text-[11px] text-slate-400 underline hover:text-white">
            List view
          </button>
        </div>
        <div className="max-h-[50vh] space-y-1.5 overflow-y-auto">
          {quick.length === 0 && <div className="py-3 text-center text-xs text-slate-500">No classrooms right now</div>}
          {quick.map((r) => {
            const st = roomState(r, now);
            return (
              <button
                key={r.id}
                onClick={() => join(r.id)}
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-left hover:bg-white/[0.09]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">{r.name}</span>
                  <span className="block text-[10px] font-semibold" style={{ color: TONE_COLOR[st.tone] }}>
                    {st.label}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-emerald-500 px-2 py-1 text-[10px] font-extrabold text-black">Join</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

useGLTF.preload(OFFICE.modelUrl);
useGLTF.preload(OFFICE.totemUrl);
useGLTF.preload(OFFICE.monitorsUrl);
