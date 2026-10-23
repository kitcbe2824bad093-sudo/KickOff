const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Court name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['5v5', '7v7', 'indoor', '11v11'],
      default: '5v5'
    },
    categoryLabel: {
      type: String,
      default: '5-a-Side AstroTurf'
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [100, 'Hourly rate must be at least ₹100']
    },
    currency: {
      type: String,
      default: '₹'
    },
    image: {
      type: String,
      required: [true, 'Court image URL is required'],
      default: '/images/turf-5aside.jpg'
    },
    gallery: {
      type: [String],
      default: []
    },
    badge: {
      type: String,
      default: 'Available'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 25
    },
    dimensions: {
      type: String,
      default: '30m × 20m'
    },
    surface: {
      type: String,
      default: 'FIFA Certified Monofilament Turf'
    },
    capacity: {
      type: String,
      default: '10 Players (5v5)'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    facilities: {
      type: [String],
      default: [
        '1000 Lux LED Floodlights',
        'Safety Net Enclosure',
        'Lockers & Changing Rooms',
        'Free Parking',
        'Complimentary Match Balls'
      ]
    },
    // Google Maps integration fields
    location: {
      address: {
        type: String,
        required: [true, 'Street address is required'],
        default: 'KickOff Sports Complex, Arena Road, Stadium District'
      },
      city: {
        type: String,
        default: 'Bangalore'
      },
      state: {
        type: String,
        default: 'Karnataka'
      },
      pincode: {
        type: String,
        default: '560001'
      },
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        default: 12.9716
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        default: 77.5946
      }
    },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '23:00' }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Court', courtSchema);
