-- DIRECT SHOPPING DATABASE VERIFICATION
-- Let's see exactly what images exist and where they're mapped

-- 1. Show ALL shopping images in universal_media with their entity_ids
SELECT 'ALL SHOPPING IMAGES IN UNIVERSAL_MEDIA:' as section;
SELECT 
    entity_id,
    COUNT(*) as image_count,
    STRING_AGG(SUBSTRING(media_url, 1, 80), '; ') as sample_urls
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

-- 2. Show shopping places that should have images based on our API results
SELECT 'PLACES THAT SHOULD HAVE IMAGES (API shows real URLs):' as section;
SELECT 'IDs: 41, 43, 46, 47' as expected_ids;

-- 3. Check if these specific IDs have images in universal_media
SELECT 'VERIFICATION - Do these IDs actually have images in universal_media?' as section;
SELECT 
    entity_id,
    COUNT(*) as image_count,
    MIN(media_url) as first_image_url
FROM universal_media 
WHERE entity_type = 'shop' 
AND entity_id IN (41, 43, 46, 47)
GROUP BY entity_id
ORDER BY entity_id;

-- 4. Show which entity_ids have the most images (might be clustered)
SELECT 'ENTITY_IDS WITH MOST IMAGES (potential clusters):' as section;
SELECT 
    entity_id,
    COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
HAVING COUNT(*) > 10
ORDER BY COUNT(*) DESC;

-- 5. Show total available shopping images
SELECT 'TOTAL SHOPPING IMAGES AVAILABLE:' as section;
SELECT COUNT(*) as total_images FROM universal_media WHERE entity_type = 'shop';

-- 6. Show sample of actual image URLs to verify they're real
SELECT 'SAMPLE REAL IMAGE URLS:' as section;
SELECT media_url 
FROM universal_media 
WHERE entity_type = 'shop' 
AND (media_url LIKE 'https://maps.googleapis.com%' OR media_url LIKE 'https://images.unsplash.com%')
LIMIT 5;

SELECT 'DIRECT VERIFICATION COMPLETE!' as final_status;
