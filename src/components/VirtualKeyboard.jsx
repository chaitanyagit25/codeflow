import { useMemo } from "react";
import {
  FINGER_COLORS,
  charToBaseKey,
  needsShift,
  getFingerForChar,
} from "../lib/fingerMap";

/* ── Keyboard layout data ──
   Each row sums to 15 key-units.
   u = proportional width (1 = standard key).
   char = lowercase base character for highlight matching.
   finger = which finger types this key.
   home = true for home-row bumps (F, J).
   sub = shifted symbol shown above the label.
   spacer = invisible gap element.
*/
const ROWS = [
  /* Row 1 — Number row */
  [
    { label: "`", sub: "~", char: "`", finger: "left-pinky", u: 1 },
    { label: "1", sub: "!", char: "1", finger: "left-pinky", u: 1 },
    { label: "2", sub: "@", char: "2", finger: "left-ring", u: 1 },
    { label: "3", sub: "#", char: "3", finger: "left-middle", u: 1 },
    { label: "4", sub: "$", char: "4", finger: "left-index", u: 1 },
    { label: "5", sub: "%", char: "5", finger: "left-index", u: 1 },
    { label: "6", sub: "^", char: "6", finger: "right-index", u: 1 },
    { label: "7", sub: "&", char: "7", finger: "right-index", u: 1 },
    { label: "8", sub: "*", char: "8", finger: "right-middle", u: 1 },
    { label: "9", sub: "(", char: "9", finger: "right-ring", u: 1 },
    { label: "0", sub: ")", char: "0", finger: "right-pinky", u: 1 },
    { label: "-", sub: "_", char: "-", finger: "right-pinky", u: 1 },
    { label: "=", sub: "+", char: "=", finger: "right-pinky", u: 1 },
    { label: "⌫", char: "Backspace", finger: "right-pinky", u: 2 },
  ],
  /* Row 2 — Top row */
  [
    { label: "Tab", char: "Tab", finger: "left-pinky", u: 1.5 },
    { label: "Q", char: "q", finger: "left-pinky", u: 1 },
    { label: "W", char: "w", finger: "left-ring", u: 1 },
    { label: "E", char: "e", finger: "left-middle", u: 1 },
    { label: "R", char: "r", finger: "left-index", u: 1 },
    { label: "T", char: "t", finger: "left-index", u: 1 },
    { label: "Y", char: "y", finger: "right-index", u: 1 },
    { label: "U", char: "u", finger: "right-index", u: 1 },
    { label: "I", char: "i", finger: "right-middle", u: 1 },
    { label: "O", char: "o", finger: "right-ring", u: 1 },
    { label: "P", char: "p", finger: "right-pinky", u: 1 },
    { label: "[", sub: "{", char: "[", finger: "right-pinky", u: 1 },
    { label: "]", sub: "}", char: "]", finger: "right-pinky", u: 1 },
    { label: "\\", sub: "|", char: "\\", finger: "right-pinky", u: 1.5 },
  ],
  /* Row 3 — Home row */
  [
    { label: "Caps", char: "CapsLock", finger: "left-pinky", u: 1.75 },
    { label: "A", char: "a", finger: "left-pinky", u: 1 },
    { label: "S", char: "s", finger: "left-ring", u: 1 },
    { label: "D", char: "d", finger: "left-middle", u: 1 },
    { label: "F", char: "f", finger: "left-index", u: 1, home: true },
    { label: "G", char: "g", finger: "left-index", u: 1 },
    { label: "H", char: "h", finger: "right-index", u: 1 },
    { label: "J", char: "j", finger: "right-index", u: 1, home: true },
    { label: "K", char: "k", finger: "right-middle", u: 1 },
    { label: "L", char: "l", finger: "right-ring", u: 1 },
    { label: ";", sub: ":", char: ";", finger: "right-pinky", u: 1 },
    { label: "'", sub: '"', char: "'", finger: "right-pinky", u: 1 },
    { label: "Enter", char: "Enter", finger: "right-pinky", u: 2.25 },
  ],
  /* Row 4 — Bottom row */
  [
    { label: "Shift", char: "Shift_L", finger: "left-pinky", u: 2.25 },
    { label: "Z", char: "z", finger: "left-pinky", u: 1 },
    { label: "X", char: "x", finger: "left-ring", u: 1 },
    { label: "C", char: "c", finger: "left-middle", u: 1 },
    { label: "V", char: "v", finger: "left-index", u: 1 },
    { label: "B", char: "b", finger: "left-index", u: 1 },
    { label: "N", char: "n", finger: "right-index", u: 1 },
    { label: "M", char: "m", finger: "right-index", u: 1 },
    { label: ",", sub: "<", char: ",", finger: "right-middle", u: 1 },
    { label: ".", sub: ">", char: ".", finger: "right-ring", u: 1 },
    { label: "/", sub: "?", char: "/", finger: "right-pinky", u: 1 },
    { label: "Shift", char: "Shift_R", finger: "right-pinky", u: 2.75 },
  ],
  /* Row 5 — Space bar */
  [
    { label: "", char: null, finger: null, u: 3.75, spacer: true },
    { label: "", char: " ", finger: "thumbs", u: 7.5 },
    { label: "", char: null, finger: null, u: 3.75, spacer: true },
  ],
];

