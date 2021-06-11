import { ESC } from "../src/escape_sequences.ts";
import { createKeyboardEvent } from "../src/input.ts";
import { Key, Terminal } from "../src/mod.ts";
import { assertEquals } from "./deps.ts";
import { TestStream } from "./test_utils.ts";

Deno.test("Terminal size setting", () => {
  const terminal = new Terminal();
  terminal.setSize(40, 12);
  assertEquals(terminal.getSize(), { columns: 40, rows: 12 });
});

Deno.test("Input event parsing", async () => {
  const inputStream = new TestStream();
  const terminal = new Terminal(inputStream);

  inputStream.writeString(`${ESC}[A`);

  await terminal.parseEventLoop(true);

  const event = terminal.getEvent();
  assertEquals(event, createKeyboardEvent(Key.Up));
});
