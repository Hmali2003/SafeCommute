import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestDetail, makeDecision } from '../services/requestService';
import RequestDetail from '../components/manager/RequestDetail';
import DecisionPanel from '../components/manager/DecisionPanel';
import { ArrowLeftIcon, ShieldIcon } from '../components/common/Icons';

export default function ManagerRequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const data = await getRequestDetail(requestId);
    setRequest(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [requestId]);

  const handleDecide = async (status, comment) => {
    await makeDecision(requestId, status, comment);
    await load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading request…</p>
      </div>
    );
  }
  if (!request) return <div className="p-8 text-center text-slate-500">Request not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/manager')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition">
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2">
          <ShieldIcon className="w-4 h-4 text-primary-600" />
          <span className="font-bold text-primary-700 text-sm">SafeCommute — Manager</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <RequestDetail request={request} />
        </div>
        <div className="md:col-span-1">
          <DecisionPanel currentStatus={request.status} onDecide={handleDecide} />
        </div>
      </div>
    </div>
  );
}