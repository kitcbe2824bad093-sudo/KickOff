import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

const GoogleMapEmbed = ({ location, courtName = 'Football Pitch' }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const lat = location?.latitude || 12.9716;
  const lng = location?.longitude || 77.5946;
  const address = location?.address || 'KickOff Arena, Bangalore';

  // Google Maps directions URL for one-click navigation
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Iframe embed URL: if API key provided, use embed/v1/place, else fallback to interactive map
  const mapEmbedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`
    : `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} className="text-accent" />
            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Arena Location & Directions</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {address}
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          <Navigation size={14} />
          <span>Open in Google Maps</span>
          <ExternalLink size={13} />
        </a>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '320px', background: '#0a0f18' }}>
        <iframe
          title={`Map view for ${courtName}`}
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div
        style={{
          padding: '12px 20px',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>GPS Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
        <span style={{ color: 'var(--pitch-green)' }}>● Stadium Entrance Gate A</span>
      </div>
    </div>
  );
};

export default GoogleMapEmbed;
