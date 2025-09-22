-- Run this in your Supabase SQL Editor to create the admin dashboard tables
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query

-- 1. Universal staging table with structured fields + flexible JSON
CREATE TABLE IF NOT EXISTS staging_queue (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Structured fields for fast dashboard queries
  title text NOT NULL,
  slug text,
  category text NOT NULL CHECK (category IN ('activities', 'restaurants', 'hotels', 'shopping', 'food_drink')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_review', 'ai_enhanced')),

  -- Image handling
  primary_image text, -- Single URL for immediate card display
  images text[], -- Full array of 10-15 images
  image_count integer DEFAULT 0,

  -- Content storage
  raw_content jsonb NOT NULL, -- Original scraped data
  processed_content jsonb, -- Mapped to category schema
  ai_enhanced_content jsonb, -- Only populated when "Enhance with AI" is used

  -- Metadata
  confidence_score integer DEFAULT 0,
  source_urls text[],
  scraping_job_id bigint,

  -- Quality indicators for quick filtering
  has_description boolean DEFAULT false,
  has_price boolean DEFAULT false,
  has_location boolean DEFAULT false,
  has_rating boolean DEFAULT false,

  -- Timestamps
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  reviewed_at timestamp,
  enhanced_at timestamp
);

-- 2. Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug = lower(regexp_replace(
    regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_slug
  BEFORE INSERT OR UPDATE ON staging_queue
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

-- 3. Duplicate detection with improved hashing
CREATE TABLE IF NOT EXISTS duplicate_detection (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_hash text UNIQUE NOT NULL, -- Hash of title + location
  title_slug text NOT NULL,
  category text NOT NULL,
  source_table text, -- 'staging_queue' or target table name
  source_id bigint,
  created_at timestamp DEFAULT now()
);

-- 4. Approved content sources by category
CREATE TABLE IF NOT EXISTS content_sources (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category text NOT NULL,
  domain text NOT NULL,
  base_url text,
  source_type text NOT NULL, -- 'official', 'booking', 'images', 'reviews'
  is_active boolean DEFAULT true,
  quality_score integer DEFAULT 100,
  rate_limit_per_hour integer DEFAULT 50,
  firecrawl_config jsonb, -- Category-specific scraping settings
  created_at timestamp DEFAULT now()
);

-- 5. Enhanced scraping jobs tracking
CREATE TABLE IF NOT EXISTS scraping_jobs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_type text NOT NULL, -- 'multi_search', 'auto_fetch', 'single_item'
  category text NOT NULL,
  input_data jsonb NOT NULL, -- Keywords, settings, etc.

  -- Progress tracking
  status text DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  total_items integer DEFAULT 0,
  processed_items integer DEFAULT 0,
  successful_items integer DEFAULT 0,
  failed_items integer DEFAULT 0,
  duplicate_items integer DEFAULT 0,

  -- Firecrawl usage tracking
  credits_used integer DEFAULT 0,
  credits_remaining integer,

  -- Results
  staging_ids bigint[], -- IDs of created staging items
  error_log jsonb,
  performance_metrics jsonb,

  -- Timestamps
  started_at timestamp,
  completed_at timestamp,
  created_at timestamp DEFAULT now()
);

-- 6. AI enhancement logs for copyright tracking
CREATE TABLE IF NOT EXISTS ai_enhancement_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  staging_item_id bigint REFERENCES staging_queue(id) ON DELETE CASCADE,
  original_content jsonb,
  enhanced_content jsonb,
  enhancement_type text, -- 'description_rewrite', 'highlights_extract', 'seo_optimize'
  model_used text, -- 'claude-3', 'gpt-4', etc.
  prompt_template text,
  word_count_before integer,
  word_count_after integer,
  created_at timestamp DEFAULT now()
);

-- 7. Performance indexes
CREATE INDEX IF NOT EXISTS idx_staging_queue_category_status ON staging_queue(category, status);
CREATE INDEX IF NOT EXISTS idx_staging_queue_created_at ON staging_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staging_queue_confidence ON staging_queue(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_staging_queue_slug ON staging_queue(slug);
CREATE INDEX IF NOT EXISTS idx_duplicate_detection_hash ON duplicate_detection(content_hash);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_sources_category ON content_sources(category, is_active);

-- 8. Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_staging_queue_updated_at
  BEFORE UPDATE ON staging_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Add unique constraint for content sources
ALTER TABLE content_sources ADD CONSTRAINT unique_domain_category UNIQUE (domain, category);

-- 10. Insert default content sources
INSERT INTO content_sources (category, domain, base_url, source_type, firecrawl_config) VALUES
-- Activities sources
('activities', 'tripadvisor.com', 'https://www.tripadvisor.com', 'reviews', '{"waitFor": 3000, "timeout": 30000}'),
('activities', 'getyourguide.com', 'https://www.getyourguide.com', 'booking', '{"waitFor": 2000, "timeout": 25000}'),
('activities', 'viator.com', 'https://www.viator.com', 'booking', '{"waitFor": 2000, "timeout": 25000}'),

-- Restaurant sources
('restaurants', 'tripadvisor.com', 'https://www.tripadvisor.com', 'reviews', '{"waitFor": 3000, "timeout": 30000}'),

-- Hotel sources
('hotels', 'booking.com', 'https://www.booking.com', 'booking', '{"waitFor": 4000, "timeout": 35000}'),

-- Shopping sources
('shopping', 'tripadvisor.com', 'https://www.tripadvisor.com', 'reviews', '{"waitFor": 3000, "timeout": 30000}'),

-- Food & Drink sources
('food_drink', 'tripadvisor.com', 'https://www.tripadvisor.com', 'reviews', '{"waitFor": 3000, "timeout": 30000}')

ON CONFLICT (domain, category) DO NOTHING;

-- 10. Test insert to verify everything works
INSERT INTO staging_queue (
  title,
  category,
  primary_image,
  images,
  image_count,
  raw_content,
  confidence_score,
  source_urls,
  has_description,
  has_location,
  has_rating
) VALUES (
  'Test Activity - Blue Mosque',
  'activities',
  'https://example.com/blue-mosque.jpg',
  ARRAY['https://example.com/blue-mosque.jpg', 'https://example.com/blue-mosque-2.jpg'],
  2,
  '{"description": "Historic mosque in Istanbul", "location": "Sultanahmet, Istanbul", "rating": 4.5, "source": "test"}'::jsonb,
  85,
  ARRAY['https://example.com/source'],
  true,
  true,
  true
);

-- Verify the setup worked
SELECT
  'staging_queue' as table_name,
  count(*) as row_count
FROM staging_queue
UNION ALL
SELECT
  'content_sources' as table_name,
  count(*) as row_count
FROM content_sources;

-- Clean up test data
DELETE FROM staging_queue WHERE title = 'Test Activity - Blue Mosque';