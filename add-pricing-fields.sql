-- Add pricing fields to all venue tables
-- Run this in Supabase SQL Editor

-- Activities table
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';

-- Hotels table
ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP',
ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20) DEFAULT 'per night';

-- Restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP',
ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20) DEFAULT 'per person';

-- Shopping table (optional - most won't have fixed pricing)
ALTER TABLE shopping
ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';

-- Add comments for documentation
COMMENT ON COLUMN activities.price_from IS 'Starting price in the specified currency';
COMMENT ON COLUMN activities.price_to IS 'Maximum price (optional, for price ranges)';
COMMENT ON COLUMN activities.currency IS 'Currency code (GBP, USD, EUR, TRY)';

COMMENT ON COLUMN hotels.price_from IS 'Starting price per night';
COMMENT ON COLUMN hotels.price_unit IS 'Pricing unit (per night, per room, etc)';

COMMENT ON COLUMN restaurants.price_from IS 'Average meal price';
COMMENT ON COLUMN restaurants.price_unit IS 'Pricing unit (per person, per meal, etc)';

-- Example data updates (you can customize these)
-- These are rough estimates for Istanbul venues based on typical prices

-- Update some activities with estimated prices
UPDATE activities
SET price_from = 0, currency = 'GBP'
WHERE is_free = true;

-- Set default estimates based on price_range for activities without specific prices
UPDATE activities
SET
  price_from = CASE
    WHEN price_range = '$' THEN 5
    WHEN price_range = '$$' THEN 20
    WHEN price_range = '$$$' THEN 50
    WHEN price_range = '$$$$' THEN 100
    ELSE 15
  END,
  currency = 'GBP'
WHERE price_from IS NULL;

-- Set default estimates for hotels based on price_range
UPDATE hotels
SET
  price_from = CASE
    WHEN price_range = '$' THEN 60
    WHEN price_range = '$$' THEN 120
    WHEN price_range = '$$$' THEN 250
    WHEN price_range = '$$$$' THEN 400
    ELSE 100
  END,
  currency = 'GBP',
  price_unit = 'per night'
WHERE price_from IS NULL;

-- Set default estimates for restaurants based on price_range
UPDATE restaurants
SET
  price_from = CASE
    WHEN price_range = '$' THEN 10
    WHEN price_range = '$$' THEN 25
    WHEN price_range = '$$$' THEN 50
    WHEN price_range = '$$$$' THEN 80
    ELSE 20
  END,
  currency = 'GBP',
  price_unit = 'per person'
WHERE price_from IS NULL;
