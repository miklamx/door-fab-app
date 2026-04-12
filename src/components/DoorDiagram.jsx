import { fmtInches } from "../utils/validation";

// SVG layout constants
const PAD_TOP = 28;
const PAD_BOTTOM = 24;
const PAD_LEFT = 60;
const PAD_RIGHT = 60;
const DOOR_W = 120;
const DOOR_H = 340;
const SVG_W = PAD_LEFT + DOOR_W + PAD_RIGHT; // 240
const SVG_H = PAD_TOP + DOOR_H + PAD_BOTTOM; // 392

// Map a position-from-top (inches) to an SVG y coordinate
function fromTop(pos, doorHeightIn) {
  return PAD_TOP + (pos / doorHeightIn) * DOOR_H;
}

// Map a position-from-bottom (inches) to an SVG y coordinate
function fromBottom(pos, doorHeightIn) {
  return PAD_TOP + ((doorHeightIn - pos) / doorHeightIn) * DOOR_H;
}

const DOOR_X = PAD_LEFT;
const DOOR_RIGHT = PAD_LEFT + DOOR_W;

export default function DoorDiagram({ door, printMode = false }) {
  const dh = parseFloat(door.doorHeight);
  const validDoor = !isNaN(dh) && dh > 0;

  const isLeftHand = door.swing === "Left";
  // Hinge edge: left side if Left Hand, right side if Right Hand
  const hingeX = isLeftHand ? DOOR_X : DOOR_RIGHT;
  // Latch edge: opposite side from hinges
  const latchX = isLeftHand ? DOOR_RIGHT : DOOR_X;

  // Colours (screen vs print)
  const c = printMode
    ? {
        doorFill: "#f8f8f8",
        doorStroke: "#333",
        hingeRect: "#aaa",
        hingeStroke: "#333",
        hingeLabel: "#444",
        knobFill: "#eee",
        knobStroke: "#333",
        knobLabel: "#333",
        deadboltStroke: "#555",
        deadboltLabel: "#444",
        dimLabel: "#666",
        swingLabel: "#555",
      }
    : {
        doorFill: "#0f172a",
        doorStroke: "#475569",
        hingeRect: "#334155",
        hingeStroke: "#64748b",
        hingeLabel: "#94a3b8",
        knobFill: "#1e293b",
        knobStroke: "#60a5fa",
        knobLabel: "#60a5fa",
        deadboltStroke: "#a78bfa",
        deadboltLabel: "#a78bfa",
        dimLabel: "#64748b",
        swingLabel: "#94a3b8",
      };

  // Build hinge list
  const hingeList = [];
  [
    { key: "h1", abbr: "H1" },
    { key: "h2", abbr: "H2" },
    { key: "h3", abbr: "H3" },
  ].forEach(({ key, abbr }) => {
    const val = parseFloat(door[key]);
    if (validDoor && !isNaN(val) && val > 0) {
      hingeList.push({ key, val, abbr, y: fromTop(val, dh) });
    }
  });

  const knobRaw = parseFloat(door.knob);
  const knobY =
    validDoor && !isNaN(knobRaw) && knobRaw > 0
      ? fromBottom(knobRaw, dh)
      : null;

  const dbRaw = parseFloat(door.deadbolt);
  const deadboltY =
    validDoor &&
    door.deadbolt !== "" &&
    door.deadbolt !== null &&
    !isNaN(dbRaw) &&
    dbRaw > 0
      ? fromBottom(dbRaw, dh)
      : null;

  // Label x positions (outside the door body)
  const hingeLabelX = isLeftHand ? DOOR_X - 4 : DOOR_RIGHT + 4;
  const hingeLabelAnchor = isLeftHand ? "end" : "start";
  const latchLabelX = isLeftHand ? DOOR_RIGHT + 4 : DOOR_X - 4;
  const latchLabelAnchor = isLeftHand ? "start" : "end";

  return (
    <div>
      {!printMode && (
        <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-widest">
          Diagram
        </p>
      )}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width={SVG_W}
        height={SVG_H}
        className="w-full max-w-[240px]"
        aria-label="Door diagram"
      >
        {/* Door body */}
        <rect
          x={DOOR_X}
          y={PAD_TOP}
          width={DOOR_W}
          height={DOOR_H}
          fill={c.doorFill}
          stroke={c.doorStroke}
          strokeWidth="2"
        />

        {/* Swing label at top */}
        {door.swing && (
          <text
            x={DOOR_X + DOOR_W / 2}
            y={PAD_TOP - 10}
            textAnchor="middle"
            fontSize="10"
            fill={c.swingLabel}
          >
            {door.swing} Hand
          </text>
        )}

        {/* Dimension label at bottom */}
        {validDoor && (
          <text
            x={DOOR_X + DOOR_W / 2}
            y={PAD_TOP + DOOR_H + 16}
            textAnchor="middle"
            fontSize="9"
            fill={c.dimLabel}
          >
            {fmtInches(door.doorWidth)} × {fmtInches(door.doorHeight)}
          </text>
        )}

        {/* Hinges */}
        {hingeList.map((h) => (
          <g key={h.key}>
            {/* Hinge plate rect — extends outward from the hinge edge */}
            <rect
              x={isLeftHand ? DOOR_X - 13 : DOOR_RIGHT}
              y={h.y - 9}
              width={13}
              height={18}
              rx={1}
              fill={c.hingeRect}
              stroke={c.hingeStroke}
              strokeWidth="1"
            />
            {/* Label */}
            <text
              x={hingeLabelX}
              y={h.y + 4}
              textAnchor={hingeLabelAnchor}
              fontSize="9"
              fill={c.hingeLabel}
            >
              {fmtInches(door[h.key])}
            </text>
          </g>
        ))}

        {/* Entry knob */}
        {knobY !== null && (
          <g>
            <circle
              cx={latchX}
              cy={knobY}
              r={8}
              fill={c.knobFill}
              stroke={c.knobStroke}
              strokeWidth="2"
            />
            <circle cx={latchX} cy={knobY} r={3} fill={c.knobStroke} />
            <text
              x={latchLabelX}
              y={knobY + 4}
              textAnchor={latchLabelAnchor}
              fontSize="9"
              fill={c.knobLabel}
            >
              {fmtInches(door.knob)}
            </text>
          </g>
        )}

        {/* Deadbolt */}
        {deadboltY !== null && (
          <g>
            <rect
              x={latchX - 4}
              y={deadboltY - 6}
              width={8}
              height={12}
              rx={2}
              fill={c.knobFill}
              stroke={c.deadboltStroke}
              strokeWidth="2"
            />
            <text
              x={latchLabelX}
              y={deadboltY + 4}
              textAnchor={latchLabelAnchor}
              fontSize="9"
              fill={c.deadboltLabel}
            >
              {fmtInches(door.deadbolt)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
