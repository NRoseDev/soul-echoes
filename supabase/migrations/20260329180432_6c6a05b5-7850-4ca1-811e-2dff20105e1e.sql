
-- Distress signals table
CREATE TABLE public.distress_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  angel TEXT NOT NULL CHECK (angel IN ('michael', 'faith')),
  situation_code TEXT NOT NULL,
  situation_label TEXT NOT NULL,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  offline_flag BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dispatched_at TIMESTAMP WITH TIME ZONE,
  dispatcher_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'resolved'))
);

-- Practitioner applications table
CREATE TABLE public.practitioner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('healer', 'counselor', 'guide', 'dispatcher', 'intercessor')),
  answers JSONB NOT NULL,
  scenario_answer TEXT,
  reference_name TEXT NOT NULL,
  reference_contact TEXT NOT NULL,
  bg_check_consent BOOLEAN NOT NULL DEFAULT false,
  code_of_conduct_agreed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'supervised')),
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.distress_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for distress signals (crisis situations - no auth required)
CREATE POLICY "Anyone can create distress signals"
  ON public.distress_signals
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous inserts for practitioner applications
CREATE POLICY "Anyone can submit practitioner applications"
  ON public.practitioner_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
