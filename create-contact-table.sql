-- Create contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  admin_notes TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submitted_at ON contact_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

-- Add Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (submit contact form)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow only authenticated users to view submissions (for admin)
CREATE POLICY "Allow authenticated to view" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow only authenticated users to update submissions (for admin)
CREATE POLICY "Allow authenticated to update" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);
