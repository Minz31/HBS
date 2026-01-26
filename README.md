# Hotel Booking System - Complete Setup & Run Guide

## Prerequisites
- **MySQL Server** running on `localhost:3306`
  - Username: `root`
  - Password: `root`
- **Java 17+** installed
- **Maven** installed
- **Node.js** installed
- **.NET 9.0** installed

## Quick Start (Automated)
```bash
# Run from HBS folder
start_project.bat
```

## Manual Startup (Step by Step)

### 1. Start MySQL Database
- Ensure MySQL is running on port 3306
- Database `hotel_booking_db` will be auto-created

### 2. Start Spring Boot Backend
```bash
cd springboot_backend_jwt
mvn spring-boot:run
```
- Runs on: http://localhost:8080
- API Base: http://localhost:8080/api

### 3. Start .NET Invoice Service
```bash
cd HotelBookingInvoiceService/InvoiceService
dotnet run
```
- Runs on: http://localhost:5000
- API: http://localhost:5000/api/invoice

### 4. Start React Frontend
```bash
cd frontend
npm install  # First time only
npm run dev
```
- Runs on: http://localhost:3000 or http://localhost:5173

## Test the System

### Login Credentials:
- **Admin**: `admin@stays.in` / `admin123`
- **Customer**: `user@stays.in` / `password123`
- **Hotel Manager**: `owner@stays.in` / `owner123`

### Test Flow:
1. Open frontend in browser
2. Login as customer
3. Browse hotels
4. Make a booking
5. Download invoice (tests .NET service)
6. Login as admin to view all bookings

## API Endpoints

### Spring Boot Backend (Port 8080):
- `POST /api/users/signin` - Login
- `POST /api/users/signup` - Register
- `GET /api/hotels` - List hotels
- `GET /api/hotels/search` - Search hotels
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User bookings

### .NET Invoice Service (Port 5000):
- `POST /api/invoice/generate` - Generate PDF invoice

## Troubleshooting

### Database Issues:
- Check MySQL is running
- Verify credentials (root/root)
- Database will auto-create on first run

### Port Conflicts:
- Backend: 8080
- Frontend: 3000/5173
- Invoice Service: 5000
- MySQL: 3306

### CORS Issues:
- All services configured for cross-origin requests
- Frontend ports (3000, 5173) are whitelisted

## Project Structure
```
HBS/
├── frontend/                 # React frontend
├── springboot_backend_jwt/   # Spring Boot API
├── HotelBookingInvoiceService/ # .NET PDF service
└── start_project.bat         # Startup script
```