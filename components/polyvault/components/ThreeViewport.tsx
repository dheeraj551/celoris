import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ModelAsset, ViewerSettings } from '../types';
import {
  getRealModelLoaderKind,
  loadRealModelObject,
  normalizeAndCenterObject,
  standardizeMaterials,
} from '../utils/modelLoaders';
import {
  RotateCcw,
  Sun,
  Grid,
  Maximize2,
  Camera,
  Play,
  Pause,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  Compass,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface ThreeViewportProps {
  asset: ModelAsset;
  initialSettings?: Partial<ViewerSettings>;
  height?: string;
  showControlPanel?: boolean;
}

export const ThreeViewport: React.FC<ThreeViewportProps> = ({
  asset,
  initialSettings,
  height = '500px',
  showControlPanel = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Interaction controls state
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraDistanceRef = useRef(4.8);
  const cameraRotationRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const animationFrameIdRef = useRef<number | null>(null);

  // Active view filters
  const [settings, setSettings] = useState<ViewerSettings>({
    modelMode: 'pbr',
    textureMode: 'all',
    lightingPreset: 'studio',
    lightIntensity: 1.3,
    lightRotation: 45,
    autoRotate: true,
    rotationSpeed: 0.8,
    showGrid: true,
    showShadows: true,
    wireframeColor: '#38bdf8',
    backgroundColor: 'dark',
    materialRoughness: 0.35,
    materialMetalness: 0.7,
    ...initialSettings,
  });

  const [activeTab, setActiveTab] = useState<'model' | 'texture' | 'lighting' | 'settings'>('model');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);

  // Real uploaded-file preview state (separate from the procedural placeholder)
  const [isLoadingRealModel, setIsLoadingRealModel] = useState(false);
  const [realModelNotice, setRealModelNotice] = useState<string | null>(null);

  // Helper to construct detailed procedural meshes for the selected generator type
  const buildProceduralModel = useCallback(
    (type: string, primColor: string, secColor: string): THREE.Group => {
      const group = new THREE.Group();
      group.name = 'AssetRoot';

      const pColor = new THREE.Color(primColor || '#38bdf8');
      const sColor = new THREE.Color(secColor || '#f43f5e');
      const darkMetalColor = new THREE.Color('#1e293b');
      const lightMetalColor = new THREE.Color('#94a3b8');

      // Shared default material placeholder - will be modified by applyShaderFilters
      const createMat = (color: THREE.Color, metal: number, rough: number, emissive?: THREE.Color) => {
        return new THREE.MeshStandardMaterial({
          color,
          metalness: metal,
          roughness: rough,
          emissive: emissive || new THREE.Color(0x000000),
          emissiveIntensity: emissive ? 1.2 : 0,
        });
      };

      if (type === 'drone') {
        // Sci-Fi VTOL Combat Drone
        const coreGeo = new THREE.SphereGeometry(0.75, 24, 24);
        coreGeo.scale(1.2, 0.6, 1.4);
        const coreMesh = new THREE.Mesh(coreGeo, createMat(darkMetalColor, 0.85, 0.25));
        group.add(coreMesh);

        // Armor shell panels
        const armorGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.3, 16);
        armorGeo.scale(1.1, 0.8, 1.2);
        const armorMesh = new THREE.Mesh(armorGeo, createMat(pColor, 0.7, 0.3));
        armorMesh.position.y = 0.15;
        group.add(armorMesh);

        // Center optical camera sensor / eye
        const eyeGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const eyeMesh = new THREE.Mesh(eyeGeo, createMat(new THREE.Color('#030712'), 0.1, 0.1, sColor));
        eyeMesh.position.set(0, 0, 0.95);
        group.add(eyeMesh);

        // Rotor arms & thruster pods
        const armGeo = new THREE.BoxGeometry(2.4, 0.1, 0.2);
        const arm1 = new THREE.Mesh(armGeo, createMat(darkMetalColor, 0.9, 0.4));
        arm1.rotation.y = Math.PI / 4;
        const arm2 = new THREE.Mesh(armGeo, createMat(darkMetalColor, 0.9, 0.4));
        arm2.rotation.y = -Math.PI / 4;
        group.add(arm1, arm2);

        // 4 Thruster nacelles
        const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
        angles.forEach((ang) => {
          const podGeo = new THREE.CylinderGeometry(0.35, 0.32, 0.4, 16);
          const podMesh = new THREE.Mesh(podGeo, createMat(lightMetalColor, 0.8, 0.3));
          podMesh.position.set(Math.cos(ang) * 1.3, 0.05, Math.sin(ang) * 1.3);

          const glowGeo = new THREE.TorusGeometry(0.28, 0.04, 12, 24);
          const glowMesh = new THREE.Mesh(glowGeo, createMat(new THREE.Color('#000'), 0, 1, pColor));
          glowMesh.rotation.x = Math.PI / 2;
          glowMesh.position.y = -0.18;
          podMesh.add(glowMesh);

          group.add(podMesh);
        });

        // Antennae
        const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
        const ant = new THREE.Mesh(antGeo, createMat(lightMetalColor, 0.9, 0.2));
        ant.position.set(0.35, 0.6, -0.6);
        ant.rotation.x = -0.2;
        group.add(ant);
      } else if (type === 'helmet') {
        // Cyberpunk Samurai Helmet
        const domeGeo = new THREE.SphereGeometry(0.9, 32, 24);
        domeGeo.scale(0.9, 1.1, 1.05);
        const dome = new THREE.Mesh(domeGeo, createMat(darkMetalColor, 0.75, 0.3));
        group.add(dome);

        // Visor slit
        const visorGeo = new THREE.BoxGeometry(1.2, 0.22, 0.6);
        const visor = new THREE.Mesh(visorGeo, createMat(new THREE.Color('#000'), 0.1, 0.1, pColor));
        visor.position.set(0, 0.1, 0.7);
        group.add(visor);

        // Cheek / face armor plates
        const cheekGeo = new THREE.BoxGeometry(0.35, 0.8, 0.5);
        const cheekL = new THREE.Mesh(cheekGeo, createMat(pColor, 0.65, 0.35));
        cheekL.position.set(0.7, -0.3, 0.4);
        cheekL.rotation.y = 0.3;
        const cheekR = new THREE.Mesh(cheekGeo, createMat(pColor, 0.65, 0.35));
        cheekR.position.set(-0.7, -0.3, 0.4);
        cheekR.rotation.y = -0.3;
        group.add(cheekL, cheekR);

        // Crest / Horns
        const hornGeo = new THREE.ConeGeometry(0.18, 1.1, 8);
        hornGeo.rotateZ(0.4);
        const hornL = new THREE.Mesh(hornGeo, createMat(sColor, 0.9, 0.2));
        hornL.position.set(0.5, 0.9, 0.1);
        const hornR = new THREE.Mesh(hornGeo.clone().rotateZ(-0.8), createMat(sColor, 0.9, 0.2));
        hornR.position.set(-0.5, 0.9, 0.1);
        group.add(hornL, hornR);

        // Neck collar
        const neckGeo = new THREE.TorusGeometry(0.75, 0.14, 12, 32);
        neckGeo.rotateX(Math.PI / 2);
        const neck = new THREE.Mesh(neckGeo, createMat(lightMetalColor, 0.8, 0.4));
        neck.position.y = -0.7;
        group.add(neck);
      } else if (type === 'sword') {
        // Plasma Relic Greatsword
        // Blade
        const bladeGeo = new THREE.BoxGeometry(0.24, 2.8, 0.05);
        const blade = new THREE.Mesh(bladeGeo, createMat(lightMetalColor, 0.95, 0.15));
        blade.position.y = 0.7;
        group.add(blade);

        // Emissive blade conduit core
        const coreGeo = new THREE.BoxGeometry(0.06, 2.5, 0.06);
        const core = new THREE.Mesh(coreGeo, createMat(new THREE.Color('#000'), 0, 1, pColor));
        core.position.y = 0.7;
        group.add(core);

        // Guard
        const guardGeo = new THREE.BoxGeometry(1.2, 0.18, 0.22);
        const guard = new THREE.Mesh(guardGeo, createMat(sColor, 0.8, 0.3));
        guard.position.y = -0.7;
        group.add(guard);

        // Grip / Hilt
        const hiltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
        const hilt = new THREE.Mesh(hiltGeo, createMat(darkMetalColor, 0.4, 0.7));
        hilt.position.y = -1.2;
        group.add(hilt);

        // Pommel
        const pommelGeo = new THREE.DodecahedronGeometry(0.18);
        const pommel = new THREE.Mesh(pommelGeo, createMat(sColor, 0.85, 0.25));
        pommel.position.y = -1.7;
        group.add(pommel);
      } else if (type === 'car') {
        // Futuristic Hypercar
        const bodyGeo = new THREE.BoxGeometry(1.4, 0.45, 2.8);
        bodyGeo.scale(1, 0.8, 1);
        const body = new THREE.Mesh(bodyGeo, createMat(pColor, 0.9, 0.2));
        body.position.y = 0.3;
        group.add(body);

        // Cockpit canopy
        const canopyGeo = new THREE.SphereGeometry(0.55, 16, 16);
        canopyGeo.scale(1.1, 0.65, 1.8);
        const canopy = new THREE.Mesh(canopyGeo, createMat(new THREE.Color('#090d16'), 0.2, 0.05));
        canopy.position.set(0, 0.55, -0.1);
        group.add(canopy);

        // 4 Aerodynamic wheels
        const wheelPos = [
          [-0.78, 0.25, 0.85],
          [0.78, 0.25, 0.85],
          [-0.78, 0.25, -0.85],
          [0.78, 0.25, -0.85],
        ];
        wheelPos.forEach(([x, y, z]) => {
          const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 20);
          wheelGeo.rotateZ(Math.PI / 2);
          const wheel = new THREE.Mesh(wheelGeo, createMat(darkMetalColor, 0.5, 0.6));
          wheel.position.set(x, y, z);

          const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
          rimGeo.rotateZ(Math.PI / 2);
          const rim = new THREE.Mesh(rimGeo, createMat(sColor, 0.9, 0.2));
          rim.position.set(x, y, z);
          group.add(wheel, rim);
        });

        // Rear light bar
        const lightBarGeo = new THREE.BoxGeometry(1.2, 0.08, 0.1);
        const lightBar = new THREE.Mesh(lightBarGeo, createMat(new THREE.Color('#000'), 0, 1, sColor));
        lightBar.position.set(0, 0.4, -1.4);
        group.add(lightBar);
      } else if (type === 'building') {
        // Neo-Brutalist Architecture
        const baseGeo = new THREE.BoxGeometry(2.4, 0.3, 2.4);
        const base = new THREE.Mesh(baseGeo, createMat(new THREE.Color('#475569'), 0.2, 0.8));
        base.position.y = -0.8;
        group.add(base);

        const tower1Geo = new THREE.BoxGeometry(1.1, 2.2, 1.1);
        const tower1 = new THREE.Mesh(tower1Geo, createMat(new THREE.Color('#64748b'), 0.2, 0.75));
        tower1.position.set(-0.4, 0.4, -0.2);
        group.add(tower1);

        const tower2Geo = new THREE.BoxGeometry(0.9, 1.6, 0.9);
        const tower2 = new THREE.Mesh(tower2Geo, createMat(new THREE.Color('#94a3b8'), 0.3, 0.7));
        tower2.position.set(0.5, 0.1, 0.4);
        group.add(tower2);

        // Cantilever bridge
        const bridgeGeo = new THREE.BoxGeometry(1.6, 0.25, 0.7);
        const bridge = new THREE.Mesh(bridgeGeo, createMat(pColor, 0.7, 0.3));
        bridge.position.set(0, 0.8, 0);
        group.add(bridge);

        // Glass apertures
        const glassGeo = new THREE.BoxGeometry(0.8, 1.4, 0.05);
        const glass = new THREE.Mesh(glassGeo, createMat(new THREE.Color('#0284c7'), 0.1, 0.1, pColor));
        glass.position.set(0.5, 0.2, 0.88);
        group.add(glass);
      } else if (type === 'crystal') {
        // Aether Crystal Obelisk
        const crystalGeo = new THREE.OctahedronGeometry(1.1, 0);
        crystalGeo.scale(0.8, 2.0, 0.8);
        const crystal = new THREE.Mesh(crystalGeo, createMat(pColor, 0.4, 0.1, sColor));
        crystal.position.y = 0.2;
        group.add(crystal);

        // Orbiting floating shards
        for (let i = 0; i < 5; i++) {
          const shardGeo = new THREE.OctahedronGeometry(0.25, 0);
          shardGeo.scale(0.4, 1.2, 0.4);
          const shard = new THREE.Mesh(shardGeo, createMat(sColor, 0.3, 0.2));
          const angle = (i / 5) * Math.PI * 2;
          shard.position.set(Math.cos(angle) * 1.3, (i % 2 === 0 ? 0.3 : -0.3), Math.sin(angle) * 1.3);
          shard.rotation.z = 0.2 * i;
          group.add(shard);
        }

        // Runic floating ring
        const ringGeo = new THREE.TorusGeometry(1.4, 0.06, 8, 32);
        ringGeo.rotateX(Math.PI / 2.3);
        const ring = new THREE.Mesh(ringGeo, createMat(darkMetalColor, 0.9, 0.3, pColor));
        group.add(ring);
      } else {
        // Bipedal Battle Bot / Mech
        const torsoGeo = new THREE.BoxGeometry(1.1, 1.1, 0.9);
        const torso = new THREE.Mesh(torsoGeo, createMat(pColor, 0.75, 0.3));
        torso.position.y = 0.5;
        group.add(torso);

        const headGeo = new THREE.BoxGeometry(0.6, 0.45, 0.6);
        const head = new THREE.Mesh(headGeo, createMat(darkMetalColor, 0.8, 0.3));
        head.position.set(0, 1.2, 0);
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), createMat(new THREE.Color('#000'), 0, 1, sColor));
        eye.position.set(0, 1.2, 0.32);
        group.add(head, eye);

        // Limbs
        const armGeo = new THREE.CylinderGeometry(0.16, 0.14, 1.2, 12);
        const armL = new THREE.Mesh(armGeo, createMat(lightMetalColor, 0.8, 0.4));
        armL.position.set(0.85, 0.3, 0);
        const armR = new THREE.Mesh(armGeo, createMat(lightMetalColor, 0.8, 0.4));
        armR.position.set(-0.85, 0.3, 0);

        const legGeo = new THREE.BoxGeometry(0.35, 1.3, 0.45);
        const legL = new THREE.Mesh(legGeo, createMat(darkMetalColor, 0.7, 0.4));
        legL.position.set(0.4, -0.7, 0);
        const legR = new THREE.Mesh(legGeo, createMat(darkMetalColor, 0.7, 0.4));
        legR.position.set(-0.4, -0.7, 0);

        group.add(armL, armR, legL, legR);
      }

      return group;
    },
    []
  );

  // Apply visual filter shaders / materials to all meshes in the loaded model
  const applyShaderFilters = useCallback(
    (group: THREE.Group, currentSettings: ViewerSettings) => {
      const { modelMode, textureMode, wireframeColor, materialRoughness, materialMetalness } = currentSettings;

      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Backup original color if not backed up
          if (!child.userData.origColor) {
            const originalMat = child.material as THREE.MeshStandardMaterial;
            child.userData.origColor = originalMat.color?.clone() || new THREE.Color('#38bdf8');
            child.userData.origEmissive = originalMat.emissive?.clone() || new THREE.Color('#000000');
            // Keep the untouched original material itself, texture maps and
            // all, so "Full PBR Shaded" mode below can restore a real
            // uploaded model's real look instead of rebuilding a flat,
            // textureless material from just the backed-up color — that was
            // silently discarding every real map (albedo/normal/roughness/
            // metalness/AO) the first time the viewer applied its default
            // filter, which is why a real upload always rendered as a flat
            // single-color blob under the studio lighting.
            child.userData.origMaterial = originalMat;
          }

          const origColor = child.userData.origColor as THREE.Color;
          const origEmissive = child.userData.origEmissive as THREE.Color;

          if (modelMode === 'wireframe') {
            // Crisp Wireframe Filter
            child.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color(wireframeColor),
              wireframe: true,
            });
            child.visible = true;
          } else if (modelMode === 'solid') {
            // Neutral Clay / Solid Matcap Filter
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#d1d5db'),
              roughness: 0.9,
              metalness: 0.05,
              wireframe: false,
            });
            child.visible = true;
          } else if (modelMode === 'matcap') {
            // Sculptor Matcap / Stylized Red Wax Filter
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#b91c1c'),
              roughness: 0.35,
              metalness: 0.15,
              emissive: new THREE.Color('#450a0a'),
              emissiveIntensity: 0.4,
              wireframe: false,
            });
            child.visible = true;
          } else if (modelMode === 'xray') {
            // Hologram / X-Ray Filter
            child.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color('#06b6d4'),
              wireframe: false,
              transparent: true,
              opacity: 0.38,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            });
            child.visible = true;
          } else if (modelMode === 'points') {
            // Topology Point Cloud Filter
            child.material = new THREE.PointsMaterial({
              color: new THREE.Color(wireframeColor),
              size: 0.05,
            });
            child.visible = true;
          } else {
            // Standard PBR or Texture Channel Inspection
            if (textureMode === 'albedo') {
              // Flat diffuse base color inspection without lighting interference
              child.material = new THREE.MeshBasicMaterial({
                color: origColor,
                wireframe: false,
              });
            } else if (textureMode === 'normal') {
              // RGB Normal Map Tangent Simulation (False color normals)
              child.material = new THREE.MeshNormalMaterial({
                wireframe: false,
              });
            } else if (textureMode === 'roughness') {
              // Grayscale Roughness Channel (Dark = smooth, White = rough)
              const roughVal = Math.round(materialRoughness * 255);
              child.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(`rgb(${roughVal},${roughVal},${roughVal})`),
                wireframe: false,
              });
            } else if (textureMode === 'metallic') {
              // Grayscale Metalness Channel (White = metal, Black = dielectric)
              const metalVal = Math.round(materialMetalness * 255);
              child.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(`rgb(${metalVal},${metalVal},${metalVal})`),
                wireframe: false,
              });
            } else if (textureMode === 'ambient_occlusion') {
              // Ambient Occlusion cavity simulation
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#9ca3af'),
                roughness: 0.95,
                metalness: 0.0,
                wireframe: false,
              });
            } else {
              // Full PBR Shaded Mode — restore the model's real material
              // (real texture maps intact) by default. The Roughness/
              // Metalness sliders only kick in once the user has actually
              // touched one of them (materialOverrideActive), so a freshly
              // loaded real upload shows its true appearance untouched.
              const origMaterial = child.userData.origMaterial as THREE.MeshStandardMaterial;
              if (currentSettings.materialOverrideActive && origMaterial) {
                const overrideMat = origMaterial.clone();
                overrideMat.roughness = materialRoughness;
                overrideMat.metalness = materialMetalness;
                overrideMat.wireframe = false;
                child.material = overrideMat;
              } else if (origMaterial) {
                child.material = origMaterial;
              } else {
                // Fallback for the rare case there was no original material
                // to back up (shouldn't normally happen).
                child.material = new THREE.MeshStandardMaterial({
                  color: origColor,
                  roughness: materialRoughness,
                  metalness: materialMetalness,
                  emissive: origEmissive,
                  emissiveIntensity: origEmissive.r > 0 || origEmissive.g > 0 || origEmissive.b > 0 ? 1.4 : 0,
                  wireframe: false,
                });
              }
            }
            child.visible = true;
          }
        }
      });
    },
    []
  );

  // Apply lighting presets
  const applyLightingPreset = useCallback((preset: string, intensity: number, rotationDeg: number) => {
    if (!lightsGroupRef.current) return;
    const group = lightsGroupRef.current;
    group.clear();

    const rad = (rotationDeg * Math.PI) / 180;
    const rotX = Math.cos(rad) * 4.5;
    const rotZ = Math.sin(rad) * 4.5;

    if (preset === 'cyberpunk') {
      // Magenta key, cyan rim, purple ambient
      const keyLight = new THREE.DirectionalLight('#d946ef', intensity * 2.0);
      keyLight.position.set(rotX, 4, rotZ);
      const rimLight = new THREE.DirectionalLight('#06b6d4', intensity * 2.2);
      rimLight.position.set(-rotX, 3, -rotZ);
      const ambient = new THREE.AmbientLight('#3b0764', 0.6);
      group.add(keyLight, rimLight, ambient);
    } else if (preset === 'sunset') {
      // Warm golden hour sunlight
      const sunLight = new THREE.DirectionalLight('#f97316', intensity * 2.2);
      sunLight.position.set(rotX, 2.5, rotZ);
      const skyLight = new THREE.DirectionalLight('#ec4899', intensity * 0.9);
      skyLight.position.set(-rotX, 5, -rotZ);
      const ambient = new THREE.AmbientLight('#78350f', 0.5);
      group.add(sunLight, skyLight, ambient);
    } else if (preset === 'clean') {
      // 5600K Clean daylight neutral studio
      const keyLight = new THREE.DirectionalLight('#f8fafc', intensity * 1.5);
      keyLight.position.set(rotX, 5, rotZ);
      const fillLight = new THREE.DirectionalLight('#e2e8f0', intensity * 0.8);
      fillLight.position.set(-rotX, 2, -rotZ);
      const ambient = new THREE.AmbientLight('#ffffff', 0.4);
      group.add(keyLight, fillLight, ambient);
    } else if (preset === 'dramatic') {
      // Single sharp theatrical rim/key light with high contrast
      const spot = new THREE.SpotLight('#ffffff', intensity * 3.5, 20, Math.PI / 5, 0.4, 1);
      spot.position.set(rotX, 5, rotZ);
      const ambient = new THREE.AmbientLight('#0f172a', 0.2);
      group.add(spot, ambient);
    } else if (preset === 'highkey') {
      // High-key minimal white studio
      const key = new THREE.DirectionalLight('#ffffff', intensity * 1.8);
      key.position.set(rotX, 6, rotZ);
      const fill = new THREE.DirectionalLight('#f1f5f9', intensity * 1.2);
      fill.position.set(-rotX, 3, -rotZ);
      const ambient = new THREE.AmbientLight('#ffffff', 0.8);
      group.add(key, fill, ambient);
    } else {
      // Studio default: 3-point light
      const keyLight = new THREE.DirectionalLight('#fef08a', intensity * 1.6);
      keyLight.position.set(rotX, 4, rotZ);
      const fillLight = new THREE.DirectionalLight('#38bdf8', intensity * 0.8);
      fillLight.position.set(-rotX, 2, -rotZ);
      const rimLight = new THREE.DirectionalLight('#ffffff', intensity * 1.0);
      rimLight.position.set(0, 5, -5);
      const ambient = new THREE.AmbientLight('#1e293b', 0.5);
      group.add(keyLight, fillLight, rimLight, ambient);
    }
  }, []);

  // Update camera position based on spherical coordinates
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi } = cameraRotationRef.current;
    const dist = cameraDistanceRef.current;

    const x = dist * Math.sin(phi) * Math.sin(theta);
    const y = dist * Math.cos(phi);
    const z = dist * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(
      x + cameraTargetRef.current.x,
      y + cameraTargetRef.current.y,
      z + cameraTargetRef.current.z
    );
    cameraRef.current.lookAt(cameraTargetRef.current);
  }, []);

  // Primary Three.js setup effect
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background color
    const bgMap = {
      dark: 0x090d16,
      gray: 0x1e293b,
      light: 0xf1f5f9,
      gradient: 0x0a0f1d,
    };
    scene.background = new THREE.Color(bgMap[settings.backgroundColor]);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true, // Needed for screenshot capability
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    // 4. Lights Group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;
    applyLightingPreset(settings.lightingPreset, settings.lightIntensity, settings.lightRotation);

    // 5. Grid Helper
    const grid = new THREE.GridHelper(10, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = -1.2;
    grid.visible = settings.showGrid;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 6. Build and add 3D Model. When there's a real uploaded file we can
    // read in-browser, show just the empty grid while it downloads and
    // decodes — not an unrelated procedural shape — then swap the real
    // model in once it's ready. The procedural placeholder is only used as
    // the actual visual when there's no real file to load, or as a fallback
    // if loading the real file fails partway through.
    let modelGroup: THREE.Group | null = null;
    const loaderKind = getRealModelLoaderKind(asset.modelFileName);
    const willLoadRealModel = !!(asset.r2ModelKey && loaderKind);

    if (!willLoadRealModel) {
      modelGroup = buildProceduralModel(
        asset.generatorType,
        asset.primaryColor || '#0ea5e9',
        asset.accentColor || '#38bdf8'
      );
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;
      applyShaderFilters(modelGroup, settings);
    }

    let cancelled = false;
    setRealModelNotice(null);

    if (asset.r2ModelKey && loaderKind) {
      setIsLoadingRealModel(true);
      (async () => {
        try {
          const res = await fetch('/api/polyvault/sign-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: asset.r2ModelKey, filename: asset.modelFileName }),
          });
          if (!res.ok) throw new Error('Could not get a download link for this model file');
          const { downloadUrl } = await res.json();

          const loadedObject = await loadRealModelObject(downloadUrl, loaderKind);

          if (cancelled) return;

          normalizeAndCenterObject(loadedObject);
          // Normalize every mesh onto MeshStandardMaterial so the existing
          // shader-filter system (wireframe / matcap / x-ray / PBR channel
          // inspection) behaves the same as it does on the procedural
          // placeholders. glTF materials are already MeshStandardMaterial
          // (keeps real textures); OBJ/FBX materials get replaced.
          standardizeMaterials(loadedObject);

          if (modelGroup) scene.remove(modelGroup);
          const realGroup = new THREE.Group();
          realGroup.name = 'AssetRoot';
          realGroup.add(loadedObject);
          scene.add(realGroup);
          modelGroupRef.current = realGroup;
          applyShaderFilters(realGroup, settings);
          setIsLoadingRealModel(false);
        } catch (err) {
          if (cancelled) return;
          console.error('PolyVault: failed to load the real model file, showing placeholder preview instead', err);
          setRealModelNotice('Live preview unavailable for this file — showing a placeholder. The download still contains your real file.');
          // Real load failed — fall back to the procedural placeholder now,
          // since there was never one on screen during the loading attempt.
          const fallbackGroup = buildProceduralModel(
            asset.generatorType,
            asset.primaryColor || '#0ea5e9',
            asset.accentColor || '#38bdf8'
          );
          scene.add(fallbackGroup);
          modelGroupRef.current = fallbackGroup;
          applyShaderFilters(fallbackGroup, settings);
          setIsLoadingRealModel(false);
        }
      })();
    }

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (settings.autoRotate && modelGroupRef.current && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += delta * settings.rotationSpeed;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelled = true;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [asset.id, asset.generatorType, asset.primaryColor, asset.accentColor, asset.r2ModelKey, asset.modelFileName]);

  // Effect to update shader filters when settings change
  useEffect(() => {
    if (modelGroupRef.current) {
      applyShaderFilters(modelGroupRef.current, settings);
    }
  }, [
    settings.modelMode,
    settings.textureMode,
    settings.wireframeColor,
    settings.materialRoughness,
    settings.materialMetalness,
    applyShaderFilters,
  ]);

  // Effect to update lighting when lighting settings change
  useEffect(() => {
    applyLightingPreset(settings.lightingPreset, settings.lightIntensity, settings.lightRotation);
  }, [settings.lightingPreset, settings.lightIntensity, settings.lightRotation, applyLightingPreset]);

  // Effect to update grid & background
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = settings.showGrid;
    }
    if (sceneRef.current) {
      const bgMap = {
        dark: 0x090d16,
        gray: 0x1e293b,
        light: 0xf1f5f9,
        gradient: 0x0a0f1d,
      };
      sceneRef.current.background = new THREE.Color(bgMap[settings.backgroundColor]);
    }
  }, [settings.showGrid, settings.backgroundColor]);

  // Mouse & Touch Orbit event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) {
      isDraggingRef.current = true;
      isPanningRef.current = false;
    } else if (e.button === 2) {
      isPanningRef.current = true;
      isDraggingRef.current = false;
    }
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current && !isPanningRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current) {
      cameraRotationRef.current.theta -= deltaX * 0.008;
      cameraRotationRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, cameraRotationRef.current.phi - deltaY * 0.008)
      );
      updateCameraPosition();
    } else if (isPanningRef.current && cameraRef.current) {
      const panSpeed = 0.003 * cameraDistanceRef.current;
      cameraTargetRef.current.x -= deltaX * panSpeed;
      cameraTargetRef.current.y += deltaY * panSpeed;
      updateCameraPosition();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.002;
    cameraDistanceRef.current = Math.max(1.8, Math.min(12, cameraDistanceRef.current + zoomFactor));
    updateCameraPosition();
  };

  // Reset Camera View
  const handleResetCamera = () => {
    cameraDistanceRef.current = 4.8;
    cameraRotationRef.current = { theta: Math.PI / 4, phi: Math.PI / 3 };
    cameraTargetRef.current.set(0, 0, 0);
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
    updateCameraPosition();
  };

  // Take High-Res Screenshot Snapshot
  const handleCaptureSnapshot = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${asset.title.toLowerCase().replace(/\s+/g, '-')}-viewport.png`;
    link.href = dataUrl;
    link.click();
    setScreenshotSuccess(true);
    setTimeout(() => setScreenshotSuccess(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      id={`viewport-container-${asset.id}`}
      className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 select-none shadow-2xl flex flex-col"
      style={{ height }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id={`three-canvas-${asset.id}`}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top Floating Viewport HUD Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {/* Left: Quick Format & Polycount Badges */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 shadow-lg">
          <span className="font-semibold text-sky-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 3D Viewport
          </span>
          <span className="text-slate-500">|</span>
          <span>{asset.polyCount.toLocaleString()} Polys</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-mono">60 FPS</span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
          <button
            id="btn-toggle-spin"
            onClick={() => setSettings((s) => ({ ...s, autoRotate: !s.autoRotate }))}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              settings.autoRotate ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={settings.autoRotate ? 'Pause Turntable' : 'Spin Turntable'}
          >
            {settings.autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            id="btn-reset-cam"
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
            title="Reset Camera Position"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="btn-capture-snapshot"
            onClick={handleCaptureSnapshot}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors relative"
            title="Capture Viewport Screenshot (PNG)"
          >
            <Camera className="w-4 h-4" />
            {screenshotSuccess && (
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                Saved!
              </span>
            )}
          </button>

          <button
            id="btn-toggle-grid"
            onClick={() => setSettings((s) => ({ ...s, showGrid: !s.showGrid }))}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              settings.showGrid ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Ground Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real Model Loading Indicator */}
      {isLoadingRealModel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-950/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs text-slate-200 shadow-lg">
            <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
            Loading your uploaded model…
          </div>
        </div>
      )}

      {/* Placeholder-Fallback Notice (real file couldn't be previewed in-browser) */}
      {!isLoadingRealModel && realModelNotice && (
        <div className="absolute top-14 left-3 right-3 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-amber-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-700/50 text-[11px] text-amber-200 shadow-lg max-w-md text-center">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            {realModelNotice}
          </div>
        </div>
      )}

      {/* Orbit Helper Tip Overlay (fades out after hovering) */}
      <div className="absolute bottom-16 left-3 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800/60 text-[11px] text-slate-400">
        <Compass className="w-3.5 h-3.5 text-sky-400" />
        <span>Drag to orbit • Right-click to pan • Scroll to zoom</span>
      </div>

      {/* Bottom Filter Navigation Bar */}
      {showControlPanel && (
        <div className="absolute bottom-3 left-3 right-3 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 p-2 shadow-2xl">
            {/* Filter Category Selectors */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-1 text-xs">
                <button
                  id="tab-filter-model"
                  onClick={() => setActiveTab('model')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'model'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Model View
                </button>

                <button
                  id="tab-filter-texture"
                  onClick={() => setActiveTab('texture')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'texture'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Textures
                </button>

                <button
                  id="tab-filter-lighting"
                  onClick={() => setActiveTab('lighting')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'lighting'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Lighting
                </button>

                <button
                  id="tab-filter-settings"
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Material
                </button>
              </div>

              {/* Background Color Selector */}
              <div className="flex items-center gap-1">
                {(['dark', 'gray', 'light'] as const).map((bg) => (
                  <button
                    key={bg}
                    id={`btn-bg-${bg}`}
                    onClick={() => setSettings((s) => ({ ...s, backgroundColor: bg }))}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      settings.backgroundColor === bg ? 'border-sky-400 scale-110' : 'border-transparent opacity-60'
                    } ${bg === 'dark' ? 'bg-slate-950' : bg === 'gray' ? 'bg-slate-600' : 'bg-slate-200'}`}
                    title={`${bg} background`}
                  />
                ))}
              </div>
            </div>

            {/* Filter Content Panels */}
            {activeTab === 'model' && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'pbr', label: 'PBR Shaded' },
                  { id: 'wireframe', label: 'Wireframe' },
                  { id: 'solid', label: 'Clay / Solid' },
                  { id: 'matcap', label: 'Red Wax Matcap' },
                  { id: 'xray', label: 'X-Ray Fresnel' },
                  { id: 'points', label: 'Vertex Points' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    id={`btn-model-${mode.id}`}
                    onClick={() => setSettings((s) => ({ ...s, modelMode: mode.id as any }))}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      settings.modelMode === mode.id
                        ? 'bg-slate-800 text-sky-400 border border-sky-500/40 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'texture' && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Full PBR Combined' },
                  { id: 'albedo', label: 'Albedo / Base Color' },
                  { id: 'normal', label: 'Normal Map RGB' },
                  { id: 'roughness', label: 'Roughness Map' },
                  { id: 'metallic', label: 'Metallic Map' },
                  { id: 'ambient_occlusion', label: 'Ambient Occlusion' },
                ].map((tex) => (
                  <button
                    key={tex.id}
                    id={`btn-tex-${tex.id}`}
                    onClick={() => setSettings((s) => ({ ...s, textureMode: tex.id as any, modelMode: 'pbr' }))}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      settings.textureMode === tex.id && settings.modelMode === 'pbr'
                        ? 'bg-slate-800 text-sky-400 border border-sky-500/40 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {tex.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'lighting' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'studio', label: 'Studio 3-Point' },
                    { id: 'cyberpunk', label: 'Neon Cyber' },
                    { id: 'sunset', label: 'Golden Hour' },
                    { id: 'clean', label: 'Daylight 5600K' },
                    { id: 'dramatic', label: 'Dramatic Rim' },
                    { id: 'highkey', label: 'High Key' },
                  ].map((light) => (
                    <button
                      key={light.id}
                      id={`btn-light-${light.id}`}
                      onClick={() => setSettings((s) => ({ ...s, lightingPreset: light.id as any }))}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        settings.lightingPreset === light.id
                          ? 'bg-slate-800 text-sky-400 border border-sky-500/40 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      {light.label}
                    </button>
                  ))}
                </div>

                {/* Light Angle Slider */}
                <div className="flex items-center gap-2 w-full sm:w-auto text-slate-400">
                  <span>Sun Angle:</span>
                  <input
                    id="slider-light-rotation"
                    type="range"
                    min="0"
                    max="360"
                    value={settings.lightRotation}
                    onChange={(e) => setSettings((s) => ({ ...s, lightRotation: Number(e.target.value) }))}
                    className="w-24 accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-2">
                  <span>Roughness:</span>
                  <input
                    id="slider-roughness"
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={settings.materialRoughness}
                    onChange={(e) => setSettings((s) => ({ ...s, materialRoughness: Number(e.target.value), materialOverrideActive: true }))}
                    className="w-32 accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-slate-400 w-8 text-right">
                    {settings.materialRoughness.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span>Metalness:</span>
                  <input
                    id="slider-metalness"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.materialMetalness}
                    onChange={(e) => setSettings((s) => ({ ...s, materialMetalness: Number(e.target.value), materialOverrideActive: true }))}
                    className="w-32 accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-slate-400 w-8 text-right">
                    {settings.materialMetalness.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
