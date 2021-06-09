import { Color } from "./color.ts";

export interface Image {
  width: number;
  height: number;
  pixels: Color[][];
}
