export type SubjectId = 
  | 'science' 
  | 'maths' 
  | 'english' 
  | 'hindi' 
  | 'social_science' 
  | 'sanskrit';

export interface SubjectMeta {
  id: SubjectId;
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
