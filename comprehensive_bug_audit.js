/**
 * COMPREHENSIVE BUG AUDIT
 * Deep-dive testing of every module, endpoint, and user role
 */

const BASE_URL = 'http://localhost:8080/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const bugs = [];
const warnings = [];

function logBug(module, issue, severity = 'HIGH') {
  bugs.push({ module, issue, severity });
  console.log(`${colors.red}🐛 BUG [${severity}]: ${module} - ${issue}${colors.reset}`);
}

function logWarning(module, issue) {
  warnings.push({ module, issue });
  console.log(`${colors.yellow}⚠️  WARNING: ${module} - ${issue}${colors.reset}`);
}

function logPass(module, test) {
  console.log(`${colors.green}✓ ${module}: ${test}${colors.reset}`);
}

async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { success: response.ok, status: response.status, data, text };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// MODULE 1: AUTHENTICATION & USER MANAGEMENT
// ============================================
async function auditAuthModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 1: AUTHENTICATION & USER MANAGEMENT`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  // Test 1: Login with empty credentials
  console.log(`${colors.blue}Test 1.1: Login Validation${colors.reset}`);
  const emptyLogin = await apiCall('/users/signin', 'POST', { email: '', password: '' });
  if (emptyLogin.status === 200) {
    logBug('Authentication', 'Empty credentials accepted', 'CRITICAL');
  } else {
    logPass('Authentication', 'Empty credentials rejected');
  }

  // Test 2: SQL Injection attempt
  console.log(`${colors.blue}Test 1.2: SQL Injection Protection${colors.reset}`);
  const sqlInjection = await apiCall('/users/signin', 'POST', {
    email: "admin@stays.in' OR '1'='1",
    password: "' OR '1'='1"
  });
  if (sqlInjection.success) {
    logBug('Authentication', 'SQL Injection vulnerability', 'CRITICAL');
  } else {
    logPass('Authentication', 'SQL Injection blocked');
  }

  // Test 3: Password in response
  const validLogin = await apiCall('/users/signin', 'POST', {
    email: 'user@stays.in',
    password: 'password123'
  });
  if (validLogin.success) {
    const token = validLogin.data.jwt;
    const profileRes = await apiCall('/users/profile', 'GET', null, token);
    if (profileRes.success && profileRes.data.password) {
      logBug('User Profile', 'Password exposed in API response', 'CRITICAL');
    } else {
      logPass('User Profile', 'Password not exposed');
    }
  }

  // Test 4: Token expiration
  console.log(`${colors.blue}Test 1.3: JWT Token Validation${colors.reset}`);
  const invalidToken = await apiCall('/users/profile', 'GET', null, 'invalid.token.here');
  if (invalidToken.success) {
    logBug('JWT', 'Invalid token accepted', 'CRITICAL');
  } else {
    logPass('JWT', 'Invalid token rejected');
  }

  // Test 5: Email validation
  console.log(`${colors.blue}Test 1.4: Email Validation${colors.reset}`);
  const invalidEmail = await apiCall('/users/signup', 'POST', {
    firstName: 'Test',
    lastName: 'User',
    email: 'notanemail',
    password: 'test123',
    phone: '1234567890',
    dob: '1990-01-01',
    address: 'Test Address'
  });
  if (invalidEmail.success) {
    logBug('User Registration', 'Invalid email format accepted', 'MEDIUM');
  } else {
    logPass('User Registration', 'Invalid email rejected');
  }

  // Test 6: Weak password
  console.log(`${colors.blue}Test 1.5: Password Strength${colors.reset}`);
  const weakPassword = await apiCall('/users/signup', 'POST', {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@test.com`,
    password: '123',
    phone: '1234567890',
    dob: '1990-01-01',
    address: 'Test Address'
  });
  if (weakPassword.success) {
    logWarning('User Registration', 'Weak password accepted (less than 6 chars)');
  } else {
    logPass('User Registration', 'Weak password rejected');
  }
}

