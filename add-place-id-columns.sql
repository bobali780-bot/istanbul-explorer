-- Add google_place_id column to all category tables

-- Add to activities table
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS google_place_id text;

-- Add to hotels table
ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS google_place_id text;

-- Add to shopping table
ALTER TABLE shopping
ADD COLUMN IF NOT EXISTS google_place_id text;

-- Add to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS google_place_id text;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_activities_google_place_id ON activities(google_place_id);
CREATE INDEX IF NOT EXISTS idx_hotels_google_place_id ON hotels(google_place_id);
CREATE INDEX IF NOT EXISTS idx_shopping_google_place_id ON shopping(google_place_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_google_place_id ON restaurants(google_place_id);

SELECT 'Successfully added google_place_id column to all tables!' as status;
