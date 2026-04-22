
-- Healing Journeys table
CREATE TABLE public.healing_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  share_mode TEXT NOT NULL CHECK (share_mode IN ('face', 'voice_only', 'voice_with_image')),
  duration_seconds INTEGER NOT NULL,
  video_path TEXT NOT NULL,
  background_image_path TEXT,
  is_practitioner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.healing_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logged-in users can view all journeys"
ON public.healing_journeys FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert own journeys"
ON public.healing_journeys FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journeys"
ON public.healing_journeys FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journeys"
ON public.healing_journeys FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Timestamp trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_healing_journeys_updated_at
BEFORE UPDATE ON public.healing_journeys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Private storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('healing-journeys', 'healing-journeys', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users upload to their own folder; logged-in users can read all
CREATE POLICY "Logged-in users can view journey files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'healing-journeys');

CREATE POLICY "Users can upload to own journey folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'healing-journeys'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own journey files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'healing-journeys'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own journey files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'healing-journeys'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
