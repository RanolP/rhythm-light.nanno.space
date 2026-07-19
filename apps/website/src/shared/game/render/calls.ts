import type { Box2D } from "../../data/box";

type DrawCallBase<Name extends string, Content extends {}> = {
  kind: Name;
  data: Content;
};

export type DrawTextCall = DrawCallBase<
  "text",
  Omit<Box2D, "size"> & {
    content: string;
    fill?: string;
    stroke?: string;
    font?: {
      family?: string;
      size?: number;
    };
  }
>;

export type DrawBox = DrawCallBase<
  "box",
  Box2D & {
    fill?: string;
    outline?: { fill: string; width: number };
  }
>;

export type DrawCall = DrawTextCall | DrawBox | null | undefined;
