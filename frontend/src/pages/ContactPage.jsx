import React, { useState } from 'react';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const arenaLocation = {
    address: 'Plot 14, KickOff Sports Hub, 80 Feet Road, Koramangala 4th Block, Bangalore',
    city: 'Bangalore',
    latitude: 12.9352,
    longitude: 77.6245
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>GET IN TOUCH</div>
          <h1 style={{ fontSize: '2.5rem' }}>Contact KickOff Arena</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Have questions regarding tournament hosting, corporate league slots, or bulk bookings? We're here to help.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', marginBottom: '50px' }}>
          {/* Contact Information & Map */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '26px'
              }}
            >
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--pitch-green)', marginBottom: '8px' }}>
                  <MapPin size={20} />
                  <strong>Arena Complex</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Plot 14, KickOff Sports Hub, Koramangala, Bangalore - 560034
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--pitch-green)', marginBottom: '8px' }}>
                  <Phone size={20} />
                  <strong>Phone Support</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  +91 98765 43210 / +91 80 2345 6789
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--pitch-green)', marginBottom: '8px' }}>
                  <Mail size={20} />
                  <strong>Email</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  support@kickoffarena.com
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--pitch-green)', marginBottom: '8px' }}>
                  <Clock size={20} />
                  <strong>Timings</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Open Daily: 06:00 AM – 11:00 PM
                </p>
              </div>
            </div>

            {/* Google Maps Location Embed */}
            <GoogleMapEmbed location={arenaLocation} courtName="KickOff Arena Main Grounds" />
          </div>

          {/* Contact Message Form */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px'
            }}
          >
            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>Send Us a Message</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '22px' }}>
              Fill out this form and our match coordinator will get back to you within 24 hours.
            </p>

            {submitted && (
              <div className="toast-alert success" style={{ marginBottom: '20px' }}>
                <CheckCircle2 size={18} />
                <span>Thank you! Your inquiry has been sent to our arena management.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Cristiano Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="captain@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Subject</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Corporate League Booking">Corporate League Booking</option>
                  <option value="Weekend Tournament Slot">Weekend Tournament Slot</option>
                  <option value="Academy Coaching Enquiries">Academy Coaching Enquiries</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide details about your squad size, desired hours, or tournament schedule..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
