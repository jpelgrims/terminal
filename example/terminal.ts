import { Terminal } from "https://deno.land/x/terminal@0.1.0-dev.1/src/mod.ts";

let running = true;
let x = 0;

async function render(terminal: Terminal) {
  terminal.setCell(x, terminal.getSize().rows - 1, "X");
  await terminal.refresh();

  const event = terminal.getEvent();
  if (event != null) {
    await terminal.close();
    running = false;
  }

  x++;

  if (running) {
    setTimeout(render, 10, terminal);
  }
}

async function main() {
  const terminal = new Terminal();
  await terminal.initialize();
  await render(terminal);
}

await main();
