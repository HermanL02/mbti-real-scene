'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { MBTIType } from '@/types';
import { SCENE_CONFIGS } from './sceneConfigs';

interface PersonalitySceneProps {
  type: MBTIType;
}

// Floating particles with personality-specific colors
function ThemedParticles({ color, count = 150 }: { color: string; count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    return pos;
  }, [count]);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, [positions]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Floating geometric shapes
function FloatingShape({
  position,
  color,
  shape,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  shape: 'icosahedron' | 'octahedron' | 'torus' | 'dodecahedron';
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.x = time * 0.2;
    mesh.current.rotation.y = time * 0.3;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.3, 16, 32]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />;
      default:
        return <icosahedronGeometry args={[1, 0]} />;
    }
  }, [shape]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// Central glowing orb
function CentralOrb({ color }: { color: string }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const scale = 1 + Math.sin(time) * 0.05;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.4}
          roughness={0}
          metalness={1}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Inner glow */}
      <mesh scale={0.9}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </Float>
  );
}

// Ring effect
function GlowingRings({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.x = Math.sin(time * 0.5) * 0.3;
    group.current.rotation.z = time * 0.1;
  });

  return (
    <group ref={group}>
      {[2.5, 3, 3.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshBasicMaterial color={color} transparent opacity={0.3 - i * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ type }: PersonalitySceneProps) {
  const config = SCENE_CONFIGS[type];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color={config.accentColor} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color={config.secondaryColor} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color={config.accentColor}
      />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Themed particles */}
      <ThemedParticles color={config.particleColor} count={200} />

      {/* Central orb */}
      <CentralOrb color={config.accentColor} />

      {/* Glowing rings */}
      <GlowingRings color={config.secondaryColor} />

      {/* Floating shapes */}
      <FloatingShape position={[-5, 3, -5]} color={config.primaryColor} shape="icosahedron" scale={1.5} />
      <FloatingShape position={[6, -2, -8]} color={config.secondaryColor} shape="octahedron" scale={1.2} />
      <FloatingShape position={[-4, -3, -6]} color={config.accentColor} shape="torus" scale={0.8} />
      <FloatingShape position={[5, 4, -10]} color={config.primaryColor} shape="dodecahedron" scale={1} />

      {/* Environment */}
      <Environment preset="night" />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </>
  );
}

export function PersonalityScene({ type }: PersonalitySceneProps) {
  const config = SCENE_CONFIGS[type];

  return (
    <div className="fixed inset-0 -z-10" style={{ backgroundColor: config.backgroundColor }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <SceneContent type={type} />
      </Canvas>
    </div>
  );
}
