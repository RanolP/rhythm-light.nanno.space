import type { Dimension2D } from "../../data/dimension";
import type { Alignment, Pos2D } from "../../data/position";

type DrawCallBase<Name extends string, Content extends {}> = {
  kind: Name;
  data: Content;
};

export type DrawTextCall = DrawCallBase<
  "text",
  {
    content: string;
    pos: Pos2D;
    anchor: Alignment;
    align?: Alignment;
    fill?: string;
    stroke?: string;
    fontFamily?: string;
    fontSize?: number;
  }
>;

export type DrawBox = DrawCallBase<
  "box",
  {
    dim: Dimension2D;
    anchor: Alignment;
    align?: Alignment;
    fill?: string;
    outline?: { fill: string; width: number };
  }
>;

export type DrawCall = DrawTextCall | DrawBox;
