# Hotel Booking System - Complete API Documentation

## Role Separation

### 1. **ROLE_CUSTOMER** - Regular Users
- Browse hotels
- Make bookings
- View own bookings
- Manage profile

### 2. **ROLE_HOTEL_MANAGER** - Hotel Owners
- Manage own hotels (CRUD)
- Manage room types for own hotels
- View bookings for own hotels
- Update booking status
- View dashboard stats

### 3. **ROLE_ADMIN** - Site Administrators
- Approve/reject hotel registrations
- View all payments across platform
- Manage user accounts (suspend/activate)
- View all users
- Platform-wide oversight

---

## Public Endpoints (No Auth Required)

### Hotels - Browse & Search
```
GET    /api/hotels                     - List all approved hotels
GET    /api/hotels/{id}                - Get hotel details
GET    /api/hotels/search              - Search hotels (?city=Mumbai)
GET    /api/hotels/{id}/rooms          - Get hotel room types
GET    /api/hotels/{hotelId}/rooms/{roomTypeId}/availability
       ?checkIn=2026-02-01&checkOut=2026-02-05&rooms=2
```

### Authentication
```
POST   /api/users/signin               - Login (returns JWT token)
POST   /api/users/signup               - Register new customer
```

---

## Customer Endpoints (ROLE_CUSTOMER)

### Bookings
```
POST   /api/bookings                   - Create new booking
GET    /api/bookings/my-bookings       - Get my bookings
PUT    /api/bookings/{id}              - Update my booking
DELETE /api/bookings/{id}              - Cancel my booking
```

### Profile
```
GET    /api/users/profile              - Get my profile
PUT    /api/users/profile              - Update my profile
PATCH  /api/users/change-password      - Change password
```

---

## Hotel Owner Endpoints (ROLE_HOTEL_MANAGER)

### Hotel Management
```
GET    /api/owner/hotels               - Get my hotels
GET    /api/owner/hotels/{id}          - Get my hotel details
POST   /api/owner/hotels               - Create new hotel (status: PENDING)
PUT    /api/owner/hotels/{id}          - Update my hotel
DELETE /api/owner/hotels/{id}          - Delete my hotel
```

### Room Type Management
```
GET    /api/owner/hotels/{hotelId}/rooms              - Get hotel room types
POST   /api/owner/hotels/{hotelId}/rooms              - Add room type
PUT    /api/owner/hotels/{hotelId}/rooms/{roomId}     - Update room type
DELETE /api/owner/hotels/{hotelId}/rooms/{roomId}     - Delete room type
```

### Booking Management
```
GET    /api/owner/bookings                            - Get all my hotel bookings
GET    /api/owner/hotels/{hotelId}/bookings           - Get specific hotel bookings
PATCH  /api/owner/bookings/{bookingId}/status         - Update booking status
       ?status=CONFIRMED|COMPLETED|CANCELLED
```

### Dashboard
```
GET    /api/owner/dashboard/stats      - Get owner dashboard statistics
```

**Dashboard Stats Response:**
```json
{
  "totalHotels": 3,
  "totalBookings": 45,
  "activeBookings": 12,
  "completedBookings": 30,
  "totalRevenue": 450000,
  "pendingApprovals": 1
}
```

---

## Admin Endpoints (ROLE_ADMIN)

### Hotel Approval Management
```
GET    /api/admin/hotels/pending       - Get pending hotel approvals
GET    /api/admin/hotels/approved      - Get approved hotels
GET    /api/admin/hotels/rejected      - Get rejected hotels
PATCH  /api/admin/hotels/{id}/approve  - Approve hotel
PATCH  /api/admin/hotels/{id}/reject   - Reject hotel
       ?reason=Incomplete documentation
```

### Payment Management
```
GET    /api/admin/payments             - Get all payments
GET    /api/admin/payments/pending     - Get pending payments
GET    /api/admin/payments/completed   - Get completed payments
GET    /api/admin/payments/failed      - Get failed payments
```

### User Account Management
```
GET    /api/admin/users                - Get all users
GET    /api/admin/users/suspended      - Get suspended users
PATCH  /api/admin/users/{id}/suspend   - Suspend user
       ?reason=Fraudulent activity
PATCH  /api/admin/users/{id}/activate  - Activate user
```

### Platform Bookings
```
GET    /api/bookings                   - Get all bookings (admin only)
```

---

## Request/Response Examples

### 1. Hotel Owner Creates Hotel
**Request:**
```http
POST /api/owner/hotels
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Grand Palace Hotel",
  "city": "Jaipur",
  "state": "Rajasthan",
  "address": "City Palace Road",
  "description": "Luxury heritage hotel",
  "starRating": 5,
  "priceRange": "₹8,000 - ₹25,000",
  "amenities": ["Pool", "Spa", "Restaurant", "WiFi"],
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
}
```

