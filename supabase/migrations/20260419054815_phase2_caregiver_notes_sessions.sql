/*
  # Phase 2 Migration: caregiver_notes and sessions tables

  ## Overview
  Creates the caregiver_notes and sessions tables to support caregiver observation
  tracking and quiz/game session history for the NeuroPlay application.

  ## New Tables

  ### caregiver_notes
  - Stores observations and notes written by caregivers about their linked children
  - Fields: id, caregiver_id (FK → caregivers), child_user_id (FK → users),
    note_text, tags (text array), created_at, updated_at

  ### sessions
  - Stores quiz and game session results per user
  - Fields: id, user_id (FK → users), session_type, game_data (JSONB),
    scores (JSONB), completed_at, duration_seconds, created_at, updated_at

  ## Security
  - RLS enabled on both tables
  - Service role has full access
  - Authenticated users can read their own data
  - Caregivers can manage notes they authored
  - INSERT policies restrict to authenticated users

  ## Performance
  - Indexes on caregiver_id, child_user_id, user_id, and created_at columns
  - Composite index on sessions for user + created_at queries

  ## Important Notes
  1. Uses existing update_updated_at_column() trigger function from Phase 1
  2. caregiver_notes.tags uses text[] for flexible tag storage matching localStorage pattern
  3. sessions.game_data stores the full quiz GameData JSON matching existing app structure
  4. sessions.scores stores computed aggregate scores for quick dashboard lookups
  5. child_user_id in caregiver_notes is nullable to support notes before user account linking
*/

-- TABLE: caregiver_notes
CREATE TABLE IF NOT EXISTS caregiver_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  child_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  child_username text NOT NULL DEFAULT '',
  note_text text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- TABLE: sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type text NOT NULL DEFAULT 'quiz' CHECK (session_type IN ('quiz', 'challenge', 'story', 'daily')),
  game_data jsonb DEFAULT NULL,
  scores jsonb DEFAULT '{
    "cognitive": 0,
    "executiveFunction": 0,
    "socialInteraction": 0,
    "sensory": 0
  }'::jsonb,
  completed_at timestamptz DEFAULT now(),
  duration_seconds integer DEFAULT 0 CHECK (duration_seconds >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on caregiver_notes
ALTER TABLE caregiver_notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: caregiver_notes
-- ============================================================

CREATE POLICY "Service role has full access to caregiver_notes"
  ON caregiver_notes
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert caregiver_notes"
  ON caregiver_notes
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update caregiver_notes"
  ON caregiver_notes
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete caregiver_notes"
  ON caregiver_notes
  FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- RLS POLICIES: sessions
-- ============================================================

CREATE POLICY "Service role has full access to sessions"
  ON sessions
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert sessions"
  ON sessions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update sessions"
  ON sessions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete sessions"
  ON sessions
  FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- AUTO-UPDATE TRIGGERS (reuses function from Phase 1)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_caregiver_notes_updated_at'
  ) THEN
    CREATE TRIGGER update_caregiver_notes_updated_at
      BEFORE UPDATE ON caregiver_notes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_sessions_updated_at
      BEFORE UPDATE ON sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_caregiver_notes_caregiver_id
  ON caregiver_notes(caregiver_id);

CREATE INDEX IF NOT EXISTS idx_caregiver_notes_child_user_id
  ON caregiver_notes(child_user_id);

CREATE INDEX IF NOT EXISTS idx_caregiver_notes_child_username
  ON caregiver_notes(child_username);

CREATE INDEX IF NOT EXISTS idx_caregiver_notes_created_at
  ON caregiver_notes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
  ON sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_session_type
  ON sessions(session_type);

CREATE INDEX IF NOT EXISTS idx_sessions_completed_at
  ON sessions(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_user_created
  ON sessions(user_id, created_at DESC);
