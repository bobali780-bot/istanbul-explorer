-- Fix staging_queue table schema
-- Add missing columns for thumbnail management

-- Add missing columns to staging_queue table
ALTER TABLE staging_queue 
ADD COLUMN IF NOT EXISTS thumbnail_index integer,
ADD COLUMN IF NOT EXISTS thumbnail_reason text,
ADD COLUMN IF NOT EXISTS uses_placeholder boolean DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_staging_queue_thumbnail_index ON staging_queue(thumbnail_index);
CREATE INDEX IF NOT EXISTS idx_staging_queue_uses_placeholder ON staging_queue(uses_placeholder);

-- Update existing records to have default values
UPDATE staging_queue 
SET thumbnail_index = 0, 
    thumbnail_reason = 'Auto-selected during scraping',
    uses_placeholder = false 
WHERE thumbnail_index IS NULL;
