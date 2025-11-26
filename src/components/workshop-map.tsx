'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

type Address = {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type MapWorkshop = {
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: Address;
};

interface WorkshopMapProps {
  center: LatLngExpression;
  workshops: MapWorkshop[];
  userLocation?: LatLngExpression | null;
}

export function WorkshopMap({
  center,
  workshops,
  userLocation,
}: WorkshopMapProps) {
  // Normalize center to [lat, lng] array
  const centerArray: [number, number] = Array.isArray(center)
    ? (center as [number, number])
    : [(center as any).lat ?? 3.139, (center as any).lng ?? 101.6869];

  // When key changes React remounts the map, so it appears centered correctly
  const mapKey = `map-${centerArray[0]}-${centerArray[1]}`;

  return (
    <MapContainer
      key={mapKey}
      center={centerArray}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={userLocation}>
          <Popup>
            <strong>Your location</strong>
          </Popup>
        </Marker>
      )}

      {workshops
        .filter((w) => w.latitude && w.longitude)
        .map((w) => (
          <Marker
            key={w.id}
            position={[w.latitude as number, w.longitude as number]}
          >
            <Popup>
              <strong>{w.name}</strong>
              <br />
              {[
                w.address?.street,
                w.address?.city,
                w.address?.state,
                w.address?.postcode,
              ]
                .filter(Boolean)
                .join(', ')}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
