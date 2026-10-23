# ⚽ KickOff – Full-Stack Football Court Booking & Turf Management System

A production-ready full-stack MERN (MongoDB, Express.js, React, Node.js) web platform engineered for football turf operators, academy coordinators, and players. Features an athletic dark stadium design with electric neon pitch green accents (`#00e676`), real-time slot conflict prevention, Razorpay test payment processing, Google Maps arena navigation, Nodemailer match pass notifications, and role-based access control.

---

## 🌟 Key System Features

### 1. 🏟️ Athlete & Modern Sports UI/UX
- **Dark athletic stadium theme** styled with pure Vanilla CSS tokens, glassmorphism, glowing pitch borders, card lifts, and responsive layouts.
- **Micro-animations**: smooth transitions, pulsing availability badges, and interactive match pass tickets.
- **Mobile-First Responsive Design**: seamlessly renders on mobile phones, tablets, and wide desktop displays.

### 2. ⚡ Live Conflict-Free Slot Validation (Overlapping Booking Protection)
- Server-side mathematical interval validation (`startMinutes` to `endMinutes`) prevents double bookings under concurrent requests.
- Dynamic slot inspector categorized into **Morning**, **Afternoon**, and **Evening Floodlight** sessions.
- Automatically disables already-booked slots for any court on a selected match date.

### 3. 💳 Razorpay Online Payment Integration (Test Mode)
- Generates backend payment orders via Razorpay Orders API.
- Cryptographic **HMAC SHA-256 signature verification** on the server before confirming payment.
- Seamless developer simulation fallback for local evaluation if API credentials are not yet configured.
- Zero storage of credit card numbers or sensitive credentials.

### 4. 🗺️ Google Maps Arena Navigation
- Displays precise pitch coordinates (Latitude & Longitude) for each court.
- Interactive embed view with one-click **"Open in Google Maps"** driving directions.
- Reads API key safely from environment variables with fallback map support.

### 5. 📧 Automated Email Notifications (Nodemailer)
- **Booking Confirmation**: Rich HTML match pass with booking reference, timing, and pitch guidelines.
- **Payment Receipts**: Instant breakdown of transaction ID and amount paid.
- **Cancellation Alerts**: Automatic notification when a player or admin cancels a slot.
- Safe console logging fallback in development when SMTP is not configured.

### 6. 🛡️ Role-Based Authentication & Security
- Secure password hashing with **bcryptjs** (10 salt rounds).
- Stateless **JSON Web Tokens (JWT)** for API authorization with automatic session expiry handling.
- Distinct roles: `customer` (regular player), `student` (college discount eligibility), and `admin` (arena owner).

### 7. 👑 Comprehensive Admin Portal
- Real-time revenue metrics, total bookings counter, active courts count, and player directory.
- Revenue breakdown and popularity ranking per football court.
- **Court Management**: Add new football courts, update specs/pricing, and soft-delete/deactivate turfs.
- **Reservation Control**: Filter all bookings, review customer contact details, approve cancellations, and mark matches completed.

---

## 📁 Repository Structure

```text
KickOff/
├── frontend/                     # React + Vite Frontend Application
│   ├── public/
│   │   └── images/              # High-resolution turf photography
│   │       ├── hero.jpg
│   │       ├── turf-5aside.jpg
│   │       ├── turf-7aside.jpg
│   │       ├── turf-championship.jpg
│   │       └── turf-indoor.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Glassmorphic top navigation & user badge
│   │   │   ├── Footer.jsx       # Pitch hours, locations & quick links
│   │   │   ├── CourtCard.jsx    # Court cards with specs, pricing & CTA
│   │   │   ├── GoogleMapEmbed.jsx # Google Maps embed & directions link
│   │   │   ├── BookingTicket.jsx # Digital QR match pass modal with print
│   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   └── AdminRoute.jsx   # Admin role route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state & token management
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Hero section, search bar & featured turfs
│   │   │   ├── CourtsPage.jsx   # Filterable courts catalog with price sort
│   │   │   ├── CourtDetailsPage.jsx # Court specs, live slots & directions
│   │   │   ├── BookingPage.jsx  # Slot picker, live calculator & Razorpay
│   │   │   ├── MyBookingsPage.jsx # Match passes list & cancellation
│   │   │   ├── LoginPage.jsx    # Sign in with quick-fill demo buttons
│   │   │   ├── RegisterPage.jsx # Registration with role & position pick
│   │   │   ├── ProfilePage.jsx  # Player profile & position preferences
│   │   │   ├── ContactPage.jsx  # Inquiries form & complex map
│   │   │   └── AdminDashboardPage.jsx # Revenue analytics & court/booking CRUD
│   │   ├── services/
│   │   │   └── api.js           # REST API client with JWT interceptor
│   │   ├── App.jsx              # Client routing configuration
│   │   ├── main.jsx             # React DOM root
│   │   └── index.css            # Vanilla CSS design tokens & animations
│   ├── .env.example             # Frontend environment variables template
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express REST API Server
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── courtController.js   # Court CRUD & slot availability
│   │   ├── bookingController.js # Overlap checks, reservations & cancel
│   │   ├── paymentController.js # Razorpay order & signature verification
│   │   └── adminController.js   # Analytics stats, revenue & bookings
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect & role authorization
│   │   └── errorMiddleware.js   # Centralized error & 404 handler
│   ├── models/
│   │   ├── User.js              # User model with bcrypt pre-save
│   │   ├── Court.js             # Football court schema with coordinates
│   │   ├── Booking.js           # Reservation schema with minute intervals
│   │   └── Payment.js           # Razorpay transaction record
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courtRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── emailService.js      # Nodemailer HTML templates
│   ├── seed.js                  # Database seeder (Admin, Student, 4 Courts)
│   ├── server.js                # Express app entry point
│   ├── .env.example             # Backend environment template
│   └── package.json
│
├── .gitignore                   # Excludes node_modules, .env, and dist
├── package.json                 # Monorepo root runner scripts
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

Duplicate `backend/.env.example` to `backend/.env` and update your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Connection (MongoDB Local or Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/kickoff_db

# JWT Secret
JWT_SECRET=kickoff_super_secret_jwt_key_2026_dev_mode
JWT_EXPIRE=7d

# Razorpay Test Credentials (from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpayKeySecretHere

# Nodemailer / SMTP Credentials
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM=KickOff Arena <noreply@kickoffarena.com>
```

