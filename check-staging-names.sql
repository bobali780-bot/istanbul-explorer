-- Check what shopping items are in staging_queue
SELECT 
  id,
  title,
  category,
  status,
  jsonb_array_length(images) as image_count
FROM staging_queue
WHERE category = 'shopping'
  AND status = 'published'
ORDER BY title;
