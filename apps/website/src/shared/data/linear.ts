import type { Vector2D } from "./transform";

export interface Linear {
  scale: number;
  shift: number;
}

export type Linear2D = readonly [x: Linear, y: Linear];

export function evalLinear(
  { scale, shift }: Linear | undefined = { scale: 0, shift: 0 },
  x: number,
): number {
  return scale * x + shift;
}

export function addLinear(l: Linear, c: number): Linear {
  return { scale: l.scale, shift: l.shift + c };
}
export function addLinear2D(l: Linear2D, v: Vector2D): Linear2D {
  return [addLinear(l[0], v[0]), addLinear(l[1], v[1])];
}
