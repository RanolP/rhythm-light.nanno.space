import type { Vector2D } from "../../data/transform";
import type { InputDevices } from "../world";
import type { DrawCall } from "./calls";

export interface Scene {
  enter?(): void;
  exit?(): void;
  update(meta: { input: InputDevices; stepMs: number }): void;
  render(meta: {
    input: InputDevices;
    alpha: number;
    frameDtMs: number;
    parentBB: Vector2D;
  }): DrawCall[];
}

export function composeScenes(...scenes: Scene[]): Scene {
  return {
    enter() {
      scenes.forEach((s) => s.enter?.());
    },
    exit() {
      scenes.forEach((s) => s.exit?.());
    },
    update(meta) {
      scenes.forEach((s) => s.update(meta));
    },
    render(meta) {
      return scenes.map((s) => s.render(meta)).flat(1);
    },
  };
}
