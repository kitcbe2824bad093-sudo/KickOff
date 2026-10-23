const Booking = require('../models/Booking');
const Court = require('../models/Court');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Get Admin Overview Statistics & Revenue Summaries
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalCourts = await Court.countDocuments();
    const activeCourts = await Court.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' });

    // Calculate total revenue from paid bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Court popularity breakdown
    const courtStats = await Booking.aggregate([
      {
        $group: {
          _id: '$courtName',
          bookingsCount: { $sum: 1 },
          courtRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] }
          }
        }
      },
      { $sort: { bookingsCount: -1 } }
    ]);

    // Recent 6 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('court', 'name category image')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalCourts,
        activeCourts,
        totalUsers,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue
      },
      courtStats,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin view with filtering and search)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, courtId, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.bookingStatus = status;
    }

    if (courtId && courtId !== 'all') {
      filter.court = courtId;
    }

    if (search && search.trim() !== '') {
      const regex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { bookingId: regex },
        { 'customerDetails.name': regex },
        { 'customerDetails.email': regex },
        { 'customerDetails.phone': regex },
        { courtName: regex }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('court', 'name category hourlyRate')
      .populate('user', 'name email role')
      .populate('payment')
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

// @desc    Update booking status or payment status (Admin action)
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus, cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (bookingStatus) {
      booking.bookingStatus = bookingStatus;
      if (bookingStatus === 'cancelled') {
        booking.cancelledAt = new Date();
        booking.cancellationReason = cancellationReason || 'Cancelled by admin';
      }
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers
};
