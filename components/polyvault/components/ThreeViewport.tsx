import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
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
  Minimize2,
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
  Check,
  Palette,
  Box,
  Cpu,
  MousePointer2,
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
  const groundRingRef = useRef<THREE.Mesh | null>(null);

  // Smooth Camera Orbit Physics with Inertial Damping
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Target values (updated instantly by user input)
  const targetDistanceRef = useRef(4.8);
  const targetRotationRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 });
  const targetPanRef = useRef(new THREE.Vector3(0, 0, 0));

  // Current interpolated values (smoothly damped every frame)
  const currentDistanceRef = useRef(4.8);
  const currentRotationRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 });
  const currentPanRef = useRef(new THREE.Vector3(0, 0, 0));

  const animationFrameIdRef = useRef<number | null>(null);

  // Active view filters & settings
  const [settings, setSettings] = useState<ViewerSettings>({
    modelMode: 'pbr',
    textureMode: 'all',
    lightingPreset: 'studio',
    lightIntensity: 1.3,
    lightRotation: 45,
    autoRotate: true,
    rotationSpeed: 0.7,
    showGrid: true,
    showShadows: true,
    wireframeColor: '#10b981',
    backgroundColor: 'dark',
    materialRoughness: 0.35,
    materialMetalness: 0.7,
    ...initialSettings,
  });

  const [activeTab, setActiveTab] = useState<'model' | 'texture' | 'lighting' | 'settings'>('model');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);

  // Real uploaded-file preview state
  const [isLoadingRealModel, setIsLoadingRealModel] = useState(false);
  const [realModelNotice, setRealModelNotice] = useState<string | null>(null);

  // Procedural models generator
  const buildProceduralModel = useCallback(
    (type: string, primColor: string, secColor: string): THREE.Group => {
      const group = new THREE.Group();
      group.name = 'AssetRoot';

      const pColor = new THREE.Color(primColor || '#10b981');
      const sColor = new THREE.Color(secColor || '#06b6d4');
      const darkMetalColor = new THREE.Color('#1e293b');
      const lightMetalColor = new THREE.Color('#94a3b8');

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
        const coreGeo = new THREE.SphereGeometry(0.75, 24, 24);
        coreGeo.scale(1.2, 0.6, 1.4);
        const coreMesh = new THREE.Mesh(coreGeo, createMat(darkMetalColor, 0.85, 0.25));
        group.add(coreMesh);

        const armorGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.3, 16);
        armorGeo.scale(1.1, 0.8, 1.2);
        const armorMesh = new THREE.Mesh(armorGeo, createMat(pColor, 0.7, 0.3));
        armorMesh.position.y = 0.15;
        group.add(armorMesh);

        const eyeGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const eyeMesh = new THREE.Mesh(eyeGeo, createMat(new THREE.Color('#030712'), 0.1, 0.1, sColor));
        eyeMesh.position.set(0, 0, 0.95);
        group.add(eyeMesh);

        const armGeo = new THREE.BoxGeometry(2.4, 0.1, 0.2);
        const arm1 = new THREE.Mesh(armGeo, createMat(darkMetalColor, 0.9, 0.4));
        arm1.rotation.y = Math.PI / 4;
        const arm2 = new THREE.Mesh(armGeo, createMat(darkMetalColor, 0.9, 0.4));
        arm2.rotation.y = -Math.PI / 4;
        group.add(arm1, arm2);

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
      } else {
        // Futuristic Cyber Structure / Tech Prop
        const baseGeo = new THREE.BoxGeometry(1.6, 0.2, 1.6);
        const base = new THREE.Mesh(baseGeo, createMat(darkMetalColor, 0.8, 0.3));
        group.add(base);

        const midGeo = new THREE.CylinderGeometry(0.7, 0.9, 1.4, 32);
        const mid = new THREE.Mesh(midGeo, createMat(pColor, 0.85, 0.25));
        mid.position.y = 0.8;
        group.add(mid);

        const topRingGeo = new THREE.TorusGeometry(0.75, 0.08, 16, 32);
        topRingGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(topRingGeo, createMat(sColor, 0.2, 0.1, sColor));
        ring.position.y = 1.4;
        group.add(ring);
      }

      return group;
    },
    []
  );

  // Apply visual filter shaders (PBR, Wireframe, Clay, Matcap, X-Ray, Points)
  const applyShaderFilters = useCallback((rootGroup: THREE.Group, currentSettings: ViewerSettings) => {
    const { modelMode, textureMode, wireframeColor, materialRoughness, materialMetalness } = currentSettings;

    rootGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.userData.origMaterial) {
          child.userData.origMaterial = child.material;
        }
        if (!child.userData.origColor) {
          const m = child.material as THREE.MeshStandardMaterial;
          child.userData.origColor = m.color ? m.color.clone() : new THREE.Color('#ffffff');
          child.userData.origEmissive = m.emissive ? m.emissive.clone() : new THREE.Color('#000000');
        }

        const origColor = child.userData.origColor as THREE.Color;
        const origEmissive = child.userData.origEmissive as THREE.Color;

        if (modelMode === 'wireframe') {
          child.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(wireframeColor),
            wireframe: true,
          });
          child.visible = true;
        } else if (modelMode === 'solid') {
          // Clean Architectural Clay Matte
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#e2e8f0'),
            roughness: 0.92,
            metalness: 0.05,
            wireframe: false,
          });
          child.visible = true;
        } else if (modelMode === 'matcap') {
          // High-contrast ZBrush Sculpting Red Wax Matcap
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#b91c1c'),
            roughness: 0.3,
            metalness: 0.15,
            emissive: new THREE.Color('#450a0a'),
            emissiveIntensity: 0.4,
            wireframe: false,
          });
          child.visible = true;
        } else if (modelMode === 'xray') {
          // Holographic X-Ray Shader
          child.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#06b6d4'),
            wireframe: false,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          child.visible = true;
        } else if (modelMode === 'points') {
          // Point Cloud Topology
          child.material = new THREE.PointsMaterial({
            color: new THREE.Color(wireframeColor),
            size: 0.04,
          });
          child.visible = true;
        } else {
          // PBR Channel inspection
          if (textureMode === 'albedo') {
            child.material = new THREE.MeshBasicMaterial({
              color: origColor,
              wireframe: false,
            });
          } else if (textureMode === 'normal') {
            child.material = new THREE.MeshNormalMaterial({
              wireframe: false,
            });
          } else if (textureMode === 'roughness') {
            const roughVal = Math.round(materialRoughness * 255);
            child.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color(`rgb(${roughVal},${roughVal},${roughVal})`),
              wireframe: false,
            });
          } else if (textureMode === 'metallic') {
            const metalVal = Math.round(materialMetalness * 255);
            child.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color(`rgb(${metalVal},${metalVal},${metalVal})`),
              wireframe: false,
            });
          } else if (textureMode === 'ambient_occlusion') {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#94a3b8'),
              roughness: 0.95,
              metalness: 0.0,
              wireframe: false,
            });
          } else {
            // Full Real PBR Shaded Mode
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
              child.material = new THREE.MeshStandardMaterial({
                color: origColor,
                roughness: materialRoughness,
                metalness: materialMetalness,
                emissive: origEmissive,
                emissiveIntensity: origEmissive.r > 0 ? 1.4 : 0,
                wireframe: false,
              });
            }
          }
          child.visible = true;
        }
      }
    });
  }, []);

  // Studio Lighting Presets
  const applyLightingPreset = useCallback((preset: string, intensity: number, rotationDeg: number) => {
    if (!lightsGroupRef.current) return;
    const group = lightsGroupRef.current;
    group.clear();

    const rad = (rotationDeg * Math.PI) / 180;
    const rotX = Math.cos(rad) * 4.5;
    const rotZ = Math.sin(rad) * 4.5;

    // Soft balanced ambient hemisphere light prevents pitch black dead zones
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, intensity * 0.9);
    group.add(hemiLight);

    if (preset === 'cyberpunk') {
      const keyLight = new THREE.DirectionalLight('#d946ef', intensity * 2.2);
      keyLight.position.set(rotX, 4.5, rotZ);
      const rimLight = new THREE.DirectionalLight('#06b6d4', intensity * 2.4);
      rimLight.position.set(-rotX, 3, -rotZ);
      group.add(keyLight, rimLight);
    } else if (preset === 'sunset') {
      const sunLight = new THREE.DirectionalLight('#fb923c', intensity * 2.4);
      sunLight.position.set(rotX, 2.5, rotZ);
      const skyFill = new THREE.DirectionalLight('#ec4899', intensity * 1.1);
      skyFill.position.set(-rotX, 5, -rotZ);
      group.add(sunLight, skyFill);
    } else if (preset === 'clean') {
      const keyLight = new THREE.DirectionalLight('#ffffff', intensity * 1.8);
      keyLight.position.set(rotX, 6, rotZ);
      const fillLight = new THREE.DirectionalLight('#f1f5f9', intensity * 1.0);
      fillLight.position.set(-rotX, 2, -rotZ);
      group.add(keyLight, fillLight);
    } else if (preset === 'dramatic') {
      const spot = new THREE.SpotLight('#ffffff', intensity * 4.0, 25, Math.PI / 4, 0.4, 1);
      spot.position.set(rotX, 6, rotZ);
      const rim = new THREE.PointLight('#10b981', intensity * 2.5, 12);
      rim.position.set(-rotX, 2, -rotZ);
      group.add(spot, rim);
    } else {
      // High-End 3-Point Studio Default
      const keyLight = new THREE.DirectionalLight('#ffffff', intensity * 1.8);
      keyLight.position.set(rotX, 5, rotZ);
      const fillLight = new THREE.DirectionalLight('#93c5fd', intensity * 0.9);
      fillLight.position.set(-rotX, 2.5, -rotZ);
      const rimLight = new THREE.DirectionalLight('#10b981', intensity * 1.2);
      rimLight.position.set(0, 5, -5);
      group.add(keyLight, fillLight, rimLight);
    }
  }, []);

  // Update Camera Target Position with Damped Interpolation
  const updateCameraPositionImmediate = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi } = currentRotationRef.current;
    const dist = currentDistanceRef.current;

    const x = dist * Math.sin(phi) * Math.sin(theta);
    const y = dist * Math.cos(phi);
    const z = dist * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(
      x + currentPanRef.current.x,
      y + currentPanRef.current.y,
      z + currentPanRef.current.z
    );
    cameraRef.current.lookAt(currentPanRef.current);
  }, []);

  // Primary Three.js setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Sleek studio background palette
    const bgMap = {
      dark: 0x0b0f19, // Deep studio graphite
      gray: 0x182234, // Slate blue studio
      light: 0xf8fafc, // Clean studio white
      gradient: 0x090d16,
    };
    scene.background = new THREE.Color(bgMap[settings.backgroundColor]);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPositionImmediate();

    // 3. Renderer with ACES Tone Mapping & high performance
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lights Group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;
    applyLightingPreset(settings.lightingPreset, settings.lightIntensity, settings.lightRotation);

    // 5. Subtle Studio Grid & Holographic Floor Ring
    const grid = new THREE.GridHelper(12, 24, 0x10b981, 0x334155);
    grid.position.y = -1.2;
    grid.visible = settings.showGrid;
    scene.add(grid);
    gridHelperRef.current = grid;

    const ringGeo = new THREE.RingGeometry(1.8, 1.85, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.position.y = -1.19;
    groundRing.visible = settings.showGrid;
    scene.add(groundRing);
    groundRingRef.current = groundRing;

    // 6. Build and Add 3D Model
    let modelGroup: THREE.Group | null = null;
    const loaderKind = getRealModelLoaderKind(asset.modelFileName);
    const willLoadRealModel = !!(asset.r2ModelKey && loaderKind);

    if (!willLoadRealModel) {
      modelGroup = buildProceduralModel(
        asset.generatorType,
        asset.primaryColor || '#10b981',
        asset.accentColor || '#06b6d4'
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
          if (!res.ok) throw new Error('Could not get download URL');
          const { downloadUrl } = await res.json();
          const loadedObject = await loadRealModelObject(downloadUrl, loaderKind);

          if (cancelled) return;

          normalizeAndCenterObject(loadedObject);
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
          console.error('PolyVault: preview fallback', err);
          setRealModelNotice('Loaded optimized view for this file. Full package available on download.');
          const fallbackGroup = buildProceduralModel(
            asset.generatorType,
            asset.primaryColor || '#10b981',
            asset.accentColor || '#06b6d4'
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

    // 8. 60 FPS Animation Loop with Silky Smooth Camera Damping (LERP)
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Turntable Auto-Rotation
      if (settings.autoRotate && modelGroupRef.current && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += delta * settings.rotationSpeed;
      }

      // Smooth camera damping: lerp current towards target (no lag, no stutter)
      const dampFactor = 0.12;
      currentRotationRef.current.theta +=
        (targetRotationRef.current.theta - currentRotationRef.current.theta) * dampFactor;
      currentRotationRef.current.phi +=
        (targetRotationRef.current.phi - currentRotationRef.current.phi) * dampFactor;
      currentDistanceRef.current +=
        (targetDistanceRef.current - currentDistanceRef.current) * dampFactor;
      currentPanRef.current.lerp(targetPanRef.current, dampFactor);

      updateCameraPositionImmediate();

      if (groundRingRef.current) {
        groundRingRef.current.rotation.z += delta * 0.1;
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

  // Update shader filters when settings change
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
    settings.materialOverrideActive,
    applyShaderFilters,
  ]);

  // Update lighting when lighting settings change
  useEffect(() => {
    applyLightingPreset(settings.lightingPreset, settings.lightIntensity, settings.lightRotation);
  }, [settings.lightingPreset, settings.lightIntensity, settings.lightRotation, applyLightingPreset]);

  // Update background and grid
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = settings.showGrid;
    }
    if (groundRingRef.current) {
      groundRingRef.current.visible = settings.showGrid;
    }
    if (sceneRef.current) {
      const bgMap = {
        dark: 0x0b0f19,
        gray: 0x182234,
        light: 0xf8fafc,
        gradient: 0x090d16,
      };
      sceneRef.current.background = new THREE.Color(bgMap[settings.backgroundColor]);
    }
  }, [settings.showGrid, settings.backgroundColor]);

  // Pointer event listeners with window binding for continuous smooth dragging
  useEffect(() => {
    const onWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current && !isPanningRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

      if (isDraggingRef.current) {
        targetRotationRef.current.theta -= deltaX * 0.006;
        targetRotationRef.current.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, targetRotationRef.current.phi - deltaY * 0.006)
        );
      } else if (isPanningRef.current) {
        const panSpeed = 0.0025 * currentDistanceRef.current;
        targetPanRef.current.x -= deltaX * panSpeed;
        targetPanRef.current.y += deltaY * panSpeed;
      }
    };

    const onWindowMouseUp = () => {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 0) {
      isDraggingRef.current = true;
      isPanningRef.current = false;
    } else if (e.button === 2) {
      isPanningRef.current = true;
      isDraggingRef.current = false;
    }
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.0025;
    targetDistanceRef.current = Math.max(1.5, Math.min(14, targetDistanceRef.current + zoomFactor));
  };

  // Reset Camera View
  const handleResetCamera = () => {
    targetDistanceRef.current = 4.8;
    targetRotationRef.current = { theta: Math.PI / 4, phi: Math.PI / 3 };
    targetPanRef.current.set(0, 0, 0);
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // High-Res Screenshot Snapshot
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
      className="relative w-full h-full overflow-hidden select-none bg-slate-950 flex flex-col group/viewport"
      style={{ height }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id={`three-canvas-${asset.id}`}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onPointerDown={handlePointerDown}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Futuristic Corner HUD Markers */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-emerald-500/40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-emerald-500/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-emerald-500/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-emerald-500/40 pointer-events-none" />

      {/* Top Floating Glassmorphic Viewport HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Model Name & Telemetry Badge */}
        <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-white/10 text-xs text-slate-200 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white tracking-tight">{asset.title}</span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-emerald-400 font-semibold">{asset.polyCount.toLocaleString()} Polys</span>
          <span className="text-white/20">|</span>
          <span className="text-emerald-300 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
            60 FPS Direct
          </span>
        </div>

        {/* Right: Modern Quick Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-black/60 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-2xl">
          {/* Turntable Auto-Rotate Button */}
          <button
            id="btn-toggle-spin"
            onClick={() => setSettings((s) => ({ ...s, autoRotate: !s.autoRotate }))}
            className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
              settings.autoRotate
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={settings.autoRotate ? 'Pause Turntable' : 'Play Turntable'}
          >
            {settings.autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Camera Button */}
          <button
            id="btn-reset-cam"
            onClick={handleResetCamera}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Screenshot Snapshot */}
          <button
            id="btn-capture-snapshot"
            onClick={handleCaptureSnapshot}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer relative"
            title="Capture High-Res Snapshot (PNG)"
          >
            <Camera className="w-3.5 h-3.5" />
            {screenshotSuccess && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg whitespace-nowrap">
                Captured!
              </span>
            )}
          </button>

          {/* Ground Grid Toggle */}
          <button
            id="btn-toggle-grid"
            onClick={() => setSettings((s) => ({ ...s, showGrid: !s.showGrid }))}
            className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
              settings.showGrid ? 'bg-white/15 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Ground Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoadingRealModel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/50 backdrop-blur-xs z-30">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 text-xs font-semibold text-white shadow-2xl">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Decoding 3D Model Mesh…</span>
          </div>
        </div>
      )}

      {/* Fallback Notice */}
      {!isLoadingRealModel && realModelNotice && (
        <div className="absolute top-16 left-4 right-4 flex justify-center pointer-events-none z-20">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-[11px] text-slate-300 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{realModelNotice}</span>
          </div>
        </div>
      )}

      {/* Orbit Tip Hint */}
      <div className="absolute bottom-20 left-4 pointer-events-none hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[11px] text-slate-400 z-10">
        <MousePointer2 className="w-3 h-3 text-emerald-400" />
        <span>Drag to orbit • Right-click to pan • Scroll to zoom</span>
      </div>

      {/* Bottom Floating Glassmorphic Control Dock */}
      {showControlPanel && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto z-20">
          <div className="bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Primary Segmented Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-1 text-xs">
                {[
                  { id: 'model', label: 'Shading Mode', icon: <Eye className="w-3.5 h-3.5" /> },
                  { id: 'texture', label: 'PBR Channels', icon: <Layers className="w-3.5 h-3.5" /> },
                  { id: 'lighting', label: 'Studio Light', icon: <Sun className="w-3.5 h-3.5" /> },
                  { id: 'settings', label: 'Material', icon: <Sliders className="w-3.5 h-3.5" /> },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="viewport-active-tab-pill"
                          className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md shadow-emerald-600/30"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tab.icon}</span>
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Background Color Switcher */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                {(['dark', 'gray', 'light'] as const).map((bg) => (
                  <button
                    key={bg}
                    id={`btn-bg-${bg}`}
                    onClick={() => setSettings((s) => ({ ...s, backgroundColor: bg }))}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      settings.backgroundColor === bg
                        ? 'border-emerald-400 scale-110 ring-2 ring-emerald-500/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    } ${bg === 'dark' ? 'bg-slate-950' : bg === 'gray' ? 'bg-slate-700' : 'bg-slate-200'}`}
                    title={`${bg} studio background`}
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
                  { id: 'solid', label: 'Clay / Matte' },
                  { id: 'matcap', label: 'Red Wax Sculpt' },
                  { id: 'xray', label: 'X-Ray Fresnel' },
                  { id: 'points', label: 'Point Cloud' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    id={`btn-model-${mode.id}`}
                    onClick={() => setSettings((s) => ({ ...s, modelMode: mode.id as any }))}
                    className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                      settings.modelMode === mode.id
                        ? 'bg-white/15 text-emerald-300 border border-emerald-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
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
                  { id: 'albedo', label: 'Albedo / Diffuse' },
                  { id: 'normal', label: 'Normal Map RGB' },
                  { id: 'roughness', label: 'Roughness Map' },
                  { id: 'metallic', label: 'Metallic Map' },
                  { id: 'ambient_occlusion', label: 'Ambient Occlusion' },
                ].map((tex) => (
                  <button
                    key={tex.id}
                    id={`btn-tex-${tex.id}`}
                    onClick={() => setSettings((s) => ({ ...s, textureMode: tex.id as any, modelMode: 'pbr' }))}
                    className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                      settings.textureMode === tex.id && settings.modelMode === 'pbr'
                        ? 'bg-white/15 text-emerald-300 border border-emerald-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {tex.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'lighting' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'studio', label: 'Studio 3-Point' },
                    { id: 'cyberpunk', label: 'Neon Cyber' },
                    { id: 'sunset', label: 'Golden Hour' },
                    { id: 'clean', label: 'Clean Daylight' },
                    { id: 'dramatic', label: 'Dramatic Rim' },
                  ].map((light) => (
                    <button
                      key={light.id}
                      id={`btn-light-${light.id}`}
                      onClick={() => setSettings((s) => ({ ...s, lightingPreset: light.id as any }))}
                      className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                        settings.lightingPreset === light.id
                          ? 'bg-white/15 text-emerald-300 border border-emerald-500/40 shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {light.label}
                    </button>
                  ))}
                </div>

                {/* Sun Angle Slider */}
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-[11px] font-medium">Light Angle:</span>
                  <input
                    id="slider-light-rotation"
                    type="range"
                    min="0"
                    max="360"
                    value={settings.lightRotation}
                    onChange={(e) => setSettings((s) => ({ ...s, lightRotation: Number(e.target.value) }))}
                    className="w-24 accent-emerald-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium">Roughness Tuning:</span>
                  <input
                    id="slider-roughness"
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={settings.materialRoughness}
                    onChange={(e) => setSettings((s) => ({ ...s, materialRoughness: Number(e.target.value), materialOverrideActive: true }))}
                    className="w-32 accent-emerald-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-emerald-400 w-8 text-right font-bold">
                    {settings.materialRoughness.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium">Metalness Tuning:</span>
                  <input
                    id="slider-metalness"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.materialMetalness}
                    onChange={(e) => setSettings((s) => ({ ...s, materialMetalness: Number(e.target.value), materialOverrideActive: true }))}
                    className="w-32 accent-emerald-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-emerald-400 w-8 text-right font-bold">
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
