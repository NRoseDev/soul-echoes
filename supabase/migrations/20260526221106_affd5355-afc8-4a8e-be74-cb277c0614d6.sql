
-- Replace the permissive INSERT policy with one that disallows is_practitioner = true
-- unless the user has an approved practitioner application.
DROP POLICY IF EXISTS "Users can insert own journeys" ON public.healing_journeys;

CREATE POLICY "Users can insert own journeys"
ON public.healing_journeys FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    is_practitioner = false
    OR EXISTS (
      SELECT 1 FROM public.practitioner_applications pa
      WHERE pa.user_id = auth.uid()
        AND pa.status = 'approved'
    )
  )
);

-- Same constraint on UPDATE so the flag can't be flipped on later.
DROP POLICY IF EXISTS "Users can update own journeys" ON public.healing_journeys;

CREATE POLICY "Users can update own journeys"
ON public.healing_journeys FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND (
    is_practitioner = false
    OR EXISTS (
      SELECT 1 FROM public.practitioner_applications pa
      WHERE pa.user_id = auth.uid()
        AND pa.status = 'approved'
    )
  )
);
