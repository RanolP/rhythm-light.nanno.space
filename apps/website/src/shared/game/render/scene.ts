import type { Dimension2D } from "../../data/dimension";
import type { DrawCall } from "./calls";

export interface Scene {
  update(meta: { stepMs: number }): void;
  render(meta: { alpha: number; frameDtMs: number; parentBB: Dimension2D }): DrawCall[];
}

export function composeScenes(...scenes: Scene[]): Scene {
  return {
    update(meta) {
      scenes.forEach((s) => s.update(meta));
    },
    render(meta) {
      return scenes.map((s) => s.render(meta)).flat(1);
    },
  };
}
