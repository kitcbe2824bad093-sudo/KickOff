import React from 'react';
import { Trophy, Printer, QrCode, CheckCircle2, Calendar, Clock, MapPin, X } from 'lucide-react';

const BookingTicket = ({ booking, onClose }) => {
  if (!booking) return null;

  const {
    bookingId,
    courtName,
    date,
    startTime,
    endTime,
    duration,
    customerDetails,
    totalAmount,
    bookingStatus,
    paymentStatus
  } = booking;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close match pass">
          <X size={18} />
        </button>

        <div className="ticket-wrapper" id="printableTicket">
          {/* Header */}
          <div className="ticket-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ball-icon" style={{ width: '32px', height: '32px' }}>
                <Trophy size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  Kick<span className="text-accent">Off</span> ARENA
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  OFFICIAL DIGITAL MATCH PASS
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${bookingStatus === 'confirmed' ? 'badge-green' : 'badge-red'}`}>
                <CheckCircle2 size={12} />
                {bookingStatus?.toUpperCase()}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--pitch-green)', marginTop: '4px' }}>
                Payment: {paymentStatus?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Court Banner */}
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{courtName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              <MapPin size={14} className="text-accent" />
              <span>Bangalore Central Turf Complex, Arena Gate A</span>
            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="ticket-grid">
            <div className="ticket-cell">
              <div className="ticket-label">BOOKING ID</div>
              <div className="ticket-value text-accent">{bookingId}</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">MATCH DATE</div>
              <div className="ticket-value">{date}</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">TIME SLOT</div>
              <div className="ticket-value text-accent">{startTime} - {endTime}</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">MATCH DURATION</div>
              <div className="ticket-value">{duration} Hour(s)</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">CAPTAIN / PLAYER</div>
              <div className="ticket-value">{customerDetails?.name}</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">SQUAD SIZE</div>
              <div className="ticket-value">{customerDetails?.squadSize || 10} Players</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">CONTACT PHONE</div>
              <div className="ticket-value">{customerDetails?.phone || 'N/A'}</div>
            </div>

            <div className="ticket-cell">
              <div className="ticket-label">TOTAL AMOUNT</div>
              <div className="ticket-value text-accent">₹{totalAmount?.toLocaleString()}</div>
            </div>
          </div>

          {/* QR Code and Gate Turnstile Bar */}
          <div
            style={{
              marginTop: '22px',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#fff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                flexShrink: 0
              }}
            >
              <QrCode size={46} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.85rem' }}>
                Scan at Pitch Turnstile Gate
              </strong>
              Show this QR pass or booking ID at reception. Entrance permitted 15 minutes prior to kick-off.
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-glass" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-accent" onClick={handlePrint}>
            <Printer size={16} />
            Print / Save Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;
