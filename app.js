const { useState, useEffect } = React;

const STORAGE_KEY = 'door-fab-draft';
const REQUIRED_FIELDS = ['customerName', 'orderNum', 'finishedHeight', 'finishedWidth', 'swing'];

const EMPTY_FORM = {
  customerName: '', accountNum: '', address: '', contact: '', orderNum: '', poNum: '', phone: '',
  type: 'Delivery',
  finishedHeight: '', finishedWidth: '',
  doorType: 'Interior', core: 'Solid', thickness: '1-3/8-in',
  hingeDim: '3-1/2-in', hingeRadius: '1/4-in',
  swing: '', facing: 'Standard',
  hinge1: '', hinge2: '', hinge3: '',
  peepHole: '', deadbolt: '', entryKnob: '',
  backset: '2-3/8-in',
  productNum: '', quantity: '', notes: ''
};

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString();
}

function DoorApp() {
  const [status, setStatus] = useState('Presale');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHasDraft(true);
  }, []);

  // Auto-save to localStorage on every formData change
  useEffect(() => {
    const ts = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, status, savedAt: ts }));
    setLastSaved(ts);
  }, [formData, status]);

  const update = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  // Validate required fields; returns true if valid
  const validate = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach(f => {
      if (!formData[f]?.toString().trim()) newErrors[f] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Load last draft from localStorage
  const loadDraft = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { formData: fd, status: st, savedAt } = JSON.parse(saved);
      setFormData(fd);
      setStatus(st || 'Presale');
      setLastSaved(savedAt);
      setErrors({});
      showSuccess('Draft loaded successfully!');
    }
  };

  // Clear form and localStorage with confirmation
  const clearData = () => {
    if (!window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setFormData(EMPTY_FORM);
    setStatus('Presale');
    setErrors({});
    setLastSaved(null);
    setHasDraft(false);
    showSuccess('Form cleared.');
  };

  // New Order – same as clearData but friendlier label
  const newOrder = () => {
    if (!window.confirm('Start a new order? Current data will be cleared.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setFormData(EMPTY_FORM);
    setStatus('Presale');
    setErrors({});
    setLastSaved(null);
    setHasDraft(false);
    showSuccess('Ready for a new order!');
  };

  // Export as CSV
  const exportCSV = () => {
    const ts = new Date().toLocaleString();
    const rows = [
      ['Field', 'Value'],
      ['Export Timestamp', ts],
      ['Status', status],
      ['Customer Name', formData.customerName],
      ['Account #', formData.accountNum],
      ['Order #', formData.orderNum],
      ['PO #', formData.poNum],
      ['Phone', formData.phone],
      ['Type', formData.type],
      ['Finished Height', formData.finishedHeight],
      ['Finished Width', formData.finishedWidth],
      ['Door Type', formData.doorType],
      ['Thickness', formData.thickness],
      ['Core', formData.core],
      ['Hinge Radius', formData.hingeRadius],
      ['Door Swing', formData.swing],
      ['Facing', formData.facing],
      ['Top of 1st Hinge', formData.hinge1],
      ['Top of 2nd Hinge', formData.hinge2],
      ['Top of 3rd Hinge', formData.hinge3],
      ['Deadbolt Centerline', formData.deadbolt],
      ['Entry Knob Centerline', formData.entryKnob],
      ['Backset', formData.backset],
      ['Notes', formData.notes],
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `door-order-${formData.orderNum || 'draft'}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('CSV exported!');
  };

  // Export as PDF using jsPDF
  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const ts = new Date().toLocaleString();
    let y = 15;
    const line = (label, value, indent = 0) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 14 + indent, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value || '—'), 80 + indent, y);
      y += 8;
    };
    const sectionHeader = (title) => {
      y += 3;
      doc.setFillColor(30, 58, 138);
      doc.rect(14, y - 5, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(title, 16, y);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      y += 7;
    };

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Lockset and Hinge Boring Order', 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Exported: ${ts}   |   Status: ${status}`, 14, y);
    doc.setTextColor(0);
    y += 10;

    sectionHeader('CUSTOMER / ORDER INFO');
    line('Customer Name', formData.customerName);
    line('Account #', formData.accountNum);
    line('Order #', formData.orderNum);
    line('PO #', formData.poNum);
    line('Phone', formData.phone);
    line('Type', formData.type);

    sectionHeader('DOOR SPECIFICATIONS');
    line('Finished Height', formData.finishedHeight);
    line('Finished Width', formData.finishedWidth);
    line('Door Type', formData.doorType);
    line('Thickness', formData.thickness);
    line('Core', formData.core);
    line('Hinge Radius', formData.hingeRadius);
    line('Door Swing', formData.swing);
    line('Facing', formData.facing);

    sectionHeader('MEASUREMENT PLOTS (FROM TOP)');
    line('Top of 1st Hinge', formData.hinge1);
    line('Top of 2nd Hinge', formData.hinge2);
    line('Top of 3rd Hinge', formData.hinge3);
    line('Deadbolt Centerline', formData.deadbolt);
    line('Entry Knob Centerline', formData.entryKnob);
    line('Backset', formData.backset);

    sectionHeader('NOTES');
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(formData.notes || '—', 170);
    doc.text(noteLines, 14, y);

    doc.save(`door-order-${formData.orderNum || 'draft'}-${Date.now()}.pdf`);
    showSuccess('PDF exported!');
  };

  // Submit to production: validate, save, export PDF
  const submitToProduction = () => {
    if (!validate()) return;
    setStatus('Production');
    const ts = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, status: 'Production', savedAt: ts }));
    setLastSaved(ts);
    exportPDF();
    showSuccess('Order submitted to production and PDF exported!');
  };

  const inputClass = (field) =>
    `border p-2 rounded w-full ${errors[field] ? 'border-red-500 bg-red-50' : ''}`;

  const errMsg = (field, label) =>
    errors[field] ? <p className="text-red-500 text-xs mt-1">{label} is required.</p> : null;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white min-h-screen shadow-xl border-t-8 border-blue-900 font-sans">
      <header className="mb-4 border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Lockset and Hinge Boring Order</h1>
            <p className="text-sm text-gray-600">Status: <span className="font-bold text-orange-600 uppercase">{status}</span></p>
            {lastSaved && <p className="text-xs text-gray-400 mt-1">Last saved: {formatTimestamp(lastSaved)}</p>}
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {hasDraft && (
              <button onClick={loadDraft} className="text-xs bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded hover:bg-blue-200">
                Load Last Draft
              </button>
            )}
            <button onClick={newOrder} className="text-xs bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">
              New Order
            </button>
            <button onClick={clearData} className="text-xs bg-red-50 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-100">
              Clear Data
            </button>
          </div>
        </div>
      </header>

      {/* Success / Error Banner */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded text-sm font-medium">
          ✅ {successMsg}
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded text-sm font-medium">
          ⚠️ Please fill in all required fields before submitting.
        </div>
      )}

      {/* 1. Customer Info Section */}
      <section className="grid grid-cols-2 gap-3 mb-8 bg-gray-50 p-4 rounded">
        <div>
          <input
            placeholder="Customer Name *"
            value={formData.customerName}
            className={inputClass('customerName')}
            onChange={e => update('customerName', e.target.value)}
          />
          {errMsg('customerName', 'Customer Name')}
        </div>
        <input placeholder="Account #" value={formData.accountNum} className="border p-2 rounded w-full" onChange={e => update('accountNum', e.target.value)} />
        <div>
          <input
            placeholder="Order # *"
            value={formData.orderNum}
            className={inputClass('orderNum')}
            onChange={e => update('orderNum', e.target.value)}
          />
          {errMsg('orderNum', 'Order #')}
        </div>
        <input placeholder="PO #" value={formData.poNum} className="border p-2 rounded w-full" onChange={e => update('poNum', e.target.value)} />
      </section>

      {/* 2. Door Specifications */}
      <section className="mb-8 space-y-4">
        <h2 className="font-bold border-b text-gray-700">DOOR SPECIFICATIONS</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Finished Height *
            <input
              type="text"
              value={formData.finishedHeight}
              className={`w-full border p-2 mt-1 ${errors.finishedHeight ? 'border-red-500 bg-red-50' : ''}`}
              onChange={e => update('finishedHeight', e.target.value)}
            />
            {errMsg('finishedHeight', 'Finished Height')}
          </label>
          <label className="block text-sm font-medium">
            Finished Width *
            <input
              type="text"
              value={formData.finishedWidth}
              className={`w-full border p-2 mt-1 ${errors.finishedWidth ? 'border-red-500 bg-red-50' : ''}`}
              onChange={e => update('finishedWidth', e.target.value)}
            />
            {errMsg('finishedWidth', 'Finished Width')}
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 border rounded">
            <p className="font-bold mb-1">Thickness</p>
            <label className="block"><input type="radio" name="thick" onChange={() => update('thickness', '1-3/8-in')} checked={formData.thickness === '1-3/8-in'} /> 1-3/8"</label>
            <label className="block"><input type="radio" name="thick" onChange={() => update('thickness', '1-3/4-in')} checked={formData.thickness === '1-3/4-in'} /> 1-3/4"</label>
          </div>
          <div className="p-2 border rounded">
            <p className="font-bold mb-1">Core</p>
            <label className="block"><input type="radio" name="core" onChange={() => update('core', 'Solid')} checked={formData.core === 'Solid'} /> Solid</label>
            <label className="block"><input type="radio" name="core" onChange={() => update('core', 'Hollow')} checked={formData.core === 'Hollow'} /> Hollow</label>
          </div>
          <div className="p-2 border rounded">
            <p className="font-bold mb-1">Hinge Radius</p>
            <label className="block"><input type="radio" name="rad" onChange={() => update('hingeRadius', '1/4-in')} checked={formData.hingeRadius === '1/4-in'} /> 1/4"</label>
            <label className="block"><input type="radio" name="rad" onChange={() => update('hingeRadius', '5/8-in')} checked={formData.hingeRadius === '5/8-in'} /> 5/8"</label>
          </div>
        </div>
      </section>

      {/* 3. Measurement Plots */}
      <section className="mb-8 bg-blue-50 p-4 rounded border border-blue-200">
        <h2 className="font-bold text-blue-900 mb-2">MEASUREMENT PLOTS (FROM TOP)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <input placeholder="Top of 1st Hinge" value={formData.hinge1} className="w-full border p-2" onChange={e => update('hinge1', e.target.value)} />
            <input placeholder="Top of 2nd Hinge" value={formData.hinge2} className="w-full border p-2" onChange={e => update('hinge2', e.target.value)} />
            <input placeholder="Top of 3rd Hinge" value={formData.hinge3} className="w-full border p-2" onChange={e => update('hinge3', e.target.value)} />
          </div>
          <div className="space-y-2">
            <input placeholder="Deadbolt Centerline" value={formData.deadbolt} className="w-full border p-2" onChange={e => update('deadbolt', e.target.value)} />
            <input placeholder="Entry Knob Centerline" value={formData.entryKnob} className="w-full border p-2" onChange={e => update('entryKnob', e.target.value)} />
            <select value={formData.backset} className="w-full border p-2 bg-white" onChange={e => update('backset', e.target.value)}>
              <option value="2-3/8-in">Backset: 2-3/8"</option>
              <option value="2-3/4-in">Backset: 2-3/4"</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Door Swing */}
      <section className="mb-8">
        <h2 className={`font-bold mb-2 ${errors.swing ? 'text-red-600' : ''}`}>DOOR SWING (Back to Hinges) *</h2>
        <div className="flex gap-2">
          <button
            onClick={() => update('swing', 'Left')}
            className={`flex-1 p-3 border rounded ${formData.swing === 'Left' ? 'bg-blue-800 text-white' : errors.swing ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white'}`}
          >Left Hand</button>
          <button
            onClick={() => update('swing', 'Right')}
            className={`flex-1 p-3 border rounded ${formData.swing === 'Right' ? 'bg-blue-800 text-white' : errors.swing ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white'}`}
          >Right Hand</button>
        </div>
        {errMsg('swing', 'Door Swing')}
      </section>

      <textarea
        placeholder="Notes / Fabrication Details"
        value={formData.notes}
        className="w-full border p-2 rounded h-20 mb-6"
        onChange={e => update('notes', e.target.value)}
      ></textarea>

      {/* Export Buttons */}
      <div className="flex gap-3 mb-4">
        <button onClick={exportCSV} className="flex-1 bg-indigo-600 text-white p-3 rounded font-semibold hover:bg-indigo-700">
          📄 Export as CSV
        </button>
        <button onClick={exportPDF} className="flex-1 bg-purple-600 text-white p-3 rounded font-semibold hover:bg-purple-700">
          📋 Export as PDF
        </button>
      </div>

      <button
        className="w-full bg-green-700 text-white p-4 rounded-lg font-bold text-lg shadow-lg hover:bg-green-800"
        onClick={submitToProduction}
      >
        SUBMIT TO PRODUCTION
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DoorApp />);
