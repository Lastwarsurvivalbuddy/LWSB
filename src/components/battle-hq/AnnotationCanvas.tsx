'use client';

// src/components/battle-hq/AnnotationCanvas.tsx
// Battle HQ V1 — annotation canvas for battle plan maps.
//
// Architecture:
//   - This file owns state, pointer handlers, undo/redo, toolbar, text overlay.
//   - KonvaCanvas (dynamic-imported, ssr:false) owns rendering of react-konva
//     primitives. Isolated as a single default export because next/dynamic
//     cannot resolve named exports from react-konva cleanly.
//
// Coordinate system:
//   Shape positions are NORMALIZED (0-1). Same JSON renders on any screen.
//
// Mobile:
//   touch-action:none on container, pointer events, ResizeObserver + orientationchange.

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type {
  Tool,
  ColorKey,
  Shape,
  AnnotationsJson,
} from './AnnotationCanvas.types';

export type { AnnotationsJson, Shape, ColorKey } from './AnnotationCanvas.types';

const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), { ssr: false });

const COLOR_MAP: Record<ColorKey, string> = {
  red: '#ef4444',
  amber: '#f0a500',
  sky: '#38bdf8',
  green: '#22c55e',
  purple: '#a855f7',
  white: '#ffffff',
};

export interface AnnotationCanvasProps {
  imageUrl: string;
  initialAnnotations?: AnnotationsJson | null;
  readOnly?: boolean;
  onChange?: (annotations: AnnotationsJson) => void;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function AnnotationCanvas({
  imageUrl,
  initialAnnotations,
  readOnly = false,
  onChange,
}: AnnotationCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  const [imgError, setImgError] = useState<string | null>(null);

  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState<ColorKey>('red');

  const [shapes, setShapes] = useState<Shape[]>(initialAnnotations?.shapes ?? []);
  const undoStack = useRef<Shape[][]>([]);
  const redoStack = useRef<Shape[][]>([]);

  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);

