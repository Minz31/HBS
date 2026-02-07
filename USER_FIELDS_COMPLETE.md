# User Fields Implementation - DOB and Address Mandatory

## Status: COMPLETE ✅

## Changes Made

### 1. Frontend Changes - RegisterPage.jsx
- ✅ Removed 18+ age restriction from DOB validation
- ✅ Changed `max` attribute to allow any past date (not just 18+ years ago)
- ✅ DOB validation now only checks:
  - Field is required
  - Date cannot be in the future
- ✅ Address field remains mandatory with 10-255 character validation
- ✅ Real-time validation with error messages
- ✅ Visual error indicators (red borders)

### 2. Frontend Changes - Hoteliers.jsx (Hotel Owner Registration)
- ✅ Added DOB field to Step 1 (Owner Details)
- ✅ Added Address field to Step 1 (Owner Details)
- ✅ Both fields are now included in the registration payload
- ✅ Date picker with max date set to today (no future dates)
- ✅ Address textarea with placeholder text
- ✅ Updated form state to include `ownerDob` and `ownerAddress`
- ✅ Updated registration data to send DOB and address to backend

### 3. Backend Changes (Already Complete)
- ✅ User entity has `nullable = false` for both `dob` and `address`
- ✅ UserRegDTO has comprehensive validation:
  - `@NotNull` for DOB
  - `@Past` for DOB (must be in the past)
  - `@NotBlank` for address
  - `@Size(min = 10, max = 255)` for address
- ✅ DataLoader creates all users with valid DOB and address values

### 4. Database Fix Script Created
Created `fix_null_user_fields.sql` to handle existing users with NULL values:
```sql
-- Check for users with NULL DOB or address
SELECT user_id, email, first_name, last_name, dob, address 
FROM users 
WHERE dob IS NULL OR address IS NULL;

-- Update users with NULL DOB to a default date
UPDATE users 
SET dob = '1990-01-01' 
WHERE dob IS NULL;

-- Update users with NULL address to a default value
UPDATE users 
SET address = 'Not provided' 
WHERE address IS NULL OR address = '';
```

## How to Fix Gmail Login Error

If you're experiencing login errors with Gmail accounts, it's likely because those users have NULL values for DOB or address. Follow these steps:

### Option 1: Use the Batch Script (Easiest)
Simply run the provided batch script:
```bash
check_and_fix_users.bat
```

This will:
1. Check for users with NULL DOB or address
2. Ask for confirmation
3. Fix the NULL values automatically
4. Verify the fix

### Option 2: Manual SQL Execution
Run this query in your database:
```sql
-- Check for NULL values
SELECT user_id, email, first_name, last_name, dob, address 
FROM users 
WHERE dob IS NULL OR address IS NULL OR address = '';

-- Fix NULL DOB
UPDATE users SET dob = '1990-01-01' WHERE dob IS NULL;

-- Fix NULL/empty address
UPDATE users SET address = 'Not provided' WHERE address IS NULL OR address = '';
```

### Option 3: Use SQL File
```bash
mysql -u root -proot hotel_booking_db < fix_null_user_fields.sql
```

### After Fixing
The backend should automatically pick up the changes. If you still have issues:
1. Restart the Spring Boot backend (it's already running on port 8080)
2. Try logging in with your Gmail account again
3. It should work now!

## Validation Rules

### Frontend (RegisterPage.jsx)
- **First Name**: Required, 2-30 characters
- **Last Name**: Required, 2-30 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters
- **Phone**: Required, 10-14 digits
- **DOB**: Required, must be in the past (no age restriction)
- **Address**: Required, 10-255 characters

### Backend (UserRegDTO.java)
- **First Name**: `@NotBlank`, `@Size(min = 2, max = 30)`
- **Last Name**: `@NotBlank`, `@Size(min = 2, max = 30)`
- **Email**: `@NotBlank`, `@Email`
- **Password**: `@NotBlank`, `@Size(min = 6)`
- **Phone**: `@NotBlank`, `@Pattern(regexp = "^[0-9]{10,14}$")`
- **DOB**: `@NotNull`, `@Past`
- **Address**: `@NotBlank`, `@Size(min = 10, max = 255)`

## Testing

### Test New User Registration (Customer)
1. Go to `/register`
2. Fill in all fields including DOB (any past date) and address
3. Submit the form
4. Should successfully create account and redirect to login

### Test Hotel Owner Registration
1. Go to `/hoteliers`
2. Click "Register Your Hotel"
3. Step 1: Fill in owner details including DOB and address
4. Step 2: Fill in hotel details
5. Step 3: Select amenities and submit
6. Should successfully create owner account + hotel and auto-login

### Test Existing User Login
1. Ensure database has been fixed (no NULL values)
2. Go to `/login`
3. Enter email and password
4. Should successfully log in without errors

## Notes
- Age restriction has been completely removed - users can enter any date of birth as long as it's in the past
- All new users must provide DOB and address during registration
- Existing users with NULL values must be fixed using the SQL script
- The backend will reject any registration attempts without DOB or address
- DataLoader creates sample users with valid DOB and address values
