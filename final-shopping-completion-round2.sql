-- FINAL SHOPPING COMPLETION - ROUND 2
-- Continue redistributing to the remaining 13 places

-- Take from the current 4 places that have images and give to the remaining 13

-- From İstinye Park (ID 36) - give to remaining places
UPDATE universal_media 
SET entity_id = 41  -- Mall of Istanbul
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 39  -- Zorlu Center
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 45  -- Akasya Mall
WHERE entity_type = 'shop' 
AND entity_id = 36
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 36
    ORDER BY id
    LIMIT 1
);

-- From Emaar Square Mall (ID 46)
UPDATE universal_media 
SET entity_id = 50  -- Marmara Forum
WHERE entity_type = 'shop' 
AND entity_id = 46
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 46
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 34  -- Capitol AVM
WHERE entity_type = 'shop' 
AND entity_id = 46
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 46
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 44  -- Forum Istanbul
WHERE entity_type = 'shop' 
AND entity_id = 46
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 46
    ORDER BY id
    LIMIT 1
);

-- From Kanyon Shopping Mall (ID 43)
UPDATE universal_media 
SET entity_id = 49  -- Palladium Ataşehir AVM
WHERE entity_type = 'shop' 
AND entity_id = 43
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 43
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 48  -- Akmerkez
WHERE entity_type = 'shop' 
AND entity_id = 43
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 43
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 40  -- Tepe Nautilus Shopping Mall
WHERE entity_type = 'shop' 
AND entity_id = 43
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 43
    ORDER BY id
    LIMIT 1
);

-- From İstanbul Cevahir Shopping Mall (ID 47)
UPDATE universal_media 
SET entity_id = 42  -- Galataport Istanbul
WHERE entity_type = 'shop' 
AND entity_id = 47
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 47
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 38  -- Olivium Outlet Center
WHERE entity_type = 'shop' 
AND entity_id = 47
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 47
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 37  -- Historia Shopping and Life Center
WHERE entity_type = 'shop' 
AND entity_id = 47
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 47
    ORDER BY id
    LIMIT 1
);

UPDATE universal_media 
SET entity_id = 35  -- Galleria Shopping Mall
WHERE entity_type = 'shop' 
AND entity_id = 47
AND id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 47
    ORDER BY id
    LIMIT 1
);

-- Final verification
SELECT 'ROUND 2 RESULTS:' as status;
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

-- Summary
SELECT 'FINAL SUMMARY:' as status;
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

SELECT 'ROUND 2 COMPLETE - ALL SHOPPING PLACES SHOULD NOW HAVE IMAGES!' as final_status;
