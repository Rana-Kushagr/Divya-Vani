'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  BookOpen 
} from 'lucide-react';
import { DocumentTab } from '@/lib/types';

interface DocumentViewerPaneProps {
  activeTab?: DocumentTab;
  onAskFromContext: (selectedText: string) => void;
}

export default function DocumentViewerPane({
  activeTab,
  onAskFromContext,
}: DocumentViewerPaneProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  if (!activeTab) {
    return (
      <div className="h-full bg-alabaster rounded-xl p-8 flex flex-col items-center justify-center text-center text-zinc-500 border border-structural-light">
        <BookOpen className="w-12 h-12 text-zinc-300 mb-3" />
        <h4 className="font-bold text-obsidian text-base">No Chapter Document Selected</h4>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          Select or add a tab from the Chapter Vault above to read notes, formulas, or past papers.
        </p>
      </div>
    );
  }

  const handleTextSelection = () => {
    const sel = window.getSelection()?.toString().trim();
    if (sel && sel.length > 5) {
      setSelectedText(sel);
    } else {
      setSelectedText('');
    }
  };

  const handleCopy = () => {
    if (activeTab.content) {
      void navigator.clipboard.writeText(activeTab.content).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayName = activeTab.fileName || activeTab.title;
  const isVideo = activeTab.type === 'video' || activeTab.type === 'ANIMATION';
  const isImage = activeTab.type === 'image' || activeTab.type === 'DIAGRAM';

  return (
    <div className="h-full flex flex-col bg-alabaster text-obsidian rounded-b-xl border border-t-0 border-structural-light overflow-hidden shadow-white-block">
      
      {/* Viewer Action Ribbon */}
      <div className="bg-alabaster-muted px-4 py-2 border-b border-structural-light flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-obsidian truncate max-w-[220px]">
            {displayName}
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
            {String(activeTab.type)}
          </span>
          {activeTab.sizeBytes && (
            <span className="text-[11px] text-zinc-400">
              ({(activeTab.sizeBytes / 1024).toFixed(0)} KB)
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {selectedText && (
            <button
              onClick={() => onAskFromContext(selectedText)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-royal text-white font-semibold text-xs shadow-sm hover:bg-royal-hover transition-colors animate-pulse"
              title="Send highlighted passage directly to Doubt Solver"
            >
              <Sparkles className="w-3.5 h-3.5 text-mint" />
              <span>Ask Doubt from Highlight</span>
            </button>
          )}

          <div className="flex items-center border border-zinc-300 rounded-md bg-white overflow-hidden">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1.5 hover:bg-zinc-100 text-zinc-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono font-medium text-zinc-700">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1.5 hover:bg-zinc-100 text-zinc-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTab.content && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md border border-zinc-300 hover:bg-zinc-100 text-zinc-600 transition-colors"
              title="Copy notes"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-mint" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Reader Content Body */}
      <div 
        onMouseUp={handleTextSelection}
        className="flex-1 overflow-y-auto p-6 transition-all"
        style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
      >
        {isVideo ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full aspect-video max-w-2xl rounded-xl overflow-hidden shadow-md border border-zinc-300 bg-obsidian">
              <iframe
                src={activeTab.videoUrl || 'https://www.youtube-nocookie.com/embed/n2gQ_S3v4d8'}
                title={activeTab.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-zinc-600">
              <Clock className="w-4 h-4 text-royal" />
              <span>Smart Doubt Sync active: Pausing video automatically logs current timestamp for context.</span>
            </div>
          </div>
        ) : activeTab.fileUrl ? (
          <div className="h-full flex flex-col items-center justify-center">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={activeTab.fileUrl} 
                alt={activeTab.title} 
                className="max-h-[500px] object-contain rounded-lg shadow-sm border border-zinc-200"
              />
            ) : (
              <div className="w-full h-full min-h-[420px] rounded-lg border border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
                <FileText className="w-12 h-12 text-royal mb-2" />
                <h4 className="font-bold text-obsidian text-base">{displayName}</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Document loaded into your local session memory. You can highlight or ask questions anytime.
                </p>
                <a
                  href={activeTab.fileUrl}
                  download={displayName}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal text-white text-xs font-semibold hover:bg-royal-hover shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4 font-sans text-zinc-800 leading-relaxed whitespace-pre-line selection:bg-royal-light selection:text-royal">
            {activeTab.content}
          </div>
        )}
      </div>

    </div>
  );
}
