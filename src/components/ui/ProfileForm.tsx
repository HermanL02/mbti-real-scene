'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAssessmentStore } from '@/store/assessment';
import type { UserProfile } from '@/types';

const AGE_GROUP_KEYS = ['teen', 'youngAdult', 'adult', 'mature'] as const;
const AGE_GROUP_VALUES: Record<typeof AGE_GROUP_KEYS[number], UserProfile['ageGroup']> = {
  teen: 'teen',
  youngAdult: 'young-adult',
  adult: 'adult',
  mature: 'mature',
};

const OCCUPATION_KEYS = ['student', 'professional', 'freelancer', 'other'] as const;

const INTEREST_KEYS = [
  'arts', 'technology', 'sports', 'socializing', 'nature', 'music',
  'reading', 'gaming', 'travel', 'cooking', 'business', 'science'
] as const;

const INTEREST_ICONS: Record<string, string> = {
  arts: '🎨',
  technology: '💻',
  sports: '⚽',
  socializing: '👥',
  nature: '🌿',
  music: '🎵',
  reading: '📚',
  gaming: '🎮',
  travel: '✈️',
  cooking: '🍳',
  business: '💼',
  science: '🔬',
};

export function ProfileForm() {
  const router = useRouter();
  const { setUserProfile, setIsGeneratingScenarios } = useAssessmentStore();
  const t = useTranslations('profile');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    ageGroup: undefined,
    occupation: undefined,
    occupationDetail: '',
    interests: [],
  });

  const handleAgeSelect = (ageGroup: UserProfile['ageGroup']) => {
    setFormData((prev) => ({ ...prev, ageGroup }));
    setStep(2);
  };

  const handleOccupationSelect = (occupation: UserProfile['occupation']) => {
    setFormData((prev) => ({ ...prev, occupation }));
  };

  const handleOccupationDetailChange = (detail: string) => {
    setFormData((prev) => ({ ...prev, occupationDetail: detail }));
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => {
      const interests = prev.interests || [];
      if (interests.includes(interestId)) {
        return { ...prev, interests: interests.filter((i) => i !== interestId) };
      }
      return { ...prev, interests: [...interests, interestId] };
    });
  };

  const handleSubmit = async () => {
    if (!formData.ageGroup || !formData.occupation) return;

    const profile: UserProfile = {
      ageGroup: formData.ageGroup,
      occupation: formData.occupation,
      occupationDetail: formData.occupationDetail || '',
      interests: formData.interests || [],
    };

    setUserProfile(profile);
    setIsGeneratingScenarios(true);
    router.push('/assessment');
  };

  const canProceedToStep3 = formData.occupation && formData.occupationDetail;
  const canSubmit = formData.interests && formData.interests.length >= 2;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              s === step
                ? 'bg-purple-500 scale-125'
                : s < step
                ? 'bg-purple-400'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Age */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{t('ageGroup.label')}</h2>
            <p className="text-purple-200/70">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGE_GROUP_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleAgeSelect(AGE_GROUP_VALUES[key])}
                className={`p-6 rounded-xl text-left transition-all border ${
                  formData.ageGroup === AGE_GROUP_VALUES[key]
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-lg font-semibold text-white mb-1">{t(`ageGroup.${key}`)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Occupation */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{t('occupation.label')}</h2>
            <p className="text-purple-200/70">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {OCCUPATION_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleOccupationSelect(key)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  formData.occupation === key
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-lg font-semibold text-white">{t(`occupation.${key}`)}</div>
              </button>
            ))}
          </div>

          {formData.occupation && (
            <div className="animate-fadeIn">
              <input
                type="text"
                placeholder={t('occupationDetail.placeholder')}
                value={formData.occupationDetail}
                onChange={(e) => handleOccupationDetailChange(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              {t('ageGroup.label').includes('年龄') ? '返回' : 'Back'}
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedToStep3}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                canProceedToStep3
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {t('ageGroup.label').includes('年龄') ? '继续' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{t('interests.label')}</h2>
            <p className="text-purple-200/70">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTEREST_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleInterestToggle(key)}
                className={`p-4 rounded-xl text-center transition-all border ${
                  formData.interests?.includes(key)
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-1">{INTEREST_ICONS[key]}</div>
                <div className="text-sm font-medium text-white">{t(`interests.${key}`)}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              {t('ageGroup.label').includes('年龄') ? '返回' : 'Back'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                canSubmit
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {t('continueButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
