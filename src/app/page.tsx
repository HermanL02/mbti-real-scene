'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { DreamSceneLoader } from '@/components/three';
import { LanguageSwitcher } from '@/components/ui';

// Dynamic import for 3D scene to avoid SSR issues
const DreamScene = dynamic(
  () => import('@/components/three/DreamScene').then((mod) => mod.DreamScene),
  {
    ssr: false,
    loading: () => <DreamSceneLoader />,
  }
);

export default function Home() {
  const t = useTranslations('landing');
  const tc = useTranslations('common');

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<DreamSceneLoader />}>
        <DreamScene intensity="high" colorScheme="purple" />
      </Suspense>

      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-4 z-20 pt-safe">
        <LanguageSwitcher />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
              {t('title')}
            </span>
            <br />
            <span className="text-white/90">{t('titleHighlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-purple-100/80 mb-4 leading-relaxed">
            {t('subtitle')}
          </p>

          <p className="text-sm md:text-base text-purple-200/60 mb-6 max-w-lg mx-auto">
            {t('description')}
          </p>

          {/* Free badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-12">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-300 text-sm font-medium">{t('freeBadge')}</span>
          </div>

          {/* CTA Button */}
          <Link
            href="/profile"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300"
          >
            {/* Button background */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

            {/* Button content */}
            <span className="relative flex items-center gap-2">
              {t('startButton')}
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">{t('features.scenarios.title')}</h3>
              <p className="text-purple-200/60 text-sm">{t('features.scenarios.description')}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">{t('features.personalized.title')}</h3>
              <p className="text-purple-200/60 text-sm">{t('features.personalized.description')}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">{t('features.immersive.title')}</h3>
              <p className="text-purple-200/60 text-sm">{t('features.immersive.description')}</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
    </main>
  );
}
