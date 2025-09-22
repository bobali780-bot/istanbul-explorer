-- Istanbul Explorer Comprehensive Database Schema
-- Comprehensive schema covering all site categories with automated content system
-- Run this in Supabase SQL Editor

-- ===========================================
-- CATEGORY MANAGEMENT TABLES
-- ===========================================

-- Master categories table
CREATE TABLE categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ===========================================
-- ACTIVITIES CATEGORY TABLES
-- ===========================================

-- Activities table (existing structure enhanced)
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
  google_maps_url text,
  website_url text,
  phone text,
  address text,
  district text,
  metro_station text,
  best_time_to_visit text,
  difficulty_level text,
  accessibility_info text,
  languages_spoken text[],
  category_id bigint REFERENCES categories(id),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  visitor_count integer DEFAULT 0,
  popularity_score integer DEFAULT 0,
  last_updated timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Activity schedules for time-based activities
CREATE TABLE activity_schedules (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  activity_id bigint REFERENCES activities(id) ON DELETE CASCADE,
  day_of_week text NOT NULL, -- 'monday', 'tuesday', etc.
  opening_time time,
  closing_time time,
  is_closed boolean DEFAULT false,
  special_notes text,
  created_at timestamp DEFAULT now()
);

-- ===========================================
-- RESTAURANTS CATEGORY TABLES
-- ===========================================

