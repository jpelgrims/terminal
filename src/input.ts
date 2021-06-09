import { ESC } from "./escape_sequences.ts";
import {
  EventType,
  Key,
  KeyboardEvent,
  KeyPressAction,
  TerminalEvent,
} from "./event.ts";

export function createKeyboardEvent(
  key: Key,
  action: KeyPressAction = KeyPressAction.Down,
  shift = false,
  ctrl = false,
): KeyboardEvent {
  return {
    type: EventType.Keyboard,
    action,
    key,
    shift,
    ctrl,
  };
}

const escapeCodeToEvent = new Map<string, TerminalEvent>([
  ["\x03", createKeyboardEvent(Key.C, KeyPressAction.Down, false, true)],
  ["\x04", createKeyboardEvent(Key.D, KeyPressAction.Down, false, true)],
  [
    "\x7f",
    createKeyboardEvent(Key.Backspace, KeyPressAction.Down, false, false),
  ],
  ["\x1a", createKeyboardEvent(Key.Sub, KeyPressAction.Down, false, false)],
  ["\x1b", createKeyboardEvent(Key.Escape, KeyPressAction.Down, false, false)],

  [`${ESC}[A`, createKeyboardEvent(Key.Up)],
  [`${ESC}[C`, createKeyboardEvent(Key.Right)],
  [`${ESC}[B`, createKeyboardEvent(Key.Down)],
  [`${ESC}[D`, createKeyboardEvent(Key.Left)],
  [`${ESC}[H`, createKeyboardEvent(Key.Home)],
  [`${ESC}[F`, createKeyboardEvent(Key.End)],

  [`${ESC}[2~`, createKeyboardEvent(Key.Insert)],
  [`${ESC}[3~`, createKeyboardEvent(Key.Delete)],
  [`${ESC}[5~`, createKeyboardEvent(Key.PageUp)],
  [`${ESC}[6~`, createKeyboardEvent(Key.PageDown)],

  [`${ESC}OP`, createKeyboardEvent(Key.F1)],

  [
    `${ESC}[1;5A`,
    createKeyboardEvent(Key.Up, KeyPressAction.Down, false, true),
  ],
  [
    `${ESC}[1;5B`,
    createKeyboardEvent(Key.Down, KeyPressAction.Down, false, true),
  ],
  [
    `${ESC}[1;5C`,
    createKeyboardEvent(Key.Right, KeyPressAction.Down, false, true),
  ],
  [
    `${ESC}[1;5D`,
    createKeyboardEvent(Key.Left, KeyPressAction.Down, false, true),
  ],
]);

export async function detectTerminalEvent(
  inputStream: Deno.Reader,
): Promise<TerminalEvent | undefined> {
  const buffer = new Uint8Array(512);
  const bytesRead = await inputStream.read(buffer);

  if (bytesRead == null || bytesRead === 0) {
    return;
  }

  const sequence = new TextDecoder().decode(buffer.subarray(0, bytesRead));

  let event;
  if (sequence.length === 1 && escapeCodeToEvent.get(sequence) == null) {
    let key;

    if (sequence.charCodeAt(0) === 32) {
      key = Key.Space;
    } else {
      const enumIndex = sequence.charCodeAt(0) - "a".charCodeAt(0);

      if (enumIndex < 0) {
        // Only handle lowercase letters for now
        return;
      }
      key = <unknown> Key[enumIndex] as Key;
    }

    event = createKeyboardEvent(key);
  } else {
    event = escapeCodeToEvent.get(sequence);
  }

  if (event != null) {
    return event;
  }
}
