-- Check if activities were added to the database
SELECT
  id,
  name,
  slug,
  district,
  rating,
  is_featured,
  created_at
FROM activities
ORDER BY created_at DESC
LIMIT 10;