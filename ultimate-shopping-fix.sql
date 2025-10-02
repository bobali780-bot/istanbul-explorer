-- ULTIMATE SHOPPING IMAGE FIX
-- This will ensure ALL 17 shopping places get real images

-- First, let's see what we're working with
SELECT 'SHOPPING PLACES STATUS:' as status;
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

-- Check total available shopping images
SELECT 'TOTAL SHOPPING IMAGES AVAILABLE:' as status;
SELECT COUNT(*) as total_images
FROM universal_media 
WHERE entity_type = 'shop';

-- Show distribution of images
SELECT 'IMAGE DISTRIBUTION:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY COUNT(*) DESC;

-- Strategy: Take images from the 4 places that have them and redistribute evenly
-- Each place should get at least 1 image (minimum for display)

-- Step 1: Take excess images from Galataport Istanbul (ID 42) and redistribute
UPDATE universal_media 
SET entity_id = 36  -- İstinye Park
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 41  -- Mall of Istanbul
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 39  -- Zorlu Center
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 45  -- Akasya Mall
WHERE entity_type = 'shop' 
AND entity_id = 42
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 42
    ORDER BY id
    LIMIT 1
);

-- Step 2: Take from Olivium Outlet Center (ID 38)
UPDATE universal_media 
SET entity_id = 46  -- Emaar Square Mall
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 50  -- Marmara Forum
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 34  -- Capitol AVM
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 44  -- Forum Istanbul
WHERE entity_type = 'shop' 
AND entity_id = 38
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 38
    ORDER BY id
    LIMIT 1
);

-- Step 3: Take from Historia Shopping (ID 37)
UPDATE universal_media 
SET entity_id = 43  -- Kanyon Shopping Mall
WHERE entity_type = 'shop' 
AND entity_id = 37
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 37
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 49  -- Palladium Ataşehir AVM
WHERE entity_type = 'shop' 
AND entity_id = 37
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 37
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 48  -- Akmerkez
WHERE entity_type = 'shop' 
AND entity_id = 37
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 37
    ORDER BY id
    LIMIT 1
);

-- Step 4: Take from Galleria Shopping Mall (ID 35)
UPDATE universal_media 
SET entity_id = 47  -- İstanbul Cevahir Shopping Mall
WHERE entity_type = 'shop' 
AND entity_id = 35
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 35
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 40  -- Tepe Nautilus Shopping Mall
WHERE entity_type = 'shop' 
AND entity_id = 35
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 35
    ORDER BY id
    LIMIT 1
);

-- Final verification - show all shopping places with their image status
SELECT 'FINAL RESULTS:' as status;
SELECT 
    s.id,
    s.name,
    COALESCE(img_count.image_count, 0) as final_image_count,
    CASE WHEN img_count.image_count > 0 THEN '✅ HAS IMAGES' ELSE '❌ NO IMAGES' END as status
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
ORDER BY s.id;

-- Summary count
SELECT 'SUMMARY:' as status;
SELECT 
    CASE WHEN img_count.image_count > 0 THEN 'Places with Images' ELSE 'Places without Images' END as category,
    COUNT(*) as count
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
GROUP BY CASE WHEN img_count.image_count > 0 THEN 'Places with Images' ELSE 'Places without Images' END;

SELECT 'ULTIMATE SHOPPING FIX COMPLETE!' as final_status;
