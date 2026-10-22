import { NextRequest, NextResponse } from 'next/server';
import { SelectClassSubjectSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SelectClassSubjectSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { classLevel, subject } = validated.data;
    const normalizedClass = classLevel.toLowerCase().replace(/\s+/g, '-');
    const normalizedSubject = subject.toLowerCase().replace(/_/g, '-');

    const redirectUrl = `/learn/${normalizedClass}/${normalizedSubject}`;

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      classLevel: normalizedClass,
      subject: normalizedSubject,
      message: 'Class and subject preference saved successfully',
    });

    // Save preferences in cookie for fast SSR routing
    response.cookies.set({
      name: 'divyavani_class',
      value: normalizedClass,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set({
      name: 'divyavani_subject',
      value: normalizedSubject,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
