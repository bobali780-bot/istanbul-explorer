-- Fix image mapping for hotels - map existing images to correct hotel IDs
-- Run this in Supabase SQL Editor

-- First, let's see what we're working with
SELECT 'Current hotel-image mapping:' as status;
SELECT h.id, h.name, COUNT(m.id) as image_count
FROM hotels h
LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
GROUP BY h.id, h.name
ORDER BY h.id
LIMIT 5;

-- Check what images exist with entity_type 'hotel'
SELECT 'Images with entity_type hotel:' as status;
SELECT DISTINCT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'hotel'
GROUP BY entity_id
ORDER BY entity_id
LIMIT 10;

-- The issue: Images exist with entity_ids 1,2,3... but hotels have IDs 85,86,87...
-- We need to map the first hotel (ID 85) to entity_id 1, second hotel (ID 86) to entity_id 2, etc.

-- Create a mapping and update the entity_ids
WITH hotel_mapping AS (
  SELECT 
    h.id as new_entity_id,
    h.name,
    ROW_NUMBER() OVER (ORDER BY h.id) as old_entity_id
  FROM hotels h
  ORDER BY h.id
)
UPDATE universal_media 
SET entity_id = hotel_mapping.new_entity_id
FROM hotel_mapping
WHERE universal_media.entity_type = 'hotel' 
AND universal_media.entity_id = hotel_mapping.old_entity_id;

-- Verify the fix
SELECT 'After fix - hotel-image mapping:' as status;
SELECT h.id, h.name, COUNT(m.id) as image_count
FROM hotels h
LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
GROUP BY h.id, h.name
ORDER BY h.id
LIMIT 10;
