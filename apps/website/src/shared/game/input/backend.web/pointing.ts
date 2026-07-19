import { type Pos2D } from "../../../data/position";
import { createKeySetControl, type KeySetControl } from "../key";
import { KeyCode, type KeyCodes } from "../keycode";
import { PointerKind, type PointingDevice } from "../pointing";

interface PointingDeviceState {
  base: Omit<PointingDevice, "state">;
  control: KeySetControl<KeyCodes<typeof KeyCode.Mouse>>;
}

export function createPointingDeviceReader(mapPos: (pos: Pos2D) => Pos2D | null) {
  const devices: Record<string, PointingDeviceState> = {};

  const assumeDevice =
    (then?: (e: PointerEvent, device: PointingDeviceState, position: Pos2D) => void) =>
    (e: PointerEvent) => {
      const position = mapPos([e.clientX, e.clientY]);
      if (!position) {
        delete devices[e.pointerId];
        return;
      }
      const device = (devices[e.pointerId] ??= {
        base: {
          id: String(e.pointerId),
          kind: mapWebPointerKind(e.pointerType),
          position,
        },
        control: createKeySetControl(),
      });
      then?.(e, device, position);
    };

  const onPointerCancel = (e: PointerEvent) => {
    delete devices[e.pointerId];
  };

  const onPointerMove = assumeDevice((_, device, position) => {
    device.base.position = position;
  });
  const onPointerDown = assumeDevice((e, device) => {
    const code = mapButtonToKeyCode(e.button);
    if (code) device.control.beginPress(code, e.timeStamp);
  });

  const onPointerUp = assumeDevice((e, device) => {
    const code = mapButtonToKeyCode(e.button);
    if (code) device.control.endPress(code, e.timeStamp);
  });

  return {
    at(time: number): PointingDevice[] {
      return Object.values(devices).map(({ base, control }) => ({
        ...base,
        state: control.at(time),
      }));
    },
    commit(time: number) {
      Object.values(devices).forEach(({ control }) => control.commit(time));
    },
    enter() {
      window.addEventListener("pointerleave", onPointerCancel);
      window.addEventListener("pointercancel", onPointerCancel);
      window.addEventListener("pointerenter", onPointerMove);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
    },
    exit() {
      window.removeEventListener("pointerleave", onPointerCancel);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("pointerenter", onPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    },
  };
}

function mapButtonToKeyCode(button: number): KeyCodes<typeof KeyCode.Mouse> | undefined {
  switch (button) {
    case 0:
      return KeyCode.Mouse.LEFT;
    case 1:
      return KeyCode.Mouse.MIDDLE;
    case 2:
      return KeyCode.Mouse.RIGHT;
    default:
      return undefined;
  }
}

function mapWebPointerKind(kind: string): PointerKind {
  switch (kind) {
    case "mouse": {
      return PointerKind.MOUSE;
    }
    case "pen": {
      return PointerKind.PEN;
    }
    case "touch": {
      return PointerKind.TOUCH;
    }
    default: {
      return PointerKind.UNKNOWN;
    }
  }
}
