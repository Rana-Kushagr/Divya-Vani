import { SubjectMeta, ChapterMeta, Chapter, DocumentTab, WeakTopic, CohortAnalytics } from './types';

export interface ClassLevel {
  id: string; // e.g. "class-9"
  name: string; // e.g. "Class 9"
  gradeNumber: number;
  stage: 'Middle School' | 'Secondary' | 'Senior Secondary';
  badge: string;
  description: string;
}

export const CLASS_LEVELS: ClassLevel[] = [
  { id: 'class-6', name: 'Class 6', gradeNumber: 6, stage: 'Middle School', badge: 'Foundation', description: 'Curiosity, Fundamentals & Science Habits' },
  { id: 'class-7', name: 'Class 7', gradeNumber: 7, stage: 'Middle School', badge: 'Foundation', description: 'Core Exploration & Mathematical Thinking' },
  { id: 'class-8', name: 'Class 8', gradeNumber: 8, stage: 'Middle School', badge: 'Pre-Board', description: 'Scientific Inquiry & Algebraic Foundations' },
  { id: 'class-9', name: 'Class 9', gradeNumber: 9, stage: 'Secondary', badge: 'Board Prep', description: 'Concept Mastery, Kinematics & CBSE Framework' },
  { id: 'class-10', name: 'Class 10', gradeNumber: 10, stage: 'Secondary', badge: 'Board Aspirant', description: 'CBSE Class X Board Milestone & PYQs' },
  { id: 'class-11', name: 'Class 11', gradeNumber: 11, stage: 'Senior Secondary', badge: 'Senior', description: 'In-Depth Analytical Physics, Calculus & Chemistry' },
  { id: 'class-12', name: 'Class 12', gradeNumber: 12, stage: 'Senior Secondary', badge: 'Board & Entrance', description: 'CBSE Class XII Boards & Competitive Mastery' },
];

export const CLASSES = ['Class 9-H', 'Class 10', 'Class 11', 'Class 12'] as const;

export const SUBJECTS: SubjectMeta[] = [
  { id: 'science', code: 'SCIENCE', name: 'Science', hindiName: 'विज्ञान', icon: '⚛️', color: '#6D28D9', defaultChapter: 'sci-ch1', defaultChapterId: 'sci-ch1' },
  { id: 'social_science', code: 'SST', name: 'Social Science (SST)', hindiName: 'सामाजिक विज्ञान', icon: '🌍', color: '#F59E0B', defaultChapter: 'sst-ch1', defaultChapterId: 'sst-ch1' },
  { id: 'maths', code: 'MATHEMATICS', name: 'Mathematics', hindiName: 'गणित', icon: '📐', color: '#10B981', defaultChapter: 'math-ch1', defaultChapterId: 'math-ch1' },
  { id: 'english', code: 'ENGLISH', name: 'English', hindiName: 'अंग्रेज़ी', icon: '📖', color: '#3B82F6', defaultChapter: 'eng-ch1', defaultChapterId: 'eng-ch1' },
  { id: 'hindi', code: 'HINDI', name: 'Hindi', hindiName: 'हिन्दी', icon: 'अ', color: '#EC4899', defaultChapter: 'hin-ch1', defaultChapterId: 'hin-ch1' },
  { id: 'sanskrit', code: 'SANSKRIT', name: 'Sanskrit', hindiName: 'संस्कृत', icon: 'ॐ', color: '#8B5CF6', defaultChapter: 'san-ch1', defaultChapterId: 'san-ch1' },
];

