/**
 * ==============================================================================
 * KICKOFF - Football Court Registration & Booking System
 * Script: Core Client-Side Logic, State Management & LocalStorage Persistence
 * 
 * College Mini-Project Architecture:
 * - HTML, CSS & Vanilla JavaScript modular structure
 * - Built-in Backend Abstraction Layer (Node.js / Express / MongoDB ready)
 * ==============================================================================
 */

// ==============================================================================
// 1. DATA MODELS & CONFIGURATION
// ==============================================================================

/**
 * Football Courts Catalog
 * In a full-stack version, this would be fetched from: GET /api/courts
 */
const COURTS_DATA = [
  {
    id: 'court-5v5',
    name: 'KickOff Astro Arena',
    category: '5v5',
    categoryLabel: '5-a-Side AstroTurf',
    hourlyRate: 1200,
    currency: '₹',
    image: 'assets/images/turf-5aside.jpg',
    badge: 'Most Popular',
    rating: 4.9,
    reviewsCount: 184,
    dimensions: '30m × 20m',
    surface: '50mm Monofilament Synthetic Grass',
    capacity: '10 Players (5v5)',
    description: 'Enclosed arena with high-tension perimeter safety netting. Ideal for fast-paced 5v5 friendly matches, company games, and weekend shootouts.',
    facilities: [
      '1000 Lux LED Floodlights',
      'Safety Net Enclosure',
      'Lockers & Changing Rooms',
      'Complimentary Match Balls',
      'Free Vehicle Parking'
    ]
  },
  {
    id: 'court-7v7',
    name: 'Premier Stadium Pitch',
    category: '7v7',
    categoryLabel: '7-a-Side Pro Turf',
    hourlyRate: 1800,
    currency: '₹',
    image: 'assets/images/turf-7aside.jpg',
    badge: 'Tournament Grade',
    rating: 4.8,
    reviewsCount: 142,
    dimensions: '55m × 35m',
    surface: 'FIFA Quality Certified Turf',
    capacity: '14 Players (7v7)',
    description: 'Spacious intermediate turf equipped with sheltered team dugouts and raised spectator benches. Perfect for league matches and academy training.',
    facilities: [
      'Broadcast-Grade Floodlights',
      'Sheltered Team Dugouts',
      'Spectator Seating (50 Pax)',
      'First Aid & Ice Baths',
      'Chilled Hydration Station'
    ]
  },
  {
    id: 'court-indoor',
    name: 'Neon Futsal Dome',
    category: 'indoor',
    categoryLabel: 'Indoor AC Futsal',
    hourlyRate: 2200,
    currency: '₹',
    image: 'assets/images/turf-indoor.jpg',
    badge: 'Climate Controlled',
    rating: 5.0,
    reviewsCount: 96,
    dimensions: '40m × 20m',
    surface: 'Taraflex Shock-Absorbing Sports Floor',
    capacity: '12 Players (Indoor)',
    description: '100% weather-proof indoor futsal court with central air conditioning, electronic digital scoreboard, and high-impact sound system.',
    facilities: [
      'Central Air Conditioning',
      'Digital LED Scoreboard',
      'Acoustic Surround Audio',
      'VIP Player Lounge',
      'HD Goal Replay Camera'
    ]
  },
  {
    id: 'court-11v11',
    name: 'Championship Grand Arena',
    category: '11v11',
    categoryLabel: '11-a-Side Regulation Pitch',
    hourlyRate: 3500,
    currency: '₹',
    image: 'assets/images/turf-championship.jpg',
    badge: 'Full Stadium Pitch',
    rating: 4.9,
    reviewsCount: 210,
    dimensions: '105m × 68m',
    surface: 'FIFA Quality Pro Hybrid Turf',
    capacity: '26 Players (11v11)',
    description: 'Full regulation size 11-a-side pitch complete with grandstand seating for 200+ supporters, four team dressing rooms, and match official rooms.',
    facilities: [
      'FIFA Regulation Goalposts',
      '4 Team Locker Rooms',
      'Match Commentary Booth',
      '200+ Grandstand Seats',
      'Ambulance Bay & Physio Room'
    ]
  }
];

/**
 * Standard Available Court Time Slots
 */
const TIME_SLOTS = {
  morning: [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM'
  ],
  afternoon: [
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
  ],
  evening: [
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
    '10:00 PM - 11:00 PM'
  ]
};

// Storage Key for LocalStorage
const STORAGE_KEY = 'kickoff_football_bookings_v1';

