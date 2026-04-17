// src/components/battle-hq/AnnotationCanvas.types.ts
//
// Shared types for the annotation canvas. Split out so the konva wrapper
// can import types without pulling in the full AnnotationCanvas module.

export type Tool = 'select' | 'arrow' | 'rect' | 'circle' | 'pen' | 'text' | 'pin';

export type ColorKey = 'red' | 'amber' | 'sky' | 'green' | 'purple' | 'white';

type BaseShape = { id: string; color: ColorKey };

export type ArrowShape = BaseShape & { type: 'arrow'; x1: number; y1: number; x2: number; y2: number };
export type RectShape = BaseShape & { type: 'rect'; x: number; y: number; w: number; h: number };
export type CircleShape = BaseShape & { type: 'circle'; x: number; y: number; r: number };
export type PenShape = BaseShape & { type: 'pen'; points: number[] };
export type TextShape = BaseShape & { type: 'text'; x: number; y: number; text: string };
export type PinShape = BaseShape & { type: 'pin'; x: number; y: number; n: number };

export type Shape = ArrowShape | RectShape | CircleShape | PenShape | TextShape | PinShape;

export type AnnotationsJson = {
  version: 1;
  shapes: Shape[];
};