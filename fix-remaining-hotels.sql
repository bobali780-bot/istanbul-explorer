-- Fix remaining hotel image mappings
-- Run this in Supabase SQL Editor

-- Map the remaining hotels (90+) to the remaining image entity_ids (6+)
WITH remaining_hotels AS (
  SELECT 
    h.id as new_entity_id,
    h.name,
    ROW_NUMBER() OVER (ORDER BY h.id) + 5 as old_entity_id  -- Start from entity_id 6
  FROM hotels h
  WHERE h.id >= 90  -- Hotels that still need mapping
  ORDER BY h.id
),
remaining_images AS (
  SELECT DISTINCT entity_id
  FROM universal_media 
  WHERE entity_type = 'hotel' 
  AND entity_id >= 6  -- Images that need new hotel IDs
  ORDER BY entity_id
)
UPDATE universal_media 
SET entity_id = remaining_hotels.new_entity_id
FROM remaining_hotels
WHERE universal_media.entity_type = 'hotel' 
AND universal_media.entity_id = remaining_hotels.old_entity_id;

-- Verify all hotels now have images
SELECT 'Final verification - all hotels with images:' as status;
SELECT h.id, h.name, COUNT(m.id) as image_count
FROM hotels h
LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
GROUP BY h.id, h.name
ORDER BY h.id;