// ==============================================================================
// 2. BACKEND INTEGRATION LAYER (Node.js / Express / MongoDB Ready)
// ==============================================================================
/**
 * In a production or full-stack mini-project submission:
 * - Replace LocalStorage calls below with fetch() or axios requests
 *   e.g., fetch('/api/bookings', { method: 'POST', body: JSON.stringify(booking) })
 * - Mongoose Schema Example:
 *     const BookingSchema = new mongoose.Schema({
 *       bookingId: { type: String, required: true, unique: true },
 *       fullName: String,
 *       phoneNumber: String,
 *       emailAddress: String,
 *       numberOfPlayers: Number,
 *       courtId: String,
 *       courtName: String,
 *       bookingDate: String,
 *       timeSlot: String,
 *       duration: Number,
 *       totalAmount: Number,
 *       status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
 *       createdAt: { type: Date, default: Date.now }
 *     });
 */
const BookingStorage = {
  // Retrieve all bookings from LocalStorage
  getAllBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error reading bookings from localStorage:', err);
      return [];
    }
  },

  // Save bookings array to LocalStorage
  saveAllBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (err) {
      console.error('Error saving bookings to localStorage:', err);
    }
  },

  // Add a new booking
  addBooking(booking) {
    const bookings = this.getAllBookings();
    bookings.unshift(booking); // newest first
    this.saveAllBookings(bookings);
    return booking;
  },

  // Cancel an existing booking by booking ID
  cancelBooking(bookingId) {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);
    if (index !== -1) {
      bookings[index].status = 'Cancelled';
      bookings[index].cancelledAt = new Date().toISOString();
      this.saveAllBookings(bookings);
      return true;
    }
    return false;
  },

  // Seed initial sample demo data if storage is completely empty
  seedInitialDataIfEmpty() {
    const existing = this.getAllBookings();
    if (existing.length === 0) {
      const todayStr = getTodayDateString();
      const sampleBookings = [
        {
          bookingId: 'KO-2026-1084',
          fullName: 'Arjun Das',
          phoneNumber: '9876543210',
          emailAddress: 'arjun.das@example.com',
          numberOfPlayers: 10,
          courtId: 'court-5v5',
          courtName: 'KickOff Astro Arena',
          courtCategory: '5-a-Side AstroTurf',
          courtImage: 'assets/images/turf-5aside.jpg',
          bookingDate: todayStr,
          timeSlot: '07:00 PM - 08:00 PM',
          duration: 2,
          hourlyRate: 1200,
          addonsTotal: 0,
          totalAmount: 2400,
          status: 'Confirmed',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          bookingId: 'KO-2026-0922',
          fullName: 'Vikram Menon',
          phoneNumber: '9123456780',
          emailAddress: 'vikram.fc@example.com',
          numberOfPlayers: 14,
          courtId: 'court-7v7',
          courtName: 'Premier Stadium Pitch',
          courtCategory: '7-a-Side Pro Turf',
          courtImage: 'assets/images/turf-7aside.jpg',
          bookingDate: todayStr,
          timeSlot: '08:00 PM - 09:00 PM',
          duration: 1.5,
          hourlyRate: 1800,
          addonsTotal: 300,
          totalAmount: 3000,
          status: 'Confirmed',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      this.saveAllBookings(sampleBookings);
    }
  }
};

// ==============================================================================
// 3. HELPER UTILITIES
// ==============================================================================

/**
 * Returns today's date in YYYY-MM-DD format
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD date string to readable format e.g. "Friday, 24 Oct 2026"
 */
function formatReadableDate(dateStr) {
  if (!dateStr) return 'Not selected';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Currency formatter
 */
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Shows custom floating toast message
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <div class="toast-msg">${message}</div>
  `;

  container.appendChild(toast);

  // Trigger smooth entrance animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Automatically dismiss after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// ==============================================================================
// 4. APPLICATION CONTROLLER
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize local demo storage
  BookingStorage.seedInitialDataIfEmpty();

  // 2. Initialize UI components
  initNavbar();
  initDateConstraints();
  renderCourtCards('all');
  populateCourtSelectOptions();
  initCourtCategoryFilters();
  initFormInteractions();
  initTimeSlotPicker();
  initBookingsPortal();
  initModals();
  initContactForm();

  // 3. Set default state for booking form
  setDefaultBookingFormState();

  // 4. Update UI summaries & counts
  updateMyBookingsView();
  updateLiveBookingSummary();
});

// ------------------------------------------------------------------------------
// Navigation Bar & Scroll Handling
// ------------------------------------------------------------------------------
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const announcementBar = document.getElementById('announcementBar');
  const closeAnnouncement = document.getElementById('closeAnnouncement');

  // Dismiss announcement banner
  if (closeAnnouncement && announcementBar) {
    closeAnnouncement.addEventListener('click', () => {
      announcementBar.style.display = 'none';
    });
  }

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile navigation hamburger toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section spy
  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// ------------------------------------------------------------------------------
// Date Constraints: Prevent past dates
// ------------------------------------------------------------------------------
function initDateConstraints() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;

  const today = getTodayDateString();
  dateInput.min = today;

  // Max booking date: 60 days ahead
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxYear = maxDate.getFullYear();
  const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
  const maxDay = String(maxDate.getDate()).padStart(2, '0');
  dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;

  // Default to today
  dateInput.value = today;

  // On date change, refresh available time slots and live summary
  dateInput.addEventListener('change', () => {
    // Validate not in past
    if (dateInput.value < today) {
      dateInput.value = today;
      showToast('Past dates cannot be selected. Reset to today.', 'warning');
    }
    clearError('dateError');
    refreshAvailableTimeSlots();
    updateLiveBookingSummary();
  });
}

// ------------------------------------------------------------------------------
// Render Court Cards Dynamically
// ------------------------------------------------------------------------------
function renderCourtCards(filter = 'all') {
  const container = document.getElementById('courtsGrid');
  if (!container) return;

  const filteredCourts = filter === 'all' 
    ? COURTS_DATA 
    : COURTS_DATA.filter(c => c.category === filter);

  if (filteredCourts.length === 0) {
    container.innerHTML = `<p class="text-center" style="grid-column: 1/-1; color: var(--text-muted); padding: 3rem;">No football courts found in this category.</p>`;
    return;
  }

  container.innerHTML = filteredCourts.map(court => `
    <article class="court-card" data-category="${court.category}">
      <div class="court-img-wrap">
        <img src="${court.image}" alt="${court.name}" class="court-img" loading="lazy">
        <span class="court-badge-tag">${court.badge}</span>
        <div class="court-price-pill">
          <span class="price-currency">${formatCurrency(court.hourlyRate)}</span>
          <span class="price-unit">/ hour</span>
        </div>
      </div>

      <div class="court-body">
        <div class="court-header-info">
          <h3 class="court-name">${court.name}</h3>
          <div class="court-rating" title="Player rating">
            <i class="fa-solid fa-star"></i>
            <span>${court.rating}</span>
          </div>
        </div>

        <p class="court-desc">${court.description}</p>

        <div class="court-specs-list">
          <div class="spec-item"><i class="fa-solid fa-ruler-combined"></i> ${court.dimensions}</div>
          <div class="spec-item"><i class="fa-solid fa-users"></i> ${court.capacity}</div>
          <div class="spec-item"><i class="fa-solid fa-shield"></i> ${court.categoryLabel}</div>
          <div class="spec-item"><i class="fa-solid fa-circle-check"></i> Monofilament Turf</div>
        </div>

        <div class="facilities-title"><i class="fa-solid fa-list-check"></i> Court Facilities:</div>
        <div class="facility-chips">
          ${court.facilities.map(f => `<span class="facility-chip"><i class="fa-solid fa-check"></i> ${f}</span>`).join('')}
        </div>

        <div class="court-card-footer">
          <button class="btn btn-accent btn-block select-court-btn" data-court-id="${court.id}">
            <i class="fa-solid fa-calendar-check"></i> Book This Court
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Attach click listener to "Book This Court" buttons
  const selectBtns = container.querySelectorAll('.select-court-btn');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courtId = btn.getAttribute('data-court-id');
      selectCourtAndScrollToBooking(courtId);
    });
  });
}

