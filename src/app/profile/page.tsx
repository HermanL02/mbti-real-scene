'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ProfileForm } from '@/components/ui/ProfileForm';
import { DreamSceneLoader } from '@/components/three';

const DreamScene = dynamic(
  () => import('@/components/three/DreamScene').then((mod) => mod.DreamScene),
  {
    ssr: false,
    loading: () => <DreamSceneLoader />,
  }
);

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<DreamSceneLoader />}>
        <DreamScene intensity="medium" colorScheme="purple" />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <ProfileForm />
      </div>
    </main>
  );
}
