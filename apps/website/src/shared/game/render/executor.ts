import type { DrawCall } from "./calls";
import type { World } from "../world";
import { evaluateBox } from "../../data/box";
import { applyTransform, p } from "../../data/transform";

export function executeDrawCalls(w: World, calls: DrawCall[]) {
  for (const call of calls) {
    if (!call) continue;
    switch (call.kind) {
      case "text": {
        w.renderCtx.textBaseline = "hanging";
        w.renderCtx.fillStyle = call.data.fill ?? "black";
        w.renderCtx.font = `${call.data.font?.size ?? 16}px ${call.data.font?.family ?? "sans-serif"}`;

        const measured = w.renderCtx.measureText(call.data.content);

        const size = [
          measured.width,
          measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent,
        ] as const;
        const [x, y] = evaluateBox({ origin: call.data.origin, size });

        w.renderCtx.fillText(
          call.data.content,
          ...applyTransform([x, y], p.scale(0.5)(w.viewport.size), p.scale(-0.5)(size), [
            measured.actualBoundingBoxLeft,
            measured.actualBoundingBoxAscent,
          ]),
        );
        break;
      }
      case "box": {
        const [x, y, ...size] = evaluateBox(call.data);
        const xywh = [
          ...applyTransform([x, y], p.scale(0.5)(w.viewport.size), p.scale(-0.5)(size)),
          ...size,
        ] as const;

        if (call.data.fill) {
          w.renderCtx.fillStyle = call.data.fill;
          w.renderCtx.fillRect(...xywh);
        }
        if (call.data.outline) {
          w.renderCtx.strokeStyle = call.data.outline.fill;
          w.renderCtx.lineWidth = call.data.outline.width;
          w.renderCtx.strokeRect(...xywh);
        }
        break;
      }
      default: {
        throw new Error(`Unhandled Render Call`);
      }
    }
  }
}
