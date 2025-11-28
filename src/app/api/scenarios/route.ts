import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateScenarios } from '@/lib/openai/scenarios';
import { t } from '@/lib/i18n/server';
import { defaultLocale } from '@/i18n/config';
import type { GenerateScenariosRequest, Scenario, OriginalQuestion } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateScenariosRequest = await request.json();
    const { userProfile, questions } = body;

    // Get locale from cookie
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || defaultLocale;

    if (!userProfile || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return fallback scenarios if no API key
      console.warn('OpenAI API key not configured, using fallback scenarios');
      const fallbackScenarios = questions.map((q: OriginalQuestion) => generateFallbackScenario(q, userProfile, locale));
      return NextResponse.json({ scenarios: fallbackScenarios });
    }

    // Generate scenarios using OpenAI with locale
    const scenarios = await generateScenarios(userProfile, questions, locale);

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Error generating scenarios:', error);

    // Get locale for fallback
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || defaultLocale;

    // Return fallback on error
    try {
      const body = await request.clone().json();
      const { questions, userProfile } = body;
      const fallbackScenarios = questions.map((q: OriginalQuestion) => generateFallbackScenario(q, userProfile, locale));
      return NextResponse.json({ scenarios: fallbackScenarios });
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate scenarios' },
        { status: 500 }
      );
    }
  }
}

// Fallback scenario generator when OpenAI is unavailable
function generateFallbackScenario(
  question: OriginalQuestion,
  userProfile: { occupation: string },
  locale: string
): Scenario {
  const isStudent = userProfile.occupation === 'student';

  // Get context word from translations
  const contextKey = isStudent ? 'class' : 'meeting';
  const context = t(locale, `scenarios.context.${contextKey}`);

  // Get fallback scenarios from translations
  const fallbackLeft = t(locale, `scenarios.fallback.${question.dimension}.${question.polarity}.left`, { context });
  const fallbackRight = t(locale, `scenarios.fallback.${question.dimension}.${question.polarity}.right`, { context });

  return {
    questionId: question.id,
    leftScenario: fallbackLeft,
    rightScenario: fallbackRight,
    dimension: question.dimension,
    polarity: question.polarity,
  };
}
