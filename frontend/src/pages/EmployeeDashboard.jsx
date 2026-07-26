import { useEffect, useState } from 'react';
import { getMyRequests } from '../services/requestService';
import { signOut } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RequestForm from '../components/employee/RequestForm';
import RequestHistory from '../components/employee/RequestHistory';
import StatCard from '../components/common/StatCard';
import { StatCardSkeleton, RequestCardSkeleton } from '../components/common/Skeleton';
import { ClipboardIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ShieldIcon } from '../components/common/Icons';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getMyRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    api.get('/api/auth/me').then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending' || r.status === 'more_info_requested').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldIcon className="w-5 h-5 text-primary-600" />
          <span className="font-bold text-primary-700">SafeCommute</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-900 transition">Log out</button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{todayLabel}</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {getGreeting()}{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stay safe. Submit requests when commuting conditions are risky.</p>
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
              <StatCard icon={<ClockIcon className="w-full h-full" />} label="Pending" value={stats.pending} accent="amber" delay={40} />
              <StatCard icon={<CheckCircleIcon className="w-full h-full" />} label="Approved" value={stats.approved} accent="emerald" delay={80} />
              <StatCard icon={<XCircleIcon className="w-full h-full" />} label="Rejected" value={stats.rejected} accent="red" delay={120} />
            </>
          )}
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8">
          <RequestForm onSuccess={loadRequests} />

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Requests</h2>
            {loading ? (
              <div className="space-y-3">
                <RequestCardSkeleton /><RequestCardSkeleton />
              </div>
            ) : (
              <RequestHistory requests={requests} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}