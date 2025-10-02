-- Fix missing coordinates column in all main category tables
-- Run this in Supabase SQL Editor

-- Add coordinates column to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS coordinates JSONB DEFAULT '{"lat": 41.0082, "lng": 28.9784}';

-- Add coordinates column to hotels table  
ALTER TABLE hotels 
ADD COLUMN IF NOT EXISTS coordinates JSONB DEFAULT '{"lat": 41.0082, "lng": 28.9784}';

-- Add coordinates column to shopping table
ALTER TABLE shopping 
ADD COLUMN IF NOT EXISTS coordinates JSONB DEFAULT '{"lat": 41.0082, "lng": 28.9784}';

-- Add coordinates column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS coordinates JSONB DEFAULT '{"lat": 41.0082, "lng": 28.9784}';

-- Refresh the schema cache multiple times to ensure changes are picked up
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';

-- Confirmation message
SELECT 'Coordinates column added to all category tables - ready for publishing!' as status;
