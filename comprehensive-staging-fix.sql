-- Comprehensive fix for staging_queue table schema
-- Run this in Supabase SQL Editor

-- Add ALL missing columns to staging_queue table
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS google_place_id text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS coordinates text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS scraped_at timestamp;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS scraping_method text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS data_source_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS opening_hours text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS price_level integer;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS user_ratings_total integer;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS place_types text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS photos text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS reviews text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS vicinity text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS formatted_address text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS geometry text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS plus_code text;

-- Force refresh of Supabase schema cache
NOTIFY pgrst, 'reload schema';

-- Verify all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'staging_queue' AND table_schema = 'public'
ORDER BY column_name;
