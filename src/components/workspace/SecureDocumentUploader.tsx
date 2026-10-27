'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { FileUploadSchema } from '@/lib/validation';
import { generateUUID } from '@/lib/sanitizer';
import { DocumentTab, DocumentType } from '@/lib/types';

interface SecureDocumentUploaderProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUploadSuccess: (newTab: DocumentTab) => void;
}

export default function SecureDocumentUploader({
  isOpen,
  onClose,
  onUploadSuccess,
}: SecureDocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setErrorMsg(null);

    // Zod validation
    const validationResult = FileUploadSchema.safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validationResult.success) {
      setErrorMsg(validationResult.error.errors[0]?.message || 'Invalid file format or size exceeds security limits.');
      return;
    }

    setUploading(true);

    const lowerName = file.name.toLowerCase();
    let docType: DocumentType = 'text';
    if (lowerName.endsWith('.pdf')) docType = 'pdf';
    else if (lowerName.endsWith('.md')) docType = 'markdown';
    else if (lowerName.endsWith('.mp4') || lowerName.endsWith('.webm')) docType = 'video';
    else if (lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.webp')) docType = 'image';

    if (docType === 'markdown' || docType === 'text') {
      try {
        const textContent = await file.text();
        const newTab: DocumentTab = {
          id: generateUUID(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          fileName: file.name,
          type: docType,
          status: 'reading',
          sizeBytes: file.size,
          content: textContent,
        };
        setUploading(false);
        onUploadSuccess(newTab);
        onClose();
      } catch (_err) {
        setErrorMsg('Error reading file contents');
        setUploading(false);
      }
    } else {
      const blobUrl = URL.createObjectURL(file);
      const newTab: DocumentTab = {
        id: generateUUID(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        type: docType,
        status: 'reading',
        sizeBytes: file.size,
        fileUrl: blobUrl,
      };
      setTimeout(() => {
        setUploading(false);
        onUploadSuccess(newTab);
        onClose();
      }, 350);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      void processFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      void processFile(selectedFile);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-in fade-in"
      aria-modal="true"
      aria-labelledby="uploader-title"
    >
      <div className="bg-obsidian-surface border-2 border-structural-dark rounded-2xl max-w-lg w-full p-6 shadow-black-block text-alabaster relative">
        <div className="flex items-center justify-between pb-4 border-b border-structural-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-royal/20 border border-royal flex items-center justify-center text-royal-light">
              <UploadCloud className="w-4 h-4 text-mint" />
            </div>
            <div>
              <h3 id="uploader-title" className="text-base font-bold text-alabaster">
                Add Chapter Document
              </h3>
              <p className="text-[11px] text-zinc-400">
                Instant tab creation with Constitution security filter
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-alabaster p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full mt-5 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-royal bg-royal/10 scale-[0.99]'
              : 'border-zinc-700 bg-obsidian hover:border-zinc-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.md,.txt,.mp4"
            onChange={handleChange}
          />
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
            <UploadCloud className="w-6 h-6 text-royal-light" />
          </div>
          <p className="text-sm font-semibold text-alabaster mb-1">
            {uploading ? 'Validating and reading document...' : 'Click to browse or drag file here'}
          </p>
          <p className="text-xs text-zinc-400 max-w-xs">
            Supports NCERT chapter PDFs, Markdown notes, question banks, and diagrams
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span>Allowed: .pdf, .md, .txt, .png, .jpg, .mp4</span>
            <span>•</span>
            <span>Max 100 MB</span>
          </div>
        </button>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-5 p-3 rounded-xl bg-obsidian border border-structural-dark flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-mint" />
            <span>OWASP Guarded: Executables (.exe, .html, .svg) blocked</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">UUIDv4 Indexed</span>
        </div>
      </div>
    </div>
  );
}
