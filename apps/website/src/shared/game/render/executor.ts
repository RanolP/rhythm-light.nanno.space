import { heightOf, widthOf, type Dimension2D } from "../../data/dimension";
import {
  applyTransform,
  HorizontalAlignment,
  VerticalAlignment,
  type Alignment,
  type TransformPos2D,
} from "../../data/position";
import type { DrawCall } from "./calls";
import type { World } from "./world";

export function executeDrawCalls(w: World, calls: DrawCall[]) {
  for (const call of calls) {
    switch (call.kind) {
      case "text": {
        w.renderCtx.textBaseline = "hanging";
        w.renderCtx.fillStyle = call.data.fill ?? "black";
        w.renderCtx.font = `${call.data.fontSize ?? 16}px ${call.data.fontFamily ?? "sans-serif"}`;

        const measured = w.renderCtx.measureText(call.data.content);
        const [x, y] = applyTransform(
          call.data.pos,
          trAlign(w.viewport, call.data.anchor),
          trNegate(
            trAlign(
              {
                topLeft: [0, -measured.actualBoundingBoxAscent],
                bottomRight: [measured.width, measured.actualBoundingBoxDescent],
              },
              call.data.align ?? [HorizontalAlignment.LEFT, VerticalAlignment.TOP],
            ),
          ),
          [0, measured.actualBoundingBoxAscent],
        );

        w.renderCtx.fillText(call.data.content, x, y);
        break;
      }
      case "box": {
        const [x, y] = applyTransform(
          call.data.dim.topLeft,
          trAlign(w.viewport, call.data.anchor),
          trNegate(
            trAlign(
              call.data.dim,
              call.data.align ?? [HorizontalAlignment.LEFT, VerticalAlignment.TOP],
            ),
          ),
        );

        if (call.data.fill) {
          w.renderCtx.fillStyle = call.data.fill;
          w.renderCtx.fillRect(x, y, widthOf(call.data.dim), heightOf(call.data.dim));
        }
        if (call.data.outline) {
          w.renderCtx.strokeStyle = call.data.outline.fill;
          w.renderCtx.lineWidth = call.data.outline.width;
          w.renderCtx.strokeRect(x, y, widthOf(call.data.dim), heightOf(call.data.dim));
        }
        break;
      }
      default: {
        throw new Error(`Unhandled Render Call`);
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