// ------------------------------------------------------------------------------
// Category Filter Tabs
// ------------------------------------------------------------------------------
function initCourtCategoryFilters() {
  const tabsContainer = document.getElementById('courtFilterTabs');
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('.filter-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      renderCourtCards(filter);
    });
  });
}

// ------------------------------------------------------------------------------
// Populate Court Select Dropdown
// ------------------------------------------------------------------------------
function populateCourtSelectOptions() {
  const courtSelect = document.getElementById('courtSelect');
  if (!courtSelect) return;

  courtSelect.innerHTML = `<option value="">-- Choose a Court --</option>` +
    COURTS_DATA.map(court => `
      <option value="${court.id}">
        ${court.name} (${court.categoryLabel}) — ${formatCurrency(court.hourlyRate)}/hr
      </option>
    `).join('');

  courtSelect.addEventListener('change', () => {
    clearError('courtError');
    updateCourtRateDisplay();
    refreshAvailableTimeSlots();
    updateLiveBookingSummary();
  });
}

/**
 * Handles selecting a court from cards and smooth scrolling to form
 */
function selectCourtAndScrollToBooking(courtId) {
  const courtSelect = document.getElementById('courtSelect');
  if (courtSelect) {
    courtSelect.value = courtId;
    clearError('courtError');
    updateCourtRateDisplay();
    refreshAvailableTimeSlots();
    updateLiveBookingSummary();
  }

  // Smooth scroll to booking section
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }

  const court = COURTS_DATA.find(c => c.id === courtId);
  if (court) {
    showToast(`Selected "${court.name}". Choose your date and time slot!`, 'info');
  }
}

