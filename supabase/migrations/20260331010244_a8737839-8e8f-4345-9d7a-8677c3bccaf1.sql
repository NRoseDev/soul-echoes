
-- 1) Add CHECK constraints on distress_signals for valid values and GPS ranges
ALTER TABLE public.distress_signals
  ADD CONSTRAINT valid_angel CHECK (angel IN ('michael', 'faith'));

ALTER TABLE public.distress_signals
  ADD CONSTRAINT valid_situation_code CHECK (situation_code IN ('111', '222', '333', '444', '555'));

ALTER TABLE public.distress_signals
  ADD CONSTRAINT valid_situation_label CHECK (char_length(situation_label) <= 200);

ALTER TABLE public.distress_signals
  ADD CONSTRAINT valid_gps_lat CHECK (gps_lat IS NULL OR (gps_lat BETWEEN -90 AND 90));

ALTER TABLE public.distress_signals
  ADD CONSTRAINT valid_gps_lng CHECK (gps_lng IS NULL OR (gps_lng BETWEEN -180 AND 180));

-- 2) Create user_roles table for dispatcher/reviewer access
CREATE TYPE public.app_role AS ENUM ('admin', 'dispatcher', 'reviewer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can manage roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles: users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3) Add dispatcher RLS policies on distress_signals
CREATE POLICY "Dispatchers can read all signals"
  ON public.distress_signals FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'dispatcher'));

CREATE POLICY "Dispatchers can update signal status"
  ON public.distress_signals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'dispatcher'))
  WITH CHECK (public.has_role(auth.uid(), 'dispatcher'));

-- 4) Add reviewer RLS policies on practitioner_applications
CREATE POLICY "Reviewers can read all applications"
  ON public.practitioner_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'reviewer'));

CREATE POLICY "Reviewers can update application status"
  ON public.practitioner_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'reviewer'))
  WITH CHECK (public.has_role(auth.uid(), 'reviewer'));
