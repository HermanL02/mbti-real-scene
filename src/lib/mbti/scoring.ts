import type {
  Answer,
  MBTIResult,
  MBTIType,
  MBTIDimension,
  DimensionScore,
} from '@/types';

// Calculate MBTI result from answers
export function calculateMBTIResult(answers: Answer[]): MBTIResult {
  // Initialize scores for each trait
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // Process each answer
  answers.forEach((answer) => {
    const { dimension, value, polarity } = answer;

    // Map dimension to trait pair
    const traitMap: Record<MBTIDimension, [keyof typeof scores, keyof typeof scores]> = {
      EI: ['E', 'I'],
      SN: ['S', 'N'],
      TF: ['T', 'F'],
      JP: ['J', 'P'],
    };

    const [firstTrait, secondTrait] = traitMap[dimension];

    // Calculate score contribution
    // Positive polarity: positive value adds to first trait (E, S, T, J)
    // Negative polarity: positive value adds to second trait (I, N, F, P)
    if (polarity === 'positive') {
      if (value > 0) {
        scores[firstTrait] += value;
      } else {
        scores[secondTrait] += Math.abs(value);
      }
    } else {
      // Negative polarity - reversed
      if (value > 0) {
        scores[secondTrait] += value;
      } else {
        scores[firstTrait] += Math.abs(value);
      }
    }
  });

  // Calculate dimension scores with percentages
  const dimensionScores: Record<MBTIDimension, DimensionScore> = {
    EI: calculateDimensionScore('EI', 'E', 'I', scores.E, scores.I),
    SN: calculateDimensionScore('SN', 'S', 'N', scores.S, scores.N),
    TF: calculateDimensionScore('TF', 'T', 'F', scores.T, scores.F),
    JP: calculateDimensionScore('JP', 'J', 'P', scores.J, scores.P),
  };

  // Determine the 4-letter type
  const type = [
    dimensionScores.EI.percentage >= 50 ? 'E' : 'I',
    dimensionScores.SN.percentage >= 50 ? 'S' : 'N',
    dimensionScores.TF.percentage >= 50 ? 'T' : 'F',
    dimensionScores.JP.percentage >= 50 ? 'J' : 'P',
  ].join('') as MBTIType;

  return {
    type,
    scores: dimensionScores,
    answers,
  };
}

function calculateDimensionScore(
  dimension: MBTIDimension,
  firstTrait: 'E' | 'S' | 'T' | 'J',
  secondTrait: 'I' | 'N' | 'F' | 'P',
  firstScore: number,
  secondScore: number
): DimensionScore {
  const total = firstScore + secondScore;
  const percentage = total > 0 ? Math.round((firstScore / total) * 100) : 50;

  return {
    dimension,
    firstTrait,
    secondTrait,
    firstScore,
    secondScore,
    percentage,
  };
}

// Get trait strength description
export function getTraitStrength(percentage: number): string {
  const deviation = Math.abs(percentage - 50);
  if (deviation <= 10) return 'Slight';
  if (deviation <= 25) return 'Moderate';
  if (deviation <= 40) return 'Clear';
  return 'Strong';
}

// Get detailed analysis for a specific answer
export function getAnswerInsight(
  answer: Answer,
  questionText: string
): string {
  const { dimension, value, polarity } = answer;
  const strength = Math.abs(value);

  const traitNames: Record<MBTIDimension, [string, string]> = {
    EI: ['Extraversion', 'Introversion'],
    SN: ['Sensing', 'Intuition'],
    TF: ['Thinking', 'Feeling'],
    JP: ['Judging', 'Perceiving'],
  };

  const [firstTrait, secondTrait] = traitNames[dimension];

  // Determine which trait this answer favors
  let favoredTrait: string;
  if (polarity === 'positive') {
    favoredTrait = value > 0 ? firstTrait : secondTrait;
  } else {
    favoredTrait = value > 0 ? secondTrait : firstTrait;
  }

  const strengthWord = strength === 3 ? 'strongly' : strength === 2 ? 'moderately' : 'slightly';

  return `This choice ${strengthWord} indicates ${favoredTrait} preference.`;
}

// Personality type metadata
export const PERSONALITY_INFO: Record<MBTIType, { name: string; nickname: string; description: string }> = {
  INTJ: {
    name: 'Architect',
    nickname: 'The Mastermind',
    description: 'Imaginative and strategic thinkers with a plan for everything.',
  },
  INTP: {
    name: 'Logician',
    nickname: 'The Thinker',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
  },
  ENTJ: {
    name: 'Commander',
    nickname: 'The Executive',
    description: 'Bold, imaginative and strong-willed leaders who find or make a way.',
  },
  ENTP: {
    name: 'Debater',
    nickname: 'The Visionary',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
  },
  INFJ: {
    name: 'Advocate',
    nickname: 'The Counselor',
    description: 'Quiet and mystical, yet inspiring and tireless idealists.',
  },
  INFP: {
    name: 'Mediator',
    nickname: 'The Healer',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause.',
  },
  ENFJ: {
    name: 'Protagonist',
    nickname: 'The Teacher',
    description: 'Charismatic and inspiring leaders who mesmerize their listeners.',
  },
  ENFP: {
    name: 'Campaigner',
    nickname: 'The Champion',
    description: 'Enthusiastic, creative and sociable free spirits who find reason to smile.',
  },
  ISTJ: {
    name: 'Logistician',
    nickname: 'The Inspector',
    description: 'Practical and fact-minded individuals whose reliability cannot be doubted.',
  },
  ISFJ: {
    name: 'Defender',
    nickname: 'The Protector',
    description: 'Very dedicated and warm protectors, always ready to defend loved ones.',
  },
  ESTJ: {
    name: 'Executive',
    nickname: 'The Supervisor',
    description: 'Excellent administrators, unsurpassed at managing things or people.',
  },
  ESFJ: {
    name: 'Consul',
    nickname: 'The Provider',
    description: 'Extraordinarily caring, social and popular people, always eager to help.',
  },
  ISTP: {
    name: 'Virtuoso',
    nickname: 'The Craftsman',
    description: 'Bold and practical experimenters, masters of all kinds of tools.',
  },
  ISFP: {
    name: 'Adventurer',
    nickname: 'The Composer',
    description: 'Flexible and charming artists, always ready to explore something new.',
  },
  ESTP: {
    name: 'Entrepreneur',
    nickname: 'The Dynamo',
    description: 'Smart, energetic and perceptive people who truly enjoy living on the edge.',
  },
  ESFP: {
    name: 'Entertainer',
    nickname: 'The Performer',
    description: 'Spontaneous, energetic and enthusiastic people who make life exciting.',
  },
};
