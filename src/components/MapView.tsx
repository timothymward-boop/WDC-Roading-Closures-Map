import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Closure } from '../data/mockClosures';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  closures: Closure[];
  onMarkerClick?: (closure: Closure) => void;
}

export default function MapView({ closures, onMarkerClick }: MapViewProps) {
  return (
    <MapContainer 
      center={[-35.7251, 174.3237]} 
      zoom={11} 
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {closures.map((closure) => (
        <Marker 
          key={closure.id} 
          position={[closure.lat, closure.lng]}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(closure),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg mb-1">{closure.roadName}</h3>
              <p className="text-sm font-semibold text-red-600 mb-2">{closure.type} - {closure.status}</p>
              <p className="text-sm text-gray-700">{closure.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
