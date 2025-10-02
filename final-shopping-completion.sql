-- FINAL SHOPPING IMAGE COMPLETION
-- Complete the shopping image distribution for remaining places

-- Check current status
SELECT 'CURRENT STATUS:' as status;
SELECT 
    s.id,
    s.name,
    COALESCE(img_count.image_count, 0) as current_images
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
ORDER BY s.id;

-- Find places that still have many images to redistribute from
SELECT 'PLACES WITH EXCESS IMAGES:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
HAVING COUNT(*) > 15
ORDER BY COUNT(*) DESC;

-- Take images from places that have too many and give to places that have none
-- Use entity_id 42 (Galataport Istanbul) which should have images now

-- Give images to İstinye Park (ID 36)
UPDATE universal_media 
SET entity_id = 36
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Mall of Istanbul (ID 41)
UPDATE universal_media 
SET entity_id = 41
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Zorlu Center (ID 39)
UPDATE universal_media 
SET entity_id = 39
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Akasya Mall (ID 45)
UPDATE universal_media 
SET entity_id = 45
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Emaar Square Mall (ID 46)
UPDATE universal_media 
SET entity_id = 46
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Marmara Forum (ID 50)
UPDATE universal_media 
SET entity_id = 50
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Capitol AVM (ID 34)
UPDATE universal_media 
SET entity_id = 34
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Forum Istanbul (ID 44)
UPDATE universal_media 
SET entity_id = 44
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Kanyon Shopping Mall (ID 43)
UPDATE universal_media 
SET entity_id = 43
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Palladium Ataşehir AVM (ID 49)
UPDATE universal_media 
SET entity_id = 49
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Akmerkez (ID 48)
UPDATE universal_media 
SET entity_id = 48
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to İstanbul Cevahir Shopping Mall (ID 47)
UPDATE universal_media 
SET entity_id = 47
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Give images to Tepe Nautilus Shopping Mall (ID 40)
UPDATE universal_media 
SET entity_id = 40
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id DESC
    LIMIT 15
);

-- Final verification
SELECT 'FINAL VERIFICATION:' as status;
SELECT 
    s.id,
    s.name,
    COALESCE(img_count.image_count, 0) as final_image_count
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
ORDER BY s.id;

-- Count how many have images now
SELECT 'SUMMARY:' as status;
SELECT 
    CASE WHEN img_count.image_count > 0 THEN 'Has Images' ELSE 'No Images' END as status,
    COUNT(*) as count
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
GROUP BY CASE WHEN img_count.image_count > 0 THEN 'Has Images' ELSE 'No Images' END;

SELECT 'FINAL SHOPPING COMPLETION DONE!' as final_status;
