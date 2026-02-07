# Automatic Room Assignment Feature

## Feature Implemented: Automatic Room Number Assignment

### Overview
When a customer books a hotel, the system now:
1. **Automatically assigns specific room numbers** (e.g., Room 101, 102)
2. **Shows room numbers** in booking confirmation
3. **Marks rooms as OCCUPIED** in database
4. **Auto-increments** to next available room for new bookings
5. **Displays occupied rooms** on owner dashboard

## Changes Made

### 1. Backend - BookingResponseDTO.java
Added fields to show assigned room numbers:
```java
private List<String> assignedRoomNumbers;  // ["101", "102"]
private String roomNumbersDisplay;  // "101, 102"
```

### 2. Backend - BookingServiceImpl.java
Updated `mapToBookingResponseDTO()` to include room numbers:
```java
// Get assigned room numbers from room_occupancy table
List<RoomOccupancy> occupancies = roomOccupancyRepository.findByBookingId(booking.getId());
List<String> roomNumbers = occupancies.stream()
        .map(occ -> occ.getRoom().getRoomNumber())
        .collect(Collectors.toList());

dto.setAssignedRoomNumbers(roomNumbers);
dto.setRoomNumbersDisplay(String.join(", ", roomNumbers));
```

### 3. Backend - RoomOccupancyServiceImpl.java

#### When Booking is Created:
```java
@Override
public void createRoomOccupancy(Booking booking) {
    // Get available rooms
    List<Room> availableRooms = getAvailableRooms(...);
    
    // Assign rooms and mark as OCCUPIED
    for (int i = 0; i < booking.getRooms(); i++) {
        Room room = availableRooms.get(i);
        
        // Create occupancy record
        RoomOccupancy occupancy = new RoomOccupancy();
        occupancy.setRoom(room);
        occupancy.setBooking(booking);
        occupancy.setStatus("ACTIVE");
        roomOccupancyRepository.save(occupancy);
        
        // Mark room as OCCUPIED
        room.setStatus("OCCUPIED");
        roomRepository.save(room);
    }
}
```

#### When Booking is Cancelled:
```java
@Override
public void cancelRoomOccupancy(Long bookingId) {
    List<RoomOccupancy> occupancies = roomOccupancyRepository.findByBookingId(bookingId);
    
    for (RoomOccupancy occupancy : occupancies) {
        occupancy.setStatus("CANCELLED");
        roomOccupancyRepository.save(occupancy);
        
        // Mark room as AVAILABLE again
        Room room = occupancy.getRoom();
        room.setStatus("AVAILABLE");
        roomRepository.save(room);
    }
}
```

#### When Checkout Date Passes:
```java
@Override
public void processExpiredOccupancies() {
    LocalDate today = LocalDate.now();
    List<RoomOccupancy> expiredOccupancies = roomOccupancyRepository.findAllExpiredOccupancies(today);
    
    for (RoomOccupancy occupancy : expiredOccupancies) {
        occupancy.setStatus("COMPLETED");
        roomOccupancyRepository.save(occupancy);
        
        // Mark room as AVAILABLE after checkout
        Room room = occupancy.getRoom();
        room.setStatus("AVAILABLE");
        roomRepository.save(room);
    }
}
```

## How It Works

### Booking Flow

1. **Customer Books Hotel**
   - Selects hotel, room type, dates
   - Clicks "Book Now"

2. **System Finds Available Rooms**
   - Queries `rooms` table for rooms of selected type
   - Filters out rooms already occupied for those dates
   - Returns list of available rooms sorted by room number

3. **System Assigns Rooms**
   - Takes first N available rooms (where N = number of rooms booked)
   - Creates `room_occupancy` record for each room
   - Updates `rooms.status` to "OCCUPIED"

4. **Customer Sees Room Numbers**
   - Booking confirmation shows: "Room 101, 102"
   - Stored in database for reference

### Auto-Increment Logic

The system automatically selects the next available room:

**Example:**
- Hotel has rooms: 101, 102, 103, 104, 105
- Customer 1 books 2 rooms → Gets 101, 102 (marked OCCUPIED)
- Customer 2 books 1 room → Gets 103 (next available)
- Customer 3 books 2 rooms → Gets 104, 105
- Customer 1 checks out → 101, 102 become AVAILABLE again
- Customer 4 books 1 room → Gets 101 (first available)

### Database Tables

#### rooms
```sql
| id | room_number | room_type_id | hotel_id | status    |
|----|-------------|--------------|----------|-----------|
| 1  | 101         | 6            | 5        | OCCUPIED  |
| 2  | 102         | 6            | 5        | OCCUPIED  |
| 3  | 103         | 6            | 5        | AVAILABLE |
| 4  | 104         | 6            | 5        | AVAILABLE |
```

