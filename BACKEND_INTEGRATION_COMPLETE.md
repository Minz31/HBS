# Backend Integration Complete - API Documentation

## New Admin Endpoints

### Hotel Approval Management
```
GET    /api/admin/hotels/pending       - Get all pending hotels
GET    /api/admin/hotels/approved      - Get all approved hotels  
GET    /api/admin/hotels/rejected      - Get all rejected hotels
PATCH  /api/admin/hotels/{id}/approve  - Approve a hotel
PATCH  /api/admin/hotels/{id}/reject   - Reject a hotel (requires reason param)
```

### Payment Management
```
GET    /api/admin/payments             - Get all payments/bookings
GET    /api/admin/payments/pending     - Get pending payments
GET    /api/admin/payments/completed   - Get completed payments
GET    /api/admin/payments/failed      - Get failed payments
```

### User Account Management
```
GET    /api/admin/users                - Get all users
GET    /api/admin/users/suspended      - Get suspended users
PATCH  /api/admin/users/{id}/suspend   - Suspend user (requires reason param)
PATCH  /api/admin/users/{id}/activate  - Activate suspended user
```

### Room Availability Check
```
GET    /api/hotels/{hotelId}/rooms/{roomTypeId}/availability
       ?checkIn=2026-02-01&checkOut=2026-02-05&rooms=2
       - Returns true/false for room availability
```

## Database Schema Updates

### Booking Table (bookings)
- `payment_status` VARCHAR - PENDING, COMPLETED, FAILED
- `payment_method` VARCHAR - CREDIT_CARD, UPI, NET_BANKING
- `transaction_id` VARCHAR - Unique transaction identifier

### Hotel Table (hotels)
- `status` VARCHAR - PENDING, APPROVED, REJECTED
- `rejection_reason` VARCHAR - Reason for rejection
- `price_range` VARCHAR - Price range display (e.g., "₹5,000 - ₹15,000")
- `owner_id` BIGINT - Foreign key to users table (hotel owner)

### User Table (users)
- `account_status` VARCHAR - ACTIVE, SUSPENDED
- `suspension_reason` VARCHAR - Reason for suspension

## Integration Features

### 1. Booking Creation
- Automatically sets `paymentStatus` to "PENDING"
- Generates unique `transactionId` (TXN-XXXX format)
- Accepts `paymentMethod` from frontend
- Returns payment details in response

### 2. Hotel Creation
- New hotels automatically set to "PENDING" status
- Requires admin approval before visible to customers
- Can link to hotel owner via `owner_id`

### 3. User Registration
- New users automatically set to "ACTIVE" status
- Can be suspended by admin with reason

### 4. Authentication
- Suspended users cannot login
- Returns suspension reason in error message

### 5. Room Availability
- Checks total rooms vs booked rooms for date range
- Excludes cancelled bookings from count
- Returns boolean availability status

## Default Values

### New Users
- `accountStatus`: "ACTIVE"
- `userRole`: "ROLE_CUSTOMER" (for signup)

### New Hotels
- `status`: "PENDING"

### New Bookings
- `paymentStatus`: "PENDING"
- `paymentMethod`: "CREDIT_CARD" (if not provided)
- `transactionId`: Auto-generated (TXN-XXXX)
- `status`: "CONFIRMED"

## Security
- All `/api/admin/*` endpoints require `ROLE_ADMIN` authority
- Hotel management endpoints require `ROLE_HOTEL_MANAGER` authority
- Users can only access their own bookings
- Suspended users blocked at authentication level

## Response DTOs

### BookingResponseDTO (Enhanced)
```json
{
  "id": 1,
  "bookingReference": "HB-A1B2C3D4",
  "hotelName": "Taj Hotel",
  "checkInDate": "2026-02-01",
  "checkOutDate": "2026-02-05",
  "totalPrice": 50000,
  "status": "CONFIRMED",
  "paymentStatus": "PENDING",
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN-X1Y2Z3A4B5C6",
  "guestFirstName": "John",
  "guestEmail": "john@example.com"
}
```

## Testing

### Test Hotel Approval
```bash
# Get pending hotels
GET /api/admin/hotels/pending

# Approve hotel
PATCH /api/admin/hotels/1/approve

# Reject hotel
PATCH /api/admin/hotels/2/reject?reason=Incomplete documentation
```

### Test Payment Management
```bash
# View all payments
GET /api/admin/payments

# Filter by status
GET /api/admin/payments/pending
GET /api/admin/payments/completed
```

### Test User Management
```bash
# Suspend user
PATCH /api/admin/users/5/suspend?reason=Fraudulent activity

# Activate user
PATCH /api/admin/users/5/activate
```

### Test Room Availability
```bash
GET /api/hotels/1/rooms/1/availability?checkIn=2026-02-01&checkOut=2026-02-05&rooms=2
# Returns: true or false
```

## Migration Notes

1. **Database will auto-create new columns** on first run (Hibernate DDL)
2. **Existing data**: New columns will be NULL - set defaults via SQL if needed
3. **Frontend integration**: Update API calls to use new endpoints
4. **Payment flow**: Frontend should send `paymentMethod` in booking request

## Next Steps for Frontend

1. Update booking form to include payment method selection
2. Create admin dashboard pages for:
   - Hotel approvals (pending/approved/rejected tabs)
   - Payment management (filter by status)
   - User management (suspend/activate actions)
3. Add availability check before booking submission
4. Display payment status in booking history
5. Show hotel approval status in owner dashboard
