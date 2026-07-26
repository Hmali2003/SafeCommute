const CONDITION_ICONS = {
  Rain: '🌧',
  Thunderstorm: '⛈',
  Drizzle: '🌦',
  Snow: '❄️',
  Clear: '☀️',
  Clouds: '☁️',
  Mist: '🌫',
  Fog: '🌫',
};

export default function WeatherSummary({ weather }) {
  if (!weather) return <p className="text-sm text-slate-400">No weather data available</p>;
  if (weather.error) return <p className="text-sm text-amber-600">Weather data unavailable: {weather.error}</p>;

  const icon = CONDITION_ICONS[weather.condition] || '🌡';

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="font-semibold text-slate-800 capitalize">{weather.description}</p>
          <p className="text-sm text-slate-500">{weather.temperature_celsius}°C (feels like {weather.feels_like_celsius}°C)</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl px-3 py-2">
        <p className="text-xs text-slate-400">Rainfall (1h)</p>
        <p className="text-sm font-medium text-slate-700">{weather.rainfall_mm_last_1h} mm</p>
      </div>
      <div className="bg-slate-50 rounded-xl px-3 py-2">
        <p className="text-xs text-slate-400">Humidity</p>
        <p className="text-sm font-medium text-slate-700">{weather.humidity_percent}%</p>
      </div>
      <div className="bg-slate-50 rounded-xl px-3 py-2">
        <p className="text-xs text-slate-400">Wind Speed</p>
        <p className="text-sm font-medium text-slate-700">{weather.wind_speed_ms} m/s</p>
      </div>
      <div className="bg-slate-50 rounded-xl px-3 py-2">
        <p className="text-xs text-slate-400">Visibility</p>
        <p className="text-sm font-medium text-slate-700">{weather.visibility_meters ? `${weather.visibility_meters}m` : '—'}</p>
      </div>
    </div>
  );
}