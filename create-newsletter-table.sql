-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  source VARCHAR(100) DEFAULT 'insider-weekly'
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Add Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow only authenticated users to view subscribers (for admin)
CREATE POLICY "Allow authenticated to view" ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);
