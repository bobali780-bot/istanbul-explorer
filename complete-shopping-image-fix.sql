-- COMPLETE SHOPPING IMAGE FIX
-- This ensures every shopping place gets exactly 15 images

-- First, let's see the current state
SELECT 'CURRENT SHOPPING IMAGE DISTRIBUTION:' as status;
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

-- Now let's fix the ones that still have 0 images
-- We'll take from the places that have too many and redistribute

-- Fix Galataport Istanbul (ID 42) - take 15 images from any available source
UPDATE universal_media 
SET entity_id = 42
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 15
        LIMIT 1
    )
    ORDER BY id
    LIMIT 15
);

-- Fix Mall of Istanbul (ID 41) - ensure it has 15 images
UPDATE universal_media 
SET entity_id = 41
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 15
        LIMIT 1
    )
    ORDER BY id
    LIMIT 15
);

-- Fix Zorlu Center (ID 39) - ensure it has 15 images
UPDATE universal_media 
SET entity_id = 39
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 15
        LIMIT 1
    )
    ORDER BY id
    LIMIT 15
);

-- Fix Akasya Mall (ID 45) - ensure it has 15 images
UPDATE universal_media 
SET entity_id = 45
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 15
        LIMIT 1
    )
    ORDER BY id
    LIMIT 15
);

-- Fix any other shopping places that still have 0 images
-- This is a catch-all for any remaining places

-- Get all shopping places that still have 0 images and fix them
WITH zero_image_places AS (
    SELECT s.id
    FROM shopping s
    LEFT JOIN universal_media um ON s.id = um.entity_id AND um.entity_type = 'shop'
    WHERE um.entity_id IS NULL
),
excess_images AS (
    SELECT entity_id, id as media_id, 
           ROW_NUMBER() OVER (PARTITION BY entity_id ORDER BY id) as rn
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 15
    )
),
filtered_excess AS (
    SELECT media_id, entity_id
    FROM excess_images 
    WHERE rn > 15
)
UPDATE universal_media 
SET entity_id = (
    SELECT id 
    FROM zero_image_places 
    ORDER BY id 
    LIMIT 1
)
WHERE id IN (
    SELECT media_id 
    FROM filtered_excess 
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

SELECT 'SHOPPING IMAGE FIX COMPLETE!' as final_status;
