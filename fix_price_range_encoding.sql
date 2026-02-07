-- Fix price_range encoding issues (? symbols instead of ₹)
-- This script updates hotels with malformed price ranges

-- Check current price ranges
SELECT id, name, price_range 
FROM hotels 
WHERE price_range LIKE '%?%' OR price_range LIKE '%₹%';

-- Option 1: Set to "Contact for pricing" for hotels without room types
UPDATE hotels 
SET price_range = 'Contact for pricing'
WHERE price_range LIKE '%?%';

-- Option 2: If you want to keep numeric values, remove currency symbols
-- UPDATE hotels 
-- SET price_range = REPLACE(REPLACE(price_range, '?', ''), '₹', '')
-- WHERE price_range LIKE '%?%' OR price_range LIKE '%₹%';

-- Verify the fix
SELECT id, name, price_range 
FROM hotels;
