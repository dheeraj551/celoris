import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ModelAsset } from '../types';
import { buildProceduralModel } from '../utils/proceduralModels';
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
} from 'lucide-react';

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

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  // Initialize Three.js interactive showcase
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.0);

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
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      return;
    }

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 3.5);
    mainSpot.position.set(5, 8, 6);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.5;
    scene.add(mainSpot);

    const emeraldRim = new THREE.PointLight(0x10b981, 3.0, 12);
    emeraldRim.position.set(-4, 3, -3);
    scene.add(emeraldRim);

    const accentFill = new THREE.DirectionalLight(0x059669, 1.2);
    accentFill.position.set(0, -3, 3);
    scene.add(accentFill);

    // Dynamic ground grid with glowing emerald circles
    const gridHelper = new THREE.GridHelper(10, 20, 0x10b981, 0xe4e4e7);
    gridHelper.position.y = -1.3;
    scene.add(gridHelper);

    // Glowing ring platform
    const platformGeo = new THREE.RingGeometry(1.6, 1.68, 64);
    platformGeo.rotateX(-Math.PI / 2);
    const platformMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const platformRing = new THREE.Mesh(platformGeo, platformMat);
    platformRing.position.y = -1.29;
    scene.add(platformRing);

    // Floating particle field graphic
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = Math.random() * 4 - 1.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x059669,
      size: 0.055,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Procedural Model Group
    const model = buildProceduralModel(
      featuredAsset.generatorType,
      featuredAsset.primaryColor || '#059669',
      featuredAsset.accentColor || '#10b981',
      renderMode === 'wireframe'
    );
    model.position.y = 0;
    model.scale.set(1.25, 1.25, 1.25);
    scene.add(model);
    modelGroupRef.current = model;

    // Apply clay mode if requested
    if (renderMode === 'clay') {
      const clayMat = new THREE.MeshStandardMaterial({
        color: 0xf4f4f5,
        roughness: 0.9,
        metalness: 0.1,
      });
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = clayMat;
        }
      });
    }

    // Drag to rotate interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
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
        modelGroupRef.current.rotation.y += delta * 0.45;
      }

      if (modelGroupRef.current) {
        modelGroupRef.current.position.y = Math.sin(time * 1.8) * 0.08;
      }

      platformRing.rotation.z = time * 0.2;
      particles.rotation.y = time * 0.03;

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
  }, [featuredAsset, renderMode]);

  const topPickAssets = allAssets.slice(0, 4);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-white via-zinc-50 to-emerald-50/40 border border-zinc-200/90 shadow-sm overflow-hidden p-6 md:p-8">
      {/* Background Graphic Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Typography, Story, Specs & Action */}
        <div className="lg:col-span-5 space-y-5">
          {/* Animated Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Featured 3D Masterpiece</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </motion.div>

          <div className="space-y-2">
            <motion.h2
              key={featuredAsset.id + '-title'}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight"
            >
              {featuredAsset.title}
            </motion.h2>

            <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
              {featuredAsset.description}
            </p>
          </div>

          {/* Quick Technical Highlights */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-xs text-left">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Polygons</span>
              <span className="text-sm font-bold text-zinc-900 font-mono">
                {featuredAsset.polyCount.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-xs text-left">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Textures</span>
              <span className="text-sm font-bold text-emerald-700">4K PBR Multi</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-xs text-left">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">License</span>
              <span className="text-sm font-bold text-zinc-900">Royalty-Free</span>
            </div>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-hero-inspect-model"
              onClick={() => onInspect(featuredAsset)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Launch 3D WebGL Studio</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-hero-quick-download"
              onClick={() => onDownload(featuredAsset)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Package</span>
            </motion.button>
          </div>

          {/* Quick asset selector thumbs */}
          <div className="pt-2 border-t border-zinc-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Select Featured Showcase:
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Click to Load In 3D</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {topPickAssets.map((asset) => {
                const isSelected = asset.id === featuredAsset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => onSelectFeatured(asset)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-zinc-900 truncate">{asset.title}</div>
                    <div className="text-[9px] text-emerald-700 font-mono font-medium">
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
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-gradient-to-b from-zinc-50/90 to-white/95 border border-zinc-200/90 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Real-time 3D Mount Canvas */}
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              title="Click and drag to rotate the 3D model"
            />

            {/* Top Toolbar: Shading modes & Auto Rotate Toggle */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl border border-zinc-200 shadow-xs">
                <button
                  onClick={() => setRenderMode('pbr')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    renderMode === 'pbr' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  PBR Shaded
                </button>
                <button
                  onClick={() => setRenderMode('wireframe')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    renderMode === 'wireframe'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Wireframe
                </button>
                <button
                  onClick={() => setRenderMode('clay')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    renderMode === 'clay' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Clay Matte
                </button>
              </div>

              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-xs ${
                  isAutoRotating
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white/90 border-zinc-200 text-zinc-500 hover:text-zinc-900'
                }`}
                title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              </button>
            </div>

            {/* Bottom Graphic Telemetry Bar */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] pointer-events-none">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-zinc-200 shadow-xs pointer-events-auto text-zinc-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono font-medium text-emerald-800">Direct WebGL 2.0 Canvas</span>
                <span className="text-zinc-300">•</span>
                <span className="font-mono">Interactive Orbit</span>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-zinc-200 shadow-xs pointer-events-auto text-zinc-500 font-mono text-[10px]">
                Drag to rotate 360°
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
