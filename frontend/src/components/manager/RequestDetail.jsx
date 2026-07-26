import MapView from '../common/MapView';
import Avatar from '../common/Avatar';
import RiskBadge from '../common/RiskBadge';
import { MapPinIcon } from '../common/Icons';
import WeatherSummary from '../common/WeatherSummary';

export default function RequestDetail({ request }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Avatar name={request.employee_name} />
        <div>
          <h2 className="text-lg font-bold text-slate-900">{request.employee_name}</h2>
          <p className="text-sm text-slate-400">{request.employee_email}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-400 mb-1">Risk Level</p>
          <RiskBadge score={request.risk_score} />
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Submitted</p>
          <p className="text-sm text-slate-700">{new Date(request.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1.5">Reason</h3>
        <p className="text-slate-800 leading-relaxed">{request.reason}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <MapPinIcon className="w-4 h-4 text-slate-400" /> Location
        </h3>
        <MapView latitude={request.latitude} longitude={request.longitude} label={request.employee_name} />
      </div>

      {request.image_url && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Road Evidence</h3>
          <img
            src={request.image_url}
            alt="Road condition"
            className="rounded-xl max-h-80 w-full object-cover border border-slate-200"
          />
        </div>
      )}

{request.weather_data && (
  <div>
    <h3 className="text-sm font-semibold text-slate-700 mb-2">Weather Conditions</h3>
    <WeatherSummary weather={request.weather_data} />
  </div>
)}
      {request.recommendation && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1.5">System Recommendation</h3>
          <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5">{request.recommendation}</p>
        </div>
      )}
    </div>
  );
}