export default function SectionHeader({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 mt-6 border-b border-slate-700 pb-1">
      {children}
    </h2>
  );
}