// ============================================
// MODULE 2: HOTEL MANAGEMENT
// ============================================
async function auditHotelModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 2: HOTEL MANAGEMENT`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  // Get hotels
  const hotelsRes = await apiCall('/hotels');
  if (!hotelsRes.success) {
    logBug('Hotels', 'Cannot fetch hotels', 'HIGH');
    return;
  }

  const hotels = hotelsRes.data;
  console.log(`${colors.blue}Found ${hotels.length} hotels${colors.reset}\n`);

  for (const hotel of hotels) {
    // Test 1: Missing data
    console.log(`${colors.blue}Testing Hotel: ${hotel.name} (ID: ${hotel.id})${colors.reset}`);
    
    if (!hotel.rating || hotel.rating === 0) {
      logWarning('Hotel Data', `${hotel.name} has no rating`);
    }
    
    if (!hotel.ratingCount || hotel.ratingCount === 0) {
      logWarning('Hotel Data', `${hotel.name} has no rating count`);
    }
    
    if (!hotel.images || hotel.images.length === 0) {
      logWarning('Hotel Data', `${hotel.name} has no images`);
    }
    
    if (!hotel.priceRange) {
      logWarning('Hotel Data', `${hotel.name} has no price range`);
    }

    // Test 2: Get hotel details
    const detailsRes = await apiCall(`/hotels/${hotel.id}`);
    if (!detailsRes.success) {
      logBug('Hotel Details', `Cannot fetch details for ${hotel.name}`, 'MEDIUM');
    }

    // Test 3: Get rooms
    const roomsRes = await apiCall(`/hotels/${hotel.id}/rooms`);
    if (!roomsRes.success) {
      logBug('Hotel Rooms', `Cannot fetch rooms for ${hotel.name}`, 'MEDIUM');
    } else if (roomsRes.data.length === 0) {
      logWarning('Hotel Rooms', `${hotel.name} has no rooms`);
    } else {
      // Check room prices
      roomsRes.data.forEach(room => {
        if (room.pricePerNight < 100) {
          logWarning('Room Pricing', `${hotel.name} - ${room.name}: Unrealistic price ₹${room.pricePerNight}`);
        }
      });
    }

    // Test 4: Invalid hotel ID
    const invalidHotel = await apiCall('/hotels/99999');
    if (invalidHotel.success) {
      logBug('Hotel Details', 'Non-existent hotel returns success', 'MEDIUM');
    }
  }
}

// ============================================
// MODULE 3: BOOKING SYSTEM
// ============================================
async function auditBookingModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 3: BOOKING SYSTEM`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  // Login as customer
  const loginRes = await apiCall('/users/signin', 'POST', {
    email: 'user@stays.in',
    password: 'password123'
  });

  if (!loginRes.success) {
    logBug('Booking', 'Cannot login to test bookings', 'HIGH');
    return;
  }

  const token = loginRes.data.jwt;

  // Test 1: Invalid date range
  console.log(`${colors.blue}Test 3.1: Date Validation${colors.reset}`);
  const invalidDates = await apiCall('/bookings', 'POST', {
    hotelId: 5,
    roomTypeId: 6,
    checkInDate: '2026-03-05',
    checkOutDate: '2026-03-01', // Check-out before check-in
    adults: 2,
    children: 0,
    rooms: 1
  }, token);

  if (invalidDates.success) {
    logBug('Booking', 'Check-out before check-in accepted', 'HIGH');
  } else {
    logPass('Booking', 'Invalid date range rejected');
  }

  // Test 2: Past dates
  console.log(`${colors.blue}Test 3.2: Past Date Validation${colors.reset}`);
  const pastDates = await apiCall('/bookings', 'POST', {
    hotelId: 5,
    roomTypeId: 6,
    checkInDate: '2020-01-01',
    checkOutDate: '2020-01-05',
    adults: 2,
    children: 0,
    rooms: 1
  }, token);

  if (pastDates.success) {
    logBug('Booking', 'Past dates accepted for booking', 'HIGH');
  } else {
    logPass('Booking', 'Past dates rejected');
  }

  // Test 3: Zero guests
  console.log(`${colors.blue}Test 3.3: Guest Count Validation${colors.reset}`);
  const zeroGuests = await apiCall('/bookings', 'POST', {
    hotelId: 5,
    roomTypeId: 6,
    checkInDate: '2026-03-01',
    checkOutDate: '2026-03-05',
    adults: 0,
    children: 0,
    rooms: 1
  }, token);

  if (zeroGuests.success) {
    logBug('Booking', 'Zero guests accepted', 'MEDIUM');
  } else {
    logPass('Booking', 'Zero guests rejected');
  }

  // Test 4: Negative values
  console.log(`${colors.blue}Test 3.4: Negative Value Validation${colors.reset}`);
  const negativeValues = await apiCall('/bookings', 'POST', {
    hotelId: 5,
    roomTypeId: 6,
    checkInDate: '2026-03-01',
    checkOutDate: '2026-03-05',
    adults: -1,
    children: -1,
    rooms: -1
  }, token);

  if (negativeValues.success) {
    logBug('Booking', 'Negative values accepted', 'HIGH');
  } else {
    logPass('Booking', 'Negative values rejected');
  }

  // Test 5: Non-existent hotel/room
  console.log(`${colors.blue}Test 3.5: Invalid Hotel/Room Validation${colors.reset}`);
  const invalidBooking = await apiCall('/bookings', 'POST', {
    hotelId: 99999,
    roomTypeId: 99999,
    checkInDate: '2026-03-01',
    checkOutDate: '2026-03-05',
    adults: 2,
    children: 0,
    rooms: 1
  }, token);

  if (invalidBooking.success) {
    logBug('Booking', 'Non-existent hotel/room accepted', 'HIGH');
  } else {
    logPass('Booking', 'Invalid hotel/room rejected');
  }
}

