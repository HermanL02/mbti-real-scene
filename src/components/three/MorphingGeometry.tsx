'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

interface MorphingGeometryProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  distort?: number;
}

export function MorphingGeometry({
  position = [0, 0, 0],
  scale = 2,
  color = '#8b5cf6',
  speed = 0.5,
  distort = 0.4,
}: MorphingGeometryProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;

    // Slow rotation
    mesh.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    mesh.current.rotation.y = time * 0.1;
    mesh.current.rotation.z = Math.cos(time * 0.15) * 0.1;

    // Gentle pulsing scale
    const pulseScale = scale + Math.sin(time * 0.5) * 0.1;
    mesh.current.scale.setScalar(pulseScale);
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.3}
        distort={distort}
        speed={speed}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

// Additional morphing shapes for variety
export function MorphingTorus({
  position = [0, 0, 0],
  scale = 1.5,
  color = '#c4b5fd',
  speed = 0.3,
}: MorphingGeometryProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;

    mesh.current.rotation.x = time * 0.15;
    mesh.current.rotation.y = Math.sin(time * 0.2) * 0.5;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1, 0.3, 16, 32]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.25}
        distort={0.3}
        speed={speed}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

export function MorphingOctahedron({
  position = [0, 0, 0],
  scale = 1,
  color = '#ddd6fe',
  speed = 0.4,
}: MorphingGeometryProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;

    mesh.current.rotation.x = Math.cos(time * 0.25) * 0.3;
    mesh.current.rotation.y = time * 0.2;
    mesh.current.rotation.z = Math.sin(time * 0.3) * 0.2;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.2}
        distort={0.5}
        speed={speed}
        roughness={0.4}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}
