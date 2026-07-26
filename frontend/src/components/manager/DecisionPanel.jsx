import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '../common/Icons';

export default function DecisionPanel({ currentStatus, onDecide }) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDecision = async (status) => {
    setSubmitting(true);
    try {
      await onDecide(status, comment);
    } finally {
      setSubmitting(false);
    }
  };

  if (currentStatus === 'approved' || currentStatus === 'rejected') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${currentStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {currentStatus === 'approved' ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
        </div>
        <p className="font-semibold text-slate-800 capitalize">Request {currentStatus}</p>
        <p className="text-sm text-slate-500 mt-1">This request has already been decided.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 sticky top-20">
      <h3 className="font-bold text-slate-900">Make a Decision</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Comment (optional)</label>
        <textarea
          rows={3}
          placeholder='e.g. "Approved due to heavy rainfall."'
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <button
          disabled={submitting}
          onClick={() => handleDecision('approved')}
          className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <CheckCircleIcon className="w-5 h-5" /> Approve Request
        </button>
        <button
          disabled={submitting}
          onClick={() => handleDecision('rejected')}
          className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
        >
          <XCircleIcon className="w-5 h-5" /> Reject Request
        </button>
        <button
          disabled={submitting}
          onClick={() => handleDecision('more_info_requested')}
          className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
        >
          <ClockIcon className="w-4 h-4" /> Request More Info
        </button>
      </div>
    </div>
  );
}