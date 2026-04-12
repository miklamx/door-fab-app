import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Presale");
  const [door, setDoor] = useState({
    swing: "",
    h1: "",
    h2: "",
    h3: "",
    knob: "",
    deadbolt: "",
    backset: "2-3/8-in",
  });

  return (
    <div className="p-4 max-w-md mx-auto bg-slate-900 text-slate-100 min-h-screen shadow">
      <h1 className="text-xl font-bold mb-4 text-slate-100">
        Door Boring Order
      </h1>

      <div className="mb-6 p-3 border border-slate-700 rounded bg-slate-800">
        <p className="text-sm font-bold mb-2 text-slate-100">
          Back to hinges: Which side is the door on?
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDoor({ ...door, swing: "Left" })}
            className={`p-2 border border-slate-700 flex-1 rounded ${
              door.swing === "Left"
                ? "bg-slate-700 text-white"
                : "bg-slate-900 text-slate-200"
            }`}
          >
            Left Hand
          </button>

          <button
            type="button"
            onClick={() => setDoor({ ...door, swing: "Right" })}
            className={`p-2 border border-slate-700 flex-1 rounded ${
              door.swing === "Right"
                ? "bg-slate-700 text-white"
                : "bg-slate-900 text-slate-200"
            }`}
          >
            Right Hand
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-slate-200">
          Top of 1st Hinge (Inches)
          <input
            type="number"
            className="w-full border border-slate-700 bg-slate-800 text-slate-100 p-2 rounded mt-1"
            onChange={(e) => setDoor({ ...door, h1: e.target.value })}
          />
        </label>

        <label className="block text-slate-200">
          Entry Knob Centerline
          <input
            type="number"
            className="w-full border border-slate-700 bg-slate-800 text-slate-100 p-2 rounded mt-1"
            onChange={(e) => setDoor({ ...door, knob: e.target.value })}
          />
        </label>

        <label className="block text-slate-200">
          Deadbolt Centerline
          <input
            type="number"
            className="w-full border border-slate-700 bg-slate-800 text-slate-100 p-2 rounded mt-1"
            onChange={(e) => setDoor({ ...door, deadbolt: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setStatus("Production")}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white p-3 rounded font-bold"
        >
          Save for Production
        </button>

        <p className="mt-2 text-sm text-slate-300">
          Status: <span className="font-semibold text-slate-100">{status}</span>
        </p>
      </div>
    </div>
  );
}
