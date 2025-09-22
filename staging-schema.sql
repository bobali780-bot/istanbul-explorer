-- Admin Dashboard Staging Schema
-- For temporary content storage before approval and publishing

-- Staging activities table (mirrors main activities but with approval workflow)
CREATE TABLE staging_activities (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Basic Info
  name text NOT NULL,
  slug text,
  description text,
  short_overview text,
  full_description text,

  -- Location
  address text,
  district text,
  metro_station text,
  location text,
  latitude numeric,
  longitude numeric,
  google_maps_url text,
  website_url text,

  -- Practical Info
  duration text,
  price_range text,
  is_free boolean DEFAULT false,
  booking_required boolean DEFAULT false,
  opening_hours text,
  best_time_to_visit text,
  dress_code text,
  entry_requirements text,
  accessibility_info text,

  -- Content
  historical_context text,
  cultural_significance text,
  highlights text[],
  languages_spoken text[],

  -- SEO
  meta_title text,
  meta_description text,
  seo_keywords text[],
  seo_schema jsonb,

  -- Ratings and Reviews
  rating numeric(3,2),
  review_count integer DEFAULT 0,
  popularity_score integer DEFAULT 0,

  -- Categories
  category_id bigint,
  category_name text, -- Denormalized for staging

  -- Workflow Status
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'needs_review')),
  admin_notes text,
  scraped_from text, -- Source URL or search term

  -- Quality Metrics
  confidence_score integer DEFAULT 0,
  data_sources text[],
  scrape_quality jsonb, -- Store quality metrics from scraping

  -- Timestamps
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  approved_at timestamp,
  published_at timestamp,

  -- Admin tracking
  approved_by text,
  rejected_reason text
);

-- Staging media table
CREATE TABLE staging_media (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  staging_activity_id bigint REFERENCES staging_activities(id) ON DELETE CASCADE,

  media_type text NOT NULL DEFAULT 'image',
  media_url text NOT NULL,
  thumbnail_url text,
  alt_text text,
  caption text,
  attribution text,
  source text,

  -- Quality and ordering
  is_primary boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  quality_score integer DEFAULT 0,

  -- Image metadata
  width integer,
  height integer,
  file_size integer,
  format text,

  -- Approval workflow
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  admin_notes text,

  created_at timestamp DEFAULT now()
);

-- Staging reviews table
CREATE TABLE staging_reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  staging_activity_id bigint REFERENCES staging_activities(id) ON DELETE CASCADE,

  source text NOT NULL, -- 'tripadvisor', 'google', 'booking', etc.
  source_url text,
  reviewer_name text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_title text,
  review_content text,
  review_date date,
  helpful_votes integer DEFAULT 0,
  verified_booking boolean DEFAULT false,
  language text DEFAULT 'en',

  -- Approval workflow
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  admin_notes text,

  created_at timestamp DEFAULT now()
);

-- Scraping jobs tracking
CREATE TABLE scraping_jobs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  job_type text NOT NULL, -- 'single_search', 'bulk_import', 'csv_upload'
  input_data jsonb, -- Store search terms, URLs, CSV data, etc.

  status text DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  progress integer DEFAULT 0, -- Percentage complete

  -- Results
  total_items integer DEFAULT 0,
  processed_items integer DEFAULT 0,
  successful_items integer DEFAULT 0,
  failed_items integer DEFAULT 0,

  -- Error tracking
  error_log jsonb,
  warnings jsonb,

  -- Performance metrics
  started_at timestamp,
  completed_at timestamp,
  estimated_duration interval,

  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Admin activity log
CREATE TABLE admin_activity_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  action_type text NOT NULL, -- 'approve', 'reject', 'publish', 'edit', 'delete'
  entity_type text NOT NULL, -- 'activity', 'media', 'review'
  entity_id bigint,

  old_values jsonb,
  new_values jsonb,
  admin_notes text,

  -- Context
  ip_address inet,
  user_agent text,

  created_at timestamp DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_staging_activities_approval_status ON staging_activities(approval_status);
CREATE INDEX idx_staging_activities_created_at ON staging_activities(created_at DESC);
CREATE INDEX idx_staging_activities_scraped_from ON staging_activities(scraped_from);
CREATE INDEX idx_staging_media_activity_id ON staging_media(staging_activity_id);
CREATE INDEX idx_staging_media_approval_status ON staging_media(approval_status);
CREATE INDEX idx_staging_reviews_activity_id ON staging_reviews(staging_activity_id);
CREATE INDEX idx_scraping_jobs_status ON scraping_jobs(status);
CREATE INDEX idx_scraping_jobs_created_at ON scraping_jobs(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staging_activities_updated_at
  BEFORE UPDATE ON staging_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scraping_jobs_updated_at
  BEFORE UPDATE ON scraping_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();