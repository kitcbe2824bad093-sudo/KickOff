const Court = require('../models/Court');
const Booking = require('../models/Booking');

// Standard slots generator helper from 06:00 AM to 11:00 PM (1-hour slots)
const STANDARD_SLOTS = [
  { id: 's-0600', startTime: '06:00 AM', endTime: '07:00 AM', startMinutes: 360, endMinutes: 420, session: 'Morning' },
  { id: 's-0700', startTime: '07:00 AM', endTime: '08:00 AM', startMinutes: 420, endMinutes: 480, session: 'Morning' },
  { id: 's-0800', startTime: '08:00 AM', endTime: '09:00 AM', startMinutes: 480, endMinutes: 540, session: 'Morning' },
  { id: 's-0900', startTime: '09:00 AM', endTime: '10:00 AM', startMinutes: 540, endMinutes: 600, session: 'Morning' },
  { id: 's-1000', startTime: '10:00 AM', endTime: '11:00 AM', startMinutes: 600, endMinutes: 660, session: 'Morning' },
  { id: 's-1100', startTime: '11:00 AM', endTime: '12:00 PM', startMinutes: 660, endMinutes: 720, session: 'Morning' },
  { id: 's-1400', startTime: '02:00 PM', endTime: '03:00 PM', startMinutes: 840, endMinutes: 900, session: 'Afternoon' },
  { id: 's-1500', startTime: '03:00 PM', endTime: '04:00 PM', startMinutes: 900, endMinutes: 960, session: 'Afternoon' },
  { id: 's-1600', startTime: '04:00 PM', endTime: '05:00 PM', startMinutes: 960, endMinutes: 1020, session: 'Afternoon' },
  { id: 's-1700', startTime: '05:00 PM', endTime: '06:00 PM', startMinutes: 1020, endMinutes: 1080, session: 'Evening Floodlights' },
  { id: 's-1800', startTime: '06:00 PM', endTime: '07:00 PM', startMinutes: 1080, endMinutes: 1140, session: 'Evening Floodlights' },
  { id: 's-1900', startTime: '07:00 PM', endTime: '08:00 PM', startMinutes: 1140, endMinutes: 1200, session: 'Evening Floodlights' },
  { id: 's-2000', startTime: '08:00 PM', endTime: '09:00 PM', startMinutes: 1200, endMinutes: 1260, session: 'Evening Floodlights' },
  { id: 's-2100', startTime: '09:00 PM', endTime: '10:00 PM', startMinutes: 1260, endMinutes: 1320, session: 'Evening Floodlights' },
  { id: 's-2200', startTime: '10:00 PM', endTime: '11:00 PM', startMinutes: 1320, endMinutes: 1380, session: 'Evening Floodlights' }
];

// @desc    Get all active courts with optional category and search filters
// @route   GET /api/courts
// @access  Public
const getCourts = async (req, res, next) => {
  try {
    const { category, search, activeOnly } = req.query;
    const query = {};

    if (activeOnly !== 'false') {
      query.isActive = true;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { surface: { $regex: search.trim(), $options: 'i' } },
        { 'location.city': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const courts = await Court.find(query).sort({ hourlyRate: 1 });

    res.json({
      success: true,
      count: courts.length,
      courts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single court details
// @route   GET /api/courts/:id
// @access  Public
const getCourtById = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Football court not found'
      });
    }

    res.json({
      success: true,
      court
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get slot availability for a court on a specific date
// @route   GET /api/courts/:id/availability?date=YYYY-MM-DD
// @access  Public
const getCourtAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid date parameter (YYYY-MM-DD)'
      });
    }

    const court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    // Find confirmed active bookings for this court on the given date
    const existingBookings = await Booking.find({
      court: id,
      date,
      bookingStatus: 'confirmed'
    }).select('startTime endTime startMinutes endMinutes bookingId customerDetails');

    // Check each standard slot against booked intervals
    const slots = STANDARD_SLOTS.map((slot) => {
      const isBooked = existingBookings.some((booking) => {
        // Slot overlaps if: slot.startMinutes < booking.endMinutes && slot.endMinutes > booking.startMinutes
        return slot.startMinutes < booking.endMinutes && slot.endMinutes > booking.startMinutes;
      });

      return {
        ...slot,
        isAvailable: !isBooked
      };
    });

    res.json({
      success: true,
      courtId: id,
      courtName: court.name,
      date,
      slots,
      bookedCount: existingBookings.length,
      availableCount: slots.filter((s) => s.isAvailable).length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new court (Admin only)
// @route   POST /api/courts
// @access  Private/Admin
const createCourt = async (req, res, next) => {
  try {
    const {
      name,
      category,
      categoryLabel,
      hourlyRate,
      image,
      dimensions,
      surface,
      capacity,
      description,
      facilities,
      location,
      badge
    } = req.body;

    const court = await Court.create({
      name,
      category,
      categoryLabel: categoryLabel || `${category} Arena`,
      hourlyRate,
      image: image || '/images/turf-5aside.jpg',
      dimensions: dimensions || '30m × 20m',
      surface: surface || 'FIFA Certified Turf',
      capacity: capacity || '10 Players',
      description,
      facilities: facilities || ['Floodlights', 'Safety Netting', 'Changing Rooms'],
      location: location || {
        address: 'KickOff Sports Complex, Arena Road',
        city: 'Bangalore',
        latitude: 12.9716,
        longitude: 77.5946
      },
      badge: badge || 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Football court created successfully',
      court
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update court (Admin only)
// @route   PUT /api/courts/:id
// @access  Private/Admin
const updateCourt = async (req, res, next) => {
  try {
    let court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    court = await Court.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Court updated successfully',
      court
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete court (Admin only)
// @route   DELETE /api/courts/:id
// @access  Private/Admin
const deleteCourt = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    // Also verify if there are upcoming active bookings
    const activeBookings = await Booking.countDocuments({
      court: req.params.id,
      bookingStatus: 'confirmed'
    });

    if (activeBookings > 0) {
      // Soft-delete: set isActive to false to prevent breaking active bookings
      court.isActive = false;
      await court.save();
      return res.json({
        success: true,
        message: `Court has ${activeBookings} active bookings. It has been deactivated instead of deleted to protect customer reservations.`
      });
    }

    await court.deleteOne();

    res.json({
      success: true,
      message: 'Court deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourts,
  getCourtById,
  getCourtAvailability,
  createCourt,
  updateCourt,
  deleteCourt
};
