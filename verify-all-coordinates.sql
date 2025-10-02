-- Comprehensive check to see if ALL venues have valid coordinates

-- Activities: Check which ones are missing coordinates
SELECT 'ACTIVITIES - MISSING COORDINATES' as info;
SELECT id, name, slug, coordinates
FROM activities
WHERE is_active = true
  AND (coordinates IS NULL
       OR coordinates->>'lat' IS NULL
       OR coordinates->>'lng' IS NULL
       OR (coordinates->>'lat')::float = 41.0082  -- default value
      );

-- Hotels: Check which ones are missing coordinates
SELECT 'HOTELS - MISSING COORDINATES' as info;
SELECT id, name, slug, coordinates
FROM hotels
WHERE is_active = true
  AND (coordinates IS NULL
       OR coordinates->>'lat' IS NULL
       OR coordinates->>'lng' IS NULL
       OR (coordinates->>'lat')::float = 41.0082  -- default value
      );

-- Shopping: Check which ones are missing coordinates
SELECT 'SHOPPING - MISSING COORDINATES' as info;
SELECT id, name, slug, coordinates
FROM shopping
WHERE is_active = true
  AND (coordinates IS NULL
       OR coordinates->>'lat' IS NULL
       OR coordinates->>'lng' IS NULL
       OR (coordinates->>'lat')::float = 41.0082  -- default value
      );

-- Restaurants: Check which ones are missing coordinates
SELECT 'RESTAURANTS - MISSING COORDINATES' as info;
SELECT id, name, slug, coordinates
FROM restaurants
WHERE is_active = true
  AND (coordinates IS NULL
       OR coordinates->>'lat' IS NULL
       OR coordinates->>'lng' IS NULL
       OR (coordinates->>'lat')::float = 41.0082  -- default value
      );

-- Summary counts
SELECT 'SUMMARY' as info;

SELECT
  'activities' as table_name,
  COUNT(*) as total_active,
  COUNT(CASE WHEN coordinates IS NOT NULL
             AND coordinates->>'lat' IS NOT NULL
             AND (coordinates->>'lat')::float != 41.0082
        THEN 1 END) as has_real_coordinates,
  COUNT(*) - COUNT(CASE WHEN coordinates IS NOT NULL
                        AND coordinates->>'lat' IS NOT NULL
                        AND (coordinates->>'lat')::float != 41.0082
                   THEN 1 END) as missing_coordinates
FROM activities
WHERE is_active = true

UNION ALL

SELECT
  'hotels' as table_name,
  COUNT(*) as total_active,
  COUNT(CASE WHEN coordinates IS NOT NULL
             AND coordinates->>'lat' IS NOT NULL
             AND (coordinates->>'lat')::float != 41.0082
        THEN 1 END) as has_real_coordinates,
  COUNT(*) - COUNT(CASE WHEN coordinates IS NOT NULL
                        AND coordinates->>'lat' IS NOT NULL
                        AND (coordinates->>'lat')::float != 41.0082
                   THEN 1 END) as missing_coordinates
FROM hotels
WHERE is_active = true

UNION ALL

SELECT
  'shopping' as table_name,
  COUNT(*) as total_active,
  COUNT(CASE WHEN coordinates IS NOT NULL
             AND coordinates->>'lat' IS NOT NULL
             AND (coordinates->>'lat')::float != 41.0082
        THEN 1 END) as has_real_coordinates,
  COUNT(*) - COUNT(CASE WHEN coordinates IS NOT NULL
                        AND coordinates->>'lat' IS NOT NULL
                        AND (coordinates->>'lat')::float != 41.0082
                   THEN 1 END) as missing_coordinates
FROM shopping
WHERE is_active = true

UNION ALL

SELECT
  'restaurants' as table_name,
  COUNT(*) as total_active,
  COUNT(CASE WHEN coordinates IS NOT NULL
             AND coordinates->>'lat' IS NOT NULL
             AND (coordinates->>'lat')::float != 41.0082
        THEN 1 END) as has_real_coordinates,
  COUNT(*) - COUNT(CASE WHEN coordinates IS NOT NULL
                        AND coordinates->>'lat' IS NOT NULL
                        AND (coordinates->>'lat')::float != 41.0082
                   THEN 1 END) as missing_coordinates
FROM restaurants
WHERE is_active = true;
