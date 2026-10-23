const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Court = require('./models/Court');
const Booking = require('./models/Booking');

dotenv.config();

const courtsData = [
  {
    name: 'KickOff Astro Arena',
    slug: 'kickoff-astro-arena',
    category: '5v5',
    categoryLabel: '5-a-Side AstroTurf',
    hourlyRate: 1200,
    currency: '₹',
    image: '/images/turf-5aside.jpg',
    badge: 'Most Popular',
    rating: 4.9,
    reviewsCount: 184,
    dimensions: '30m × 20m',
    surface: '50mm Monofilament Synthetic Turf',
    capacity: '10 Players (5v5)',
    description: 'Enclosed arena with high-tension perimeter safety netting. Ideal for fast-paced 5v5 friendly matches, company games, and weekend shootouts.',
    facilities: [
      '1000 Lux LED Floodlights',
      'Safety Net Enclosure',
      'Lockers & Changing Rooms',
      'Complimentary Match Balls',
      'Free Vehicle Parking',
      'Drinking Water Fountain'
    ],
    location: {
      address: 'Plot 14, KickOff Sports Hub, 80 Feet Road, Koramangala 4th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      latitude: 12.9352,
      longitude: 77.6245
    },
    operatingHours: { open: '06:00', close: '23:00' },
    isActive: true
  },
  {
    name: 'Premier Stadium Pitch',
    slug: 'premier-stadium-pitch',
    category: '7v7',
    categoryLabel: '7-a-Side Pro Turf',
    hourlyRate: 1800,
    currency: '₹',
    image: '/images/turf-7aside.jpg',
    badge: 'Tournament Grade',
    rating: 4.8,
    reviewsCount: 142,
    dimensions: '55m × 35m',
    surface: 'FIFA Quality Certified Turf with Rubber Infill',
    capacity: '14 Players (7v7)',
    description: 'Spacious intermediate turf equipped with sheltered team dugouts and raised spectator benches. Perfect for corporate tournaments and youth academy training.',
    facilities: [
      'Broadcast-Grade Floodlights',
      'Sheltered Team Dugouts',
      'Spectator Seating (50 Pax)',
      'First Aid & Ice Baths',
      'Chilled Hydration Station',
      'Electronic Scoreboard'
    ],
    location: {
      address: 'KickOff Championship Park, Outer Ring Road, Bellandur',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560103',
      latitude: 12.9260,
      longitude: 77.6762
    },
    operatingHours: { open: '06:00', close: '23:00' },
    isActive: true
  },
  {
    name: 'Neon Futsal Dome',
    slug: 'neon-futsal-dome',
    category: 'indoor',
    categoryLabel: 'Indoor AC Futsal',
    hourlyRate: 2200,
    currency: '₹',
    image: '/images/turf-indoor.jpg',
    badge: 'Climate Controlled',
    rating: 5.0,
    reviewsCount: 96,
    dimensions: '40m × 20m',
    surface: 'Taraflex Shock-Absorbing Indoor Sports Floor',
    capacity: '12 Players (Indoor)',
    description: '100% weather-proof indoor futsal court with central air conditioning, electronic digital scoreboard, and high-impact acoustic sound system.',
    facilities: [
      'Central Air Conditioning',
      'Digital LED Scoreboard',
      'Acoustic Surround Sound',
      'VIP Player Lounge',
      'HD Goal Replay Camera',
      'Shower & Steam Facilities'
    ],
    location: {
      address: 'Level 2, Sports Galleria, Indiranagar 100ft Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      latitude: 12.9784,
      longitude: 77.6408
    },
    operatingHours: { open: '06:00', close: '23:00' },
    isActive: true
  },
  {
    name: 'Championship Grand Arena',
    slug: 'championship-grand-arena',
    category: '11v11',
    categoryLabel: '11-a-Side Regulation Pitch',
    hourlyRate: 3500,
    currency: '₹',
    image: '/images/turf-championship.jpg',
    badge: 'Full Stadium Pitch',
    rating: 4.9,
    reviewsCount: 210,
    dimensions: '105m × 68m (FIFA Standard)',
    surface: 'Hybrid Natural & Reinforced Synthetic Pitch',
    capacity: '22 Players (11v11)',
    description: 'Full regulation 11-a-side pitch with professional dugouts, referee tower, 250-seat grandstand, and 4K match recording capability.',
    facilities: [
      'Stadium 2000 Lux Floodlights',
      '250-Capacity Grandstand',
      'Referee & Official Dugouts',
      '4K Automated Match Camera',
      'Ambulance & Paramedic Bay',
      'Cafeteria & Sports Bar'
    ],
    location: {
      address: 'KickOff Olympic Complex, Sarjapur Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560035',
      latitude: 12.9105,
      longitude: 77.6850
    },
    operatingHours: { open: '06:00', close: '23:00' },
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kickoff_db';
    console.log(`[KickOff Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[KickOff Seed] Clearing existing sample records...');
    try {
      await mongoose.connection.db.dropCollection('users');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('courts');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('bookings');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('payments');
    } catch (e) {}

    console.log('[KickOff Seed] Creating default users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@kickoff.com',
      password: 'Admin@12345',
      role: 'admin',
      phone: '9876543210',
      preferredPosition: 'Forward'
    });

    const studentUser = await User.create({
      name: 'Cristiano Sharma',
      email: 'student@kickoff.com',
      password: 'Student@12345',
      role: 'student',
      phone: '9812345678',
      preferredPosition: 'Midfielder'
    });

    console.log(`[KickOff Seed] Admin user created: admin@kickoff.com / Admin@12345`);
    console.log(`[KickOff Seed] Student user created: student@kickoff.com / Student@12345`);

    console.log('[KickOff Seed] Inserting football courts...');
    const createdCourts = await Court.insertMany(courtsData);
    console.log(`[KickOff Seed] Inserted ${createdCourts.length} football courts.`);

    // Seed sample initial booking for demonstration
    const sampleDate = new Date();
    sampleDate.setDate(sampleDate.getDate() + 1);
    const dateStr = sampleDate.toISOString().split('T')[0];

    await Booking.create({
      bookingId: 'KO-2026-1001',
      user: studentUser._id,
      court: createdCourts[0]._id,
      courtName: createdCourts[0].name,
      customerDetails: {
        name: studentUser.name,
        email: studentUser.email,
        phone: studentUser.phone,
        squadSize: 10
      },
      date: dateStr,
      startTime: '07:00 PM',
      endTime: '09:00 PM',
      startMinutes: 1140,
      endMinutes: 1260,
      duration: 2,
      courtRate: createdCourts[0].hourlyRate,
      totalAmount: createdCourts[0].hourlyRate * 2,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Weekend friendly match with college squad'
    });

    console.log(`[KickOff Seed] Seeded sample confirmed booking: KO-2026-1001 on ${dateStr}`);
    console.log('[KickOff Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[KickOff Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();