// ------------------------------------------------------------------------------
// Rate Pill Display
// ------------------------------------------------------------------------------
function updateCourtRateDisplay() {
  const courtSelect = document.getElementById('courtSelect');
  const rateValueEl = document.getElementById('currentRateValue');
  if (!courtSelect || !rateValueEl) return;

  const selectedId = courtSelect.value;
  const court = COURTS_DATA.find(c => c.id === selectedId);

  if (court) {
    rateValueEl.textContent = `${formatCurrency(court.hourlyRate)} / hr`;
  } else {
    rateValueEl.textContent = 'Select Court';
  }
}

// ------------------------------------------------------------------------------
// Time Slots System & Availability Checker
// ------------------------------------------------------------------------------
function initTimeSlotPicker() {
  refreshAvailableTimeSlots();
}

/**
 * Checks existing confirmed bookings for the selected court & date to mark slots as booked
 */
function refreshAvailableTimeSlots() {
  const courtSelect = document.getElementById('courtSelect');
  const dateInput = document.getElementById('bookingDate');
  const hiddenSlotInput = document.getElementById('selectedTimeSlot');

  const selectedCourtId = courtSelect ? courtSelect.value : '';
  const selectedDate = dateInput ? dateInput.value : '';

  // Get active confirmed bookings for court + date
  const allBookings = BookingStorage.getAllBookings();
  const bookedSlotsSet = new Set();

  allBookings.forEach(booking => {
    if (booking.status === 'Confirmed' &&
        booking.courtId === selectedCourtId &&
        booking.bookingDate === selectedDate) {
      bookedSlotsSet.add(booking.timeSlot);
    }
  });

  // Render each period
  renderSlotPeriodGroup('morningSlotsGrid', TIME_SLOTS.morning, bookedSlotsSet);
  renderSlotPeriodGroup('afternoonSlotsGrid', TIME_SLOTS.afternoon, bookedSlotsSet);
  renderSlotPeriodGroup('eveningSlotsGrid', TIME_SLOTS.evening, bookedSlotsSet);

  // If previously selected slot is now booked or invalid, reset it
  if (hiddenSlotInput && bookedSlotsSet.has(hiddenSlotInput.value)) {
    hiddenSlotInput.value = '';
    updateLiveBookingSummary();
  }
}

function renderSlotPeriodGroup(containerId, slotsList, bookedSet) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const hiddenSlotInput = document.getElementById('selectedTimeSlot');
  const currentSelected = hiddenSlotInput ? hiddenSlotInput.value : '';

  container.innerHTML = slotsList.map(slot => {
    const isBooked = bookedSet.has(slot);
    const isSelected = !isBooked && currentSelected === slot;

    let classes = 'slot-btn';
    let tag = 'Available';

    if (isBooked) {
      classes += ' booked';
      tag = 'Booked';
    } else if (isSelected) {
      classes += ' selected';
      tag = 'Selected';
    }

    return `
      <button type="button" 
              class="${classes}" 
              data-slot="${slot}" 
              ${isBooked ? 'disabled aria-disabled="true"' : ''}
              title="${isBooked ? 'Slot already reserved' : 'Click to select slot'}">
        <span>${slot}</span>
        <span class="slot-tag">${tag}</span>
      </button>
    `;
  }).join('');

  // Attach slot click listener
  const slotButtons = container.querySelectorAll('.slot-btn:not(.booked)');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const slotVal = btn.getAttribute('data-slot');
      selectTimeSlot(slotVal);
    });
  });
}

function selectTimeSlot(slotValue) {
  const hiddenSlotInput = document.getElementById('selectedTimeSlot');
  if (hiddenSlotInput) {
    hiddenSlotInput.value = slotValue;
  }
  clearError('slotError');

  // Update visual state across all 3 grid groups
  const allSlotBtns = document.querySelectorAll('.slot-btn');
  allSlotBtns.forEach(btn => {
    if (btn.classList.contains('booked')) return;
    const btnSlot = btn.getAttribute('data-slot');
    const tag = btn.querySelector('.slot-tag');
    if (btnSlot === slotValue) {
      btn.classList.add('selected');
      if (tag) tag.textContent = 'Selected';
    } else {
      btn.classList.remove('selected');
      if (tag) tag.textContent = 'Available';
    }
  });

  updateLiveBookingSummary();
}

