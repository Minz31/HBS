# Hoteliers Page - DOB and Address Fix

## Issue
Hotel owner registration was failing with 400 Bad Request error:
```
{
  user.dob: 'Date of birth is required',
  user.address: 'Address is required',
  user.password: 'Password must be at least 6 characters',
  user.phone: 'Phone number must be 10-14 digits'
}
```

## Root Cause
The Hoteliers.jsx registration form was missing DOB and address fields in Step 1 (Owner Details), but the backend requires these fields as mandatory.

## Solution Applied

### Changes to frontend/src/pages/Hoteliers.jsx

1. **Added DOB field to form state:**
   ```javascript
   ownerDob: '',
   ownerAddress: '',
   ```

2. **Added DOB input field in Step 1:**
   ```jsx
   <div>
     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
       Date of Birth *
     </label>
     <input
       type="date"
       value={formData.ownerDob}
       onChange={(e) => setFormData({ ...formData, ownerDob: e.target.value })}
       max={new Date().toISOString().split('T')[0]}
       className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
     />
   </div>
   ```

3. **Added Address textarea field in Step 1:**
   ```jsx
   <div>
     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
       Address *
     </label>
     <textarea
       value={formData.ownerAddress}
       onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
       placeholder="Enter your full address (min. 10 characters)"
       rows="3"
       className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
     />
   </div>
   ```

4. **Updated registration payload:**
   ```javascript
   const registrationData = {
     user: {
       firstName: firstName,
       lastName: lastName,
       email: formData.ownerEmail,
       password: formData.password,
       phone: formData.ownerPhone,
       dob: formData.ownerDob,        // Added
       address: formData.ownerAddress  // Added
     },
     hotel: hotelData
   };
   ```

5. **Updated form reset:**
   Added `ownerDob: ''` and `ownerAddress: ''` to the reset state.

## Field Specifications

### Date of Birth (DOB)
- **Type**: Date picker
- **Required**: Yes
- **Validation**: Cannot be in the future (max = today)
- **No age restriction**: Users can enter any past date
- **Backend validation**: `@NotNull`, `@Past`

### Address
- **Type**: Textarea (3 rows)
- **Required**: Yes
- **Min length**: 10 characters
- **Max length**: 255 characters
- **Backend validation**: `@NotBlank`, `@Size(min = 10, max = 255)`

## Testing

### Test Hotel Owner Registration Flow:
1. Navigate to `/hoteliers`
2. Click "Register Your Hotel" button
3. **Step 1 - Owner Details:**
   - Enter Full Name (e.g., "John Smith")
   - Enter Email (e.g., "john@hotel.com")
   - Enter Password (min 6 characters)
   - Enter Phone Number (10-14 digits)
   - **Select Date of Birth** (any past date)
   - **Enter Address** (min 10 characters)
   - Click "Next Step"
4. **Step 2 - Hotel Details:**
   - Enter hotel information
   - Click "Next Step"
5. **Step 3 - Amenities:**
   - Select amenities
   - Click "Submit Registration"
6. Should successfully create account and auto-login

## Related Files
- `frontend/src/pages/Hoteliers.jsx` - Hotel owner registration form
- `frontend/src/pages/RegisterPage.jsx` - Customer registration form
- `springboot_backend_jwt/src/main/java/com/hotel/dtos/UserRegDTO.java` - Backend validation
- `springboot_backend_jwt/src/main/java/com/hotel/entities/User.java` - User entity

## Status
✅ **FIXED** - Hotel owner registration now includes DOB and address fields and should work correctly.
