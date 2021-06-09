import { Cell } from "./cell.ts";

export interface DrawOperation {
  x: number;
  y: number;
  cell: Cell;
}

/**
 * Returns a drawing operation object with given values.
 *
 * This object represents an update of a single cell on the terminal at the specified
 * coordinates.
 *
 * @param {number} x A number specifying an x coordinate on the terminal
 * @param {number} y A number specifiying a y location on the terminal
 * @param {Cell} cell A cell to be drawn at location { x, y } on the terminal
 * @returns {DrawOperation} A drawing operation object with the values specified in the parameters
 */
export function createDrawOp(x: number, y: number, cell: Cell): DrawOperation {
  return {
    x,
    y,
    cell,
  };
}
