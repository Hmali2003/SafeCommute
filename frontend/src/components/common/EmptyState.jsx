export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6 bg-white rounded-2xl border border-dashed border-slate-200">
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M32 8 12 16v14c0 13 8.6 21.8 20 26 11.4-4.2 20-13 20-26V16L32 8Z" strokeLinejoin="round" />
        <path d="M25 32l5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-semibold text-slate-800">{title}</p>
      {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}