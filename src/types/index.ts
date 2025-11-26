// User Profile Types
export interface UserProfile {
  ageGroup: 'teen' | 'young-adult' | 'adult' | 'mature';
  occupation: 'student' | 'professional' | 'freelancer' | 'other';
  occupationDetail: string;
  interests: string[];
}

// MBTI Dimension Types
export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP';
export type MBTITrait = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// Question Types
export interface OriginalQuestion {
  id: string;
  text: string;
  dimension: MBTIDimension;
  polarity: 'positive' | 'negative'; // positive = agree favors first trait (E,S,T,J)
}

export interface Scenario {
  questionId: string;
  leftScenario: string;  // -3 side
  rightScenario: string; // +3 side
  dimension: MBTIDimension;
  polarity: 'positive' | 'negative';
}

// Answer Types
export interface Answer {
  questionId: string;
  dimension: MBTIDimension;
  value: number; // -3 to +3
  polarity: 'positive' | 'negative';
}

// Result Types
export interface DimensionScore {
  dimension: MBTIDimension;
  firstTrait: MBTITrait;
  secondTrait: MBTITrait;
  firstScore: number;
  secondScore: number;
  percentage: number; // 0-100, percentage toward first trait
}

export interface MBTIResult {
  type: MBTIType;
  scores: {
    EI: DimensionScore;
    SN: DimensionScore;
    TF: DimensionScore;
    JP: DimensionScore;
  };
  answers: Answer[];
}

// Personality Type Metadata
export interface PersonalityTypeInfo {
  type: MBTIType;
  name: string;
  nickname: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  themeColor: string;
}

// 16Personalities API Types (for verification)
export interface VerificationSubmission {
  id: string;
  value: number;
}

export interface VerificationResult {
  niceName: string;
  personality: string;
  variant: string;
  role: string;
  strategy: string;
  avatarSrc: string;
  avatarAlt: string;
  avatarSrcStatic: string;
  traits: VerificationTrait[];
  profileUrl: string;
}

export interface VerificationTrait {
  key: string;
  label: string;
  color: string;
  score: number;
  pct: number;
  trait: string;
  link: string;
  reverse: boolean;
  titles: string[];
  description: string;
  snippet: string;
  imageAlt: string;
  imageSrc: string;
}

// Store Types
export interface AssessmentState {
  // User data
  userProfile: UserProfile | null;

  // Assessment data
  scenarios: Scenario[];
  answers: Answer[];
  currentQuestionIndex: number;

  // Result
  result: MBTIResult | null;
  verificationResult: VerificationResult | null;

  // UI State
  isLoading: boolean;
  isGeneratingScenarios: boolean;

  // Actions
  setUserProfile: (profile: UserProfile) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  addAnswer: (answer: Answer) => void;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setResult: (result: MBTIResult) => void;
  setVerificationResult: (result: VerificationResult) => void;
  setIsLoading: (loading: boolean) => void;
  setIsGeneratingScenarios: (generating: boolean) => void;
  reset: () => void;
}

// API Request/Response Types
export interface GenerateScenariosRequest {
  userProfile: UserProfile;
  questions: OriginalQuestion[];
}

export interface GenerateScenariosResponse {
  scenarios: Scenario[];
}

export interface CalculateResultRequest {
  answers: Answer[];
}

export interface CalculateResultResponse {
  result: MBTIResult;
}
