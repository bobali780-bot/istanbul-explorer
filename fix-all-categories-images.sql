-- Complete image mapping fix for ALL categories
-- This will fix the ID mismatch issue for activities, shopping, and restaurants
-- Run this in Supabase SQL Editor

-- First, let's see what image entity_ids exist for each category
SELECT 'ACTIVITIES - Available image entity_ids:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'activity'
GROUP BY entity_id
ORDER BY entity_id;

SELECT 'SHOPPING - Available image entity_ids:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'shop'
GROUP BY entity_id
ORDER BY entity_id;

SELECT 'RESTAURANTS - Available image entity_ids:' as status;
SELECT entity_id, COUNT(*) as image_count
FROM universal_media 
WHERE entity_type = 'restaurant'
GROUP BY entity_id
ORDER BY entity_id;

-- Check which items need images in each category
SELECT 'ACTIVITIES needing images:' as status;
SELECT a.id, a.name, COUNT(m.id) as current_image_count
FROM activities a
LEFT JOIN universal_media m ON a.id = m.entity_id AND m.entity_type = 'activity'
GROUP BY a.id, a.name
HAVING COUNT(m.id) = 0
ORDER BY a.id;

SELECT 'SHOPPING needing images:' as status;
SELECT s.id, s.name, COUNT(m.id) as current_image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
HAVING COUNT(m.id) = 0
ORDER BY s.id;

SELECT 'RESTAURANTS needing images:' as status;
SELECT r.id, r.name, COUNT(m.id) as current_image_count
FROM restaurants r
LEFT JOIN universal_media m ON r.id = m.entity_id AND m.entity_type = 'restaurant'
GROUP BY r.id, r.name
HAVING COUNT(m.id) = 0
ORDER BY r.id;

-- FIX ACTIVITIES IMAGES
WITH available_activity_images AS (
  SELECT entity_id as old_id,
         ROW_NUMBER() OVER (ORDER BY entity_id) as img_row_num
  FROM (
    SELECT DISTINCT entity_id
    FROM universal_media 
    WHERE entity_type = 'activity'
  ) sub
  ORDER BY entity_id
),
activities_needing_images AS (
  SELECT a.id as activity_id, a.name,
         ROW_NUMBER() OVER (ORDER BY a.id) as activity_row_num
  FROM activities a
  LEFT JOIN universal_media m ON a.id = m.entity_id AND m.entity_type = 'activity'
  GROUP BY a.id, a.name
  HAVING COUNT(m.id) = 0
  ORDER BY a.id
),
activity_mapping AS (
  SELECT 
    a.activity_id as new_entity_id,
    a.name,
    i.old_id
  FROM activities_needing_images a
  JOIN available_activity_images i ON a.activity_row_num = i.img_row_num
)
UPDATE universal_media 
SET entity_id = activity_mapping.new_entity_id
FROM activity_mapping
WHERE universal_media.entity_type = 'activity' 
AND universal_media.entity_id = activity_mapping.old_id;

-- FIX SHOPPING IMAGES
WITH available_shopping_images AS (
  SELECT entity_id as old_id,
         ROW_NUMBER() OVER (ORDER BY entity_id) as img_row_num
  FROM (
    SELECT DISTINCT entity_id
    FROM universal_media 
    WHERE entity_type = 'shop'
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

-- FIX RESTAURANT IMAGES
WITH available_restaurant_images AS (
  SELECT entity_id as old_id,
         ROW_NUMBER() OVER (ORDER BY entity_id) as img_row_num
  FROM (
    SELECT DISTINCT entity_id
    FROM universal_media 
    WHERE entity_type = 'restaurant'
  ) sub
  ORDER BY entity_id
),
restaurants_needing_images AS (
  SELECT r.id as restaurant_id, r.name,
         ROW_NUMBER() OVER (ORDER BY r.id) as restaurant_row_num
  FROM restaurants r
  LEFT JOIN universal_media m ON r.id = m.entity_id AND m.entity_type = 'restaurant'
  GROUP BY r.id, r.name
  HAVING COUNT(m.id) = 0
  ORDER BY r.id
),
restaurant_mapping AS (
  SELECT 
    r.restaurant_id as new_entity_id,
    r.name,
    i.old_id
  FROM restaurants_needing_images r
  JOIN available_restaurant_images i ON r.restaurant_row_num = i.img_row_num
)
UPDATE universal_media 
SET entity_id = restaurant_mapping.new_entity_id
FROM restaurant_mapping
WHERE universal_media.entity_type = 'restaurant' 
AND universal_media.entity_id = restaurant_mapping.old_id;

-- Final verification for ALL categories
SELECT 'FINAL VERIFICATION - ACTIVITIES with image counts:' as status;
SELECT a.id, a.name, COUNT(m.id) as image_count
FROM activities a
LEFT JOIN universal_media m ON a.id = m.entity_id AND m.entity_type = 'activity'
GROUP BY a.id, a.name
ORDER BY a.id;

SELECT 'FINAL VERIFICATION - SHOPPING with image counts:' as status;
SELECT s.id, s.name, COUNT(m.id) as image_count
FROM shopping s
LEFT JOIN universal_media m ON s.id = m.entity_id AND m.entity_type = 'shop'
GROUP BY s.id, s.name
ORDER BY s.id;

SELECT 'FINAL VERIFICATION - RESTAURANTS with image counts:' as status;
SELECT r.id, r.name, COUNT(m.id) as image_count
FROM restaurants r
LEFT JOIN universal_media m ON r.id = m.entity_id AND m.entity_type = 'restaurant'
GROUP BY r.id, r.name
ORDER BY r.id;
