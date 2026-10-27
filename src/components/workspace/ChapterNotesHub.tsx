'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Brain, 
  Play, 
  Sparkles, 
  Download, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';
import { ChapterMeta, MaterialSubView } from '@/lib/types';

interface ChapterNotesHubProps {
  readonly chapter: ChapterMeta;
  readonly onAskAI: (context: string) => void;
}

interface ActiveMaterialViewerProps {
  readonly activeSubView: MaterialSubView;
  readonly activeVideoUrl?: string;
  readonly chapter: ChapterMeta;
}

function getSubViewTitle(view: MaterialSubView): string {
  if (view === 'ANIMATION') return '🎬 Concept Animated Video';
  if (view === 'MINDMAP') return '🧠 Visual Concept MindMap';
  return '📄 Chapter Revision Notes';
}

function ActiveMaterialViewer({ activeSubView, activeVideoUrl, chapter }: ActiveMaterialViewerProps) {
  if (activeSubView === 'ANIMATION' && activeVideoUrl) {
    return (
      <div className="h-full bg-obsidian flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-black-block border-2 border-structural-dark bg-black relative">
          <video
            key={activeVideoUrl}
            src={activeVideoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-3 flex items-center justify-between w-full max-w-3xl px-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint animate-ping" />
            <span className="font-semibold text-alabaster">
              Dedicated Concept Visualizer • Ch {chapter.number}: {chapter.title}
            </span>
          </div>
          <a
            href={activeVideoUrl}
            download
            className="flex items-center gap-1 text-royal-light hover:underline text-[11px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Video</span>
          </a>
        </div>
      </div>
    );
  }

  if (activeSubView === 'MINDMAP' && chapter.mindMapPdfUrl) {
    return (
      <div className="h-full w-full flex flex-col animate-in fade-in duration-300">
        <div className="flex-1 p-2 bg-zinc-100 flex items-center justify-center overflow-auto">
          <iframe
            src={`${chapter.mindMapPdfUrl}#view=FitH`}
            title={`${chapter.title} MindMap`}
            className="w-full h-full min-h-[540px] rounded-xl border border-structural-light bg-white shadow-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col animate-in fade-in duration-300">
      <div className="flex-1 p-2 bg-zinc-100 flex items-center justify-center overflow-auto">
        <iframe
          src={`${chapter.notesPdfUrl || '/materials/science/9_Science_Ch1_Notes.pdf'}#view=FitH`}
          title={`${chapter.title} Notes`}
          className="w-full h-full min-h-[540px] rounded-xl border border-structural-light bg-white shadow-sm"
        />
      </div>
    </div>
  );
}

export default function ChapterNotesHub({
  chapter,
  onAskAI,
}: ChapterNotesHubProps) {
  // Determine available options for this chapter
  const hasMindMap = Boolean(chapter.mindMapPdfUrl);
  const hasAnimation = Boolean(chapter.animationVideoUrl);
  const hasExtra = chapter.hasExtraMaterials && (hasMindMap || hasAnimation);

  const [activeSubView, setActiveSubView] = useState<MaterialSubView>('NOTES');
  const [activeVideoPart, setActiveVideoPart] = useState<1 | 2>(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const activeVideoUrl = activeVideoPart === 2 && chapter.animationVideoUrl2 
    ? chapter.animationVideoUrl2 
    : chapter.animationVideoUrl;

  return (
    <div className="flex flex-col h-full bg-alabaster rounded-2xl border-2 border-structural-light overflow-hidden shadow-white-block">
      
      {/* Top Header Strip with Dedicated 3 Options */}
      <div className="bg-obsidian text-alabaster px-5 py-3.5 border-b-2 border-structural-dark flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white font-bold text-xs">
            {chapter.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-alabaster">
                Ch {chapter.number}: {chapter.title}
              </span>
              {hasExtra && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40 flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  <span>3D / Extra Content</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              Interactive Syllabus Resource
            </p>
          </div>
        </div>

        {/* Dedicated 3 Options: Notes | Mindmap | Animation (Shown ONLY if chapter has extra materials) */}
        {hasExtra ? (
          <div className="flex items-center gap-1 bg-obsidian-surface p-1 rounded-xl border border-structural-dark shadow-inner">
            {/* 1. Notes Option */}
            <button
              type="button"
              onClick={() => setActiveSubView('NOTES')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeSubView === 'NOTES'
                  ? 'bg-alabaster text-obsidian shadow-sm scale-105'
                  : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-royal" />
              <span>Notes</span>
            </button>

            {/* 2. Mindmap Option (if present) */}
            {hasMindMap && (
              <button
                type="button"
                onClick={() => setActiveSubView('MINDMAP')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeSubView === 'MINDMAP'
                    ? 'bg-alabaster text-obsidian shadow-sm scale-105'
                    : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-800'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-amber" />
                <span>Mindmap</span>
              </button>
            )}

            {/* 3. Animation Option (if present) */}
            {hasAnimation && (
              <button
                type="button"
                onClick={() => setActiveSubView('ANIMATION')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeSubView === 'ANIMATION'
                    ? 'bg-alabaster text-obsidian shadow-sm scale-105'
                    : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-800'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-mint fill-current" />
                <span>Animation</span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-royal" />
            <span>Chapter Notes PDF</span>
          </div>
        )}
      </div>

      {/* Action Strip: Zoom, Ask AI, and External Download */}
      <div className="bg-alabaster-surface px-4 py-2 border-b border-structural-light flex items-center justify-between text-xs text-obsidian">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-zinc-700">
            {getSubViewTitle(activeSubView)}
          </span>
          {chapter.animationVideoUrl2 && activeSubView === 'ANIMATION' && (
            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() => setActiveVideoPart(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeVideoPart === 1 ? 'bg-royal text-white' : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                Part 1
              </button>
              <button
                type="button"
                onClick={() => setActiveVideoPart(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeVideoPart === 2 ? 'bg-royal text-white' : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                Part 2
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Ask AI Context Trigger */}
          <button
            type="button"
            onClick={() => onAskAI(`From Ch ${chapter.number} (${chapter.title}): Explain the core concepts of this ${activeSubView.toLowerCase()} step-by-step.`)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-royal hover:bg-royal-hover text-white text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-mint" />
            <span>Ask AI From This Material</span>
          </button>

          {activeSubView !== 'ANIMATION' && (
            <div className="flex items-center border border-structural-light rounded-md bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1 hover:bg-zinc-100 text-zinc-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[10px] font-mono font-medium text-zinc-700">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1 hover:bg-zinc-100 text-zinc-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Material Canvas */}
      <div className="flex-1 bg-white overflow-hidden relative min-h-[500px]">
        <ActiveMaterialViewer
          activeSubView={activeSubView}
          activeVideoUrl={activeVideoUrl}
          chapter={chapter}
        />
      </div>

    </div>
  );
}
