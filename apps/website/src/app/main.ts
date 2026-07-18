import { heightOf, widthOf, type Dimension2D } from "../shared/data/dimension";
import { HorizontalAlignment, VerticalAlignment } from "../shared/data/position";
import { configureLogger } from "../shared/logger";
import { startGameLoop } from "../shared/game/loop";

// #region Setup
const canvas = document.querySelector<HTMLCanvasElement>("canvas#main")!;
const renderCtx = canvas.getContext("2d")!;
await configureLogger();
// #endregion

const SOURCE_RESOLUTION = { topLeft: [0, 0], bottomRight: [1920, 1080] } satisfies Dimension2D;

const gameCanvas = new OffscreenCanvas(widthOf(SOURCE_RESOLUTION), heightOf(SOURCE_RESOLUTION));
const gameRenderCtx = gameCanvas.getContext("2d")!;
let recentDtSamples: number[] = [];

startGameLoop({
  world: {
    renderCtx: gameRenderCtx,
    viewport: SOURCE_RESOLUTION,
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
            dim: parentBB,
            anchor: [HorizontalAlignment.LEFT, VerticalAlignment.TOP],
            fill: "white",
          },
        },
        {
          kind: "text",
          data: {
            content: `${(1000 / (recentDtSamples.reduce((a, b) => a + b) / recentDtSamples.length)) | 0}fps`,
            pos: [0, 0],
            fontFamily: "Pretendard",
            fontSize: 128,
            fill: "red",
            anchor: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
            align: [HorizontalAlignment.CENTER, VerticalAlignment.BOTTOM],
          },
        },
        {
          kind: "box",
          data: {
            dim: { topLeft: [0, 0], bottomRight: [100, 128] },
            outline: { fill: "red", width: 4 },
            anchor: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
            align: [HorizontalAlignment.CENTER, VerticalAlignment.BOTTOM],
          },
        },
        {
          kind: "text",
          data: {
            content: `${(1000 / (recentDtSamples.reduce((a, b) => a + b) / recentDtSamples.length)) | 0}fps`,
            pos: [0, 0],
            fontFamily: "Pretendard",
            fontSize: 128,
            fill: "green",
            anchor: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
            align: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
          },
        },
        {
          kind: "box",
          data: {
            dim: { topLeft: [0, 0], bottomRight: [100, 128] },
            outline: { fill: "green", width: 4 },
            anchor: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
            align: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
          },
        },
        {
          kind: "text",
          data: {
            content: `${(1000 / (recentDtSamples.reduce((a, b) => a + b) / recentDtSamples.length)) | 0}fps`,
            pos: [0, 0],
            fontFamily: "Pretendard",
            fontSize: 128,
            fill: "blue",
            anchor: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
            align: [HorizontalAlignment.CENTER, VerticalAlignment.TOP],
          },
        },
        {
          kind: "box",
          data: {
            dim: { topLeft: [0, 0], bottomRight: [100, 128] },
            outline: { fill: "blue", width: 4 },
            anchor: [HorizontalAlignment.CENTER, VerticalAlignment.MIDDLE],
            align: [HorizontalAlignment.CENTER, VerticalAlignment.TOP],
          },
        },
      ];
    },
  },
  preRender() {
    gameRenderCtx.clearRect(0, 0, widthOf(SOURCE_RESOLUTION), heightOf(SOURCE_RESOLUTION));
  },
  postRender() {
    const target = {
      width: window.innerWidth * window.devicePixelRatio,
      height: window.innerHeight * window.devicePixelRatio,
    };
    if (canvas.width !== target.width) canvas.width = target.width;
    if (canvas.height !== target.height) canvas.height = target.height;

    renderCtx.clearRect(0, 0, target.width, target.height);
    if (target.width * 9 < target.height * 16) {
      const dh = (target.width * 9) / 16;
      const gap = (target.height - dh) / 2;
      renderCtx.fillStyle = "black";
      renderCtx.fillRect(0, 0, target.width, gap);
      renderCtx.fillRect(0, target.height - gap, target.width, gap);
      renderCtx.drawImage(gameCanvas, 0, gap, target.width, dh);
    } else {
      const dw = (target.height * 16) / 9;
      const gap = (target.width - dw) / 2;
      renderCtx.fillStyle = "black";
      renderCtx.fillRect(0, 0, gap, target.height);
      renderCtx.fillRect(target.width - gap, 0, gap, target.height);
      renderCtx.drawImage(gameCanvas, (target.width - dw) / 2, 0, dw, target.height);
    }
  },
});
