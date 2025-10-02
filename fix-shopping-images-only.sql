-- Quick fix for shopping images only
-- Run this in Supabase SQL Editor

-- Check current shopping image status
SELECT 'SHOPPING - Current image status:' as status;
SELECT s.id, s.name, COUNT(m.id) as image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;

-- Check available shopping images that aren't mapped
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

-- Fix shopping images - map remaining available images to shopping items without images
WITH available_shopping_images AS (
  SELECT entity_id as old_id,
         ROW_NUMBER() OVER (ORDER BY entity_id) as img_row_num
  FROM (
    SELECT DISTINCT entity_id
    FROM universal_media 
    WHERE entity_type = 'shop'
    AND entity_id NOT IN (
      SELECT DISTINCT s.id
      FROM shopping s
      JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
    )
  ) sub
  ORDER BY entity_id
),
shopping_needing_images AS (
  SELECT s.id as shop_id, s.name,
         ROW_NUMBER() OVER (ORDER BY s.id) as shop_row_num
  FROM shopping s
  LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
  GROUP BY s.id, s.name
  HAVING COUNT(m.id) = 0
  ORDER BY s.id
),
shopping_mapping AS (
  SELECT 
    s.shop_id as new_entity_id,
    s.name,
    i.old_id
  FROM shopping_needing_images s
  JOIN available_shopping_images i ON s.shop_row_num = i.img_row_num
)
UPDATE universal_media 
SET entity_id = shopping_mapping.new_entity_id
FROM shopping_mapping
WHERE universal_media.entity_type = 'shop' 
AND universal_media.entity_id = shopping_mapping.old_id;

-- Final verification
SELECT 'FINAL - Shopping with image counts:' as status;
SELECT s.id, s.name, COUNT(m.id) as image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;
