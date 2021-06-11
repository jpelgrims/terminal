import { bresenham } from "./algo.ts";
import { Image } from "./image.ts";
import { Color, Colors, compareColors, Terminal } from "./mod.ts";
import { isInsideRectangle } from "./util.ts";

export type Point = [number, number];

export type Line = [
  number,
  number,
  number,
  number,
];

export type Path = [];

/**
 * A canvas in the terminal using block characters
 */
export class TerminalCanvas {
  public terminal;

  pixels: Color[][];
  pixelBuffer: Color[][];

  height: number;
  width: number;

  blankScreen: Color[][];

  constructor() {
    this.terminal = new Terminal();
    this.height = 0;
    this.width = 0;

    this.blankScreen = [];
    this.pixels = [];
    this.pixelBuffer = [];
  }

  /**
   * Initializes the canvas
   * 
   * This is mostly just to configure the underlying terminal correctly.
   */
  async initialize() {
    await this.terminal.initialize();
    this.updateSize();
  }

  /**
   * Updates the size of the canvas based on the underlying terminal
   */
  updateSize() {
    const termSize = this.terminal.getSize();
    this.height = termSize.rows * 2;
    this.width = termSize.columns;

    this.blankScreen = [...Array(this.height)].map((x) =>
      Array(this.width).fill({ ...Colors.BLACK })
    );

    this.pixels = [...Array(this.height)].map((x) =>
      Array(this.width).fill(null)
    );

    this.clear();
  }

  clear(): void {
    // This is supposed to be the fastest way to duplicate an array, although on browsers, not sure about node
    this.pixelBuffer = [...Array(this.height)].map((_, i) =>
      this.blankScreen[i].slice(0)
    );
  }

  /**
   * Draws a single pixel onto the buffer
   * 
   * @param {number} x   X-position of the pixel
   * @param {number} y   Y-position of the pixel
   * @param {Color} color  The color of the pixel
   */
  drawPixel(x: number, y: number, color: Color) {
    this.pixelBuffer[y][x] = { ...color };
  }

  /**
   * Draws a line form point A to point B
   * 
   * @param xStart  X-coordinate of line start
   * @param yStart  Y-coordinate of line start
   * @param xEnd  X-coordinate of line end
   * @param yEnd  Y-coordinate of line end
   * @param color  Color of the line
   */
  drawLine(
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    color: Color,
  ) {
    const coordinates = bresenham(xStart, yStart, xEnd, yEnd);

    for (const { x, y } of coordinates) {
      this.pixelBuffer[y][x] = { ...color };
    }
  }

  /**
     * Draws the path as specified. A path is a series of connected point where the final point is
     * not equal to the first point.
     *
     * @param {Point[]} lines
     * @param {Color} color
     */
  drawPath(points: Point[], color: Color) {
    let prevPoint = points[0];
    for (const point of points.slice(1)) {
      this.drawLine(prevPoint[0], prevPoint[1], point[0], point[1], color);
      prevPoint = point;
    }
  }

  /**
     * Draws a shape as specified. A shape is a series of connected lines where the final line
     * connects back to the first line.
     *
     * @param lines
     * @param color
     */
  drawShape(points: Point[], color: Color, fill = false) {
    if (points[0] != points[points.length - 1]) {
      throw new Error("The given points do not form a connected shape");
    }

    this.drawPath(points, color);

    // TODO fill shape
  }

  /**
   * Draws a rectangle at the specified point, with given width and height
   * @param xPos    X-coordinate of the left corner of the rectangle
   * @param yPos    Y-coordinate of the left corner of the rectangle
   * @param width   Width of the rectangle
   * @param height  Height of the rectangle
   * @param color   Color of the rectangle
   */
  drawRectangle(
    xPos: number,
    yPos: number,
    width: number,
    height: number,
    color: Color,
  ) {
    for (let y = yPos; y < yPos + height; y++) {
      this.pixelBuffer[y].splice(
        xPos,
        width,
        ...Array(width).fill({ ...color }),
      );
    }
  }

  /**
     * Function that draws an image onto the canvas at the
     * given coordinates using block characters.
     *
     * @param xPos Horizontal terminal coordinates
     * @param yPos Vertical terminal coordinates
     * @param image The image to be drawn. Should have an even height
     */
  drawImage(xPos: number, yPos: number, image: Image) {
    let rowLength = image.width;
    let rowStart = 0;
    let rowEnd = image.width;

    if (xPos < 0) {
      rowLength = Math.max(0, rowLength - Math.abs(xPos));
      rowStart = Math.abs(xPos);
    } else if (xPos > this.width - image.width) {
      rowLength = Math.max(0, this.width - xPos);
      rowEnd = rowLength;
      rowStart = 0;
    }

    for (let y = 0; y < image.height; y++) {
      if (0 <= yPos + y && yPos + y < this.height) {
        const row: Color[] = image.pixels[y].slice(rowStart, rowEnd);
        this.pixelBuffer[yPos + y].splice(Math.max(0, xPos), rowLength, ...row);
      }
    }
  }

  /**
   * Renders the pixel buffer onto the terminal
   */
  async render() {
    for (let y = 0; y < this.height; y += 2) {
      for (let x = 0; x < this.width; x++) {
        const foreground: Color = this.pixelBuffer[y][x];
        const background: Color = this.pixelBuffer[y + 1][x];

        if (
          !compareColors(foreground, this.pixels[y][x]) ||
          !compareColors(background, this.pixels[y + 1][x])
        ) {
          this.terminal.setCell(
            x,
            Math.floor(y / 2),
            "▀",
            { ...foreground },
            { ...background },
          );
          this.pixels[y][x] = { ...foreground };
          this.pixels[y + 1][x] = { ...background };
        }
      }
    }

    this.clear();
    await this.terminal.refresh();
  }

  /**
   * Gives size of the canvas
   * 
   * A canvas has the same size as the underlying terminal instance, except
   * that it has double the vertical resolution.
   * @returns {}
   */
  getSize() {
    const termSize = this.terminal.getSize();
    return {
      width: termSize.columns,
      height: termSize.rows * 2,
    };
  }

  /**
 * Indicates whether the given coordinates lie within the canvas or not
 *
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @returns {boolean} a boolean indicating whether the given point lies within the canvas
 */
  isInsideTerminal(x: number, y: number): boolean {
    return isInsideRectangle(this.width, this.height, x, y);
  }

  /**
   * Returns the oldest input event from the queue, or undefined if there
   * weren't any events
   *
   * @returns {TerminalEvent} An input event
   */
  getEvent() {
    return this.terminal.getEvent();
  }

  /**
   * Closes the canvas.
   * 
   * It is important to call this function, otherwise the terminal may be left
   * in a bad state and will have to be reset.
   */
  async close() {
    await this.terminal.close();
  }
}
