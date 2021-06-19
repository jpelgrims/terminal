import { info } from "https://deno.land/std@0.98.0/log/mod.ts";
import { TerminalCanvas } from "../src/canvas.ts";
import { Colors } from "../src/mod.ts";

let running = true;

function makeItRain(canvas: TerminalCanvas, rainOffset: number) {
  const screenHeight = 29;
  const dropsPerColumn = 3;
  const dropLength = 5;
  const spaceBetweenDrops = 4;
  const distanceBetweenDropHeads = (dropLength + spaceBetweenDrops);
  for (let x = 0; x < canvas.width; x += 3) {
    for (let i = 0; i < dropsPerColumn; i++) {
      let offset = rainOffset % distanceBetweenDropHeads;

      if (x % 2 === 0) {
        offset += spaceBetweenDrops;
      }

      const offScreenRain = (screenHeight - 1) - (offset + i * 9 + dropLength);
      if (offScreenRain < 0) {
        canvas.drawLine(
          x,
          0,
          x,
          Math.min(
            Math.abs(offScreenRain),
            Math.min(0, offset - spaceBetweenDrops),
          ),
          Colors.WHITE,
        );
      }
      canvas.drawLine(
        x,
        Math.min(offset + i * distanceBetweenDropHeads, screenHeight - 1),
        x,
        Math.min(
          offset + i * distanceBetweenDropHeads + dropLength,
          screenHeight - 1,
        ),
        Colors.WHITE,
      );
    }
  }
}

function renderDenoLogo(canvas: TerminalCanvas) {
  // Draw body
  canvas.drawLine(10, 2, 20, 2, Colors.WHITE);
  canvas.drawLine(9, 3, 21, 3, Colors.WHITE);
  canvas.drawLine(8, 4, 22, 4, Colors.WHITE);
  canvas.drawPixel(9, 4, Colors.BLACK);
  canvas.drawPixel(12, 4, Colors.BLACK);
  canvas.drawLine(7, 5, 23, 5, Colors.WHITE);
  canvas.drawLine(7, 6, 23, 6, Colors.WHITE);
  canvas.drawLine(7, 7, 23, 7, Colors.WHITE);
  canvas.drawLine(8, 8, 23, 8, Colors.WHITE);
  canvas.drawPixel(18, 8, Colors.BLACK);
  canvas.drawPixel(19, 7, Colors.BLACK);
  canvas.drawRectangle(18, 9, 6, 12, Colors.WHITE);

  // Draw outline
  canvas.drawPath([
    [6, 8],
    [6, 4],
    [7, 4],
    [7, 3],
    [8, 3],
    [8, 2],
    [9, 2],
    [10, 1],
    [21, 1],
    [21, 2],
    [22, 2],
    [22, 3],
    [23, 3],
    [23, 4],
    [24, 4],
    [24, 10],
  ], Colors.RED);
}

let counter = 0;

async function render(canvas: TerminalCanvas) {
  //makeItRain(canvas, counter);
  renderDenoLogo(canvas);

  await canvas.render();

  const event = canvas.getEvent();
  if (event != null) {
    await canvas.close();
    running = false;
  }

  if (running) {
    counter++;
    setTimeout(render, 100, canvas);
  }
}

async function main() {
  const canvas = new TerminalCanvas();
  await canvas.initialize();
  await render(canvas);
}

await main();
