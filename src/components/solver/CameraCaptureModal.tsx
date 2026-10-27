'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RotateCw, Check, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, fileName: string) => void;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setCameraError(null);

    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings or upload a photo directly.'
          : 'Unable to start camera. You can upload an image file instead.'
      );
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else if (!isOpen && stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      setCapturedImage(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, capturedImage, startCamera]);

  const handleSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);

    // Stop video tracks while previewing
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (!capturedImage) return;
    const fileName = `camera_doubt_${Date.now()}.jpg`;
    onCapture(capturedImage, fileName);
    onClose();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFallbackFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onCapture(dataUrl, file.name);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-obsidian border-2 border-structural-dark rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-obsidian-surface px-4 py-3 border-b border-structural-dark flex items-center justify-between text-alabaster">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-royal flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Snap Textbook Question</h3>
              <p className="text-[11px] text-zinc-400">Position diagram or equation inside frame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Canvas */}
        <div className="relative bg-black flex-1 min-h-[340px] flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Captured Preview */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured question"
                className="max-h-[380px] w-auto object-contain rounded-lg"
              />
              <div className="absolute top-3 left-3 bg-mint/90 text-obsidian text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                <Check className="w-3.5 h-3.5" />
                <span>Photo Captured!</span>
              </div>
            </div>
          ) : cameraError ? (
            /* Error & Fallback upload */
            <div className="p-6 text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-amber mx-auto mb-3" />
              <p className="text-xs text-zinc-300 mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-royal text-white font-semibold text-xs hover:bg-royal-hover transition shadow"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Question Photo Instead</span>
              </button>
            </div>
          ) : (
            /* Live Camera Stream */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover max-h-[420px]"
              />

              {/* Viewfinder Overlay Targeting Box */}
              <div className="absolute inset-8 border-2 border-dashed border-royal/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-[10px] font-mono font-bold text-mint uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded self-start">
                  <span>Target Zone</span>
                </div>
                <div className="text-[10px] text-zinc-300 text-center bg-black/60 py-1 px-3 rounded-full self-center">
                  Align textbook question or derivation here
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-zinc-300">
                  <Sparkles className="w-4 h-4 text-royal animate-spin mr-2" />
                  Starting Camera...
                </div>
              )}
            </div>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Hidden Fallback File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFallbackFileUpload}
            className="hidden"
          />
        </div>

        {/* Footer Controls */}
        <div className="bg-obsidian-surface px-4 py-3.5 border-t border-structural-dark flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-mint text-obsidian font-bold text-xs hover:bg-emerald-400 transition shadow-lg shadow-mint/20"
              >
                <Check className="w-4 h-4" />
                <span>Solve This Question</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-800 transition"
                title="Upload from gallery"
              >
                <ImageIcon className="w-4 h-4 text-royal" />
                <span className="hidden sm:inline">Upload Image</span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleSnap}
                disabled={isInitializing || !!cameraError}
                className="w-14 h-14 rounded-full border-4 border-white bg-royal hover:bg-royal-hover disabled:opacity-50 flex items-center justify-center shadow-lg transform active:scale-95 transition"
                aria-label="Take Photo"
              >
                <div className="w-10 h-10 rounded-full bg-white/30" />
              </button>

              {/* Flip Camera */}
              <button
                type="button"
                onClick={toggleCamera}
                disabled={isInitializing || !!cameraError}
                className="p-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition disabled:opacity-50"
                title="Switch front/back camera"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
