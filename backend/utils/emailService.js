const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass }
    });
  }

  return transporter;
};

/**
 * Generic send email wrapper with development console fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailTransporter = getTransporter();
  const from = process.env.EMAIL_FROM || 'KickOff Arena <noreply@kickoffarena.com>';

  if (!mailTransporter) {
    console.log(`\n--- [EMAIL SERVICE (Dev Mode - No SMTP Credentials Configured)] ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${text || subject}`);
    console.log(`-------------------------------------------------------------------\n`);
    return { success: true, simulated: true };
  }

  try {
    const info = await mailTransporter.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html
    });
    console.log(`[KickOff Email] Sent email to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[KickOff Email Error] Could not send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 1. Booking Confirmation Email
 */
const sendBookingConfirmation = async (booking) => {
  const subject = `⚽ Booking Confirmed: ${booking.courtName} [${booking.bookingId}]`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0b111b; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto;">
      <div style="text-align: center; border-bottom: 2px solid #00e676; padding-bottom: 20px;">
        <h1 style="color: #00e676; margin: 0; font-size: 28px;">KickOff Arena</h1>
        <p style="color: #cbd5e1; margin-top: 5px;">Football Court Booking Confirmation</p>
      </div>

      <div style="padding: 20px 0;">
        <p style="font-size: 16px;">Hello <strong>${booking.customerDetails.name}</strong>,</p>
        <p style="color: #cbd5e1;">Your football court reservation has been successfully confirmed! Here are your match details:</p>

        <div style="background-color: #152033; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(0, 230, 118, 0.3);">
          <table style="width: 100%; border-collapse: collapse; color: #f8fafc;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Booking ID:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #00e676; text-align: right;">${booking.bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Court:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${booking.courtName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Match Date:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${booking.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Time Slot:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #00e676; text-align: right;">${booking.startTime} - ${booking.endTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Duration:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.duration} Hour(s)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Squad Size:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.customerDetails.squadSize} Players</td>
            </tr>
            <tr style="border-top: 1px solid #334155;">
              <td style="padding: 12px 0 4px 0; color: #cbd5e1; font-weight: bold;">Total Amount:</td>
              <td style="padding: 12px 0 4px 0; font-weight: bold; font-size: 18px; color: #00e676; text-align: right;">₹${booking.totalAmount}</td>
            </tr>
          </table>
        </div>

        <p style="color: #94a3b8; font-size: 13px;">
          📍 <strong>Entry Guidelines:</strong> Please arrive 15 minutes before your scheduled match. Proper turf shoes or flat trainers are required. Studs are strictly prohibited on synthetic grass.
        </p>
      </div>

      <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #64748b;">
        <p>© ${new Date().getFullYear()} KickOff Arena. All rights reserved.</p>
        <p>Arena Road, Stadium District, Bangalore | Contact: +91 98765 43210</p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: booking.customerDetails.email,
    subject,
    html,
    text: `Booking Confirmed! ID: ${booking.bookingId}, Court: ${booking.courtName}, Date: ${booking.date}, Slot: ${booking.startTime} - ${booking.endTime}`
  });
};

/**
 * 2. Payment Confirmation Email
 */
const sendPaymentConfirmation = async (booking, payment) => {
  const subject = `💳 Payment Received: ₹${payment.amount} for Booking ${booking.bookingId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0b111b; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto;">
      <h2 style="color: #00e676; margin: 0;">Payment Successful</h2>
      <p style="color: #cbd5e1;">Your payment of <strong>₹${payment.amount}</strong> has been successfully verified.</p>
      <div style="background-color: #152033; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${payment.razorpayPaymentId || 'DEMO_PAYMENT_TXN'}</p>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${payment.razorpayOrderId}</p>
        <p style="margin: 5px 0; color: #00e676;"><strong>Status:</strong> Completed (Paid)</p>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">Thank you for booking with KickOff Arena. See you on the pitch!</p>
    </div>
  `;

  return await sendEmail({
    to: booking.customerDetails.email,
    subject,
    html,
    text: `Payment of ₹${payment.amount} received for booking ${booking.bookingId}. Transaction ID: ${payment.razorpayPaymentId}`
  });
};

/**
 * 3. Booking Cancellation Email
 */
const sendCancellationNotification = async (booking, reason) => {
  const subject = `🚫 Booking Cancelled: [${booking.bookingId}] at KickOff Arena`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0b111b; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto;">
      <h2 style="color: #ff5252; margin: 0;">Booking Cancelled</h2>
      <p style="color: #cbd5e1;">Your reservation for <strong>${booking.courtName}</strong> on <strong>${booking.date}</strong> (${booking.startTime} - ${booking.endTime}) has been cancelled.</p>
      <div style="background-color: #152033; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff5252;">
        <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p style="margin: 5px 0;"><strong>Reason:</strong> ${reason || 'Cancelled by customer'}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> Slot released back to public availability</p>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">If you have any questions or require a reschedule, please contact our support team.</p>
    </div>
  `;

  return await sendEmail({
    to: booking.customerDetails.email,
    subject,
    html,
    text: `Booking ${booking.bookingId} has been cancelled. Slot ${booking.startTime} on ${booking.date} has been released.`
  });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendCancellationNotification
};
