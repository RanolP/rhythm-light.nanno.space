import { executeDrawCalls } from "./render/executor";
import type { Scene } from "./render/scene";
import type { World } from "./render/world";

const UPDATE_HERTZ = 120;
const UPDATE_STEP_MILLIS = 1000 / UPDATE_HERTZ;

interface Options {
  world: World;
  scene: Scene;
  preRender?: () => void;
  postRender?: () => void;
}
export function startGameLoop({ world, scene, preRender, postRender }: Options) {
  let last = performance.now();
  let acc = 0;
  function frame(now: number) {
    const diff = now - last;
    acc += diff;
    last = now;

    while (acc >= UPDATE_STEP_MILLIS) {
      scene.update({ stepMs: UPDATE_STEP_MILLIS });
      acc -= UPDATE_STEP_MILLIS;
    }
    preRender?.();
    executeDrawCalls(
      world,
      scene.render({
        parentBB: world.viewport,
        alpha: acc / UPDATE_STEP_MILLIS,
        frameDtMs: diff,
      }),
    );
    postRender?.();

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
