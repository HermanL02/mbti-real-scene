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

  // Process questions in PARALLEL batches for speed
  const batchSize = 10;
  const batches: OriginalQuestion[][] = [];

  for (let i = 0; i < questions.length; i += batchSize) {
    batches.push(questions.slice(i, i + batchSize));
  }

  console.log(`Generating scenarios in ${batches.length} parallel batches (locale: ${locale})...`);
  const startTime = Date.now();

  try {
    // Run all batches in parallel
    const batchPromises = batches.map((batch) =>
      generateScenarioBatch(openai, userProfile, batch, locale)
    );

    const batchResults = await Promise.all(batchPromises);

    // Flatten results
    const scenarios = batchResults.flat();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Generated ${scenarios.length} scenarios in ${duration}s`);

    return scenarios;
  } catch (error) {
    console.error('Error in parallel generation, falling back:', error);
    return questions.map((q) => generateFallbackScenario(q, userProfile, locale));
  }
}

async function generateScenarioBatch(
  openai: any,
  userProfile: UserProfile,
  questions: OriginalQuestion[],
  locale: string
): Promise<Scenario[]> {
  // Get translations using the t() helper
  const ageDescription = t(locale, `scenarios.ageDescriptions.${userProfile.ageGroup}`);
  const occupationBase = t(locale, `scenarios.occupations.${userProfile.occupation}`);
  const occupationDescription = userProfile.occupationDetail
    ? t(locale, 'scenarios.occupationDetailFormat', { base: occupationBase, detail: userProfile.occupationDetail })
    : occupationBase;
  const interestsList = userProfile.interests.join(', ');
  const systemPrompt = t(locale, 'scenarios.systemPrompt');

  const questionsForPrompt = questions.map((q) => ({
    id: q.id,
    text: q.text,
    dimension: q.dimension,
    polarity: q.polarity,
  }));

  // Use the prompt template from translations
  const prompt = t(locale, 'scenarios.promptTemplate', {
    ageDescription,
    occupationDescription,
    interests: interestsList,
    questions: JSON.stringify(questionsForPrompt),
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Much cheaper than gpt-4-turbo (~20x cheaper)
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
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    const scenarioArray = parsed.scenarios || parsed;

    return scenarioArray.map((s: { questionId: string; leftScenario: string; rightScenario: string }) => {
      const question = questions.find((q) => q.id === s.questionId);
      return {
        questionId: s.questionId,
        leftScenario: s.leftScenario,
        rightScenario: s.rightScenario,
        dimension: question?.dimension || 'EI',
        polarity: question?.polarity || 'positive',
      };
    });
  } catch (error) {
    console.error('Batch generation error:', error);
    // Return fallback for this batch
    return questions.map((q) => generateFallbackScenario(q, userProfile, locale));
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
