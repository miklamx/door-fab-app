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
    name: "",
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
  };
}

// Ensure any door loaded from storage has all required fields
function normalizeDoor(d) {
  return { formVersion: 0, name: "", ...d };
}

function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.doors) &&
        parsed.doors.length > 0
      ) {
        const doors = parsed.doors.map(normalizeDoor);
        const activeDoorId =
          doors.find((d) => d.id === parsed.activeDoorId)
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
      doors: prev.doors.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
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
