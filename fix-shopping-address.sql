-- Fix shopping table missing address column
-- Run this in Supabase SQL Editor

ALTER TABLE shopping ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS metro_station text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS is_free boolean DEFAULT false;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS booking_required boolean DEFAULT false;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS seo_keywords text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS seo_schema text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS faq_data text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS popularity_score integer DEFAULT 0;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS visitor_count integer DEFAULT 0;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS wikipedia_weekly_views integer DEFAULT 0;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS google_trends_score integer DEFAULT 0;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS social_media_score integer DEFAULT 0;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS data_sources text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS confidence_score integer DEFAULT 0;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS last_verified timestamp;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS category_id integer;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS languages_spoken text;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS last_updated timestamp DEFAULT now();

