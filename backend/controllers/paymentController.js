const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendPaymentConfirmation } = require('../utils/emailService');

// Initialize Razorpay instance if keys are provided
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret && key_id !== 'rzp_test_placeholder') {
    return new Razorpay({
      key_id,
      key_secret
    });
  }
  return null;
};

// @desc    Create Razorpay Payment Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid booking ID.'
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for.'
      });
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const receipt = `rcpt_${booking.bookingId}_${Date.now().toString().slice(-4)}`;

    const razorpay = getRazorpayInstance();

    let order;
    if (razorpay) {
      // Real Razorpay API Order Creation (Test/Live mode)
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          bookingId: booking.bookingId,
          courtName: booking.courtName,
          customerName: booking.customerDetails.name
        }
      };
      order = await razorpay.orders.create(options);
    } else {
      // Development Simulated Order for testing without active Razorpay account
      order = {
        id: `order_dev_${Date.now()}`,
        entity: 'order',
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        status: 'created'
      };
      console.log(`[KickOff Payment] Created simulated Razorpay test order: ${order.id}`);
    }

    // Save pending payment record in database
    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      currency: 'INR',
      razorpayOrderId: order.id,
      status: 'created',
      receipt
    });

    // Link payment to booking
    booking.payment = payment._id;
    await booking.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: booking.totalAmount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        courtName: booking.courtName,
        customerDetails: booking.customerDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingId,
      isSimulated
    } = req.body;

    if (!razorpayOrderId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification details.'
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found for this order.'
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    let isValid = false;

    if (key_secret && key_secret !== 'placeholder_secret' && !isSimulated) {
      // Validate real Razorpay cryptographic signature
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isValid = expectedSignature === razorpaySignature;
    } else {
      // Allow simulated test confirmation for development/examiner demo
      isValid = true;
    }

    if (!isValid) {
      payment.status = 'failed';
      payment.errorDescription = 'Signature verification failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature.'
      });
    }

    // Update payment record to captured
    payment.razorpayPaymentId = razorpayPaymentId || `pay_simulated_${Date.now()}`;
    payment.razorpaySignature = razorpaySignature || 'simulated_sig';
    payment.status = 'captured';
    await payment.save();

    // Update booking payment status to paid
    booking.paymentStatus = 'paid';
    await booking.save();

    // Send confirmation email
    sendPaymentConfirmation(booking, payment).catch((err) =>
      console.error('[Email Payment Error]:', err.message)
    );

    res.json({
      success: true,
      message: 'Payment verified successfully! Your match pass is confirmed.',
      payment: {
        paymentId: payment.razorpayPaymentId,
        orderId: payment.razorpayOrderId,
        amount: payment.amount,
        status: payment.status
      },
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
