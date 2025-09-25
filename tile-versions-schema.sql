-- Create tile_versions table for version management
CREATE TABLE IF NOT EXISTS tile_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tile_id UUID NOT NULL REFERENCES staging_queue(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  changes_summary TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tile_id, version_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tile_versions_tile_id ON tile_versions(tile_id);
CREATE INDEX IF NOT EXISTS idx_tile_versions_status ON tile_versions(status);
CREATE INDEX IF NOT EXISTS idx_tile_versions_created_at ON tile_versions(created_at DESC);

-- Add RLS policies
ALTER TABLE tile_versions ENABLE ROW LEVEL SECURITY;

-- Policy for service role (admin operations)
CREATE POLICY "Service role can manage tile versions" ON tile_versions
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users (read-only)
CREATE POLICY "Authenticated users can view tile versions" ON tile_versions
  FOR SELECT USING (auth.role() = 'authenticated');
