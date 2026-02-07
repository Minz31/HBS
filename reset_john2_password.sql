-- Reset password for john2@example.com to "password123"
-- Bcrypt hash for "password123"

UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'john2@example.com';

-- Verify the update
SELECT user_id, email, first_name, user_role, dob, address 
FROM users 
WHERE email = 'john2@example.com';
