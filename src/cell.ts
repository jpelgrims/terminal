import { Color, Colors, compareColors } from "./color.ts";

export interface Cell {
  char: string;
  fore: Color;
  back: Color;
  modified: boolean;
}

/**
 * Returns a cell object with given values
 *
 * @param {string} char The character displayed in the cell
 * @param {Color} foregroundColor Foreground color of the cell
 * @param {Color} backgroundColor Background color of the cell
 * @returns {Cell} A cell object with the values specified in the parameters
 */
export function createCell(
  char = " ",
  foregroundColor: Color = Colors.WHITE,
  backgroundColor: Color = Colors.BLACK,
): Cell {
  return {
    char,
    fore: foregroundColor,
    back: backgroundColor,
    modified: false
  };
}

/**
 * Compares two cells for equality.
 *
 * Two cells are equal if they have the same character, the same foreground color
 * and the same bakcground color.
 *
 * @param {Cell} cell
 * @param {Cell} otherCell
 * @returns {boolean} A boolean indicating if the two cells are equal (true) or not (false)
 */
export function compareCells(
  cell: Cell | null,
  otherCell: Cell | null,
): boolean {
  if (cell == null || otherCell == null) {
    return false;
  }
  return cell.char === otherCell.char &&
    compareColors(cell.fore, otherCell.fore) &&
    compareColors(cell.back, otherCell.back);
}
