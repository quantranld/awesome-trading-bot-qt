-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table with versioning
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('global', 'user')),
  config JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_type UNIQUE (user_id, type)
);

-- Enable RLS for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can manage their own data" ON users
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for settings table
CREATE POLICY "Users can manage their own settings" ON settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_settings_user_id ON settings(user_id);
CREATE INDEX idx_settings_type ON settings(type);
CREATE INDEX idx_settings_version ON settings(version);

-- Function to handle settings versioning
CREATE OR REPLACE FUNCTION update_settings_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for version updates
CREATE TRIGGER settings_version_trigger
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_settings_version();

-- Function to get merged settings
CREATE OR REPLACE FUNCTION get_merged_settings(user_id UUID)
RETURNS JSONB AS $$
DECLARE
  global_settings JSONB;
  user_settings JSONB;
BEGIN
  -- Get global settings
  SELECT config INTO global_settings
  FROM settings
  WHERE type = 'global'
  ORDER BY version DESC
  LIMIT 1;

  -- Get user settings if user_id is provided
  IF user_id IS NOT NULL THEN
    SELECT config INTO user_settings
    FROM settings
    WHERE type = 'user' AND settings.user_id = user_id
    ORDER BY version DESC
    LIMIT 1;
  END IF;

  -- Merge settings with user settings overriding global
  RETURN jsonb_deep_merge(global_settings, user_settings);
END;
$$ LANGUAGE plpgsql;

-- Helper function for deep merging JSONB
CREATE OR REPLACE FUNCTION jsonb_deep_merge(a JSONB, b JSONB)
RETURNS JSONB AS $$
BEGIN
  RETURN a || b;
END;
$$ LANGUAGE plpgsql;
