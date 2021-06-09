export enum EventType {
  Keyboard = "KEYBOARD",
  Mouse = "MOUSE",
  Window = "WINDOW",
}

export enum MouseAction {
  LeftClickHold,
  RightClickHold,
  LeftClickRelease,
  RightCLickRelease,
  Move,
  ScrollUp,
  ScrollDown,
}

export enum KeyPressAction {
  Up,
  Down,
}

export enum WindowAction {
  Resize,
}

export enum Key {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
  Up,
  Down,
  Left,
  Right,
  Space,
  Escape,
  Backspace,
  Sub,
  Tab,
  Home,
  End,
  Insert,
  Delete,
  PageUp,
  PageDown,
  F1,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  F10,
  F11,
  F12,
}

export interface KeyboardEvent {
  type: EventType.Keyboard;
  action: KeyPressAction;
  key: Key;
  ctrl: boolean;
  shift: boolean;
}

export interface MouseEvent {
  type: EventType.Mouse;
  action: MouseAction;
  x?: number;
  y?: number;
}

export interface WindowEvent {
  type: EventType.Window;
  action: WindowAction;
  width: number;
  height: number;
}

export type TerminalEvent = WindowEvent | MouseEvent | KeyboardEvent;