#### room_occupancy
```sql
| id | room_id | booking_id | check_in   | check_out  | status |
|----|---------|------------|------------|------------|--------|
| 1  | 1       | 7          | 2026-02-23 | 2026-02-24 | ACTIVE |
| 2  | 2       | 7          | 2026-02-23 | 2026-02-24 | ACTIVE |
```

#### bookings
```sql
| id | user_id | hotel_id | room_type_id | status    | rooms |
|----|---------|----------|--------------|-----------|-------|
| 7  | 5       | 5        | 6            | CONFIRMED | 2     |
```

## Frontend Display

### Customer Booking Page
```javascript
// In Bookings.jsx
<div className="booking-details">
  <h3>Booking Confirmed</h3>
  <p>Hotel: {booking.hotelName}</p>
  <p>Room Type: {booking.roomTypeName}</p>
  <p>Room Numbers: {booking.roomNumbersDisplay}</p>  {/* "101, 102" */}
  <p>Check-in: {booking.checkInDate}</p>
  <p>Check-out: {booking.checkOutDate}</p>
</div>
```

### Owner Dashboard - Room Management
```javascript
// In RoomManagement.jsx
rooms.map(room => (
  <div className="room-card">
    <h4>Room {room.roomNumber}</h4>
    <span className={room.status === 'OCCUPIED' ? 'badge-red' : 'badge-green'}>
      {room.status}
    </span>
  </div>
))
```

## API Response Example

### GET /api/bookings (Customer)
```json
{
  "id": 7,
  "bookingReference": "HB-ABC12345",
  "hotelName": "4minar",
  "roomTypeName": "Standard",
  "checkInDate": "2026-02-23",
  "checkOutDate": "2026-02-24",
  "status": "CONFIRMED",
  "rooms": 2,
  "assignedRoomNumbers": ["101", "102"],
  "roomNumbersDisplay": "101, 102",
  "totalPrice": 5000
}
```

### GET /api/owner/rooms (Owner)
```json
[
  {
    "id": 1,
    "roomNumber": "101",
    "roomTypeId": 6,
    "status": "OCCUPIED",
    "currentBooking": {
      "bookingReference": "HB-ABC12345",
      "guestName": "John Doe",
      "checkIn": "2026-02-23",
      "checkOut": "2026-02-24"
    }
  },
  {
    "id": 3,
    "roomNumber": "103",
    "roomTypeId": 6,
    "status": "AVAILABLE"
  }
]
```

## Benefits

### For Customers
✅ Know exact room number immediately
✅ Can request specific room if needed
✅ Clear confirmation details
✅ Better planning (know which floor, etc.)

### For Hotel Owners
✅ See which rooms are occupied in real-time
✅ Track room utilization
✅ Manage room-specific issues
✅ Better housekeeping coordination

### For System
✅ Automatic room allocation
✅ No double-booking
✅ Efficient room utilization
✅ Clear audit trail

## Testing

### Test Booking Flow
1. **Create Booking**
   ```bash
   POST /api/bookings
   {
     "hotelId": 5,
     "roomTypeId": 6,
     "checkInDate": "2026-03-01",
     "checkOutDate": "2026-03-02",
     "rooms": 2
   }
   ```

2. **Check Response**
   - Should include `assignedRoomNumbers`: ["101", "102"]
   - Should include `roomNumbersDisplay`: "101, 102"

3. **Verify Database**
   ```sql
   -- Check rooms are marked OCCUPIED
   SELECT * FROM rooms WHERE id IN (1, 2);
   
   -- Check occupancy records created
   SELECT * FROM room_occupancy WHERE booking_id = 7;
   ```

4. **Cancel Booking**
   ```bash
   DELETE /api/bookings/7
   ```

5. **Verify Rooms Released**
   ```sql
   -- Check rooms are marked AVAILABLE again
   SELECT * FROM rooms WHERE id IN (1, 2);
   ```

## Files Modified
- ✅ `springboot_backend_jwt/src/main/java/com/hotel/dtos/BookingResponseDTO.java`
- ✅ `springboot_backend_jwt/src/main/java/com/hotel/service/BookingServiceImpl.java`
- ✅ `springboot_backend_jwt/src/main/java/com/hotel/service/RoomOccupancyServiceImpl.java`

## Status
✅ **Backend Implementation**: COMPLETE
⏳ **Frontend Display**: Needs update to show room numbers
⏳ **Owner Dashboard**: Needs update to show occupied rooms

## Next Steps (Frontend)
1. Update `Bookings.jsx` to display `roomNumbersDisplay`
2. Update `RoomManagement.jsx` to show room status colors
3. Add filter to show only OCCUPIED or AVAILABLE rooms
4. Add booking details tooltip on occupied rooms
