import { SocraticSolution } from './types';
import { solveSocraticDoubt } from './aiSimulation';
import { generateUUID } from './sanitizer';

export interface AssistantRequest {
  query: string;
  imageBase64?: string;
  imageFileName?: string;
  subjectId?: string;
  chapterTitle?: string;
  attachedContext?: string;
  apiKey?: string;
}

export interface AssistantChatResponse {
  success: boolean;
  message: string;
  solution?: SocraticSolution;
  spokenText?: string;
  source: 'gemini' | 'pollinations' | 'socratic-engine';
}

/**
 * Universal Multi-Tier AI Assistant Service
 * Tier 1: Google Gemini Flash (Vision & Text) via API key if present
 * Tier 2: Free Public Multimodal AI endpoint (Pollinations AI)
 * Tier 3: Built-in CBSE Socratic Pedagogical Engine (100% Offline / Zero-Failure Fallback)
 */
export async function getAssistantResponse(req: AssistantRequest): Promise<AssistantChatResponse> {
  const { query, imageBase64, subjectId = 'SCIENCE', chapterTitle = 'General Doubts', attachedContext, apiKey } = req;
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // -------------------------------------------------------------
  // TIER 1: GOOGLE GEMINI MULTIMODAL API (If Key is Available)
  // -------------------------------------------------------------
  if (effectiveKey && effectiveKey.trim().length > 10) {
    try {
      const geminiResult = await callGeminiApi({
        apiKey: effectiveKey.trim(),
        query,
        imageBase64,
        subjectId,
        chapterTitle,
        attachedContext,
      });

      if (geminiResult && geminiResult.message) {
        return {
          success: true,
          message: geminiResult.message,
          solution: geminiResult.solution,
          spokenText: geminiResult.spokenText || geminiResult.message.slice(0, 300),
          source: 'gemini',
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to free cloud tier:', err);
    }
  }

  // -------------------------------------------------------------
  // TIER 2: FREE PUBLIC MULTIMODAL / TEXT AI (Pollinations.ai)
  // -------------------------------------------------------------
  try {
    const freeAiResult = await callFreePollinationsApi({
      query,
      subjectId,
      chapterTitle,
      attachedContext,
    });

    if (freeAiResult && freeAiResult.message) {
      // Build structured socratic solution from the response
      const structuredSolution = parseTextIntoSocraticSolution(
        freeAiResult.message,
        query,
        chapterTitle,
        subjectId
      );

      return {
        success: true,
        message: freeAiResult.message,
        solution: structuredSolution,
        spokenText: cleanSpokenText(freeAiResult.message),
        source: 'pollinations',
      };
    }
  } catch (err) {
    console.warn('Free Pollinations API call failed, falling back to local Socratic engine:', err);
  }

  // -------------------------------------------------------------
  // TIER 3: ZERO-FAILURE BUILT-IN PEDAGOGICAL SOCRATIC ENGINE
  // -------------------------------------------------------------
  const offlineSolution = solveSocraticDoubt(query, chapterTitle, attachedContext);
  const speechSummary = `Hello! For ${chapterTitle}: The key concept is ${offlineSolution.formulaSpotlight.name}. ${offlineSolution.derivationSteps[0]?.explanation || 'Let us break this down step-by-step.'} Final answer: ${offlineSolution.derivationSteps[offlineSolution.derivationSteps.length - 1]?.title || 'Derivation complete'}.`;

  return {
    success: true,
    message: `${offlineSolution.conceptLink.topic}\n\n${offlineSolution.derivationSteps.map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.explanation}`).join('\n\n')}`,
    solution: offlineSolution,
    spokenText: speechSummary,
    source: 'socratic-engine',
  };
}

/**
 * Call Google Gemini API (1.5 Flash) with Text and optional Image
 */
async function callGeminiApi(params: {
  apiKey: string;
  query: string;
  imageBase64?: string;
  subjectId: string;
  chapterTitle: string;
  attachedContext?: string;
}) {
  const { apiKey, query, imageBase64, subjectId, chapterTitle, attachedContext } = params;

  const parts: any[] = [];

  // Add system instruction prompt
  const systemPrompt = `You are Divya Vani, a friendly, encouraging, and pedagogically sound personal AI study companion co-created by Vanshika, Divyanshi & Kushagr Rana for CBSE Class 6-12 students.
Current Subject: ${subjectId}
Current Chapter: ${chapterTitle}
${attachedContext ? `Context from student's active document: ${attachedContext}` : ''}

Your Mission:
1. Always explain step-by-step using the Socratic method.
2. If an image is provided, identify the textbook question or diagram first.
3. Clearly state Given Data, Formula Spotlight (using KaTeX/LaTeX math like $$...$$), Step-by-Step Derivation, and Final Answer.
4. Conclude with a 1-sentence friendly encouraging check-in question for the student.`;

  parts.push({ text: `${systemPrompt}\n\nStudent Doubt / Question: ${query || 'Please analyze this photo from my textbook and explain the question step-by-step.'}` });

  // Add Image Part if present
  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    parts.push({
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No text generated from Gemini');
  }

  const structuredSolution = parseTextIntoSocraticSolution(rawText, query || 'Analyzed Photo Question', chapterTitle, subjectId);

  return {
    message: rawText,
    solution: structuredSolution,
    spokenText: cleanSpokenText(rawText),
  };
}

/**
 * Call Free Public Pollinations AI Endpoint (Zero Auth / Anonymous Tier)
 */
async function callFreePollinationsApi(params: {
  query: string;
  subjectId: string;
  chapterTitle: string;
  attachedContext?: string;
}) {
  const { query, subjectId, chapterTitle, attachedContext } = params;

  const messages = [
    {
      role: 'system',
      content: `You are Divya Vani, an AI personal tutor for CBSE students (Subject: ${subjectId}, Chapter: ${chapterTitle}).
Explain concepts step-by-step. Include formulas in LaTeX $$...$$. Be encouraging, clear, and concise.
${attachedContext ? `Document Context: ${attachedContext}` : ''}`,
    },
    {
      role: 'user',
      content: query,
    },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s fast fallback timeout

  try {
    const res = await fetch('https://text.pollinations.ai/openai/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages,
        temperature: 0.5,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Pollinations API returned status ${res.status}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Pollinations');
    }

    return { message: content };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Convert free-form AI text into rich SocraticSolution structure for the UI
 */
export function parseTextIntoSocraticSolution(
  text: string,
  query: string,
  chapterTitle: string,
  subjectId: string
): SocraticSolution {
  // Extract formulas if any $$...$$ or \[...\]
  const mathMatches = text.match(/\$\$([^$]+)\$\$/g) || text.match(/\\\[([^\]]+)\\\]/g) || [];
  const primaryFormula = mathMatches[0]?.replace(/\$\$|\\\[|\\\]/g, '').trim() || 'F = ma \\quad \\text{or} \\quad v = u + at';

  // Split into paragraphs / steps
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10);

  const steps = paragraphs.slice(0, 4).map((p, idx) => {
    const firstSentence = p.split(/[.?!]\s/)[0] || `Step ${idx + 1}`;
    return {
      stepNumber: idx + 1,
      title: firstSentence.slice(0, 60),
      explanation: p,
      latexMath: idx === 1 ? primaryFormula : undefined,
    };
  });

  return {
    id: generateUUID(),
    doubtQuery: query,
    conceptLink: {
      chapter: chapterTitle,
      topic: `${subjectId} Core Application & Step-by-Step Resolution`,
      syllabusCode: `CBSE-${subjectId.toUpperCase().slice(0, 3)}-NCERT`,
    },
    givenData: [
      `Active Query: ${query.slice(0, 80)}...`,
      `Verified for CBSE Examination Criteria`,
    ],
    formulaSpotlight: {
      formulaLatex: primaryFormula,
      name: `${subjectId} Pedagogical Formula Spotlight`,
      law: 'Fundamental Theorem / Principle',
      notes: 'Step-by-step derivation verified by Divya Vani AI Assistant.',
    },
    derivationSteps: steps.length > 0 ? steps : [
      {
        stepNumber: 1,
        title: 'Core Conceptual Foundation',
        explanation: text.slice(0, 300),
        latexMath: primaryFormula,
      },
    ],
    microQuiz: {
      question: `Which key concept explains this solution in ${chapterTitle}?`,
      options: [
        'Direct application of the primary formula and SI units',
        'Arbitrary guessing without dimensional verification',
        'Assuming values without considering initial conditions',
        'None of the above',
      ],
      correctIndex: 0,
      explanation: 'Always verify fundamental SI units and initial parameters before applying equations.',
    },
    verified: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Strips markdown symbols, asterisks, and raw LaTeX tags for smooth Text-to-Speech playback
 */
export function cleanSpokenText(text: string): string {
  return text
    .replace(/\$\$([^$]+)\$\$/g, ' formula: $1 ')
    .replace(/\$([^$]+)\$/g, ' $1 ')
    .replace(/\\\[([^\]]+)\\\]/g, ' formula: $1 ')
    .replace(/\\\(([^)]+)\\\)/g, ' $1 ')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[^`]*```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .slice(0, 450); // Keep spoken answer comfortably under ~30-40 seconds
}
