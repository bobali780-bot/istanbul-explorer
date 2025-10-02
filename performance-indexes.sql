-- Performance optimization indexes
-- Run this in Supabase SQL Editor

-- Index for filtering by is_active (most common query)
CREATE INDEX IF NOT EXISTS idx_activities_is_active ON activities(is_active);
CREATE INDEX IF NOT EXISTS idx_hotels_is_active ON hotels(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_shopping_is_active ON shopping(is_active);

-- Index for slug lookups (detail pages)
CREATE INDEX IF NOT EXISTS idx_activities_slug ON activities(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON hotels(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shopping_slug ON shopping(slug) WHERE is_active = true;

-- Index for rating-based sorting (most common sort)
CREATE INDEX IF NOT EXISTS idx_activities_rating ON activities(rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shopping_rating ON shopping(rating DESC) WHERE is_active = true;

-- Index for featured items
CREATE INDEX IF NOT EXISTS idx_activities_featured ON activities(is_featured, rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_hotels_featured ON hotels(is_featured, rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON restaurants(is_featured, rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shopping_featured ON shopping(is_featured, rating DESC) WHERE is_active = true;

-- Index for media lookups
CREATE INDEX IF NOT EXISTS idx_media_entity ON universal_media(entity_type, entity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_media_primary ON universal_media(entity_type, entity_id) WHERE is_primary = true;

-- Index for reviews lookups
CREATE INDEX IF NOT EXISTS idx_reviews_entity ON universal_reviews(entity_type, entity_id, review_date DESC);

-- Analyze tables to update statistics
ANALYZE activities;
ANALYZE hotels;
ANALYZE restaurants;
ANALYZE shopping;
ANALYZE universal_media;
ANALYZE universal_reviews;
