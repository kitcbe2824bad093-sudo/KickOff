import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import {
  Trophy,
  MapPin,
  Users,
  Maximize2,
  CheckCircle,
  Star,
  Clock,
  CalendarCheck,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

const CourtDetailsPage = () => {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date for slot availability check preview
  const today = new Date().toISOString().split('T')[0];
  const [checkDate, setCheckDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        setLoading(true);
        const res = await api.getCourtById(id);
        if (res.success) {
          setCourt(res.court);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourt();
  }, [id]);

  useEffect(() => {
    if (!id || !checkDate) return;

    const fetchAvailability = async () => {
      try {
        setLoadingSlots(true);
        const res = await api.getCourtAvailability(id, checkDate);
        if (res.success) {
          setSlots(res.slots || []);
        }
      } catch (err) {
        console.error('Failed to fetch slot availability:', err.message);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [id, checkDate]);

  if (loading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="badge badge-green">Loading football court details...</div>
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Court not found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{error || 'The requested court could not be located.'}</p>
        <Link to="/courts" className="btn btn-glass" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Courts
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/courts" className="btn btn-glass btn-sm">
            <ArrowLeft size={15} /> Back to All Courts
          </Link>
        </div>

        {/* Hero Court Header Banner */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: '420px',
            marginBottom: '36px',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <img
            src={court.image}
            alt={court.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/turf-5aside.jpg';
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 17, 27, 0.95) 0%, rgba(11, 17, 27, 0.2) 60%)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              right: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-green">{court.categoryLabel || `${court.category} Arena`}</span>
                <span className="badge badge-gold">
                  <Star size={13} fill="#ffb300" stroke="#ffb300" />
                  {court.rating} ({court.reviewsCount} Reviews)
                </span>
                <span className="badge badge-blue">
                  <ShieldCheck size={13} />
                  FIFA Quality Pitch
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px' }}>{court.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} className="text-accent" />
                <span>{court.location?.address}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--pitch-green)' }}>
                {court.currency}{court.hourlyRate?.toLocaleString()}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> / hour</span>
              </div>
              <Link to={`/booking/${court._id}`} className="btn btn-accent btn-lg" style={{ marginTop: '10px' }}>
                <CalendarCheck size={18} />
                Book This Court
              </Link>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '36px' }}>
          {/* Main Info */}
          <div>
            {/* Description */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                marginBottom: '30px'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Pitch Overview</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {court.description}
              </p>

              {/* Specifications Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DIMENSIONS</div>
                  <strong style={{ fontSize: '1rem' }}>{court.dimensions}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SURFACE TYPE</div>
                  <strong style={{ fontSize: '1rem' }}>{court.surface}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CAPACITY</div>
                  <strong style={{ fontSize: '1rem' }}>{court.capacity}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OPERATING HOURS</div>
                  <strong style={{ fontSize: '1rem' }}>06:00 AM – 11:00 PM</strong>
                </div>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                marginBottom: '30px'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Amenities & Equipment Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {court.facilities?.map((facility, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                    <CheckCircle size={18} className="text-accent" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps Location Embed */}
            <div style={{ marginBottom: '30px' }}>
              <GoogleMapEmbed location={court.location} courtName={court.name} />
            </div>
          </div>

          {/* Sticky Sidebar: Live Slot Preview */}
          <div>
            <div
              style={{
                position: 'sticky',
                top: '90px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-lg)',
                padding: '26px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Live Slot Availability</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Check slot status for your chosen match date:
              </p>

              <div className="form-group">
                <input
                  type="date"
                  className="form-input"
                  min={today}
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                />
              </div>

              {/* Slots pill list */}
              {loadingSlots ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  Checking availability...
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: '280px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '20px',
                    paddingRight: '6px'
                  }}
                >
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: slot.isAvailable ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                        border: slot.isAvailable ? '1px solid rgba(0, 230, 118, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                        opacity: slot.isAvailable ? 1 : 0.45
                      }}
                    >
                      <div>
                        <strong>{slot.startTime}</strong> – {slot.endTime}
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {slot.session}
                        </small>
                      </div>
                      <span className={`badge ${slot.isAvailable ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                        {slot.isAvailable ? 'AVAILABLE' : 'BOOKED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to={`/booking/${court._id}?date=${checkDate}`}
                className="btn btn-accent"
                style={{ width: '100%' }}
              >
                <CalendarCheck size={18} />
                Proceed to Booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetailsPage;
