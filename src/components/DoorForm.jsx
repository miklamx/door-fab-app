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
      // Quote vs Order + job info
      "docType",
      "property",
      "unit",
      "poNumber",

      // door details
      "doorWidth",
      "doorHeight",
      "thickness",
      "coreType",
      "swing",
      "h1",
      "h3",
      "knob",
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

  const isOrder = (door.docType || "Quote") === "Order";

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

      {/* ── Quote / Order selector ── */}
      <div className="mb-4">
        <label className="block text-slate-200 text-sm font-medium">
          Quote or Order <span className="text-red-400">*</span>
          <select
            value={door.docType || "Quote"}
            onChange={(e) => {
              onChange("docType", e.target.value);
              touch("docType");
            }}
            className={`w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
              err("docType") ? "border-red-500" : "border-slate-600"
            }`}
          >
            <option value="Quote">Quote</option>
            <option value="Order">Order</option>
          </select>
          <FieldError msg={err("docType")} />
        </label>

        <p className="text-xs text-slate-400 mt-1">
          PO Number and Unit are required for Orders, optional for Quotes.
        </p>
      </div>

      {/* ── Job Info ── */}
      <SectionHeader>Job Info</SectionHeader>

      <label className="block text-slate-200 text-sm font-medium mb-3">
        Door Name <span className="text-slate-500 font-normal">(optional)</span>
        <input
          type="text"
          value={door.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g. Front Entry, Unit 4B"
          className={inputClass("name")}
        />
      </label>

      <label className="block text-slate-200 text-sm font-medium">
        Property <span className="text-red-400">*</span>
        <input
          type="text"
          value={door.property}
          onChange={(e) => onChange("property", e.target.value)}
          onBlur={() => touch("property")}
          placeholder="e.g. Sunset Apartments"
          className={inputClass("property")}
        />
        <FieldError msg={err("property")} />
      </label>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Unit{" "}
            {isOrder ? (
              <span className="text-red-400">*</span>
            ) : (
              <span className="text-slate-500 font-normal">(optional)</span>
            )}
            <input
              type="text"
              value={door.unit}
              onChange={(e) => onChange("unit", e.target.value)}
              onBlur={() => touch("unit")}
              placeholder="e.g. 4B"
              className={inputClass("unit")}
            />
            <FieldError msg={err("unit")} />
          </label>
        </div>

        <div>
          <label className="block text-slate-200 text-sm font-medium">
            PO Number{" "}
            {isOrder ? (
              <span className="text-red-400">*</span>
            ) : (
              <span className="text-slate-500 font-normal">(optional)</span>
            )}
            <input
              type="text"
              value={door.poNumber}
              onChange={(e) => onChange("poNumber", e.target.value)}
              onBlur={() => touch("poNumber")}
              placeholder="e.g. PO-12345"
              className={inputClass("poNumber")}
            />
            <FieldError msg={err("poNumber")} />
          </label>
        </div>
      </div>

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

      {/* ── Door Spec ── */}
      <SectionHeader>Door Spec</SectionHeader>
      <div className="space-y-4">
        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Thickness <span className="text-red-400">*</span>
            <select
              value={door.thickness}
              onChange={(e) => {
                onChange("thickness", e.target.value);
                touch("thickness");
              }}
              className={`w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
                err("thickness") ? "border-red-500" : "border-slate-600"
              }`}
            >
              <option value="1-3/8-in">1-3/8 in</option>
              <option value="1-3/4-in">1-3/4 in</option>
            </select>
            <FieldError msg={err("thickness")} />
          </label>
        </div>

        <div>
          <label className="block text-slate-200 text-sm font-medium">
            Core Type <span className="text-red-400">*</span>
            <select
              value={door.coreType}
              onChange={(e) => {
                onChange("coreType", e.target.value);
                touch("coreType");
              }}
              className={`w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
                err("coreType") ? "border-red-500" : "border-slate-600"
              }`}
            >
              <option value="hollow">Hollow core</option>
              <option value="solid">Solid core</option>
            </select>
            <FieldError msg={err("coreType")} />
          </label>
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
