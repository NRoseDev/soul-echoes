
-- Add user_id column to distress_signals
ALTER TABLE public.distress_signals ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to practitioner_applications
ALTER TABLE public.practitioner_applications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop permissive anonymous INSERT policies
DROP POLICY IF EXISTS "Anyone can create distress signals" ON public.distress_signals;
DROP POLICY IF EXISTS "Anyone can submit practitioner applications" ON public.practitioner_applications;

-- distress_signals: authenticated INSERT own data
CREATE POLICY "Authenticated users can insert own signals"
  ON public.distress_signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- distress_signals: SELECT own data
CREATE POLICY "Users can read own signals"
  ON public.distress_signals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- distress_signals: UPDATE own data
CREATE POLICY "Users can update own signals"
  ON public.distress_signals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- distress_signals: DELETE own data (GDPR)
CREATE POLICY "Users can delete own signals"
  ON public.distress_signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- practitioner_applications: authenticated INSERT own data
CREATE POLICY "Authenticated users can insert own applications"
  ON public.practitioner_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- practitioner_applications: SELECT own data
CREATE POLICY "Users can read own applications"
  ON public.practitioner_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- practitioner_applications: UPDATE own data
CREATE POLICY "Users can update own applications"
  ON public.practitioner_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
