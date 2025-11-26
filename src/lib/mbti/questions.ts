import type { OriginalQuestion, MBTIDimension } from '@/types';

// MBTI questions mapped to dimensions
// Based on standard MBTI assessment structure
// 60 questions total: 15 per dimension

export const MBTI_QUESTIONS: OriginalQuestion[] = [
  // E/I Dimension (15 questions)
  { id: 'ei-1', text: 'You regularly make new friends.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-2', text: 'You feel comfortable in large social gatherings.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-3', text: 'You prefer working in a team rather than alone.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-4', text: 'You enjoy being the center of attention.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-5', text: 'You often initiate conversations with strangers.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-6', text: 'You feel energized after spending time with others.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-7', text: 'You need time alone to recharge after social events.', dimension: 'EI', polarity: 'negative' },
  { id: 'ei-8', text: 'You prefer deep conversations with one person over group discussions.', dimension: 'EI', polarity: 'negative' },
  { id: 'ei-9', text: 'You think before you speak in most situations.', dimension: 'EI', polarity: 'negative' },
  { id: 'ei-10', text: 'You feel drained after extended social interactions.', dimension: 'EI', polarity: 'negative' },
  { id: 'ei-11', text: 'You enjoy attending parties and social events.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-12', text: 'You find it easy to approach new people.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-13', text: 'You prefer to observe rather than participate in group activities.', dimension: 'EI', polarity: 'negative' },
  { id: 'ei-14', text: 'You feel more productive when working with others.', dimension: 'EI', polarity: 'positive' },
  { id: 'ei-15', text: 'You enjoy spending weekends at home rather than going out.', dimension: 'EI', polarity: 'negative' },

  // S/N Dimension (15 questions)
  { id: 'sn-1', text: 'You focus on practical, concrete information rather than abstract theories.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-2', text: 'You prefer dealing with facts rather than possibilities.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-3', text: 'You trust your direct experience more than theoretical knowledge.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-4', text: 'You pay attention to details rather than the big picture.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-5', text: 'You prefer step-by-step instructions over general guidelines.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-6', text: 'You are more interested in what is happening now than what might happen.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-7', text: 'You enjoy exploring abstract concepts and theories.', dimension: 'SN', polarity: 'negative' },
  { id: 'sn-8', text: 'You often think about future possibilities and scenarios.', dimension: 'SN', polarity: 'negative' },
  { id: 'sn-9', text: 'You trust your intuition when making decisions.', dimension: 'SN', polarity: 'negative' },
  { id: 'sn-10', text: 'You prefer to understand the underlying meaning rather than surface details.', dimension: 'SN', polarity: 'negative' },
  { id: 'sn-11', text: 'You enjoy learning through hands-on experience.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-12', text: 'You focus on realistic and achievable goals.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-13', text: 'You are drawn to new and innovative ideas.', dimension: 'SN', polarity: 'negative' },
  { id: 'sn-14', text: 'You prefer tried-and-true methods over experimental approaches.', dimension: 'SN', polarity: 'positive' },
  { id: 'sn-15', text: 'You often see patterns and connections that others miss.', dimension: 'SN', polarity: 'negative' },

  // T/F Dimension (15 questions)
  { id: 'tf-1', text: 'You make decisions based on logic rather than emotions.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-2', text: 'You value truth over tact when giving feedback.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-3', text: 'You prefer objective analysis over personal considerations.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-4', text: 'You find it easy to remain detached in emotional situations.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-5', text: 'You believe fairness means treating everyone the same way.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-6', text: 'You prioritize efficiency over harmony in group settings.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-7', text: 'You consider how decisions will affect others emotionally.', dimension: 'TF', polarity: 'negative' },
  { id: 'tf-8', text: 'You value harmony and avoid conflict when possible.', dimension: 'TF', polarity: 'negative' },
  { id: 'tf-9', text: 'You make decisions based on your personal values.', dimension: 'TF', polarity: 'negative' },
  { id: 'tf-10', text: 'You are sensitive to the emotional atmosphere in a room.', dimension: 'TF', polarity: 'negative' },
  { id: 'tf-11', text: 'You prefer to analyze problems objectively.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-12', text: 'You can easily identify logical inconsistencies.', dimension: 'TF', polarity: 'positive' },
  { id: 'tf-13', text: 'You prioritize being kind over being right.', dimension: 'TF', polarity: 'negative' },
  { id: 'tf-14', text: 'You find it difficult to criticize others even when necessary.', dimension: 'TF', polarity: 'negative' },
  { id: 'tf-15', text: 'You believe emotions should guide important life decisions.', dimension: 'TF', polarity: 'negative' },

  // J/P Dimension (15 questions)
  { id: 'jp-1', text: 'You prefer having a detailed plan before starting a project.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-2', text: 'You feel satisfied when tasks are completed and organized.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-3', text: 'You prefer to make decisions quickly rather than keep options open.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-4', text: 'You like having a structured daily routine.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-5', text: 'You feel uncomfortable with last-minute changes to plans.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-6', text: 'You prefer to finish one project before starting another.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-7', text: 'You enjoy spontaneous activities and surprises.', dimension: 'JP', polarity: 'negative' },
  { id: 'jp-8', text: 'You prefer to keep your options open rather than commit early.', dimension: 'JP', polarity: 'negative' },
  { id: 'jp-9', text: 'You adapt easily to changing circumstances.', dimension: 'JP', polarity: 'negative' },
  { id: 'jp-10', text: 'You often start new projects before finishing old ones.', dimension: 'JP', polarity: 'negative' },
  { id: 'jp-11', text: 'You prefer deadlines and clear timelines.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-12', text: 'You feel stressed when things are disorganized.', dimension: 'JP', polarity: 'positive' },
  { id: 'jp-13', text: 'You enjoy exploring different approaches without committing.', dimension: 'JP', polarity: 'negative' },
  { id: 'jp-14', text: 'You prefer flexible schedules over fixed ones.', dimension: 'JP', polarity: 'negative' },
  { id: 'jp-15', text: 'You feel energized by last-minute deadlines.', dimension: 'JP', polarity: 'negative' },
];

// Helper function to get questions by dimension
export function getQuestionsByDimension(dimension: MBTIDimension): OriginalQuestion[] {
  return MBTI_QUESTIONS.filter((q) => q.dimension === dimension);
}

// Shuffle questions while maintaining dimension balance
export function shuffleQuestions(questions: OriginalQuestion[]): OriginalQuestion[] {
  // Group by dimension
  const byDimension: Record<MBTIDimension, OriginalQuestion[]> = {
    EI: [],
    SN: [],
    TF: [],
    JP: [],
  };

  questions.forEach((q) => {
    byDimension[q.dimension].push(q);
  });

  // Shuffle each dimension group
  Object.keys(byDimension).forEach((key) => {
    const dimension = key as MBTIDimension;
    byDimension[dimension] = byDimension[dimension].sort(() => Math.random() - 0.5);
  });

  // Interleave questions from different dimensions
  const result: OriginalQuestion[] = [];
  const maxLength = Math.max(
    byDimension.EI.length,
    byDimension.SN.length,
    byDimension.TF.length,
    byDimension.JP.length
  );

  for (let i = 0; i < maxLength; i++) {
    if (byDimension.EI[i]) result.push(byDimension.EI[i]);
    if (byDimension.SN[i]) result.push(byDimension.SN[i]);
    if (byDimension.TF[i]) result.push(byDimension.TF[i]);
    if (byDimension.JP[i]) result.push(byDimension.JP[i]);
  }

  return result;
}
