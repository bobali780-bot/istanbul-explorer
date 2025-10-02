-- DEBUG CURRENT SHOPPING IMAGE STATE
-- Let's see exactly what's in the database right now

-- 1. Show all shopping places and their image counts
SELECT 'CURRENT SHOPPING IMAGE DISTRIBUTION:' as section;
SELECT 
    s.id,
    s.name,
    COALESCE(img_count.image_count, 0) as image_count,
    CASE WHEN img_count.image_count > 0 THEN '✅ HAS IMAGES' ELSE '❌ NO IMAGES' END as status
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
ORDER BY s.id;

-- 2. Show which entity_ids have images in universal_media
SELECT 'ENTITY_IDS WITH IMAGES IN UNIVERSAL_MEDIA:' as section;
SELECT 
    entity_id,
    COUNT(*) as image_count,
    MIN(id) as first_image_id,
    MAX(id) as last_image_id
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

-- 3. Show sample image URLs for the places that have images
SELECT 'SAMPLE IMAGE URLS FOR PLACES WITH IMAGES:' as section;
SELECT 
    um.entity_id,
    s.name,
    um.media_url
FROM universal_media um
JOIN shopping s ON um.entity_id = s.id
WHERE um.entity_type = 'shop'
AND um.entity_id IN (41, 43, 46, 47)  -- The 4 places that currently show images
ORDER BY um.entity_id, um.id
LIMIT 8;

-- 4. Total image count available
SELECT 'TOTAL SHOPPING IMAGES AVAILABLE:' as section;
SELECT COUNT(*) as total_shopping_images
FROM universal_media 
WHERE entity_type = 'shop';

SELECT 'DEBUG COMPLETE!' as final_status;
