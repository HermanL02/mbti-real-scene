import type { UserProfile, OriginalQuestion, Scenario } from '@/types';
import { t } from '@/lib/i18n/server';

// Lazy initialization of OpenAI client
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  // Dynamic import to avoid build errors when key is not set
  const OpenAI = require('openai').default;
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateScenarios(
  userProfile: UserProfile,
  questions: OriginalQuestion[],
  locale: string = 'en'
): Promise<Scenario[]> {
  const openai = getOpenAIClient();

  if (!openai) {
    // Return fallback scenarios if no API key
    console.log('OpenAI not configured, using fallback scenarios');
    return questions.map((q) => generateFallbackScenario(q, userProfile, locale));
  }

  // Process ALL questions in parallel - 60 concurrent API calls
  // This is the fastest possible approach: total time = time for 1 question
  console.log(`Generating ${questions.length} scenarios in parallel (locale: ${locale})...`);
  const startTime = Date.now();

  try {
    // Run ALL questions in parallel for maximum speed
    const scenarioPromises = questions.map((question) =>
      generateSingleScenario(openai, userProfile, question, locale)
    );

    const scenarios = await Promise.all(scenarioPromises);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Generated ${scenarios.length} scenarios in ${duration}s`);

    return scenarios;
  } catch (error) {
    console.error('Error in parallel generation, falling back:', error);
    return questions.map((q) => generateFallbackScenario(q, userProfile, locale));
  }
}

// Generate a single scenario - called 60 times in parallel
async function generateSingleScenario(
  openai: any,
  userProfile: UserProfile,
  question: OriginalQuestion,
  locale: string
): Promise<Scenario> {
  // Get translations using the t() helper
  const ageDescription = t(locale, `scenarios.ageDescriptions.${userProfile.ageGroup}`);
  const occupationBase = t(locale, `scenarios.occupations.${userProfile.occupation}`);
  const occupationDescription = userProfile.occupationDetail
    ? t(locale, 'scenarios.occupationDetailFormat', { base: occupationBase, detail: userProfile.occupationDetail })
    : occupationBase;
  const interestsList = userProfile.interests.join(', ');
  const systemPrompt = t(locale, 'scenarios.systemPrompt');

  // Simplified prompt for single question
  const prompt = t(locale, 'scenarios.singlePromptTemplate', {
    ageDescription,
    occupationDescription,
    interests: interestsList,
    questionText: question.text,
    dimension: question.dimension,
    polarity: question.polarity,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500, // Only need ~200-300 tokens for 2 short scenarios
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    return {
      questionId: question.id,
      leftScenario: parsed.leftScenario,
      rightScenario: parsed.rightScenario,
      dimension: question.dimension,
      polarity: question.polarity,
    };
  } catch (error) {
    console.error(`Error generating scenario for ${question.id}:`, error);
    // Return fallback for this question
    return generateFallbackScenario(question, userProfile, locale);
  }
}

// Fallback scenarios when API fails or is not configured
function generateFallbackScenario(
  question: OriginalQuestion,
  userProfile: UserProfile,
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
