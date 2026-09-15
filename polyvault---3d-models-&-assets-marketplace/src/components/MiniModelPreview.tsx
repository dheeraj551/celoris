import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildProceduralModel } from '../utils/proceduralModels';

interface MiniModelPreviewProps {
  generatorType: string;
  primaryColor?: string;
  accentColor?: string;
  isHovered: boolean;
}

export const MiniModelPreview: React.FC<MiniModelPreviewProps> = ({
  generatorType,
  primaryColor = '#059669',
  accentColor = '#10b981',
  isHovered,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 220;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.8, 4.2);

    // Renderer
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
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(new THREE.Color(primaryColor), 1.2);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(new THREE.Color(accentColor), 2.5, 8);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // Procedural 3D model
    const modelGroup = buildProceduralModel(generatorType, primaryColor, accentColor);
    modelGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(modelGroup);

    // Floating subtle particle cloud for depth graphic
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 3;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 2));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(primaryColor),
      size: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interactive mouse tilt tracking
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let currentRotationX = 0.15;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotationY = x * 0.8;
      targetRotationX = 0.15 - y * 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const speedMultiplier = isHoveredRef.current ? 2.2 : 0.9;
      modelGroup.rotation.y += delta * speedMultiplier;

      // Smooth interpolation for interactive tilt
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      modelGroup.rotation.x = currentRotationX;
      modelGroup.position.y = Math.sin(time * 1.5) * 0.06;

      // Rotate particles slowly
      particles.rotation.y = time * 0.05;

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
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      scene.clear();
    };
  }, [generatorType, primaryColor, accentColor]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-pointer overflow-hidden flex items-center justify-center pointer-events-auto"
    />
  );
};
