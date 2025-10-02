-- Add booking_url column to all main venue tables
-- Run this in Supabase SQL Editor

-- Activities table
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Hotels table
ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Shopping table
ALTER TABLE shopping
ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN activities.booking_url IS 'Third-party booking URL (e.g., Expedia, Viator, GetYourGuide)';
COMMENT ON COLUMN hotels.booking_url IS 'Third-party booking URL (e.g., Booking.com, Expedia, Hotels.com)';
COMMENT ON COLUMN restaurants.booking_url IS 'Third-party booking URL (e.g., OpenTable, TheFork, Resy)';
COMMENT ON COLUMN shopping.booking_url IS 'Third-party booking URL or official store website';
