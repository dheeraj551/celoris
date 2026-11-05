"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  GraduationCap, 
  ChevronRight, 
  Users, 
  Sparkles, 
  Box, 
  Sun, 
  Sunset, 
  Moon, 
  Radio, 
  Hand, 
  Layers, 
  Eye, 
  RotateCw,
  Compass,
  ArrowRight,
  Maximize2,
  Tv
} from 'lucide-react';
import { Room } from './types';

interface Classroom3DHeroProps {
  onEnterCafe: () => void;
  onEnterClassrooms?: () => void;
  onSeeOnline?: () => void;
  activeRooms?: Room[];
  onJoinRoom?: (roomId: string) => void;
}

type CameraPreset = 'overview' | 'trainer' | 'studentPOV' | 'board';
type TimePreset = 'morning' | 'sunset' | 'night';

const LESSON_SLIDES = [
  {
    tag: "MODULE 01 • GROWTH MARKETING",
    title: "Performance Marketing & Funnel Architecture",
    lines: [
      "• 3-Second Hook Velocity & Creative Fatigue Reduction",
      "• Meta Advantage+ & Algorithmic CBO Budget Allocation",
      "• WhatsApp Lead Nurture Loops (Automated 7-Day Journey)",
      "• Multi-Touch UTM Attribution & Real-Time ROAS Scaling"
    ],
    highlight: "Classroom Metric Target: 3.8x+ Blended ROAS"
  },
  {
    tag: "MODULE 02 • FULLSTACK & AI APPS",
    title: "Next.js 15, WebGL 3D & Autonomous Agent Architectures",
    lines: [
      "• Server Components, Turbopack & Edge Middleware",
      "• Supabase Realtime Postgres with Row-Level Security",
      "• Interactive Three.js WebGL Campus & Spatial Classrooms",
      "• AI Agent Orchestration with Live Multi-Modal Tool Calls"
    ],
    highlight: "Production Target: 60 FPS WebGL & <100ms API Latency"
  },
  {
    tag: "MODULE 03 • 3D BRAND IDENTITY",
    title: "Spatial UI/UX & High-Converting Web Experiences",
    lines: [
      "• Glassmorphic Depth, PBR Shaders & Ambient Occlusion",
      "• 15-Seat Virtual Cohort Interaction & Live Audio Rooms",
      "• Micro-Interactions: Physics-Based Damping & Motion Systems",
      "• Mobile-First Viewport Optimization & Responsive 3D"
    ],
    highlight: "Student Conversion Impact: +42% Average Lift"
  }
];

