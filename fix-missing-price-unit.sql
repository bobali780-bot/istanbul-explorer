-- Fix missing price_unit columns
-- Run this in Supabase SQL Editor

-- Add price_unit to activities table
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20) DEFAULT 'per person';

-- Add price_unit to shopping table  
ALTER TABLE shopping
ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20) DEFAULT 'per item';

-- Update existing records with default values
UPDATE activities 
SET price_unit = 'per person' 
WHERE price_unit IS NULL;

UPDATE shopping 
SET price_unit = 'per item' 
WHERE price_unit IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN activities.price_unit IS 'Pricing unit (per person, per group, etc)';
COMMENT ON COLUMN shopping.price_unit IS 'Pricing unit (per item, per piece, etc)';
