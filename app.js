const { useState } = React;

function DoorApp() {
  const [status, setStatus] = useState('Presale');
  const [showVideo, setShowVideo] = useState(true);
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
    productNum: '', quantity: '', notes: '', customerSignature: '', signatureDate: ''
  });

  const update = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Banner with Image */}
      <div className="w-full h-48 bg-cover bg-center" style={{
        backgroundImage: 'url(https://github.com/miklamx/door-fab-app/raw/main/images/Gemini_Generated_Image_ww7kefww7kefww7k.png)',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="bg-black bg-opacity-40 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Lockset & Hinge Boring</h1>
            <p className="text-lg opacity-90">Professional Door Fabrication Order Form</p>
          </div>
        </div>
      </div>

      {/* Video Intro Section - Shows/Hides based on showVideo state */}
      {showVideo && (
        <div className="w-full py-8 transition-all duration-300" style={{ background: '#555555' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">📹 Getting Started</h2>
                <p className="text-gray-200">Watch this quick guide to confidently measure and place your order</p>
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="text-white px-4 py-2 rounded-lg font-semibold transition-all"
                style={{ background: '#444444' }}
                onMouseEnter={e => e.currentTarget.style.background = '#555555'}
                onMouseLeave={e => e.currentTarget.style.background = '#444444'}
              >
                ✕ Close
              </button>
            </div>
            <video 
              width="100%" 
              height="auto" 
              autoPlay 
              muted 
              loop
              className="rounded-lg shadow-xl border-4 border-[#555555]"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            >
              <source src="https://github.com/miklamx/door-fab-app/raw/main/images/Pip_Boy_s_Motivational_Door_Measurement.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-center text-gray-200 mt-4 text-sm">💡 Tip: Follow the measurements shown in the video for best results</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="p-6 max-w-4xl mx-auto">
        
        {/* Status Bar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-[#555555]">
          <p className="text-sm text-gray-600">Current Status: <span className="font-bold text-lg text-[#555555] uppercase">{status}</span></p>
        </div>

        <form className="space-y-6">
          
          {/* 1. Customer Information */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#555555] border-b-2 border-[#555555] pb-2">CUSTOMER INFORMATION</h2>
            
            {/* Quote/Order Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                type="button"
                onClick={() => update('docType', 'Quote')} 
                className={`p-3 rounded-lg font-bold transition-all ${formData.docType === 'Quote' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                style={formData.docType === 'Quote' ? { background: '#555555' } : {}}
              >
                Quote
              </button>
              <button 
                type="button"
                onClick={() => update('docType', 'Order')} 
                className={`p-3 rounded-lg font-bold transition-all ${formData.docType === 'Order' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                style={formData.docType === 'Order' ? { background: '#555555' } : {}}
              >
                Order
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Customer Name" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.customerName} onChange={e => update('customerName', e.target.value)} />
              <input placeholder="Account #" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.accountNum} onChange={e => update('accountNum', e.target.value)} />
              <input placeholder="Phone" className="border border-gray-300 p-3 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.phone} onChange={e => update('phone', e.target.value)} />
              
              {formData.docType === 'Order' && (
                <input placeholder="PO #" className="border border-gray-300 p-3 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.poNum} onChange={e => update('poNum', e.target.value)} />
              )}
            </div>
          </section>

          {/* 2. Door Specifications */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#555555] border-b-2 border-[#555555] pb-2">DOOR SPECIFICATIONS</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700 mb-1 block">Finished Height</span>
                <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.finishedHeight} onChange={e => update('finishedHeight', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700 mb-1 block">Finished Width</span>
                <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.finishedWidth} onChange={e => update('finishedWidth', e.target.value)} />
              </label>
            </div>

            {/* Radio Buttons in Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <p className="font-bold text-sm mb-2 text-gray-700">Thickness</p>
                <label className="block text-sm mb-2"><input type="radio" name="thick" onChange={() => update('thickness', '1-3/8-in')} checked={formData.thickness==='1-3/8-in'} className="mr-2"/> 1-3/8"</label>
                <label className="block text-sm"><input type="radio" name="thick" onChange={() => update('thickness', '1-3/4-in')} className="mr-2"/> 1-3/4"</label>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <p className="font-bold text-sm mb-2 text-gray-700">Core</p>
                <label className="block text-sm mb-2"><input type="radio" name="core" onChange={() => update('core', 'Solid')} checked={formData.core==='Solid'} className="mr-2"/> Solid</label>
                <label className="block text-sm"><input type="radio" name="core" onChange={() => update('core', 'Hollow')} className="mr-2"/> Hollow</label>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <p className="font-bold text-sm mb-2 text-gray-700">Hinge Radius</p>
                <label className="block text-sm mb-2"><input type="radio" name="rad" onChange={() => update('hingeRadius', '1/4-in')} checked={formData.hingeRadius==='1/4-in'} className="mr-2"/> 1/4"</label>
                <label className="block text-sm"><input type="radio" name="rad" onChange={() => update('hingeRadius', '5/8-in')} className="mr-2"/> 5/8"</label>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <p className="font-bold text-sm mb-2 text-gray-700">Hinge Dimensions</p>
                <label className="block text-sm mb-2"><input type="radio" name="hingeDim" onChange={() => update('hingeDim', '3-1/2-in')} checked={formData.hingeDim==='3-1/2-in'} className="mr-2"/> 3-1/2"</label>
                <label className="block text-sm"><input type="radio" name="hingeDim" onChange={() => update('hingeDim', '4-in')} className="mr-2"/> 4"</label>
              </div>
            </div>

            {/* Door Type */}
            <div className="mb-4">
              <p className="font-bold text-sm mb-2 text-gray-700">Door Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => update('doorType', 'Interior')} 
                  className={`p-3 rounded-lg font-semibold transition-all ${formData.doorType === 'Interior' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                  style={formData.doorType === 'Interior' ? { background: '#555555' } : {}}
                >
                  Interior
                </button>
                <button 
                  type="button"
                  onClick={() => update('doorType', 'Exterior')} 
                  className={`p-3 rounded-lg font-semibold transition-all ${formData.doorType === 'Exterior' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                  style={formData.doorType === 'Exterior' ? { background: '#555555' } : {}}
                >
                  Exterior
                </button>
              </div>
            </div>
          </section>

          {/* 3. Measurement Plots */}
          <section className="bg-gray-100 p-6 rounded-lg shadow-md border-l-4 border-[#555555]">
            <h2 className="text-xl font-bold mb-4 text-[#555555] border-b-2 border-[#555555] pb-2">MEASUREMENT PLOTS (FROM TOP)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <input placeholder="Top of 1st Hinge" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.hinge1} onChange={e => update('hinge1', e.target.value)} />
                <input placeholder="Top of 2nd Hinge" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.hinge2} onChange={e => update('hinge2', e.target.value)} />
                <input placeholder="Top of 3rd Hinge" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.hinge3} onChange={e => update('hinge3', e.target.value)} />
                <input placeholder="Peep Hole" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.peepHole} onChange={e => update('peepHole', e.target.value)} />
              </div>
              <div className="space-y-3">
                <input placeholder="Deadbolt Centerline" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.deadbolt} onChange={e => update('deadbolt', e.target.value)} />
                <input placeholder="Entry Knob Centerline" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.entryKnob} onChange={e => update('entryKnob', e.target.value)} />
                <select className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.backset} onChange={e => update('backset', e.target.value)}>
                  <option value="2-3/8-in">Backset: 2-3/8"</option>
                  <option value="2-3/4-in">Backset: 2-3/4"</option>
                </select>
              </div>
            </div>
          </section>

          {/* 4. Door Swing */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#555555] border-b-2 border-[#555555] pb-2">DOOR SWING (Back to Hinges)</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => update('swing', 'Left')} 
                className={`p-4 rounded-lg font-bold transition-all ${formData.swing==='Left' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                style={formData.swing==='Left' ? { background: '#555555' } : {}}
              >
                Left Hand
              </button>
              <button 
                type="button"
                onClick={() => update('swing', 'Right')} 
                className={`p-4 rounded-lg font-bold transition-all ${formData.swing==='Right' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                style={formData.swing==='Right' ? { background: '#555555' } : {}}
              >
                Right Hand
              </button>
            </div>
          </section>

          {/* 5. Product/Inventory */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#555555] border-b-2 border-[#555555] pb-2">PRODUCT / INVENTORY</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Product #" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.productNum} onChange={e => update('productNum', e.target.value)} />
              <input placeholder="Quantity" type="number" min="1" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] focus:border-transparent" value={formData.quantity} onChange={e => update('quantity', e.target.value)} />
            </div>
          </section>

          {/* 6. Notes */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#555555] border-b-2 border-[#555555] pb-2">NOTES / FABRICATION DETAILS</h2>
            <textarea placeholder="Add any special instructions or notes here..." className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.notes} onChange={e => update('notes', e.target.value)}></textarea>
          </section>

          {/* 7. Signature & Date */}
          <section className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#555555]">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-[#555555] pb-2">SIGNATURE & DATE</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Signature</label>
                <input type="text" placeholder="Sign here or type name" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.customerSignature} onChange={e => update('customerSignature', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input type="date" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555]" value={formData.signatureDate} onChange={e => update('signatureDate', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button 
            type="button"
            onClick={() => setStatus('Production')} 
            className="w-full text-white p-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            style={{ background: '#555555' }}
            onMouseEnter={e => e.currentTarget.style.background = '#444444'}
            onMouseLeave={e => e.currentTarget.style.background = '#555555'}
          >
            SUBMIT TO PRODUCTION
          </button>

        </form>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DoorApp />);
