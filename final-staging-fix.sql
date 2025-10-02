-- FINAL COMPREHENSIVE staging_queue table fix
-- Run this in Supabase SQL Editor

-- Add ALL missing columns for Google Places integration
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

-- Missing columns from Google Places API code
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS short_overview text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS full_description text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS review_count integer;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS price_range text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS highlights text[];
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS status text;

-- Force multiple schema cache refreshes
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';

-- Verify ALL columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'staging_queue' AND table_schema = 'public'
ORDER BY column_name;
