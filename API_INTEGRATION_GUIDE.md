# Hotel Booking System - API Integration Guide

## Backend Changes Made

### 1. Updated API Endpoints
- All endpoints now use `/api/` prefix
- Users: `/api/users/`
- Hotels: `/api/hotels/`
- Bookings: `/api/bookings/`

### 2. CORS Configuration
- Added support for both React (port 3000) and Vite (port 5173)
- Enabled credentials for JWT token handling
- Configured proper headers and methods

### 3. Enhanced Data Models

#### Booking Entity/DTO Updates:
- Added `rooms` field (number of rooms)
- Added `bookingDate` field
- Added guest details: `guestFirstName`, `guestLastName`, `guestEmail`, `guestPhone`
- Enhanced `BookingResponseDTO` with all frontend-required fields

#### Hotel Entity/DTO Updates:
- Added `ratingCount`, `location`, `distance`, `ratingText`
- Added `petFriendly`, `meals` fields
- Changed `starRating` to Integer type

### 4. New API Endpoints

#### Authentication:
- POST `/api/users/signin` - User login
- POST `/api/users/signup` - User registration

#### Hotels:
- GET `/api/hotels` - Get all hotels
- GET `/api/hotels/{id}` - Get hotel details
- GET `/api/hotels/search?city=&state=&destination=` - Search hotels
- GET `/api/hotels/{id}/rooms` - Get hotel room types

#### Bookings:
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - Get user bookings
- PUT `/api/bookings/{id}` - Update booking
- DELETE `/api/bookings/{id}` - Cancel booking

## Frontend Integration Steps

### 1. Update API Base URL
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 2. Authentication Integration
Replace hardcoded authentication in `AuthContext.jsx` with actual API calls:

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.jwt);
      // Parse JWT to get user info or make another API call
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 3. Hotel Data Integration
Replace mock data in `HotelContext.jsx` with API calls:

```javascript
const fetchHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/hotels`);
  return response.json();
};
```

### 4. Booking Integration
Update booking operations to use real API:

```javascript
const createBooking = async (bookingData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  return response.json();
};
```

### 5. Required Frontend Changes

1. **Remove hardcoded data** from:
   - `src/context/AuthContext.jsx`
   - `src/context/HotelContext.jsx`
   - `src/data/mockData.js`

2. **Create API service layer**:
   - `src/services/api.js` - Base API configuration
   - `src/services/authService.js` - Authentication APIs
   - `src/services/hotelService.js` - Hotel APIs
   - `src/services/bookingService.js` - Booking APIs

3. **Update components** to use real data:
   - `src/pages/Bookings.jsx`
   - `src/pages/SearchResults.jsx`
   - `src/pages/LoginPage.jsx`
   - `src/pages/RegisterPage.jsx`

## Database Schema Updates

The backend will automatically create/update tables with new fields:
- `bookings` table: Added guest details, rooms, booking_date
- `hotels` table: Added rating_count, location, distance, etc.

## Testing

1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Test authentication flow
4. Test hotel search and booking creation
5. Verify CORS is working properly

## Security Notes

- JWT tokens are required for protected endpoints
- CORS is configured for development URLs only
- Update CORS configuration for production deployment