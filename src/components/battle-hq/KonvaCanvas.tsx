'use client';

// src/components/battle-hq/KonvaCanvas.tsx
//
// Isolated react-konva wrapper with pinch-zoom + two-finger pan.
//
// Interaction model:
//   - One finger = drawing (handled by AnnotationCanvas's pointer events)
//   - Two fingers = pinch-zoom + pan (handled here via native touch events
//     on the Stage's internal canvas)
//   - Mouse wheel = zoom (desktop convenience)
//   - Double-tap = reset zoom
//
// Zoom state is internal to this component. Shapes are always stored in
// normalized (0-1) coordinates relative to the base image — so zooming
// doesn't change the underlying JSON, only the view transform.

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KImage, Rect, Circle, Line, Arrow, Text, Group } from 'react-konva';
import type Konva from 'konva';
import type { ColorKey, Shape } from './AnnotationCanvas.types';

const COLOR_MAP: Record<ColorKey, string> = {
  red: '#ef4444',
  amber: '#f0a500',
  sky: '#38bdf8',
  green: '#22c55e',
  purple: '#a855f7',
  white: '#ffffff',
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export interface KonvaCanvasProps {
  width: number;
  height: number;
  bgImage: HTMLImageElement | null;
  shapes: Shape[];
  drawingShape: Shape | null;
  /** Called when the view transform changes. Parent uses this to convert
   *  pointer coords into the image's normalized coord space correctly. */
  onViewChange?: (t: { scale: number; x: number; y: number }) => void;
}

function toPx(nx: number, ny: number, w: number, h: number) {
  return { x: nx * w, y: ny * h };
}

function getDist(p1: Touch, p2: Touch) {
  return Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
}

function getCenter(p1: Touch, p2: Touch) {
  return {
    x: (p1.clientX + p2.clientX) / 2,
    y: (p1.clientY + p2.clientY) / 2,
  };
}

export default function KonvaCanvas({
  width,
  height,
  bgImage,
  shapes,
  drawingShape,
  onViewChange,
}: KonvaCanvasProps) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const gestureRef = useRef<{
    mode: 'none' | 'pinch';
    lastDist: number;
    lastCenter: { x: number; y: number };
    startScale: number;
    startOffset: { x: number; y: number };
  }>({
    mode: 'none',
    lastDist: 0,
    lastCenter: { x: 0, y: 0 },
    startScale: 1,
    startOffset: { x: 0, y: 0 },
  });

  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    onViewChange?.({ scale, x: offset.x, y: offset.y });
  }, [scale, offset.x, offset.y, onViewChange]);

  function clampOffset(nextOffset: { x: number; y: number }, s: number) {
    const maxX = 0;
    const minX = width - width * s;
    const maxY = 0;
    const minY = height - height * s;
    return {
      x: Math.max(minX, Math.min(maxX, nextOffset.x)),
      y: Math.max(minY, Math.min(maxY, nextOffset.y)),
    };
  }

  // Native touch handlers — must be native (not React synthetic) because we
  // need passive:false to preventDefault on two-finger gestures.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();
    if (!container) return;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        gestureRef.current.mode = 'pinch';
        gestureRef.current.lastDist = getDist(e.touches[0], e.touches[1]);
        gestureRef.current.lastCenter = getCenter(e.touches[0], e.touches[1]);
        gestureRef.current.startScale = scale;
        gestureRef.current.startOffset = { ...offset };
      } else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
          setScale(1);
          setOffset({ x: 0, y: 0 });
          lastTapRef.current = 0;
          e.preventDefault();
          e.stopPropagation();
        } else {
          lastTapRef.current = now;
        }
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 2 || gestureRef.current.mode !== 'pinch') return;
      e.preventDefault();
      e.stopPropagation();

      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = getDist(t1, t2);
      const center = getCenter(t1, t2);

      const startDist = gestureRef.current.lastDist;
      if (startDist === 0) return;

      const rawScale = gestureRef.current.startScale * (dist / startDist);
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));

      const rect = container.getBoundingClientRect();
      const localCenter = {
        x: center.x - rect.left,
        y: center.y - rect.top,
      };

      const startOffset = gestureRef.current.startOffset;
      const startScale = gestureRef.current.startScale;
      const startLocalCenter = {
        x: gestureRef.current.lastCenter.x - rect.left,
        y: gestureRef.current.lastCenter.y - rect.top,
      };
      const imageAnchorX = (startLocalCenter.x - startOffset.x) / startScale;
      const imageAnchorY = (startLocalCenter.y - startOffset.y) / startScale;

      const newOffset = clampOffset(
        {
          x: localCenter.x - imageAnchorX * newScale,
          y: localCenter.y - imageAnchorY * newScale,
        },
        newScale
      );

      setScale(newScale);
      setOffset(newOffset);
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length < 2) {
        gestureRef.current.mode = 'none';
      }
    }

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });
    container.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [scale, offset.x, offset.y, width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const rawScale = direction > 0 ? scale * scaleBy : scale / scaleBy;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));

    const imageAnchorX = (pointer.x - offset.x) / scale;
    const imageAnchorY = (pointer.y - offset.y) / scale;

    const newOffset = clampOffset(
      {
        x: pointer.x - imageAnchorX * newScale,
        y: pointer.y - imageAnchorY * newScale,
      },
      newScale
    );

    setScale(newScale);
    setOffset(newOffset);
  }

  const all = drawingShape ? [...shapes, drawingShape] : shapes;

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      x={offset.x}
      y={offset.y}
      onWheel={handleWheel}
    >
      <Layer listening={false}>
        {bgImage && <KImage image={bgImage} width={width} height={height} />}
      </Layer>
      <Layer>
        {all.map((s) => {
          const stroke = COLOR_MAP[s.color];
          switch (s.type) {
            case 'arrow': {
              const p1 = toPx(s.x1, s.y1, width, height);
              const p2 = toPx(s.x2, s.y2, width, height);
              return (
                <Arrow
                  key={s.id}
                  points={[p1.x, p1.y, p2.x, p2.y]}
                  stroke={stroke}
                  fill={stroke}
                  strokeWidth={3 / scale}
                  pointerLength={12 / scale}
                  pointerWidth={12 / scale}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            }
            case 'rect': {
              const p = toPx(s.x, s.y, width, height);
              return (
                <Rect
                  key={s.id}
                  x={p.x}
                  y={p.y}
                  width={s.w * width}
                  height={s.h * height}
                  stroke={stroke}
                  strokeWidth={3 / scale}
                />
              );
            }
            case 'circle': {
              const p = toPx(s.x, s.y, width, height);
              return (
                <Circle
                  key={s.id}
                  x={p.x}
                  y={p.y}
                  radius={s.r * width}
                  stroke={stroke}
                  strokeWidth={3 / scale}
                />
              );
            }
            case 'pen': {
              const pts: number[] = [];
              for (let i = 0; i < s.points.length; i += 2) {
                pts.push(s.points[i] * width, s.points[i + 1] * height);
              }
              return (
                <Line
                  key={s.id}
                  points={pts}
                  stroke={stroke}
                  strokeWidth={3 / scale}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.3}
                />
              );
            }
            case 'text': {
              const p = toPx(s.x, s.y, width, height);
              return (
                <Text
                  key={s.id}
                  x={p.x}
                  y={p.y}
                  text={s.text}
                  fontSize={18 / scale}
                  fontStyle="bold"
                  fill={stroke}
                  stroke="#000"
                  strokeWidth={0.5 / scale}
                />
              );
            }
            case 'pin': {
              const p = toPx(s.x, s.y, width, height);
              return (
                <Group key={s.id} x={p.x} y={p.y}>
                  <Circle x={0} y={0} radius={14 / scale} fill={stroke} stroke="#000" strokeWidth={1.5 / scale} />
                  <Text
                    x={-14 / scale}
                    y={-8 / scale}
                    width={28 / scale}
                    text={String(s.n)}
                    fontSize={15 / scale}
                    fontStyle="bold"
                    fill="#000"
                    align="center"
                  />
                </Group>
              );
            }
          }
        })}
      </Layer>
    </Stage>
  );
}
