import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Trophy, CheckCircle, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredPosition, setPreferredPosition] = useState(user?.preferredPosition || 'Forward');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setLoading(true);
      await updateProfile({ name, phone, preferredPosition });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '30px' }}>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>PLAYER DASHBOARD</div>
          <h1 style={{ fontSize: '2.4rem' }}>User Profile</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage your player profile details and preferred football pitch positions.
          </p>
        </div>

        {successMsg && (
          <div className="toast-alert success">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="toast-alert error">
            <span>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
          {/* User Summary Card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--pitch-green), var(--pitch-green-dark))',
                color: '#050a10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '2rem',
                fontWeight: '900'
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>{user?.email}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
              <span className={`badge ${user?.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>
                {user?.role?.toUpperCase()}
              </span>
              <span className="badge badge-blue">{user?.preferredPosition || 'Forward'}</span>
            </div>

            <Link to="/my-bookings" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              <Trophy size={14} />
              View My Bookings
            </Link>
          </div>

          {/* Edit Form */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Edit Details</h3>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read Only)</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Position</label>
                <select
                  className="form-select"
                  value={preferredPosition}
                  onChange={(e) => setPreferredPosition(e.target.value)}
                >
                  <option value="Forward">Forward / Striker</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Any">Any Position</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-accent"
                style={{ marginTop: '10px' }}
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
