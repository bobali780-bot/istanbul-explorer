-- Complete the remaining shopping image mappings
-- Run this in Supabase SQL Editor

-- Check what shopping images are still available to map
SELECT 'Available unmapped shopping images:' as status;
SELECT DISTINCT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
AND entity_id NOT IN (38, 39, 40, 41)  -- Exclude already mapped ones
GROUP BY entity_id
ORDER BY entity_id;

-- Map remaining available images to shopping places that need them
-- Map to Capitol AVM (ID 34)
UPDATE universal_media 
SET entity_id = 34
WHERE entity_type = 'shop' AND entity_id = 14;

-- Map to Galleria Shopping Mall (ID 35)
UPDATE universal_media 
SET entity_id = 35
WHERE entity_type = 'shop' AND entity_id = 15;

-- Map to İstinye Park (ID 36)
UPDATE universal_media 
SET entity_id = 36
WHERE entity_type = 'shop' AND entity_id = 16;

-- Map to Historia Shopping (ID 37)
UPDATE universal_media 
SET entity_id = 37
WHERE entity_type = 'shop' AND entity_id = 17;

-- Map to Galataport Istanbul (ID 42)
UPDATE universal_media 
SET entity_id = 42
WHERE entity_type = 'shop' AND entity_id = 18;

-- Map to Kanyon Shopping Mall (ID 43)
UPDATE universal_media 
SET entity_id = 43
WHERE entity_type = 'shop' AND entity_id = 19;

-- Map to Forum Istanbul (ID 44)
UPDATE universal_media 
SET entity_id = 44
WHERE entity_type = 'shop' AND entity_id = 20;

-- Map to Akasya Mall (ID 45)
UPDATE universal_media 
SET entity_id = 45
WHERE entity_type = 'shop' AND entity_id = 21;

-- Map to Emaar Square Mall (ID 46)
UPDATE universal_media 
SET entity_id = 46
WHERE entity_type = 'shop' AND entity_id = 22;

-- Map to İstanbul Cevahir Shopping Mall (ID 47)
UPDATE universal_media 
SET entity_id = 47
WHERE entity_type = 'shop' AND entity_id = 23;

-- Map to Akmerkez (ID 48)
UPDATE universal_media 
SET entity_id = 48
WHERE entity_type = 'shop' AND entity_id = 24;

-- Map to Palladium Ataşehir AVM (ID 49)
UPDATE universal_media 
SET entity_id = 49
WHERE entity_type = 'shop' AND entity_id = 25;

-- Map to Marmara Forum (ID 50)
UPDATE universal_media 
SET entity_id = 50
WHERE entity_type = 'shop' AND entity_id = 26;

-- Add one more image to Mall of Istanbul to make it 15
UPDATE universal_media 
SET entity_id = 41
WHERE entity_type = 'shop' AND entity_id = 27;

-- Final verification - should show all 17 shopping places with 15 images each
SELECT 'FINAL VERIFICATION - All shopping with image counts:' as status;
SELECT s.id, s.name, COUNT(m.id) as image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;
