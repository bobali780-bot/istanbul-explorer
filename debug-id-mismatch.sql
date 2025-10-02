-- Debug ID mismatch between hotels table and universal_media
-- Run this in Supabase SQL Editor

-- Check the actual hotel IDs and names
SELECT id, name, title 
FROM hotels 
ORDER BY id 
LIMIT 10;

-- Check what entity_ids exist in universal_media for hotels
SELECT DISTINCT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'hotel'
GROUP BY entity_id
ORDER BY entity_id
LIMIT 10;

-- Check if there's any overlap
SELECT h.id as hotel_id, h.name as hotel_name, 
       COUNT(m.id) as image_count
FROM hotels h
LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
GROUP BY h.id, h.name
ORDER BY h.id
LIMIT 10;
