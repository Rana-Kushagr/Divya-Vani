export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type SubjectCode = 
  | 'SCIENCE'
  | 'MATHEMATICS'
  | 'SOCIAL_SCIENCE'
  | 'SST'
  | 'ENGLISH'
  | 'HINDI'
  | 'SANSKRIT';

export type SubjectId = 
  | 'science' 
  | 'maths' 
  | 'english' 
  | 'hindi' 
  | 'social_science' 
  | 'sanskrit'
  | 'sst'
  | 'SCIENCE'
  | 'MATHEMATICS'
  | 'SST'
  | 'SOCIAL_SCIENCE'
  | 'ENGLISH'
  | 'HINDI'
  | 'SANSKRIT';

export interface BookmarkItem {
  key: string;
  classLevel: string;
  subjectCode: SubjectCode | SubjectId | string;
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
  selectedSubject: SubjectId | string;
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
  selectedClass?: string;
  selectedSubject?: SubjectId | SubjectCode | string;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterDocumentModel {
  id: string;
  classLevel: string;
  subject: SubjectCode | SubjectId | string;
  chapterNumber: number;
  chapterTitle: string;
  fileTitle: string;
  fileUrl: string;
  fileType: 'PDF' | 'VIDEO' | 'NOTES' | 'FORMULA';
  pageCount?: number;
  uploadedAt: string;
}

export interface DoubtModel {
  id: string;
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
  id: SubjectId | string;
  code: SubjectId;
  name: string;
  hindiName: string;
  icon: string;
  color?: string;
  defaultChapter?: string;
  defaultChapterId?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subjectId: SubjectId | string;
  description?: string;
  formulaCount?: number;
  bookCode?: string;
  pdfUrl?: string;
  pageCount?: number;
}

export type ClassLevel = 'Class 9-H' | 'Class 10' | 'Class 11' | 'Class 12' | string;

export type MaterialSubView = 'NOTES' | 'MINDMAP' | 'ANIMATION';

export interface ChapterMeta {
  id: string;
  number: number;
  title: string;
  subjectCode: SubjectId | string;
  notesPdfUrl?: string;
  mindMapPdfUrl?: string;
  animationVideoUrl?: string;
  animationVideoUrl2?: string;
  hasExtraMaterials: boolean;
}

export type DocumentType = 
  | 'pdf' 
  | 'markdown' 
  | 'video' 
  | 'image' 
  | 'text' 
  | 'DRIVE' 
  | 'NOTES' 
  | 'MINDMAP' 
  | 'ANIMATION' 
  | 'FORMULA' 
  | 'PYQ' 
  | 'DIAGRAM' 
  | 'PDF' 
  | 'VIDEO';

export interface DriveCuratedItem {
  name: string;
  kind: string;
  duration: string;
  tag: string;
}

export interface DocumentTab {
  id: string;
  uuid?: string;
  title: string;
  fileName?: string;
  type: DocumentType;
  status?: string;
  badge?: string;
  content?: string;
  sizeBytes?: number;
  fileUrl?: string;
  videoUrl?: string;
  driveFolderId?: string;
  driveUrl?: string;
  description?: string;
  curatedItems?: DriveCuratedItem[];
  pinned?: boolean;
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
  id: string;
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
  chapter: string;
  topic: string;
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