// ============================================
// MODULE 4: REVIEW SYSTEM
// ============================================
async function auditReviewModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 4: REVIEW SYSTEM`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  const loginRes = await apiCall('/users/signin', 'POST', {
    email: 'user@stays.in',
    password: 'password123'
  });

  if (!loginRes.success) return;
  const token = loginRes.data.jwt;

  // Test 1: Invalid rating
  console.log(`${colors.blue}Test 4.1: Rating Validation${colors.reset}`);
  const invalidRating = await apiCall('/reviews', 'POST', {
    hotelId: 5,
    rating: 10, // Should be 1-5
    title: 'Test',
    comment: 'Test comment'
  }, token);

  if (invalidRating.success) {
    logBug('Reviews', 'Rating > 5 accepted', 'MEDIUM');
  } else {
    logPass('Reviews', 'Invalid rating rejected');
  }

  // Test 2: Negative rating
  const negativeRating = await apiCall('/reviews', 'POST', {
    hotelId: 5,
    rating: -1,
    title: 'Test',
    comment: 'Test comment'
  }, token);

  if (negativeRating.success) {
    logBug('Reviews', 'Negative rating accepted', 'MEDIUM');
  } else {
    logPass('Reviews', 'Negative rating rejected');
  }

  // Test 3: Empty title
  console.log(`${colors.blue}Test 4.2: Required Fields${colors.reset}`);
  const emptyTitle = await apiCall('/reviews', 'POST', {
    hotelId: 5,
    rating: 5,
    title: '',
    comment: 'Test comment'
  }, token);

  if (emptyTitle.success) {
    logBug('Reviews', 'Empty title accepted', 'LOW');
  } else {
    logPass('Reviews', 'Empty title rejected');
  }

  // Test 4: XSS attempt
  console.log(`${colors.blue}Test 4.3: XSS Protection${colors.reset}`);
  const xssAttempt = await apiCall('/reviews', 'POST', {
    hotelId: 5,
    rating: 5,
    title: '<script>alert("XSS")</script>',
    comment: '<img src=x onerror=alert("XSS")>'
  }, token);

  if (xssAttempt.success) {
    logWarning('Reviews', 'XSS content accepted - check if sanitized on display');
  }
}

// ============================================
// MODULE 5: ADMIN FUNCTIONS
// ============================================
async function auditAdminModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 5: ADMIN FUNCTIONS`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  const adminLogin = await apiCall('/users/signin', 'POST', {
    email: 'admin@stays.in',
    password: 'admin123'
  });

  if (!adminLogin.success) {
    logBug('Admin', 'Cannot login as admin', 'CRITICAL');
    return;
  }

  const adminToken = adminLogin.data.jwt;

  // Test 1: Customer accessing admin endpoints
  console.log(`${colors.blue}Test 5.1: Access Control${colors.reset}`);
  const customerLogin = await apiCall('/users/signin', 'POST', {
    email: 'user@stays.in',
    password: 'password123'
  });

  if (customerLogin.success) {
    const customerToken = customerLogin.data.jwt;
    const unauthorizedAccess = await apiCall('/admin/users', 'GET', null, customerToken);
    
    if (unauthorizedAccess.success || unauthorizedAccess.status === 200) {
      logBug('Admin Access Control', 'Customer can access admin endpoints', 'CRITICAL');
    } else if (unauthorizedAccess.status === 403 || unauthorizedAccess.status === 401) {
      logPass('Admin Access Control', 'Customer blocked from admin endpoints');
    }
  }

  // Test 2: Admin endpoints functionality
  console.log(`${colors.blue}Test 5.2: Admin Endpoints${colors.reset}`);
  
  const endpoints = [
    '/admin/users',
    '/admin/hotels',
    '/admin/bookings',
    '/admin/reviews',
    '/admin/complaints',
    '/admin/analytics'
  ];

  for (const endpoint of endpoints) {
    const res = await apiCall(endpoint, 'GET', null, adminToken);
    if (!res.success) {
      logBug('Admin Endpoints', `${endpoint} not working`, 'MEDIUM');
    } else {
      logPass('Admin Endpoints', `${endpoint} working`);
    }
  }
}

