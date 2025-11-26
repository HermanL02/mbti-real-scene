'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useAssessmentStore } from '@/store/assessment';
import { TraitAnalytics } from '@/components/ui/TraitAnalytics';
import { DreamSceneLoader } from '@/components/three';
import { SCENE_CONFIGS } from '@/components/three/ResultScenes/sceneConfigs';
import type { MBTIType } from '@/types';

const PersonalityScene = dynamic(
  () => import('@/components/three/ResultScenes/PersonalityScene').then((mod) => mod.PersonalityScene),
  {
    ssr: false,
    loading: () => <DreamSceneLoader />,
  }
);

const VALID_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('result');
  const { result, reset } = useAssessmentStore();
  const [showAnalytics, setShowAnalytics] = useState(false);

  const typeParam = (params.type as string)?.toUpperCase() as MBTIType;
  const isValidType = VALID_TYPES.includes(typeParam);

  // Redirect if invalid type
  useEffect(() => {
    if (!isValidType) {
      router.push('/');
    }
  }, [isValidType, router]);

  if (!isValidType) {
    return <DreamSceneLoader />;
  }

  const displayType = result?.type || typeParam;
  const sceneConfig = SCENE_CONFIGS[displayType];

  // Get personality info from translations
  const personalityInfo = {
    name: t(`personalities.${displayType}.name`),
    nickname: t(`personalities.${displayType}.nickname`),
    description: t(`personalities.${displayType}.description`),
  };

  const handleRetake = () => {
    reset();
    router.push('/');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<DreamSceneLoader />}>
        <PersonalityScene type={displayType} />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="w-full p-4 flex justify-between items-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm"
          >
            ← {t('home')}
          </Link>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm"
          >
            {showAnalytics ? t('hideAnalytics') : t('showAnalytics')}
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8">
          {/* Result card */}
          <div className="w-full max-w-lg">
            <div className="text-center">
              {/* Type badge */}
              <div
                className="inline-block px-6 py-3 rounded-2xl mb-6"
                style={{ backgroundColor: `${sceneConfig.secondaryColor}40` }}
              >
                <span
                  className="text-5xl md:text-7xl font-bold tracking-wider"
                  style={{ color: sceneConfig.accentColor }}
                >
                  {displayType}
                </span>
              </div>

              {/* Name and nickname */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {personalityInfo.name}
              </h1>
              <p className="text-lg text-white/60 mb-6">{personalityInfo.nickname}</p>

              {/* Description */}
              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                {personalityInfo.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetake}
                  className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  {t('retakeButton')}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: t('shareTitle', { type: displayType, name: personalityInfo.name }),
                        text: personalityInfo.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert(t('linkCopied'));
                    }
                  }}
                  className="px-6 py-3 rounded-full text-white font-semibold transition-colors"
                  style={{ backgroundColor: sceneConfig.secondaryColor }}
                >
                  {t('shareButton')}
                </button>
              </div>
            </div>
          </div>

          {/* Analytics panel */}
          {showAnalytics && result && (
            <div className="w-full max-w-lg p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 animate-fadeIn">
              <TraitAnalytics result={result} />

              {/* Per-question insights (summary) */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">{t('summary.title')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-white/60 mb-1">{t('summary.questionsAnswered')}</div>
                    <div className="text-2xl font-bold text-white">{result.answers.length}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-white/60 mb-1">{t('summary.strongestPreference')}</div>
                    <div className="text-2xl font-bold text-white">
                      {t(`traits.${getStrongestTrait(result)}`)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full p-6 text-center space-y-4">
          {/* GitHub Star CTA */}
          <div className="inline-flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-white/70 text-sm">{t('githubCta')}</p>
            <a
              href="https://github.com/HermanL02/mbti-real-scene"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span className="font-medium">{t('starOnGithub')}</span>
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </a>
          </div>

          <p className="text-white/40 text-sm">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </main>
  );
}

// Returns the trait letter (E, I, S, N, T, F, J, P) for translation lookup
function getStrongestTrait(result: { scores: { EI: { percentage: number }; SN: { percentage: number }; TF: { percentage: number }; JP: { percentage: number } } }): string {
  const dimensions = [
    { key: 'EI', deviation: Math.abs(result.scores.EI.percentage - 50), labels: ['E', 'I'] },
    { key: 'SN', deviation: Math.abs(result.scores.SN.percentage - 50), labels: ['S', 'N'] },
    { key: 'TF', deviation: Math.abs(result.scores.TF.percentage - 50), labels: ['T', 'F'] },
    { key: 'JP', deviation: Math.abs(result.scores.JP.percentage - 50), labels: ['J', 'P'] },
  ];

  const strongest = dimensions.sort((a, b) => b.deviation - a.deviation)[0];
  const percentage = result.scores[strongest.key as keyof typeof result.scores].percentage;
  return percentage >= 50 ? strongest.labels[0] : strongest.labels[1];
}
