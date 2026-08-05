import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({
  latitude,
  longitude,
  accuracy,
  label = 'Location',
  height = '300px',
  draggable = false,
  onLocationChange,
}) {
  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm" style={{ height }}>
        No location data
      </div>
    );
  }

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    onLocationChange?.(lat, lng);
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {accuracy > 0 && (
          <Circle
            center={[latitude, longitude]}
            radius={accuracy}
            pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }}
          />
        )}
        <Marker
          position={[latitude, longitude]}
          draggable={draggable}
          eventHandlers={draggable ? { dragend: handleDragEnd } : {}}
        >
          <Popup>{draggable ? 'Drag me to your exact location' : label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}