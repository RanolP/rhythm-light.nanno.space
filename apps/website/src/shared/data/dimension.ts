import type { Pos2D } from "./position";

export interface Dimension2D {
  topLeft: Pos2D;
  bottomRight: Pos2D;
}

export function widthOf(dim: Dimension2D) {
  return dim.bottomRight[0] - dim.topLeft[0];
}

export function heightOf(dim: Dimension2D) {
  return dim.bottomRight[1] - dim.topLeft[1];
}
