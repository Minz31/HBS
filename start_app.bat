@echo off
echo ============================================
echo Starting Hotel Booking System Services...
echo ============================================

echo 1. Starting Spring Boot Backend (Port 8080)...
start "Spring Boot Backend" cmd /k "cd springboot_backend_jwt && mvnw.cmd spring-boot:run"

echo 2. Starting .NET Invoice Service (Port 5000)...
start ".NET Invoice Service" cmd /k "cd HotelBookingInvoiceService\InvoiceService && dotnet run"

echo 3. Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ============================================
echo All services are launching in separate windows.
echo Please wait a few moments for them to initialize.
echo ============================================
