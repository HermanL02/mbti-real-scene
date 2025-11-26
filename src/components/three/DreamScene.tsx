'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { FloatingParticles } from './FloatingParticles';
import { MorphingGeometry, MorphingTorus, MorphingOctahedron } from './MorphingGeometry';

interface DreamSceneProps {
  children?: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  colorScheme?: 'purple' | 'blue' | 'pink' | 'mixed';
}

const colorSchemes = {
  purple: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    tertiary: '#c4b5fd',
    particles: '#ddd6fe',
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    tertiary: '#93c5fd',
    particles: '#bfdbfe',
  },
  pink: {
    primary: '#ec4899',
    secondary: '#f472b6',
    tertiary: '#f9a8d4',
    particles: '#fbcfe8',
  },
  mixed: {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    tertiary: '#3b82f6',
    particles: '#a78bfa',
  },
};

function DreamSceneContent({ intensity = 'medium', colorScheme = 'purple' }: DreamSceneProps) {
  const colors = colorSchemes[colorScheme];
  const particleCount = intensity === 'low' ? 100 : intensity === 'high' ? 300 : 200;

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={colors.primary} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color={colors.secondary} />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Floating particles */}
      <FloatingParticles
        count={particleCount}
        color={colors.particles}
        size={0.08}
        spread={25}
        speed={0.15}
      />

      {/* Morphing geometry */}
      <MorphingGeometry
        position={[-4, 2, -8]}
        scale={3}
        color={colors.primary}
        speed={0.4}
        distort={0.5}
      />
      <MorphingTorus
        position={[5, -1, -6]}
        scale={2}
        color={colors.secondary}
        speed={0.3}
      />
      <MorphingOctahedron
        position={[0, 3, -10]}
        scale={1.5}
        color={colors.tertiary}
        speed={0.35}
      />

      {/* Additional background geometry */}
      <MorphingGeometry
        position={[-8, -3, -12]}
        scale={2}
        color={colors.tertiary}
        speed={0.25}
        distort={0.3}
      />
      <MorphingGeometry
        position={[8, 4, -15]}
        scale={2.5}
        color={colors.secondary}
        speed={0.2}
        distort={0.4}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.6}
          blendFunction={BlendFunction.NORMAL}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005]}
        />
      </EffectComposer>
    </>
  );
}

export function DreamScene({ children, intensity = 'medium', colorScheme = 'purple' }: DreamSceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <DreamSceneContent intensity={intensity} colorScheme={colorScheme} />
        </Suspense>
      </Canvas>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
      {children}
    </div>
  );
}

// Loading fallback for the scene
export function DreamSceneLoader() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
