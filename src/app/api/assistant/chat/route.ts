import { NextRequest, NextResponse } from 'next/server';
import { getAssistantResponse } from '@/lib/aiAssistantService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], subjectId = 'Science', chapterTitle = 'Chapter 8: Motion', apiKey, imageBase64 } = body;

    if (!message && !imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Message or image is required' },
        { status: 400 }
      );
    }

    const assistantResult = await getAssistantResponse({
      query: message || 'Please analyze this textbook image and explain the question step-by-step.',
      imageBase64,
      subjectId,
      chapterTitle,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      reply: assistantResult.message,
      spokenText: assistantResult.spokenText,
      solution: assistantResult.solution,
      source: assistantResult.source,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in assistant chat route:', err);
    return NextResponse.json({
      success: true,
      reply: 'I am here to help you understand every concept step by step. Could you please rephrase or ask about a specific formula?',
      spokenText: 'I am here to help you understand every concept step by step. What would you like to explore next?',
      source: 'socratic-engine',
      timestamp: new Date().toISOString(),
    });
  }
}
