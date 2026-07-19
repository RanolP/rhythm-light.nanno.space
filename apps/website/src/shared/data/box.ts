import { evalLinear, type Linear2D } from "./linear";
import { applyTransform, p, type Vector2D } from "./transform";

export interface Box2D {
  origin: Linear2D;
  shift?: Vector2D;
  size: readonly [width: number, height: number];
}

export function evaluateBox(box: Box2D): [x: number, y: number, w: number, h: number] {
  return [
    ...applyTransform(
      [0, 0],
      box.shift,
      p.scale(-1)([evalLinear(box.origin[0], box.size[0]), evalLinear(box.origin[1], box.size[1])]),
    ),
    ...box.size,
  ];
}
