import StatusBadge from '../common/StatusBadge';

const TIMELINE_STEPS = ['Submitted', 'Under Review', 'Decision'];

function getActiveStep(status) {
  if (status === 'pending' || status === 'more_info_requested') return 1;
  return 2; // approved or rejected
}

export default function RequestCard({ request }) {
  const activeStep = getActiveStep(request.status);
  const isRejected = request.status === 'rejected';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <p className="text-slate-800 text-sm flex-1">{request.reason}</p>
        <StatusBadge status={request.status} size="sm" />
      </div>

      {/* Timeline */}
      <div className="flex items-center mt-4 mb-1">
        {TIMELINE_STEPS.map((label, i) => {
          const isFinalStep = i === 2;
          const done = i <= activeStep;
          const color = isFinalStep && done ? (isRejected ? 'bg-red-500 border-red-500' : 'bg-emerald-500 border-emerald-500') : done ? 'bg-primary-600 border-primary-600' : 'border-slate-200';
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full border-2 ${done ? color : 'border-slate-200'}`} />
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{label}</span>
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-3.5 rounded ${i < activeStep ? 'bg-primary-600' : 'bg-slate-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
        <span>{new Date(request.created_at).toLocaleDateString()}</span>
        {request.risk_score != null && <span>Risk Score: {request.risk_score}/100</span>}
      </div>

      {request.manager_comment && (
        <p className="mt-3 text-sm text-slate-600 italic bg-slate-50 rounded-lg px-3 py-2">
          "{request.manager_comment}"
        </p>
      )}
    </div>
  );
}