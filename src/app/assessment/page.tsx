'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useAssessmentStore } from '@/store/assessment';
import { ScenarioSlider, ProgressBar } from '@/components/ui';
import { DreamSceneLoader } from '@/components/three';
import { MBTI_QUESTIONS, shuffleQuestions } from '@/lib/mbti/questions';
import type { Scenario, Answer } from '@/types';

const DreamScene = dynamic(
  () => import('@/components/three/DreamScene').then((mod) => mod.DreamScene),
  {
    ssr: false,
    loading: () => <DreamSceneLoader />,
  }
);

export default function AssessmentPage() {
  const router = useRouter();
  const t = useTranslations('assessment');
  const tc = useTranslations('common');
  const {
    userProfile,
    scenarios,
    setScenarios,
    answers,
    addAnswer,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isGeneratingScenarios,
    setIsGeneratingScenarios,
    setResult,
  } = useAssessmentStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Generate scenarios on mount
  useEffect(() => {
    const generateScenarios = async () => {
      if (!userProfile) {
        router.push('/profile');
        return;
      }

      if (scenarios.length > 0 && !isGeneratingScenarios) {
        setIsLoading(false);
        return;
      }

      try {
        // Shuffle questions for variety
        const shuffledQuestions = shuffleQuestions(MBTI_QUESTIONS);

        // Loading progress for parallel AI generation (~10-15 seconds)
        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev < 50) return prev + 3;        // Fast initial progress
            if (prev < 75) return prev + 1.5;      // Medium speed
            if (prev < 90) return prev + 0.5;      // Slower near end
            return prev;                            // Stop at 90%
          });
        }, 200);

        const response = await fetch('/api/scenarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userProfile,
            questions: shuffledQuestions,
          }),
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          throw new Error('Failed to generate scenarios');
        }

        const data = await response.json();
        setScenarios(data.scenarios);
        setLoadingProgress(100);

        setTimeout(() => {
          setIsLoading(false);
          setIsGeneratingScenarios(false);
        }, 500);
      } catch (err) {
        setError('Failed to generate scenarios. Please try again.');
        console.error(err);
      }
    };

    generateScenarios();
  }, [userProfile, scenarios.length, isGeneratingScenarios, router, setScenarios, setIsGeneratingScenarios]);

  const handleAnswer = useCallback(
    (value: number) => {
      const currentScenario = scenarios[currentQuestionIndex];
      if (!currentScenario) return;

      const answer: Answer = {
        questionId: currentScenario.questionId,
        dimension: currentScenario.dimension,
        value,
        polarity: currentScenario.polarity,
      };

      addAnswer(answer);

      // Auto-advance to next question after a brief delay
      setTimeout(() => {
        if (currentQuestionIndex < scenarios.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Calculate and show results
          calculateResults();
        }
      }, 300);
    },
    [currentQuestionIndex, scenarios, addAnswer, setCurrentQuestionIndex]
  );

  const calculateResults = async () => {
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate results');
      }

      const data = await response.json();
      setResult(data.result);
      router.push(`/result/${data.result.type}`);
    } catch (err) {
      setError('Failed to calculate results. Please try again.');
      console.error(err);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentScenario = scenarios[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentScenario?.questionId);

  // Loading state
  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Suspense fallback={<DreamSceneLoader />}>
          <DreamScene intensity="low" colorScheme="purple" />
        </Suspense>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"
                  style={{ animationDuration: '1s' }}
                />
                <div className="absolute inset-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{loadingProgress}%</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              {t('loading.title')}
            </h2>
            <p className="text-purple-200/70 mb-6">
              {t('loading.description')}
            </p>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Suspense fallback={<DreamSceneLoader />}>
          <DreamScene intensity="low" colorScheme="purple" />
        </Suspense>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{tc('error')}</h2>
            <p className="text-purple-200/70 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              {tc('tryAgain')}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<DreamSceneLoader />}>
        <DreamScene intensity="medium" colorScheme="purple" />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 py-8">
        {/* Header with progress */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <ProgressBar current={currentQuestionIndex + 1} total={scenarios.length} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {currentScenario && (
            <div className="w-full animate-fadeIn">
              <div className="text-center mb-8">
                <p className="text-purple-200/60 text-sm uppercase tracking-wider mb-2">
                  {t('question.prompt')}
                </p>
              </div>

              <ScenarioSlider
                leftScenario={currentScenario.leftScenario}
                rightScenario={currentScenario.rightScenario}
                onValueChange={handleAnswer}
                initialValue={currentAnswer?.value || 0}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="w-full max-w-4xl mx-auto mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-full border transition-colors ${
              currentQuestionIndex === 0
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            ← {tc('previous')}
          </button>

          <div className="text-white/40 text-sm">
            {t('progress.answered', { count: answers.length, total: scenarios.length })}
          </div>

          {currentQuestionIndex === scenarios.length - 1 && answers.length === scenarios.length && (
            <button
              onClick={calculateResults}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              {tc('seeResults')} →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
