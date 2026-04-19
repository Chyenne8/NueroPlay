-- NeuroPlay Backend Database Schema
-- This SQL creates the required Supabase table for the key-value store

-- Create the kv_store table
CREATE TABLE IF NOT EXISTS kv_store_3f317989 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS kv_store_key_idx ON kv_store_3f317989(key);

-- Create index for prefix searches
CREATE INDEX IF NOT EXISTS kv_store_key_prefix_idx ON kv_store_3f317989(key text_pattern_ops);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_kv_store_updated_at 
  BEFORE UPDATE ON kv_store_3f317989
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE kv_store_3f317989 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access to kv_store"
  ON kv_store_3f317989
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Note: The backend uses the service role key, so it bypasses RLS
-- But it's good practice to have policies in place
