// inside the component, near where `isOrder` is defined:
const hingeSelectClass = (field) =>
  `w-full border p-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 ${
    err(field) ? "border-red-500" : "border-slate-600"
  }`;

// ...inside render, right after <SectionHeader>Hinge Locations ...</SectionHeader>
<div className="grid grid-cols-2 gap-4 mb-4">
  <div>
    <label className="block text-slate-200 text-sm font-medium">
      Hinge Size <span className="text-red-400">*</span>
      <select
        value={door.hingeSize}
        onChange={(e) => {
          onChange("hingeSize", e.target.value);
          touch("hingeSize");
        }}
        className={hingeSelectClass("hingeSize")}
      >
        <option value="3-1/2-in">3 1/2 in</option>
        <option value="4-in">4 in</option>
      </select>
      <FieldError msg={err("hingeSize")} />
    </label>
  </div>

  <div>
    <label className="block text-slate-200 text-sm font-medium">
      Hinge Radius <span className="text-red-400">*</span>
      <select
        value={door.hingeRadius}
        onChange={(e) => {
          onChange("hingeRadius", e.target.value);
          touch("hingeRadius");
        }}
        className={hingeSelectClass("hingeRadius")}
      >
        <option value="1/4-in">1/4 in</option>
        <option value="5/8-in">5/8 in</option>
      </select>
      <FieldError msg={err("hingeRadius")} />
    </label>
  </div>
</div>
