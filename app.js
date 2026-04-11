const { useState } = React;

function DoorApp() {
  // Logic to track the business workflow from Presale to Fulfillment
  const [status, setStatus] = useState('Presale'); 
  const [door, setDoor] = useState({
    swing: '',
    h1: '', h2: '', h3: '',
    knob: '', deadbolt: '',
    backset: '2-3/8-in',
    photoNotes: '' 
  });

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen shadow-lg border-t-4 border-blue-600">
      <h1 className="text-2xl font-bold mb-1">Door Fabrication</h1>
      <p className="text-gray-500 text-sm mb-4">Order Status: <span className="font-bold text-blue-600">{status}</span></p>
      
      {/* Handing Logic [cite: 84-87] */}
      <div className="mb-6 p-3 border rounded bg-slate-50">
        <p className="text-sm font-bold mb-2 uppercase tracking-wide">1. Determine Handing</p>
        <div className="flex gap-2">
          <button onClick={() => setDoor({...door, swing: 'Left'})} 
            className={`p-3 border rounded flex-1 font-semibold ${door.swing === 'Left' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Left Hand</button>
          <button onClick={() => setDoor({...door, swing: 'Right'})} 
            className={`p-3 border rounded flex-1 font-semibold ${door.swing === 'Right' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Right Hand</button>
        </div>
      </div>

      {/* Measurement Plots [cite: 33-45] */}
      <div className="space-y-4 mb-6">
        <p className="text-sm font-bold uppercase tracking-wide">2. Measurement Plots (From Top)</p>
        <input type="number" placeholder="Top of 1st Hinge (in)" className="w-full border p-3 rounded" onChange={(e) => setDoor({...door, h1: e.target.value})} />
        <input type="number" placeholder="Entry Knob Centerline" className="w-full border p-3 rounded" onChange={(e) => setDoor({...door, knob: e.target.value})} />
        <input type="number" placeholder="Deadbolt Centerline" className="w-full border p-3 rounded" onChange={(e) => setDoor({...door, deadbolt: e.target.value})} />
      </div>

      {/* Photo & Documentation Section */}
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide">3. Documentation & Photos</p>
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded text-center bg-gray-50">
           <p className="text-xs text-gray-400">Camera Integration Placeholder</p>
           <button className="mt-2 bg-gray-200 px-4 py-2 rounded text-sm font-medium">Add Photo</button>
        </div>
        <textarea 
          placeholder="Notes on door condition or special instructions..." 
          className="w-full border mt-3 p-3 rounded h-24"
          onChange={(e) => setDoor({...door, photoNotes: e.target.value})}
        ></textarea>
      </div>

      {/* Status Toggle for Production */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setStatus('Production')} className="flex-1 bg-orange-500 text-white p-3 rounded font-bold shadow">Move to Production</button>
        <button onClick={() => setStatus('Fulfillment')} className="flex-1 bg-green-600 text-white p-3 rounded font-bold shadow">Mark Fulfilled</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DoorApp />);
