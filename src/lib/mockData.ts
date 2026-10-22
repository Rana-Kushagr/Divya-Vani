import { SubjectMeta, Chapter, DocumentTab, WeakTopic, CohortAnalytics } from './types';

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

export const SUBJECTS: SubjectMeta[] = [
  { id: 'science', code: 'SCIENCE', name: 'Science', hindiName: 'विज्ञान', icon: 'Atom', color: '#6D28D9', defaultChapterId: 'sci-ch8' },
  { id: 'maths', code: 'MATHEMATICS', name: 'Mathematics', hindiName: 'गणित', icon: 'Calculator', color: '#059669', defaultChapterId: 'math-ch1' },
  { id: 'social_science', code: 'SOCIAL_SCIENCE', name: 'Social Science', hindiName: 'सामाजिक विज्ञान', icon: 'Globe', color: '#DC2626', defaultChapterId: 'sst-ch1' },
  { id: 'english', code: 'ENGLISH', name: 'English', hindiName: 'अंग्रेज़ी', icon: 'BookOpen', color: '#2563EB', defaultChapterId: 'eng-ch1' },
  { id: 'hindi', code: 'HINDI', name: 'Hindi', hindiName: 'हिन्दी', icon: 'Languages', color: '#D97706', defaultChapterId: 'hin-ch1' },
  { id: 'sanskrit', code: 'SANSKRIT', name: 'Sanskrit', hindiName: 'संस्कृत', icon: 'Scroll', color: '#7C3AED', defaultChapterId: 'san-ch1' },
];

