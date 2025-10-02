-- SIMPLE DIRECT SHOPPING FIX
-- Fix the SQL error and use a straightforward approach

-- First, let's see the current state
SELECT 'CURRENT IMAGE DISTRIBUTION:' as section;
SELECT 
    entity_id,
    COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY COUNT(*) DESC;

-- Show which shopping places need images
SELECT 'PLACES NEEDING IMAGES:' as section;
SELECT s.id, s.name
FROM shopping s
LEFT JOIN (
    SELECT DISTINCT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop'
) um ON s.id = um.entity_id
WHERE um.entity_id IS NULL
ORDER BY s.id;

-- Now let's do the redistribution directly
-- Based on our previous findings, images are likely clustered under one entity_id
-- Let's redistribute them systematically

-- Capitol AVM (ID 34)
UPDATE universal_media 
SET entity_id = 34
WHERE entity_type = 'shop' 
AND entity_id IN (
    SELECT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    GROUP BY entity_id 
    HAVING COUNT(*) > 5
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
AND id = (
    SELECT MIN(id) 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 5
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    )
);

-- Galleria Shopping Mall (ID 35)
UPDATE universal_media 
SET entity_id = 35
WHERE entity_type = 'shop' 
AND entity_id IN (
    SELECT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    GROUP BY entity_id 
    HAVING COUNT(*) > 5
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
AND id = (
    SELECT MIN(id) 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 5
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    )
    AND id NOT IN (SELECT id FROM universal_media WHERE entity_id = 34)
);

-- İstinye Park Alışveriş Merkezi (ID 36)
UPDATE universal_media 
SET entity_id = 36
WHERE entity_type = 'shop' 
AND entity_id IN (
    SELECT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    GROUP BY entity_id 
    HAVING COUNT(*) > 5
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
AND id = (
    SELECT MIN(id) 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 5
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    )
    AND id NOT IN (SELECT id FROM universal_media WHERE entity_id IN (34, 35))
);

-- Historia Shopping and Life Center (ID 37)
UPDATE universal_media 
SET entity_id = 37
WHERE entity_type = 'shop' 
AND entity_id IN (
    SELECT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    GROUP BY entity_id 
    HAVING COUNT(*) > 5
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
AND id = (
    SELECT MIN(id) 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 5
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    )
    AND id NOT IN (SELECT id FROM universal_media WHERE entity_id IN (34, 35, 36))
);

-- Olivium Outlet Center (ID 38)
UPDATE universal_media 
SET entity_id = 38
WHERE entity_type = 'shop' 
AND entity_id IN (
    SELECT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    GROUP BY entity_id 
    HAVING COUNT(*) > 5
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
AND id = (
    SELECT MIN(id) 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 5
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    )
    AND id NOT IN (SELECT id FROM universal_media WHERE entity_id IN (34, 35, 36, 37))
);

-- Continue for remaining places...
-- Zorlu Center (ID 39)
UPDATE universal_media 
SET entity_id = 39
WHERE entity_type = 'shop' 
AND entity_id IN (
    SELECT entity_id 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    GROUP BY entity_id 
    HAVING COUNT(*) > 5
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
AND id = (
    SELECT MIN(id) 
    FROM universal_media 
    WHERE entity_type = 'shop' 
    AND entity_id IN (
        SELECT entity_id 
        FROM universal_media 
        WHERE entity_type = 'shop' 
        GROUP BY entity_id 
        HAVING COUNT(*) > 5
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    )
    AND id NOT IN (SELECT id FROM universal_media WHERE entity_id IN (34, 35, 36, 37, 38))
);

-- Final verification
SELECT 'FINAL RESULTS:' as section;
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

SELECT 'SIMPLE DIRECT SHOPPING FIX COMPLETE!' as final_status;
