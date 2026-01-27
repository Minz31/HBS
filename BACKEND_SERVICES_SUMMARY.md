# Backend Services Summary

## Spring Boot Backend (Port 8080)
**Base URL**: `http://localhost:8080/api`

### 1. UserController - `/api/users`
- `POST /signin` - User login
- `POST /signup` - User registration
- `GET /` - Get all users
- `GET /{userId}` - Get user by ID
- `PUT /{id}` - Update user details
- `GET /profile` - Get current user profile (authenticated)
- `PUT /profile` - Update current user profile (authenticated)
- `PATCH /change-password` - Change password (authenticated)
- `PATCH /reset-password` - Reset password (admin tool)
- `PATCH /fix-passwords` - Fix passwords (dev tool)
- `GET /debug-password` - Debug password (dev tool)
- `PATCH /pwd-encryption` - Encrypt passwords (dev tool)

### 2. HotelController - `/api/hotels` (Public + Customer)
- `GET /` - Get all hotels
- `GET /status/{status}` - Get hotels by status
- `GET /{id}` - Get hotel details
- `GET /search` - Search hotels (city, state, destination)
- `GET /{id}/rooms` - Get hotel room types
- `GET /{hotelId}/rooms/{roomTypeId}/availability` - Check room availability
- `POST /register` - Register hotel (ROLE_HOTEL_MANAGER, ROLE_ADMIN)
- `PATCH /{id}/status` - Update hotel status (ROLE_ADMIN)

### 3. BookingController - `/api/bookings` (Customer)
- `POST /` - Create booking (authenticated)
- `GET /my-bookings` - Get user bookings (authenticated)
- `GET /` - Get all bookings (ROLE_ADMIN)
- `PUT /{id}` - Update booking (authenticated)
- `DELETE /{id}` - Cancel booking (authenticated)

### 4. HotelOwnerController - `/api/owner` (ROLE_HOTEL_MANAGER)
**Hotel Management**:
- `GET /hotels` - Get owner's hotels
- `GET /hotels/{id}` - Get hotel details
- `POST /hotels` - Create hotel
- `PUT /hotels/{id}` - Update hotel
- `DELETE /hotels/{id}` - Delete hotel

**Room Type Management**:
- `GET /hotels/{hotelId}/rooms` - Get hotel room types
- `POST /hotels/{hotelId}/rooms` - Add room type
- `PUT /hotels/{hotelId}/rooms/{roomId}` - Update room type
- `DELETE /hotels/{hotelId}/rooms/{roomId}` - Delete room type

**Booking Management**:
- `GET /bookings` - Get all owner's hotel bookings
- `GET /hotels/{hotelId}/bookings` - Get specific hotel bookings
- `PATCH /bookings/{bookingId}/status` - Update booking status

**Dashboard**:
- `GET /dashboard/stats` - Get owner dashboard statistics

### 5. AdminController - `/api/admin` (ROLE_ADMIN)
**Hotel Approval**:
- `GET /hotels/pending` - Get pending hotels
- `PATCH /hotels/{id}/approve` - Approve hotel
- `PATCH /hotels/{id}/reject` - Reject hotel (with reason)
- `GET /hotels/approved` - Get approved hotels
- `GET /hotels/rejected` - Get rejected hotels

**Payment Management**:
- `GET /payments` - Get all payments
- `GET /payments/pending` - Get pending payments
- `GET /payments/completed` - Get completed payments
- `GET /payments/failed` - Get failed payments

**User Management**:
- `GET /users` - Get all users
- `PATCH /users/{id}/suspend` - Suspend user (with reason)
- `PATCH /users/{id}/activate` - Activate user
- `GET /users/suspended` - Get suspended users

### 6. ReviewController - `/api/reviews` (Customer)
- `POST /` - Create review (authenticated)
- `GET /hotel/{hotelId}` - Get hotel reviews
- `GET /my-reviews` - Get user reviews (authenticated)

### 7. RecentlyViewedController - `/api/recently-viewed` (Customer)
- `POST /hotel/{hotelId}` - Add recently viewed hotel (authenticated)
- `GET /` - Get recently viewed hotels (authenticated)

---

## .NET Invoice Service (Port 5000)
**Base URL**: `http://localhost:5000/api`

### InvoiceController - `/api/invoice`
- `POST /generate` - Generate PDF invoice

**Request Body**:
```json
{
  "bookingId": 1,
  "customerName": "John Doe",
  "hotelName": "Grand Hotel",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-20",
  "roomType": "Deluxe",
  "totalAmount": 5000,
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN123456"
}
```

**Response**: PDF file download

---

## Database (MySQL - Port 3306)
- **Host**: localhost
- **Port**: 3306
- **Database**: hotel_booking_db
- **Username**: root
- **Password**: root

### Tables:
1. **users** - User accounts (customers, hotel managers, admins)
2. **hotels** - Hotel listings with approval status
3. **room_types** - Room type definitions per hotel
4. **rooms** - Individual room instances (if used)
5. **bookings** - Booking records with payment info
6. **reviews** - Hotel reviews by customers
7. **recently_viewed** - Recently viewed hotels tracking

---

## CORS Configuration
All services allow requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`

---

## Authentication
- **Type**: JWT (JSON Web Token)
- **Header**: `Authorization: Bearer <token>`
- **Roles**: 
  - `ROLE_CUSTOMER` - Regular users
  - `ROLE_HOTEL_MANAGER` - Hotel owners
  - `ROLE_ADMIN` - Platform administrators

---

## Test Credentials
- **Admin**: admin@stays.in / admin123
- **Customer**: user@stays.in / password123
- **Hotel Manager**: owner@stays.in / owner123
