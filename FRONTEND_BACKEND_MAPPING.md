# Frontend-Backend API Mapping

## ✅ IMPLEMENTED & MATCHED

### PUBLIC APIs (No Authentication)

| Frontend Call | Backend Endpoint | Controller | Status |
|--------------|------------------|------------|--------|
| `publicAPI.getHotels()` | `GET /api/hotels` | HotelController | ✅ |
| `publicAPI.getHotel(id)` | `GET /api/hotels/{id}` | HotelController | ✅ |
| `publicAPI.searchHotels(city)` | `GET /api/hotels/search?city=` | HotelController | ✅ |
| `publicAPI.getHotelRooms(id)` | `GET /api/hotels/{id}/rooms` | HotelController | ✅ |
| `publicAPI.checkAvailability()` | `GET /api/hotels/{hotelId}/rooms/{roomTypeId}/availability` | HotelController | ✅ |

### CUSTOMER APIs (ROLE_CUSTOMER)

| Frontend Call | Backend Endpoint | Controller | Status |
|--------------|------------------|------------|--------|
| `customerAPI.login()` | `POST /api/users/signin` | UserController | ✅ |
| `customerAPI.register()` | `POST /api/users/signup` | UserController | ✅ |
| `customerAPI.getProfile()` | `GET /api/users/profile` | UserController | ✅ |
| `customerAPI.updateProfile()` | `PUT /api/users/profile` | UserController | ✅ |
| `customerAPI.changePassword()` | `PATCH /api/users/change-password` | UserController | ✅ |
| `customerAPI.createBooking()` | `POST /api/bookings` | BookingController | ✅ |
| `customerAPI.getMyBookings()` | `GET /api/bookings/my-bookings` | BookingController | ✅ |
| `customerAPI.updateBooking()` | `PUT /api/bookings/{id}` | BookingController | ✅ |
| `customerAPI.cancelBooking()` | `DELETE /api/bookings/{id}` | BookingController | ✅ |

### HOTEL OWNER APIs (ROLE_HOTEL_MANAGER)

| Frontend Call | Backend Endpoint | Controller | Status |
|--------------|------------------|------------|--------|
| `ownerAPI.getMyHotels()` | `GET /api/owner/hotels` | HotelOwnerController | ✅ |
| `ownerAPI.getMyHotel(id)` | `GET /api/owner/hotels/{id}` | HotelOwnerController | ✅ |
| `ownerAPI.createHotel()` | `POST /api/owner/hotels` | HotelOwnerController | ✅ |
| `ownerAPI.updateHotel()` | `PUT /api/owner/hotels/{id}` | HotelOwnerController | ✅ |
| `ownerAPI.deleteHotel()` | `DELETE /api/owner/hotels/{id}` | HotelOwnerController | ✅ |
| `ownerAPI.getHotelRooms()` | `GET /api/owner/hotels/{hotelId}/rooms` | HotelOwnerController | ✅ |
| `ownerAPI.addRoomType()` | `POST /api/owner/hotels/{hotelId}/rooms` | HotelOwnerController | ✅ |
| `ownerAPI.updateRoomType()` | `PUT /api/owner/hotels/{hotelId}/rooms/{roomId}` | HotelOwnerController | ✅ |
| `ownerAPI.deleteRoomType()` | `DELETE /api/owner/hotels/{hotelId}/rooms/{roomId}` | HotelOwnerController | ✅ |
| `ownerAPI.getMyBookings()` | `GET /api/owner/bookings` | HotelOwnerController | ✅ |
| `ownerAPI.getHotelBookings()` | `GET /api/owner/hotels/{hotelId}/bookings` | HotelOwnerController | ✅ |
| `ownerAPI.updateBookingStatus()` | `PATCH /api/owner/bookings/{id}/status` | HotelOwnerController | ✅ |
| `ownerAPI.getDashboardStats()` | `GET /api/owner/dashboard/stats` | HotelOwnerController | ✅ |

