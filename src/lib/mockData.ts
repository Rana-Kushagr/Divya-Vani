import { SubjectMeta, Chapter, DocumentTab, WeakTopic, CohortAnalytics } from './types';

export const SUBJECTS: SubjectMeta[] = [
  { id: 'science', name: 'Science', hindiName: 'विज्ञान', icon: 'Atom', color: '#6D28D9', defaultChapterId: 'sci-ch8' },
  { id: 'maths', name: 'Mathematics', hindiName: 'गणित', icon: 'Calculator', color: '#059669', defaultChapterId: 'math-ch1' },
  { id: 'english', name: 'English (Beehive)', hindiName: 'अंग्रेज़ी', icon: 'BookOpen', color: '#2563EB', defaultChapterId: 'eng-ch1' },
  { id: 'hindi', name: 'Hindi (Kshitij)', hindiName: 'हिन्दी', icon: 'Languages', color: '#D97706', defaultChapterId: 'hin-ch1' },
  { id: 'social_science', name: 'Social Science', hindiName: 'सामाजिक विज्ञान', icon: 'Globe', color: '#DC2626', defaultChapterId: 'sst-ch1' },
  { id: 'sanskrit', name: 'Sanskrit (Shemushi)', hindiName: 'संस्कृत', icon: 'Scroll', color: '#7C3AED', defaultChapterId: 'san-ch1' },
];

export const CHAPTERS: Record<string, Chapter[]> = {
  science: [
    { id: 'sci-ch8', number: 8, title: 'Motion', subjectId: 'science', description: 'Distance, Displacement, Speed, Velocity, Acceleration & Graphical Derivations', formulaCount: 6 },
    { id: 'sci-ch9', number: 9, title: 'Force & Laws of Motion', subjectId: 'science', description: 'Newton\'s Three Laws, Inertia, Momentum and Conservation of Momentum', formulaCount: 4 },
    { id: 'sci-ch1', number: 1, title: 'Matter in Our Surroundings', subjectId: 'science', description: 'States of Matter, Evaporation, Sublimation and Latent Heat', formulaCount: 2 },
    { id: 'sci-ch5', number: 5, title: 'Fundamental Unit of Life', subjectId: 'science', description: 'Cell Structure, Plasma Membrane, Nucleus, Organelles and Mitosis', formulaCount: 0 },
  ],
  maths: [
    { id: 'math-ch1', number: 1, title: 'Number Systems', subjectId: 'maths', description: 'Rational and Irrational Numbers, Real Numbers on Number Line, Laws of Exponents', formulaCount: 5 },
    { id: 'math-ch2', number: 2, title: 'Polynomials', subjectId: 'maths', description: 'Zeroes of Polynomial, Remainder Theorem, Factor Theorem & Algebraic Identities', formulaCount: 8 },
    { id: 'math-ch7', number: 7, title: 'Triangles', subjectId: 'maths', description: 'Congruence Criteria (SAS, ASA, AAS, SSS, RHS) & Inequalities in Triangles', formulaCount: 3 },
    { id: 'math-ch12', number: 12, title: 'Heron\'s Formula', subjectId: 'maths', description: 'Area of Triangle using Semi-perimeter and Application in Quadrilaterals', formulaCount: 2 },
  ],
  english: [
    { id: 'eng-ch1', number: 1, title: 'The Fun They Had', subjectId: 'english', description: 'Isaac Asimov\'s vision of futuristic mechanical schools and learning', formulaCount: 0 },
    { id: 'eng-ch2', number: 2, title: 'The Sound of Music', subjectId: 'english', description: 'Evelyn Glennie\'s auditory triumph and Bismillah Khan\'s Shehnai', formulaCount: 0 },
  ],
  hindi: [
    { id: 'hin-ch1', number: 1, title: 'दो बैलों की कथा (Premchand)', subjectId: 'hindi', description: 'हीरा और मोती की आज़ादी और वफ़ादारी का संघर्ष', formulaCount: 0 },
  ],
  social_science: [
    { id: 'sst-ch1', number: 1, title: 'The French Revolution', subjectId: 'social_science', description: 'Storming of Bastille, Declaration of Rights of Man, Reign of Terror', formulaCount: 0 },
  ],
  sanskrit: [
    { id: 'san-ch1', number: 1, title: 'भारतीवसन्तगीतिः', subjectId: 'sanskrit', description: 'सरस्वती वन्दना एवं वसन्त ऋतु का मधुर वर्णन', formulaCount: 0 },
  ]
};

