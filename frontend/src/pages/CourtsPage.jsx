import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import CourtCard from '../components/CourtCard';
import { Trophy, Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';

const CourtsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('price-asc');

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const res = await api.getCourts();
        if (res.success) {
          setCourts(res.courts);
        }
      } catch (err) {
        console.error('Error fetching courts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  // Filter and sort courts
  const filteredCourts = courts
    .filter((court) => {
      const matchCat = category === 'all' || court.category === category;
      const matchQuery =
        !search ||
        court.name.toLowerCase().includes(search.toLowerCase()) ||
        court.description.toLowerCase().includes(search.toLowerCase()) ||
        court.location?.city?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-desc') return b.hourlyRate - a.hourlyRate;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const categories = [
    { id: 'all', label: 'All Arenas' },
    { id: '5v5', label: '5-a-Side AstroTurf' },
    { id: '7v7', label: '7-a-Side Championship' },
    { id: 'indoor', label: 'Indoor AC Futsal' },
    { id: '11v11', label: '11-a-Side Regulation' }
  ];

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge badge-green" style={{ marginBottom: '10px' }}>
            REGULATION FOOTBALL PITCHES
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>Explore Football Courts</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            Browse our world-class grounds in Bangalore. All pitches feature high-lux LED lighting, player benches, and changing facilities.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '36px'
          }}
        >
          {/* Format Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`btn btn-sm ${category === cat.id ? 'btn-accent' : 'btn-glass'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pitch-green)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Search courts, surface type, or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courts Grid */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="badge badge-green">Loading courts catalog...</div>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Trophy size={48} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
            <h3>No courts match your search criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Try switching categories or clearing your search term.</p>
            <button
              className="btn btn-outline btn-sm"
              style={{ marginTop: '16px' }}
              onClick={() => { setCategory('all'); setSearch(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredCourts.length}</strong> available football courts:
            </div>
            <div className="cards-grid">
              {filteredCourts.map((court) => (
                <CourtCard key={court._id} court={court} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtsPage;
