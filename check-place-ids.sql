-- Check if venues have Google Place IDs stored

-- Check shopping table
SELECT 'shopping' as table_name,
       COUNT(*) as total,
       COUNT(CASE WHEN google_place_id IS NOT NULL THEN 1 END) as has_place_id
FROM shopping
WHERE is_active = true

UNION ALL

-- Check hotels table
SELECT 'hotels' as table_name,
       COUNT(*) as total,
       COUNT(CASE WHEN google_place_id IS NOT NULL THEN 1 END) as has_place_id
FROM hotels
WHERE is_active = true

UNION ALL

-- Check restaurants table
SELECT 'restaurants' as table_name,
       COUNT(*) as total,
       COUNT(CASE WHEN google_place_id IS NOT NULL THEN 1 END) as has_place_id
FROM restaurants
WHERE is_active = true

UNION ALL

-- Check activities table
SELECT 'activities' as table_name,
       COUNT(*) as total,
       COUNT(CASE WHEN google_place_id IS NOT NULL THEN 1 END) as has_place_id
FROM activities
WHERE is_active = true;

-- Sample some place IDs to verify format
SELECT 'SAMPLE PLACE IDS' as info;

SELECT name, google_place_id
FROM shopping
WHERE is_active = true AND google_place_id IS NOT NULL
LIMIT 3;
