-- Simple fix for shopping images - corrected syntax
-- Run this in Supabase SQL Editor

-- Step 1: Check current shopping image status
SELECT 'SHOPPING - Current image status:' as status;
SELECT s.id, s.name, COUNT(m.id) as image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;

-- Step 2: Check available shopping images that aren't mapped
SELECT 'Available shopping images not yet mapped:' as status;
SELECT DISTINCT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
AND entity_id NOT IN (
  SELECT DISTINCT s.id
  FROM shopping s
  JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
)
GROUP BY entity_id
ORDER BY entity_id;

-- Step 3: Map available images to shopping items that need them
-- First, let's map entity_id 1 to shopping item 38 (Olivium Outlet Center)
UPDATE universal_media 
SET entity_id = 38
WHERE entity_type = 'shop' AND entity_id = 1;

-- Map entity_id 2 to shopping item 39 (Zorlu Center)
UPDATE universal_media 
SET entity_id = 39
WHERE entity_type = 'shop' AND entity_id = 2;

-- Map entity_id 3 to shopping item 40 (Tepe Nautilus Shopping Mall)
UPDATE universal_media 
SET entity_id = 40
WHERE entity_type = 'shop' AND entity_id = 3;

-- Map entity_id 4 to shopping item 41 (Mall of Istanbul)
UPDATE universal_media 
SET entity_id = 41
WHERE entity_type = 'shop' AND entity_id = 4;

-- Map entity_id 5 to shopping item 42 (Galataport Istanbul)
UPDATE universal_media 
SET entity_id = 42
WHERE entity_type = 'shop' AND entity_id = 5;

-- Map entity_id 6 to shopping item 43 (Kanyon Shopping Mall)
UPDATE universal_media 
SET entity_id = 43
WHERE entity_type = 'shop' AND entity_id = 6;

-- Map entity_id 7 to shopping item 44 (Forum Istanbul)
UPDATE universal_media 
SET entity_id = 44
WHERE entity_type = 'shop' AND entity_id = 7;

-- Map entity_id 8 to shopping item 45 (Akasya Mall)
UPDATE universal_media 
SET entity_id = 45
WHERE entity_type = 'shop' AND entity_id = 8;

-- Map entity_id 9 to shopping item 46 (Emaar Square Mall)
UPDATE universal_media 
SET entity_id = 46
WHERE entity_type = 'shop' AND entity_id = 9;

-- Map entity_id 10 to shopping item 47 (İstanbul Cevahir Shopping Mall)
UPDATE universal_media 
SET entity_id = 47
WHERE entity_type = 'shop' AND entity_id = 10;

-- Map entity_id 11 to shopping item 48 (Akmerkez)
UPDATE universal_media 
SET entity_id = 48
WHERE entity_type = 'shop' AND entity_id = 11;

-- Map entity_id 12 to shopping item 49 (Palladium Ataşehir AVM)
UPDATE universal_media 
SET entity_id = 49
WHERE entity_type = 'shop' AND entity_id = 12;

-- Map entity_id 13 to shopping item 50 (Marmara Forum)
UPDATE universal_media 
SET entity_id = 50
WHERE entity_type = 'shop' AND entity_id = 13;

-- Step 4: Final verification
SELECT 'FINAL - Shopping with image counts:' as status;
SELECT s.id, s.name, COUNT(m.id) as image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;
