export const ESC = "\u001b";
export const CLS = ESC + "[2J";
export const RESET = ESC + "[0m";
export const SHOW_CURSOR = ESC + "[?25h";
export const HIDE_CURSOR = ESC + "[?25l";
export const ENABLE_MOUSE_REPORT = ESC + "[?1003;1006;1015h";
export const DISABLE_MOUSE_REPORT = ESC + "[?1003;1006;1015l";
export const SAVE_CURSOR_POS = ESC + "[s";
export const RESTORE_CURSOR_POS = ESC + "[u";
// The esape codes below may only work on xterm (and gnome terminal)
export const SMCUP = ESC + "[?47h";
export const RMCUP = ESC + "[?47l";
