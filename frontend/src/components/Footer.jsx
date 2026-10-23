import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '16px' }}>
              <div className="ball-icon">
                <Trophy size={18} />
              </div>
              <span>
                Kick<span className="text-accent">Off</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              KickOff is India’s top-tier football arena platform. Experience FIFA-certified synthetic astroturf, tournament-grade floodlights, and instant real-time slot reservations.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--pitch-green)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Full-Stack MERN Architecture with Razorpay & Maps</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '18px', fontSize: '1.1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Home</Link></li>
              <li><Link to="/courts" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Football Courts</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contact Arena</Link></li>
              <li><Link to="/my-bookings" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>My Match Passes</Link></li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 style={{ marginBottom: '18px', fontSize: '1.1rem' }}>Pitch Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Morning Sessions</strong>
                06:00 AM – 12:00 PM
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Afternoon Play</strong>
                02:00 PM – 05:00 PM
              </div>
              <div>
                <strong style={{ color: 'var(--pitch-green)', display: 'block' }}>Evening Floodlights</strong>
                05:00 PM – 11:00 PM
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ marginBottom: '18px', fontSize: '1.1rem' }}>Arena Complex</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} className="text-accent" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Plot 14, KickOff Sports Hub, 80 Feet Road, Koramangala, Bangalore</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} className="text-accent" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} className="text-accent" />
                <span>support@kickoffarena.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KickOff Football Court Booking System. Built with MERN Stack.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
