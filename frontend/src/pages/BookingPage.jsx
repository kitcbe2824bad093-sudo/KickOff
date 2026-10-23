import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingTicket from '../components/BookingTicket';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Check,
  CreditCard,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const ADD_ONS_LIST = [
  { id: 'bibs', name: 'Training Bibs (Set of 10)', price: 150 },
  { id: 'ball', name: 'Extra FIFA Match Ball', price: 100 },
  { id: 'referee', name: 'Official Match Referee', price: 500 }
];

const BookingPage = () => {
  const { courtId: routeCourtId } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(routeCourtId || '');
  const [selectedCourt, setSelectedCourt] = useState(null);

  const [date, setDate] = useState(dateParam || todayStr);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [squadSize, setSquadSize] = useState(10);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notes, setNotes] = useState('');

  // Available slots for selected court and date
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Flow & State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);

  // 1. Fetch Courts List
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await api.getCourts();
        if (res.success && res.courts.length > 0) {
          setCourts(res.courts);
          if (!selectedCourtId) {
            setSelectedCourtId(res.courts[0]._id);
          }
        }
      } catch (err) {
        setError('Failed to fetch courts list: ' + err.message);
      }
    };
    fetchCourts();
  }, []);

  // 2. Set current selected court
  useEffect(() => {
    if (selectedCourtId && courts.length > 0) {
      const found = courts.find((c) => c._id === selectedCourtId);
      setSelectedCourt(found || courts[0]);
    }
  }, [selectedCourtId, courts]);

  // 3. Fetch slots whenever court or date changes
  useEffect(() => {
    if (!selectedCourtId || !date) return;

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setStartTime(''); // Reset chosen slot
        const res = await api.getCourtAvailability(selectedCourtId, date);
        if (res.success) {
          setSlots(res.slots || []);
        }
      } catch (err) {
        console.error('Error fetching slots:', err.message);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedCourtId, date]);

  // Price Calculation
  const hourlyRate = selectedCourt ? selectedCourt.hourlyRate : 1200;
  const courtSubtotal = Math.round(hourlyRate * Number(duration));
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = courtSubtotal + addOnsTotal;

  const toggleAddOn = (addOn) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  // Submission & Razorpay Payment Handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedCourtId) {
      setError('Please select a football court');
      return;
    }
    if (!startTime) {
      setError('Please select an available match time slot');
      return;
    }

    try {
      setLoading(true);

      // 1. Create Booking in database
      const bookingPayload = {
        courtId: selectedCourtId,
        date,
        startTime,
        duration: Number(duration),
        squadSize: Number(squadSize),
        addOns: selectedAddOns.map((a) => ({ name: a.name, price: a.price })),
        notes,
        customerDetails: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone || '',
          squadSize: Number(squadSize)
        }
      };

      const bookingRes = await api.createBooking(bookingPayload);
      if (!bookingRes.success) {
        throw new Error(bookingRes.message);
      }

      const newBooking = bookingRes.booking;

      // 2. Initiate Razorpay Order
      try {
        const orderRes = await api.createPaymentOrder(newBooking._id);

        if (window.Razorpay && orderRes.orderId && !orderRes.orderId.startsWith('order_dev_')) {
          // Real Razorpay Checkout Modal
          const options = {
            key: orderRes.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderRes.amount * 100,
            currency: 'INR',
            name: 'KickOff Arena',
            description: `Match Pass - ${newBooking.courtName}`,
            order_id: orderRes.orderId,
            handler: async function (response) {
              const verifyRes = await api.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: newBooking._id
              });

              setConfirmedBooking(verifyRes.booking || newBooking);
              setShowPassModal(true);
            },
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phone
            },
            theme: {
              color: '#00e676'
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (failRes) {
            setError(`Payment Failed: ${failRes.error.description}`);
          });
          rzp.open();
        } else {
          // Simulated instant payment confirmation for local test mode
          const verifyRes = await api.verifyPayment({
            razorpayOrderId: orderRes.orderId,
            razorpayPaymentId: `pay_test_${Date.now()}`,
            razorpaySignature: 'simulated_sig',
            bookingId: newBooking._id,
            isSimulated: true
          });

          setConfirmedBooking(verifyRes.booking || newBooking);
          setShowPassModal(true);
        }
      } catch (payErr) {
        console.warn('Payment setup error (showing confirmed booking anyway):', payErr.message);
        setConfirmedBooking(newBooking);
        setShowPassModal(true);
      }
    } catch (err) {
      setError(err.message || 'Slot booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>
            SLOT RESERVATION & REGISTRATION
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Book Your Match Slot</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Instant availability with conflict-free server validation and verified digital match pass.
          </p>
        </div>

        {error && (
          <div className="toast-alert error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleBookingSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Left Column: Form Fields */}
            <div>
              {/* 1. Court Selection */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '26px',
                  marginBottom: '26px'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Trophy size={20} className="text-accent" />
                  <span>1. Select Football Court</span>
                </h3>

                <div className="form-group">
                  <select
                    className="form-select"
                    value={selectedCourtId}
                    onChange={(e) => setSelectedCourtId(e.target.value)}
                  >
                    {courts.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} — ({c.categoryLabel}) — ₹{c.hourlyRate}/hr
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourt && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <img
                      src={selectedCourt.image}
                      alt={selectedCourt.name}
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <strong style={{ fontSize: '1.05rem', display: 'block' }}>{selectedCourt.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {selectedCourt.surface} • {selectedCourt.capacity}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Date & Time Slot Picker */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '26px',
                  marginBottom: '26px'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={20} className="text-accent" />
                  <span>2. Pick Match Date & Slot</span>
                </h3>

                <div className="form-group">
                  <label className="form-label">Match Date</label>
                  <input
                    type="date"
                    className="form-input"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Select Available Slot {startTime && <span className="text-accent">— Chosen: {startTime}</span>}
                  </label>

                  {loadingSlots ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Checking server slot availability...
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '10px',
                        marginTop: '10px'
                      }}
                    >
                      {slots.map((slot) => {
                        const isSelected = startTime === slot.startTime;
                        return (
                          <button
                            type="button"
                            key={slot.id}
                            disabled={!slot.isAvailable}
                            onClick={() => setStartTime(slot.startTime)}
                            style={{
                              padding: '12px 10px',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'center',
                              cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                              background: isSelected
                                ? 'var(--pitch-green)'
                                : slot.isAvailable
                                ? 'var(--bg-input)'
                                : 'rgba(255, 255, 255, 0.03)',
                              color: isSelected
                                ? '#050a10'
                                : slot.isAvailable
                                ? 'var(--text-primary)'
                                : 'rgba(255, 255, 255, 0.25)',
                              border: isSelected
                                ? '2px solid var(--pitch-green)'
                                : '1px solid var(--border-subtle)',
                              fontWeight: isSelected ? '700' : '500',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <div style={{ fontSize: '0.9rem' }}>{slot.startTime}</div>
                            <small
                              style={{
                                display: 'block',
                                fontSize: '0.7rem',
                                marginTop: '4px',
                                color: isSelected ? '#050a10' : slot.isAvailable ? 'var(--pitch-green)' : 'var(--accent-danger)'
                              }}
                            >
                              {slot.isAvailable ? 'AVAILABLE' : 'BOOKED'}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Duration and Squad Size */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <select
                      className="form-select"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      <option value={1}>1.0 Hour</option>
                      <option value={1.5}>1.5 Hours</option>
                      <option value={2}>2.0 Hours</option>
                      <option value={3}>3.0 Hours</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Squad Size</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-glass btn-sm"
                        onClick={() => setSquadSize(Math.max(4, squadSize - 1))}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        className="form-input text-center"
                        style={{ width: '80px' }}
                        value={squadSize}
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-glass btn-sm"
                        onClick={() => setSquadSize(Math.min(26, squadSize + 1))}
                      >
                        <Plus size={14} />
                      </button>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Players</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Complimentary Add-ons */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '26px'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} className="text-accent" />
                  <span>3. Match Add-Ons (Optional)</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ADD_ONS_LIST.map((addOn) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          background: isChecked ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-input)',
                          border: isChecked ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddOn(addOn)}
                            style={{ accentColor: 'var(--pitch-green)', width: '18px', height: '18px' }}
                          />
                          <span>{addOn.name}</span>
                        </div>
                        <strong className="text-accent">+₹{addOn.price}</strong>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Live Price Calculator & Payment Button */}
            <div>
              <div
                style={{
                  position: 'sticky',
                  top: '90px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h3 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>Booking Summary</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Court Rate:</span>
                    <strong>₹{hourlyRate} / hr</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                    <strong>{duration} Hour(s)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Turf Subtotal:</span>
                    <strong>₹{courtSubtotal}</strong>
                  </div>
                  {addOnsTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Add-ons Total:</span>
                      <strong className="text-accent">+₹{addOnsTotal}</strong>
                    </div>
                  )}

                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline'
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>Total Payable:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--pitch-green)' }}>
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <ShieldCheck size={20} className="text-accent" style={{ flexShrink: 0 }} />
                  <span>Razorpay test mode enabled. No real credit card charge will be made.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !startTime}
                  className="btn btn-accent btn-lg"
                  style={{ width: '100%' }}
                >
                  <CreditCard size={18} />
                  <span>{loading ? 'Confirming Slot...' : `Pay & Confirm (₹${grandTotal})`}</span>
                </button>

                {!startTime && (
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '10px' }}>
                    * Please choose an available time slot above to proceed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Digital Match Pass Modal */}
        {showPassModal && confirmedBooking && (
          <BookingTicket
            booking={confirmedBooking}
            onClose={() => {
              setShowPassModal(false);
              navigate('/my-bookings');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
