'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Share2, 
  Bookmark, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { SocraticSolution } from '@/lib/types';
import MathRenderer from './MathRenderer';

interface StepByStepSolutionCardProps {
  solution: SocraticSolution;
  onSaveToRevision?: (sol: SocraticSolution) => void;
}

export default function StepByStepSolutionCard({
  solution,
  onSaveToRevision,
}: StepByStepSolutionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedOption(index);
    setQuizSubmitted(true);

    if (index === solution.microQuiz.correctIndex) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#6D28D9', '#F59E0B'],
        });
      } catch (err) {
        // ignore
      }
    }
  };

  const handleSave = () => {
    setSaved(true);
    if (onSaveToRevision) {
      onSaveToRevision(solution);
    }
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Step 1: Concept & Chapter Link Header */}
      <div className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-4 shadow-block-dark text-alabaster">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-mint/15 text-mint border border-mint/40 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Socratic Tutor
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {solution.conceptLink.syllabusCode}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs">{solution.timestamp}</span>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-obsidian border border-structural-dark hover:border-zinc-500 text-zinc-300 hover:text-alabaster transition-colors"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-mint" />
                  <span className="text-mint">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-amber" />
                  <span>Save to Revision</span>
                </>
              )}
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold text-alabaster tracking-tight">
          {solution.conceptLink.topic}
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          {solution.conceptLink.chapter}
        </p>

        {/* Given Data Bullet Points */}
        <div className="mt-4 pt-3 border-t border-structural-dark/80">
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber" />
            <span>Given Parameters & Knowns</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {solution.givenData.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-royal mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {item.includes('$$') ? (
                    <MathRenderer math={item.replace(/\$\$/g, '')} />
                  ) : (
                    item
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step 3: Formula Spotlight Card (Obsidian Black Architectural Block) */}
      <div className="bg-obsidian border-1.5 border-royal/60 rounded-xl p-5 shadow-block-dark text-alabaster relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-royal/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-royal text-white">
              Formula Spotlight
            </span>
            <span className="text-xs font-bold text-alabaster">
              {solution.formulaSpotlight.name}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {solution.formulaSpotlight.law}
          </span>
        </div>

        {/* Big LaTeX Highlight */}
        <div className="my-3 py-3 px-4 rounded-lg bg-obsidian-surface border border-structural-dark text-center overflow-x-auto">
          <MathRenderer math={solution.formulaSpotlight.formulaLatex} block className="text-sm sm:text-base text-mint" />
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed italic">
          💡 {solution.formulaSpotlight.notes}
        </p>
      </div>

      {/* Step 4: Step-by-Step Derivation (Alabaster White Architectural Block) */}
      <div className="bg-alabaster text-obsidian border-1.5 border-structural-light rounded-xl p-5 shadow-block-light">
        <div className="flex items-center justify-between pb-3 border-b border-structural-light mb-4">
          <h4 className="font-extrabold text-sm text-obsidian flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-royal" />
            <span>Step-by-Step Derivation & Solution</span>
          </h4>
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">
            {solution.derivationSteps.length} Steps
          </span>
        </div>

        <div className="space-y-3">
          {solution.derivationSteps.map((step) => {
            const isExpanded = expandedSteps[step.stepNumber] ?? true;
            return (
              <div 
                key={step.stepNumber}
                className="border border-structural-light rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleStep(step.stepNumber)}
                  className="w-full flex items-center justify-between p-3 text-left bg-alabaster-muted hover:bg-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-royal text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {step.stepNumber}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-obsidian">
                      {step.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 text-xs sm:text-sm text-zinc-700 space-y-2 border-t border-structural-light leading-relaxed">
                    <p>{step.explanation}</p>
                    {step.latexMath && (
                      <div className="p-3 my-2 rounded-md bg-zinc-50 border border-zinc-200 text-center overflow-x-auto">
                        <MathRenderer math={step.latexMath} block className="text-xs sm:text-sm font-semibold text-royal" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 5: Self-Check Micro-Quiz */}
      <div className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-5 shadow-block-dark text-alabaster">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-amber" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber">
            Self-Check Micro-Quiz (1-Click Concept Check)
          </h4>
        </div>

        <p className="text-xs sm:text-sm text-zinc-200 font-semibold mb-3">
          {solution.microQuiz.question}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {solution.microQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === solution.microQuiz.correctIndex;
            let btnClass = 'bg-obsidian border-structural-dark text-zinc-300 hover:border-zinc-500';

            if (quizSubmitted) {
              if (isCorrect) {
                btnClass = 'bg-mint/20 border-mint text-mint font-bold';
              } else if (isSelected && !isCorrect) {
                btnClass = 'bg-red-950/40 border-red-800 text-red-300';
              } else {
                btnClass = 'bg-obsidian border-structural-dark text-zinc-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuizAnswer(idx)}
                disabled={quizSubmitted}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${btnClass}`}
              >
                <span>{option}</span>
                {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-mint flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Micro-Quiz Explanation Feedback */}
        {quizSubmitted && (
          <div className="mt-3 p-3 rounded-lg bg-obsidian border border-structural-dark text-xs text-zinc-300 animate-in fade-in leading-relaxed">
            <strong className="text-alabaster">
              {selectedOption === solution.microQuiz.correctIndex ? '🎉 Excellent! ' : '💡 Review Note: '}
            </strong>
            {solution.microQuiz.explanation}
          </div>
        )}
      </div>

    </div>
  );
}
