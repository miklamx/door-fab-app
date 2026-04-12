import { useState } from "react";
import InchInput from "./InchInput";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtInches(val) {
  if (val === "" || val === null || val === undefined) return "—";
  const num = parseFloat(val);
  if (isNaN(num)) return "—";
  const whole = Math.floor(num);
  const sixteenths = Math.round((num - whole) * 16);
  if (sixteenths === 0) return `${whole}"`;
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(sixteenths, 16);
  return `${whole} ${sixteenths / d}/${16 / d}"`;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(door) {
  const errors = {};
  const maxH =
    door.doorHeight !== "" && door.doorHeight !== null
      ? parseFloat(door.doorHeight)
      : null;

  // Job info
  if (!door.jobName.trim()) {
    errors.jobName = "Job name / number is required.";
  }

  // Door dimensions
  const dw = door.doorWidth === "" ? NaN : parseFloat(door.doorWidth);
  if (isNaN(dw)) {
    errors.doorWidth = "Door width is required.";
  } else if (dw <= 0 || dw >= 60) {
    errors.doorWidth = "Width must be greater than 0 and less than 60 inches.";
  }

  const dh = door.doorHeight === "" ? NaN : parseFloat(door.doorHeight);
  if (isNaN(dh)) {
    errors.doorHeight = "Door height is required.";
  } else if (dh <= 0 || dh >= 120) {
    errors.doorHeight = "Height must be greater than 0 and less than 120 inches.";
  }

  // Swing
  if (!door.swing) {
    errors.swing = "Swing direction is required.";
  }

  // Hinges
  const h1 = door.h1 === "" ? NaN : parseFloat(door.h1);
  if (isNaN(h1)) {
    errors.h1 = "Hinge 1 location is required.";
  } else if (h1 <= 0) {
    errors.h1 = "Hinge 1 must be greater than 0.";
  } else if (maxH !== null && h1 >= maxH) {
    errors.h1 = `Hinge 1 must be less than door height (${fmtInches(maxH)}).`;
  }

  if (door.h2 !== "" && door.h2 !== null) {
    const h2 = parseFloat(door.h2);
    if (isNaN(h2) || h2 <= 0) {
      errors.h2 = "Hinge 2 must be greater than 0.";
    } else if (maxH !== null && h2 >= maxH) {
      errors.h2 = `Hinge 2 must be less than door height (${fmtInches(maxH)}).`;
    }
  }

  const h3 = door.h3 === "" ? NaN : parseFloat(door.h3);
  if (isNaN(h3)) {
    errors.h3 = "Hinge 3 location is required.";
  } else if (h3 <= 0) {
    errors.h3 = "Hinge 3 must be greater than 0.";
  } else if (maxH !== null && h3 >= maxH) {
    errors.h3 = `Hinge 3 must be less than door height (${fmtInches(maxH)}).`;
  }

  // Hardware
  const knob = door.knob === "" ? NaN : parseFloat(door.knob);
  if (isNaN(knob)) {
    errors.knob = "Entry knob centerline is required.";
  } else if (knob <= 0) {
    errors.knob = "Knob centerline must be greater than 0.";
  } else if (maxH !== null && knob >= maxH) {
    errors.knob = `Knob must be less than door height (${fmtInches(maxH)}).`;
  }

  const db = door.deadbolt === "" ? NaN : parseFloat(door.deadbolt);
  if (isNaN(db)) {
    errors.deadbolt = "Deadbolt centerline is required.";
  } else if (db <= 0) {
    errors.deadbolt = "Deadbolt centerline must be greater than 0.";
  } else if (maxH !== null && db >= maxH) {
    errors.deadbolt = `Deadbolt must be less than door height (${fmtInches(maxH)}).`;
  }

  if (!door.backset) {
    errors.backset = "Backset is required.";
  }

  return errors;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 mt-6 border-b border-slate-700 pb-1">
      {children}
    </h2>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-red-400 text-xs mt-1">{msg}</p>;
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [status, setStatus] = useState("Presale");
  const [touched, setTouched] = useState({});
  const [door, setDoor] = useState({
    jobName: "",
    swing: "",
    doorWidth: "",
    doorHeight: "",
    h1: "",
    h2: "",
    h3: "",
    knob: "",
    deadbolt: "",
    backset: "2-3/8-in",
    notes: "",
  });

  const errors = validate(door);
  const isValid = Object.keys(errors).length === 0;

  function set(field, value) {
    setDoor((prev) => ({ ...prev, [field]: value }));
  }

  function touch(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function err(field) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleSave() {
    // Mark all fields touched to reveal all errors
    const allFields = Object.keys(door);
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    if (!isValid) return;
    setStatus("Production");
  }

  const inputClass = (field) =>
    `w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
      err(field) ? "border-red-500" : "border-slate-600"
    }`;

  return (
    <div className="p-4 max-w-lg mx-auto bg-slate-900 text-slate-100 min-h-screen shadow">
      <h1 className="text-2xl font-bold text-slate-100">Door Boring Order</h1>
      <p className="text-xs text-slate-400 mt-1 mb-2">
        Status:{" "}
        <span
          className={`font-semibold ${
            status === "Production" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {status}
        </span>
      </p>

      {/* ── Job Info ── */}
      <SectionHeader>Job Info</SectionHeader>
      <label className="block text-slate-200 text-sm font-medium">
        Order / Job Name or Number <span className="text-red-400">*</span>
        <input
          type="text"
          value={door.jobName}
          onChange={(e) => set("jobName", e.target.value)}
          onBlur={() => touch("jobName")}
          placeholder="e.g. JOB-2024-001"
          className={inputClass("jobName")}
        />
        <FieldError msg={err("jobName")} />
      </label>

      {/* ── Door Size ── */}
      <SectionHeader>Door Size</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Door Width <span className="text-red-400">*</span>
          </label>
          <InchInput
            id="doorWidth"
            value={door.doorWidth}
            onChange={(v) => {
              set("doorWidth", v);
              touch("doorWidth");
            }}
            error={err("doorWidth")}
          />
          <FieldError msg={err("doorWidth")} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Door Height <span className="text-red-400">*</span>
          </label>
          <InchInput
            id="doorHeight"
            value={door.doorHeight}
            onChange={(v) => {
              set("doorHeight", v);
              touch("doorHeight");
            }}
            error={err("doorHeight")}
          />
          <FieldError msg={err("doorHeight")} />
        </div>
      </div>

      {/* ── Swing ── */}
      <SectionHeader>Swing</SectionHeader>
      <p className="text-sm text-slate-300 mb-2">
        Standing outside facing the door — which side are the hinges on?{" "}
        <span className="text-red-400">*</span>
      </p>
      <div className="flex gap-2">
        {["Left", "Right"].map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => {
              set("swing", side);
              touch("swing");
            }}
            className={`flex-1 p-3 border rounded font-semibold transition-colors ${
              door.swing === side
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {side} Hand
          </button>
        ))}
      </div>
      <FieldError msg={err("swing")} />

      {/* ── Hinges ── */}
      <SectionHeader>Hinge Locations (from top of door)</SectionHeader>
      <div className="space-y-4">
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Hinge 1 — Top <span className="text-red-400">*</span>
          </label>
          <InchInput
            id="h1"
            value={door.h1}
            onChange={(v) => {
              set("h1", v);
              touch("h1");
            }}
            error={err("h1")}
          />
          <FieldError msg={err("h1")} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Hinge 2 — Middle{" "}
            <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <InchInput
            id="h2"
            value={door.h2}
            onChange={(v) => {
              set("h2", v);
              touch("h2");
            }}
            error={err("h2")}
          />
          <FieldError msg={err("h2")} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Hinge 3 — Bottom <span className="text-red-400">*</span>
          </label>
          <InchInput
            id="h3"
            value={door.h3}
            onChange={(v) => {
              set("h3", v);
              touch("h3");
            }}
            error={err("h3")}
          />
          <FieldError msg={err("h3")} />
        </div>
      </div>

      {/* ── Hardware ── */}
      <SectionHeader>Hardware</SectionHeader>
      <div className="space-y-4">
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Entry Knob Centerline (from bottom){" "}
            <span className="text-red-400">*</span>
          </label>
          <InchInput
            id="knob"
            value={door.knob}
            onChange={(v) => {
              set("knob", v);
              touch("knob");
            }}
            error={err("knob")}
          />
          <FieldError msg={err("knob")} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Deadbolt Centerline (from bottom){" "}
            <span className="text-red-400">*</span>
          </label>
          <InchInput
            id="deadbolt"
            value={door.deadbolt}
            onChange={(v) => {
              set("deadbolt", v);
              touch("deadbolt");
            }}
            error={err("deadbolt")}
          />
          <FieldError msg={err("deadbolt")} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Backset <span className="text-red-400">*</span>
            <select
              value={door.backset}
              onChange={(e) => {
                set("backset", e.target.value);
                touch("backset");
              }}
              className={`w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
                err("backset") ? "border-red-500" : "border-slate-600"
              }`}
            >
              <option value="2-3/8-in">2-3/8 in</option>
              <option value="2-3/4-in">2-3/4 in</option>
            </select>
            <FieldError msg={err("backset")} />
          </label>
        </div>
      </div>

      {/* ── Notes ── */}
      <SectionHeader>Notes / Special Instructions</SectionHeader>
      <textarea
        value={door.notes}
        onChange={(e) => set("notes", e.target.value)}
        rows={3}
        placeholder="Any special instructions or notes for this order…"
        className="w-full border border-slate-600 bg-slate-800 text-slate-100 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
      />

      {/* ── Actions ── */}
      <SectionHeader>Actions</SectionHeader>

      {!isValid && Object.values(touched).some(Boolean) && (
        <p className="text-red-400 text-sm mb-3">
          Please fix the errors above before saving for production.
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={status === "Production"}
        className={`w-full p-3 rounded font-bold transition-colors ${
          status === "Production"
            ? "bg-green-700 text-white cursor-not-allowed opacity-70"
            : isValid
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-slate-700 hover:bg-slate-600 text-white"
        }`}
      >
        {status === "Production" ? "✓ Saved for Production" : "Save for Production"}
      </button>

      {/* ── Summary ── */}
      {status === "Production" && (
        <div className="mt-6 p-4 border border-green-700 rounded bg-slate-800">
          <h3 className="text-green-400 font-bold mb-3">Order Summary</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-400">Job</dt>
            <dd className="text-slate-100">{door.jobName}</dd>
            <dt className="text-slate-400">Width</dt>
            <dd className="text-slate-100">{fmtInches(door.doorWidth)}</dd>
            <dt className="text-slate-400">Height</dt>
            <dd className="text-slate-100">{fmtInches(door.doorHeight)}</dd>
            <dt className="text-slate-400">Swing</dt>
            <dd className="text-slate-100">{door.swing} Hand</dd>
            <dt className="text-slate-400">Hinge 1</dt>
            <dd className="text-slate-100">{fmtInches(door.h1)}</dd>
            <dt className="text-slate-400">Hinge 2</dt>
            <dd className="text-slate-100">
              {door.h2 !== "" && door.h2 !== null ? fmtInches(door.h2) : "—"}
            </dd>
            <dt className="text-slate-400">Hinge 3</dt>
            <dd className="text-slate-100">{fmtInches(door.h3)}</dd>
            <dt className="text-slate-400">Knob CL</dt>
            <dd className="text-slate-100">{fmtInches(door.knob)}</dd>
            <dt className="text-slate-400">Deadbolt CL</dt>
            <dd className="text-slate-100">{fmtInches(door.deadbolt)}</dd>
            <dt className="text-slate-400">Backset</dt>
            <dd className="text-slate-100">{door.backset}</dd>
            {door.notes && (
              <>
                <dt className="text-slate-400">Notes</dt>
                <dd className="text-slate-100">{door.notes}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