// Comprehensive multi-class chapter repository
export const CLASS_CHAPTERS_MAP: Record<string, Record<string, Chapter[]>> = {
  'class-9': {
    science: [
      { id: 'sci-ch8', number: 8, title: 'Motion', subjectId: 'science', description: 'Distance, Displacement, Speed, Velocity, Acceleration & Graphical Derivations', formulaCount: 6 },
      { id: 'sci-ch9', number: 9, title: 'Force & Laws of Motion', subjectId: 'science', description: 'Newton\'s Three Laws, Inertia, Momentum and Conservation of Momentum', formulaCount: 4 },
      { id: 'sci-ch10', number: 10, title: 'Gravitation', subjectId: 'science', description: 'Universal Law of Gravitation, Free Fall, Weightlessness & Mass vs Weight', formulaCount: 5 },
      { id: 'sci-ch1', number: 1, title: 'Matter in Our Surroundings', subjectId: 'science', description: 'States of Matter, Evaporation, Sublimation and Latent Heat', formulaCount: 2 },
      { id: 'sci-ch5', number: 5, title: 'Fundamental Unit of Life', subjectId: 'science', description: 'Cell Structure, Plasma Membrane, Nucleus, Organelles and Mitosis', formulaCount: 0 },
    ],
    maths: [
      { id: 'math-ch1', number: 1, title: 'Number Systems', subjectId: 'maths', description: 'Rational and Irrational Numbers, Real Numbers on Number Line, Laws of Exponents', formulaCount: 5 },
      { id: 'math-ch2', number: 2, title: 'Polynomials', subjectId: 'maths', description: 'Zeroes of Polynomial, Remainder Theorem, Factor Theorem & Algebraic Identities', formulaCount: 8 },
      { id: 'math-ch7', number: 7, title: 'Triangles', subjectId: 'maths', description: 'Congruence Criteria (SAS, ASA, AAS, SSS, RHS) & Inequalities in Triangles', formulaCount: 3 },
      { id: 'math-ch12', number: 12, title: 'Heron\'s Formula', subjectId: 'maths', description: 'Area of Triangle using Semi-perimeter and Application in Quadrilaterals', formulaCount: 2 },
    ],
    social_science: [
      { id: 'sst-ch1', number: 1, title: 'The French Revolution', subjectId: 'social_science', description: 'Storming of Bastille, Declaration of Rights of Man, Reign of Terror', formulaCount: 0 },
      { id: 'sst-ch2', number: 2, title: 'Socialism in Europe & Russian Revolution', subjectId: 'social_science', description: 'Lenin\'s April Theses, February Revolution & October Revolution', formulaCount: 0 },
      { id: 'sst-ch3', number: 3, title: 'India: Size and Location', subjectId: 'social_science', description: 'Standard Meridian, Tropic of Cancer, Peninsular Plateau & Neighbors', formulaCount: 0 },
    ],
    english: [
      { id: 'eng-ch1', number: 1, title: 'The Fun They Had', subjectId: 'english', description: 'Isaac Asimov\'s vision of futuristic mechanical schools and learning', formulaCount: 0 },
      { id: 'eng-ch2', number: 2, title: 'The Sound of Music', subjectId: 'english', description: 'Evelyn Glennie\'s auditory triumph and Bismillah Khan\'s Shehnai', formulaCount: 0 },
    ],
    hindi: [
      { id: 'hin-ch1', number: 1, title: 'दो बैलों की कथा (Premchand)', subjectId: 'hindi', description: 'हीरा और मोती की आज़ादी और वफ़ादारी का संघर्ष', formulaCount: 0 },
      { id: 'hin-ch2', number: 2, title: 'ल्हासा की ओर (Rahul Sankrityayan)', subjectId: 'hindi', description: 'तिब्बत यात्रा, डांडे की ऊँचाइयाँ और बौद्ध धर्म के संस्मरण', formulaCount: 0 },
    ],
    sanskrit: [
      { id: 'san-ch1', number: 1, title: 'भारतीवसन्तगीतिः', subjectId: 'sanskrit', description: 'सरस्वती वन्दना एवं वसन्त ऋतु का मधुर वर्णन', formulaCount: 0 },
      { id: 'san-ch2', number: 2, title: 'स्वर्णकाकः', subjectId: 'sanskrit', description: 'लोभ का दुष्परिणाम एवं त्याग का सत्परिणाम', formulaCount: 0 },
    ],
  },
  'class-10': {
    science: [
      { id: 'c10-sci-ch1', number: 1, title: 'Chemical Reactions & Equations', subjectId: 'science', description: 'Combination, Decomposition, Redox, Rancidity and Balancing Equations', formulaCount: 5 },
      { id: 'c10-sci-ch6', number: 6, title: 'Life Processes', subjectId: 'science', description: 'Nutrition, Respiration, Double Circulation, Excretion & Nephron Structure', formulaCount: 0 },
      { id: 'c10-sci-ch10', number: 10, title: 'Light: Reflection & Refraction', subjectId: 'science', description: 'Mirror Formula, Lens Maker Formula, Snell\'s Law, Magnification', formulaCount: 6 },
      { id: 'c10-sci-ch12', number: 12, title: 'Electricity', subjectId: 'science', description: 'Ohm\'s Law, Resistance in Series/Parallel, Joule\'s Heating & Electric Power', formulaCount: 7 },
    ],
    maths: [
      { id: 'c10-math-ch1', number: 1, title: 'Real Numbers', subjectId: 'maths', description: 'Fundamental Theorem of Arithmetic, Proofs of Irrationality (√2, √3, √5)', formulaCount: 2 },
      { id: 'c10-math-ch3', number: 3, title: 'Linear Equations in Two Variables', subjectId: 'maths', description: 'Graphical Method, Substitution, Elimination, Consistency Conditions', formulaCount: 4 },
      { id: 'c10-math-ch4', number: 4, title: 'Quadratic Equations', subjectId: 'maths', description: 'Discriminant, Quadratic Formula, Nature of Roots & Word Problems', formulaCount: 4 },
      { id: 'c10-math-ch8', number: 8, title: 'Introduction to Trigonometry', subjectId: 'maths', description: 'Trigonometric Ratios, Standard Angles (0, 30, 45, 60, 90) & Pythagorean Identities', formulaCount: 9 },
    ],
    social_science: [
      { id: 'c10-sst-ch1', number: 1, title: 'Rise of Nationalism in Europe', subjectId: 'social_science', description: 'Frédéric Sorrieu Vision, Mazzini, Garibaldi and Unification of Germany & Italy', formulaCount: 0 },
      { id: 'c10-sst-ch2', number: 2, title: 'Nationalism in India', subjectId: 'social_science', description: 'Non-Cooperation Movement, Dandi March, Simon Commission & Poona Pact', formulaCount: 0 },
    ],
    english: [
      { id: 'c10-eng-ch1', number: 1, title: 'A Letter to God (G.L. Fuentes)', subjectId: 'english', description: 'Lencho\'s unshakeable faith, hailstorm devastation, post office ironies', formulaCount: 0 },
      { id: 'c10-eng-ch2', number: 2, title: 'Nelson Mandela: Long Walk to Freedom', subjectId: 'english', description: 'Inauguration ceremony, overcoming apartheid, twin obligations of man', formulaCount: 0 },
    ],
    hindi: [
      { id: 'c10-hin-ch1', number: 1, title: 'सूरदास के पद', subjectId: 'hindi', description: 'उद्धव-गोपी संवाद, भ्रमरगीत और अनन्य प्रेम की पराकाष्ठा', formulaCount: 0 },
    ],
    sanskrit: [
      { id: 'c10-san-ch1', number: 1, title: 'शुचिपर्यावरणम्', subjectId: 'sanskrit', description: 'प्रदूषण निवारण एवं प्राकृतिक जीवन की महत्ता', formulaCount: 0 },
    ],
  },
};

