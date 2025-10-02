-- Check if universal_reviews table has all necessary columns for Google reviews

-- Show current schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'universal_reviews'
ORDER BY ordinal_position;

-- Add missing columns if needed
ALTER TABLE universal_reviews
ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual';

ALTER TABLE universal_reviews
ADD COLUMN IF NOT EXISTS source_url text;

ALTER TABLE universal_reviews
ADD COLUMN IF NOT EXISTS reviewer_photo_url text;

-- Confirm the changes
SELECT 'Schema updated successfully!' as status;
