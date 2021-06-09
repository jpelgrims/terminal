import { TerminalEvent } from "./event.ts";
import * as EscapeSequence from "./escape_sequences.ts";
import { detectTerminalEvent } from "./input.ts";
import { Color, createColor } from "./color.ts";
import { createDrawOp, DrawOperation } from "./draw_operation.ts";
import { Cell, compareCells, createCell } from "./cell.ts";
import { writeToStream } from "./util.ts";
import { Image } from "./image.ts";

export interface TerminalSize {
  columns: number;
  rows: number;
}

export class Terminal {
  private rows;
  private columns;
  public inputStream: Deno.Reader;
  public outputStream: Deno.Writer;
  private drawQueue: DrawOperation[] = [];
  private currentScreen: Cell[][];
  private stdoutBuffer = "";

  /**
     * Creates the terminal object
     * @param {Deno.Reader} inputStream An input stream from which input events will be read
     * @param {Deno.Writer} outputStream An output stream to which the terminal will flush its output
     */
  constructor(
    inputStream: Deno.Reader = Deno.stdin,
    outputStream: Deno.Writer = Deno.stdout,
  ) {
    this.rows = 24;
    this.columns = 80;
    this.outputStream = outputStream;
    this.inputStream = inputStream;

    // Fill the terminal with black cells
    this.currentScreen = [...Array(this.rows)].map(() =>
      Array(this.columns).fill(createCell())
    );
  }

  /**
     * Initializes the terminal.
     *
     * More specifically, this function:
     *
     * 1. Sets raw mode, disabling any processing of input by the terminal (also disables echo)
     * 2. Stores the screen state, so it can be restored later
     * 3. Saves the cursor position, so it can be restored later
     * 4. Hides the cursor in the terminal
     * 5. Enables mouse reporting in the terminal, so mouse input events can be processed
     * 6. Clears the screen
     *
     * It is important to always call the 'close' function after calling this one, otherwise the
     * terminal this is running on will become unresponsive.
     */
  initialize() {
    Deno.setRaw(Deno.stdin.rid, true);
    writeToStream(
      this.outputStream,
      EscapeSequence.SMCUP +
        EscapeSequence.SAVE_CURSOR_POS +
        EscapeSequence.HIDE_CURSOR +
        EscapeSequence.ENABLE_MOUSE_REPORT +
        EscapeSequence.CLS,
    );
  }

  /**
     * Closes the terminal.
     *
     * This function does the exact opposite of the 'initialize' function. More specifically,
     * this function:
     *
     * 1. Disables raw mode
     * 2. Disables mouse reporting
     * 3. Clears the screen
     * 4. Restores the screen state
     * 5. Restores the cursor position
     * 6. Shows the cursor again
     */
  close() {
    Deno.setRaw(0, false);
    writeToStream(
      this.outputStream,
      EscapeSequence.DISABLE_MOUSE_REPORT +
        EscapeSequence.CLS +
        EscapeSequence.RMCUP +
        EscapeSequence.RESTORE_CURSOR_POS +
        EscapeSequence.SHOW_CURSOR,
    );
  }

  /**
     * Returns the latest input event read from the inputstream
     */
  async *getEvents(): AsyncIterableIterator<TerminalEvent> {
    while (true) {
      const event = await detectTerminalEvent(this.inputStream);
      if (event != null) {
        yield event;
      }
    }
  }

  /**
     * Sets the terminal size
     *
     * @param {number} columns Width of the terminal, measured in cells
     * @param {number} rows Height of the terminal, measured in cells
     */
  setSize(columns: number, rows: number) {
    this.rows = rows;
    this.columns = columns;
  }

  /**
     * Updates the terminal size to its actual size as reported by Deno
     */
  updateSize() {
    const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
    this.setSize(columns, rows);
  }

  /**
     * Returns the terminal size, measured in cells
     *
     * @returns {TerminalSize} An object containing the terminal row and columns size
     */
  getSize(): TerminalSize {
    return {
      columns: this.columns,
      rows: this.rows,
    };
  }

  /**
     * Clears the terminal screen. Similar effect to running clear in a console.
     */
  clear() {
    writeToStream(this.outputStream, EscapeSequence.CLS);
  }