// Initial Multi-Tab documents for Science Ch 8 (Motion)
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
      content: `NCERT Class IX Science - Chapter 8: Motion

8.1 Describing Motion:
An object is said to be in motion when its position changes with respect to a reference point with time.
• Distance: Total path length covered by an object (Scalar quantity, SI unit: metre).
• Displacement: Shortest straight-line distance between initial and final positions (Vector quantity, SI unit: metre).

8.2 Uniform Motion and Non-uniform Motion:
When an object travels equal distances in equal intervals of time, it moves with uniform motion.

8.5 Equations of Motion by Graphical Method:
1. v = u + at (Velocity-time relation)
2. s = ut + ½ at² (Position-time relation)
3. 2as = v² - u² (Position-velocity relation)
Where:
u = initial velocity
v = final velocity
a = uniform acceleration
t = time taken
s = distance traveled`
    },
    {
      id: 'tab-formulas-md',
      title: 'Formula Sheet & Derivations',
      fileName: 'Motion_Formula_Vault.md',
      type: 'markdown',
      status: 'ai_indexed',
      pinned: true,
      sizeBytes: 12400,
      content: `# Chapter 8: Key Formulas & Derivations

### 1. Speed & Velocity
- Average Speed: $$v_{avg} = \\frac{\\text{Total Distance}}{\\text{Total Time}} = \\frac{s}{t}$$
- Average Velocity: $$v_{avg} = \\frac{u + v}{2}$$ (for uniformly changing velocity)

### 2. Acceleration
$$a = \\frac{v - u}{t}$$
- SI Unit: $$\\text{m/s}^2$$
- Negative acceleration is called **retardation** or **deceleration**.

### 3. The Three Big Kinematic Equations
1. $$v = u + at$$
2. $$s = ut + \\frac{1}{2}at^2$$
3. $$2as = v^2 - u^2$$

### 4. Uniform Circular Motion
$$v = \\frac{2\\pi r}{t}$$
Speed remains constant, but direction continuously changes (accelerated motion).`
    },
    {
      id: 'tab-pyqs-bank',
      title: 'CBSE Past Year Questions',
      fileName: 'Class9_Motion_PYQ_Bank_2020_2025.pdf',
      type: 'text',
      status: 'annotated',
      pinned: false,
      sizeBytes: 850000,
      content: `Class IX CBSE Examination Archive - Motion

[Q1 - 3 Marks] A train starting from rest attains a velocity of 72 km/h in 5 minutes. Assuming acceleration is uniform, find:
(i) Acceleration in m/s²
(ii) Distance traveled by train for attaining this velocity.

[Q2 - 2 Marks] Differentiate between distance and displacement with two real-world examples.

[Q3 - 5 Marks] Derive graphically the equation for position-time relation: s = ut + ½at².`
    },
    {
      id: 'tab-lecture-video',
      title: 'Equations of Motion Lecture',
      fileName: 'Motion_Visualized_Lecture.mp4',
      type: 'video',
      status: 'reading',
      pinned: false,
      videoUrl: 'https://www.youtube-nocookie.com/embed/n2gQ_S3v4d8',
      videoTimestamp: 142
    }
  ]
};

// Mock Weak Topics for Revision Hub
export const INITIAL_WEAK_TOPICS: WeakTopic[] = [
  {
    id: 'wt-1',
    subject: 'Science',
    chapter: 'Ch 8: Motion',
    topic: 'Graphical Derivation of 2as = v² - u²',
    doubtCount: 14,
    severity: 'high',
    recommendedAction: 'Practice geometry area under trapezium method with Step-by-Step tutor'
  },
  {
    id: 'wt-2',
    subject: 'Mathematics',
    chapter: 'Ch 2: Polynomials',
    topic: 'Splitting Middle Term in Cubic Polynomials',
    doubtCount: 11,
    severity: 'high',
    recommendedAction: 'Review Rational Root Theorem and Factor Theorem'
  },
  {
    id: 'wt-3',
    subject: 'Science',
    chapter: 'Ch 9: Force & Laws',
    topic: 'Conservation of Momentum Collision Problems',
    doubtCount: 7,
    severity: 'medium',
    recommendedAction: 'Check sign convention for opposite velocity vectors'
  }
];

// Anonymized Cohort Heatmap for Teachers
export const COHORT_ANALYTICS: CohortAnalytics[] = [
  {
    chapterId: 'sci-ch8',
    chapterTitle: 'Ch 8: Motion',
    subject: 'Science',
    totalDoubts: 68,
    averageMasteryPct: 78,
    commonMisconception: 'Confusing displacement with total distance in circular track problems',
    mostQueriedDoc: 'Motion_Formula_Vault.md (Tab 2)'
  },
  {
    chapterId: 'sci-ch9',
    chapterTitle: 'Ch 9: Force & Laws',
    subject: 'Science',
    totalDoubts: 54,
    averageMasteryPct: 71,
    commonMisconception: 'Assuming an object requires a net force to stay in motion at constant velocity',
    mostQueriedDoc: 'NCERT Textbook (Ch 9)'
  },
  {
    chapterId: 'math-ch2',
    chapterTitle: 'Ch 2: Polynomials',
    subject: 'Mathematics',
    totalDoubts: 82,
    averageMasteryPct: 64,
    commonMisconception: 'Sign errors when applying (a - b - c)² identities',
    mostQueriedDoc: 'Polynomial_Identities_CheatSheet.pdf'
  }
];
