import type { Dimension2D } from "../shared/data/dimension";

export interface World {
  renderCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  viewport: Dimension2D;
  dtMillis: number;
}
