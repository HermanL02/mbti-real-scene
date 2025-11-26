import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AssessmentState,
  UserProfile,
  Scenario,
  Answer,
  MBTIResult,
  VerificationResult,
} from '@/types';

const initialState = {
  userProfile: null,
  scenarios: [],
  answers: [],
  currentQuestionIndex: 0,
  result: null,
  verificationResult: null,
  isLoading: false,
  isGeneratingScenarios: false,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserProfile: (profile: UserProfile) =>
        set({ userProfile: profile }),

      setScenarios: (scenarios: Scenario[]) =>
        set({ scenarios }),

      addAnswer: (answer: Answer) =>
        set((state) => {
          // Replace existing answer for this question or add new
          const existingIndex = state.answers.findIndex(
            (a) => a.questionId === answer.questionId
          );
          if (existingIndex >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existingIndex] = answer;
            return { answers: newAnswers };
          }
          return { answers: [...state.answers, answer] };
        }),

      setCurrentQuestionIndex: (index: number) =>
        set({ currentQuestionIndex: index }),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            state.scenarios.length - 1
          ),
        })),

      previousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      setResult: (result: MBTIResult) =>
        set({ result }),

      setVerificationResult: (verificationResult: VerificationResult) =>
        set({ verificationResult }),

      setIsLoading: (isLoading: boolean) =>
        set({ isLoading }),

      setIsGeneratingScenarios: (isGeneratingScenarios: boolean) =>
        set({ isGeneratingScenarios }),

      reset: () =>
        set(initialState),
    }),
    {
      name: 'mbti-assessment-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        scenarios: state.scenarios,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        result: state.result,
      }),
    }
  )
);
