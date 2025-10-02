-- Add price_unit to activities table (it was missing!)
ALTER TABLE activities ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20);

-- Also add to shopping table
ALTER TABLE shopping ADD COLUMN IF NOT EXISTS price_unit VARCHAR(20);
