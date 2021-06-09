import { ESC } from "../src/escape_sequences.ts";
import { createKeyboardEvent } from "../src/input.ts";
import { Key, Terminal } from "../src/mod.ts";
import { assertEquals, Buffer } from './deps.ts';

class TestStream extends Buffer {

    async writeString(text: string) {
        const encoder = new TextEncoder();
        const byteMessage = encoder.encode(text);
        await this.write(byteMessage);
    }
}

Deno.test("Terminal size setting", () => {
    const terminal = new Terminal();
    assertEquals(terminal.getSize(), { columns: 80, rows: 24 });

    terminal.setSize(40, 12);
    assertEquals(terminal.getSize(), { columns: 40, rows: 12 });
});

Deno.test("Input event parsing", async () => {
    const inputStream = new TestStream();
    const terminal = new Terminal(inputStream);

    inputStream.writeString(`${ESC}[A`);

    const iteratorResult = await terminal.getEvents().next();
    assertEquals(iteratorResult.value, createKeyboardEvent(Key.Up));
});