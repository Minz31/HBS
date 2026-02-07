@echo off
echo ============================================================
echo Checking and Fixing Users with NULL DOB or Address
echo ============================================================
echo.

echo Step 1: Checking for users with NULL values...
echo.
mysql -u root -proot hotel_booking_db -e "SELECT user_id, email, first_name, last_name, dob, address FROM users WHERE dob IS NULL OR address IS NULL OR address = '';"

echo.
echo ============================================================
echo.
set /p confirm="Do you want to fix these users? (Y/N): "

if /i "%confirm%" NEQ "Y" (
    echo Operation cancelled.
    pause
    exit /b
)

echo.
echo Step 2: Fixing NULL DOB values...
mysql -u root -proot hotel_booking_db -e "UPDATE users SET dob = '1990-01-01' WHERE dob IS NULL;"

echo Step 3: Fixing NULL/empty address values...
mysql -u root -proot hotel_booking_db -e "UPDATE users SET address = 'Not provided' WHERE address IS NULL OR address = '';"

echo.
echo Step 4: Verifying the fix...
mysql -u root -proot hotel_booking_db -e "SELECT user_id, email, first_name, last_name, dob, address FROM users WHERE dob IS NULL OR address IS NULL OR address = '';"

echo.
echo ============================================================
echo Fix completed!
echo ============================================================
echo.
pause
