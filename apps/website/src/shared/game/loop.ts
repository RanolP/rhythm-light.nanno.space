import { executeDrawCalls } from "./render/executor";
import type { Scene } from "./render/scene";
import { type World } from "./world";

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
    const inputAfterUpdate = world.inputDevices.at(now);

    let frameNow = last;

    const diff = now - last;
    acc += diff;
    last = now;

    while (acc >= UPDATE_STEP_MILLIS) {
      frameNow += UPDATE_STEP_MILLIS;
      scene.update({ input: world.inputDevices.at(frameNow), stepMs: UPDATE_STEP_MILLIS });
      world.inputDevices.commit(frameNow);
      acc -= UPDATE_STEP_MILLIS;
    }
    preRender?.();
    executeDrawCalls(
      world,
      scene.render({
        input: inputAfterUpdate,
        parentBB: world.viewport.size,
        alpha: acc / UPDATE_STEP_MILLIS,
        frameDtMs: diff,
      }),
    );
    postRender?.();

    requestAnimationFrame(frame);
  }

  world.inputDevices.enter?.();
  scene.enter?.();
  requestAnimationFrame(frame);
}
