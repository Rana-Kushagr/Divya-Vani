import { NextRequest, NextResponse } from 'next/server';
import { DoubtQuerySchema } from '@/lib/validation';
import { solveSocraticDoubt } from '@/lib/aiSimulation';
import { wrapInPromptDelimiters } from '@/lib/sanitizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = DoubtQuerySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { studentQuery, chapterId, subjectId, attachedTabContext, inputMode } = validated.data;

    // Wrap query in XML delimiters for prompt injection defense
    const sanitizedPrompt = wrapInPromptDelimiters(studentQuery, attachedTabContext);

    // Generate Socratic pedagogical solution
    const solution = solveSocraticDoubt(
      studentQuery,
      `Chapter: ${chapterId} (${subjectId.toUpperCase()})`,
      attachedTabContext
    );

    return NextResponse.json({
      success: true,
      inputMode,
      solution,
      sanitizedPromptLength: sanitizedPrompt.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing doubt resolution' },
      { status: 500 }
    );
  }
}
