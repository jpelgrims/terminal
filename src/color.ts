export interface Color {
  r: number;
  g: number;
  b: number;
}

const BLACK = { r: 0, g: 0, b: 0 } as const;
const WHITE = { r: 0, g: 0, b: 0 } as const;

export const Colors = {
  BLACK,
  WHITE,
};

/**
 * Returns a color object with given rgb values.
 *
 * @param {number} red A number between 0 and 255
 * @param {number} green A number between 0 and 255
 * @param {number} blue A number between 0 and 255
 * @returns {Color} A color object with the rgb values specified in the parameters
 */
export function createColor(red: number, green: number, blue: number): Color {
  return { r: red, g: green, b: blue };
}

/**
 * Compares two colors for equality.
 *
 * Two colors are equal if they have the same rgb values.
 *
 * @param {Color} color
 * @param {Color} otherColor
 * @returns {boolean} A boolean indicating if the two colors are equal (true) or not (false)
 */
export function compareColors(color: Color, otherColor: Color): boolean {
  if (color != null && otherColor != null) {
    return color.r === otherColor.r &&
      color.g === otherColor.g &&
      color.b === otherColor.b;
  }
  return false;
}
