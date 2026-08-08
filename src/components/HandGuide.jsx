import { FINGER_COLORS } from "../lib/fingerMap";

/* ── Styling helpers ── */
function activeStyle(color) {
  return {
    fill: `${color}30`,
    stroke: color,
    strokeWidth: 2,
    transition: "all 0.15s ease",
  };
}

function shiftStyle(color) {
  return {
    fill: `${color}12`,
    stroke: color,
    strokeWidth: 2,
    strokeDasharray: "4 2",
    transition: "all 0.2s ease",
  };
}

const defaultStyle = {
  fill: "rgba(255,255,255,0.03)",
  stroke: "rgba(255,255,255,0.08)",
  strokeWidth: 1.5,
  transition: "all 0.2s ease",
};

/* ── Finger rectangle data for Left Hand ──
   viewBox: 0 0 190 260
   All finger bottoms at y ≈ 163 to overlap with palm (top at y=148).
*/
const LEFT_FINGERS = [
  { name: "left-pinky", x: 18, y: 88, w: 26, h: 75, rx: 13 },
  { name: "left-ring", x: 52, y: 38, w: 28, h: 125, rx: 14 },
  { name: "left-middle", x: 88, y: 14, w: 30, h: 149, rx: 15 },
  { name: "left-index", x: 124, y: 42, w: 28, h: 121, rx: 14 },
];

const LEFT_THUMB = {
  name: "thumbs",
  x: 152,
  y: 152,
  w: 26,
  h: 56,
  rx: 13,
  rotate: 35,
  cx: 165,
  cy: 180,
};

/* ── Finger rectangle data for Right Hand ──
   Mirrored from left hand within the same viewBox.
*/
const RIGHT_FINGERS = [
  { name: "right-index", x: 38, y: 42, w: 28, h: 121, rx: 14 },
  { name: "right-middle", x: 72, y: 14, w: 30, h: 149, rx: 15 },
  { name: "right-ring", x: 110, y: 38, w: 28, h: 125, rx: 14 },
  { name: "right-pinky", x: 146, y: 88, w: 26, h: 75, rx: 13 },
];

const RIGHT_THUMB = {
  name: "thumbs",
  x: 12,
  y: 152,
  w: 26,
  h: 56,
  rx: 13,
  rotate: -35,
  cx: 25,
  cy: 180,
};

/* ── Determine the style for a finger element ── */
function fingerStyle(fingerName, activeFinger, shiftFinger) {
  if (fingerName === "thumbs" && activeFinger === "thumbs") {
    return activeStyle(FINGER_COLORS.thumbs);
  }
  if (activeFinger === fingerName) {
    return activeStyle(FINGER_COLORS[fingerName]);
  }
  if (shiftFinger === fingerName) {
    return shiftStyle(FINGER_COLORS[fingerName]);
  }
  return defaultStyle;
}

/* ── Single Hand SVG ── */
function HandSVG({ fingers, thumb, palmX, palmW, activeFinger, shiftFinger }) {
  return (
    <svg viewBox="0 0 190 260" className="w-[110px] h-[150px] sm:w-[130px] sm:h-[178px]">
      {/* Palm */}
      <rect
        x={palmX}
        y={148}
        width={palmW}
        height={102}
        rx={24}
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1.5}
      />

      {/* Fingers */}
      {fingers.map((f) => (
        <rect
          key={f.name}
          x={f.x}
          y={f.y}
          width={f.w}
          height={f.h}
          rx={f.rx}
          {...fingerStyle(f.name, activeFinger, shiftFinger)}
        />
      ))}

      {/* Thumb (rotated) */}
      <rect
        x={thumb.x}
        y={thumb.y}
        width={thumb.w}
        height={thumb.h}
        rx={thumb.rx}
        transform={`rotate(${thumb.rotate}, ${thumb.cx}, ${thumb.cy})`}
        {...fingerStyle(thumb.name, activeFinger, shiftFinger)}
      />
    </svg>
  );
}

/* ── Finger name label ── */
function FingerLabel({ activeFinger }) {
  if (!activeFinger) return <span className="text-muted/40">Ready</span>;

  const color = FINGER_COLORS[activeFinger];
  const label = activeFinger === "thumbs"
    ? "Thumb"
    : activeFinger
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  return <span style={{ color }}>{label}</span>;
}

/* ── Main HandGuide Component ── */
export default function HandGuide({ activeFinger, shiftFinger }) {
  return (
    <div
      className="flex flex-col items-center gap-1"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-end justify-center gap-4 sm:gap-8">
        {/* Left hand */}
        <div className="flex flex-col items-center">
          <HandSVG
            fingers={LEFT_FINGERS}
            thumb={LEFT_THUMB}
            palmX={12}
            palmW={148}
            activeFinger={activeFinger}
            shiftFinger={shiftFinger}
          />
          <span className="text-[10px] text-muted/50 font-medium tracking-wider uppercase">
            Left
          </span>
        </div>

        {/* Right hand */}
        <div className="flex flex-col items-center">
          <HandSVG
            fingers={RIGHT_FINGERS}
            thumb={RIGHT_THUMB}
            palmX={30}
            palmW={148}
            activeFinger={activeFinger}
            shiftFinger={shiftFinger}
          />
          <span className="text-[10px] text-muted/50 font-medium tracking-wider uppercase">
            Right
          </span>
        </div>
      </div>

      {/* Active finger label */}
      <p className="text-xs font-medium tracking-wide mt-1">
        <FingerLabel activeFinger={activeFinger} />
      </p>
    </div>
  );
}
