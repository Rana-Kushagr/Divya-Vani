import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/lib/validation';
import { generateUUID } from '@/lib/sanitizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { authMode, email, phone } = validated.data;

    // Generate or retrieve mock student user profile
    const studentUser = {
      id: generateUUID(),
      email: email || (phone ? `student_${phone.slice(-4)}@divyavani.edu` : 'student.demo@divyavani.edu'),
      fullName: email ? email.split('@')[0].replace(/[._]/g, ' ') : 'Vanshika & Divyanshi (Class 9)',
      role: 'STUDENT',
      selectedClass: 'class-9',
      selectedSubject: 'science',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sessionToken = generateUUID();

    const response = NextResponse.json({
      success: true,
      user: studentUser,
      sessionToken,
      message: 'Authentication successful',
    });

    // Set secure session cookie
    response.cookies.set({
      name: 'divyavani_session',
      value: JSON.stringify({ token: sessionToken, userId: studentUser.id, email: studentUser.email }),
      httpOnly: false, // Accessible to client-side hydration for rapid switching
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
