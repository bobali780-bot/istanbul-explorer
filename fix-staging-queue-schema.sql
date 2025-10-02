-- Fix staging_queue table schema for Google Places integration
-- Run this in Supabase SQL Editor

-- Add missing columns to staging_queue table
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS google_place_id text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS coordinates text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS scraped_at timestamp;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS scraping_method text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS data_source_url text;

-- Optional: Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'staging_queue' AND table_schema = 'public'
ORDER BY column_name;
