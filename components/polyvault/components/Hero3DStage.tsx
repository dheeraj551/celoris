import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ModelAsset } from '../types';
import { buildProceduralModel } from '../utils/proceduralModels';
import {
  getRealModelLoaderKind,
  loadRealModelObject,
  normalizeAndCenterObject,
  standardizeMaterials,
  getModelUrlForAsset,
} from '../utils/modelLoaders';
import {
  Box,
  Eye,
  Download,
  Zap,
  RotateCw,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Maximize2,
  MousePointer2,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

function applyShadingMode(group: THREE.Object3D, mode: 'pbr' | 'wireframe' | 'clay') {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (!child.userData.origMaterial) {
        child.userData.origMaterial = child.material;
      }

      if (mode === 'wireframe') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true,
        });
      } else if (mode === 'clay') {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xf4f4f5,
          roughness: 0.9,
          metalness: 0.05,
        });
      } else {
        child.material = child.userData.origMaterial || child.material;
      }
    }
  });
}

interface Hero3DStageProps {
  featuredAsset: ModelAsset;
  onInspect: (asset: ModelAsset) => void;
  onDownload: (asset: ModelAsset) => void;
  onSelectFeatured: (asset: ModelAsset) => void;
  allAssets: ModelAsset[];
}

export const Hero3DStage: React.FC<Hero3DStageProps> = ({
  featuredAsset,
  onInspect,
  onDownload,
  onSelectFeatured,
  allAssets,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<'pbr' | 'wireframe' | 'clay'>('pbr');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;
  const renderModeRef = useRef(renderMode);
  renderModeRef.current = renderMode;

  // React to renderMode changes without re-mounting the entire scene
  useEffect(() => {
    renderModeRef.current = renderMode;
    if (modelGroupRef.current) {
      applyShadingMode(modelGroupRef.current, renderMode);
    }
  }, [renderMode]);

  // Initialize Three.js interactive showcase
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 5.0);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      return;
    }

    // High-tech studio lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 3.8);
    mainSpot.position.set(5, 8, 6);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.6;
    scene.add(mainSpot);

    const emeraldRim = new THREE.PointLight(0x10b981, 3.5, 12);
    emeraldRim.position.set(-4, 3, -3);
    scene.add(emeraldRim);

    const cyanFill = new THREE.PointLight(0x06b6d4, 2.2, 10);
    cyanFill.position.set(4, -1, -2);
    scene.add(cyanFill);

    const accentFill = new THREE.DirectionalLight(0x059669, 1.4);
    accentFill.position.set(0, -3, 3);
    scene.add(accentFill);

    // Dynamic ground grid with cyber styling
    const gridHelper = new THREE.GridHelper(12, 24, 0x10b981, 0xd1fae5);
    gridHelper.position.y = -1.3;
    scene.add(gridHelper);

    // Outer concentric glowing ring platform
    const platformGeo = new THREE.RingGeometry(1.6, 1.66, 64);
    platformGeo.rotateX(-Math.PI / 2);
    const platformMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const platformRing = new THREE.Mesh(platformGeo, platformMat);
    platformRing.position.y = -1.29;
    scene.add(platformRing);

    // Inner concentric ring
    const innerRingGeo = new THREE.RingGeometry(0.9, 0.94, 48);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.position.y = -1.29;
    scene.add(innerRing);

    // Floating cyber particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 9;
      particlePositions[i + 1] = Math.random() * 4.5 - 1.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 7;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Model Root Group Container
    const modelRoot = new THREE.Group();
    modelRoot.name = 'HeroModelRoot';
    modelRoot.position.y = 0;
    scene.add(modelRoot);
    modelGroupRef.current = modelRoot;

    // Fast initial procedural placeholder while real model loads
    const placeholder = buildProceduralModel(
      featuredAsset.generatorType,
      featuredAsset.primaryColor || '#059669',
      featuredAsset.accentColor || '#10b981',
      false
    );
    placeholder.position.y = 0;
    placeholder.scale.set(1.28, 1.28, 1.28);
    modelRoot.add(placeholder);
    applyShadingMode(placeholder, renderModeRef.current);

    let cancelled = false;
    const loaderKind = getRealModelLoaderKind(
      featuredAsset.modelFileName || (featuredAsset.title.toLowerCase().includes('lara') ? 'laracroft.glb' : undefined)
    );

    (async () => {
      try {
        const modelUrl = await getModelUrlForAsset(featuredAsset);
        if (!modelUrl || !loaderKind || cancelled) return;

        setIsLoadingModel(true);
        const loaded = await loadRealModelObject(modelUrl, loaderKind);
        if (cancelled) return;

        // Scale and center: size 2.5 puts base cleanly above the platform ring (-1.29)
        normalizeAndCenterObject(loaded, 2.5);
        standardizeMaterials(loaded);

        loaded.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (!child.userData.origMaterial) {
              child.userData.origMaterial = child.material;
            }
          }
        });

        applyShadingMode(loaded, renderModeRef.current);

        // Swap out placeholder with real model
        while (modelRoot.children.length > 0) {
          modelRoot.remove(modelRoot.children[0]);
        }
        modelRoot.add(loaded);
        setIsLoadingModel(false);
      } catch (err) {
        console.error('Hero3DStage: failed to load real model', err);
        setIsLoadingModel(false);
      }
    })();

    // Drag to rotate interaction with smooth easing
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setHasInteracted(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (isAutoRotatingRef.current && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += delta * 0.42;
      }

      if (modelGroupRef.current) {
        modelGroupRef.current.position.y = Math.sin(time * 1.8) * 0.08;
      }

      platformRing.rotation.z = time * 0.2;
      innerRing.rotation.z = -time * 0.3;
      particles.rotation.y = time * 0.035;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      scene.clear();
    };
  }, [featuredAsset]);

  const topPickAssets = allAssets.slice(0, 4);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-white via-slate-50/70 to-emerald-50/50 border border-zinc-200/90 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden p-6 sm:p-8 md:p-10 transition-all">
      {/* Sci-Fi Decorative Corner Brackets */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-emerald-500/40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-emerald-500/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-emerald-500/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-emerald-500/40 pointer-events-none" />

      {/* Background Graphic Grid Accent & Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-400/15 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-cyan-400/15 via-emerald-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Typography, Story, Specs & Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Animated Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-300/80 text-emerald-800 text-xs font-semibold shadow-xs backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '7s' }} />
            <span className="tracking-wide">FEATURED 3D MASTERPIECE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </motion.div>

          {/* Model Title & Story */}
          <div className="space-y-2.5">
            <AnimatePresence mode="wait">
              <motion.h2
                key={featuredAsset.id + '-title'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight leading-tight"
              >
                {featuredAsset.title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={featuredAsset.id + '-desc'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed"
              >
                {featuredAsset.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Quick Technical Highlights - Modern HUD Style */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-zinc-200/90 shadow-xs text-left group hover:border-emerald-300 transition-colors">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Polygons</span>
              <span className="text-base font-extrabold text-zinc-900 font-mono tracking-tight block">
                {featuredAsset.polyCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Quad Topology</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-zinc-200/90 shadow-xs text-left group hover:border-emerald-300 transition-colors">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Textures</span>
              <span className="text-base font-extrabold text-emerald-700 font-mono tracking-tight block">
                4K PBR Multi
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Albedo / Normal</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-zinc-200/90 shadow-xs text-left group hover:border-emerald-300 transition-colors">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">License</span>
              <span className="text-base font-extrabold text-zinc-900 tracking-tight block truncate">
                Royalty-Free
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Commercial Ready</span>
            </div>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-hero-inspect-model"
              onClick={() => onInspect(featuredAsset)}
              className="relative group overflow-hidden px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer transition-all"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
              <Eye className="w-4 h-4" />
              <span>Launch 3D WebGL Studio</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-hero-quick-download"
              onClick={() => onDownload(featuredAsset)}
              className="px-4 py-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Package</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                ⚡ 120 MB/s
              </span>
            </motion.button>
          </div>

          {/* Quick asset selector thumbs */}
          <div className="pt-3 border-t border-zinc-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                <span>Showcase Switcher</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Click to Load Model In 3D</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {topPickAssets.map((asset) => {
                const isSelected = asset.id === featuredAsset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => onSelectFeatured(asset)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/25 shadow-sm'
                        : 'bg-white/80 border-zinc-200 hover:border-emerald-300 hover:bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                    <div className="text-[10px] font-bold text-zinc-900 truncate">{asset.title}</div>
                    <div className="text-[9px] text-emerald-700 font-mono font-bold mt-0.5">
                      {asset.price === 0 ? 'FREE' : `₹${asset.price}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live WebGL 3D Interactive Graphic Stage */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-b from-white/95 via-slate-50/90 to-emerald-50/40 border border-zinc-200/90 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Holographic Radar Backdrop Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Corner Sci-Fi Viewport Accents */}
            <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-500/50 pointer-events-none z-10" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-500/50 pointer-events-none z-10" />
            <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-500/50 pointer-events-none z-10" />
            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-500/50 pointer-events-none z-10" />

            {/* Real-time 3D Mount Canvas */}
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              title="Click and drag to rotate the 3D model"
            />

            {/* Model Loading State Overlay */}
            {isLoadingModel && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 backdrop-blur-[2px] z-30">
                <div className="flex items-center gap-2.5 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-xs font-semibold text-white shadow-xl">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Loading 3D Model…</span>
                </div>
              </div>
            )}

            {/* Top Toolbar: Shading modes & Auto Rotate Toggle */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
              <div className="flex items-center gap-1 pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-zinc-200/90 shadow-xs">
                {(['pbr', 'wireframe', 'clay'] as const).map((mode) => {
                  const isActive = renderMode === mode;
                  const label = mode === 'pbr' ? 'PBR Shaded' : mode === 'wireframe' ? 'Wireframe' : 'Clay Matte';
                  return (
                    <button
                      key={mode}
                      onClick={() => setRenderMode(mode)}
                      className={`relative px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        isActive ? 'text-white' : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="hero-render-mode-active"
                          className="absolute inset-0 bg-emerald-600 rounded-xl shadow-xs"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-xs ${
                    isAutoRotating
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white/90 border-zinc-200 text-zinc-500 hover:text-zinc-900'
                  }`}
                  title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
                >
                  <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                </button>
              </div>
            </div>

            {/* Interactive Drag Hint (fades out after first interaction) */}
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-16 pointer-events-none flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white font-medium shadow-lg"
              >
                <MousePointer2 className="w-3 h-3 text-emerald-400 animate-bounce" />
                <span>Drag to inspect 360°</span>
              </motion.div>
            )}

            {/* Bottom Graphic Telemetry Bar */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] pointer-events-none z-20">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-zinc-200/90 shadow-xs pointer-events-auto text-zinc-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono font-bold text-emerald-800">WebGL 2.0</span>
                <span className="text-zinc-300">•</span>
                <span className="font-mono text-zinc-500">60 FPS Hardware</span>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-zinc-200/90 shadow-xs pointer-events-auto text-zinc-500 font-mono text-[10px] flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-emerald-600" />
                <span>Direct Orbit Viewport</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
