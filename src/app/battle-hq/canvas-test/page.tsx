'use client';

// src/app/battle-hq/canvas-test/page.tsx
//
// ⚠️ DELETE BEFORE V1 SHIP ⚠️
//
// Throwaway test harness for AnnotationCanvas. Not linked from any nav.
// Purpose: validate mobile touch UX for react-konva before we commit
// the canvas to the real plan editor + plan view pages.
//
// Access: any signed-in user. Not Founding-gated — keeps test loop fast.
// Deletion: remove this file + its folder when V1 frontend ships.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AnnotationCanvas, { type AnnotationsJson } from '@/components/battle-hq/AnnotationCanvas';

// Embedded SVG sample map — grid with labels. Base64-encoded so zero network hit.
const SAMPLE_MAP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#1a1a2e"/>
  <defs>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2d2d4a" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#grid)"/>
  <circle cx="200" cy="200" r="40" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
  <text x="200" y="205" text-anchor="middle" fill="#fca5a5" font-family="monospace" font-size="14" font-weight="bold">ENEMY HQ</text>
  <circle cx="600" cy="400" r="40" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
  <text x="600" y="405" text-anchor="middle" fill="#86efac" font-family="monospace" font-size="14" font-weight="bold">YOUR HQ</text>
  <rect x="350" y="250" width="100" height="100" fill="#3730a3" stroke="#818cf8" stroke-width="2" opacity="0.6"/>
  <text x="400" y="305" text-anchor="middle" fill="#c7d2fe" font-family="monospace" font-size="12" font-weight="bold">BUFFER ZONE</text>
  <text x="400" y="40" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="18" font-weight="bold">CANVAS TEST — SAMPLE MAP</text>
  <text x="400" y="580" text-anchor="middle" fill="#71717a" font-family="monospace" font-size="11">Draw shapes, place pins, test rotation and touch</text>
</svg>
`.trim();

// Convert SVG to data URL (UTF-8 safe, no window dependency at module scope)
function getSampleMapUrl(): string {
  if (typeof window === 'undefined') return '';
  const encoded = window.btoa(unescape(encodeURIComponent(SAMPLE_MAP_SVG)));
  return `data:image/svg+xml;base64,${encoded}`;
}

const LS_KEY = 'lwsb_canvas_test_annotations';

export default function CanvasTestPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [annotations, setAnnotations] = useState<AnnotationsJson>({ version: 1, shapes: [] });
  const [mapUrl, setMapUrl] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<string>('');

  // ── Auth gate ──
  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      setAuthChecked(true);
    }
    check();
  }, [router]);

  // ── Build sample map URL client-side ──
  useEffect(() => {
    setMapUrl(getSampleMapUrl());
  }, []);

  // ── Canvas change handler ──
  function handleChange(next: AnnotationsJson) {
    setAnnotations(next);
  }

  // ── Save / Load / Clear localStorage round-trip ──
  function handleSave() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(annotations));
      setSavedNotice(`Saved ${annotations.shapes.length} shape${annotations.shapes.length === 1 ? '' : 's'} at ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setSavedNotice(''), 3000);
    } catch {
      setSavedNotice('Save failed');
    }
  }

  function handleLoad() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        setSavedNotice('Nothing saved yet');
        setTimeout(() => setSavedNotice(''), 2000);
        return;
      }
      const parsed = JSON.parse(raw) as AnnotationsJson;
      setAnnotations(parsed);
      setSavedNotice(`Loaded ${parsed.shapes?.length ?? 0} shapes`);
      setTimeout(() => setSavedNotice(''), 2000);
    } catch {
      setSavedNotice('Load failed');
    }
  }

  function handleClearSaved() {
    try {
      localStorage.removeItem(LS_KEY);
      setSavedNotice('Cleared saved');
      setTimeout(() => setSavedNotice(''), 2000);
    } catch {
      /* noop */
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">DEV</span>
            <span className="text-sm font-bold text-white">Canvas Test Harness</span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Instructions */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <p className="text-xs font-bold text-amber-400 font-mono tracking-wider uppercase">
            Mobile Test Checklist
          </p>
          <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
            <li>Each tool draws cleanly — no stray strokes when you mean to tap</li>
            <li>Page doesn&apos;t scroll or zoom while drawing on the canvas</li>
            <li>Pinch-zoom on the canvas doesn&apos;t pinch-zoom the whole page</li>
            <li>Text tool opens the keyboard on tap, commits on Enter or blur</li>
            <li>Rotating the phone re-fits the canvas without losing shapes</li>
            <li>Undo/Redo/Clear all work</li>
            <li>Save → refresh page → Load → shapes come back intact</li>
          </ul>
        </div>

        {/* Canvas */}
        {mapUrl && (
          <AnnotationCanvas
            imageUrl={mapUrl}
            initialAnnotations={annotations}
            onChange={handleChange}
          />
        )}

        {/* Persistence controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-md text-[11px] font-bold font-mono tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            SAVE → LOCALSTORAGE
          </button>
          <button
            onClick={handleLoad}
            className="px-3 py-1.5 rounded-md text-[11px] font-bold font-mono tracking-wider bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            LOAD
          </button>
          <button
            onClick={handleClearSaved}
            className="px-3 py-1.5 rounded-md text-[11px] font-bold font-mono tracking-wider bg-red-950/60 border border-red-900/60 text-red-400 hover:bg-red-900/60 transition-colors"
          >
            CLEAR SAVED
          </button>
          {savedNotice && (
            <span className="text-[11px] text-zinc-500 font-mono">{savedNotice}</span>
          )}
        </div>

        {/* Live JSON preview */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              Live JSON Output
            </span>
            <span className="text-[10px] font-mono text-zinc-600">
              {annotations.shapes.length} shape{annotations.shapes.length === 1 ? '' : 's'}
            </span>
          </div>
          <pre className="p-3 text-[10px] text-zinc-400 font-mono overflow-x-auto max-h-64 overflow-y-auto">
            {JSON.stringify(annotations, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}