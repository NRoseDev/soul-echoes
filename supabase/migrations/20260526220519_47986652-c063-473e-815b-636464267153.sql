
-- 1. Tighten healing_journeys SELECT policy
DROP POLICY IF EXISTS "Logged-in users can view all journeys" ON public.healing_journeys;

CREATE POLICY "Owners and public journeys are viewable"
ON public.healing_journeys FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR share_mode = 'public');

-- 2. Tighten storage policy for healing-journeys bucket
DROP POLICY IF EXISTS "Logged-in users can view journey files" ON storage.objects;

CREATE POLICY "Owners and public journey files are viewable"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'healing-journeys'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.healing_journeys hj
      WHERE hj.share_mode = 'public'
        AND (hj.video_path = name OR hj.background_image_path = name)
    )
  )
);

-- 3. Lock down SECURITY DEFINER helper functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- authenticated retains EXECUTE because RLS policies invoke has_role()

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- update_updated_at_column is only used by triggers; no role needs direct EXECUTE
