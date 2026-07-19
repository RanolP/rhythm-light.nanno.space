import type { Pos2D } from "../../data/position";
import type { KeySetState } from "./key";
import type { KeyCode, KeyCodes } from "./keycode";

export const PointerKind = Object.freeze({
  MOUSE: "MOUSE",
  PEN: "PEN",
  TOUCH: "TOUCH",
  UNKNOWN: "UNKNOWN",
});
export type PointerKind = (typeof PointerKind)[keyof typeof PointerKind];

export interface PointingDevice {
  id: string;
  kind: PointerKind;
  position: Pos2D | null;
  state: KeySetState<KeyCodes<typeof KeyCode.Mouse>>;
}
