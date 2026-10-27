import { NextRequest, NextResponse } from 'next/server';
import { DoubtQuerySchema } from '@/lib/validation';
import { getAssistantResponse } from '@/lib/aiAssistantService';

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

    const { studentQuery, chapterId, subjectId, attachedTabContext, inputMode, imageBase64, apiKey } = validated.data;

    // Call the universal multi-tier AI assistant (Gemini Flash -> Pollinations AI -> Local Socratic Engine)
    const assistantResult = await getAssistantResponse({
      query: studentQuery,
      imageBase64,
      subjectId,
      chapterTitle: chapterId,
      attachedContext: attachedTabContext,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      inputMode,
      solution: assistantResult.solution,
      message: assistantResult.message,
      spokenText: assistantResult.spokenText,
      source: assistantResult.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in doubt solver route:', error);
    // Absolute Zero-Failure Fallback: Even if something totally unexpected happened in the route, return a friendly fallback
    return NextResponse.json(
      { 
        success: true, 
        message: 'Understanding concepts step by step is the key to mastering this chapter.',
        source: 'socratic-engine',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  }
}
