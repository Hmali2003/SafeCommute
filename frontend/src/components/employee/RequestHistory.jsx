import RequestCard from './RequestCard';
import EmptyState from '../common/EmptyState';

export default function RequestHistory({ requests }) {
  if (!requests?.length) {
    return (
      <EmptyState
        title="No safety requests yet"
        subtitle="Submit your first request if your commute becomes unsafe."
      />
    );
  }
  return (
    <div className="space-y-3">
      {requests.map((r, i) => (
        <div key={r.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
          <RequestCard request={r} />
        </div>
      ))}
    </div>
  );
}