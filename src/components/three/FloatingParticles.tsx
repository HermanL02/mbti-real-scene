'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
}

export function FloatingParticles({
  count = 200,
  color = '#a78bfa',
  size = 0.05,
  spread = 20,
  speed = 0.2,
}: FloatingParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions within spread
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;

      // Random velocities for organic movement
      vel[i * 3] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }

    return [pos, vel];
  }, [count, spread, speed]);

  // Set up buffer attributes
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, [positions]);

  useFrame((state) => {
    if (!mesh.current || !geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const positionAttribute = geometryRef.current.attributes.position;
    if (!positionAttribute) return;

    const posArray = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Gentle floating motion with sine waves
      posArray[i3] += Math.sin(time * 0.5 + i) * 0.001 + velocities[i3] * 0.01;
      posArray[i3 + 1] += Math.cos(time * 0.3 + i) * 0.002 + velocities[i3 + 1] * 0.01;
      posArray[i3 + 2] += Math.sin(time * 0.4 + i) * 0.001 + velocities[i3 + 2] * 0.01;

      // Wrap around boundaries
      const halfSpread = spread / 2;
      if (posArray[i3] > halfSpread) posArray[i3] = -halfSpread;
      if (posArray[i3] < -halfSpread) posArray[i3] = halfSpread;
      if (posArray[i3 + 1] > halfSpread) posArray[i3 + 1] = -halfSpread;
      if (posArray[i3 + 1] < -halfSpread) posArray[i3 + 1] = halfSpread;
      if (posArray[i3 + 2] > halfSpread) posArray[i3 + 2] = -halfSpread;
      if (posArray[i3 + 2] < -halfSpread) posArray[i3 + 2] = halfSpread;
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
