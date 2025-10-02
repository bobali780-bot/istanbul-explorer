-- FIND THE ACTUAL SHOPPING IMAGES FROM STAGING
-- These images were scraped but not properly linked during publishing

-- 1. Show all images that have 'shop' entity_type (from staging)
SELECT 'SHOPPING IMAGES FROM STAGING:' as section;
SELECT entity_id, entity_type, media_url, COUNT(*) OVER (PARTITION BY entity_id) as images_per_entity
FROM universal_media 
WHERE entity_type = 'shop'
ORDER BY entity_id, id
LIMIT 50;

-- 2. Show shopping places that need images
SELECT 'SHOPPING PLACES NEEDING IMAGES:' as section;
SELECT s.id, s.name, 
       CASE WHEN m.entity_id IS NULL THEN 'NO IMAGES' ELSE 'HAS IMAGES' END as status
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name, m.entity_id
ORDER BY s.id;

-- 3. Count total shopping images available
SELECT 'TOTAL SHOPPING IMAGES AVAILABLE:' as section;
SELECT COUNT(*) as total_shopping_images
FROM universal_media 
WHERE entity_type = 'shop';

-- 4. Show sample of what the images look like
SELECT 'SAMPLE SHOPPING IMAGE URLS:' as section;
SELECT entity_id, media_url
FROM universal_media 
WHERE entity_type = 'shop'
LIMIT 10;
