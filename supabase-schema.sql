-- Istanbul Explorer Activities Schema
-- Run this in Supabase SQL Editor

-- Table for activities
CREATE TABLE activities (
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
  duration text,
  opening_hours text,
  location text,
  highlights text[],
  trip_advisor_url text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table for activity images
CREATE TABLE activity_images (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  activity_id bigint REFERENCES activities(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

-- Index for faster joins
CREATE INDEX ON activity_images (activity_id);
CREATE INDEX ON activity_images (activity_id, sort_order);

-- Table for activity reviews
CREATE TABLE activity_reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  activity_id bigint REFERENCES activities(id) ON DELETE CASCADE,
  author text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  review_date text,
  created_at timestamp DEFAULT now()
);

-- Index for reviews
CREATE INDEX ON activity_reviews (activity_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Activities are viewable by everyone" ON activities
FOR SELECT USING (true);

CREATE POLICY "Activity images are viewable by everyone" ON activity_images
FOR SELECT USING (true);

CREATE POLICY "Activity reviews are viewable by everyone" ON activity_reviews
FOR SELECT USING (true);