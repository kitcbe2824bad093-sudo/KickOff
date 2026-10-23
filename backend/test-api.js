const http = require('http');

const PORT = 5000;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.body ? JSON.stringify(options.body) : null;
    const reqOptions = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING KICKOFF FULL-STACK API TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.body.status === 'online', 'Health check responds with 200 and online status');

    // 2. Fetch courts
    const courtsRes = await request('/api/courts');
    assert(courtsRes.status === 200 && courtsRes.body.count >= 4, `Fetch courts returns ${courtsRes.body?.count} courts`);

    const court = courtsRes.body.courts[0];
    assert(court && court.name && court.hourlyRate > 0, `Court '${court.name}' has valid pricing (₹${court.hourlyRate}/hr)`);
    assert(court.location && court.location.latitude && court.location.longitude, `Court has Google Maps coordinates (${court.location?.latitude}, ${court.location?.longitude})`);

    // 3. User Login (Seeded Student Player)
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'student@kickoff.com', password: 'Student@12345' }
    });
    assert(loginRes.status === 200 && loginRes.body.token, 'Student login succeeds with valid JWT token');
    const studentToken = loginRes.body.token;

    // 4. Admin Login
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@kickoff.com', password: 'Admin@12345' }
    });
    assert(adminLoginRes.status === 200 && adminLoginRes.body.user.role === 'admin', 'Admin login succeeds with admin privileges');
    const adminToken = adminLoginRes.body.token;

    // 5. Slot Availability
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const availRes = await request(`/api/courts/${court._id}/availability?date=${dateStr}`);
    assert(availRes.status === 200 && Array.isArray(availRes.body.slots), `Slot availability check returns ${availRes.body.slots?.length} slots for date ${dateStr}`);

    // 6. Create a Booking
    const bookingRes = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        courtId: court._id,
        date: dateStr,
        startTime: '06:00 PM',
        duration: 1,
        squadSize: 10,
        customerDetails: {
          name: 'Cristiano Sharma',
          email: 'student@kickoff.com',
          phone: '9876543210',
          squadSize: 10
        }
      }
    });
    assert(bookingRes.status === 201 && bookingRes.body.booking?.bookingId, `Booking created successfully with reference ID ${bookingRes.body.booking?.bookingId}`);
    const newBooking = bookingRes.body.booking;

    // 7. OVERLAP PREVENTION TEST (Critical requirement)
    // Attempting to book the SAME court, date, and time slot MUST be rejected with 409 Conflict
    const duplicateRes = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        courtId: court._id,
        date: dateStr,
        startTime: '06:00 PM',
        duration: 1,
        squadSize: 8
      }
    });
    assert(
      duplicateRes.status === 409,
      `Double-booking overlap protection: Duplicate slot booking rejected with HTTP 409 Conflict (${duplicateRes.body?.message})`
    );

    // 8. Razorpay Payment Order
    const orderRes = await request('/api/payments/create-order', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { bookingId: newBooking._id }
    });
    assert(orderRes.status === 200 && orderRes.body.orderId, `Razorpay payment order generated (Order ID: ${orderRes.body.orderId})`);

    // 9. Payment Verification
    const verifyRes = await request('/api/payments/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        razorpayOrderId: orderRes.body.orderId,
        razorpayPaymentId: 'pay_test_suite_123',
        razorpaySignature: 'simulated_sig',
        bookingId: newBooking._id,
        isSimulated: true
      }
    });
    assert(verifyRes.status === 200 && verifyRes.body.booking?.paymentStatus === 'paid', 'Payment signature verified and booking marked PAID');

    // 10. Admin Stats
    const adminStatsRes = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      adminStatsRes.status === 200 && adminStatsRes.body.stats?.totalBookings > 0,
      `Admin dashboard metrics active (Revenue: ₹${adminStatsRes.body.stats?.totalRevenue}, Bookings: ${adminStatsRes.body.stats?.totalBookings})`
    );

    console.log('\n======================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('Test execution error:', err.message);
  }
}

runTests();
