import { Buffer } from "./deps.ts";

export class TestStream extends Buffer {
  async writeString(text: string) {
    const encoder = new TextEncoder();
    const byteMessage = encoder.encode(text);
    await this.write(byteMessage);
  }
}
