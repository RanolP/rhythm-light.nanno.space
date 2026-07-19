import type { Box2D } from "../data/box";
import type { PointingDevice } from "./input/pointing";

export interface World {
  renderCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  viewport: Box2D;

  inputDevices: {
    at(time: number): InputDevices;
    commit(time: number): void;
    enter?(): void;
    exit?(): void;
  };
}

export interface InputDevices {
  pointers: PointingDevice[];
}

export const EMPTY_INPUT_DEVICES = {
  pointers: [],
} satisfies InputDevices;
