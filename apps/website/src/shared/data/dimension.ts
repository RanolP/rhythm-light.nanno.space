import type { Box2D } from "./box";
import { type PartialTransformPos2D } from "./position";

const fit =
  (selectFactor: (a: number, b: number) => number) =>
  ({ parent, child }: { parent: Box2D; child: Box2D }): [Box2D, PartialTransformPos2D] => {
    const factor = selectFactor(parent.size[0] / child.size[0], parent.size[1] / child.size[1]);

    return [
      {
        origin: child.origin && [
          { scale: child.origin[0].scale, shift: factor * child.origin[0].shift },
          { scale: child.origin[1].scale, shift: factor * child.origin[1].shift },
        ],
        size: [factor * child.size[0], factor * child.size[1]],
      },
      () => null,
    ];
  };

export const objectFit = {
  cover: fit(Math.max),
  contain: fit(Math.min),
};
