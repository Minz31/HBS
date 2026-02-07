# Login Credentials for Testing

## Default Test Users

### Admin Account
- **Email**: `admin@stays.in`
- **Password**: `admin123`
- **Role**: ADMIN
- **Access**: Full system administration

### Customer Account
- **Email**: `user@stays.in`
- **Password**: `password123`
- **Role**: CUSTOMER
- **Access**: Book hotels, view bookings, write reviews

### Hotel Owner Account
- **Email**: `owner@stays.in`
- **Password**: `owner123`
- **Role**: HOTEL_MANAGER
- **Access**: Manage hotels, rooms, bookings

### Test Customer Account
- **Email**: `test@test.com`
- **Password**: `test123`
- **Role**: CUSTOMER
- **Access**: Book hotels, view bookings

## Other Users in Database

The following users exist but you may need to reset their passwords:
- owner3@gamil.com (CUSTOMER)
- owner4@gamil.com (HOTEL_MANAGER)
- owner4@gmail.com (HOTEL_MANAGER)
- user2@gmail.com (CUSTOMER)
- owner1@gmail.com (HOTEL_MANAGER)
- user1@gmail.com (CUSTOMER)
- sai2@gmail.com (CUSTOMER)
- nhowner1@g.com (HOTEL_MANAGER)
- john2@example.com (HOTEL_MANAGER)

## Common Login Issues

### Issue: "Invalid email or password" error

**Possible Causes:**
1. **Wrong password** - Make sure you're using the correct password
2. **Email typo** - Check for typos in the email
3. **User doesn't exist** - The email might not be registered
4. **Password not encrypted** - Old users might have unencrypted passwords

**Solutions:**

#### Solution 1: Use Default Test Accounts
Use one of the default accounts listed above with their known passwords.

#### Solution 2: Check Backend Logs
When you try to login, check the backend logs for the actual error:
```bash
# The logs will show:
# "User by this email doesn't exist: [email]" - User not found
# "Invalid email or password" - Wrong password
# "Account suspended: Contact admin" - Account is suspended
```

#### Solution 3: Reset Password (if needed)
If you need to reset a password for a specific user, you can run this SQL:
```sql
-- For user1@gmail.com with password "password123"
UPDATE users 
SET password = '$2a$10$YourBcryptHashHere'
WHERE email = 'user1@gmail.com';
```

Or use the backend's password reset endpoint if available.

## Testing Login

### Test Steps:
1. **Start Backend**: Backend should be running on port 8080
2. **Go to Login Page**: http://localhost:5173/login (or your frontend port)
3. **Enter Credentials**: Use one of the default accounts above
4. **Submit**: Click login button
5. **Check Result**: 
   - Success: Redirects to appropriate dashboard
   - Failure: Shows error message

### Expected Behavior:
- **Admin**: Redirects to `/admin/dashboard`
- **Customer**: Redirects to `/` (home page)
- **Hotel Owner**: Redirects to `/owner/dashboard`

## Backend Status
✅ Backend is running on port 8080
✅ Database connected
✅ All users have DOB and address fields populated

## Troubleshooting

If login still fails:
1. Check backend logs: Look at the terminal running the backend
2. Check browser console: Look for API errors
3. Verify backend is running: http://localhost:8080/swagger-ui.html
4. Test API directly: Use Swagger UI to test `/api/users/signin` endpoint
