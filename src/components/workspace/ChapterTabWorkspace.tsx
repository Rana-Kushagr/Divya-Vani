'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  FileCode, 
  Video, 
  Image as ImageIcon, 
  Plus, 
  X, 
  Pin, 
  Sparkles, 
  BookOpen 
} from 'lucide-react';
import { DocumentTab } from '@/lib/types';
import SecureDocumentUploader from './SecureDocumentUploader';
import DocumentViewerPane from './DocumentViewerPane';

interface ChapterTabWorkspaceProps {
  tabs: DocumentTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onAddTab: (newTab: DocumentTab) => void;
  onCloseTab: (id: string) => void;
  onTogglePinTab: (id: string) => void;
  onAskFromContext: (selectedText: string) => void;
}

export default function ChapterTabWorkspace({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onCloseTab,
  onTogglePinTab,
  onAskFromContext,
}: ChapterTabWorkspaceProps) {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-3.5 h-3.5 text-royal" />;
      case 'markdown': return <FileCode className="w-3.5 h-3.5 text-mint" />;
      case 'video': return <Video className="w-3.5 h-3.5 text-amber" />;
      case 'image': return <ImageIcon className="w-3.5 h-3.5 text-blue-500" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border-1.5 border-structural-dark bg-obsidian-surface shadow-block-dark">
      
      {/* IDE-Style Tab Bar */}
      <div className="bg-obsidian border-b border-structural-dark flex items-center justify-between px-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 py-1.5 min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab?.id;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => onSelectTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectTab(tab.id);
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-alabaster text-obsidian font-semibold border-structural-light shadow-sm'
                    : 'bg-obsidian-surface text-zinc-400 hover:text-alabaster hover:bg-zinc-800/80 border-transparent'
                }`}
              >
                {getTabIcon(tab.type)}
                <span className="truncate max-w-[130px]">{tab.title}</span>

                {/* Status indicator pill */}
                {tab.status === 'ai_indexed' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-mint" title="AI-Indexed" />
                )}

                {/* Pin button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinTab(tab.id);
                  }}
                  className={`p-0.5 rounded transition-opacity ${
                    tab.pinned ? 'text-amber opacity-100' : 'text-zinc-500 opacity-0 group-hover:opacity-100'
                  }`}
                  title={tab.pinned ? 'Unpin tab' : 'Pin tab'}
                >
                  <Pin className="w-3 h-3" />
                </button>

                {/* Close button (only for unpinned tabs or when > 1 tab) */}
                {tabs.length > 1 && !tab.pinned && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="p-0.5 rounded text-zinc-500 hover:text-red-500 transition-colors"
                    title="Close tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Document Tab Button */}
          <button
            onClick={() => setUploaderOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-alabaster hover:bg-zinc-800 transition-colors border border-dashed border-zinc-700 ml-1"
            title="Upload new document or past year question bank"
          >
            <Plus className="w-3.5 h-3.5 text-mint" />
            <span>Add Doc</span>
          </button>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div className="flex-1 min-h-[480px] p-2 bg-obsidian">
        <DocumentViewerPane
          activeTab={activeTab}
          onAskFromContext={onAskFromContext}
        />
      </div>

      {/* Upload Modal */}
      <SecureDocumentUploader
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onUploadSuccess={onAddTab}
      />
    </div>
  );
}
