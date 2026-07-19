import { type Pos2D } from "./position";

export type Vector2D = readonly [dx: number, dy: number];

export function applyTransform(o: Pos2D, ...tr: (Vector2D | null | undefined)[]): Pos2D {
  return tr.reduce<Pos2D>(([x, y], v) => [x + (v?.[0] ?? 0), y + (v?.[1] ?? 0)], o);
}

export const p = {
  scale(factor: number): (v: Vector2D) => Vector2D {
    return ([dx, dy]) => [factor * dx, factor * dy];
  },
};