### ADMIN APIs (ROLE_ADMIN)

| Frontend Call | Backend Endpoint | Controller | Status |
|--------------|------------------|------------|--------|
| `adminAPI.getPendingHotels()` | `GET /api/admin/hotels/pending` | AdminController | ✅ |
| `adminAPI.getApprovedHotels()` | `GET /api/admin/hotels/approved` | AdminController | ✅ |
| `adminAPI.getRejectedHotels()` | `GET /api/admin/hotels/rejected` | AdminController | ✅ |
| `adminAPI.approveHotel()` | `PATCH /api/admin/hotels/{id}/approve` | AdminController | ✅ |
| `adminAPI.rejectHotel()` | `PATCH /api/admin/hotels/{id}/reject` | AdminController | ✅ |
| `adminAPI.getAllPayments()` | `GET /api/admin/payments` | AdminController | ✅ |
| `adminAPI.getPendingPayments()` | `GET /api/admin/payments/pending` | AdminController | ✅ |
| `adminAPI.getCompletedPayments()` | `GET /api/admin/payments/completed` | AdminController | ✅ |
| `adminAPI.getFailedPayments()` | `GET /api/admin/payments/failed` | AdminController | ✅ |
| `adminAPI.getAllUsers()` | `GET /api/admin/users` | AdminController | ✅ |
| `adminAPI.getSuspendedUsers()` | `GET /api/admin/users/suspended` | AdminController | ✅ |
| `adminAPI.suspendUser()` | `PATCH /api/admin/users/{id}/suspend` | AdminController | ✅ |
| `adminAPI.activateUser()` | `PATCH /api/admin/users/{id}/activate` | AdminController | ✅ |
| `adminAPI.getAllBookings()` | `GET /api/bookings` | BookingController | ✅ |

### INVOICE SERVICE (.NET)

| Frontend Call | Backend Endpoint | Service | Status |
|--------------|------------------|---------|--------|
| `invoiceAPI.generateInvoice()` | `POST http://localhost:5000/api/invoice/generate` | .NET InvoiceService | ✅ |

---

## ❌ NOT IMPLEMENTED (Frontend expects but backend missing)

### Reviews API
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `customerAPI.createReview()` | `POST /api/reviews` | ❌ Missing |
| `customerAPI.getHotelReviews()` | `GET /api/reviews/hotel/{id}` | ❌ Missing |
| `customerAPI.getMyReviews()` | `GET /api/reviews/my-reviews` | ❌ Missing |

**Note:** Review entity exists but ReviewController is incomplete

### Recently Viewed API
| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `customerAPI.addRecentlyViewed()` | `POST /api/recently-viewed/hotel/{id}` | ❌ Missing |
| `customerAPI.getRecentlyViewed()` | `GET /api/recently-viewed` | ❌ Missing |

**Note:** RecentlyViewed entity exists but RecentlyViewedController is incomplete

---

## BACKEND CONTROLLERS SUMMARY

### ✅ Complete Controllers
1. **UserController** - `/api/users/*` - Auth, profile, password management
2. **HotelController** - `/api/hotels/*` - Public hotel browsing
3. **BookingController** - `/api/bookings/*` - Booking management
4. **HotelOwnerController** - `/api/owner/*` - Hotel owner operations
5. **AdminController** - `/api/admin/*` - Admin operations

### ⚠️ Incomplete Controllers
1. **ReviewController** - Exists but needs implementation
2. **RecentlyViewedController** - Exists but needs implementation

---

## SPRING BOOT BACKEND FILES

### Controllers (in `springboot_backend_jwt/src/main/java/com/hotel/controller/`)
- ✅ UserController.java
- ✅ HotelController.java
- ✅ BookingController.java
- ✅ HotelOwnerController.java (NEW)
- ✅ AdminController.java (NEW)
- ⚠️ ReviewController.java (incomplete)
- ⚠️ RecentlyViewedController.java (incomplete)

