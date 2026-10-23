import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Mail, Lock, LogIn, AlertCircle, Sparkles, Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for college demo examiners
  const handleQuickFill = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@kickoff.com');
      setPassword('Admin@12345');
    } else {
      setEmail('student@kickoff.com');
      setPassword('Student@12345');
    }
  };

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Brand Logo Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              className="ball-icon"
              style={{ width: '48px', height: '48px', margin: '0 auto 14px auto' }}
            >
              <Trophy size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Sign in to reserve courts and access your digital match passes.
            </p>
          </div>

          {isExpired && (
            <div className="toast-alert error" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="toast-alert error" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pitch-green)' }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  placeholder="player@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pitch-green)' }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '10px' }}
            >
              <LogIn size={18} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Fast Testing */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              <Sparkles size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Quick Fill Demo Credentials:
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => handleQuickFill('student')}
              >
                Player / Student
              </button>
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => handleQuickFill('admin')}
              >
                <Shield size={13} />
                Admin
              </button>
            </div>
          </div>

          {/* Registration link */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '24px',
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}
          >
            Don’t have an account?{' '}
            <Link to="/register" style={{ color: 'var(--pitch-green)', fontWeight: '600' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