// Fallback generator for other classes (Classes 6, 7, 8, 11, 12)
export function getChaptersForClassAndSubject(classId: string, subjectId: string): Chapter[] {
  const normalizedClass = classId.toLowerCase().replace(/\s+/g, '-');
  const normalizedSubject = subjectId.toLowerCase().replace(/_/g, '-');

  if (CLASS_CHAPTERS_MAP[normalizedClass]?.[normalizedSubject]) {
    return CLASS_CHAPTERS_MAP[normalizedClass][normalizedSubject];
  }

  // Smart fallback template per subject
  const subjectName = SUBJECTS.find(s => s.id === normalizedSubject)?.name || 'Subject';
  const gradeNum = normalizedClass.replace('class-', '');

  return [
    {
      id: `${normalizedClass}-${normalizedSubject}-ch1`,
      number: 1,
      title: `${subjectName} Fundamentals & Core Principles`,
      subjectId: normalizedSubject as any,
      description: `Comprehensive Class ${gradeNum} syllabus introduction, definitions, and CBSE conceptual pillars.`,
      formulaCount: normalizedSubject === 'maths' || normalizedSubject === 'science' ? 4 : 0,
    },
    {
      id: `${normalizedClass}-${normalizedSubject}-ch2`,
      number: 2,
      title: `Applied Analysis & Practical Demonstrations`,
      subjectId: normalizedSubject as any,
      description: `In-depth breakdown of standard textbook exercises, exemplar problems, and board questions.`,
      formulaCount: normalizedSubject === 'maths' || normalizedSubject === 'science' ? 5 : 0,
    },
    {
      id: `${normalizedClass}-${normalizedSubject}-ch3`,
      number: 3,
      title: `Past Year Questions & Exam Mastery`,
      subjectId: normalizedSubject as any,
      description: `High-frequency marking scheme questions, step-marking guidelines, and quick formula sheets.`,
      formulaCount: normalizedSubject === 'maths' || normalizedSubject === 'science' ? 3 : 0,
    },
  ];
}

// Initial Chapter tabs repository
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
      id: 'tab-dpp-practice',
      title: 'Daily Practice DPP (CBSE)',
      fileName: 'Class9_Science_Motion_DPP_01.pdf',
      type: 'pdf',
      status: 'reading',
      pinned: false,
      sizeBytes: 1820000,
      content: `CBSE Daily Practice Problem (DPP) — Motion & Acceleration

Q1. A particle moves in a circular path of radius R. What is its displacement after completing half a revolution?
Ans: The displacement is equal to the diameter of the circle, which is 2R.

Q2. A car starts from rest and attains 54 km/h in 10 seconds. Calculate:
(a) The acceleration in SI units
(b) The distance covered in this time
Given: u = 0, v = 54 km/h = 15 m/s, t = 10 s.
Acceleration a = (15 - 0)/10 = 1.5 m/s².
Distance s = ut + 0.5 * a * t² = 0 + 0.5 * 1.5 * 100 = 75 metres.`
    },
  ],
  'c10-sci-ch1': [
    {
      id: 'tab-c10-ch1-ncert',
      title: 'NCERT Textbook (Ch 1)',
      fileName: 'NCERT_Class10_Science_Ch1_Chemical_Reactions.pdf',
      type: 'pdf',
      status: 'reading',
      pinned: true,
      sizeBytes: 3100000,
      content: `NCERT Class X Science - Chapter 1: Chemical Reactions & Equations

1.1 Chemical Equations:
Whenever a chemical change occurs, we can say that a chemical reaction has taken place.
Example: Magnesium ribbon burnt in air gives Magnesium Oxide.
2Mg(s) + O₂(g) → 2MgO(s) (Dazzling white flame + white powder).

1.2 Types of Chemical Reactions:
1. Combination Reaction: CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat (Exothermic)
2. Decomposition Reaction: 2FeSO₄(s) → Fe₂O₃(s) + SO₂(g) + SO₃(g) (Thermal)
3. Displacement Reaction: Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)
4. Double Displacement Reaction: Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)
5. Oxidation & Reduction (Redox): CuO + H₂ → Cu + H₂O`
    },
    {
      id: 'tab-c10-ch1-formulas',
      title: 'Formula Vault & Balancing Tips',
      fileName: 'Chemistry_Reaction_Vault.md',
      type: 'markdown',
      status: 'ai_indexed',
      pinned: true,
      sizeBytes: 9800,
      content: `# Class 10 Chemistry: Reaction Summary

### Law of Conservation of Mass
Mass can neither be created nor destroyed in a chemical reaction. Total mass of reactants = Total mass of products.

### Quick Color Identifiers:
- Copper Sulphate: Blue ($$CuSO_4$$)
- Ferrous Sulphate: Light Green ($$FeSO_4$$)
- Barium Sulphate precipitate: White ($$BaSO_4$$)
- Lead Iodide precipitate: Bright Yellow ($$PbI_2$$)`
    }
  ]
};

