-- DIAGNOSTIC SCRIPT - Find out what's REALLY in the database
-- This will show us exactly what images exist and why the mapping failed

-- 1. Show ALL shopping entity_ids that have images
SELECT 'SHOPPING ENTITY IDS WITH IMAGES:' as section;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

-- 2. Show ALL shopping places in the shopping table
SELECT 'ALL SHOPPING PLACES IN SHOPPING TABLE:' as section;
SELECT id, name
FROM shopping
ORDER BY id;

-- 3. Show which shopping places currently have images mapped
SELECT 'SHOPPING PLACES WITH MAPPED IMAGES:' as section;
SELECT s.id, s.name, COUNT(m.id) as current_images
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
HAVING COUNT(m.id) > 0
ORDER BY s.id;

-- 4. Show which shopping places have NO images
SELECT 'SHOPPING PLACES WITH NO IMAGES:' as section;
SELECT s.id, s.name
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
HAVING COUNT(m.id) = 0
ORDER BY s.id;

-- 5. Show if there are any unmapped shopping images we can use
SELECT 'UNMAPPED SHOPPING IMAGES AVAILABLE:' as section;
SELECT entity_id, COUNT(*) as available_images
FROM universal_media 
WHERE entity_type = 'shop'
AND entity_id NOT IN (
    SELECT DISTINCT s.id 
    FROM shopping s
    INNER JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
)
GROUP BY entity_id
ORDER BY entity_id;
