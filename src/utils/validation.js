// ...keep fmtInches as-is...

export function validate(door) {
  const errors = {};
  const maxH =
    door.doorHeight !== "" && door.doorHeight !== null
      ? parseFloat(door.doorHeight)
      : null;

  const docType = door.docType || "Quote";

  if (!door.property || !door.property.trim()) errors.property = "Property is required.";

  if (docType === "Order") {
    if (!door.unit || !door.unit.trim()) errors.unit = "Unit is required for Orders.";
    if (!door.poNumber || !door.poNumber.trim())
      errors.poNumber = "PO number is required for Orders.";
  }

  // NEW: hinge specs required for both Quote + Order
  if (!door.hingeSize) errors.hingeSize = "Hinge size is required.";
  if (!door.hingeRadius) errors.hingeRadius = "Hinge radius is required.";

  // ...rest of existing validation unchanged...
  // (doorWidth/doorHeight/thickness/coreType/swing/h1/h2/h3/knob/deadbolt)
  return errors;
}
