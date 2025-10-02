-- Debug image storage in universal_media table
-- Run this in Supabase SQL Editor to see what's stored

-- First, check what columns exist in universal_media table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'universal_media' 
ORDER BY ordinal_position;

-- Check what entity_types exist in universal_media
SELECT DISTINCT entity_type, COUNT(*) as count
FROM universal_media 
GROUP BY entity_type
ORDER BY count DESC;

-- Check a few sample hotel images (using basic columns)
SELECT entity_type, entity_id, media_url, is_primary
FROM universal_media 
WHERE entity_type = 'hotels'
LIMIT 10;

-- Check if there are any images with different entity_type patterns
SELECT entity_type, entity_id, media_url, is_primary
FROM universal_media 
WHERE entity_id IN (85, 86, 87, 88, 89) -- First few hotel IDs
LIMIT 20;


