'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const sellerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const buyerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const transitIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [20, 33], iconAnchor: [10, 33], popupAnchor: [1, -28], shadowSize: [33, 33],
});

function FitBounds({ sellerCoords, buyerCoords }: { sellerCoords: [number, number]; buyerCoords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([sellerCoords, buyerCoords]);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
  }, [map, sellerCoords, buyerCoords]);
  return null;
}

interface TrackingMapProps {
  sellerCoords: [number, number];
  buyerCoords: [number, number];
  sellerLocation: string;
  buyerLocation: string;
  progressPercent: number;
  googleMapsUrl: string;
}

export default function TrackingMap({ sellerCoords, buyerCoords, sellerLocation, buyerLocation, progressPercent, googleMapsUrl }: TrackingMapProps) {
  // Current transit position
  const transitPos: [number, number] = [
    sellerCoords[0] + (buyerCoords[0] - sellerCoords[0]) * (progressPercent / 100),
    sellerCoords[1] + (buyerCoords[1] - sellerCoords[1]) * (progressPercent / 100),
  ];

  // Create curved route
  const routePoints: [number, number][] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = sellerCoords[0] + (buyerCoords[0] - sellerCoords[0]) * t;
    const lng = sellerCoords[1] + (buyerCoords[1] - sellerCoords[1]) * t;
    const curve = Math.sin(t * Math.PI) * 0.3;
    routePoints.push([lat + curve, lng]);
  }

  const traveledIndex = Math.floor((progressPercent / 100) * steps);
  const traveledRoute = routePoints.slice(0, traveledIndex + 1);
  const remainingRoute = routePoints.slice(traveledIndex);

  const center: [number, number] = [
    (sellerCoords[0] + buyerCoords[0]) / 2,
    (sellerCoords[1] + buyerCoords[1]) / 2,
  ];

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '420px', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* REALISTIC Map Tiles — OpenStreetMap Standard */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds sellerCoords={sellerCoords} buyerCoords={buyerCoords} />

        {/* Remaining route (dashed gray) */}
        <Polyline
          positions={remainingRoute}
          pathOptions={{ color: '#888888', weight: 3, dashArray: '8, 8', opacity: 0.6 }}
        />

        {/* Traveled route (solid blue) */}
        {traveledRoute.length > 1 && (
          <Polyline
            positions={traveledRoute}
            pathOptions={{ color: '#2563EB', weight: 5, opacity: 0.9 }}
          />
        )}

        {/* Seller Marker */}
        <Marker position={sellerCoords} icon={sellerIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '4px' }}>
              <strong style={{ color: '#16a34a', fontSize: '14px' }}>🏪 Seller Location</strong>
              <br />
              <span style={{ color: '#4b5563', fontSize: '12px' }}>{sellerLocation}</span>
              <br />
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', fontSize: '11px', textDecoration: 'underline' }}>
                Open in Google Maps →
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Buyer Marker */}
        <Marker position={buyerCoords} icon={buyerIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '4px' }}>
              <strong style={{ color: '#2563EB', fontSize: '14px' }}>🏠 Your Location</strong>
              <br />
              <span style={{ color: '#4b5563', fontSize: '12px' }}>{buyerLocation}</span>
              <br />
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', fontSize: '11px', textDecoration: 'underline' }}>
                Open in Google Maps →
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Transit Marker */}
        {progressPercent > 0 && progressPercent < 100 && (
          <Marker position={transitPos} icon={transitIcon}>
            <Popup>
              <div style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '4px' }}>
                <strong style={{ color: '#ea580c', fontSize: '14px' }}>🚚 In Transit</strong>
                <br />
                <span style={{ color: '#4b5563', fontSize: '12px' }}>{progressPercent}% delivered</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-[10px] space-y-1 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" /> <span className="text-gray-700 font-semibold">Seller</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" /> <span className="text-gray-700 font-semibold">You (Buyer)</span>
        </div>
        {progressPercent > 0 && progressPercent < 100 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" /> <span className="text-gray-700 font-semibold">Package</span>
          </div>
        )}
      </div>

      {/* Google Maps Button Overlay */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors border border-blue-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        Directions
      </a>
    </div>
  );
}