**Response:**
```json
{
  "id": 15,
  "name": "Grand Palace Hotel",
  "city": "Jaipur",
  "status": "PENDING",
  "owner": {
    "id": 5,
    "email": "owner@example.com"
  },
  "priceRange": "₹8,000 - ₹25,000"
}
```

### 2. Admin Approves Hotel
**Request:**
```http
PATCH /api/admin/hotels/15/approve
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response:**
```json
{
  "status": "Success",
  "message": "Hotel approved successfully"
}
```

### 3. Customer Creates Booking
**Request:**
```http
POST /api/bookings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "hotelId": 15,
  "roomTypeId": 3,
  "checkInDate": "2026-02-01",
  "checkOutDate": "2026-02-05",
  "adults": 2,
  "children": 0,
  "rooms": 1,
  "paymentMethod": "CREDIT_CARD",
  "guestFirstName": "John",
  "guestLastName": "Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "9876543210"
}
```

**Response:**
```json
{
  "id": 101,
  "bookingReference": "HB-A1B2C3D4",
  "hotelName": "Grand Palace Hotel",
  "checkInDate": "2026-02-01",
  "checkOutDate": "2026-02-05",
  "totalPrice": 32000,
  "status": "CONFIRMED",
  "paymentStatus": "PENDING",
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN-X1Y2Z3A4B5C6"
}
```

### 4. Admin Suspends User
**Request:**
```http
PATCH /api/admin/users/10/suspend?reason=Fraudulent bookings
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response:**
```json
{
  "status": "Success",
  "message": "User suspended successfully"
}
```

---

## Database Schema

### Users Table
```sql
user_id BIGINT PRIMARY KEY
first_name VARCHAR(30)
last_name VARCHAR(30)
email VARCHAR(50) UNIQUE
password VARCHAR(255)
dob DATE
user_role VARCHAR(50) -- ROLE_ADMIN, ROLE_CUSTOMER, ROLE_HOTEL_MANAGER
phone VARCHAR(14) UNIQUE
address VARCHAR(255)
account_status VARCHAR(20) -- ACTIVE, SUSPENDED
suspension_reason VARCHAR(255)
```

### Hotels Table
```sql
id BIGINT PRIMARY KEY
name VARCHAR(255)
city VARCHAR(255)
state VARCHAR(255)
address VARCHAR(255)
description TEXT
star_rating INT
rating DOUBLE
rating_count INT
amenities JSON
images JSON
status VARCHAR(20) -- PENDING, APPROVED, REJECTED
rejection_reason VARCHAR(255)
price_range VARCHAR(50)
owner_id BIGINT -- FK to users.user_id
```

### Bookings Table
```sql
id BIGINT PRIMARY KEY
booking_reference VARCHAR(50) UNIQUE
user_id BIGINT -- FK to users
hotel_id BIGINT -- FK to hotels
room_type_id BIGINT -- FK to room_types
check_in_date DATE
check_out_date DATE
total_price DECIMAL(10,2)
status VARCHAR(20) -- CONFIRMED, CANCELLED, COMPLETED
adults INT
children INT
rooms INT
booking_date DATE
guest_first_name VARCHAR(50)
guest_last_name VARCHAR(50)
guest_email VARCHAR(100)
guest_phone VARCHAR(20)
payment_status VARCHAR(20) -- PENDING, COMPLETED, FAILED
payment_method VARCHAR(50) -- CREDIT_CARD, UPI, NET_BANKING
transaction_id VARCHAR(100)
```

---

## Workflow Examples

### Hotel Owner Workflow
1. Owner registers → Gets ROLE_HOTEL_MANAGER
2. Owner creates hotel → Status: PENDING
3. Admin reviews → Approves/Rejects
4. If approved → Hotel visible to customers
5. Owner manages rooms, views bookings, tracks revenue

### Customer Booking Workflow
1. Customer browses approved hotels
2. Checks room availability
3. Creates booking → Status: CONFIRMED, Payment: PENDING
4. Payment processed → Payment: COMPLETED
5. Check-in → Status: COMPLETED

### Admin Management Workflow
1. Reviews pending hotels → Approve/Reject
2. Monitors all payments
3. Manages problematic users → Suspend/Activate
4. Platform oversight

---

## Security Notes

- All `/api/owner/*` endpoints require ROLE_HOTEL_MANAGER
- All `/api/admin/*` endpoints require ROLE_ADMIN
- Hotel owners can only access their own hotels
- Customers can only access their own bookings
- Suspended users cannot login
- JWT tokens expire after 24 hours

---

## Default Test Accounts

```
Admin:
  Email: admin@stays.in
  Password: admin123
  Role: ROLE_ADMIN

Customer:
  Email: user@stays.in
  Password: password123
  Role: ROLE_CUSTOMER

Hotel Owner:
  Email: owner@stays.in
  Password: owner123
  Role: ROLE_HOTEL_MANAGER
```
