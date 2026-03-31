
-- 1. Tighten INSERT on distress_signals: force safe defaults
DROP POLICY IF EXISTS "Authenticated users can insert own signals" ON distress_signals;
CREATE POLICY "Authenticated users can insert own signals"
  ON distress_signals FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND dispatcher_id IS NULL
    AND dispatched_at IS NULL
  );

-- 2. Tighten INSERT on practitioner_applications: force safe defaults
DROP POLICY IF EXISTS "Authenticated users can insert own applications" ON practitioner_applications;
CREATE POLICY "Authenticated users can insert own applications"
  ON practitioner_applications FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending_review'
    AND reviewer_notes IS NULL
    AND reviewed_at IS NULL
  );

-- 3. Replace UPDATE on practitioner_applications: users can only edit their own pending apps, cannot touch reviewer fields
DROP POLICY IF EXISTS "Users can update own applications" ON practitioner_applications;
CREATE POLICY "Users can update own pending applications"
  ON practitioner_applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending_review')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending_review'
    AND reviewer_notes IS NULL
    AND reviewed_at IS NULL
  );

-- 4. Tighten UPDATE on distress_signals: users cannot change dispatcher/status fields
DROP POLICY IF EXISTS "Users can update own signals" ON distress_signals;
CREATE POLICY "Users can update own signals"
  ON distress_signals FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND dispatcher_id IS NULL
    AND dispatched_at IS NULL
  );