// Dedicated Class 9 Chapters Mapped with Exact Materials (Notes, Mindmaps, Animations)
export const CHAPTERS_BY_SUBJECT: Record<string, ChapterMeta[]> = {
  SCIENCE: [
    {
      id: 'sci-ch1',
      number: 1,
      title: 'Matter in Our Surroundings',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_Science_Ch1_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_Science_ch1_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch1.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch4',
      number: 4,
      title: 'Structure of the Atom',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_Science_Ch4_Notes.pdf',
      animationVideoUrl: '/materials/science/9_science_ch4.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch5',
      number: 5,
      title: 'The Fundamental Unit of Life',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_science_ch5_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_science_ch5_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch5.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch6',
      number: 6,
      title: 'Tissues',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_Science_Ch6_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_science_ch6_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch6.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch7',
      number: 7,
      title: 'Diversity in Living Organisms',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_Science_Ch7_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_Science_ch7_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch7_p1.mp4',
      animationVideoUrl2: '/materials/science/9_science_ch7_p2.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch8',
      number: 8,
      title: 'Motion',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_science_ch8_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_science_ch8_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch8.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch9',
      number: 9,
      title: 'Force and Laws of Motion',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_science_ch9_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_science_ch9_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch9.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch10',
      number: 10,
      title: 'Gravitation',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_Science_Ch10_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_Science_ch10_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch10_p1.mp4',
      animationVideoUrl2: '/materials/science/9_science_ch10_p2.mp4',
      hasExtraMaterials: true,
    },
    {
      id: 'sci-ch13',
      number: 13,
      title: 'Why Do We Fall Ill?',
      subjectCode: 'SCIENCE',
      notesPdfUrl: '/materials/science/9_science_ch13_Notes.pdf',
      mindMapPdfUrl: '/materials/science/9_science_ch13_MindMaps.pdf',
      animationVideoUrl: '/materials/science/9_science_ch13.mp4',
      hasExtraMaterials: true,
    },
  ],
  SST: [
    {
      id: 'sst-ch1',
      number: 1,
      title: 'The French Revolution (History)',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch1_Important_Questions.pdf',
      mindMapPdfUrl: '/materials/sst/9_sst_Ch1_MindMaps.pdf',
      hasExtraMaterials: true,
    },
    {
      id: 'sst-ch2',
      number: 2,
      title: 'Socialism in Europe & Russian Revolution',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch2_Important_Questions.pdf',
      mindMapPdfUrl: '/materials/sst/9_sst_Ch2_MindMaps.pdf',
      hasExtraMaterials: true,
    },
    {
      id: 'sst-ch3',
      number: 3,
      title: 'Nazism and the Rise of Hitler',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch3_Important_Questions.pdf',
      mindMapPdfUrl: '/materials/sst/9_sst_ch3_MindMaps.pdf',
      hasExtraMaterials: true,
    },
    {
      id: 'sst-ch4',
      number: 4,
      title: 'Forest Society and Colonialism',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch4_Important_Questions.pdf',
      mindMapPdfUrl: '/materials/sst/9_sst_ch4_MindMaps.pdf',
      hasExtraMaterials: true,
    },
    {
      id: 'sst-ch5',
      number: 5,
      title: 'Pastoralists in the Modern World',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch5_Important_Questions.pdf',
      hasExtraMaterials: false,
    },
    {
      id: 'sst-ch6',
      number: 6,
      title: 'India: Size and Location (Geography)',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_ch6_Important_Questions.pdf',
      hasExtraMaterials: false,
    },
    {
      id: 'sst-ch7',
      number: 7,
      title: 'Physical Features of India (Geography)',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_ch7_Important_Questions.pdf',
      hasExtraMaterials: false,
    },
    {
      id: 'sst-ch8',
      number: 8,
      title: 'Drainage (Geography)',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch8_Important_Questions.pdf',
      hasExtraMaterials: false,
    },
    {
      id: 'sst-ch9',
      number: 9,
      title: 'Climate (Geography)',
      subjectCode: 'SST',
      notesPdfUrl: '/materials/sst/9_sst_Ch9_Important_Questions.pdf',
      hasExtraMaterials: false,
    },
  ],
  MATHEMATICS: [
    {
      id: 'math-ch1',
      number: 1,
      title: 'Number Systems',
      subjectCode: 'MATHEMATICS',
      hasExtraMaterials: false,
    },
    {
      id: 'math-ch2',
      number: 2,
      title: 'Polynomials',
      subjectCode: 'MATHEMATICS',
      hasExtraMaterials: false,
    },
    {
      id: 'math-ch7',
      number: 7,
      title: 'Triangles',
      subjectCode: 'MATHEMATICS',
      hasExtraMaterials: false,
    },
  ],
  ENGLISH: [
    {
      id: 'eng-ch1',
      number: 1,
      title: 'The Fun They Had',
      subjectCode: 'ENGLISH',
      hasExtraMaterials: false,
    },
    {
      id: 'eng-ch2',
      number: 2,
      title: 'The Sound of Music',
      subjectCode: 'ENGLISH',
      hasExtraMaterials: false,
    },
  ],
  HINDI: [
    {
      id: 'hin-ch1',
      number: 1,
      title: 'दो बैलों की कथा (प्रेमचंद)',
      subjectCode: 'HINDI',
      hasExtraMaterials: false,
    },
  ],
  SANSKRIT: [
    {
      id: 'san-ch1',
      number: 1,
      title: 'भारतीवसन्तगीतिः',
      subjectCode: 'SANSKRIT',
      hasExtraMaterials: false,
    },
  ],
};

