// ── Helpers ──────────────────────────────────────────────────────────────────

export function fmtInches(val) {
  if (val === "" || val === null || val === undefined) return "—";
  const num = parseFloat(val);
  if (isNaN(num)) return "—";
  const whole = Math.floor(num);
  const sixteenths = Math.round((num - whole) * 16);
  if (sixteenths === 0) return `${whole}"`;
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(sixteenths, 16);
  return `${whole} ${sixteenths / d}/${16 / d}"`;
}

// ── Validation ────────────────────────────────────────────────────────────────

export function validate(door) {
  const errors = {};
  const maxH =
    door.doorHeight !== "" && door.doorHeight !== null
      ? parseFloat(door.doorHeight)
      : null;

  const docType = door.docType || "Quote";

  // Job info (new)
  if (!door.property || !door.property.trim()) {
    errors.property = "Property is required.";
  }

  // Unit + PO required for Orders only
  if (docType === "Order") {
    if (!door.unit || !door.unit.trim()) {
      errors.unit = "Unit is required for Orders.";
    }
    if (!door.poNumber || !door.poNumber.trim()) {
      errors.poNumber = "PO number is required for Orders.";
    }
  }

  // Door dimensions
  const dw = door.doorWidth === "" ? NaN : parseFloat(door.doorWidth);
  if (isNaN(dw)) {
    errors.doorWidth = "Door width is required.";
  } else if (dw <= 0 || dw >= 60) {
    errors.doorWidth = "Width must be greater than 0 and less than 60 inches.";
  }

  const dh = door.doorHeight === "" ? NaN : parseFloat(door.doorHeight);
  if (isNaN(dh)) {
    errors.doorHeight = "Door height is required.";
  } else if (dh <= 0 || dh >= 120) {
    errors.doorHeight =
      "Height must be greater than 0 and less than 120 inches.";
  }

  // Door spec
  if (!door.thickness) {
    errors.thickness = "Thickness is required.";
  }

  if (!door.coreType) {
    errors.coreType = "Core type is required.";
  }

  // Swing
  if (!door.swing) {
    errors.swing = "Swing direction is required.";
  }

  // Hinges
  const h1 = door.h1 === "" ? NaN : parseFloat(door.h1);
  if (isNaN(h1)) {
    errors.h1 = "Hinge 1 location is required.";
  } else if (h1 <= 0) {
    errors.h1 = "Hinge 1 must be greater than 0.";
  } else if (maxH !== null && h1 >= maxH) {
    errors.h1 = `Hinge 1 must be less than door height (${fmtInches(maxH)}).`;
  }

  if (door.h2 !== "" && door.h2 !== null) {
    const h2 = parseFloat(door.h2);
    if (isNaN(h2) || h2 <= 0) {
      errors.h2 = "Hinge 2 must be greater than 0.";
    } else if (maxH !== null && h2 >= maxH) {
      errors.h2 = `Hinge 2 must be less than door height (${fmtInches(maxH)}).`;
    }
  }

  const h3 = door.h3 === "" ? NaN : parseFloat(door.h3);
  if (isNaN(h3)) {
    errors.h3 = "Hinge 3 location is required.";
  } else if (h3 <= 0) {
    errors.h3 = "Hinge 3 must be greater than 0.";
  } else if (maxH !== null && h3 >= maxH) {
    errors.h3 = `Hinge 3 must be less than door height (${fmtInches(maxH)}).`;
  }

  // Hardware
  const knob = door.knob === "" ? NaN : parseFloat(door.knob);
  if (isNaN(knob)) {
    errors.knob = "Entry knob centerline is required.";
  } else if (knob <= 0) {
    errors.knob = "Knob centerline must be greater than 0.";
  } else if (maxH !== null && knob >= maxH) {
    errors.knob = `Knob must be less than door height (${fmtInches(maxH)}).`;
  }

  // Deadbolt is optional — only validate if a value is provided
  if (door.deadbolt !== "" && door.deadbolt !== null) {
    const db = parseFloat(door.deadbolt);
    if (isNaN(db) || db <= 0) {
      errors.deadbolt = "Deadbolt centerline must be greater than 0.";
    } else if (maxH !== null && db >= maxH) {
      errors.deadbolt = `Deadbolt must be less than door height (${fmtInches(maxH)}).`;
    }
  }

  return errors;
}
