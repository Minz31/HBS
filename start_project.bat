@echo off
echo ========================================
echo   Hotel Booking System - Full Startup
echo ========================================

echo.
echo 1. Starting MySQL Database...
echo Make sure MySQL is running on localhost:3306
echo Username: root, Password: root
echo.

echo 2. Starting Spring Boot Backend (Port 8080)...
start "Spring Boot Backend" cmd /k "cd /d springboot_backend_jwt && mvn spring-boot:run"

echo.
echo 3. Starting .NET Invoice Service (Port 5000)...
start ".NET Invoice Service" cmd /k "cd /d HotelBookingInvoiceService\InvoiceService && dotnet run"

echo.
echo 4. Starting React Frontend (Port 3000/5173)...
start "React Frontend" cmd /k "cd /d frontend && npm run dev"

echo.
echo ========================================
echo   All services are starting...
echo ========================================
echo.
echo Services will be available at:
echo - Frontend: http://localhost:3000 or http://localhost:5173
echo - Backend API: http://localhost:8080/api
echo - Invoice Service: http://localhost:5000/api
echo.
echo Test Credentials:
echo - Admin: admin@stays.in / admin123
echo - Customer: user@stays.in / password123
echo - Hotel Manager: owner@stays.in / owner123
echo.
echo Press any key to exit...
pause > nul