export default function Classroom3DHero({
  onEnterCafe,
  onEnterClassrooms,
  onSeeOnline,
  activeRooms = [],
  onJoinRoom
}: Classroom3DHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleEnter = onEnterClassrooms || onEnterCafe;

  // UI state
  const [activeCam, setActiveCam] = useState<CameraPreset>('overview');
  const [timeOfDay, setTimeOfDay] = useState<TimePreset>('morning');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // Three.js object references stored in ref to avoid re-instantiation
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    sunLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    boardTexture: THREE.CanvasTexture;
    boardCanvas: HTMLCanvasElement;
    boardCtx: CanvasRenderingContext2D;
    trainer: {
      hips: THREE.Group;
      headGroup: THREE.Group;
      rightArm: THREE.Group;
    };
    animatedStudents: Array<{
      headGroup: THREE.Group;
      hips: THREE.Group;
      rightArm: THREE.Group;
    }>;
    handRaisedStudent: {
      rightArm: THREE.Group;
    } | null;
    isHandRaised: boolean;
    autoRotate: boolean;
    clock: THREE.Clock;
    animFrameId?: number;
    camLerp: {
      active: boolean;
      startPos: THREE.Vector3;
      endPos: THREE.Vector3;
      startTarget: THREE.Vector3;
      endTarget: THREE.Vector3;
      progress: number;
    };
  } | null>(null);

  // Redraw Blackboard canvas
  const updateBoard = useCallback((slideIdx: number) => {
    if (!threeRef.current) return;
    const { boardCanvas, boardCtx, boardTexture } = threeRef.current;
    const slide = LESSON_SLIDES[slideIdx];

    // Background chalkboard slate
    boardCtx.fillStyle = '#0f241a';
    boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

    // Frame inner border
    boardCtx.strokeStyle = '#1b4a36';
    boardCtx.lineWidth = 14;
    boardCtx.strokeRect(10, 10, boardCanvas.width - 20, boardCanvas.height - 20);

    // Subtle chalkboard smudges / texture
    boardCtx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 8; i++) {
      boardCtx.fillRect(20 + i * 120, 20 + (i % 3) * 140, 100, 120);
    }

    // Header badge
    boardCtx.fillStyle = '#34d399';
    boardCtx.font = 'bold 22px "Courier New", monospace';
    boardCtx.fillText(slide.tag, 45, 60);

    // Lecture Title
    boardCtx.fillStyle = '#ffffff';
    boardCtx.font = 'bold 36px "Segoe UI", sans-serif';
    boardCtx.fillText(slide.title, 45, 110);

    // Divider line
    boardCtx.strokeStyle = '#10b981';
    boardCtx.lineWidth = 3;
    boardCtx.beginPath();
    boardCtx.moveTo(45, 130);
    boardCtx.lineTo(975, 130);
    boardCtx.stroke();

    // Bullets
    boardCtx.fillStyle = '#d1fae5';
    boardCtx.font = '24px "Segoe UI", sans-serif';
    let y = 185;
    slide.lines.forEach((line) => {
      boardCtx.fillText(line, 45, y);
      y += 50;
    });

    // Highlight Pill at bottom
    boardCtx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    boardCtx.strokeStyle = '#10b981';
    boardCtx.lineWidth = 2;
    boardCtx.beginPath();
    boardCtx.roundRect(45, 410, 930, 60, 12);
    boardCtx.fill();
    boardCtx.stroke();

    boardCtx.fillStyle = '#a7f3d0';
    boardCtx.font = 'bold 22px "Segoe UI", monospace';
    boardCtx.fillText(`★ ${slide.highlight}`, 65, 448);

    boardTexture.needsUpdate = true;
  }, []);

  // Camera presets
  const CAM_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
    overview: {
      pos: [6.8, 5.2, 7.2],
      target: [0, 1.4, -1.8]
    },
    trainer: {
      pos: [-1.8, 1.85, -4.6],
      target: [0, 1.15, 1.8]
    },
    studentPOV: {
      pos: [0, 1.25, -2.1],
      target: [0, 2.1, -8.6]
    },
    board: {
      pos: [0, 2.2, -3.8],
      target: [0, 2.2, -8.8]
    }
  };

  const setCameraPreset = (preset: CameraPreset) => {
    setActiveCam(preset);
    setAutoRotate(false);
    if (!threeRef.current) return;
    const { camera, controls, camLerp } = threeRef.current;
    const config = CAM_PRESETS[preset];

    camLerp.startPos.copy(camera.position);
    camLerp.endPos.set(config.pos[0], config.pos[1], config.pos[2]);
    camLerp.startTarget.copy(controls.target);
    camLerp.endTarget.set(config.target[0], config.target[1], config.target[2]);
    camLerp.progress = 0;
    camLerp.active = true;
  };

  const handleNextSlide = () => {
    const next = (currentSlide + 1) % LESSON_SLIDES.length;
    setCurrentSlide(next);
    updateBoard(next);
  };

  const toggleHandRaise = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (threeRef.current) {
      threeRef.current.isHandRaised = nextState;
    }
  };

  // Atmosphere lighting changes
  const applyTimeOfDay = (preset: TimePreset) => {
    setTimeOfDay(preset);
    if (!threeRef.current) return;
    const { scene, sunLight, ambientLight } = threeRef.current;

    if (preset === 'morning') {
      scene.background = new THREE.Color(0x9fc3db);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.7;
      sunLight.color.setHex(0xfff8eb);
      sunLight.intensity = 0.95;
      sunLight.position.set(-14, 12, -2);
    } else if (preset === 'sunset') {
      scene.background = new THREE.Color(0xc27852);
      ambientLight.color.setHex(0xffdfcb);
      ambientLight.intensity = 0.55;
      sunLight.color.setHex(0xff8c42);
      sunLight.intensity = 1.15;
      sunLight.position.set(-16, 7, -1);
    } else {
      // Night
      scene.background = new THREE.Color(0x0c1322);
      ambientLight.color.setHex(0x1e293b);
      ambientLight.intensity = 0.45;
      sunLight.color.setHex(0x38bdf8);
      sunLight.intensity = 0.35;
      sunLight.position.set(-12, 10, -3);
    }
  };

  // Three.js Mount Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9fc3db);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(6.8, 5.2, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 2.0;
    controls.maxDistance = 22.0;
    controls.target.set(0, 1.4, -1.8);
    controls.enablePan = false;

    // 2. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff8eb, 0x1f2937, 0.35);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff8eb, 0.95);
    sunLight.position.set(-14, 12, -2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -12;
    sunLight.shadow.camera.right = 12;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);

    // 3. ROOM SHELL
    const ROOM_W = 14;
    const ROOM_H = 4.5;
    const ROOM_D = 18;

    // Floor (Warm parquet wood)
    const floorGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_D);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xc49a6c,
      roughness: 0.52,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls & Ceiling
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.95 });

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), wallMat);
    ceiling.position.y = ROOM_H;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat);
    frontWall.position.set(0, ROOM_H / 2, -ROOM_D / 2);
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat);
    backWall.position.set(0, ROOM_H / 2, ROOM_D / 2);
    backWall.rotation.y = Math.PI;
    scene.add(backWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat);
    rightWall.position.set(ROOM_W / 2, ROOM_H / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat);
    leftWall.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Windows on Left Wall
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2
    });
    const winFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    [-3.5, 0, 3.5].forEach((z) => {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.2), winMat);
      win.rotation.y = Math.PI / 2;
      win.position.set(-ROOM_W / 2 + 0.05, 2.3, z);
      scene.add(win);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.3, 2.5), winFrameMat);
      frame.position.set(-ROOM_W / 2 + 0.04, 2.3, z);
      scene.add(frame);
    });

    // Ceiling Light Panels
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [[-3.2, -4], [3.2, -4], [-3.2, 2], [3.2, 2]].forEach(([x, z]) => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), lightMat);
      panel.position.set(x, ROOM_H - 0.02, z);
      scene.add(panel);

      const pl = new THREE.PointLight(0xffffff, 0.35, 9);
      pl.position.set(x, ROOM_H - 0.2, z);
      scene.add(pl);
    });

    // 4. BLACKBOARD WITH DYNAMIC CANVAS TEXTURE
    const boardCanvas = document.createElement('canvas');
    boardCanvas.width = 1024;
    boardCanvas.height = 512;
    const boardCtx = boardCanvas.getContext('2d')!;
    const boardTexture = new THREE.CanvasTexture(boardCanvas);

    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 2.8, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 })
    );
    boardFrame.position.set(0, 2.2, -ROOM_D / 2 + 0.08);
    scene.add(boardFrame);

    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 2.6),
      new THREE.MeshStandardMaterial({ map: boardTexture, roughness: 0.85 })
    );
    board.position.set(0, 2.2, -ROOM_D / 2 + 0.14);
    scene.add(board);

    // Chalk tray
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.06, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.5 })
    );
    tray.position.set(0, 0.78, -ROOM_D / 2 + 0.14);
    scene.add(tray);

    // 5. FURNITURE MATERIALS
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x785338, roughness: 0.6 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    function createDesk(x: number, z: number) {
      const g = new THREE.Group();
      // Table top
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.75), woodMat);
      top.position.y = 0.74;
      top.castShadow = true;
      top.receiveShadow = true;
      g.add(top);

      // Legs
      const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.74);
      [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, metalMat);
        leg.position.set(lx, 0.37, lz);
        leg.castShadow = true;
        g.add(leg);
      });

      // Laptop on desk
      const laptopBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.012, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
      );
      laptopBase.position.set(0, 0.776, 0.05);
      g.add(laptopBase);

      const laptopScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.18, 0.01),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.6
        })
      );
      laptopScreen.position.set(0, 0.87, -0.04);
      laptopScreen.rotation.x = 0.22;
      g.add(laptopScreen);

      g.position.set(x, 0, z);
      scene.add(g);
    }

    function createChair(x: number, z: number) {
      const g = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.46), chairMat);
      seat.position.y = 0.44;
      seat.castShadow = true;
      g.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.42, 0.04), chairMat);
      back.position.set(0, 0.72, 0.21);
      back.castShadow = true;
      g.add(back);

      const legGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.44);
      [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, metalMat);
        leg.position.set(lx, 0.22, lz);
        leg.castShadow = true;
        g.add(leg);
      });

      g.position.set(x, 0, z);
      scene.add(g);
    }

    // Teacher Desk & Chair
    const teacherDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.0), woodMat);
    teacherDesk.position.set(0, 0.4, -6.0);
    teacherDesk.castShadow = true;
    teacherDesk.receiveShadow = true;
    scene.add(teacherDesk);

    createChair(0, -6.8);

    // 6. CHARACTER BUILDER
    function buildCharacter({
      isSeated = false,
      skinColor = 0xffdbac,
      shirtColor = 0x2563eb,
      pantsColor = 0x1e293b,
      hairColor = 0x2b1d0c,
      hairStyle = 'short',
      hasGlasses = false
    }) {
      const charGroup = new THREE.Group();
      const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });
      const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
      const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const hips = new THREE.Group();
      charGroup.add(hips);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.50, 0.22), shirtMat);
      torso.position.y = 0.25;
      torso.castShadow = true;
      hips.add(torso);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.55, 0);
      hips.add(headGroup);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.22), skinMat);
      head.position.y = 0.12;
      head.castShadow = true;
      headGroup.add(head);

      // Eyes
      [-0.055, 0.055].forEach((ex) => {
        const eyeWhite = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.035), eyeWhiteMat);
        eyeWhite.position.set(ex, 0.135, 0.111);
        headGroup.add(eyeWhite);

        const pupil = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.024), eyeMat);
        pupil.position.set(ex, 0.135, 0.112);
        headGroup.add(pupil);
      });

      if (hasGlasses) {
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(0.23, 0.055, 0.02),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
        );
        frame.position.set(0, 0.135, 0.12);
        headGroup.add(frame);
      }

      // Hair
      if (hairStyle === 'bun') {
        const topHair = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.07, 0.23), hairMat);
        topHair.position.set(0, 0.24, 0);
        headGroup.add(topHair);

        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), hairMat);
        bun.position.set(0, 0.25, -0.11);
        headGroup.add(bun);
      } else {
        const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.24), hairMat);
        hairTop.position.set(0, 0.24, 0);
        headGroup.add(hairTop);

        const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), hairMat);
        fringe.position.set(0, 0.21, 0.11);
        headGroup.add(fringe);
      }

      // Arms
      function createArm(side: number) {
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 0.23, 0.44, 0);
        hips.add(shoulder);

        const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), shirtMat);
        upperArm.position.y = -0.14;
        upperArm.castShadow = true;
        shoulder.add(upperArm);

        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.08), skinMat);
        hand.position.y = -0.31;
        shoulder.add(hand);

        return shoulder;
      }

      const leftArm = createArm(-1);
      const rightArm = createArm(1);

      // Legs
      function createLeg(side: number) {
        const hipJoint = new THREE.Group();
        hipJoint.position.set(side * 0.11, 0, 0);
        hips.add(hipJoint);

        const upperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.12), pantsMat);
        upperLeg.position.y = -0.19;
        upperLeg.castShadow = true;
        hipJoint.add(upperLeg);

        const kneeJoint = new THREE.Group();
        kneeJoint.position.set(0, -0.38, 0);
        hipJoint.add(kneeJoint);

        const lowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.38, 0.11), pantsMat);
        lowerLeg.position.y = -0.19;
        lowerLeg.castShadow = true;
        kneeJoint.add(lowerLeg);

        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.18), shoeMat);
        shoe.position.set(0, -0.38, 0.04);
        shoe.castShadow = true;
        kneeJoint.add(shoe);

        return { hipJoint, kneeJoint };
      }

      const leftLeg = createLeg(-1);
      const rightLeg = createLeg(1);

      if (isSeated) {
        hips.position.y = 0.44;
        leftLeg.hipJoint.rotation.x = -Math.PI / 2;
        rightLeg.hipJoint.rotation.x = -Math.PI / 2;
        leftLeg.kneeJoint.rotation.x = Math.PI / 2;
        rightLeg.kneeJoint.rotation.x = Math.PI / 2;
        leftArm.rotation.x = -Math.PI / 3.4;
        rightArm.rotation.x = -Math.PI / 3.4;
      } else {
        hips.position.y = 0.84;
      }

      return { root: charGroup, hips, headGroup, leftArm, rightArm };
    }

    // 7. SPAWN TRAINER
    const trainer = buildCharacter({
      isSeated: false,
      skinColor: 0xe0ac69,
      shirtColor: 0x064e3b, // Celoris Emerald suit
      pantsColor: 0x0f172a,
      hairColor: 0x1f2937,
      hairStyle: 'short',
      hasGlasses: true
    });
    trainer.root.position.set(-1.8, 0, -5.2);
    trainer.root.rotation.y = 0.35;
    scene.add(trainer.root);

    // Pointer stick
    const chalkStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x34d399 })
    );
    chalkStick.rotation.x = Math.PI / 2;
    chalkStick.position.set(0, -0.32, 0.12);
    trainer.rightArm.add(chalkStick);

    // 8. 9 ATTENTIVE STUDENTS (3x3 grid)
    const studentCols = [-3.2, 0, 3.2];
    const studentRows = [-3.0, 0.5, 4.0];
    const animatedStudents: Array<{ headGroup: THREE.Group; hips: THREE.Group; rightArm: THREE.Group }> = [];
    let handRaisedStudent: { rightArm: THREE.Group } | null = null;

    const studentStyles = [
      { shirtColor: 0x059669, hairColor: 0x78350f, skinColor: 0xfcd34d, hairStyle: 'short' },
      { shirtColor: 0x0d9488, hairColor: 0x171717, skinColor: 0x8d5524, hairStyle: 'bun', hasGlasses: true },
      { shirtColor: 0x2563eb, hairColor: 0x451a03, skinColor: 0xffdbac, hairStyle: 'short' },
      { shirtColor: 0x7c3aed, hairColor: 0x1c1917, skinColor: 0xc68642, hairStyle: 'bun' },
      { shirtColor: 0x0284c7, hairColor: 0x713f12, skinColor: 0xf1c27d, hairStyle: 'short' },
      { shirtColor: 0x10b981, hairColor: 0x0a0a0a, skinColor: 0xe0ac69, hairStyle: 'short', hasGlasses: true },
      { shirtColor: 0x475569, hairColor: 0x3f2e20, skinColor: 0xffdbac, hairStyle: 'short' },
      { shirtColor: 0x16a34a, hairColor: 0x262626, skinColor: 0x8d5524, hairStyle: 'bun' },
      { shirtColor: 0x047857, hairColor: 0x543d2b, skinColor: 0xfcd34d, hairStyle: 'short' }
    ];

    let styleIdx = 0;
    studentCols.forEach((x, cIdx) => {
      studentRows.forEach((z, rIdx) => {
        createDesk(x, z);
        createChair(x, z + 0.58);

        const cfg = studentStyles[styleIdx % studentStyles.length];
        const student = buildCharacter({
          isSeated: true,
          ...cfg
        });

        // Face front (-Z)
        student.root.position.set(x, 0, z + 0.58);
        student.root.rotation.y = Math.PI;
        scene.add(student.root);

        animatedStudents.push({
          headGroup: student.headGroup,
          hips: student.hips,
          rightArm: student.rightArm
        });

        // Front Center Student (Col 1, Row 0) is hand raiser
        if (cIdx === 1 && rIdx === 0) {
          handRaisedStudent = { rightArm: student.rightArm };
        }

        styleIdx++;
      });
    });

    // 9. STORE REFERENCES
    threeRef.current = {
      scene,
      camera,
      renderer,
      controls,
      sunLight,
      ambientLight,
      boardTexture,
      boardCanvas,
      boardCtx,
      trainer: {
        hips: trainer.hips,
        headGroup: trainer.headGroup,
        rightArm: trainer.rightArm
      },
      animatedStudents,
      handRaisedStudent,
      isHandRaised: false,
      autoRotate: true,
      clock: new THREE.Clock(),
      camLerp: {
        active: false,
        startPos: new THREE.Vector3(),
        endPos: new THREE.Vector3(),
        startTarget: new THREE.Vector3(),
        endTarget: new THREE.Vector3(),
        progress: 0
      }
    };

    // Draw initial slide
    updateBoard(0);
    setIsLoading(false);

    // 10. ANIMATION LOOP
    let isTabVisible = true;
    const handleVisibility = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      threeRef.current!.animFrameId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const data = threeRef.current;
      if (!data) return;

      const delta = data.clock.getDelta();
      const time = data.clock.getElapsedTime();

      // Camera Lerp
      if (data.camLerp.active) {
        data.camLerp.progress += delta * 1.8;
        if (data.camLerp.progress >= 1) {
          data.camera.position.copy(data.camLerp.endPos);
          data.controls.target.copy(data.camLerp.endTarget);
          data.camLerp.active = false;
        } else {
          const t = 1 - Math.pow(1 - data.camLerp.progress, 3); // Ease out cubic
          data.camera.position.lerpVectors(data.camLerp.startPos, data.camLerp.endPos, t);
          data.controls.target.lerpVectors(data.camLerp.startTarget, data.camLerp.endTarget, t);
        }
      } else if (data.autoRotate) {
        // Slow cinematic idle panning around target
        data.controls.autoRotate = true;
        data.controls.autoRotateSpeed = 0.55;
      } else {
        data.controls.autoRotate = false;
      }

      // Trainer gesturing at board
      data.trainer.rightArm.rotation.x = -Math.PI / 2.2 + Math.sin(time * 2.0) * 0.12;
      data.trainer.rightArm.rotation.z = -0.35 + Math.cos(time * 1.5) * 0.06;
      data.trainer.hips.position.y = 0.84 + Math.sin(time * 2.5) * 0.003;

      // Trainer head turn when hand is raised
      if (data.isHandRaised) {
        data.trainer.headGroup.rotation.y = THREE.MathUtils.lerp(data.trainer.headGroup.rotation.y, 0.45, 0.08);
      } else {
        data.trainer.headGroup.rotation.y = THREE.MathUtils.lerp(data.trainer.headGroup.rotation.y, 0.0, 0.08);
      }

      // Students idle motions
      data.animatedStudents.forEach((st, idx) => {
        st.headGroup.rotation.y = Math.sin(time * 0.6 + idx * 0.8) * 0.06;
        st.headGroup.rotation.x = Math.cos(time * 0.4 + idx * 0.5) * 0.03;
        st.hips.position.y = 0.44 + Math.sin(time * 1.8 + idx) * 0.002;
      });

      // Hand raise lerp
      if (data.handRaisedStudent) {
        const targetArmAngle = data.isHandRaised ? -Math.PI * 0.88 : -Math.PI / 3.4;
        data.handRaisedStudent.rightArm.rotation.x = THREE.MathUtils.lerp(
          data.handRaisedStudent.rightArm.rotation.x,
          targetArmAngle,
          0.1
        );
      }

      data.controls.update();
      data.renderer.render(data.scene, data.camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !threeRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      threeRef.current.camera.aspect = w / h;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      if (threeRef.current?.animFrameId) {
        cancelAnimationFrame(threeRef.current.animFrameId);
      }
      renderer.dispose();
      threeRef.current = null;
    };
  }, [updateBoard]);

  // Keep autoRotate in sync
  useEffect(() => {
    if (threeRef.current) {
      threeRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const liveBatchesCount = activeRooms.filter(r => (r.status || '').toLowerCase().includes('live')).length;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      {/* Top Header & Positioning */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CELORIS 3D CAMPUS • INTERACTIVE LECTURE HALL</span>
          {liveBatchesCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              {liveBatchesCount} BATCHES LIVE
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black italic tracking-tight text-white uppercase leading-none">
          <span className="block text-white">STEP INTO</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            CELORIS 3D CAMPUS
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
          Experience real-time interactive classrooms. Touch to rotate in 360°, switch trainer and student viewpoints, raise your hand, and inspect live lesson materials.
        </p>
      </div>

      {/* 3D INTERACTIVE HERO STAGE CONTAINER */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-500/25 bg-[#0a0f18] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.15)] group">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070b12] text-emerald-400 gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Loading 3D Campus Hall...</span>
          </div>
        )}

        {/* 3D WebGL Canvas Target */}
        <div 
          ref={containerRef} 
          className="w-full h-[460px] sm:h-[540px] md:h-[620px] lg:h-[680px] cursor-grab active:cursor-grabbing outline-none"
          title="Drag mouse or finger to rotate 3D view"
        />

        {/* TOP FLOATING OVERLAYS */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
          {/* Active Preset Tag */}
          <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-300">
              {activeCam === 'overview' && '🎬 Campus Wide Overview'}
              {activeCam === 'trainer' && "👨‍🏫 Trainer's Podium View"}
              {activeCam === 'studentPOV' && '🎒 Front Student Desk POV'}
              {activeCam === 'board' && '📋 Smart Chalkboard Focus'}
            </span>
          </div>

          {/* Time of Day Lighting Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg">
            <button
              onClick={() => applyTimeOfDay('morning')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                timeOfDay === 'morning' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Morning Sunlight"
            >
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline text-[11px]">Morning</span>
            </button>
            <button
              onClick={() => applyTimeOfDay('sunset')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                timeOfDay === 'sunset' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Golden Sunset"
            >
              <Sunset className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Sunset</span>
            </button>
            <button
              onClick={() => applyTimeOfDay('night')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                timeOfDay === 'night' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Night Class"
            >
              <Moon className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline text-[11px]">Night</span>
            </button>
          </div>
        </div>

        {/* BOTTOM CONTROLS & CAMERA SELECTORS */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none z-20">
          {/* Camera View Angle Selector Pills */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            <button
              onClick={() => setCameraPreset('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCam === 'overview'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setCameraPreset('trainer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCam === 'trainer'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Trainer</span>
            </button>

            <button
              onClick={() => setCameraPreset('studentPOV')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCam === 'studentPOV'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student POV</span>
            </button>

            <button
              onClick={() => setCameraPreset('board')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCam === 'board'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Chalkboard</span>
            </button>
          </div>

          {/* Interactive Classroom Actions */}
          <div className="pointer-events-auto flex items-center gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            <button
              onClick={toggleHandRaise}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isHandRaised
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
              }`}
              title="Watch front student raise hand and trainer turn"
            >
              <Hand className="w-3.5 h-3.5" />
              <span>{isHandRaised ? 'Hand Raised! 🙋' : 'Raise Hand'}</span>
            </button>

            <button
              onClick={handleNextSlide}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 border border-white/10"
              title="Next lesson slide on 3D blackboard"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next Slide</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-xl transition-all ${
                autoRotate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title={autoRotate ? 'Auto-rotation ON' : 'Auto-rotation OFF'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
          </div>
        </div>

        {/* Quick Hint Overlay */}
        <div className="absolute top-16 left-4 pointer-events-none hidden sm:block">
          <div className="bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/5 text-[10px] font-mono text-slate-400">
            🖱️ Drag to rotate 360° • Scroll to zoom
          </div>
        </div>
      </div>

      {/* CTA & FEATURE CARDS ROW BELOW 3D CANVAS */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0d1624] to-purple-950/30 border border-emerald-500/20 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Ready to learn live with mentors?
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-white font-display font-black text-lg md:text-xl italic uppercase tracking-wide">
            Join 15-Student Verified Cohorts
          </p>
          <p className="text-xs text-slate-400 max-w-xl">
            Live audio lectern, shared smart whiteboards, screen broadcast, and 1-on-1 mentor guidance.
          </p>
        </div>

        <button
          onClick={handleEnter}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm transition-all duration-300 hover:scale-[1.03] shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Enter Live Classrooms</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4">
        <div className="p-4 rounded-xl bg-[#0c121d] border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Box className="w-4 h-4" />
            <span className="font-bold text-xs uppercase text-white">3D Virtual Aula</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Spatial classroom layout with trainer podium and 10 focused student seats.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <Tv className="w-4 h-4" />
            <span className="font-bold text-xs uppercase text-white">Smart Blackboard</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Live texture-mapped screen sharing, real-time code reviews, and lecture slides.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="font-bold text-xs uppercase text-white">15-Seat Batches</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            No overcrowded webinars. Small, intimate cohorts where every voice is heard.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Hand className="w-4 h-4" />
            <span className="font-bold text-xs uppercase text-white">Interactive Queue</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Raise hands in real time, unmute when called on by the trainer, and collaborate.
          </p>
        </div>
      </div>
    </div>
  );
}
