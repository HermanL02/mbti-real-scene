import { NextResponse } from 'next/server';
import { MBTI_QUESTIONS, shuffleQuestions } from '@/lib/mbti/questions';

export async function GET() {
  // Return shuffled questions
  const questions = shuffleQuestions(MBTI_QUESTIONS);
  return NextResponse.json({ questions });
}
