/*
  # Phase 3 Migration: badges_earned and mood_checkins Tables

  ## Summary
  Creates the final two tables for the NeuroPlay application's achievement and
  wellbeing tracking systems. These tables store badge achievements earned by
  users across 5 categories, and emotional mood check-ins with before/after
  session tracking.

  ## New Tables

  ### badges_earned
  - `id` (uuid, primary key) — unique badge record identifier
  - `user_id` (uuid, FK → users.id CASCADE) — which user earned the badge
  - `badge_id` (text) — identifier matching badge definitions (e.g. 'first_challenge', 'champion')
  - `badge_name` (text) — human-readable badge name (e.g. 'First Step', 'Champion')
  - `badge_category` (text) — one of: sensory, cognitive, executive, social, special
  - `earned_at` (timestamptz) — when the badge was awarded
  - `created_at` (timestamptz) — record creation timestamp
  - UNIQUE constraint on (user_id, badge_id) — prevents duplicate badges

  ### mood_checkins
  - `id` (uuid, primary key) — unique check-in record identifier
  - `user_id` (uuid, FK → users.id CASCADE) — which user submitted the check-in
  - `mood` (text) — selected mood (happy, excited, calm, okay, tired, sad, worried, frustrated)
  - `energy_level` (integer) — energy level 1-5
  - `check_in_type` (text) — 'before' or 'after' session
  - `session_id` (uuid, FK → sessions.id SET NULL) — optional link to a game session
  - `checked_at` (timestamptz) — when the check-in was recorded
  - `created_at` (timestamptz) — record creation timestamp

  ## Security
  - RLS enabled on both tables
  - service_role has full access (SELECT, INSERT, UPDATE, DELETE)
  - Separate policies for each operation (no FOR ALL usage)

  ## Indexes
  - badges_earned: idx_badges_earned_user_id, idx_badges_earned_badge_id,
                   idx_badges_earned_category, idx_badges_earned_user_badge (unique)
  - mood_checkins: idx_mood_checkins_user_id, idx_mood_checkins_checked_at,
                   idx_mood_checkins_user_checked (composite), idx_mood_checkins_session_id
*/

-- ============================================================
-- TABLE: badges_earned
-- Tracks which badges each user has earned
-- References badge definitions in BadgeCollection.tsx
-- ============================================================
CREATE TABLE IF NOT EXISTS badges_earned (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id text NOT NULL DEFAULT '',
  badge_name text NOT NULL DEFAULT '',
  badge_category text NOT NULL DEFAULT 'special'
    CHECK (badge_category IN ('sensory', 'cognitive', 'executive', 'social', 'special')),
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- ============================================================
-- TABLE: mood_checkins
-- Tracks emotional check-ins before/after game sessions
-- Supports the MoodCheckIn component's 8 mood states and 5 energy levels
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood text NOT NULL DEFAULT 'okay'
    CHECK (mood IN ('happy', 'excited', 'calm', 'okay', 'tired', 'sad', 'worried', 'frustrated')),
  energy_level integer DEFAULT 3
    CHECK (energy_level >= 1 AND energy_level <= 5),
  check_in_type text NOT NULL DEFAULT 'before'
    CHECK (check_in_type IN ('before', 'after')),
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE badges_earned ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;

-- badges_earned: service_role full access
CREATE POLICY "service_role can select badges_earned"
  ON badges_earned FOR SELECT TO service_role USING (true);

CREATE POLICY "service_role can insert badges_earned"
  ON badges_earned FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_role can update badges_earned"
  ON badges_earned FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete badges_earned"
  ON badges_earned FOR DELETE TO service_role USING (true);

-- mood_checkins: service_role full access
CREATE POLICY "service_role can select mood_checkins"
  ON mood_checkins FOR SELECT TO service_role USING (true);

CREATE POLICY "service_role can insert mood_checkins"
  ON mood_checkins FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_role can update mood_checkins"
  ON mood_checkins FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete mood_checkins"
  ON mood_checkins FOR DELETE TO service_role USING (true);

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

-- badges_earned indexes
CREATE INDEX IF NOT EXISTS idx_badges_earned_user_id
  ON badges_earned(user_id);

CREATE INDEX IF NOT EXISTS idx_badges_earned_badge_id
  ON badges_earned(badge_id);

CREATE INDEX IF NOT EXISTS idx_badges_earned_category
  ON badges_earned(badge_category);

CREATE INDEX IF NOT EXISTS idx_badges_earned_earned_at
  ON badges_earned(earned_at DESC);

CREATE INDEX IF NOT EXISTS idx_badges_earned_user_category
  ON badges_earned(user_id, badge_category);

-- mood_checkins indexes
CREATE INDEX IF NOT EXISTS idx_mood_checkins_user_id
  ON mood_checkins(user_id);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_checked_at
  ON mood_checkins(checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_user_checked
  ON mood_checkins(user_id, checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_session_id
  ON mood_checkins(session_id);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_mood
  ON mood_checkins(mood);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_check_in_type
  ON mood_checkins(check_in_type);
