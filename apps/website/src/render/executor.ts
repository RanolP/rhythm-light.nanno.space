import { heightOf, widthOf, type Dimension2D } from "../shared/data/dimension";
import {
  applyTransform,
  HorizontalAlignment,
  VerticalAlignment,
  type Alignment,
  type TransformPos2D,
} from "../shared/data/position";
import type { DrawCall } from "./calls";
import type { World } from "./world";

export function executeDrawCalls(w: World, calls: DrawCall[]) {
  for (const call of calls) {
    switch (call.kind) {
      case "text": {
        w.renderCtx.fillStyle = call.data.fill ?? "black";
        w.renderCtx.font = `${call.data.fontSize ?? 16}px ${call.data.fontFamily ?? "sans-serif"}`;
        const measured = w.renderCtx.measureText(call.data.content);
        const [x, y] = applyTransform(
          call.data.pos,
          trAlign(w.viewport, call.data.anchor),
          trNegate(
            trAlign(
              {
                topLeft: [0, 0],
                bottomRight: [
                  measured.width,
                  measured.actualBoundingBoxDescent - measured.actualBoundingBoxAscent,
                ],
              },
              call.data.align ?? [HorizontalAlignment.LEFT, VerticalAlignment.TOP],
            ),
          ),
        );
        w.renderCtx.fillText(call.data.content, x, y);
        break;
      }
    }
  }
}

export function trAlign(dim: Dimension2D, align: Alignment): TransformPos2D {
  return [
    widthOf(dim) *
      {
        [HorizontalAlignment.LEFT]: 0,
        [HorizontalAlignment.CENTER]: 0.5,
        [HorizontalAlignment.RIGHT]: 1,
      }[align[0]],

    heightOf(dim) *
      {
        [VerticalAlignment.TOP]: 0,
        [VerticalAlignment.MIDDLE]: 0.5,
        [VerticalAlignment.BOTTOM]: 1,
      }[align[1]],
  ];
}

export function trNegate([dx, dy]: TransformPos2D): TransformPos2D {
  return [-dx, -dy];
}
