const Booking = require('../models/Booking');
const Court = require('../models/Court');
const { sendBookingConfirmation, sendCancellationNotification } = require('../utils/emailService');

// Helper to convert time string (e.g. "07:00 PM" or "19:00") into minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : null;

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper to format minutes from midnight into 12-hour format "hh:mm AM/PM"
const formatMinutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)} ${period}`;
};

// Helper to generate unique Booking Reference ID (e.g. KO-2026-7841)
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KO-${year}-${randomSuffix}`;
};

// @desc    Create new court booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      courtId,
      date,
      startTime,
      duration = 1,
      customerDetails,
      addOns = [],
      notes
    } = req.body;

    // 1. Validation
    if (!courtId || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courtId, date (YYYY-MM-DD), and startTime.'
      });
    }

    // Verify Court
    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Selected football court is unavailable or does not exist.'
      });
    }

    // Calculate time intervals in minutes
    const startMinutes = parseTimeToMinutes(startTime);
    const durationHours = parseFloat(duration) || 1;
    const endMinutes = startMinutes + Math.round(durationHours * 60);
    const endTime = formatMinutesToTime(endMinutes);

    // 2. Overlap & Double-Booking Protection Check (Server-side validation)
    // Overlapping condition: (startMinutes < existing.endMinutes) && (endMinutes > existing.startMinutes)
    const conflictingBooking = await Booking.findOne({
      court: courtId,
      date,
      bookingStatus: 'confirmed',
      $and: [
        { startMinutes: { $lt: endMinutes } },
        { endMinutes: { $gt: startMinutes } }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: `This slot is already booked (${conflictingBooking.startTime} - ${conflictingBooking.endTime}). Please select an alternate time slot.`
      });
    }

    // 3. Price Calculation (Server-Side)
    const courtRate = court.hourlyRate;
    const addOnsTotal = addOns.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const totalAmount = Math.round(courtRate * durationHours + addOnsTotal);

    // Customer details
    const customer = {
      name: customerDetails?.name || req.user.name,
      email: customerDetails?.email || req.user.email,
      phone: customerDetails?.phone || req.user.phone || '',
      squadSize: customerDetails?.squadSize || 10
    };

    let bookingId = generateBookingId();
    // Ensure uniqueness
    while (await Booking.findOne({ bookingId })) {
      bookingId = generateBookingId();
    }

    // 4. Create Booking
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      court: court._id,
      courtName: court.name,
      customerDetails: customer,
      date,
      startTime,
      endTime,
      startMinutes,
      endMinutes,
      duration: durationHours,
      addOns,
      courtRate,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'pending',
      notes: notes || ''
    });

    // 5. Send Email Confirmation in background (non-blocking)
    sendBookingConfirmation(booking).catch((err) =>
      console.error('[Email Notification Error]:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Court booking created successfully!',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('court', 'name category image location hourlyRate')
      .populate('payment', 'razorpayPaymentId status method')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID or reference bookingId
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support either Mongo ObjectId or bookingId string like "KO-2026-1234"
    const query = id.startsWith('KO-') ? { bookingId: id } : { _id: id };

    const booking = await Booking.findOne(query)
      .populate('court', 'name category image location facilities')
      .populate('payment')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure only booking owner or admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this booking.'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking & release slot
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const query = id.startsWith('KO-') ? { bookingId: id } : { _id: id };
    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure only booking owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to cancel this booking.'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.'
      });
    }

    // Update status to release slot
    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by customer';
    booking.cancelledAt = new Date();

    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();

    // Send cancellation email in background
    sendCancellationNotification(booking, booking.cancellationReason).catch((err) =>
      console.error('[Email Cancellation Error]:', err.message)
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully. The slot has been released back to the schedule.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
};
