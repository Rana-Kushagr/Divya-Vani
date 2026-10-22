export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type SubjectCode = 
  | 'SCIENCE'
  | 'MATHEMATICS'
  | 'SOCIAL_SCIENCE'
  | 'ENGLISH'
  | 'HINDI'
  | 'SANSKRIT';

export type SubjectId = 
  | 'science' 
  | 'maths' 
  | 'english' 
  | 'hindi' 
  | 'social_science' 
  | 'sanskrit';

export interface BookmarkItem {
  key: string; // "${class}|${subject}|${chapterIndex}"
  classLevel: string;
  subjectCode: SubjectCode | SubjectId;
  subjectName: string;
  chapterIndex: number;
  chapterNumber: number;
  chapterTitle: string;
  page: number;
  pdfUrl: string;
  savedAt: string;
}

export interface ChapterSummary {
  chapterNumber: number;
  chapterTitle: string;
  overview: string;
  coreConcepts: Array<{
    title: string;
    description: string;
    latexFormula?: string;
  }>;
  formulaAndTheorems: Array<{
    name: string;
    statement: string;
    formulaLatex: string;
    siUnitsOrConditions?: string;
  }>;
  highWeightageQuestions: Array<{
    type: '1-Mark' | '2-Mark' | '3-Mark Derivation' | '5-Mark Case Study';
    question: string;
    solutionHint: string;
  }>;
}

export interface DivyavaniClientState {
  userName: string;
  selectedClass: string;
  selectedSubject: SubjectId;
  selectedChapterIndex: number;
  currentPage: number;
  zoomLevel: number;
  readerMode: 'INTERACTIVE' | 'OFFICIAL_EMBED';
  readerTheme: 'light' | 'sepia' | 'dark';
  bookmarks: BookmarkItem[];
  completedChapters: Record<string, boolean>;
}

export interface UserProfile {
  id: string; // UUIDv4
  email?: string;
  fullName: string;
  role: Role;
  selectedClass?: string; // e.g. "class-9" or "Class 9"
  selectedSubject?: SubjectId | SubjectCode;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterDocumentModel {
  id: string; // UUIDv4
  classLevel: string; // e.g. "class-9" or "Class 9"
  subject: SubjectCode | SubjectId;
  chapterNumber: number;
  chapterTitle: string;
  fileTitle: string;
  fileUrl: string;
  fileType: 'PDF' | 'VIDEO' | 'NOTES' | 'FORMULA';
  pageCount?: number;
  uploadedAt: string;
}

export interface DoubtModel {
  id: string; // UUIDv4
  userId: string;
  documentId?: string;
  queryText: string;
  imageUrl?: string;
  solutionSteps: Array<{
    step: number;
    title: string;
    detail: string;
    mathLatex?: string;
  }>;
  formulaUsed?: string;
  finalAnswer: string;
  isResolved: boolean;
  createdAt: string;
}

export interface BookmarkModel {
  id: string;
  userId: string;
  documentId: string;
  pageNumber?: number;
  createdAt: string;
}

export interface SubjectMeta {
  id: SubjectId;
  code?: SubjectCode;
  name: string;
  hindiName: string;
  icon: string;
  color: string;
  defaultChapterId: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subjectId: SubjectId;
  description: string;
  formulaCount: number;
  bookCode?: string;
  pdfUrl?: string;
  pageCount?: number;
}

export type DocumentType = 'pdf' | 'markdown' | 'video' | 'image' | 'text';
export type TabStatus = 'reading' | 'annotated' | 'ai_indexed';

export interface DocumentTab {
  id: string; // UUIDv4
  title: string;
  fileName: string;
  type: DocumentType;
  sizeBytes?: number;
  status: TabStatus;
  pinned?: boolean;
  content?: string; // Markdown text or excerpt
  fileUrl?: string; // Blob URL or static asset
  videoUrl?: string; // YouTube or video embed URL
  videoTimestamp?: number;
}

export interface FormulaItem {
  id: string;
  name: string;
  latex: string;
  unit: string;
  derivationSummary: string;
  variables: { symbol: string; meaning: string; siUnit: string }[];
}

export interface SocraticStep {
  stepNumber: number;
  title: string;
  explanation: string;
  latexMath?: string;
}

export interface MicroQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SocraticSolution {
  id: string; // UUIDv4
  doubtQuery: string;
  conceptLink: {
    chapter: string;
    topic: string;
    syllabusCode: string;
  };
  givenData: string[];
  formulaSpotlight: {
    formulaLatex: string;
    name: string;
    law: string;
    notes: string;
  };
  derivationSteps: SocraticStep[];
  microQuiz: MicroQuiz;
  verified: boolean;
  timestamp: string;
}

export interface WeakTopic {
  id: string;
  subject: string;
  topic: string;
  chapter: string;
  doubtCount: number;
  severity: 'high' | 'medium';
  recommendedAction: string;
}

export interface CohortAnalytics {
  chapterId: string;
  chapterTitle: string;
  subject: string;
  totalDoubts: number;
  averageMasteryPct: number;
  commonMisconception: string;
  mostQueriedDoc: string;
}