### Services (in `springboot_backend_jwt/src/main/java/com/hotel/service/`)
- ✅ UserService.java + UserServiceImpl.java
- ✅ HotelService.java + HotelServiceImpl.java
- ✅ BookingService.java + BookingServiceImpl.java
- ✅ HotelOwnerService.java + HotelOwnerServiceImpl.java (NEW)
- ✅ AdminService.java + AdminServiceImpl.java (NEW)
- ⚠️ ReviewService.java (incomplete)
- ⚠️ RecentlyViewedService.java (incomplete)

### Entities (in `springboot_backend_jwt/src/main/java/com/hotel/entities/`)
- ✅ User.java (with accountStatus, suspensionReason)
- ✅ Hotel.java (with status, rejectionReason, priceRange, owner)
- ✅ Booking.java (with paymentStatus, paymentMethod, transactionId)
- ✅ RoomType.java
- ✅ Room.java
- ✅ Review.java
- ✅ RecentlyViewed.java

### Repositories (in `springboot_backend_jwt/src/main/java/com/hotel/repository/`)
- ✅ UserRepository.java (with findByAccountStatus)
- ✅ HotelRepository.java (with findByStatus, findByOwnerId)
- ✅ BookingRepository.java (with findByPaymentStatus)
- ✅ RoomTypeRepository.java
- ✅ RoomRepository.java (with countAvailableRooms)
- ✅ ReviewRepository.java
- ✅ RecentlyViewedRepository.java

---

## WHAT NEEDS TO BE DONE

### Option 1: Complete Missing APIs (Recommended)
Implement ReviewController and RecentlyViewedController to match frontend expectations.

### Option 2: Remove from Frontend
Remove review and recently viewed features from frontend if not needed.

---

## TESTING CHECKLIST

### Customer Flow
- [ ] Register new account
- [ ] Login
- [ ] Browse hotels
- [ ] Search hotels by city
- [ ] View hotel details
- [ ] Check room availability
- [ ] Create booking
- [ ] View my bookings
- [ ] Cancel booking
- [ ] Update profile
- [ ] Change password

### Hotel Owner Flow
- [ ] Login as hotel owner
- [ ] Create new hotel (status: PENDING)
- [ ] View my hotels
- [ ] Add room types
- [ ] Update hotel details
- [ ] View bookings for my hotels
- [ ] Update booking status
- [ ] View dashboard stats

### Admin Flow
- [ ] Login as admin
- [ ] View pending hotels
- [ ] Approve hotel
- [ ] Reject hotel with reason
- [ ] View all payments
- [ ] Filter payments by status
- [ ] View all users
- [ ] Suspend user with reason
- [ ] Activate suspended user
- [ ] View all bookings

---

## FRONTEND INTEGRATION FILES

### Use This File
**`frontend/src/services/completeAPI.js`** - Complete API service matching all backend endpoints

### Replace Old Files
- ❌ `frontend/src/services/api.js` - Old, incomplete
- ❌ `frontend/src/services/apiService.js` - Old, incomplete
- ✅ `frontend/src/services/customerAPI.js` - Keep for backward compatibility
- ✅ `frontend/src/services/completeAPI.js` - NEW, use this

### Import Example
```javascript
// In your React components
import { 
  publicAPI, 
  customerAPI, 
  ownerAPI, 
  adminAPI 
} from '../services/completeAPI';

// Usage
const hotels = await publicAPI.getHotels();
const bookings = await customerAPI.getMyBookings();
const myHotels = await ownerAPI.getMyHotels();
const pendingHotels = await adminAPI.getPendingHotels();
```

---

## SUMMARY

✅ **Core functionality 100% implemented**
- Authentication & Authorization
- Hotel browsing & search
- Booking management
- Hotel owner operations
- Admin operations
- Payment tracking
- User management

⚠️ **Optional features need implementation**
- Reviews (entity exists, controller incomplete)
- Recently Viewed (entity exists, controller incomplete)

🎯 **All main requirements met!**
