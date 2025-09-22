-- Add missing reviewer_notes column to staging_queue table
-- Run this in your Supabase SQL Editor

ALTER TABLE staging_queue
ADD COLUMN IF NOT EXISTS reviewer_notes text;

-- Add published status and metadata columns
ALTER TABLE staging_queue
ADD COLUMN IF NOT EXISTS published_at timestamp,
ADD COLUMN IF NOT EXISTS published_activity_id bigint;

-- Update status check constraint to include new statuses
ALTER TABLE staging_queue
DROP CONSTRAINT IF EXISTS staging_queue_status_check;

ALTER TABLE staging_queue
ADD CONSTRAINT staging_queue_status_check
CHECK (status IN ('pending', 'approved', 'rejected', 'needs_review', 'ai_enhanced', 'published'));

-- Fix ai_enhancement_log table reference
ALTER TABLE ai_enhancement_log
DROP CONSTRAINT IF EXISTS ai_enhancement_log_staging_item_id_fkey;

ALTER TABLE ai_enhancement_log
ADD CONSTRAINT ai_enhancement_log_staging_item_id_fkey
FOREIGN KEY (staging_item_id) REFERENCES staging_queue(id) ON DELETE CASCADE;

-- Add missing columns to ai_enhancement_log
ALTER TABLE ai_enhancement_log
ADD COLUMN IF NOT EXISTS staging_id bigint REFERENCES staging_queue(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS action_type text,
ADD COLUMN IF NOT EXISTS input_data jsonb,
ADD COLUMN IF NOT EXISTS output_data jsonb,
ADD COLUMN IF NOT EXISTS confidence_score integer DEFAULT 85,
ADD COLUMN IF NOT EXISTS processing_time integer DEFAULT 1000;

-- Test the update worked
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'staging_queue'
AND column_name IN ('reviewer_notes', 'published_at', 'published_activity_id')
ORDER BY column_name;