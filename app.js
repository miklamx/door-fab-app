const { useState } = React;

function DoorApp() {
  const [status, setStatus] = useState('Presale');
  const [formData, setFormData] = useState({
    customerName: '', accountNum: '', phone: '',
    docType: 'Quote',
    poNum: '',
    finishedHeight: '', finishedWidth: '', 
    doorType: 'Interior', core: 'Solid', thickness: '1-3/8-in',
    hingeDim: '3-1/2-in', hingeRadius: '1/4-in',
    swing: '', facing: 'Standard',
    hinge1: '', hinge2: '', hinge3: '',
    peepHole: '', deadbolt: '', entryKnob: '',
    backset: '2-3/8-in',
    productNum: '', quantity: '', notes: ''
  });

  const update = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white min-h-screen shadow-xl border-t-8 border-blue-900 font-sans">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-900">Lockset and Hinge Boring Order</h1>
        <p className="text-sm text-gray-600">Status: <span className="font-bold text-orange-600 uppercase">{status}</span></p>
      </header>

      <section className="mb-8 bg-gray-50 p-4 rounded">
        <h2 className="font-bold border-b text-gray-700 mb-4">CUSTOMER INFORMATION</h2>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => update('docType', 'Quote')} 
            className={`flex-1 p-2 rounded font-bold ${formData.docType === 'Quote' ? 'bg-blue-800 text-white' : 'bg-white border'}`}
          >
            Quote
          </button>
          <button 
            onClick={() => update('docType', 'Order')} 
            className={`flex-1 p-2 rounded font-bold ${formData.docType === 'Order' ? 'bg-blue-800 text-white' : 'bg-white border'}`}
          >
            Order
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Customer Name" className="border p-2 rounded" value={formData.customerName} onChange={e => update('customerName', e.target.value)} />
          <input placeholder="Account #" className="border p-2 rounded" value={formData.accountNum} onChange={e => update('accountNum', e.target.value)} />
          <input placeholder="Phone" className="border p-2 rounded col-span-2" value={formData.phone} onChange={e => update('phone', e.target.value)} />
          
          {formData.docType === 'Order' && (
            <input placeholder="PO #" className="border p-2 rounded col-span-2" value={formData.poNum} onChange={e => update('poNum', e.target.value)} />
          )}
        </div>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="font-bold border-b text-gray-700">DOOR SPECIFICATIONS</h2>
        <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium">Finished Height
                <input type="text" className="w-full border p-2 mt-1" value={formData.finishedHeight} onChange={e => update('finishedHeight', e.target.value)} />
            </label>
            <label className="block text-sm font-medium">Finished Width
                <input type="text" className="w-full border p-2 mt-1" value={formData.finishedWidth} onChange={e => update('finishedWidth', e.target.value)} />
            </label>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 border rounded">
                <p className="font-bold mb-1">Thickness</p>
                <label className="block"><input type="radio" name="thick" onClick={() => update('thickness', '1-3/8-in')} checked={formData.thickness==='1-3/8-in'}/> 1-3/8"</label>
                <label className="block"><input type="radio" name="thick" onClick={() => update('thickness', '1-3/4-in')} /> 1-3/4"</label>
            </div>
            <div className="p-2 border rounded">
                <p className="font-bold mb-1">Core</p>
                <label className="block"><input type="radio" name="core" onClick={() => update('core', 'Solid')} checked={formData.core==='Solid'} /> Solid</label>
                <label className="block"><input type="radio" name="core" onClick={() => update('core', 'Hollow')} /> Hollow</label>
            </div>
            <div className="p-2 border rounded">
                <p className="font-bold mb-1">Hinge Radius</p>
                <label className="block"><input type="radio" name="rad" onClick={() => update('hingeRadius', '1/4-in')} checked={formData.hingeRadius==='1/4-in'} /> 1/4"</label>
                <label className="block"><input type="radio" name="rad" onClick={() => update('hingeRadius', '5/8-in')} /> 5/8"</label>
            </div>
        </div>
      </section>

      <section className="mb-8 bg-blue-50 p-4 rounded border border-blue-200">
        <h2 className="font-bold text-blue-900 mb-2">MEASUREMENT PLOTS (FROM TOP)</h2>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <input placeholder="Top of 1st Hinge" className="w-full border p-2" value={formData.hinge1} onChange={e => update('hinge1', e.target.value)} />
                <input placeholder="Top of 2nd Hinge" className="w-full border p-2" value={formData.hinge2} onChange={e => update('hinge2', e.target.value)} />
                <input placeholder="Top of 3rd Hinge" className="w-full border p-2" value={formData.hinge3} onChange={e => update('hinge3', e.target.value)} />
            </div>
            <div className="space-y-2">
                <input placeholder="Deadbolt Centerline" className="w-full border p-2" value={formData.deadbolt} onChange={e => update('deadbolt', e.target.value)} />
                <input placeholder="Entry Knob Centerline" className="w-full border p-2" value={formData.entryKnob} onChange={e => update('entryKnob', e.target.value)} />
                <select className="w-full border p-2 bg-white" value={formData.backset} onChange={e => update('backset', e.target.value)}>
                    <option value="2-3/8-in">Backset: 2-3/8"</option>
                    <option value="2-3/4-in">Backset: 2-3/4"</option>
                </select>
            </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-bold mb-2">DOOR SWING (Back to Hinges)</h2>
        <div className="flex gap-2">
            <button onClick={() => update('swing', 'Left')} className={`flex-1 p-3 border rounded ${formData.swing==='Left' ? 'bg-blue-800 text-white' : 'bg-white'}`}>Left Hand</button>
            <button onClick={() => update('swing', 'Right')} className={`flex-1 p-3 border rounded ${formData.swing==='Right' ? 'bg-blue-800 text-white' : 'bg-white'}`}>Right Hand</button>
        </div>
      </section>

      <textarea placeholder="Notes / Fabrication Details" className="w-full border p-2 rounded h-20 mb-4" value={formData.notes} onChange={e => update('notes', e.target.value)}></textarea>

      <button className="w-full bg-green-700 text-white p-4 rounded-lg font-bold text-lg shadow-lg" onClick={() => setStatus('Production')}>
        SUBMIT TO PRODUCTION
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DoorApp />);
