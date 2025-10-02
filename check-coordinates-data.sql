-- Check if coordinates are populated in all category tables

-- Check activities
SELECT 'ACTIVITIES' as table_name,
       COUNT(*) as total_records,
       COUNT(coordinates) as has_coordinates,
       COUNT(CASE WHEN coordinates IS NOT NULL AND coordinates->>'lat' IS NOT NULL THEN 1 END) as valid_coordinates
FROM activities
WHERE is_active = true;

-- Check hotels
SELECT 'HOTELS' as table_name,
       COUNT(*) as total_records,
       COUNT(coordinates) as has_coordinates,
       COUNT(CASE WHEN coordinates IS NOT NULL AND coordinates->>'lat' IS NOT NULL THEN 1 END) as valid_coordinates
FROM hotels
WHERE is_active = true;

-- Check shopping
SELECT 'SHOPPING' as table_name,
       COUNT(*) as total_records,
       COUNT(coordinates) as has_coordinates,
       COUNT(CASE WHEN coordinates IS NOT NULL AND coordinates->>'lat' IS NOT NULL THEN 1 END) as valid_coordinates
FROM shopping
WHERE is_active = true;

-- Check restaurants
SELECT 'RESTAURANTS' as table_name,
       COUNT(*) as total_records,
       COUNT(coordinates) as has_coordinates,
       COUNT(CASE WHEN coordinates IS NOT NULL AND coordinates->>'lat' IS NOT NULL THEN 1 END) as valid_coordinates
FROM restaurants
WHERE is_active = true;

-- Sample coordinates from each table to verify they're not all default values
SELECT 'SAMPLE COORDINATES' as info;

SELECT 'activities' as table_name, name, coordinates
FROM activities
WHERE is_active = true
LIMIT 3;

SELECT 'hotels' as table_name, name, coordinates
FROM hotels
WHERE is_active = true
LIMIT 3;

SELECT 'shopping' as table_name, name, coordinates
FROM shopping
WHERE is_active = true
LIMIT 3;

SELECT 'restaurants' as table_name, name, coordinates
FROM restaurants
WHERE is_active = true
LIMIT 3;
