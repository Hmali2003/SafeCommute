import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon path issue with Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ latitude, longitude, label = 'Location', height = '300px' }) {
  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm" style={{ height }}>
        No location data
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={[latitude, longitude]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}