// Fallback tab generator
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
      content: `# ${chapter.title} (Chapter ${chapter.number})

### Chapter Overview
${chapter.description}

### Key Learning Objectives:
1. Master core CBSE terminology and definitions.
2. Step-by-step graphical & mathematical derivations.
3. High-weightage board examination practice questions.

### Recommended NCERT Exemplar Problems:
- Review in-text questions on page 102-108.
- Attempt exercise questions 1 through 12.
- Focus on unit conversions and SI base units.`
    },
    {
      id: `tab-${chapter.id}-formula`,
      title: 'Key Formulas & Quick Sheet',
      fileName: `${chapter.title.replace(/\s+/g, '_')}_Formula_Sheet.md`,
      type: 'markdown',
      status: 'ai_indexed',
      pinned: true,
      sizeBytes: 8400,
      content: `# ${chapter.title} — Quick Revision Formulas

### Core Equations:
${chapter.formulaCount > 0 ? `This chapter features ${chapter.formulaCount} primary equations for board examinations.` : 'Conceptual chapter with focus on structural flow and analytical answers.'}

- SI Unit verification ensures zero marks lost on numerical calculations.
- Always write the initial formula, substitution, and final answer with units.`
    },
    {
      id: `tab-${chapter.id}-dpp`,
      title: 'Practice DPP & Past Questions',
      fileName: `DPP_Chapter_${chapter.number}_CBSE.pdf`,
      type: 'pdf',
      status: 'reading',
      pinned: false,
      sizeBytes: 1450000,
      content: `CBSE Chapter ${chapter.number} Practice Worksheet

Section A: 1-Mark Multiple Choice Questions
Section B: 2-Mark Short Answer Questions
Section C: 3-Mark Derivations & Numericals
Section D: 5-Mark Case Study Questions`
    }
  ];
}

// Legacy exports for existing components
export const CHAPTERS: Record<string, Chapter[]> = CLASS_CHAPTERS_MAP['class-9'];

export const INITIAL_WEAK_TOPICS: WeakTopic[] = [
  { id: 'wt-1', subject: 'Science', topic: 'Derivation of 2as = v² - u² by Graphical Method', chapter: 'Chapter 8: Motion', doubtCount: 42, severity: 'high', recommendedAction: 'Review velocity-time area trapezoid breakdown in Vault tab' },
  { id: 'wt-2', subject: 'Science', topic: 'Conversion between km/h and m/s (5/18 factor)', chapter: 'Chapter 8: Motion', doubtCount: 29, severity: 'medium', recommendedAction: 'Practice 5 conversion drill problems in DPP' },
  { id: 'wt-3', subject: 'Mathematics', topic: 'Factor Theorem for Cubic Polynomials', chapter: 'Chapter 2: Polynomials', doubtCount: 35, severity: 'high', recommendedAction: 'Solve trial factor identification method' },
];

export const INITIAL_ANALYTICS: CohortAnalytics[] = [
  { chapterId: 'sci-ch8', chapterTitle: 'Motion', subject: 'Science', totalDoubts: 184, averageMasteryPct: 76, commonMisconception: 'Confusing displacement with total distance during circular motion', mostQueriedDoc: 'Motion_Formula_Vault.md' },
  { chapterId: 'sci-ch9', chapterTitle: 'Force & Laws of Motion', subject: 'Science', totalDoubts: 120, averageMasteryPct: 81, commonMisconception: 'Believing an object requires continuous force to maintain constant velocity', mostQueriedDoc: 'Newton_Laws_Derivations.pdf' },
];

export const COHORT_ANALYTICS: CohortAnalytics[] = INITIAL_ANALYTICS;
