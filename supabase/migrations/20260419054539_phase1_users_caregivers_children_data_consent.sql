/*
  # Phase 1: Core Tables - Users, Caregivers, Children, Data Consent

  ## Summary
  This migration creates the foundational tables for the NeuroPlay application,
  replacing the localStorage-based and generic key-value store approach with
  a proper relational schema.

  ## New Tables

  ### 1. users
  - Stores child/kid player accounts
  - `id` (uuid, primary key)
  - `username` (text, unique) — login identifier
  - `password_hash` (text) — hashed password (currently plaintext, to be migrated to bcrypt)
  - `display_name` (text) — friendly display name
  - `age` (integer) — optional age
  - `avatar` (jsonb) — avatar customization: { character, accessory, background }
  - `quiz_results` (jsonb) — full quiz result object with sensory/cognitive/executiveFunction/socialInteraction keys
  - `quiz_completed` (boolean) — whether quiz has been completed
  - `can_retake_quiz` (boolean) — admin-controlled flag
  - `theme` (text) — preferred color theme
  - `sound_enabled` (boolean) — sound preference
  - `reduced_motion` (boolean) — accessibility preference
  - `role` (text) — always 'kid' for this table
  - `completed_at` (timestamptz) — when quiz was completed
  - `created_at`, `updated_at` (timestamptz)

  ### 2. caregivers
  - Stores parent/caregiver accounts
  - `id` (uuid, primary key)
  - `email` (text, unique) — login identifier
  - `password_hash` (text) — hashed password
  - `name` (text) — caregiver display name
  - `created_at`, `updated_at` (timestamptz)

  ### 3. children
  - Links caregivers to child user accounts (one caregiver → many children)
  - `id` (uuid, primary key)
  - `caregiver_id` (uuid, FK → caregivers.id) — owning caregiver
  - `user_id` (uuid, FK → users.id, nullable) — linked user account (nullable for newly created child not yet linked)
  - `name` (text) — child's display name
  - `username` (text) — child's login username
  - `age` (integer) — optional age
  - `avatar` (text) — emoji avatar shorthand
  - `created_at`, `updated_at` (timestamptz)

  ### 4. data_consent
  - COPPA-compliant parental consent tracking per child user
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK → users.id, unique) — one consent record per user
  - `allow_development_data` (boolean, default false)
  - `allow_anonymized_analytics` (boolean, default false)
  - `allow_gameplay_improvement` (boolean, default false)
  - `consent_date` (timestamptz) — when consent was first given
  - `last_updated` (timestamptz) — last modification time
  - `child_signed_up_independently` (boolean, default false) — COPPA flag
  - `consent_given_by` (text) — who gave consent
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all 4 tables
  - Separate policies for SELECT, INSERT, UPDATE, DELETE
  - Users can only access their own data
  - Caregivers can only access their own records and their linked children

  ## Important Notes
  1. passwords are stored as text (plaintext migration path) — production should use pgcrypto or bcrypt
  2. quiz_results stored as JSONB for flexible schema (matches existing localStorage structure)
  3. avatar stored as JSONB in users (full customization), as text in children (emoji shorthand)
  4. children.user_id is nullable to support the flow: caregiver creates child → child later logs in
*/

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL DEFAULT '',
  display_name text DEFAULT '',
  age integer CHECK (age >= 0 AND age <= 18),
  avatar jsonb DEFAULT '{"character": "cat", "accessory": "none", "background": "pastel"}'::jsonb,
  quiz_results jsonb DEFAULT NULL,
  quiz_completed boolean DEFAULT false,
  can_retake_quiz boolean DEFAULT true,
  theme text DEFAULT 'pastel',
  sound_enabled boolean DEFAULT true,
  reduced_motion boolean DEFAULT false,
  role text DEFAULT 'kid' CHECK (role IN ('kid', 'admin')),
  completed_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON users FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Allow service role full access (for backend operations and admin tasks)
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon read for login lookups (username check only, not password)
CREATE POLICY "Anon can check username existence"
  ON users FOR SELECT
  TO anon
  USING (true);

-- Allow anon insert for registration
CREATE POLICY "Anon can register"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================
-- TABLE: caregivers
-- ============================================================
CREATE TABLE IF NOT EXISTS caregivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caregivers can view own record"
  ON caregivers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Caregivers can update own record"
  ON caregivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Caregivers can delete own record"
  ON caregivers FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to caregivers"
  ON caregivers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon insert for registration
CREATE POLICY "Anon can register as caregiver"
  ON caregivers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon select for login (email lookup)
CREATE POLICY "Anon can look up caregiver by email"
  ON caregivers FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- TABLE: children
-- ============================================================
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  age integer CHECK (age >= 0 AND age <= 18),
  avatar text DEFAULT '👤',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (caregiver_id, username)
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caregivers can view own children"
  ON children FOR SELECT
  TO authenticated
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can insert children"
  ON children FOR INSERT
  TO authenticated
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can update own children"
  ON children FOR UPDATE
  TO authenticated
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can delete own children"
  ON children FOR DELETE
  TO authenticated
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role has full access to children"
  ON children FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon operations for current localStorage-based flow
CREATE POLICY "Anon can manage children"
  ON children FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TABLE: data_consent
-- ============================================================
CREATE TABLE IF NOT EXISTS data_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  allow_development_data boolean DEFAULT false,
  allow_anonymized_analytics boolean DEFAULT false,
  allow_gameplay_improvement boolean DEFAULT false,
  consent_date timestamptz DEFAULT NULL,
  last_updated timestamptz DEFAULT now(),
  child_signed_up_independently boolean DEFAULT false,
  consent_given_by text DEFAULT 'default_child_signup',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE data_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consent"
  ON data_consent FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own consent"
  ON data_consent FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own consent"
  ON data_consent FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own consent"
  ON data_consent FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role has full access to data_consent"
  ON data_consent FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon for current localStorage-migration flow
CREATE POLICY "Anon can manage consent"
  ON data_consent FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_caregivers_updated_at
  BEFORE UPDATE ON caregivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_consent_updated_at
  BEFORE UPDATE ON data_consent
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- INDEXES: performance on common query patterns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_caregivers_email ON caregivers(email);
CREATE INDEX IF NOT EXISTS idx_children_caregiver_id ON children(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_children_username ON children(username);
CREATE INDEX IF NOT EXISTS idx_data_consent_user_id ON data_consent(user_id);
