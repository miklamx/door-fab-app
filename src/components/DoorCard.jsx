export default function DoorCard({ door, isActive, onSelect, onDelete }) {
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
            {door.name || door.jobName || "Unnamed Door"}
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
