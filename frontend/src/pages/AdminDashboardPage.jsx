import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Trophy,
  Users,
  Calendar,
  IndianRupee,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Ban,
  Filter,
  Search,
  ShieldAlert,
  X,
  CreditCard,
  MapPin
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [courtStats, setCourtStats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'courts' | 'users'
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modal State for Add / Edit Court
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [courtForm, setCourtForm] = useState({
    name: '',
    category: '5v5',
    categoryLabel: '5-a-Side AstroTurf',
    hourlyRate: 1200,
    dimensions: '30m × 20m',
    surface: 'FIFA Certified Turf',
    capacity: '10 Players (5v5)',
    description: '',
    image: '/images/turf-5aside.jpg',
    address: 'KickOff Sports Complex, Bangalore',
    latitude: 12.9716,
    longitude: 77.5946
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, courtsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminBookings(),
        api.getCourts('activeOnly=false'),
        api.getAllUsers()
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setCourtStats(statsRes.courtStats || []);
      }
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
      if (courtsRes.success) setCourts(courtsRes.courts || []);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update Booking Status
  const handleUpdateStatus = async (bookingId, bookingStatus, paymentStatus) => {
    try {
      const res = await api.updateBookingStatus(bookingId, { bookingStatus, paymentStatus });
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  // Open Court Form for Create
  const handleOpenCreateCourt = () => {
    setEditingCourt(null);
    setCourtForm({
      name: '',
      category: '5v5',
      categoryLabel: '5-a-Side AstroTurf',
      hourlyRate: 1200,
      dimensions: '30m × 20m',
      surface: 'FIFA Certified Turf',
      capacity: '10 Players (5v5)',
      description: '',
      image: '/images/turf-5aside.jpg',
      address: 'KickOff Sports Complex, Bangalore',
      latitude: 12.9716,
      longitude: 77.5946
    });
    setShowCourtModal(true);
  };

  // Open Court Form for Edit
  const handleOpenEditCourt = (c) => {
    setEditingCourt(c);
    setCourtForm({
      name: c.name,
      category: c.category,
      categoryLabel: c.categoryLabel,
      hourlyRate: c.hourlyRate,
      dimensions: c.dimensions,
      surface: c.surface,
      capacity: c.capacity,
      description: c.description,
      image: c.image,
      address: c.location?.address || '',
      latitude: c.location?.latitude || 12.9716,
      longitude: c.location?.longitude || 77.5946
    });
    setShowCourtModal(true);
  };

  // Submit Court Create or Edit
  const handleSaveCourt = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: courtForm.name,
        category: courtForm.category,
        categoryLabel: courtForm.categoryLabel,
        hourlyRate: Number(courtForm.hourlyRate),
        dimensions: courtForm.dimensions,
        surface: courtForm.surface,
        capacity: courtForm.capacity,
        description: courtForm.description,
        image: courtForm.image,
        location: {
          address: courtForm.address,
          city: 'Bangalore',
          latitude: Number(courtForm.latitude),
          longitude: Number(courtForm.longitude)
        }
      };

      if (editingCourt) {
        await api.updateCourt(editingCourt._id, payload);
      } else {
        await api.createCourt(payload);
      }

      setShowCourtModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(`Failed to save court: ${err.message}`);
    }
  };

  // Delete Court
  const handleDeleteCourt = async (courtId) => {
    if (!window.confirm('Are you sure you want to remove or deactivate this court?')) return;
    try {
      const res = await api.deleteCourt(courtId);
      alert(res.message);
      fetchDashboardData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = bookingFilter === 'all' || b.bookingStatus === bookingFilter;
    const matchSearch =
      !bookingSearch ||
      b.bookingId.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.courtName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerDetails?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerDetails?.email?.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <ShieldAlert size={14} />
            ADMINISTRATOR CONTROL PANEL
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>Arena Management Portal</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Live booking analytics, court management, revenue metrics, and customer reservations.
          </p>
        </div>

        {error && (
          <div className="toast-alert error" style={{ marginBottom: '24px' }}>
            <span>{error}</span>
          </div>
        )}

        {/* 1. Stat Cards Row */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <IndianRupee size={26} />
              </div>
              <div>
                <div className="stat-val text-accent">₹{stats.totalRevenue?.toLocaleString()}</div>
                <div className="stat-label">Total Arena Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.totalBookings}</div>
                <div className="stat-label">Total Reservations</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Trophy size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.activeCourts}</div>
                <div className="stat-label">Active Football Courts</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users size={26} />
              </div>
              <div>
                <div className="stat-val">{stats.totalUsers}</div>
                <div className="stat-label">Registered Players</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
            marginBottom: '26px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-accent' : 'btn-glass'}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar size={15} /> All Bookings ({bookings.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'courts' ? 'btn-accent' : 'btn-glass'}`}
              onClick={() => setActiveTab('courts')}
            >
              <Trophy size={15} /> Football Courts ({courts.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'users' ? 'btn-accent' : 'btn-glass'}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={15} /> Player Accounts ({users.length})
            </button>
          </div>

          {activeTab === 'courts' && (
            <button className="btn btn-accent btn-sm" onClick={handleOpenCreateCourt}>
              <Plus size={16} /> Add Football Court
            </button>
          )}
        </div>

        {/* TAB 1: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            {/* Search & Status Filters */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pitch-green)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Search by ID, customer name, email, or court..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn btn-sm ${bookingFilter === 'all' ? 'btn-outline' : 'btn-glass'}`}
                  onClick={() => setBookingFilter('all')}
                >
                  All ({bookings.length})
                </button>
                <button
                  className={`btn btn-sm ${bookingFilter === 'confirmed' ? 'btn-outline' : 'btn-glass'}`}
                  onClick={() => setBookingFilter('confirmed')}
                >
                  Confirmed
                </button>
                <button
                  className={`btn btn-sm ${bookingFilter === 'cancelled' ? 'btn-outline' : 'btn-glass'}`}
                  onClick={() => setBookingFilter('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Court</th>
                    <th>Customer</th>
                    <th>Date & Slot</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No bookings found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          <strong className="text-accent">{b.bookingId}</strong>
                        </td>
                        <td>
                          <div>{b.courtName}</div>
                          <small style={{ color: 'var(--text-muted)' }}>{b.duration} hr</small>
                        </td>
                        <td>
                          <div>{b.customerDetails?.name}</div>
                          <small style={{ color: 'var(--text-muted)' }}>
                            {b.customerDetails?.email} • {b.customerDetails?.phone}
                          </small>
                        </td>
                        <td>
                          <div>{b.date}</div>
                          <small style={{ color: 'var(--pitch-green)' }}>{b.startTime} - {b.endTime}</small>
                        </td>
                        <td>
                          <strong>₹{b.totalAmount?.toLocaleString()}</strong>
                          <div>
                            <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: '0.65rem' }}>
                              {b.paymentStatus?.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.bookingStatus === 'confirmed'
                                ? 'badge-green'
                                : b.bookingStatus === 'completed'
                                ? 'badge-blue'
                                : 'badge-red'
                            }`}
                          >
                            {b.bookingStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {b.bookingStatus === 'confirmed' && (
                              <>
                                <button
                                  className="btn btn-glass btn-sm"
                                  title="Mark match completed"
                                  onClick={() => handleUpdateStatus(b._id, 'completed', b.paymentStatus)}
                                >
                                  <CheckCircle size={14} className="text-accent" />
                                </button>
                                <button
                                  className="btn btn-glass btn-sm"
                                  title="Cancel booking"
                                  onClick={() => handleUpdateStatus(b._id, 'cancelled', 'refunded')}
                                >
                                  <Ban size={14} style={{ color: 'var(--accent-danger)' }} />
                                </button>
                              </>
                            )}
                            {b.paymentStatus !== 'paid' && (
                              <button
                                className="btn btn-glass btn-sm"
                                title="Mark Paid"
                                onClick={() => handleUpdateStatus(b._id, b.bookingStatus, 'paid')}
                              >
                                <CreditCard size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FOOTBALL COURTS */}
        {activeTab === 'courts' && (
          <div>
            <div className="cards-grid">
              {courts.map((court) => (
                <div
                  key={court._id}
                  className="court-card"
                  style={{ opacity: court.isActive ? 1 : 0.6 }}
                >
                  <div className="court-image-wrapper">
                    <img src={court.image} alt={court.name} />
                    <span
                      className={`badge ${court.isActive ? 'badge-green' : 'badge-red'}`}
                      style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}
                    >
                      {court.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="court-card-body">
                    <h3>{court.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0 14px 0' }}>
                      {court.categoryLabel} • {court.capacity} • ₹{court.hourlyRate}/hr
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      {court.description?.slice(0, 95)}...
                    </p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button
                        className="btn btn-glass btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => handleOpenEditCourt(court)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCourt(court._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Pitch Position</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>
                        {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td>{u.preferredPosition || 'Forward'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL: ADD / EDIT COURT */}
        {showCourtModal && (
          <div className="modal-overlay" onClick={() => setShowCourtModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
              <button className="modal-close" onClick={() => setShowCourtModal(false)}>
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '18px' }}>
                {editingCourt ? 'Edit Football Court' : 'Add New Football Court'}
              </h2>

              <form onSubmit={handleSaveCourt}>
                <div className="form-group">
                  <label className="form-label">Court Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courtForm.name}
                    onChange={(e) => setCourtForm({ ...courtForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Format / Category</label>
                    <select
                      className="form-select"
                      value={courtForm.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const label =
                          cat === '5v5'
                            ? '5-a-Side AstroTurf'
                            : cat === '7v7'
                            ? '7-a-Side Championship'
                            : cat === 'indoor'
                            ? 'Indoor AC Futsal'
                            : '11-a-Side Regulation';
                        setCourtForm({ ...courtForm, category: cat, categoryLabel: label });
                      }}
                    >
                      <option value="5v5">5-a-Side</option>
                      <option value="7v7">7-a-Side</option>
                      <option value="indoor">Indoor Futsal</option>
                      <option value="11v11">11-a-Side</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hourly Rate (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={courtForm.hourlyRate}
                      onChange={(e) => setCourtForm({ ...courtForm, hourlyRate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      className="form-input"
                      value={courtForm.dimensions}
                      onChange={(e) => setCourtForm({ ...courtForm, dimensions: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Surface Type</label>
                    <input
                      type="text"
                      className="form-input"
                      value={courtForm.surface}
                      onChange={(e) => setCourtForm({ ...courtForm, surface: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Court Image Path / URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courtForm.image}
                    onChange={(e) => setCourtForm({ ...courtForm, image: e.target.value })}
                    placeholder="/images/turf-5aside.jpg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={courtForm.description}
                    onChange={(e) => setCourtForm({ ...courtForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courtForm.address}
                    onChange={(e) => setCourtForm({ ...courtForm, address: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-input"
                      value={courtForm.latitude}
                      onChange={(e) => setCourtForm({ ...courtForm, latitude: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-input"
                      value={courtForm.longitude}
                      onChange={(e) => setCourtForm({ ...courtForm, longitude: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-glass" onClick={() => setShowCourtModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Save Court
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
