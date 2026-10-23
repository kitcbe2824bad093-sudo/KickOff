import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Maximize2, Shield, CalendarCheck } from 'lucide-react';

const CourtCard = ({ court }) => {
  const {
    _id,
    name,
    category,
    categoryLabel,
    hourlyRate,
    currency = '₹',
    image,
    badge,
    rating = 4.8,
    reviewsCount = 120,
    dimensions,
    surface,
    capacity,
    location,
    facilities = []
  } = court;

  return (
    <div className="court-card">
      <div className="court-image-wrapper">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/turf-5aside.jpg';
          }}
        />
        <div className="court-image-overlay" />
        {badge && (
          <span
            className="badge badge-green"
            style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}
          >
            {badge}
          </span>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          <span className="badge badge-gold">
            <Star size={13} fill="#ffb300" stroke="#ffb300" />
            {rating} ({reviewsCount})
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              background: 'rgba(0,0,0,0.6)',
              padding: '3px 8px',
              borderRadius: '6px'
            }}
          >
            {categoryLabel || `${category} Arena`}
          </span>
        </div>
      </div>

      <div className="court-card-body">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{name}</h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '14px'
          }}
        >
          <MapPin size={15} className="text-accent" />
          <span>{location?.city || 'Bangalore'} • {location?.address?.split(',')[1]?.trim() || 'Central Turf Complex'}</span>
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '18px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} className="text-accent" />
            <span>{capacity || '10 Players'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Maximize2 size={14} className="text-accent" />
            <span>{dimensions || '30m × 20m'}</span>
          </div>
        </div>

        {/* Facilities Preview */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {facilities.slice(0, 3).map((f, i) => (
            <span
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Card Footer: Price & CTA */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}
        >
          <div>
            <div className="court-card-price">
              {currency}{hourlyRate?.toLocaleString()}
              <span> / hour</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={`/courts/${_id}`} className="btn btn-glass btn-sm">
              Details
            </Link>
            <Link to={`/booking/${_id}`} className="btn btn-accent btn-sm">
              <CalendarCheck size={15} />
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
