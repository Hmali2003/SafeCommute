const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200' },
  more_info_requested: { label: 'More Info Needed', className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-slate-100 text-slate-700' };
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };