import { useState } from "react";

const FRACTIONS = [
  { label: '0"', value: 0 },
  { label: "1/16\"", value: 1 / 16 },
  { label: "1/8\"", value: 2 / 16 },
  { label: "3/16\"", value: 3 / 16 },
  { label: "1/4\"", value: 4 / 16 },
  { label: "5/16\"", value: 5 / 16 },
  { label: "3/8\"", value: 6 / 16 },
  { label: "7/16\"", value: 7 / 16 },
  { label: "1/2\"", value: 8 / 16 },
  { label: "9/16\"", value: 9 / 16 },
  { label: "5/8\"", value: 10 / 16 },
  { label: "11/16\"", value: 11 / 16 },
  { label: "3/4\"", value: 12 / 16 },
  { label: "13/16\"", value: 13 / 16 },
  { label: "7/8\"", value: 14 / 16 },
  { label: "15/16\"", value: 15 / 16 },
];

function parseInitial(value) {
  if (value === "" || value === null || value === undefined) {
    return { whole: "", frac: 0 };
  }
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return { whole: "", frac: 0 };
  const whole = Math.floor(num);
  const frac = Math.round((num - whole) * 16) / 16;
  return { whole: String(whole), frac };
}

export default function InchInput({ value, onChange, error, id }) {
  const init = parseInitial(value);
  const [whole, setWhole] = useState(init.whole);
  const [frac, setFrac] = useState(init.frac);

  function emit(newWhole, newFrac) {
    const w = newWhole === "" ? null : parseInt(newWhole, 10);
    if (w === null || isNaN(w) || w < 0) {
      onChange("");
    } else {
      onChange(w + newFrac);
    }
  }

  function handleWholeChange(e) {
    const val = e.target.value;
    setWhole(val);
    emit(val, frac);
  }

  function handleFracChange(e) {
    const val = parseFloat(e.target.value);
    setFrac(val);
    emit(whole, val);
  }

  const inputClass = `w-20 border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-slate-600"
  }`;
  const selectClass = `border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-slate-600"
  }`;

  return (
    <div className="flex gap-2 items-center mt-1">
      <input
        id={id}
        type="number"
        min="0"
        step="1"
        value={whole}
        onChange={handleWholeChange}
        placeholder="0"
        className={inputClass}
      />
      <select value={frac} onChange={handleFracChange} className={selectClass}>
        {FRACTIONS.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
