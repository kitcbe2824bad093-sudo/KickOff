import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import BookingTicket from '../components/BookingTicket';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Ban,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Selected booking for match pass modal
  const [activeTicket, setActiveTicket] = useState(null);

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;

    try {
      setCancelling(true);
      const res = await api.cancelBooking(cancelTarget._id, 'Cancelled by user');
      if (res.success) {
        setCancelTarget(null);
        await fetchBookings();
      }
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.bookingStatus === 'confirmed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <div>
            <div className="badge badge-green" style={{ marginBottom: '8px' }}>
              MATCH RESERVATIONS
            </div>
            <h1 style={{ fontSize: '2.4rem' }}>My Match Passes</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              View upcoming match schedules, download digital passes, or cancel reservations.
            </p>
          </div>

          <Link to="/booking" className="btn btn-accent">
            <Calendar size={18} />
            Book Another Court
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-accent' : 'btn-glass'}`}
            onClick={() => setFilter('all')}
          >
            All Passes ({bookings.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'confirmed' ? 'btn-accent' : 'btn-glass'}`}
            onClick={() => setFilter('confirmed')}
          >
            Active & Confirmed ({bookings.filter((b) => b.bookingStatus === 'confirmed').length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'cancelled' ? 'btn-accent' : 'btn-glass'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
          </button>
        </div>

        {/* List of Bookings */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="badge badge-green">Fetching your match passes...</div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Trophy size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No reservations found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
              You don’t have any {filter !== 'all' ? filter : ''} football bookings currently.
            </p>
            <Link to="/courts" className="btn btn-accent btn-sm" style={{ marginTop: '20px' }}>
              Explore Courts & Book Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredBookings.map((b) => {
              const isConfirmed = b.bookingStatus === 'confirmed';
              return (
                <div
                  key={b._id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: isConfirmed ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: isConfirmed ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 82, 82, 0.15)',
                        border: isConfirmed ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 82, 82, 0.3)',
                        color: isConfirmed ? 'var(--pitch-green)' : 'var(--accent-danger)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trophy size={26} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span className="text-accent" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                          {b.bookingId}
                        </span>
                        <span className={`badge ${isConfirmed ? 'badge-green' : 'badge-red'}`}>
                          {b.bookingStatus?.toUpperCase()}
                        </span>
                        <span className="badge badge-blue">PAID: {b.paymentStatus?.toUpperCase()}</span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{b.courtName}</h3>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} className="text-accent" />
                          <span>{b.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} className="text-accent" />
                          <span>{b.startTime} - {b.endTime} ({b.duration} hr)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} className="text-accent" />
                          <span>KickOff Arena, Bangalore</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AMOUNT</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--pitch-green)' }}>
                        ₹{b.totalAmount?.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-glass btn-sm"
                        onClick={() => setActiveTicket(b)}
                      >
                        <QrCode size={15} />
                        <span>Match Pass</span>
                      </button>

                      {isConfirmed && (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }}
                          onClick={() => setCancelTarget(b)}
                        >
                          <Ban size={15} />
                          <span>Cancel Slot</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Dialog */}
        {cancelTarget && (
          <div className="modal-overlay" onClick={() => setCancelTarget(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(255, 82, 82, 0.15)',
                    color: 'var(--accent-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}
                >
                  <AlertTriangle size={32} />
                </div>
                <h3>Cancel Match Booking?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                  Are you sure you want to cancel booking <strong>{cancelTarget.bookingId}</strong> for{' '}
                  <strong>{cancelTarget.courtName}</strong>?
                </p>
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px',
                    background: 'rgba(255, 82, 82, 0.08)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#ff8a80'
                  }}
                >
                  * Cancelling will immediately release this slot back to the public pool so other teams can reserve it.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  className="btn btn-glass"
                  onClick={() => setCancelTarget(null)}
                  disabled={cancelling}
                >
                  Keep Reservation
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Releasing Slot...' : 'Yes, Cancel Slot'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Match Pass Modal */}
        {activeTicket && (
          <BookingTicket
            booking={activeTicket}
            onClose={() => setActiveTicket(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
