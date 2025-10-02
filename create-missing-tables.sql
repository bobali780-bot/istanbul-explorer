-- Create missing tables for Istanbul Explorer
-- Run this in Supabase SQL Editor

-- Create shopping table (similar to activities but without duration)
CREATE TABLE shopping (
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

-- Create hotels table (similar to activities but without duration)
CREATE TABLE hotels (
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

-- Create restaurants table (similar to activities but without duration)
CREATE TABLE restaurants (
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

-- Create indexes for performance
CREATE INDEX ON shopping (rating DESC, review_count DESC);
CREATE INDEX ON hotels (rating DESC, review_count DESC);
CREATE INDEX ON restaurants (rating DESC, review_count DESC);

-- Add RLS policies (if needed)
ALTER TABLE shopping ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on shopping" ON shopping FOR SELECT USING (true);
CREATE POLICY "Allow public read access on hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Allow public read access on restaurants" ON restaurants FOR SELECT USING (true);

