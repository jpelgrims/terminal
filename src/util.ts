/**
 * Writes the given string into the given writer.
 *
 * @param {Deno.Writer} outputStream An object implementing Deno.Writer
 * @param {string} text Text to be written to the stream
 */
export async function writeToStream(outputStream: Deno.Writer, text: string) {
  const contentBytes = new TextEncoder().encode(text);
  let bytesWritten = 0;

  // Deno.writer.write doesn't write the whole buffer at once, that's why we need to loop it
  while (bytesWritten < contentBytes.byteLength) {
    bytesWritten += await outputStream.write(
      contentBytes.subarray(bytesWritten),
    );
  }
}

/**
 * Sleep function, useful in some tests
 *
 * @param ms Time to sleep in milliseconds
 */
export function delay(ms: number) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

/**
 * Resize the given array to the given length.
 *
 * If the array is lenghtened, add the specified item
 * to fill up the new slots.
 *
 * @param {T[]} array     Array to resize
 * @param {number} newLength New length of the array
 * @param {T} newItem   Item to fill new slots with
 */
export function resizeArray<T>(
  array: T[],
  newLength: number,
  newItem: T | null = null,
) {
  const deleteCount = Math.max(0, array.length - newLength);
  const newItems = deleteCount === 0
    ? Array(newLength - array.length).fill(newItem)
    : [];
  array.splice(array.length - deleteCount, deleteCount, ...newItems);
}

/**
 * Resizes a nested array by calling resizeArray on each array within
 * the array.
 *
 * @param {T[][]} array       nested array to resize
 * @param {number} newWidth   Newd width of the array
 * @param {number} newHeight  New height of the array
 * @param {T} newItem         Item to fill new slots with
 */
export function resizeNestedArray<T>(
  array: T[][],
  newWidth: number,
  newHeight: number,
  newItem: T | null = null,
) {
  // Remove/add rows
  resizeArray(array, newHeight, Array(newWidth).fill(newItem));

  // Resize row width
  for (let y = 0; y < array.length; y++) {
    resizeArray(array[y], newWidth, newItem);
  }
}

export function isInsideRectangle(
  width: number,
  height: number,
  x: number,
  y: number,
) {
  return (
    x >= 0 &&
    x < width &&
    y >= 0 &&
    y < height
  );
}
