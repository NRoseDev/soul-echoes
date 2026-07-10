
-- In-room leveling: per-user progress through each room's levels.
-- Separate from any payment/tier logic.

CREATE TABLE public.room_level_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  room_id text NOT NULL,
  level int NOT NULL CHECK (level >= 1),
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, room_id, level)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_level_progress TO authenticated;
GRANT ALL ON public.room_level_progress TO service_role;

ALTER TABLE public.room_level_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own progress"
  ON public.room_level_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
  ON public.room_level_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
  ON public.room_level_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own progress"
  ON public.room_level_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_rlp_user_room ON public.room_level_progress (user_id, room_id);

CREATE TRIGGER rlp_updated_at
  BEFORE UPDATE ON public.room_level_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
