"use client"

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment, ContactShadows, Float, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelViewerProps {
  textureUrl: string | null;
  modelUrl?: string | null;
  shape: 'sphere' | 'cube' | 'cylinder' | 'torus';
  isGenerating: boolean;
  baseColor?: string;
  emissiveColor?: string;
  autoRotate: boolean;
}

function GLTFModel({ url, baseColor, emissiveColor }: { url: string, baseColor?: string, emissiveColor?: string }) {
  const { scene } = useGLTF(url);
  
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
        if (baseColor && baseColor !== '#ffffff') {
          (child.material as THREE.MeshStandardMaterial).color = new THREE.Color(baseColor);
        }
        if (emissiveColor && emissiveColor !== '#000000') {
          (child.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(emissiveColor);
        }
      }
    });
    return clone;
  }, [scene, baseColor, emissiveColor]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Center scale={2.5}>
        <primitive object={clonedScene} />
      </Center>
    </Float>
  );
}

function TexturedShape({ textureUrl, shape, baseColor, emissiveColor }: { textureUrl: string, shape: string, baseColor?: string, emissiveColor?: string }) {
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Adjust repeat based on shape to make it look better
  if (shape === 'cube') {
    texture.repeat.set(1, 1);
  } else {
    texture.repeat.set(2, 1);
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh castShadow receiveShadow>
        {shape === 'sphere' && <sphereGeometry args={[2, 64, 64]} />}
        {shape === 'cube' && <boxGeometry args={[2.5, 2.5, 2.5]} />}
        {shape === 'cylinder' && <cylinderGeometry args={[1.5, 1.5, 3, 64]} />}
        {shape === 'torus' && <torusGeometry args={[1.5, 0.6, 32, 100]} />}
        <meshStandardMaterial 
          map={texture} 
          color={baseColor || '#ffffff'}
          emissive={emissiveColor || '#000000'}
          roughness={0.3} 
          metalness={0.1} 
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

function DefaultShape({ shape, baseColor, emissiveColor }: { shape: string, baseColor?: string, emissiveColor?: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh castShadow receiveShadow>
        {shape === 'sphere' && <sphereGeometry args={[2, 64, 64]} />}
        {shape === 'cube' && <boxGeometry args={[2.5, 2.5, 2.5]} />}
        {shape === 'cylinder' && <cylinderGeometry args={[1.5, 1.5, 3, 64]} />}
        {shape === 'torus' && <torusGeometry args={[1.5, 0.6, 32, 100]} />}
        <meshStandardMaterial 
          color={baseColor === '#ffffff' ? '#333333' : (baseColor || '#333333')} 
          emissive={emissiveColor || '#000000'}
          roughness={0.2} 
          metalness={0.8} 
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function ModelViewer({ textureUrl, modelUrl, shape, isGenerating, baseColor, emissiveColor, autoRotate }: ModelViewerProps) {
  return (
    <div className="w-full h-full relative bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {isGenerating && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium animate-pulse">Synthesizing 3D Asset...</p>
        </div>
      )}
      
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 10, 20]} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          {modelUrl ? (
            <GLTFModel url={modelUrl} baseColor={baseColor} emissiveColor={emissiveColor} />
          ) : textureUrl ? (
            <TexturedShape textureUrl={textureUrl} shape={shape} baseColor={baseColor} emissiveColor={emissiveColor} />
          ) : (
            <DefaultShape shape={shape} baseColor={baseColor} emissiveColor={emissiveColor} />
          )}
          <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={10} 
          autoRotate={autoRotate && !isGenerating && (!!textureUrl || !!modelUrl)} 
          autoRotateSpeed={1}
        />
      </Canvas>
      
      {!textureUrl && !modelUrl && !isGenerating && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <p className="text-neutral-500 font-mono text-sm tracking-widest uppercase">Awaiting Input</p>
        </div>
      )}
    </div>
  );
}
