-- ULTIMATE FINAL staging_queue table fix
-- This includes EVERY field the Google Places API is trying to insert
-- Run this in Supabase SQL Editor

-- First, restart Supabase to clear cache completely
SELECT pg_notify('pgrst', 'reload config');
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_sleep(2);

-- Add EVERY possible column the Google Places API might need
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS short_overview text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS full_description text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS rating numeric;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS review_count integer;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS price_range text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS opening_hours text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS highlights text[];
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS data_source_url text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS scraping_method text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS google_place_id text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS coordinates text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS created_at timestamp;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS scraped_at timestamp;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS price_level integer;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS user_ratings_total integer;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS place_types text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS photos text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS reviews text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS vicinity text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS formatted_address text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS geometry text;
ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS plus_code text;

-- Restart PostgREST multiple times to force schema cache refresh
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_sleep(1);
SELECT pg_notify('pgrst', 'reload config');
SELECT pg_sleep(1);
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_sleep(2);

-- Final verification
SELECT 
  COUNT(*) as total_columns,
  STRING_AGG(column_name, ', ' ORDER BY column_name) as all_columns
FROM information_schema.columns 
WHERE table_name = 'staging_queue' AND table_schema = 'public';
