import { SocraticSolution } from './types';
import { generateUUID } from './sanitizer';

export function solveSocraticDoubt(query: string, chapterTitle: string, attachedTabTitle?: string): SocraticSolution {
  const qLower = query.toLowerCase();

  // 1. Train starting from rest / Kinematics numerical
  if (qLower.includes('train') || qLower.includes('acceleration') || qLower.includes('speed') || qLower.includes('velocity') || qLower.includes('rest')) {
    return {
      id: generateUUID(),
      doubtQuery: query,
      conceptLink: {
        chapter: 'Science (Class IX) • Chapter 8: Motion',
        topic: 'First & Second Equations of Uniformly Accelerated Motion',
        syllabusCode: 'CBSE-IX-SCI-8.5'
      },
      givenData: [
        'Initial velocity ($$u$$) = $$0\\text{ m/s}$$ (since object starts from rest)',
        'Final velocity ($$v$$) = $$72\\text{ km/h} = 72 \\times \\frac{5}{18} = 20\\text{ m/s}$$',
        'Time taken ($$t$$) = $$5\\text{ minutes} = 5 \\times 60 = 300\\text{ seconds}$$'
      ],
      formulaSpotlight: {
        formulaLatex: 'a = \\frac{v - u}{t} \\quad \\text{and} \\quad s = ut + \\frac{1}{2}at^2',
        name: 'Kinematic Equations of Motion',
        law: 'Newtonian Kinematics for Uniform Linear Acceleration',
        notes: 'Always convert speeds from km/h to SI units (m/s) before applying kinematic equations.'
      },
      derivationSteps: [
        {
          stepNumber: 1,
          title: 'Calculate Uniform Acceleration',
          explanation: 'Apply the definition of acceleration as rate of change of velocity over time:',
          latexMath: 'a = \\frac{20\\text{ m/s} - 0\\text{ m/s}}{300\\text{ s}} = \\frac{20}{300} = \\frac{1}{15}\\text{ m/s}^2 \\approx 0.067\\text{ m/s}^2'
        },
        {
          stepNumber: 2,
          title: 'Find Total Distance Traveled',
          explanation: 'Use the second equation of motion ($$s = ut + \\frac{1}{2}at^2$$) with $$u = 0$$:',
          latexMath: 's = (0)(300) + \\frac{1}{2}\\left(\\frac{1}{15}\\right)(300)^2 = \\frac{1}{30} \\times 90000 = 3000\\text{ metres} = 3\\text{ km}'
        },
        {
          stepNumber: 3,
          title: 'Alternative Cross-Verification via Third Equation',
          explanation: 'Check using $$v^2 - u^2 = 2as$$:',
          latexMath: 's = \\frac{v^2 - u^2}{2a} = \\frac{20^2 - 0}{2 \\times (1/15)} = \\frac{400}{2/15} = 400 \\times 7.5 = 3000\\text{ m}'
        }
      ],
      microQuiz: {
        question: 'If the train decelerated uniformly to rest in 150 seconds from 20 m/s, what would the magnitude of its retardation be?',
        options: ['0.133 m/s²', '0.20 m/s²', '1.33 m/s²', '0.05 m/s²'],
        correctIndex: 0,
        explanation: 'Retardation = (0 - 20) / 150 = -0.133 m/s², so magnitude is 0.133 m/s².'
      },
      verified: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 2. Graphical Derivation of Motion Equations
  if (qLower.includes('graph') || qLower.includes('derive') || qLower.includes('derivation')) {
    return {
      id: generateUUID(),
      doubtQuery: query,
      conceptLink: {
        chapter: 'Science (Class IX) • Chapter 8: Motion',
        topic: 'Velocity-Time Graph & Derivation of Kinematic Relations',
        syllabusCode: 'CBSE-IX-SCI-8.5.2'
      },
      givenData: [
        'Consider a body with initial velocity $$u$$ at $$t = 0$$ (point A)',
        'Velocity uniformly increases to $$v$$ at time $$t$$ (point B)',
        'Slope of velocity-time graph represents acceleration $$a$$',
        'Area enclosed under the v-t graph represents distance traveled $$s$$'
      ],
      formulaSpotlight: {
        formulaLatex: 's = \\text{Area of Rectangle OADC} + \\text{Area of Triangle ABD}',
        name: 'Position-Time Relation by Graphical Method',
        law: 'Geometric Integral of Velocity-Time Curve',
        notes: 'The area under a v-t curve represents displacement regardless of whether motion is uniform or uniformly accelerated.'
      },
      derivationSteps: [
        {
          stepNumber: 1,
          title: 'Break the Geometric Area into Components',
          explanation: 'Distance $$s$$ = Area of trapezium $$OABC$$ = Area of rectangle $$OADC$$ + Area of triangle $$ABD$$:',
          latexMath: '\\text{Area of Rectangle} = OA \\times OC = u \\times t'
        },
        {
          stepNumber: 2,
          title: 'Calculate Triangular Area for Accelerated Component',
          explanation: 'The height of the triangle is change in velocity $$BD = v - u = at$$:',
          latexMath: '\\text{Area of Triangle} = \\frac{1}{2} \\times \\text{Base} \\times \\text{Height} = \\frac{1}{2} \\times t \\times (at) = \\frac{1}{2}at^2'
        },
        {
          stepNumber: 3,
          title: 'Sum the Areas to Obtain the Formula',
          explanation: 'Combining both geometric partitions yields the second equation of motion:',
          latexMath: 's = ut + \\frac{1}{2}at^2'
        }
      ],
      microQuiz: {
        question: 'What physical quantity is represented by the slope of a Velocity-Time graph?',
        options: ['Speed', 'Acceleration', 'Distance', 'Momentum'],
        correctIndex: 1,
        explanation: 'Slope of v-t curve is Δv / Δt, which is the definition of acceleration.'
      },
      verified: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 3. Distance vs Displacement
  if (qLower.includes('distance') || qLower.includes('displacement')) {
    return {
      id: generateUUID(),
      doubtQuery: query,
      conceptLink: {
        chapter: 'Science (Class IX) • Chapter 8: Motion',
        topic: 'Scalar vs Vector Kinematics',
        syllabusCode: 'CBSE-IX-SCI-8.1'
      },
      givenData: [
        'Distance is the actual length of path traversed by a moving body',
        'Displacement is the shortest straight-line vector from initial position to final position',
        'Reference context: ' + (attachedTabTitle || 'NCERT Textbook Chapter 8')
      ],
      formulaSpotlight: {
        formulaLatex: '|\\vec{\\Delta r}| \\le \\text{Distance}',
        name: 'Distance-Displacement Fundamental Inequality',
        law: 'Euclidean Space Triangle Inequality',
        notes: 'Displacement can be zero even if distance is positive (e.g. completing one circular lap).'
      },
      derivationSteps: [
        {
          stepNumber: 1,
          title: 'Consider a Circular Path Case Study',
          explanation: 'An athlete completes one round of a circular track of radius $$r$$ in time $$t$$:',
          latexMath: '\\text{Distance} = 2\\pi r, \\quad \\text{Displacement} = 0\\text{ (initial position = final position)}'
        },
        {
          stepNumber: 2,
          title: 'Directional Dependency (Scalar vs Vector)',
          explanation: 'Distance has only magnitude and can never be negative. Displacement has magnitude and direction, and can be positive, negative, or zero.'
        }
      ],
      microQuiz: {
        question: 'Can the magnitude of displacement ever be strictly greater than the distance traveled?',
        options: ['Yes, always', 'No, never', 'Only in circular motion', 'Only when accelerating'],
        correctIndex: 1,
        explanation: 'Shortest distance between two points is a straight line, so displacement magnitude is always ≤ distance.'
      },
      verified: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 4. Default General Socratic Solution
  return {
    id: generateUUID(),
    doubtQuery: query,
    conceptLink: {
      chapter: chapterTitle,
      topic: 'Core Conceptual Resolution',
      syllabusCode: 'CBSE-IX-CORE'
    },
    givenData: [
      `Query Analysis: "${query.slice(0, 80)}..."`,
      attachedTabTitle ? `Active Tab Reference: ${attachedTabTitle}` : 'General Syllabus Inquiry',
      'Class IX NCERT Learning Outcome Alignment'
    ],
    formulaSpotlight: {
      formulaLatex: '\\text{Concept} \\iff \\text{Core Principle} + \\text{Mathematical Application}',
      name: 'Conceptual Formulation',
      law: 'Fundamental Theorem of CBSE Class IX Syllabus',
      notes: 'Break multi-step questions into given parameters, formula substitution, and SI unit consistency.'
    },
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Identify Core Variables and Invariants',
        explanation: 'Carefully identify which quantities remain constant and what is being asked in the problem statement.'
      },
      {
        stepNumber: 2,
        title: 'Step-by-Step Analytical Breakdown',
        explanation: `Analyzing query in relation to ${chapterTitle}: Always write known formulas before substituting values.`
      },
      {
        stepNumber: 3,
        title: 'Synthesize Final Solution & Verify Units',
        explanation: 'Check whether final answer has proper SI units and matches physical intuition.'
      }
    ],
    microQuiz: {
      question: 'Which of the following is an essential practice when answering numerical questions in CBSE examinations?',
      options: ['Skip units to save time', 'Always write formulas and specify SI units in the final answer', 'Only write the final number', 'Guess the intermediate steps'],
      correctIndex: 1,
      explanation: 'CBSE step marking allocates dedicated marks for formula statement and final SI unit.'
    },
    verified: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
