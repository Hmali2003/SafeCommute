// Risk score isn't calculated yet (that's Phase 8's risk_service.py) — this
// simply renders whatever score is already on the request, or nothing at all.
function getRiskLevel(score) {
  if (score == null) return null;
  if (score < 40) return 'low';
  if (score < 70) return 'medium';
  return 'high';
}

const LEVEL_CONFIG = {
  low: { label: 'Low Risk', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' },
  medium: { label: 'Medium Risk', className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' },
  high: { label: 'High Risk', className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200' },
};

export default function RiskBadge({ score }) {
  const level = getRiskLevel(score);
  if (!level) return <span className="text-xs text-slate-400">Not yet calculated</span>;
  const config = LEVEL_CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
      {config.label} · {score}/100
    </span>
  );
}