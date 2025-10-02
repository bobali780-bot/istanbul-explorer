-- Simple pricing fields addition
-- Run this in Supabase SQL Editor

-- Add columns to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';

-- Add columns to hotels table
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20) DEFAULT 'per night';

-- Add columns to restaurants table
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20) DEFAULT 'per person';

-- Add columns to shopping table
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2);
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS price_to DECIMAL(10,2);
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';

-- Set default prices for activities based on price_range
UPDATE activities
SET price_from = CASE
  WHEN price_range = '$' THEN 20
  WHEN price_range = '$$' THEN 50
  WHEN price_range = '$$$' THEN 100
  ELSE 15
END,
currency = 'GBP'
WHERE price_from IS NULL;

-- Set default prices for hotels based on price_range
UPDATE hotels
SET price_from = CASE
  WHEN price_range = '$' THEN 60
  WHEN price_range = '$$' THEN 120
  WHEN price_range = '$$$' THEN 250
  WHEN price_range = '$$$$' THEN 400
  ELSE 100
END,
currency = 'GBP',
price_unit = 'per night'
WHERE price_from IS NULL;

-- Set default prices for restaurants based on price_range
UPDATE restaurants
SET price_from = CASE
  WHEN price_range = '$' THEN 10
  WHEN price_range = '$$' THEN 25
  WHEN price_range = '$$$' THEN 50
  WHEN price_range = '$$$$' THEN 80
  ELSE 20
END,
currency = 'GBP',
price_unit = 'per person'
WHERE price_from IS NULL;

-- Set default prices for shopping based on price_range
UPDATE shopping
SET price_from = CASE
  WHEN price_range = '$' THEN 5
  WHEN price_range = '$$' THEN 20
  WHEN price_range = '$$$' THEN 50
  WHEN price_range = '$$$$' THEN 100
  ELSE 10
END,
currency = 'GBP'
WHERE price_from IS NULL;