// ------------------------------------------------------------------------------
// Form Interactions & Validation
// ------------------------------------------------------------------------------
function initFormInteractions() {
  const form = document.getElementById('courtBookingForm');
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const emailInput = document.getElementById('emailAddress');
  const playersInput = document.getElementById('numberOfPlayers');
  const durationSelect = document.getElementById('bookingDuration');
  const quickFillBtn = document.getElementById('quickFillDemoBtn');

  // Number Stepper buttons
  const decreaseBtn = document.getElementById('decreasePlayers');
  const increaseBtn = document.getElementById('increasePlayers');

  if (decreaseBtn && playersInput) {
    decreaseBtn.addEventListener('click', () => {
      let val = parseInt(playersInput.value, 10) || 10;
      if (val > 2) {
        playersInput.value = val - 1;
        updateLiveBookingSummary();
      }
    });
  }

  if (increaseBtn && playersInput) {
    increaseBtn.addEventListener('click', () => {
      let val = parseInt(playersInput.value, 10) || 10;
      if (val < 30) {
        playersInput.value = val + 1;
        updateLiveBookingSummary();
      }
    });
  }

  // Quick fill demo button for college examiners and review
  if (quickFillBtn) {
    quickFillBtn.addEventListener('click', () => {
      if (nameInput) nameInput.value = 'Sunil Chhetri';
      if (phoneInput) phoneInput.value = '9876543210';
      if (emailInput) emailInput.value = 'sunil.captain@gmail.com';
      if (playersInput) playersInput.value = '10';

      const courtSelect = document.getElementById('courtSelect');
      if (courtSelect && !courtSelect.value) {
        courtSelect.value = 'court-5v5';
        updateCourtRateDisplay();
      }

      refreshAvailableTimeSlots();
      // Select first available evening slot
      const firstAvailableBtn = document.querySelector('.slot-btn:not(.booked)');
      if (firstAvailableBtn) {
        selectTimeSlot(firstAvailableBtn.getAttribute('data-slot'));
      }

      updateLiveBookingSummary();
      showToast('Form auto-filled with demo details!', 'info');
    });
  }

  // Input listeners for live updates and error clearing
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      clearError('nameError');
      updateLiveBookingSummary();
    });
  }

  if (phoneInput) {
    // Only allow numbers
    phoneInput.addEventListener('input', (e) => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '');
      clearError('phoneError');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearError('emailError');
    });
  }

  if (playersInput) {
    playersInput.addEventListener('input', () => {
      clearError('playersError');
      updateLiveBookingSummary();
    });
  }

  if (durationSelect) {
    durationSelect.addEventListener('change', () => {
      updateLiveBookingSummary();
    });
  }

  // Addon checkboxes listeners
  const addonCheckboxes = document.querySelectorAll('.addons-grid input[type="checkbox"]');
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateLiveBookingSummary();
    });
  });

  // Booking Form Submission
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }
}

function clearError(errorElementId) {
  const el = document.getElementById(errorElementId);
  if (el) el.textContent = '';
}

function setError(errorElementId, message) {
  const el = document.getElementById(errorElementId);
  if (el) el.textContent = message;
}

/**
 * Validates form inputs before submission
 */
function validateBookingForm() {
  let isValid = true;

  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const emailInput = document.getElementById('emailAddress');
  const courtSelect = document.getElementById('courtSelect');
  const dateInput = document.getElementById('bookingDate');
  const slotInput = document.getElementById('selectedTimeSlot');
  const playersInput = document.getElementById('numberOfPlayers');

  // Name validation
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    setError('nameError', 'Please enter your full name (minimum 3 characters)');
    isValid = false;
  } else {
    clearError('nameError');
  }

  // Phone validation (10 digits)
  const phoneClean = phoneInput.value.trim();
  if (!/^\d{10}$/.test(phoneClean)) {
    setError('phoneError', 'Please enter a valid 10-digit mobile number');
    isValid = false;
  } else {
    clearError('phoneError');
  }

  // Email validation
  const emailClean = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailClean)) {
    setError('emailError', 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError('emailError');
  }

  // Court validation
  if (!courtSelect.value) {
    setError('courtError', 'Please select a football court');
    isValid = false;
  } else {
    clearError('courtError');
  }

  // Date validation
  if (!dateInput.value) {
    setError('dateError', 'Please select a booking date');
    isValid = false;
  } else if (dateInput.value < getTodayDateString()) {
    setError('dateError', 'Past dates cannot be booked');
    isValid = false;
  } else {
    clearError('dateError');
  }

  // Time slot validation
  if (!slotInput.value) {
    setError('slotError', 'Please select an available time slot above');
    isValid = false;
  } else {
    clearError('slotError');
  }

  // Players validation
  const playersVal = parseInt(playersInput.value, 10);
  if (isNaN(playersVal) || playersVal < 2 || playersVal > 30) {
    setError('playersError', 'Players count must be between 2 and 30');
    isValid = false;
  } else {
    clearError('playersError');
  }

  return isValid;
}

/**
 * Handle form submission
 */
