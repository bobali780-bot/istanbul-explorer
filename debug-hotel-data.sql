-- Debug hotel data and images
-- Run this in Supabase SQL Editor

-- Check what columns exist in hotels table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hotels' 
ORDER BY ordinal_position;

-- Check sample hotel data
SELECT id, name, title, rating, is_featured
FROM hotels 
LIMIT 5;

-- Check if there are images for these hotel IDs
SELECT entity_type, entity_id, media_url, is_primary
FROM universal_media 
WHERE entity_type = 'hotel' 
AND entity_id IN (91, 88, 98)
LIMIT 10;