// ============================================
// MODULE 6: OWNER FUNCTIONS
// ============================================
async function auditOwnerModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 6: HOTEL OWNER FUNCTIONS`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  const ownerLogin = await apiCall('/users/signin', 'POST', {
    email: 'owner@stays.in',
    password: 'owner123'
  });

  if (!ownerLogin.success) {
    logBug('Owner', 'Cannot login as owner', 'HIGH');
    return;
  }

  const ownerToken = ownerLogin.data.jwt;

  // Test 1: Get owned hotels
  console.log(`${colors.blue}Test 6.1: Owner Hotel Access${colors.reset}`);
  const ownedHotels = await apiCall('/owner/hotels', 'GET', null, ownerToken);
  
  if (!ownedHotels.success) {
    logBug('Owner', 'Cannot fetch owned hotels', 'HIGH');
  } else if (ownedHotels.data.length === 0) {
    logWarning('Owner', 'Owner has no hotels assigned');
  } else {
    logPass('Owner', `Owner has ${ownedHotels.data.length} hotels`);
  }

  // Test 2: Access other owner's hotel
  console.log(`${colors.blue}Test 6.2: Owner Access Control${colors.reset}`);
  const otherHotel = await apiCall('/owner/hotels/99999', 'GET', null, ownerToken);
  
  if (otherHotel.success) {
    logBug('Owner Access Control', 'Owner can access other owner\'s hotels', 'HIGH');
  }
}

// ============================================
// MODULE 7: AVAILABILITY SYSTEM
// ============================================
async function auditAvailabilityModule() {
  console.log(`\n${colors.cyan}${'='.repeat(70)}`);
  console.log(`MODULE 7: AVAILABILITY SYSTEM`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  // Test 1: Check availability
  console.log(`${colors.blue}Test 7.1: Availability Check${colors.reset}`);
  const availRes = await apiCall('/availability/hotel/5/room-type/6?checkIn=2026-03-01&checkOut=2026-03-05&rooms=1');
  
  if (!availRes.success) {
    logBug('Availability', 'Cannot check availability', 'HIGH');
  } else {
    logPass('Availability', 'Availability check working');
  }

  // Test 2: Invalid date format
  console.log(`${colors.blue}Test 7.2: Date Format Validation${colors.reset}`);
  const invalidDate = await apiCall('/availability/hotel/5/room-type/6?checkIn=invalid&checkOut=invalid&rooms=1');
  
  if (invalidDate.success) {
    logBug('Availability', 'Invalid date format accepted', 'MEDIUM');
  } else {
    logPass('Availability', 'Invalid date format rejected');
  }
}

// ============================================
// MAIN AUDIT EXECUTION
// ============================================
async function runComprehensiveAudit() {
  console.log(`${colors.magenta}
╔════════════════════════════════════════════════════════════════════╗
║           COMPREHENSIVE BUG AUDIT - DEEP DIVE ANALYSIS             ║
║              Testing Every Module, Endpoint & User Role            ║
╚════════════════════════════════════════════════════════════════════╝
${colors.reset}`);

  console.log(`${colors.yellow}Starting comprehensive audit at: ${new Date().toLocaleString()}${colors.reset}\n`);

  await auditAuthModule();
  await auditHotelModule();
  await auditBookingModule();
  await auditReviewModule();
  await auditAdminModule();
  await auditOwnerModule();
  await auditAvailabilityModule();

  // FINAL REPORT
  console.log(`\n${colors.magenta}${'='.repeat(70)}`);
  console.log(`AUDIT COMPLETE - FINAL REPORT`);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);

  console.log(`${colors.red}🐛 BUGS FOUND: ${bugs.length}${colors.reset}`);
  if (bugs.length > 0) {
    bugs.forEach((bug, idx) => {
      console.log(`  ${idx + 1}. [${bug.severity}] ${bug.module}: ${bug.issue}`);
    });
  }

  console.log(`\n${colors.yellow}⚠️  WARNINGS: ${warnings.length}${colors.reset}`);
  if (warnings.length > 0) {
    warnings.forEach((warn, idx) => {
      console.log(`  ${idx + 1}. ${warn.module}: ${warn.issue}`);
    });
  }

  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.yellow}Audit completed at: ${new Date().toLocaleString()}${colors.reset}\n`);

  // Summary
  const critical = bugs.filter(b => b.severity === 'CRITICAL').length;
  const high = bugs.filter(b => b.severity === 'HIGH').length;
  const medium = bugs.filter(b => b.severity === 'MEDIUM').length;
  const low = bugs.filter(b => b.severity === 'LOW').length;

  console.log(`${colors.magenta}SEVERITY BREAKDOWN:${colors.reset}`);
  console.log(`  ${colors.red}CRITICAL: ${critical}${colors.reset}`);
  console.log(`  ${colors.red}HIGH: ${high}${colors.reset}`);
  console.log(`  ${colors.yellow}MEDIUM: ${medium}${colors.reset}`);
  console.log(`  ${colors.green}LOW: ${low}${colors.reset}`);
  console.log(`  ${colors.yellow}WARNINGS: ${warnings.length}${colors.reset}\n`);
}

runComprehensiveAudit().catch(console.error);
