import { fmtInches } from "../utils/validation";
import DoorDiagram from "./DoorDiagram";

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

function fmtHingeSize(val) {
  if (!val) return "—";
  if (val === "3-1/2-in") return '3 1/2"';
  if (val === "4-in") return '4"';
  return val;
}

function fmtHingeRadius(val) {
  if (!val) return "—";
  if (val === "1/4-in") return '1/4"';
  if (val === "5/8-in") return '5/8"';
  return val;
}

function PrintPage({ door, printDate }) {
  const docType = door.docType || "Quote";
  const isOrder = docType === "Order";

  return (
    <div className="print-page">
      {/* Header */}
      <div className="print-header">
        <div>
          <h1 className="print-title">Door Boring Order — Shop Ticket</h1>
          {door.name && <p className="print-job">{door.name}</p>}
          <p className="print-job">
            {docType}: {door.property}
            {door.unit ? ` — Unit ${door.unit}` : ""}
          </p>
          {isOrder && (
            <p className="print-job">
              <strong>PO:</strong> {door.poNumber}
            </p>
          )}
        </div>
        <p className="print-date">Printed: {printDate}</p>
      </div>

      <div className="print-body">
        {/* Data tables */}
        <div className="print-tables">
          {/* Dimensions */}
          <table className="print-table">
            <thead>
              <tr>
                <th colSpan="2">Door Dimensions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Width</td>
                <td>{fmtInches(door.doorWidth)}</td>
              </tr>
              <tr>
                <td>Height</td>
                <td>{fmtInches(door.doorHeight)}</td>
              </tr>
              <tr>
                <td>Thickness</td>
                <td>{fmtThickness(door.thickness)}</td>
              </tr>
              <tr>
                <td>Core Type</td>
                <td>{fmtCoreType(door.coreType)}</td>
              </tr>
              <tr>
                <td>Swing</td>
                <td>{door.swing} Hand</td>
              </tr>
            </tbody>
          </table>

          {/* Hinges */}
          <table className="print-table">
            <thead>
              <tr>
                <th>Hinge</th>
                <th>From Top</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hinge Size</td>
                <td>{fmtHingeSize(door.hingeSize)}</td>
              </tr>
              <tr>
                <td>Hinge Radius</td>
                <td>{fmtHingeRadius(door.hingeRadius)}</td>
              </tr>
              <tr>
                <td>Hinge 1 (Top)</td>
                <td>{fmtInches(door.h1)}</td>
              </tr>
              {door.h2 !== "" && door.h2 !== null && (
                <tr>
                  <td>Hinge 2 (Mid)</td>
                  <td>{fmtInches(door.h2)}</td>
                </tr>
              )}
              <tr>
                <td>Hinge 3 (Bot)</td>
                <td>{fmtInches(door.h3)}</td>
              </tr>
            </tbody>
          </table>

          {/* Hardware */}
          <table className="print-table">
            <thead>
              <tr>
                <th>Hardware</th>
                <th>From Bottom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Entry Knob CL</td>
                <td>{fmtInches(door.knob)}</td>
              </tr>
              {door.deadbolt !== "" && door.deadbolt !== null && (
                <tr>
                  <td>Deadbolt CL</td>
                  <td>{fmtInches(door.deadbolt)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Notes */}
          {door.notes && (
            <div className="print-notes">
              <strong>Notes:</strong>
              <p>{door.notes}</p>
            </div>
          )}
        </div>

        {/* Diagram */}
        <div className="print-diagram">
          <DoorDiagram door={door} printMode />
        </div>
      </div>
    </div>
  );
}

export default function PrintView({ doors }) {
  const printDate = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Print all doors (Production doors first, then Presale)
  const sorted = [
    ...doors.filter((d) => d.status === "Production"),
    ...doors.filter((d) => d.status !== "Production"),
  ];

  return (
    <div id="print-view" className="print-only">
      {sorted.map((door) => (
        <PrintPage key={door.id} door={door} printDate={printDate} />
      ))}
    </div>
  );
}
