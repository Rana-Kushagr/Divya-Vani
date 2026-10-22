import { NextRequest, NextResponse } from 'next/server';
import { getChaptersForClassAndSubject, getTabsForChapter } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classParam = searchParams.get('class') || 'class-9';
    const subjectParam = searchParams.get('subject') || 'science';

    const normalizedClass = classParam.toLowerCase().replace(/\s+/g, '-');
    const normalizedSubject = subjectParam.toLowerCase().replace(/_/g, '-');

    const chapters = getChaptersForClassAndSubject(normalizedClass, normalizedSubject);

    const documents = chapters.map((ch) => ({
      chapterId: ch.id,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      description: ch.description,
      formulaCount: ch.formulaCount,
      tabs: getTabsForChapter(ch, normalizedClass),
    }));

    return NextResponse.json({
      success: true,
      classLevel: normalizedClass,
      subject: normalizedSubject,
      documents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch chapter documents' },
      { status: 500 }
    );
  }
}
