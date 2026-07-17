export const VerticalAlignment = Object.freeze({
  TOP: "TOP",
  MIDDLE: "MIDDLE",
  BOTTOM: "BOTTOM",
});

export type VerticalAlignment = (typeof VerticalAlignment)[keyof typeof VerticalAlignment];

export const HorizontalAlignment = Object.freeze({
  LEFT: "LEFT",
  CENTER: "CENTER",
  RIGHT: "RIGHT",
});

export type HorizontalAlignment = (typeof HorizontalAlignment)[keyof typeof HorizontalAlignment];

export type Alignment = [HorizontalAlignment, VerticalAlignment];

export type Pos2D = [x: number, y: number];

export type TransformPos2D = [dx: number, dy: number];

export function applyTransform(o: Pos2D, ...tr: TransformPos2D[]): Pos2D {
  return tr.reduce(([x, y], [dx, dy]) => [x + dx, y + dy], o);
}
