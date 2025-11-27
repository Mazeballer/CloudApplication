'use client';

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Normalize center to [lat, lng] array
  const centerArray: [number, number] = Array.isArray(center)
    ? (center as [number, number])
    : [(center as any).lat ?? 3.139, (center as any).lng ?? 101.6869];

  // When key changes React remounts the map, so it appears centered correctly
  const mapKey = `map-${centerArray[0]}-${centerArray[1]}`;

  const workshopIcon = L.icon({
    iconUrl: '/location-pin.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const userIcon = L.icon({
    iconUrl: '/user-pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

  // Don't render the map until the component is mounted
  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

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
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <strong>You are here</strong>
          </Popup>
        </Marker>
      )}

      {workshops
        .filter((w) => w.latitude && w.longitude)
        .map((w) => (
          <Marker
            key={w.id}
            position={[w.latitude as number, w.longitude as number]}
            icon={workshopIcon}
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