function handleBookingSubmit(e) {
  e.preventDefault();

  if (!validateBookingForm()) {
    showToast('Please fix highlighted form errors before confirming.', 'error');
    return;
  }

  const courtSelect = document.getElementById('courtSelect');
  const courtId = courtSelect.value;
  const court = COURTS_DATA.find(c => c.id === courtId);

  const fullName = document.getElementById('fullName').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const emailAddress = document.getElementById('emailAddress').value.trim();
  const numberOfPlayers = parseInt(document.getElementById('numberOfPlayers').value, 10);
  const bookingDate = document.getElementById('bookingDate').value;
  const timeSlot = document.getElementById('selectedTimeSlot').value;
  const duration = parseFloat(document.getElementById('bookingDuration').value);

  // Calculate pricing
  const hourlyRate = court.hourlyRate;
  const pitchSubtotal = hourlyRate * duration;

  // Addons calculation
  const refereeCheckbox = document.getElementById('addonReferee');
  let addonsTotal = 0;
  if (refereeCheckbox && refereeCheckbox.checked) {
    addonsTotal += parseInt(refereeCheckbox.getAttribute('data-price') || '300', 10);
  }

  const grandTotal = pitchSubtotal + addonsTotal;

  // Generate Unique Booking Reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `KO-2026-${randomSuffix}`;

  // Booking Object
  const newBooking = {
    bookingId,
    fullName,
    phoneNumber,
    emailAddress,
    numberOfPlayers,
    courtId: court.id,
    courtName: court.name,
    courtCategory: court.categoryLabel,
    courtImage: court.image,
    bookingDate,
    timeSlot,
    duration,
    hourlyRate,
    addonsTotal,
    totalAmount: grandTotal,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage / Backend
  BookingStorage.addBooking(newBooking);

  // Update UI views
  updateMyBookingsView();
  refreshAvailableTimeSlots();

  // Show Confirmation Modal
  openConfirmationModal(newBooking);

  // Success Toast
  showToast(`Booking ${bookingId} confirmed successfully!`, 'success');
}

// ------------------------------------------------------------------------------
// Dynamic Live Summary & Cost Calculator
// ------------------------------------------------------------------------------
function updateLiveBookingSummary() {
  const courtSelect = document.getElementById('courtSelect');
  const dateInput = document.getElementById('bookingDate');
  const slotInput = document.getElementById('selectedTimeSlot');
  const durationSelect = document.getElementById('bookingDuration');
  const playersInput = document.getElementById('numberOfPlayers');
  const nameInput = document.getElementById('fullName');

  // Selected Court Info
  const selectedCourtId = courtSelect ? courtSelect.value : '';
  const court = COURTS_DATA.find(c => c.id === selectedCourtId);

  // DOM Elements
  const summaryImg = document.getElementById('summaryCourtImg');
  const summaryName = document.getElementById('summaryCourtName');
  const summaryType = document.getElementById('summaryCourtType');
  const summaryDate = document.getElementById('summaryDate');
  const summarySlot = document.getElementById('summarySlot');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryPlayers = document.getElementById('summaryPlayers');
  const summaryCustomer = document.getElementById('summaryCustomerName');

  const summaryBaseRate = document.getElementById('summaryBaseRate');
  const summaryDurationMult = document.getElementById('summaryDurationMult');
  const summaryPitchSubtotal = document.getElementById('summaryPitchSubtotal');
  const summaryAddons = document.getElementById('summaryAddons');
  const summaryGrandTotal = document.getElementById('summaryGrandTotal');
  const btnSubmitPrice = document.getElementById('btnSubmitPrice');

  // 1. Court Details
  if (court) {
    if (summaryImg) summaryImg.src = court.image;
    if (summaryName) summaryName.textContent = court.name;
    if (summaryType) summaryType.textContent = court.categoryLabel;
    if (summaryBaseRate) summaryBaseRate.textContent = `${formatCurrency(court.hourlyRate)} / hr`;
  } else {
    if (summaryImg) summaryImg.src = 'assets/images/turf-5aside.jpg';
    if (summaryName) summaryName.textContent = 'Select a Football Court';
    if (summaryType) summaryType.textContent = '5v5 / 7v7 / Indoor';
    if (summaryBaseRate) summaryBaseRate.textContent = '₹0 / hr';
  }

  // 2. Date & Slot
  if (summaryDate) {
    summaryDate.textContent = formatReadableDate(dateInput ? dateInput.value : '');
  }

  if (summarySlot) {
    summarySlot.textContent = (slotInput && slotInput.value) ? slotInput.value : 'Not selected';
  }

  // 3. Duration & Players
  const durationVal = durationSelect ? parseFloat(durationSelect.value) : 1;
  if (summaryDuration) {
    summaryDuration.textContent = `${durationVal} Hour${durationVal > 1 ? 's' : ''}`;
  }
  if (summaryDurationMult) {
    summaryDurationMult.textContent = `× ${durationVal} hr${durationVal > 1 ? 's' : ''}`;
  }

  const playersVal = playersInput ? playersInput.value : '10';
  if (summaryPlayers) {
    summaryPlayers.textContent = `${playersVal || 0} Players`;
  }

  if (summaryCustomer) {
    summaryCustomer.textContent = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Guest Player';
  }

  // 4. Calculations
  const rate = court ? court.hourlyRate : 0;
  const pitchSubtotal = rate * durationVal;

  const refereeCheckbox = document.getElementById('addonReferee');
  let addonsTotal = 0;
  if (refereeCheckbox && refereeCheckbox.checked) {
    addonsTotal += parseInt(refereeCheckbox.getAttribute('data-price') || '300', 10);
  }

  const grandTotal = pitchSubtotal + addonsTotal;

  if (summaryPitchSubtotal) summaryPitchSubtotal.textContent = formatCurrency(pitchSubtotal);
  if (summaryAddons) summaryAddons.textContent = formatCurrency(addonsTotal);
  if (summaryGrandTotal) summaryGrandTotal.textContent = formatCurrency(grandTotal);
  if (btnSubmitPrice) btnSubmitPrice.textContent = formatCurrency(grandTotal);
}

function setDefaultBookingFormState() {
  const courtSelect = document.getElementById('courtSelect');
  if (courtSelect && courtSelect.options.length > 1) {
    courtSelect.selectedIndex = 1; // pick first court by default
    updateCourtRateDisplay();
  }
  refreshAvailableTimeSlots();
  updateLiveBookingSummary();
}

// ------------------------------------------------------------------------------
// My Bookings Portal & Cancellation Logic
// ------------------------------------------------------------------------------
let currentBookingsFilter = 'all';

function initBookingsPortal() {
  const filterTabs = document.getElementById('bookingFilterTabs');
  const clearBtn = document.getElementById('clearAllBookingsBtn');

  if (filterTabs) {
    const btns = filterTabs.querySelectorAll('.b-filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBookingsFilter = btn.getAttribute('data-status');
        updateMyBookingsView();
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Reset local demo bookings back to initial default data?')) {
        localStorage.removeItem(STORAGE_KEY);
        BookingStorage.seedInitialDataIfEmpty();
        updateMyBookingsView();
        refreshAvailableTimeSlots();
        showToast('Demo bookings reset successfully!', 'info');
      }
    });
  }
}

