# Mandatory DOB and Address Fields - Implementation

## Overview
Made Date of Birth (DOB) and Address mandatory fields in both frontend and backend to prevent NULL values in the database.

## Changes Implemented

### Backend Changes

#### 1. **User Entity** (`User.java`)
```java
// Added nullable = false constraint
@Column(nullable = false)
private LocalDate dob;

@Column(length = 255, nullable = false)
private String address;
```

**Impact**: Database will enforce NOT NULL constraint on these columns.

#### 2. **UserRegDTO** (`UserRegDTO.java`)
Added comprehensive validation annotations:

```java
@NotNull(message = "Date of birth is required")
@Past(message = "Date of birth must be in the past")
private LocalDate dob;

@NotBlank(message = "Address is required")
@Size(min = 10, max = 255, message = "Address must be between 10 and 255 characters")
private String address;
```

**Complete Validation Rules**:
- **First Name**: Required, 2-30 characters
- **Last Name**: Required, 2-30 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters
- **Phone**: Required, 10-14 digits
- **DOB**: Required, must be in the past, user must be 18+
- **Address**: Required, 10-255 characters

#### 3. **UserController** (`UserController.java`)
Already uses `@Valid` annotation on signup endpoint:
```java
@PostMapping("/signup")
public ResponseEntity<?> signUp(@RequestBody @Valid UserRegDTO dto)
```

This ensures all validation rules are enforced.

### Frontend Changes

#### 1. **RegisterPage** (`RegisterPage.jsx`)

**Added DOB Field**:
```javascript
<input
  name="dob"
  type="date"
  required
  max={18 years ago}
  className="input-field"
/>
```

**Added Validation Function**:
```javascript
const validateForm = () => {
  // Validates all fields including:
  // - First/Last name (min 2 chars)
  // - Email (valid format)
  // - Password (min 6 chars)
  // - Phone (10-14 digits)
  // - DOB (must be 18+, not in future)
  // - Address (min 10 chars)
}
```

**Enhanced Features**:
- Real-time error display
- Field-specific error messages
- Error clearing on input
- Visual error indicators (red borders)
- Age validation (18+ years)
- Better user feedback

#### 2. **Form State**
```javascript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  dob: '',        // NEW: Required field
  address: '',    // NOW: Required (was optional)
  regAmount: 500
});

const [errors, setErrors] = useState({}); // NEW: Error tracking
```

## Validation Rules

### Date of Birth (DOB)
- **Required**: Cannot be empty
- **Format**: YYYY-MM-DD (HTML5 date input)
- **Age Restriction**: Must be at least 18 years old
- **Past Date**: Cannot be in the future
- **Frontend**: HTML5 date picker with max date set to 18 years ago
- **Backend**: `@Past` annotation ensures date is in the past

### Address
- **Required**: Cannot be empty
- **Minimum Length**: 10 characters
- **Maximum Length**: 255 characters
- **Format**: Free text (street, city, state, zip)
- **Frontend**: Textarea for multi-line input
- **Backend**: `@NotBlank` and `@Size` validation

## User Experience

### Registration Flow
1. User fills all fields (all marked with *)
2. Frontend validates on submit
3. Shows specific error messages for each field
4. Backend validates again (double validation)
5. Returns detailed error messages if validation fails
6. Success: Redirects to login page

### Error Messages

**Frontend Validation Errors**:
- "First name is required"
- "First name must be at least 2 characters"
- "Email is required"
- "Please enter a valid email address"
- "Password must be at least 6 characters"
- "Phone number must be 10-14 digits"
- "Date of birth is required"
- "You must be at least 18 years old"
- "Date of birth cannot be in the future"
- "Address is required"
- "Address must be at least 10 characters"

**Backend Validation Errors**:
- Returns field-specific error messages
- Handled by Spring Boot validation framework
- Displayed as toast notifications

## Database Migration

### For Existing Users with NULL Values

If you have existing users with NULL DOB or Address, you need to:

