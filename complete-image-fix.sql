-- Complete image mapping fix for all hotels
-- Run this in Supabase SQL Editor

-- First, let's see what image entity_ids exist
SELECT 'Available image entity_ids:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'hotel'
GROUP BY entity_id
ORDER BY entity_id;

-- Get all hotels that need images (image_count = 0)
SELECT 'Hotels needing images:' as status;
SELECT h.id, h.name, COUNT(m.id) as current_image_count
FROM hotels h
LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
GROUP BY h.id, h.name
HAVING COUNT(m.id) = 0
ORDER BY h.id;

-- Now let's map the remaining available images to hotels without images
-- We'll use a more systematic approach
WITH available_images AS (
  SELECT entity_id as old_id,
         ROW_NUMBER() OVER (ORDER BY entity_id) as img_row_num
  FROM (
    SELECT DISTINCT entity_id
    FROM universal_media 
    WHERE entity_type = 'hotel'
    AND entity_id NOT IN (85, 86, 87, 88, 89, 95, 102)  -- Exclude already mapped hotels
  ) sub
  ORDER BY entity_id
),
hotels_needing_images AS (
  SELECT h.id as hotel_id, h.name,
         ROW_NUMBER() OVER (ORDER BY h.id) as hotel_row_num
  FROM hotels h
  LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
  GROUP BY h.id, h.name
  HAVING COUNT(m.id) = 0
  ORDER BY h.id
),
mapping AS (
  SELECT 
    h.hotel_id as new_entity_id,
    h.name,
    a.old_id
  FROM hotels_needing_images h
  JOIN available_images a ON h.hotel_row_num = a.img_row_num
)
UPDATE universal_media 
SET entity_id = mapping.new_entity_id
FROM mapping
WHERE universal_media.entity_type = 'hotel' 
AND universal_media.entity_id = mapping.old_id;

-- Final verification
SELECT 'Final result - all hotels with image counts:' as status;
SELECT h.id, h.name, COUNT(m.id) as image_count
FROM hotels h
LEFT JOIN universal_media m ON h.id = m.entity_id AND m.entity_type = 'hotel'
GROUP BY h.id, h.name
ORDER BY h.id;
