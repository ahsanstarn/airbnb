'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 41.7151, // Tbilisi
  lng: 44.8271
};

interface MapProps {
  locations?: { lat: number, lng: number, title?: string, price?: number }[];
  center?: { lat: number, lng: number };
  zoom?: number;
}

export default function Map({ locations = [], center = defaultCenter, zoom = 12 }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });



  if (!isLoaded) return <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {locations.map((loc, i) => (
        <Marker
          key={i}
          position={{ lat: loc.lat, lng: loc.lng }}
          label={loc.price ? { text: `₾${loc.price}`, className: 'map-price-label' } : undefined}
        />
      ))}
    </GoogleMap>
  );
}