/**
 * Re-renders the bookings list and updates counter badges
 */
function updateMyBookingsView() {
  const container = document.getElementById('bookingsListContainer');
  const navCountBadge = document.getElementById('navBookingCount');
  const countAll = document.getElementById('countAll');
  const countActive = document.getElementById('countActive');
  const countCancelled = document.getElementById('countCancelled');

  const allBookings = BookingStorage.getAllBookings();

  // Counts
  const activeBookings = allBookings.filter(b => b.status === 'Confirmed');
  const cancelledBookings = allBookings.filter(b => b.status === 'Cancelled');

  if (navCountBadge) navCountBadge.textContent = activeBookings.length;
  if (countAll) countAll.textContent = allBookings.length;
  if (countActive) countActive.textContent = activeBookings.length;
  if (countCancelled) countCancelled.textContent = cancelledBookings.length;

  if (!container) return;

  // Filter
  let displayList = allBookings;
  if (currentBookingsFilter === 'Confirmed') {
    displayList = activeBookings;
  } else if (currentBookingsFilter === 'Cancelled') {
    displayList = cancelledBookings;
  }

  if (displayList.length === 0) {
    container.innerHTML = `
      <div class="empty-bookings-box">
        <i class="fa-solid fa-calendar-xmark empty-icon"></i>
        <h3>No Bookings Found</h3>
        <p>You don't have any ${currentBookingsFilter === 'all' ? '' : currentBookingsFilter.toLowerCase()} court bookings at the moment.</p>
        <a href="#booking" class="btn btn-accent btn-md">
          <i class="fa-solid fa-plus-circle"></i> Reserve a Court Now
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = displayList.map(booking => {
    const isCancelled = booking.status === 'Cancelled';
    const cardClass = isCancelled ? 'booking-card-item cancelled-card' : 'booking-card-item';

    return `
      <div class="${cardClass}" id="booking-card-${booking.bookingId}">
        <img src="${booking.courtImage}" alt="${booking.courtName}" class="b-court-thumb">

        <div class="b-main-info">
          <span class="b-ref-id"><i class="fa-solid fa-hashtag"></i> ${booking.bookingId}</span>
          <h4>${booking.courtName}</h4>
          <div class="b-player-meta">
            <span><i class="fa-solid fa-user"></i> ${booking.fullName}</span>
            <span><i class="fa-solid fa-phone"></i> ${booking.phoneNumber}</span>
            <span><i class="fa-solid fa-users"></i> ${booking.numberOfPlayers} Players</span>
          </div>
        </div>

        <div class="b-schedule-info">
          <div class="b-schedule-row">
            <i class="fa-regular fa-calendar"></i>
            <span>${formatReadableDate(booking.bookingDate)}</span>
          </div>
          <div class="b-schedule-row">
            <i class="fa-regular fa-clock"></i>
            <span>${booking.timeSlot} (${booking.duration} hr)</span>
          </div>
          <div class="b-schedule-row">
            <i class="fa-solid fa-shield"></i>
            <span>${booking.courtCategory}</span>
          </div>
        </div>

        <div class="b-pricing-info">
          <span class="b-status-badge ${booking.status.toLowerCase()}">
            <i class="fa-solid ${isCancelled ? 'fa-ban' : 'fa-check'}"></i>
            ${booking.status}
          </span>
          <span class="b-total-price">${formatCurrency(booking.totalAmount)}</span>
          <span style="font-size: 0.725rem; color: var(--text-muted);">Demo Payment</span>
        </div>

        <div class="b-actions-col">
          <button class="btn btn-sm btn-dark-outline view-pass-btn" data-id="${booking.bookingId}">
            <i class="fa-solid fa-receipt"></i> Pass
          </button>
          ${!isCancelled ? `
            <button class="btn btn-sm btn-danger cancel-booking-btn" data-id="${booking.bookingId}">
              <i class="fa-solid fa-ban"></i> Cancel
            </button>
          ` : `
            <span style="font-size: 0.75rem; color: var(--accent-danger); text-align: center;">Slot Released</span>
          `}
        </div>
      </div>
    `;
  }).join('');

  // Attach action button handlers
  container.querySelectorAll('.view-pass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-id');
      const booking = allBookings.find(b => b.bookingId === bId);
      if (booking) openConfirmationModal(booking);
    });
  });

  container.querySelectorAll('.cancel-booking-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-id');
      promptCancelModal(bId);
    });
  });
}

// ------------------------------------------------------------------------------
// Modals System (Confirmation Ticket & Cancellation)
// ------------------------------------------------------------------------------
let targetCancelBookingId = null;

function initModals() {
  const confModal = document.getElementById('confirmationModal');
  const closeConfBtn = document.getElementById('closeConfirmationModal');
  const printTicketBtn = document.getElementById('printTicketBtn');
  const viewBookingsFromModalBtn = document.getElementById('viewBookingsFromModalBtn');

  const cancelModal = document.getElementById('cancelModal');
  const dismissCancelBtn = document.getElementById('dismissCancelBtn');
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');

  // Confirmation Modal Listeners
  if (closeConfBtn) {
    closeConfBtn.addEventListener('click', () => {
      confModal.classList.remove('active');
    });
  }

  if (viewBookingsFromModalBtn) {
    viewBookingsFromModalBtn.addEventListener('click', () => {
      confModal.classList.remove('active');
      const bookingsSec = document.getElementById('my-bookings');
      if (bookingsSec) bookingsSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (printTicketBtn) {
    printTicketBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Cancel Modal Listeners
  if (dismissCancelBtn) {
    dismissCancelBtn.addEventListener('click', () => {
      cancelModal.classList.remove('active');
      targetCancelBookingId = null;
    });
  }

  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
      if (targetCancelBookingId) {
        BookingStorage.cancelBooking(targetCancelBookingId);
        showToast(`Booking ${targetCancelBookingId} cancelled. Slot is now available!`, 'warning');
        updateMyBookingsView();
        refreshAvailableTimeSlots();
      }
      cancelModal.classList.remove('active');
      targetCancelBookingId = null;
    });
  }

  // Close modals on clicking backdrop
  [confModal, cancelModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });
}

function openConfirmationModal(booking) {
  const modal = document.getElementById('confirmationModal');
  if (!modal) return;

  // Populate ticket values
  document.getElementById('ticketCourtName').textContent = booking.courtName;
  document.getElementById('ticketCourtType').textContent = booking.courtCategory;
  document.getElementById('ticketBookingId').textContent = booking.bookingId;
  document.getElementById('ticketDate').textContent = formatReadableDate(booking.bookingDate);
  document.getElementById('ticketSlot').textContent = booking.timeSlot;
  document.getElementById('ticketDuration').textContent = `${booking.duration} Hour${booking.duration > 1 ? 's' : ''}`;
  document.getElementById('ticketPlayerName').textContent = booking.fullName;
  document.getElementById('ticketPlayersCount').textContent = `${booking.numberOfPlayers} Players`;
  document.getElementById('ticketPhone').textContent = booking.phoneNumber;
  document.getElementById('ticketTotalAmount').textContent = formatCurrency(booking.totalAmount);

  modal.classList.add('active');
}

function promptCancelModal(bookingId) {
  targetCancelBookingId = bookingId;
  const modal = document.getElementById('cancelModal');
  const targetIdSpan = document.getElementById('cancelTargetId');

  if (targetIdSpan) targetIdSpan.textContent = bookingId;
  if (modal) modal.classList.add('active');
}

// ------------------------------------------------------------------------------
// Contact Form Submission (Demo)
// ------------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    showToast(`Thanks ${name || 'Player'}! We received your message and will reply shortly.`, 'success');
    form.reset();
  });
}