  /**
     * Indicates whether the given coordinates lie within the terminal or not
     *
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @returns {boolean} a boolean indicating whether the given point lies within the terminal
     */
  isInsideTerminal(x: number, y: number): boolean {
    return (
      x >= 0 &&
      x < this.columns &&
      y >= 0 &&
      y < this.rows
    );
  }

  /**
     * Directly draws a cell on the terminal, circumventing the drawing operation queue
     *
     * @param {number} x
     * @param {number} y
     * @param {Cell} cell
     */
  public drawCell(x: number, y: number, cell: Cell) {
    const ESC = EscapeSequence.ESC;

    let color = cell.fore;
    const foregroundColor = `${ESC}[38;2;${color.r};${color.g};${color.b}m`;

    color = cell.back;
    const backgroundColor = `${ESC}[48;2;${color.r};${color.g};${color.b}m`;

    const character = `${ESC}[${y + 1};${x + 1}H${cell.char}`;
    const reset = `${ESC}[0m`;

    this.stdoutBuffer += foregroundColor + backgroundColor + character + reset;
  }

  /**
     * Sets a cell inside the terminal cell.
     *
     * This function adds a drawing operation to the queue, which will be processed
     * and added to the stdout-buffer after the 'refresh' function is called.
     *
     * @param {number} x X-coordinate of the cell
     * @param {number} y Y-coordinate of the cell
     * @param {string} char A single character
     * @param {Color} fore A foreground color
     * @param {Color} back A background color
     */
  setCharacter(
    x: number,
    y: number,
    char: string,
    fore: Color = createColor(255, 255, 255),
    back: Color = createColor(0, 0, 0),
  ) {
    const cell = createCell(char, fore, back);
    this.drawQueue.push(createDrawOp(x, y, cell));
  }

  /**
     * Draws a line onto to the terminal at the given row.
     *
     * This function adds multiple drawing operations to the queue, which will
     * be processed and added to the stdout-buffer after the 'refresh' function
     * is called.
     *
     * @param {number} row Y-position of the line
     * @param {string} line Line to be written to terminal
     * @param {Color} fore Foreground color
     * @param {Color} back Background color
     */
  writeLine(row: number, line: string, fore?: Color, back?: Color) {
    if (row > (this.rows - 1) || line.length > this.columns) {
      return;
    }

    for (let x = 0; x < this.columns; x++) {
      this.setCharacter(x, row, line[x], fore, back);
    }
  }

  /**
     * Draws an image onto the terminal at the given coordinates using block
     * characters. The image will be drawn from top left starting at the
     * given coordinates.
     *
     * @param {number} xPos Horizontal terminal coordinates
     * @param {number} yPos Vertical terminal coordinates
     * @param {Image} image The image to be drawn. Should have an even height
     */
  drawImage(xPos: number, yPos: number, image: Image) {
    for (let y = 0; y < image.height; y += 2) {
      for (let x = 0; x < image.width; x++) {
        const foreground: Color = image.pixels[y][x];
        const background: Color = image.pixels[y + 1][x];

        if (
          (xPos + x) < this.columns && (yPos + Math.floor(y / 2)) < this.rows
        ) {
          this.setCharacter(
            xPos + x,
            yPos + Math.floor(y / 2),
            "▀",
            foreground,
            background,
          );
        }
      }
    }
  }

  /**
     * Writes the output buffer to the output stream.
     */
  flush() {
    writeToStream(this.outputStream, this.stdoutBuffer);
    this.stdoutBuffer = "";
  }

  /**
     * Process all queued drawing operations and outputs the result to the stdout
     * buffer.
     */
  refresh() {
    while (this.drawQueue.length > 0) {
      const drawOp = this.drawQueue.shift();

      if (drawOp == null) {
        break;
      }

      const currentCell = this.currentScreen[drawOp.y][drawOp.x];

      if (!compareCells(drawOp.cell, currentCell)) {
        this.drawCell(drawOp.x, drawOp.y, drawOp.cell);
        this.currentScreen[drawOp.y][drawOp.x] = drawOp.cell;
      }
    }

    this.flush();
  }
}
