-- site_settings: singleton table for site-wide configuration

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  header_brand TEXT,
  header_subtitle TEXT,
  sidebar_title TEXT,
  sidebar_description TEXT,
  social_links JSONB,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Enforce single-row table via unique singleton flag
  singleton BOOLEAN NOT NULL DEFAULT TRUE UNIQUE
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read site settings
DROP POLICY IF EXISTS "Anyone can read settings" ON site_settings;
CREATE POLICY "Anyone can read settings" ON site_settings
  FOR SELECT USING (true);

-- Any authenticated user can insert the first row only (singleton)
DROP POLICY IF EXISTS "Authenticated can insert first settings row" ON site_settings;
CREATE POLICY "Authenticated can insert first settings row" ON site_settings
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
  );

-- Any authenticated user can update (tighten later with admin roles)
DROP POLICY IF EXISTS "Authenticated can update settings" ON site_settings;
CREATE POLICY "Authenticated can update settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Helpful index for updated_at
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at DESC);

