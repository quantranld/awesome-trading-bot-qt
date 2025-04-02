-- Create the configs table
CREATE TABLE IF NOT EXISTS configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('default', 'user')),
    user_id UUID REFERENCES auth.users(id),
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(type, user_id)
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_configs_updated_at
    BEFORE UPDATE ON configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE configs ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own configs
CREATE POLICY "Users can read their own configs"
    ON configs FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own configs
CREATE POLICY "Users can insert their own configs"
    ON configs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own configs
CREATE POLICY "Users can update their own configs"
    ON configs FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow anonymous users to read default config
CREATE POLICY "Anyone can read default config"
    ON configs FOR SELECT
    USING (type = 'default');

-- Create a function to create the configs table if it doesn't exist
CREATE OR REPLACE FUNCTION create_configs_table_if_not_exists()
RETURNS void AS $$
BEGIN
    -- The table creation is handled by the migration
    -- This function is just a placeholder for the RPC call
    RETURN;
END;
$$ LANGUAGE plpgsql; 