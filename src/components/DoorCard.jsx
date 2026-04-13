function fmtThickness(val) {
  if (!val) return "—";
  if (val === "1-3/8-in") return '1 3/8"';
  if (val === "1-3/4-in") return '1 3/4"';
  return val;
}

function fmtCoreType(val) {
  if (!val) return "—";
  if (val === "hollow") return "Hollow core";
  if (val === "solid") return "Solid core";
  return val;
}

export default function DoorCard({ door, isActive, onSelect, onDelete }) {
  const docType = door.docType || "Quote";
  const isOrder = docType === "Order";

  const title = door.name || door.property || "Unnamed Door";

  const metaParts = [docType];
  if (door.unit) metaParts.push(`Unit ${door.unit}`);
  if (isOrder && door.poNumber) metaParts.push(`PO ${door.poNumber}`);
  const meta = metaParts.join(" • ");

  const spec = `${fmtThickness(door.thickness)} • ${fmtCoreType(door.coreType)}`;

  const subtitle = `${meta} — ${spec}`;

  return (
    <div
      className={`p-3 rounded cursor-pointer border transition-colors ${
        isActive
          ? "bg-slate-700 border-blue-500"
          : "bg-slate-800 border-slate-700 hover:bg-slate-700"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-slate-100 text-sm truncate">
            {title}
          </div>

          <div className="text-xs text-slate-400 truncate mt-0.5">
            {subtitle}
          </div>

          <span
            className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded mt-1 ${
              door.status === "Production"
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300"
            }`}
          >
            {door.status}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors p-1"
          aria-label="Delete door"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
