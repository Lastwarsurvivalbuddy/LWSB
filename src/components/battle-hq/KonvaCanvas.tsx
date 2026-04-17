'use client';

// src/components/battle-hq/KonvaCanvas.tsx
//
// Isolated react-konva wrapper. AnnotationCanvas dynamic-imports this as a
// single default export to dodge the "Cannot use 'in' operator to search for
// 'default' in Layer" error that next/dynamic throws against react-konva's
// named ESM exports.
//
// This file contains ONLY rendering. All state, undo stacks, pointer logic,
// and toolbar live in AnnotationCanvas.

import { Stage, Layer, Image as KImage, Rect, Circle, Line, Arrow, Text, Group } from 'react-konva';
import type { ColorKey, Shape } from './AnnotationCanvas.types';

const COLOR_MAP: Record<ColorKey, string> = {
  red: '#ef4444',
  amber: '#f0a500',
  sky: '#38bdf8',
  green: '#22c55e',
  purple: '#a855f7',
  white: '#ffffff',
};

export interface KonvaCanvasProps {
  width: number;
  height: number;
  bgImage: HTMLImageElement | null;
  shapes: Shape[];
  drawingShape: Shape | null;
}

function toPx(nx: number, ny: number, w: number, h: number) {
  return { x: nx * w, y: ny * h };
}

export default function KonvaCanvas({ width, height, bgImage, shapes, drawingShape }: KonvaCanvasProps) {
  const all = drawingShape ? [...shapes, drawingShape] : shapes;

  return (
    <Stage width={width} height={height}>
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
                  strokeWidth={3}
                  pointerLength={12}
                  pointerWidth={12}
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
                  strokeWidth={3}
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
                  strokeWidth={3}
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
                  strokeWidth={3}
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
                  fontSize={18}
                  fontStyle="bold"
                  fill={stroke}
                  stroke="#000"
                  strokeWidth={0.5}
                />
              );
            }
            case 'pin': {
              const p = toPx(s.x, s.y, width, height);
              return (
                <Group key={s.id} x={p.x} y={p.y}>
                  <Circle x={0} y={0} radius={14} fill={stroke} stroke="#000" strokeWidth={1.5} />
                  <Text
                    x={-14}
                    y={-8}
                    width={28}
                    text={String(s.n)}
                    fontSize={15}
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
