import { useState, useEffect } from "react";

const STORAGE_KEY = "door-fab-state";

function uuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for environments where crypto.randomUUID is unavailable
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function blankDoor() {
  return {
    id: uuid(),
    status: "Presale",
    formVersion: 0,

    // Quote vs Order
    docType: "Quote", // default per requirement

    // Job info (new fields)
    property: "",
    unit: "",
    poNumber: "",

    // Existing fields
    name: "",
    swing: "",
    doorWidth: "",
    doorHeight: "",
    thickness: "1-3/8-in",
    coreType: "hollow",

    // NEW: hinge specs (required)
    hingeSize: "3-1/2-in",
    hingeRadius: "1/4-in",

    h1: "",
    h2: "",
    h3: "",
    knob: "",
    deadbolt: "",
    notes: "",
  };
}

function migrateLegacyDoorFields(d) {
  // Migrate old "backset" -> new "thickness" (best-effort defaulting)
  let thickness = d.thickness;
  if (!thickness) {
    // heuristic: doors that used 2-3/4 backset were often exteriors
    if (d.backset === "2-3/4-in") thickness = "1-3/4-in";
    else thickness = "1-3/8-in";
  }

  const coreType = d.coreType || "hollow";

  // New: docType + job fields
  const docType = d.docType || "Quote";
  const property = d.property || d.jobName || ""; // migrate old jobName -> property
  const unit = d.unit || "";
  const poNumber = d.poNumber || "";

  // NEW: hinge specs
  const hingeSize = d.hingeSize || "3-1/2-in";
  const hingeRadius = d.hingeRadius || "1/4-in";

  // Remove deprecated "backset" and "jobName"
  // eslint-disable-next-line no-unused-vars
  const { backset, jobName, ...rest } = d;

  return {
    ...rest,
    thickness,
    coreType,
    docType,
    property,
    unit,
    poNumber,
    hingeSize,
    hingeRadius,
  };
}

// Ensure any door loaded from storage has all required fields
function normalizeDoor(d) {
  const migrated = migrateLegacyDoorFields(d);
  return { formVersion: 0, name: "", ...migrated };
}

function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.doors) && parsed.doors.length > 0) {
        const doors = parsed.doors.map(normalizeDoor);
        const activeDoorId = doors.find((d) => d.id === parsed.activeDoorId)
          ? parsed.activeDoorId
          : doors[0].id;
        return { doors, activeDoorId };
      }
    }
  } catch {
    // ignore malformed storage
  }
  const door = blankDoor();
  return { doors: [door], activeDoorId: door.id };
}

export default function useDoors() {
  const [state, setState] = useState(getInitialState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  const { doors, activeDoorId } = state;
  const activeDoor = doors.find((d) => d.id === activeDoorId) ?? doors[0];

  function addDoor() {
    const door = blankDoor();
    setState((prev) => ({
      doors: [...prev.doors, door],
      activeDoorId: door.id,
    }));
  }

  function removeDoor(id) {
    setState((prev) => {
      const newDoors = prev.doors.filter((d) => d.id !== id);
      if (newDoors.length === 0) {
        const door = blankDoor();
        return { doors: [door], activeDoorId: door.id };
      }
      let newActiveId = prev.activeDoorId;
      if (prev.activeDoorId === id) {
        const idx = prev.doors.findIndex((d) => d.id === id);
        newActiveId = newDoors[Math.max(0, idx - 1)].id;
      }
      return { doors: newDoors, activeDoorId: newActiveId };
    });
  }

  function updateDoor(id, updates) {
    setState((prev) => ({
      ...prev,
      doors: prev.doors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  }

  function setActiveDoor(id) {
    setState((prev) => ({ ...prev, activeDoorId: id }));
  }

  function setDoorStatus(id, status) {
    updateDoor(id, { status });
  }

  function applyPreset(id, fields) {
    setState((prev) => ({
      ...prev,
      doors: prev.doors.map((d) =>
        d.id === id
          ? { ...d, ...fields, formVersion: (d.formVersion || 0) + 1 }
          : d
      ),
    }));
  }

  return {
    doors,
    activeDoorId,
    activeDoor,
    addDoor,
    removeDoor,
    updateDoor,
    setActiveDoor,
    setDoorStatus,
    applyPreset,
  };
}
