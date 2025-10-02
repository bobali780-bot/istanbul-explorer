-- FINAL SHOPPING IMAGE REDISTRIBUTION
-- This script redistributes clustered shopping images to all shopping places

-- First, let's see what we're working with
SELECT 'CURRENT SHOPPING PLACES:' as status;
SELECT id, name FROM shopping ORDER BY id;

SELECT 'CURRENT IMAGE DISTRIBUTION:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

-- Now let's redistribute systematically
-- We have images clustered under entity_ids: 34, 39, 40, 41
-- We need to spread them across all shopping places (IDs 34-50)

-- Step 1: Move 15 images from entity_id 34 to shopping place 35
UPDATE universal_media 
SET entity_id = 35
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 34
    ORDER BY id
    LIMIT 15
);

-- Step 2: Move 15 images from entity_id 39 to shopping place 36
UPDATE universal_media 
SET entity_id = 36
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 39
    ORDER BY id
    LIMIT 15
);

-- Step 3: Move 15 images from entity_id 40 to shopping place 37
UPDATE universal_media 
SET entity_id = 37
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 40
    ORDER BY id
    LIMIT 15
);

-- Step 4: Move 14 images from entity_id 41 to shopping place 38
UPDATE universal_media 
SET entity_id = 38
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 41
    ORDER BY id
    LIMIT 14
);

-- Step 5: Now we need to redistribute remaining images to places 42-50
-- Let's take from the largest clusters and redistribute

-- Move images to shopping place 42
UPDATE universal_media 
SET entity_id = 42
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 34
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 43
UPDATE universal_media 
SET entity_id = 43
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 39
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 44
UPDATE universal_media 
SET entity_id = 44
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 40
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 45
UPDATE universal_media 
SET entity_id = 45
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 34
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 46
UPDATE universal_media 
SET entity_id = 46
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 39
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 47
UPDATE universal_media 
SET entity_id = 47
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 40
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 48
UPDATE universal_media 
SET entity_id = 48
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 34
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 49
UPDATE universal_media 
SET entity_id = 49
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 39
    ORDER BY id
    LIMIT 15
);

-- Move images to shopping place 50
UPDATE universal_media 
SET entity_id = 50
WHERE id IN (
    SELECT id 
    FROM universal_media 
    WHERE entity_type = 'shop' AND entity_id = 40
    ORDER BY id
    LIMIT 15
);

-- Final verification
SELECT 'FINAL DISTRIBUTION:' as status;
SELECT 
    s.id,
    s.name,
    COALESCE(img_count.image_count, 0) as image_count
FROM shopping s
LEFT JOIN (
    SELECT entity_id, COUNT(*) as image_count
    FROM universal_media 
    WHERE entity_type = 'shop'
    GROUP BY entity_id
) img_count ON s.id = img_count.entity_id
ORDER BY s.id;

SELECT 'REDISTRIBUTION COMPLETE!' as final_status;
