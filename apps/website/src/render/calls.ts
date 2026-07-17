import type { Alignment, Pos2D } from "../shared/data/position";

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

export type DrawCall = DrawTextCall;
