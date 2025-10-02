-- Add booking link columns to activities table
-- This will store booking URLs and related metadata

ALTER TABLE activities ADD COLUMN IF NOT EXISTS booking_url TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS booking_platform VARCHAR(50); -- 'expedia', 'viator', 'getyourguide', 'official', 'manual'
ALTER TABLE activities ADD COLUMN IF NOT EXISTS booking_status VARCHAR(20) DEFAULT 'pending'; -- 'pending', 'found', 'not_found', 'approved', 'rejected'
ALTER TABLE activities ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255); -- Store Google Place ID for future reference
ALTER TABLE activities ADD COLUMN IF NOT EXISTS official_website TEXT; -- Official website from Google Places
ALTER TABLE activities ADD COLUMN IF NOT EXISTS booking_notes TEXT; -- Admin notes about booking link

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_activities_booking_status ON activities(booking_status);
CREATE INDEX IF NOT EXISTS idx_activities_google_place_id ON activities(google_place_id);

-- Add comments for documentation
COMMENT ON COLUMN activities.booking_url IS 'Direct booking URL for this activity';
COMMENT ON COLUMN activities.booking_platform IS 'Platform where booking URL points to';
COMMENT ON COLUMN activities.booking_status IS 'Status of booking link discovery and approval';
COMMENT ON COLUMN activities.google_place_id IS 'Google Places API Place ID for this location';
COMMENT ON COLUMN activities.official_website IS 'Official website URL from Google Places';
COMMENT ON COLUMN activities.booking_notes IS 'Admin notes about booking link quality or issues';
