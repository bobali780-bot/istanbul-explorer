-- Complete Schema Fix for Istanbul Explorer
-- Run this in Supabase SQL Editor

-- 1. Create shopping table (doesn't exist)
CREATE TABLE IF NOT EXISTS shopping (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_overview text,
  full_description text,
  booking_url text,
  rating numeric(2,1),
  review_count integer,
  price_range text,
  opening_hours text,
  location text,
  highlights text[],
  trip_advisor_url text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 2. Add missing columns to hotels table
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS short_overview text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS full_description text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS booking_url text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS rating numeric(2,1);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS review_count integer;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS price_range text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS opening_hours text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS highlights text[];
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS trip_advisor_url text;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();

-- 3. Add missing columns to restaurants table
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS short_overview text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS full_description text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS booking_url text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS rating numeric(2,1);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS review_count integer;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_range text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS opening_hours text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS highlights text[];
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS trip_advisor_url text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shopping_rating ON shopping (rating DESC, review_count DESC);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels (rating DESC, review_count DESC);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants (rating DESC, review_count DESC);

-- 5. Enable RLS and create policies
ALTER TABLE shopping ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Allow public read access (drop existing policies first to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access on shopping" ON shopping;
DROP POLICY IF EXISTS "Allow public read access on hotels" ON hotels;
DROP POLICY IF EXISTS "Allow public read access on restaurants" ON restaurants;

CREATE POLICY "Allow public read access on shopping" ON shopping FOR SELECT USING (true);
CREATE POLICY "Allow public read access on hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Allow public read access on restaurants" ON restaurants FOR SELECT USING (true);

-- 6. Verify tables exist and have correct columns
SELECT 'shopping' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'shopping' AND table_schema = 'public'
UNION ALL
SELECT 'hotels' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hotels' AND table_schema = 'public'
UNION ALL
SELECT 'restaurants' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'restaurants' AND table_schema = 'public'
ORDER BY table_name, column_name;
