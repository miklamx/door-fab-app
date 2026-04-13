import { useState } from "react";
import InchInput from "../InchInput";
import SectionHeader from "./SectionHeader";
import FieldError from "./FieldError";
import { PRESETS } from "../data/presets";
import { validate } from "../utils/validation";

export default function DoorForm({ door, onChange, onSave, onApplyPreset }) {
  const [touched, setTouched] = useState({});
  const [selectedPreset, setSelectedPreset] = useState("");

  const errors = validate(door);
  const isValid = Object.keys(errors).length === 0;

  function touch(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function err(field) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleSave() {
    const allFields = [
      "jobName",
      "doorWidth",
      "doorHeight",
      "swing",
      "h1",
      "h3",
      "knob",
      "backset",
    ];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    if (!isValid) return;
    onSave();
  }

  function handlePresetChange(e) {
    const presetId = e.target.value;
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onApplyPreset(preset.fields);
      setTouched({});
    }
    // Reset to placeholder so the same preset can be re-applied
    setSelectedPreset("");
  }

  const inputClass = (field) =>
    `w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
      err(field) ? "border-red-500" : "border-slate-600"
    }`;

  return (
    <div>
      {/* ── Preset selector ── */}
      <div className="mb-2">
        <label className="block text-slate-200 text-sm font-medium mb-1">
          Load Preset
        </label>
        <select
          value={selectedPreset}
          onChange={handlePresetChange}
          className="w-full border border-slate-600 p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled>
            — Select a preset template —
          </option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Job Info ── */}
      <SectionHeader>Job Info</SectionHeader>
      <label className="block text-slate-200 text-sm font-medium mb-3">
        Door Name{" "}
        <span className="text-slate-500 font-normal">(optional)</span>
        <input
          type="text"
          value={door.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g. Front Entry, Unit 4B"
          className={inputClass("name")}
        />
      </label>
      <label className="block text-slate-200 text-sm font-medium">
        Order / Job Name or Number <span className="text-red-400">*</span>
        <input
          type="text"
          value={door.jobName}
          onChange={(e) => onChange("jobName", e.target.value)}
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
              onChange("doorWidth", v);
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
              onChange("doorHeight", v);
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
              onChange("swing", side);
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
        {[
          { key: "h1", label: "Hinge 1 — Top", required: true },
          { key: "h2", label: "Hinge 2 — Middle", required: false },
          { key: "h3", label: "Hinge 3 — Bottom", required: true },
        ].map((h) => (
          <div key={h.key}>
            <label className="block text-slate-200 text-sm font-medium">
              {h.label}{" "}
              {h.required ? (
                <span className="text-red-400">*</span>
              ) : (
                <span className="text-slate-500 font-normal">(optional)</span>
              )}
            </label>
            <InchInput
              id={h.key}
              value={door[h.key]}
              onChange={(v) => {
                onChange(h.key, v);
                touch(h.key);
              }}
              error={err(h.key)}
            />
            <FieldError msg={err(h.key)} />
          </div>
        ))}
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
              onChange("knob", v);
              touch("knob");
            }}
            error={err("knob")}
          />
          <FieldError msg={err("knob")} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Deadbolt Centerline (from bottom){" "}
            <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <InchInput
            id="deadbolt"
            value={door.deadbolt}
            onChange={(v) => {
              onChange("deadbolt", v);
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
                onChange("backset", e.target.value);
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
        onChange={(e) => onChange("notes", e.target.value)}
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
        className={`w-full p-3 rounded font-bold transition-colors ${
          isValid
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-slate-700 hover:bg-slate-600 text-white"
        }`}
      >
        Save for Production
      </button>
    </div>
  );
}
