-- Check images for specific hotel IDs that are showing default images
-- Run this in Supabase SQL Editor

-- Check images for hotel IDs 91, 88, 98
SELECT 
  entity_type,
  entity_id, 
  media_url,
  is_primary,
  alt_text
FROM universal_media 
WHERE entity_type = 'hotel' 
AND entity_id IN (91, 88, 98)
ORDER BY entity_id, is_primary DESC, id;

-- Also check what the first few images look like for any hotel
SELECT 
  entity_type,
  entity_id, 
  media_url,
  is_primary,
  alt_text
FROM universal_media 
WHERE entity_type = 'hotel' 
LIMIT 10;