// Also support lowercase keys for backward compatibility
CHAPTERS_BY_SUBJECT.science = CHAPTERS_BY_SUBJECT.SCIENCE;
CHAPTERS_BY_SUBJECT.social_science = CHAPTERS_BY_SUBJECT.SST;
CHAPTERS_BY_SUBJECT.sst = CHAPTERS_BY_SUBJECT.SST;
CHAPTERS_BY_SUBJECT.maths = CHAPTERS_BY_SUBJECT.MATHEMATICS;
CHAPTERS_BY_SUBJECT.english = CHAPTERS_BY_SUBJECT.ENGLISH;
CHAPTERS_BY_SUBJECT.hindi = CHAPTERS_BY_SUBJECT.HINDI;
CHAPTERS_BY_SUBJECT.sanskrit = CHAPTERS_BY_SUBJECT.SANSKRIT;

// Multi-class chapter repository for generic viewer
export const CLASS_CHAPTERS_MAP: Record<string, Record<string, Chapter[]>> = {
  'class-9': {
    science: CHAPTERS_BY_SUBJECT.SCIENCE.map(c => ({
      id: c.id,
      number: c.number,
      title: c.title,
      subjectId: 'science',
      description: `${c.title} — Key concepts, NCERT notes, formulas and illustrations.`,
      formulaCount: 4,
    })),
    social_science: CHAPTERS_BY_SUBJECT.SST.map(c => ({
      id: c.id,
      number: c.number,
      title: c.title,
      subjectId: 'social_science',
      description: `${c.title} — Comprehensive revision notes, mindmaps, and exam questions.`,
      formulaCount: 0,
    })),
    maths: [
      { id: 'math-ch1', number: 1, title: 'Number Systems', subjectId: 'maths', description: 'Rational and Irrational Numbers, Real Numbers on Number Line, Laws of Exponents', formulaCount: 5 },
      { id: 'math-ch2', number: 2, title: 'Polynomials', subjectId: 'maths', description: 'Zeroes of Polynomial, Remainder Theorem, Factor Theorem & Algebraic Identities', formulaCount: 8 },
      { id: 'math-ch7', number: 7, title: 'Triangles', subjectId: 'maths', description: 'Congruence Criteria (SAS, ASA, AAS, SSS, RHS) & Inequalities in Triangles', formulaCount: 3 },
    ],
    english: [
      { id: 'eng-ch1', number: 1, title: 'The Fun They Had', subjectId: 'english', description: 'Isaac Asimov\'s vision of futuristic mechanical schools and learning', formulaCount: 0 },
      { id: 'eng-ch2', number: 2, title: 'The Sound of Music', subjectId: 'english', description: 'Evelyn Glennie\'s auditory triumph and Bismillah Khan\'s Shehnai', formulaCount: 0 },
    ],
    hindi: [
      { id: 'hin-ch1', number: 1, title: 'दो बैलों की कथा (Premchand)', subjectId: 'hindi', description: 'हीरा और मोती की आज़ादी और वफ़ादारी का संघर्ष', formulaCount: 0 },
    ],
    sanskrit: [
      { id: 'san-ch1', number: 1, title: 'भारतीवसन्तगीतिः', subjectId: 'sanskrit', description: 'सरस्वती वन्दना एवं वसन्त ऋतु का मधुर वर्णन', formulaCount: 0 },
    ],
  },
  'class-10': {
    science: [
      { id: 'c10-sci-ch1', number: 1, title: 'Chemical Reactions & Equations', subjectId: 'science', description: 'Combination, Decomposition, Redox, Rancidity and Balancing Equations', formulaCount: 5 },
      { id: 'c10-sci-ch6', number: 6, title: 'Life Processes', subjectId: 'science', description: 'Nutrition, Respiration, Double Circulation, Excretion & Nephron Structure', formulaCount: 0 },
    ],
  },
};

