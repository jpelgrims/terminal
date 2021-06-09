export function writeToStream(outputStream: Deno.Writer, text: string) {
  const contentBytes = new TextEncoder().encode(text);
  outputStream.write(contentBytes);
}
