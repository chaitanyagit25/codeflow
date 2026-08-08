/**
 * Finger-to-key mapping for a standard QWERTY keyboard.
 * Shared by VirtualKeyboard and HandGuide components.
 */

/* ── 9 distinct finger colors ── */
export const FINGER_COLORS = {
  "left-pinky": "#e06c75",
  "left-ring": "#e5c07b",
  "left-middle": "#61afef",
  "left-index": "#98c379",
  "right-index": "#c678dd",
  "right-middle": "#56b6c2",
  "right-ring": "#d19a66",
  "right-pinky": "#be5046",
  thumbs: "#7c8499",
};

/* ── Shifted character → base key ── */
const SHIFT_TO_BASE = {
  "~": "`",
  "!": "1",
  "@": "2",
  "#": "3",
  $: "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  _: "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
};

/* ── Build key → finger lookup ── */
const KEY_TO_FINGER = {};

const FINGER_KEYS = {
  "left-pinky": ["`", "1", "q", "a", "z"],
  "left-ring": ["2", "w", "s", "x"],
  "left-middle": ["3", "e", "d", "c"],
  "left-index": ["4", "5", "r", "t", "f", "g", "v", "b"],
  "right-index": ["6", "7", "y", "u", "h", "j", "n", "m"],
  "right-middle": ["8", "i", "k", ","],
  "right-ring": ["9", "o", "l", "."],
  "right-pinky": ["0", "-", "=", "p", "[", "]", "\\", ";", "'", "/"],
  thumbs: [" "],
};

for (const [finger, keys] of Object.entries(FINGER_KEYS)) {
  for (const key of keys) {
    KEY_TO_FINGER[key] = finger;
  }
}

// Special keys
KEY_TO_FINGER["\n"] = "right-pinky"; // Enter
KEY_TO_FINGER["\t"] = "left-pinky"; // Tab

/**
 * Convert a character to its base physical key.
 * E.g. '{' → '[', 'A' → 'a', '\n' → '\n'
 */
export function charToBaseKey(char) {
  if (!char) return null;
  if (SHIFT_TO_BASE[char]) return SHIFT_TO_BASE[char];
  return char.toLowerCase();
}

/**
 * Get the finger name for any character.
 */
export function getFingerForChar(char) {
  if (!char) return null;
  const base = charToBaseKey(char);
  return KEY_TO_FINGER[base] || null;
}

/**
 * Check if a character requires the Shift key.
 */
export function needsShift(char) {
  if (!char) return false;
  return /[A-Z]/.test(char) || char in SHIFT_TO_BASE;
}