> **Note on Local Development**: If you do not have Razorpay or SMTP credentials right away, the backend automatically runs in simulated test mode and logs payment verifications and email messages cleanly to the console.

### Frontend (`frontend/.env`)

Duplicate `frontend/.env.example` to `frontend/.env`:

```env
# Backend API Base URL (default uses Vite proxy to port 5000)
VITE_API_BASE_URL=/api

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=

# Razorpay Test Key ID
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
```

---

## 🚀 Step-by-Step Installation & Quickstart

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **MongoDB**: Local MongoDB community service running (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 1. Install Dependencies
In the root directory, run:
```bash
# Install root, backend, and frontend dependencies in one command:
npm run install-all
```
*(Or navigate into `backend` and `frontend` separately and run `npm install` in each).*

### 2. Seed Sample Database
Populate initial admin, student player, and 4 football courts:
```bash
node backend/seed.js
```

### 3. Run Development Servers
From the root directory:
```bash
# Runs backend on :5000 and frontend on :5173 concurrently:
npm run dev
```

Or run them in separate terminals:
- **Backend**: `cd backend && npm run dev`
- **Frontend**: `cd frontend && npm run dev`

Open your web browser at: **`http://localhost:5173`**

---

## 🔑 Default Seeded Accounts

For testing and demonstration, the seeder creates the following accounts:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@kickoff.com` | `Admin@12345` | Full access to Admin Portal, court editing, booking status management, and revenue analytics |
| **Student / Player** | `student@kickoff.com` | `Student@12345` | Can book courts, make test payments, view match passes, and cancel slots |

*(Both accounts are accessible with one click on the Sign In page using the **Quick Fill** buttons!)*

---

## 📡 REST API Endpoints Specification

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new player or student account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `PUT` | `/api/auth/profile` | Private | Update name, phone, preferred position |

### Courts (`/api/courts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courts` | Public | List courts with category and search filter |
| `GET` | `/api/courts/:id` | Public | Single court specifications and coordinates |
| `GET` | `/api/courts/:id/availability?date=YYYY-MM-DD` | Public | Live slot availability for court on date |
| `POST` | `/api/courts` | Admin | Create new football court |
| `PUT` | `/api/courts/:id` | Admin | Update court specs or pricing |
| `DELETE` | `/api/courts/:id` | Admin | Delete or deactivate football court |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Create court booking with overlap validation |
| `GET` | `/api/bookings/my-bookings` | Private | User's match reservation history |
| `GET` | `/api/bookings/:id` | Private | View digital match pass details |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reservation & release slot back |

### Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-order` | Private | Create Razorpay order ID |
| `POST` | `/api/payments/verify` | Private | Verify HMAC signature & capture payment |

### Admin Dashboard (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Total revenue, bookings, court analytics |
| `GET` | `/api/admin/bookings` | Admin | Filter & search all customer bookings |
| `PUT` | `/api/admin/bookings/:id` | Admin | Change status (completed / cancelled) |
| `GET` | `/api/admin/users` | Admin | List all registered player accounts |

---

## 🌐 Production Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster on [cloud.mongodb.com](https://cloud.mongodb.com/).
2. In Network Access, add `0.0.0.0/0` (or your server's static IP).
3. Under Database Users, create a username and password.
4. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/kickoff_db?retryWrites=true&w=majority` and set as `MONGODB_URI` in production.

### 2. Node.js Backend Deployment (Render / Railway / AWS EC2)
1. Set the root directory or point build to the `backend/` folder.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`, `FRONTEND_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `SMTP_USER`, `SMTP_PASS`.

### 3. React Frontend Deployment (Vercel / Netlify)
1. Root directory: `frontend/`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`
   - `VITE_GOOGLE_MAPS_API_KEY`: Your production Google Maps Embed key
   - `VITE_RAZORPAY_KEY_ID`: Your production or test Razorpay Key ID
5. Add single-page application redirect rule (e.g. `/* /index.html 200` in `_redirects` or `vercel.json`).

---

## 🏆 Project Highlights for Academic Evaluation
- **End-to-End MERN Stack Architecture**: Clean separation between database schemas, REST controllers, and reactive frontend UI.
- **Robust Concurrent Slot Validation**: Server-enforced overlap detection ensuring no duplicate bookings can ever occur.
- **Fintech & Geolocation Integrations**: Razorpay cryptographic webhook-ready signature verification and Google Maps place embedding.
- **Zero Framework CSS**: Crafted using native CSS3 custom properties, CSS Grid, and responsive flex layouts without bloated third-party CSS frameworks.
