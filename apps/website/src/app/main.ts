import { objectFit } from "../shared/data/dimension";
import { configureLogger } from "../shared/logger";
import { startGameLoop } from "../shared/game/loop";
import { createPointingDeviceReader } from "../shared/game/input/backend.web/pointing";
import { evaluateBox, type Box2D } from "../shared/data/box";
import { applyTransform, p, type Vector2D } from "../shared/data/transform";

// #region Setup
const canvas = document.querySelector<HTMLCanvasElement>("canvas#main")!;
const renderCtx = canvas.getContext("2d")!;
await configureLogger();
// #endregion

function resolveTargetResolution(): { box: Box2D; toCanvas: Vector2D } {
  const halfWidth = (window.innerWidth * window.devicePixelRatio) / 2;
  const halfHeight = (window.innerHeight * window.devicePixelRatio) / 2;
  return {
    box: {
      origin: [
        { scale: 0, shift: halfWidth },
        { scale: 0, shift: halfHeight },
      ],
      size: [2 * halfWidth, 2 * halfHeight],
    },
    toCanvas: [halfWidth, halfHeight],
  };
}
const SOURCE_RESOLUTION = {
  origin: [
    { scale: 0, shift: 0 },
    { scale: 0, shift: 0 },
  ],
  size: [1920, 1080],
} satisfies Box2D;

const pointersReader = createPointingDeviceReader(() => {
  return resolveTargetResolution().toCanvas;
});
const gameCanvas = new OffscreenCanvas(...SOURCE_RESOLUTION.size);
const gameRenderCtx = gameCanvas.getContext("2d")!;
let recentDtSamples: number[] = [];

startGameLoop({
  world: {
    renderCtx: gameRenderCtx,
    viewport: SOURCE_RESOLUTION,
    inputDevices: {
      at(time) {
        return { pointers: pointersReader.at(time) };
      },
      commit(time) {
        pointersReader.commit(time);
      },
      enter() {
        pointersReader.enter();
      },
      exit() {
        pointersReader.exit();
      },
    },
  },
  scene: {
    update() {},
    render({ parentBB, frameDtMs }) {
      recentDtSamples.push(frameDtMs);
      if (recentDtSamples.length > 20) recentDtSamples.splice(0, 1);

      return [
        {
          kind: "box",
          data: {
            origin: [
              { scale: -0.5, shift: 0 },
              { scale: 0, shift: 0 },
            ],
            shift: [-0.5 * parentBB[0], 0],
            size: [100, 100],
            outline: { fill: "red", width: 4 },
          },
        },
        {
          kind: "box",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: -0.5, shift: 0 },
            ],
            shift: [0, -0.5 * parentBB[1]],
            size: [100, 100],
            outline: { fill: "red", width: 4 },
          },
        },
        {
          kind: "box",
          data: {
            origin: [
              { scale: 0.5, shift: 0 },
              { scale: 0, shift: 0 },
            ],
            shift: [0.5 * parentBB[0], 0],
            size: [100, 100],
            outline: { fill: "blue", width: 4 },
          },
        },
        {
          kind: "box",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: 0.5, shift: 0 },
            ],
            shift: [0, 0.5 * parentBB[1]],
            size: [100, 100],
            outline: { fill: "blue", width: 4 },
          },
        },
        {
          kind: "text",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: 0.5, shift: 0 },
            ],
            content: `${(1000 / (recentDtSamples.reduce((a, b) => a + b) / recentDtSamples.length)) | 0}fps`,
            font: {
              family: "Pretendard",
              size: 128,
            },
            fill: "red",
          },
        },
        {
          kind: "box",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: 0.5, shift: 0 },
            ],
            size: [100, 128],
            outline: { fill: "red", width: 4 },
          },
        },
        {
          kind: "text",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: 0, shift: 0 },
            ],
            content: `${(1000 / (recentDtSamples.reduce((a, b) => a + b) / recentDtSamples.length)) | 0}fps`,
            font: {
              family: "Pretendard",
              size: 128,
            },
            fill: "green",
          },
        },
        {
          kind: "box",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: 0, shift: 0 },
            ],
            size: [100, 128],
            outline: { fill: "green", width: 4 },
          },
        },
        {
          kind: "text",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: -0.5, shift: 0 },
            ],
            content: `${(1000 / (recentDtSamples.reduce((a, b) => a + b) / recentDtSamples.length)) | 0}fps`,
            font: {
              family: "Pretendard",
              size: 128,
            },
            fill: "blue",
          },
        },
        {
          kind: "box",
          data: {
            origin: [
              { scale: 0, shift: 0 },
              { scale: -0.5, shift: 0 },
            ],
            size: [100, 128],
            outline: { fill: "blue", width: 4 },
          },
        },
      ];
    },
  },
  preRender() {
    const xywh = evaluateBox(SOURCE_RESOLUTION);
    gameRenderCtx.clearRect(...xywh);
  },
  postRender() {
    const { box: target, toCanvas } = resolveTargetResolution();
    const [tx, ty, tw, th] = evaluateBox(target);
    if (canvas.width !== tw) canvas.width = tw;
    if (canvas.height !== th) canvas.height = th;

    renderCtx.fillStyle = "black";
    renderCtx.fillRect(...applyTransform([tx, ty], toCanvas), tw, th);

    const xywhS = evaluateBox(SOURCE_RESOLUTION);

    const [resized] = objectFit.contain({
      parent: target,
      child: SOURCE_RESOLUTION,
    });

    const [rx, ry, rw, rh] = evaluateBox(resized);
    const xywhR = [...applyTransform([rx, ry], toCanvas, p.scale(-0.5)([rw, rh])), rw, rh] as const;

    renderCtx.clearRect(...xywhR);
    renderCtx.drawImage(gameCanvas, ...xywhS, ...xywhR);
  },
});
