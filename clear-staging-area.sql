-- Clear ALL items from staging area (pending, approved, rejected, etc.)
-- Run this in Supabase SQL Editor

-- Clear all staging queue items
DELETE FROM staging_queue;

-- Clear all associated universal_media entries for staging items
DELETE FROM universal_media 
WHERE entity_type = 'staging_queue';

-- Clear any staging-related reviews if they exist
DELETE FROM reviews 
WHERE entity_type = 'staging_queue';

-- Reset any auto-increment sequences (if applicable)
-- This ensures new items start with clean IDs
SELECT setval(pg_get_serial_sequence('staging_queue', 'id'), 1, false);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Confirmation message
SELECT 'Staging area completely cleared - ready for fresh affiliate content collection!' as status;