  const [textOverlay, setTextOverlay] = useState<{ nx: number; ny: number; value: string } | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  // Load base image
  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setBgImage(img);
      setImgNatural({ w: img.naturalWidth || 1, h: img.naturalHeight || 1 });
      setImgError(null);
    };
    img.onerror = () => setImgError('Failed to load battle map image.');
    img.src = imageUrl;
  }, [imageUrl]);

  // Fit stage to container
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const recompute = () => {
      const containerW = el.clientWidth;
      if (!containerW || !imgNatural.w || !imgNatural.h) return;
      const aspect = imgNatural.h / imgNatural.w;
      setStageSize({ w: containerW, h: Math.round(containerW * aspect) });
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    window.addEventListener('orientationchange', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', recompute);
    };
  }, [imgNatural]);

  // Emit onChange
  useEffect(() => {
    if (!onChange) return;
    onChange({ version: 1, shapes });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes]);

  // Coord helpers
  const getNormalizedPoint = useCallback(
    (clientX: number, clientY: number): { nx: number; ny: number } | null => {
      const el = containerRef.current;
      if (!el || !stageSize.w || !stageSize.h) return null;
      const rect = el.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (clientX - rect.left) / stageSize.w));
      const ny = Math.max(0, Math.min(1, (clientY - rect.top) / stageSize.h));
      return { nx, ny };
    },
    [stageSize.w, stageSize.h]
  );

  // Undo/Redo/Clear
  const pushUndo = useCallback((prev: Shape[]) => {
    undoStack.current.push(prev);
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    redoStack.current.push(shapes);
    setShapes(prev);
  }, [shapes]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    undoStack.current.push(shapes);
    setShapes(next);
  }, [shapes]);

  const handleClear = useCallback(() => {
    if (shapes.length === 0) return;
    if (!window.confirm('Clear all annotations? This can be undone.')) return;
    pushUndo(shapes);
    setShapes([]);
  }, [shapes, pushUndo]);

  // Pointer handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (readOnly) return;
      if (tool === 'select') return;
      if (textOverlay) return;

      const pt = getNormalizedPoint(e.clientX, e.clientY);
      if (!pt) return;
      const { nx, ny } = pt;

      switch (tool) {
        case 'arrow':
          setDrawingShape({ id: makeId(), type: 'arrow', color, x1: nx, y1: ny, x2: nx, y2: ny });
          break;
        case 'rect':
          setDrawingShape({ id: makeId(), type: 'rect', color, x: nx, y: ny, w: 0, h: 0 });
          break;
        case 'circle':
          setDrawingShape({ id: makeId(), type: 'circle', color, x: nx, y: ny, r: 0 });
          break;
        case 'pen':
          setDrawingShape({ id: makeId(), type: 'pen', color, points: [nx, ny] });
          break;
        case 'text':
          setTextOverlay({ nx, ny, value: '' });
          setTimeout(() => textInputRef.current?.focus(), 0);
          break;
        case 'pin': {
          const pinNumber = shapes.filter((s) => s.type === 'pin').length + 1;
          pushUndo(shapes);
          setShapes([...shapes, { id: makeId(), type: 'pin', color, x: nx, y: ny, n: pinNumber }]);
          break;
        }
      }
    },
    [readOnly, tool, color, shapes, textOverlay, getNormalizedPoint, pushUndo]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drawingShape) return;
      const pt = getNormalizedPoint(e.clientX, e.clientY);
      if (!pt) return;
      const { nx, ny } = pt;

      setDrawingShape((prev) => {
        if (!prev) return prev;
        switch (prev.type) {
          case 'arrow':
            return { ...prev, x2: nx, y2: ny };
          case 'rect':
            return { ...prev, w: nx - prev.x, h: ny - prev.y };
          case 'circle': {
            const dx = nx - prev.x;
            const dy = ny - prev.y;
            const aspect = stageSize.h / Math.max(stageSize.w, 1);
            const dist = Math.sqrt(dx * dx + (dy / Math.max(aspect, 0.0001)) ** 2);
            return { ...prev, r: dist };
          }
          case 'pen':
            return { ...prev, points: [...prev.points, nx, ny] };
          default:
            return prev;
        }
      });
    },
    [drawingShape, stageSize.h, stageSize.w, getNormalizedPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (!drawingShape) return;
    const s = drawingShape;
    let keep = true;
    if (s.type === 'arrow' && s.x1 === s.x2 && s.y1 === s.y2) keep = false;
    if (s.type === 'rect' && Math.abs(s.w) < 0.005 && Math.abs(s.h) < 0.005) keep = false;
    if (s.type === 'circle' && s.r < 0.005) keep = false;
    if (s.type === 'pen' && s.points.length < 4) keep = false;

    if (keep) {
      pushUndo(shapes);
      setShapes([...shapes, s]);
    }
    setDrawingShape(null);
  }, [drawingShape, shapes, pushUndo]);

  // Text commit
  const commitText = useCallback(() => {
    if (!textOverlay) return;
    const value = textOverlay.value.trim();
    if (value) {
      pushUndo(shapes);
      setShapes([
        ...shapes,
        { id: makeId(), type: 'text', color, x: textOverlay.nx, y: textOverlay.ny, text: value },
      ]);
    }
    setTextOverlay(null);
  }, [textOverlay, shapes, color, pushUndo]);

  const cancelText = useCallback(() => setTextOverlay(null), []);

  // Button styles
  const toolBtnClass = (t: Tool) =>
    `px-2.5 py-1.5 rounded-md text-[11px] font-bold font-mono tracking-wider transition-colors ${
      tool === t
        ? 'bg-amber-500 text-black'
        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
    }`;

  const colorBtnClass = (c: ColorKey) =>
    `w-7 h-7 rounded-full border-2 transition-transform ${
      color === c ? 'scale-110 border-white' : 'border-zinc-700'
    }`;

  return (
    <div className="w-full">
      {!readOnly && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setTool('select')} className={toolBtnClass('select')}>SELECT</button>
            <button onClick={() => setTool('arrow')} className={toolBtnClass('arrow')}>ARROW</button>
            <button onClick={() => setTool('rect')} className={toolBtnClass('rect')}>RECT</button>
            <button onClick={() => setTool('circle')} className={toolBtnClass('circle')}>CIRCLE</button>
            <button onClick={() => setTool('pen')} className={toolBtnClass('pen')}>PEN</button>
            <button onClick={() => setTool('text')} className={toolBtnClass('text')}>TEXT</button>
            <button onClick={() => setTool('pin')} className={toolBtnClass('pin')}>PIN</button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {(Object.keys(COLOR_MAP) as ColorKey[]).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={colorBtnClass(c)}
                style={{ backgroundColor: COLOR_MAP[c] }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>

          <div className="flex gap-1.5 w-full sm:w-auto">
            <button
              onClick={handleUndo}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-bold font-mono bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              UNDO
            </button>
            <button
              onClick={handleRedo}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-bold font-mono bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              REDO
            </button>
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-bold font-mono bg-red-950/60 border border-red-900/60 text-red-400 hover:bg-red-900/60 transition-colors"
            >
              CLEAR
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          minHeight: '200px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {imgError && (
          <div className="flex items-center justify-center p-8 text-sm text-red-400">
            {imgError}
          </div>
        )}

        {!imgError && stageSize.w > 0 && stageSize.h > 0 && (
          <KonvaCanvas
            width={stageSize.w}
            height={stageSize.h}
            bgImage={bgImage}
            shapes={shapes}
            drawingShape={drawingShape}
          />
        )}

        {textOverlay && (
          <div
            className="absolute bg-zinc-950/95 border border-amber-500 rounded-md p-1.5"
            style={{
              left: `${textOverlay.nx * stageSize.w}px`,
              top: `${textOverlay.ny * stageSize.h}px`,
              transform: 'translate(-4px, -4px)',
            }}
          >
            <input
              ref={textInputRef}
              type="text"
              value={textOverlay.value}
              onChange={(e) =>
                setTextOverlay((prev) => (prev ? { ...prev, value: e.target.value } : prev))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitText();
                if (e.key === 'Escape') cancelText();
              }}
              onBlur={commitText}
              placeholder="Type label…"
              className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 font-bold w-48"
            />
          </div>
        )}
      </div>
    </div>
  );
}