export function getChaptersForClassAndSubject(classId: string, subjectId: string): Chapter[] {
  const normalizedClass = classId.toLowerCase().replace(/\s+/g, '-');
  const normalizedSubject = subjectId.toLowerCase().replace(/_/g, '-');

  if (CLASS_CHAPTERS_MAP[normalizedClass]?.[normalizedSubject]) {
    return CLASS_CHAPTERS_MAP[normalizedClass][normalizedSubject];
  }

  const subjectName = SUBJECTS.find(s => s.id === normalizedSubject)?.name || 'Subject';
  const gradeNum = normalizedClass.replace('class-', '');

  return [
    {
      id: `${normalizedClass}-${normalizedSubject}-ch1`,
      number: 1,
      title: `${subjectName} Fundamentals & Core Principles`,
      subjectId: normalizedSubject,
      description: `Comprehensive Class ${gradeNum} syllabus introduction, definitions, and CBSE conceptual pillars.`,
      formulaCount: normalizedSubject === 'maths' || normalizedSubject === 'science' ? 4 : 0,
    },
  ];
}

export const INITIAL_CHAPTER_TABS: Record<string, DocumentTab[]> = {
  'sci-ch8': [
    {
      id: 'tab-ncert-pdf',
      title: 'NCERT Textbook (Ch 8)',
      fileName: 'NCERT_Class9_Science_Ch8_Motion.pdf',
      type: 'pdf',
      status: 'reading',
      pinned: true,
      sizeBytes: 3450000,
      content: 'NCERT Class IX Science - Chapter 8: Motion',
    },
  ],
};

export function getTabsForChapter(chapter: Chapter, classId: string): DocumentTab[] {
  if (INITIAL_CHAPTER_TABS[chapter.id]) {
    return INITIAL_CHAPTER_TABS[chapter.id];
  }

  return [
    {
      id: `tab-${chapter.id}-ncert`,
      title: `NCERT Notes (Ch ${chapter.number})`,
      fileName: `NCERT_${classId}_${chapter.title.replace(/\s+/g, '_')}_Notes.pdf`,
      type: 'pdf',
      status: 'reading',
      pinned: true,
      sizeBytes: 2500000,
      content: `# ${chapter.title} (Chapter ${chapter.number})\n\n### Chapter Overview\n${chapter.description || 'Master core concepts and revision notes.'}`,
    },
  ];
}

export const CHAPTERS: Record<string, Chapter[]> = CLASS_CHAPTERS_MAP['class-9'];

