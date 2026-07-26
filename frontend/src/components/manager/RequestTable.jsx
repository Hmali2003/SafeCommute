import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import RiskBadge from '../common/RiskBadge';
import EmptyState from '../common/EmptyState';

export default function RequestTable({ requests }) {
  if (!requests?.length) {
    return <EmptyState title="No requests match your filters" subtitle="Try adjusting your search or status filter." />;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-400">
            <th className="px-4 py-3 font-medium w-10"></th>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Risk</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, i) => (
            <tr
              key={r.id}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <td className="px-4 py-3"><Avatar name={r.employee_name} size="sm" /></td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{r.employee_name}</div>
                <div className="text-xs text-slate-400">{r.employee_email}</div>
              </td>
              <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{r.reason}</td>
              <td className="px-4 py-3"><RiskBadge score={r.risk_score} /></td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <Link
                  to={`/manager/requests/${r.id}`}
                  className="text-primary-600 font-medium hover:underline whitespace-nowrap"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}