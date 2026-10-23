import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Calendar,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  PhoneCall,
  Flame
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="ball-icon">
            <Trophy size={20} />
          </div>
          <span>
            Kick<span className="text-accent">Off</span>
          </span>
          <span className="badge badge-green" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>
            ARENA
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/courts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Courts & Turfs
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Bookings
            </NavLink>
          )}
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ color: 'var(--accent-gold)' }}
            >
              <ShieldAlert size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/profile" className="user-badge" title="My Profile">
                <User size={15} className="text-accent" />
                <span style={{ fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'User'}</span>
                {user?.role === 'admin' && <span className="badge badge-gold">Admin</span>}
              </Link>
              <button onClick={handleLogout} className="btn btn-glass btn-sm" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-glass btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-accent btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="btn btn-glass btn-sm"
            style={{ display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