/* ── Determine which keys should be highlighted ── */
function getHighlightInfo(nextChar) {
  if (!nextChar) return { baseKey: null, shiftKey: null };

  let baseKey = charToBaseKey(nextChar);

  // Map special chars to our keyboard char values
  if (nextChar === "\n") baseKey = "Enter";
  else if (nextChar === "\t") baseKey = "Tab";

  let shiftKey = null;
  if (needsShift(nextChar)) {
    const finger = getFingerForChar(nextChar);
    // Opposite hand's shift key
    shiftKey = finger?.startsWith("left") ? "Shift_R" : "Shift_L";
  }

  return { baseKey, shiftKey };
}

/* ── Single key component ── */
function Key({ data, highlighted }) {
  const color = data.finger ? FINGER_COLORS[data.finger] : "#555";

  const bgNormal = `${color}0a`;
  const bgHighlight = `${color}30`;
  const borderNormal = `${color}18`;
  const borderHighlight = `${color}aa`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg border select-none transition-all duration-150 ${
        highlighted
          ? "scale-[1.04] z-10 text-white"
          : "text-gray-500 hover:text-gray-400"
      }`}
      style={{
        flex: data.u,
        minWidth: 0,
        height: 36,
        background: highlighted
          ? `linear-gradient(180deg, ${bgHighlight} 0%, ${color}1a 100%)`
          : `linear-gradient(180deg, ${bgNormal} 0%, transparent 100%)`,
        borderColor: highlighted ? borderHighlight : borderNormal,
        boxShadow: highlighted
          ? `0 0 14px ${color}50, 0 0 4px ${color}30, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Shifted symbol (small, above) */}
      {data.sub && (
        <span
          className="leading-none"
          style={{
            fontSize: 8,
            opacity: highlighted ? 0.8 : 0.35,
            marginBottom: -1,
          }}
        >
          {data.sub}
        </span>
      )}

      {/* Main label */}
      <span
        className="font-medium leading-none"
        style={{ fontSize: data.label.length > 3 ? 8 : data.label.length > 1 ? 9 : 11 }}
      >
        {data.label}
      </span>

      {/* Home-row indicator (F & J bumps) */}
      {data.home && (
        <span
          className="absolute rounded-full"
          style={{
            bottom: 4,
            width: 8,
            height: 2,
            backgroundColor: highlighted ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
          }}
        />
      )}
    </div>
  );
}

/* ── VirtualKeyboard ── */
export default function VirtualKeyboard({ nextChar }) {
  const { baseKey, shiftKey } = useMemo(() => getHighlightInfo(nextChar), [nextChar]);

  function isHighlighted(keyChar) {
    if (!keyChar || !baseKey) return false;
    if (keyChar === baseKey) return true;
    if (shiftKey && keyChar === shiftKey) return true;
    return false;
  }

  return (
    <div
      className="rounded-2xl border border-border bg-surface-1/40 p-3 sm:p-4 backdrop-blur-sm overflow-x-auto"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="space-y-[3px]" style={{ minWidth: 580 }}>
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-[3px]">
            {row.map((key, ki) => {
              if (key.spacer) {
                return <div key={ki} style={{ flex: key.u, minWidth: 0 }} />;
              }
              return (
                <Key
                  key={ki}
                  data={key}
                  highlighted={isHighlighted(key.char)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
