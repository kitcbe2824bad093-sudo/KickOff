import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import CourtCard from '../components/CourtCard';
import {
  Trophy,
  Search,
  CalendarCheck,
  Zap,
  ShieldCheck,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Compass
} from 'lucide-react';

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await api.getCourts();
        if (res.success) {
          setCourts(res.courts);
        }
      } catch (err) {
        console.error('Failed to fetch courts for homepage:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/courts?search=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
  };

  const filteredCourts = courts.filter((court) => {
    const matchesCategory = selectedCategory === 'all' || court.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: 'relative',
          padding: '100px 0 80px 0',
          background: 'linear-gradient(180deg, rgba(8,12,19,0.7) 0%, var(--bg-main) 100%), url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              className="badge badge-green"
              style={{ marginBottom: '20px', padding: '6px 16px', fontSize: '0.85rem' }}
            >
              <Sparkles size={14} />
              <span>PREMIER FOOTBALL COURT BOOKING PLATFORM</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                letterSpacing: '-1px',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}
            >
              Book Your <span className="text-accent">Football Court</span> Today!
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '36px'
              }}
            >
              Experience FIFA-certified synthetic astroturf, tournament-grade floodlights, and zero-hassle online slot booking. Bring your squad onto the pitch with instant digital match pass confirmation!
            </p>

            {/* Quick Hero Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                background: 'rgba(16, 24, 38, 0.85)',
                backdropFilter: 'blur(16px)',
                padding: '12px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 25px var(--pitch-glow)',
                marginBottom: '32px'
              }}
            >
              <div style={{ flex: 1, minWidth: '220px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--pitch-green)' }} />
                <input
                  type="text"
                  placeholder="Search by court name, turf type, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 46px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff'
                  }}
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '12px 18px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Pitch Formats</option>
                <option value="5v5">5-a-Side AstroTurf</option>
                <option value="7v7">7-a-Side Championship</option>
                <option value="indoor">Indoor AC Futsal</option>
                <option value="11v11">11-a-Side Regulation</option>
              </select>

              <button type="submit" className="btn btn-accent" style={{ padding: '12px 28px' }}>
                <CalendarCheck size={18} />
                <span>Find Courts</span>
              </button>
            </form>

            {/* Quick Action CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/courts" className="btn btn-accent btn-lg">
                <Trophy size={18} />
                Explore All Courts
              </Link>
              <Link to="/contact" className="btn btn-glass btn-lg">
                <Compass size={18} />
                View Pitch Locations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS TICKER ================= */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pitch-green)' }}>FIFA-Grade</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certified Synthetic Turfs</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>1000+ Lux</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Night Match Floodlights</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pitch-green)' }}>Instant Slot</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Double-Booking Prevention</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Razorpay</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure Digital Payments</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURTS ================= */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
            <div>
              <div className="badge badge-green" style={{ marginBottom: '8px' }}>
                AVAILABLE PITCHES
              </div>
              <h2 style={{ fontSize: '2.2rem' }}>Top Football Courts & Arenas</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Select your preferred court size and book your next match in seconds.
              </p>
            </div>

            <Link to="/courts" className="btn btn-outline btn-sm">
              <span>View All Courts</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="badge badge-green">Loading football courts...</div>
            </div>
          ) : filteredCourts.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No courts found matching your criteria.</h3>
              <button
                className="btn btn-glass btn-sm"
                style={{ marginTop: '14px' }}
                onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredCourts.slice(0, 4).map((court) => (
                <CourtCard key={court._id} court={court} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>EASY 3-STEP PROCESS</span>
            <h2 style={{ fontSize: '2.2rem' }}>How KickOff Works</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              No calling back and forth. Real-time availability with verified slots.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}
          >
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 230, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pitch-green)', marginBottom: '18px' }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>1. Choose Your Court</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Pick from 5-a-side astroturf, 7-a-side match turf, climate-controlled indoor futsal, or full 11v11 stadium pitches.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 230, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pitch-green)', marginBottom: '18px' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>2. Select Date & Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                View live slot availability. Our server validates instantly so you never suffer from double bookings or overlapping schedules.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 230, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pitch-green)', marginBottom: '18px' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>3. Instant Match Pass</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Pay seamlessly with Razorpay test checkout, receive email confirmations, and get a digital QR ticket ready for turnstile entry!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