**Option 1: Update Existing Records**
```sql
-- Set default DOB for NULL values (e.g., 1990-01-01)
UPDATE users 
SET dob = '1990-01-01' 
WHERE dob IS NULL;

-- Set default address for NULL values
UPDATE users 
SET address = 'Address not provided' 
WHERE address IS NULL OR address = '';
```

**Option 2: Delete Invalid Records**
```sql
-- Delete users with NULL values (use with caution!)
DELETE FROM users 
WHERE dob IS NULL OR address IS NULL OR address = '';
```

**Option 3: Prompt Users to Update**
- Force users to update their profile on next login
- Show a modal/banner requesting profile completion
- Disable certain features until profile is complete

### Database Schema Update

Spring Boot with `ddl-auto=update` will:
1. Add NOT NULL constraint to `dob` column
2. Add NOT NULL constraint to `address` column

**Note**: This may fail if existing NULL values exist. Clean data first!

## Testing Checklist

### Frontend Tests
- [ ] Submit form with empty DOB → Shows error
- [ ] Submit form with empty address → Shows error
- [ ] Submit form with address < 10 chars → Shows error
- [ ] Submit form with future DOB → Shows error
- [ ] Submit form with age < 18 → Shows error
- [ ] Submit valid form → Success
- [ ] Error messages display correctly
- [ ] Error messages clear on input
- [ ] Red borders show on invalid fields
- [ ] Date picker max date is 18 years ago

### Backend Tests
- [ ] POST /api/users/signup with NULL dob → 400 Bad Request
- [ ] POST /api/users/signup with NULL address → 400 Bad Request
- [ ] POST /api/users/signup with short address → 400 Bad Request
- [ ] POST /api/users/signup with future dob → 400 Bad Request
- [ ] POST /api/users/signup with valid data → 201 Created
- [ ] Database enforces NOT NULL constraints

### Integration Tests
- [ ] Register new user with all fields → Success
- [ ] Try to register without DOB → Fails with error
- [ ] Try to register without address → Fails with error
- [ ] Error messages are user-friendly
- [ ] No NULL values in database after registration

## Files Modified

### Backend
1. `springboot_backend_jwt/src/main/java/com/hotel/entities/User.java`
   - Added `nullable = false` to dob and address columns

2. `springboot_backend_jwt/src/main/java/com/hotel/dtos/UserRegDTO.java`
   - Added validation annotations for all fields
   - Added DOB and address validation

### Frontend
1. `frontend/src/pages/RegisterPage.jsx`
   - Added DOB field
   - Made address required
   - Added comprehensive validation
   - Added error state management
   - Enhanced UI with error messages

## Future Enhancements

1. **Profile Completion Check**
   - Check if existing users have DOB/address
   - Prompt to complete profile on login
   - Show completion percentage

2. **Address Validation**
   - Integrate with address validation API
   - Auto-complete address suggestions
   - Validate postal codes

3. **DOB Verification**
   - Add age verification for certain features
   - Birthday reminders/offers
   - Age-appropriate content filtering

4. **Data Quality**
   - Regular audits for data completeness
   - Analytics on registration completion rates
   - A/B testing on form layouts

## Rollback Plan

If issues occur:

1. **Remove Backend Constraints**:
```java
// User.java
private LocalDate dob;  // Remove nullable = false
private String address; // Remove nullable = false
```

2. **Make Frontend Fields Optional**:
```javascript
// RegisterPage.jsx
// Remove 'required' attribute
// Remove validation for DOB and address
```

3. **Database Rollback**:
```sql
ALTER TABLE users MODIFY COLUMN dob DATE NULL;
ALTER TABLE users MODIFY COLUMN address VARCHAR(255) NULL;
```

## Support

For issues:
- Check backend logs for validation errors
- Check browser console for frontend errors
- Verify database constraints are applied
- Test with valid data first
- Check error message clarity

## Notes

- All existing users must have DOB and address before deploying
- Consider a grace period for existing users
- Provide clear communication about new requirements
- Monitor registration success rates after deployment
- Have customer support ready for questions
