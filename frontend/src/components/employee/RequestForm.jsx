import { useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { createRequest } from '../../services/requestService';
import MapView from '../common/MapView';
import { ClipboardIcon, MapPinIcon, CameraIcon, SendIcon } from '../common/Icons';

const STEPS = [
  { key: 'describe', label: 'Describe issue', icon: ClipboardIcon },
  { key: 'location', label: 'Capture location', icon: MapPinIcon },
  { key: 'evidence', label: 'Upload evidence', icon: CameraIcon },
  { key: 'submit', label: 'Submit', icon: SendIcon },
];

export default function RequestForm({ onSuccess }) {
  const [reason, setReason] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { location, error: geoError, loading: geoLoading, captureLocation } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!location) {
      setError('Please capture your GPS location before submitting');
      return;
    }
    setSubmitting(true);
    try {
      await createRequest({
        reason,
        latitude: location.latitude,
        longitude: location.longitude,
        imageFile,
      });
      setReason('');
      setImageFile(null);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const stepDone = {
    describe: reason.trim().length > 0,
    location: !!location,
    evidence: !!imageFile,
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Submit a WFH Request</h2>
        <p className="text-sm text-slate-500 mt-1">Give your manager what they need to make a fast, fair call.</p>
      </div>

      {/* Step rail */}
      <div className="flex items-center justify-between px-6 pt-5">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = step.key === 'submit' ? false : stepDone[step.key];
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    done ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-medium whitespace-nowrap ${done ? 'text-primary-700' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 rounded ${done ? 'bg-primary-600' : 'bg-slate-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 space-y-5">
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
            <span className="w-5 h-5 rounded bg-primary-50 text-primary-600 flex items-center justify-center text-[11px] font-bold">1</span>
            Describe the issue
          </label>
          <textarea
            required
            rows={3}
            placeholder="e.g. Heavy rain and waterlogging near my area"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
            <span className="w-5 h-5 rounded bg-primary-50 text-primary-600 flex items-center justify-center text-[11px] font-bold">2</span>
            Capture your location
          </label>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500">Used to check conditions in your exact area.</p>
            <button
              type="button"
              onClick={captureLocation}
              disabled={geoLoading}
              className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition whitespace-nowrap"
            >
              {geoLoading ? 'Capturing…' : location ? 'Recapture' : 'Capture Location'}
            </button>
          </div>
          {geoError && <p className="text-sm text-red-600 mb-2">{geoError}</p>}
          {location ? (
            <MapView latitude={location.latitude} longitude={location.longitude} label="Your location" height="180px" />
          ) : (
            <div className="h-[180px] rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">
              No location captured yet
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
            <span className="w-5 h-5 rounded bg-primary-50 text-primary-600 flex items-center justify-center text-[11px] font-bold">3</span>
            Upload evidence <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <label className="flex items-center gap-3 border border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-50 transition">
            <CameraIcon className="w-5 h-5 text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500 truncate">
              {imageFile ? imageFile.name : 'Add a photo of the road or commute condition'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
        >
          <SendIcon className="w-4 h-4" />
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}