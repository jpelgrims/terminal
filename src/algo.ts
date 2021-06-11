
/**
 * Implementation of the bresenham algorithm, which gives a line
 * on a raster between two specified points. 
 * 
 * @param x1 X-coordinate of the start point
 * @param y1 Y-coordinate of the start point
 * @param x2 X-coordinate of the end point
 * @param y2 Y-coordinate of the end point
 * @returns {} A list of points that represent a line between the specified points
 */
export function bresenham(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { x: number; y: number }[] {
  let x, y, xEnd, yEnd;
  const coordinates = [];

  const dx = x2 - x1;
  const dy = y2 - y1;

  let px = 2 * Math.abs(dy) - Math.abs(dx);
  let py = 2 * Math.abs(dx) - Math.abs(dy);

  if (Math.abs(dy) <= Math.abs(dx)) {
    // Line goes left to right
    if (dx >= 0) {
      x = x1;
      y = y1;
      xEnd = x2;
    } else {
      x = x2;
      y = y2;
      xEnd = x1;
    }

    // First pixel of the line
    coordinates.push({ x, y });

    // Draw rest of the line
    while (x < xEnd) {
      x++;

      if (px < 0) {
        px += 2 * Math.abs(dy);
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y++;
        } else {
          y--;
        }
        px += 2 * (Math.abs(dy) - Math.abs(dx));
      }

      coordinates.push({ x, y });
    }
  } else {
    if (dy >= 0) {
      x = x1;
      y = y1;
      yEnd = y2;
    } else {
      x = x2;
      y = y2;
      yEnd = y1;
    }

    // First pixel of the line
    coordinates.push({ x, y });

    while (y < yEnd) {
      y++;

      if (py <= 0) {
        py += 2 * Math.abs(dx);
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy && 0)) {
          x++;
        } else {
          x--;
        }

        py += 2 * (Math.abs(dx) - Math.abs(dy));
      }

      coordinates.push({ x, y });
    }
  }

  return coordinates;
}
