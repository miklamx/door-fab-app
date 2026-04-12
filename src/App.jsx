import { useState } from "react";
import useDoors from "./hooks/useDoors";
import DoorCard from "./components/DoorCard";
import DoorForm from "./components/DoorForm";
import DoorDiagram from "./components/DoorDiagram";
import PrintView from "./components/PrintView";
import { fmtInches } from "./utils/validation";

// ── Order Summary (read-only view for Production doors) ───────────────────────

function OrderSummary({ door, onEdit }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
      <div className="flex-1 p-4 border border-green-700 rounded bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-green-400 font-bold">Order Summary</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded transition-colors"
            >
              🖨 Print / PDF
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition-colors"
            >
              ✏ Edit Order
            </button>
          </div>
        </div>
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
          {door.h2 !== "" && door.h2 !== null && (
            <>
              <dt className="text-slate-400">Hinge 2</dt>
              <dd className="text-slate-100">{fmtInches(door.h2)}</dd>
            </>
          )}
          <dt className="text-slate-400">Hinge 3</dt>
          <dd className="text-slate-100">{fmtInches(door.h3)}</dd>
          <dt className="text-slate-400">Knob CL</dt>
          <dd className="text-slate-100">{fmtInches(door.knob)}</dd>
          {door.deadbolt !== "" && door.deadbolt !== null && (
            <>
              <dt className="text-slate-400">Deadbolt CL</dt>
              <dd className="text-slate-100">{fmtInches(door.deadbolt)}</dd>
            </>
          )}
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

      {/* Diagram alongside summary */}
      <div className="lg:w-56 flex-shrink-0">
        <DoorDiagram door={door} />
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const {
    doors,
    activeDoorId,
    activeDoor,
    addDoor,
    removeDoor,
    updateDoor,
    setActiveDoor,
    setDoorStatus,
    applyPreset,
  } = useDoors();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!activeDoor) return null;

  function handleDelete(id) {
    if (window.confirm("Delete this door? This cannot be undone.")) {
      removeDoor(id);
    }
  }

  const isProduction = activeDoor.status === "Production";

  return (
    <>
      {/* ── Screen layout ── */}
      <div className="no-print min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">

        {/* Mobile top bar */}
        <div className="md:hidden bg-slate-800 p-3 flex items-center justify-between border-b border-slate-700">
          <h1 className="text-lg font-bold truncate">Door Boring Order</h1>
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex-shrink-0 ml-2 text-slate-300 px-3 py-1.5 rounded bg-slate-700 text-sm"
          >
            {sidebarOpen ? "✕ Close" : `☰ Doors (${doors.length})`}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700 flex-shrink-0`}
        >
          <div className="p-4">
            <h1 className="hidden md:block text-xl font-bold text-slate-100 mb-4">
              Door Boring Order
            </h1>
            <div className="space-y-2">
              {doors.map((door) => (
                <DoorCard
                  key={door.id}
                  door={door}
                  isActive={door.id === activeDoorId}
                  onSelect={() => {
                    setActiveDoor(door.id);
                    setSidebarOpen(false);
                  }}
                  onDelete={() => handleDelete(door.id)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addDoor}
              className="mt-3 w-full p-2 border border-dashed border-slate-600 rounded text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors text-sm"
            >
              + Add Door
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:overflow-auto">
          {/* Status badge */}
          <p className="text-xs text-slate-400 mb-3">
            Status:{" "}
            <span
              className={`font-semibold ${
                isProduction ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {activeDoor.status}
            </span>
          </p>

          {isProduction ? (
            <OrderSummary
              door={activeDoor}
              onEdit={() => setDoorStatus(activeDoorId, "Presale")}
            />
          ) : (
            <div className="flex flex-col xl:flex-row gap-6 xl:items-start">
              {/* Form — key forces remount when door switches or preset applied */}
              <div className="flex-1 max-w-lg">
                <DoorForm
                  key={`${activeDoorId}-${activeDoor.formVersion ?? 0}`}
                  door={activeDoor}
                  onChange={(field, value) =>
                    updateDoor(activeDoorId, { [field]: value })
                  }
                  onSave={() => setDoorStatus(activeDoorId, "Production")}
                  onApplyPreset={(fields) => applyPreset(activeDoorId, fields)}
                />
              </div>

              {/* Live diagram */}
              <div className="xl:w-56 flex-shrink-0 xl:sticky xl:top-4">
                <DoorDiagram door={activeDoor} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Print view (hidden on screen, shown when printing) ── */}
      <PrintView doors={doors} />
    </>
  );
}
