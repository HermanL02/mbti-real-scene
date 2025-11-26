import { NextRequest, NextResponse } from 'next/server';
import { calculateMBTIResult } from '@/lib/mbti/scoring';
import type { CalculateResultRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CalculateResultRequest = await request.json();
    const { answers } = body;

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // Calculate MBTI result using local algorithm
    const result = calculateMBTIResult(answers);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error calculating results:', error);
    return NextResponse.json(
      { error: 'Failed to calculate results' },
      { status: 500 }
    );
  }
}
