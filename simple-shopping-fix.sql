-- SIMPLE SHOPPING IMAGE FIX
-- Direct approach to map existing shopping images to shopping places

-- First, let's see what shopping images we have available
SELECT 'AVAILABLE SHOPPING IMAGES:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

-- Show shopping places that need images
SELECT 'SHOPPING PLACES NEEDING IMAGES:' as status;
SELECT s.id, s.name
FROM shopping s
LEFT JOIN universal_media um ON s.id = um.entity_id AND um.entity_type = 'shop'
WHERE um.entity_id IS NULL
ORDER BY s.id;

-- Direct mapping approach - take images from entity_id 36 and redistribute
-- Map 15 images to Galataport Istanbul (ID 42)
UPDATE universal_media 
SET entity_id = 42
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Mall of Istanbul (ID 41)
UPDATE universal_media 
SET entity_id = 41
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Zorlu Center (ID 39)
UPDATE universal_media 
SET entity_id = 39
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Akasya Mall (ID 45)
UPDATE universal_media 
SET entity_id = 45
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Emaar Square Mall (ID 46)
UPDATE universal_media 
SET entity_id = 46
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Marmara Forum (ID 50)
UPDATE universal_media 
SET entity_id = 50
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Capitol AVM (ID 34)
UPDATE universal_media 
SET entity_id = 34
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Forum Istanbul (ID 44)
UPDATE universal_media 
SET entity_id = 44
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Map 15 images to Kanyon Shopping Mall (ID 43)
UPDATE universal_media 
SET entity_id = 43
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 15
);

-- Final verification
SELECT 'FINAL SHOPPING IMAGE DISTRIBUTION:' as status;
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

SELECT 'SIMPLE SHOPPING FIX COMPLETE!' as final_status;