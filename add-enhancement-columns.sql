-- Add AI enhancement columns to all category tables

-- Shopping table
ALTER TABLE shopping
ADD COLUMN IF NOT EXISTS why_visit JSONB,
ADD COLUMN IF NOT EXISTS accessibility JSONB,
ADD COLUMN IF NOT EXISTS facilities JSONB,
ADD COLUMN IF NOT EXISTS practical_info JSONB;

-- Activities table
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS why_visit JSONB,
ADD COLUMN IF NOT EXISTS accessibility JSONB,
ADD COLUMN IF NOT EXISTS facilities JSONB,
ADD COLUMN IF NOT EXISTS practical_info JSONB;

-- Hotels table
ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS why_visit JSONB,
ADD COLUMN IF NOT EXISTS accessibility JSONB,
ADD COLUMN IF NOT EXISTS facilities JSONB,
ADD COLUMN IF NOT EXISTS practical_info JSONB;

-- Restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS why_visit JSONB,
ADD COLUMN IF NOT EXISTS accessibility JSONB,
ADD COLUMN IF NOT EXISTS facilities JSONB,
ADD COLUMN IF NOT EXISTS practical_info JSONB;
