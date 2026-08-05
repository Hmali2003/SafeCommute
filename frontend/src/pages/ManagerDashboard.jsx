import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../services/requestService';
import { signOut } from '../services/authService';
import RequestTable from '../components/manager/RequestTable';
import StatCard from '../components/common/StatCard';
import { StatCardSkeleton, TableRowSkeleton } from '../components/common/Skeleton';
import { ClipboardIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ShieldIcon, SearchIcon, ChevronDownIcon } from '../components/common/Icons';

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'More Info Needed', value: 'more_info_requested' },
];

export default function ManagerDashboard() {
  const [allRequests, setAllRequests] = useState([]); // unfiltered, for accurate stats
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllRequests().then(setAllRequests).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === 'pending').length,
    approved: allRequests.filter((r) => r.status === 'approved').length,
    rejected: allRequests.filter((r) => r.status === 'rejected').length,
  };
  function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
  }


  const visibleRequests = useMemo(() => {
    let result = [...allRequests];

    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) => r.employee_name.toLowerCase().includes(q) || r.employee_email.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at);
      return sortOrder === 'newest' ? -diff : diff;
    });

    return result;
  }, [allRequests, search, statusFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldIcon className="w-5 h-5 text-primary-600" />
          <span className="font-bold text-primary-700">SafeCommute — Manager</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-900 transition">Log out</button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
  {getGreeting()}, Manager
</h1>
          <p className="text-sm text-slate-500 mt-1">Review employee safety requests and make decisions quickly.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard icon={<ClipboardIcon className="w-full h-full" />} label="Total Requests" value={stats.total} accent="primary" delay={0} />
              <StatCard icon={<ClockIcon className="w-full h-full" />} label="Pending Review" value={stats.pending} accent="amber" delay={40} />
              <StatCard icon={<CheckCircleIcon className="w-full h-full" />} label="Approved" value={stats.approved} accent="emerald" delay={80} />
              <StatCard icon={<XCircleIcon className="w-full h-full" />} label="Rejected" value={stats.rejected} accent="red" delay={120} />
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-white"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none pl-3 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full"><tbody><TableRowSkeleton /><TableRowSkeleton /><TableRowSkeleton /></tbody></table>
          </div>
        ) : (
          <RequestTable requests={visibleRequests} />
        )}
      </div>
    </div>
  );
}