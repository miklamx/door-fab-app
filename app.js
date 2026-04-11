const { useState } = React;

function DoorApp() {
  const [status, setStatus] = useState('Presale'); // Tracking from Presale to Fulfillment
  const [door, setDoor] = useState({
    swing: '',
    h1: '', h2: '', h3: '',
    knob: '', deadbolt: '',
    backset: '2-3/8-in' // [cite: 50]
  });

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen shadow">
      <h1 className="text-xl font-bold mb-4">Door Boring Order</h1>
      
      {/* Handing Logic [cite: 84-87] */}
      <div className="mb-6 p-3 border rounded bg-yellow-50">
        <p className="text-sm font-bold mb-2">Back to hinges: Which side is the door on?</p>
        <div className="flex gap-2">
          <button onClick={() => setDoor({...door, swing: 'Left'})} 
            className={`p-2 border flex-1 ${door.swing === 'Left' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Left Hand</button>
          <button onClick={() => setDoor({...door, swing: 'Right'})} 
            className={`p-2 border flex-1 ${door.swing === 'Right' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Right Hand</button>
        </div>
      </div>

      {/* Measurement Plots [cite: 35-45] */}
      <div className="space-y-4">
        <label className="block">Top of 1st Hinge (Inches)
          <input type="number" className="w-full border p-2" onChange={(e) => setDoor({...door, h1: e.target.value})} />
        </label>
        <label className="block">Entry Knob Centerline
          <input type="number" className="w-bottom border p-2" onChange={(e) => setDoor({...door, knob: e.target.value})} />
        </label>
        <label className="block">Deadbolt Centerline [cite: 39]
          <input type="number" className="w-full border p-2" onChange={(e) => setDoor({...door, deadbolt: e.target.value})} />
        </label>
      </div>

      <div className="mt-8">
        <button className="w-full bg-green-600 text-white p-3 rounded font-bold">Save for Production</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DoorApp />);