export const GOOGLE_DRIVE_VAULTS: DocumentTab[] = [
  {
    id: 'tab-drive-1',
    uuid: '1-p63t_9hciCKCspwVJNNoUHsPpYVgX1e',
    title: '📂 Drive Vault 1: Lectures & Core PDFs',
    type: 'DRIVE',
    badge: 'GOOGLE DRIVE VAULT 01',
    driveFolderId: '1-p63t_9hciCKCspwVJNNoUHsPpYVgX1e',
    driveUrl: 'https://drive.google.com/drive/folders/1-p63t_9hciCKCspwVJNNoUHsPpYVgX1e?usp=drive_link',
    description: 'Cloud repository containing recorded lectures, syllabus presentations, and chapter PDFs.',
    curatedItems: [
      { name: 'Class_9_Syllabus_Master_Lectures.mp4', kind: 'VIDEO LECTURE', duration: '42:15 mins', tag: 'Learn' },
      { name: 'Core_Chapter_Annotated_Textbook_Notes.pdf', kind: 'CHAPTER PDF', duration: '18 Pages', tag: 'Learn' },
      { name: 'Conceptual_Derivation_Slides.pdf', kind: 'SLIDE DECK PDF', duration: '12 Slides', tag: 'Learn' },
    ],
    content: 'DRIVE_FOLDER_SPECIAL',
  },
  {
    id: 'tab-drive-2',
    uuid: '1KcZbtN5ij-19L8SkS6AjLqaLdwzP2sX4',
    title: '📂 Drive Vault 2: Notes & Reference Media',
    type: 'DRIVE',
    badge: 'GOOGLE DRIVE VAULT 02',
    driveFolderId: '1KcZbtN5ij-19L8SkS6AjLqaLdwzP2sX4',
    driveUrl: 'https://drive.google.com/drive/folders/1KcZbtN5ij-19L8SkS6AjLqaLdwzP2sX4?usp=drive_link',
    description: 'Handwritten revision notes, concept mindmaps, and visual explanations.',
    curatedItems: [
      { name: 'One_Shot_Revision_Lecture_Recording.mp4', kind: 'VIDEO LECTURE', duration: '55:10 mins', tag: 'Learn' },
      { name: 'Handwritten_Topper_Notes_&_Concept_Sheets.pdf', kind: 'TOPPER NOTES PDF', duration: '14 Pages', tag: 'Learn' },
      { name: 'High_Yield_Quick_Reference_Sheet.pdf', kind: 'CONCEPT PDF', duration: '6 Pages', tag: 'Practice' },
    ],
    content: 'DRIVE_FOLDER_SPECIAL',
  },
  {
    id: 'tab-drive-3',
    uuid: '1lEU75-5NTwcfQGSfUFu3_ARibYVDyHbl',
    title: '📂 Drive Vault 3: DPPs & Video Bank',
    type: 'DRIVE',
    badge: 'GOOGLE DRIVE VAULT 03',
    driveFolderId: '1lEU75-5NTwcfQGSfUFu3_ARibYVDyHbl',
    driveUrl: 'https://drive.google.com/drive/folders/1lEU75-5NTwcfQGSfUFu3_ARibYVDyHbl?usp=drive_link',
    description: 'Daily Practice Problems (DPPs), question banks, and solution walk-throughs.',
    curatedItems: [
      { name: 'DPP_01_High_Yield_Practice_Questions.pdf', kind: 'DPP PDF', duration: '25 Questions', tag: 'Practice' },
      { name: 'DPP_02_Score_Booster_Important_Questions.pdf', kind: 'DPP PDF', duration: '30 Questions', tag: 'Practice' },
      { name: 'Live_DPP_Doubt_Solving_Session_Recording.mp4', kind: 'VIDEO SOLUTION', duration: '38:40 mins', tag: 'Practice' },
    ],
    content: 'DRIVE_FOLDER_SPECIAL',
  },
];

export const INITIAL_WEAK_TOPICS: WeakTopic[] = [
  {
    id: 'wt-1',
    subject: 'Science',
    chapter: 'Ch 8: Motion',
    topic: 'Graphical Derivation of 2as = v² - u²',
    doubtCount: 14,
    severity: 'high',
    recommendedAction: 'Practice geometry area under trapezium method with Step-by-Step tutor',
  },
  {
    id: 'wt-2',
    subject: 'SST',
    chapter: 'Ch 1: French Revolution',
    topic: 'The Estates General & Constitution of 1791',
    doubtCount: 11,
    severity: 'high',
    recommendedAction: 'Review Three Estates diagram and Declaration of Rights of Man',
  },
  {
    id: 'wt-3',
    subject: 'Science',
    chapter: 'Ch 9: Force & Laws',
    topic: 'Conservation of Momentum Collision Problems',
    doubtCount: 7,
    severity: 'medium',
    recommendedAction: 'Check sign convention for opposite velocity vectors',
  },
];

export const INITIAL_ANALYTICS: CohortAnalytics[] = [
  {
    chapterId: 'sci-ch8',
    chapterTitle: 'Ch 8: Motion',
    subject: 'Science',
    totalDoubts: 68,
    averageMasteryPct: 78,
    commonMisconception: 'Confusing displacement with total distance in circular track problems',
    mostQueriedDoc: 'Ch 8 Notes & Video Animation',
  },
  {
    chapterId: 'sst-ch1',
    chapterTitle: 'Ch 1: French Revolution',
    subject: 'SST',
    totalDoubts: 54,
    averageMasteryPct: 82,
    commonMisconception: 'Role of National Assembly vs Jacobin Convention',
    mostQueriedDoc: 'Ch 1 Important Questions PDF',
  },
  {
    chapterId: 'sci-ch1',
    chapterTitle: 'Ch 1: Matter in Surroundings',
    subject: 'Science',
    totalDoubts: 42,
    averageMasteryPct: 85,
    commonMisconception: 'Latent Heat of Vaporization vs Evaporation cooling effect',
    mostQueriedDoc: 'Ch 1 MindMap & Animation',
  },
];

export const COHORT_ANALYTICS: CohortAnalytics[] = INITIAL_ANALYTICS;
