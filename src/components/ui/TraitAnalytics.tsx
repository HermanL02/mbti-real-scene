'use client';

import type { MBTIResult, DimensionScore } from '@/types';

interface TraitAnalyticsProps {
  result: MBTIResult;
}

const TRAIT_LABELS: Record<string, { first: string; second: string; description: string }> = {
  EI: {
    first: 'Extraverted',
    second: 'Introverted',
    description: 'Where you direct your energy',
  },
  SN: {
    first: 'Sensing',
    second: 'Intuitive',
    description: 'How you take in information',
  },
  TF: {
    first: 'Thinking',
    second: 'Feeling',
    description: 'How you make decisions',
  },
  JP: {
    first: 'Judging',
    second: 'Perceiving',
    description: 'How you approach the world',
  },
};

function TraitBar({ score }: { score: DimensionScore }) {
  const labels = TRAIT_LABELS[score.dimension];
  const percentage = score.percentage;
  const isFirstDominant = percentage >= 50;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${isFirstDominant ? 'text-white' : 'text-white/50'}`}>
          {labels.first}
        </span>
        <span className="text-xs text-white/40">{labels.description}</span>
        <span className={`text-sm font-medium ${!isFirstDominant ? 'text-white' : 'text-white/50'}`}>
          {labels.second}
        </span>
      </div>

      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
        {/* Left side (first trait) */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-l-full"
          style={{ width: `${percentage}%` }}
        />
        {/* Right side (second trait) */}
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-pink-500 to-pink-400 rounded-r-full"
          style={{ width: `${100 - percentage}%` }}
        />
        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/30" />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-white/60">{percentage}%</span>
        <span className="text-xs text-white/60">{100 - percentage}%</span>
      </div>
    </div>
  );
}

export function TraitAnalytics({ result }: TraitAnalyticsProps) {
  const dimensions = ['EI', 'SN', 'TF', 'JP'] as const;

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold text-white mb-4">Your Trait Breakdown</h3>
      {dimensions.map((dim) => (
        <TraitBar key={dim} score={result.scores[dim]} />
      ))}
    </div>
  );
}