-- Restaurants table
CREATE TABLE restaurants (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_overview text,
  full_description text,
  cuisine_type text,
  price_range text, -- '$', '$$', '$$$', '$$$$'
  rating numeric(2,1),
  review_count integer,
  phone text,
  website_url text,
  booking_url text,
  address text,
  district text,
  metro_station text,
  opening_hours text,
  google_maps_url text,
  trip_advisor_url text,
  specialties text[],
  dietary_options text[], -- 'vegetarian', 'vegan', 'halal', etc.
  ambiance text, -- 'casual', 'fine-dining', 'family-friendly', etc.
  seating_capacity integer,
  outdoor_seating boolean DEFAULT false,
  reservations_required boolean DEFAULT false,
  accepts_credit_cards boolean DEFAULT true,
  wifi_available boolean DEFAULT true,
  category_id bigint REFERENCES categories(id),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  visitor_count integer DEFAULT 0,
  popularity_score integer DEFAULT 0,
  last_updated timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Restaurant menus
CREATE TABLE restaurant_menus (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  restaurant_id bigint REFERENCES restaurants(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'appetizer', 'main', 'dessert', 'beverage'
  item_name text NOT NULL,
  description text,
  price numeric(10,2),
  currency text DEFAULT 'TRY',
  is_popular boolean DEFAULT false,
  dietary_tags text[], -- 'vegetarian', 'spicy', 'gluten-free'
  sort_order integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

-- ===========================================
-- HOTELS CATEGORY TABLES
-- ===========================================

-- Hotels table
CREATE TABLE hotels (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_overview text,
  full_description text,
  star_rating integer CHECK (star_rating >= 1 AND star_rating <= 5),
  rating numeric(2,1),
  review_count integer,
  phone text,
  website_url text,
  booking_url text,
  address text,
  district text,
  metro_station text,
  google_maps_url text,
  trip_advisor_url text,
  check_in_time time DEFAULT '15:00:00',
  check_out_time time DEFAULT '11:00:00',
  amenities text[], -- 'wifi', 'pool', 'gym', 'spa', etc.
  room_types text[],
  price_range text,
  total_rooms integer,
  languages_spoken text[],
  parking_available boolean DEFAULT false,
  pet_friendly boolean DEFAULT false,
  business_center boolean DEFAULT false,
  concierge_service boolean DEFAULT false,
  category_id bigint REFERENCES categories(id),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  visitor_count integer DEFAULT 0,
  popularity_score integer DEFAULT 0,
  last_updated timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Hotel rooms
CREATE TABLE hotel_rooms (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hotel_id bigint REFERENCES hotels(id) ON DELETE CASCADE,
  room_type text NOT NULL,
  description text,
  max_occupancy integer,
  bed_type text,
  room_size numeric(5,1), -- in square meters
  amenities text[],
  base_price numeric(10,2),
  currency text DEFAULT 'TRY',
  is_available boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

-- ===========================================
-- SHOPPING CATEGORY TABLES
-- ===========================================

-- Shopping venues table
CREATE TABLE shopping_venues (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_overview text,
  full_description text,
  venue_type text, -- 'market', 'mall', 'boutique', 'bazaar'
  rating numeric(2,1),
  review_count integer,
  phone text,
  website_url text,
  address text,
  district text,
  metro_station text,
  opening_hours text,
  google_maps_url text,
  trip_advisor_url text,
  specialties text[], -- 'textiles', 'jewelry', 'antiques', etc.
  price_range text,
  accepts_credit_cards boolean DEFAULT true,
  bargaining_expected boolean DEFAULT false,
  tourist_friendly boolean DEFAULT true,
  languages_spoken text[],
  category_id bigint REFERENCES categories(id),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  visitor_count integer DEFAULT 0,
  popularity_score integer DEFAULT 0,
  last_updated timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Shopping products/categories
CREATE TABLE shopping_products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  venue_id bigint REFERENCES shopping_venues(id) ON DELETE CASCADE,
  product_category text NOT NULL,
  product_name text,
  description text,
  typical_price_range text,
  currency text DEFAULT 'TRY',
  is_popular boolean DEFAULT false,
  bargaining_tips text,
  quality_notes text,
  sort_order integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

-- ===========================================
-- UNIVERSAL POLYMORPHIC TABLES
-- ===========================================

-- Universal media table (replaces activity_images)
CREATE TABLE universal_media (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL, -- 'activity', 'restaurant', 'hotel', 'shopping_venue'
  entity_id bigint NOT NULL,
  media_type text NOT NULL, -- 'image', 'video', '360_tour'
  media_url text NOT NULL,
  thumbnail_url text,
  alt_text text,
  caption text,
  attribution text,
  source text, -- 'unsplash', 'pexels', 'user_upload'
  is_primary boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  quality_score integer DEFAULT 0, -- AI-assessed quality 1-100
  created_at timestamp DEFAULT now()
);

-- Universal social content
CREATE TABLE universal_social_content (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id bigint NOT NULL,
  platform text NOT NULL, -- 'instagram', 'tiktok', 'youtube'
  content_url text NOT NULL,
  embed_code text,
  caption text,
  engagement_score integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Universal reviews table (replaces activity_reviews)
CREATE TABLE universal_reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id bigint NOT NULL,
  source text NOT NULL, -- 'tripadvisor', 'google', 'yelp', 'user'
  author text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  review_date date,
  helpful_votes integer DEFAULT 0,
  verified_stay boolean DEFAULT false,
  language text DEFAULT 'en',
  created_at timestamp DEFAULT now()
);

-- Universal insights and analytics
CREATE TABLE universal_insights (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id bigint NOT NULL,
  metric_type text NOT NULL, -- 'wikipedia_views', 'google_trends', 'social_mentions'
  metric_value numeric,
  time_period text, -- 'daily', 'weekly', 'monthly'
  recorded_date date DEFAULT CURRENT_DATE,
  data_source text,
  raw_data jsonb,
  created_at timestamp DEFAULT now()
);

-- Universal nearby recommendations
CREATE TABLE universal_nearby_recommendations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_entity_type text NOT NULL,
  source_entity_id bigint NOT NULL,
  target_entity_type text NOT NULL,
  target_entity_id bigint NOT NULL,
  distance_meters integer,
  walking_time_minutes integer,
  recommendation_score integer DEFAULT 0, -- Algorithm-calculated score
  recommendation_reason text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- ===========================================
-- CONTENT AUTOMATION TABLES
-- ===========================================

-- Visitor guides and curated content
CREATE TABLE visitor_guides (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  guide_type text, -- 'top_10', 'district_guide', 'themed_itinerary'
  target_audience text, -- 'families', 'couples', 'budget', 'luxury'
  duration_days integer,
  estimated_budget text,
  best_season text,
  included_entities jsonb, -- Array of {type, id} objects
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  last_auto_update timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Photography spots for Instagram-worthy locations
CREATE TABLE photography_spots (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id bigint NOT NULL,
  spot_name text NOT NULL,
  description text,
  best_time_for_photos text,
  lighting_conditions text,
  photo_tips text,
  instagram_hashtags text[],
  difficulty_level text, -- 'easy', 'moderate', 'difficult'
  equipment_needed text,
  is_featured boolean DEFAULT false,
  photo_examples text[], -- URLs to example photos
  created_at timestamp DEFAULT now()
);

-- API usage tracking for automation
CREATE TABLE api_usage_tracking (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  api_name text NOT NULL,
  endpoint text,
  requests_count integer DEFAULT 1,
  date_used date DEFAULT CURRENT_DATE,
  monthly_limit integer,
  cost_per_request numeric(10,4),
  status text DEFAULT 'success', -- 'success', 'error', 'rate_limited'
  error_message text,
  created_at timestamp DEFAULT now()
);

-- Automation logs
CREATE TABLE automation_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_type text NOT NULL, -- 'content_update', 'ranking_calculation', 'image_fetch'
  entity_type text,
  entity_id bigint,
  status text NOT NULL, -- 'running', 'completed', 'failed'
  start_time timestamp DEFAULT now(),
  end_time timestamp,
  details jsonb,
  error_message text,
  created_at timestamp DEFAULT now()
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Category indexes
CREATE INDEX ON categories (slug);
CREATE INDEX ON categories (is_active);

-- Activity indexes
CREATE INDEX ON activities (slug);
CREATE INDEX ON activities (category_id);
CREATE INDEX ON activities (is_featured, is_active);
CREATE INDEX ON activities (popularity_score DESC);
CREATE INDEX ON activities (district);

-- Restaurant indexes
CREATE INDEX ON restaurants (slug);
CREATE INDEX ON restaurants (category_id);
CREATE INDEX ON restaurants (cuisine_type);
CREATE INDEX ON restaurants (price_range);
CREATE INDEX ON restaurants (district);

-- Hotel indexes
CREATE INDEX ON hotels (slug);
CREATE INDEX ON hotels (category_id);
CREATE INDEX ON hotels (star_rating);
CREATE INDEX ON hotels (district);

-- Shopping indexes
CREATE INDEX ON shopping_venues (slug);
CREATE INDEX ON shopping_venues (category_id);
CREATE INDEX ON shopping_venues (venue_type);
CREATE INDEX ON shopping_venues (district);

-- Universal table indexes
CREATE INDEX ON universal_media (entity_type, entity_id);
CREATE INDEX ON universal_media (entity_type, entity_id, sort_order);
CREATE INDEX ON universal_social_content (entity_type, entity_id);
CREATE INDEX ON universal_reviews (entity_type, entity_id);
CREATE INDEX ON universal_insights (entity_type, entity_id, metric_type);
CREATE INDEX ON universal_nearby_recommendations (source_entity_type, source_entity_id);

-- Automation indexes
CREATE INDEX ON automation_logs (job_type, status);
CREATE INDEX ON api_usage_tracking (api_name, date_used);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_social_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_nearby_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE photography_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Activities are viewable by everyone" ON activities FOR SELECT USING (true);
CREATE POLICY "Activity schedules are viewable by everyone" ON activity_schedules FOR SELECT USING (true);
CREATE POLICY "Restaurants are viewable by everyone" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Restaurant menus are viewable by everyone" ON restaurant_menus FOR SELECT USING (true);
CREATE POLICY "Hotels are viewable by everyone" ON hotels FOR SELECT USING (true);
CREATE POLICY "Hotel rooms are viewable by everyone" ON hotel_rooms FOR SELECT USING (true);
CREATE POLICY "Shopping venues are viewable by everyone" ON shopping_venues FOR SELECT USING (true);
CREATE POLICY "Shopping products are viewable by everyone" ON shopping_products FOR SELECT USING (true);
CREATE POLICY "Universal media is viewable by everyone" ON universal_media FOR SELECT USING (true);
CREATE POLICY "Universal social content is viewable by everyone" ON universal_social_content FOR SELECT USING (true);
CREATE POLICY "Universal reviews are viewable by everyone" ON universal_reviews FOR SELECT USING (true);
CREATE POLICY "Universal insights are viewable by everyone" ON universal_insights FOR SELECT USING (true);
CREATE POLICY "Universal nearby recommendations are viewable by everyone" ON universal_nearby_recommendations FOR SELECT USING (true);
CREATE POLICY "Visitor guides are viewable by everyone" ON visitor_guides FOR SELECT USING (true);
CREATE POLICY "Photography spots are viewable by everyone" ON photography_spots FOR SELECT USING (true);

-- ===========================================
-- INITIAL CATEGORY DATA
-- ===========================================

INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Activities & Attractions', 'activities', 'Historic sites, museums, tours and entertainment', 'map-pin', 1),
('Restaurants & Dining', 'restaurants', 'Traditional Turkish cuisine and international dining', 'utensils', 2),
('Hotels & Accommodation', 'hotels', 'Luxury hotels, boutique stays and budget options', 'bed', 3),
('Shopping & Markets', 'shopping', 'Grand Bazaar, local markets and modern shopping', 'shopping-bag', 4);