-- Check for users with NULL DOB or address
SELECT user_id, email, first_name, last_name, dob, address 
FROM users 
WHERE dob IS NULL OR address IS NULL;

-- Update users with NULL DOB to a default date (1990-01-01)
UPDATE users 
SET dob = '1990-01-01' 
WHERE dob IS NULL;

-- Update users with NULL address to a default value
UPDATE users 
SET address = 'Not provided' 
WHERE address IS NULL OR address = '';

-- Verify the fix
SELECT user_id, email, first_name, last_name, dob, address 
FROM users 
WHERE dob IS NULL OR address IS NULL;
