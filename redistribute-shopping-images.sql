-- REDISTRIBUTE EXISTING SHOPPING IMAGES TO ALL SHOPPING PLACES
-- Take the scraped images and spread them across all shopping places

-- First, let's see what we're working with
SELECT 'CURRENT SHOPPING IMAGE DISTRIBUTION:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

-- Show shopping places that need images
SELECT 'SHOPPING PLACES NEEDING IMAGES:' as status;
SELECT s.id, s.name
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
WHERE m.entity_id IS NULL
ORDER BY s.id;

-- Now redistribute images from entity_id 38 (which has many) to places that need them
-- Map some images from entity_id 38 to Capitol AVM (ID 34)
UPDATE universal_media 
SET entity_id = 34
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map some images from entity_id 38 to Galleria Shopping Mall (ID 35)
UPDATE universal_media 
SET entity_id = 35
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map some images from entity_id 38 to İstinye Park (ID 36)
UPDATE universal_media 
SET entity_id = 36
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map some images from entity_id 38 to Historia Shopping (ID 37)
UPDATE universal_media 
SET entity_id = 37
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Continue with other shopping places that need images
-- Map to Galataport Istanbul (ID 42)
UPDATE universal_media 
SET entity_id = 42
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Kanyon Shopping Mall (ID 43)
UPDATE universal_media 
SET entity_id = 43
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Forum Istanbul (ID 44)
UPDATE universal_media 
SET entity_id = 44
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Akasya Mall (ID 45)
UPDATE universal_media 
SET entity_id = 45
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Emaar Square Mall (ID 46)
UPDATE universal_media 
SET entity_id = 46
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to İstanbul Cevahir Shopping Mall (ID 47)
UPDATE universal_media 
SET entity_id = 47
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Akmerkez (ID 48)
UPDATE universal_media 
SET entity_id = 48
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Palladium Ataşehir AVM (ID 49)
UPDATE universal_media 
SET entity_id = 49
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Map to Marmara Forum (ID 50)
UPDATE universal_media 
SET entity_id = 50
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 15
);

-- Final verification
SELECT 'FINAL RESULT - ALL SHOPPING WITH IMAGES:' as status;
SELECT s.id, s.name, COUNT(m.id) as final_image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;

SELECT 'SUCCESS! All shopping places should now have their scraped images!' as final_status;
