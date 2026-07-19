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

export type Pos2D = readonly [x: number, y: number];

export type PartialTransformPos2D = (pos: Pos2D) => Pos2D | null;

export function applyPartialTransform(o: Pos2D, ...tr: PartialTransformPos2D[]): Pos2D | null {
  return tr.reduce<Pos2D | null>((p, f) => (p ? f(p) : null), o);
}
