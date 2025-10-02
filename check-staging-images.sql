-- Check how many images are in staging_queue for published items
SELECT 
  id,
  title,
  category,
  status,
  jsonb_array_length(images) as image_count,
  confidence_score
FROM staging_queue
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
