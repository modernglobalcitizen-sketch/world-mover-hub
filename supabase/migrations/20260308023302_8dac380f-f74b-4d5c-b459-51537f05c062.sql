
CREATE TABLE public.remote_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_name text NOT NULL,
  category text NOT NULL DEFAULT '',
  job_type text NOT NULL DEFAULT 'Full-time',
  location text NOT NULL DEFAULT 'Worldwide',
  salary text DEFAULT NULL,
  description text NOT NULL DEFAULT '',
  apply_url text DEFAULT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.remote_jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can view active remote jobs
CREATE POLICY "Anyone can view active remote jobs"
  ON public.remote_jobs FOR SELECT
  USING (is_active = true);

-- Admins can view all remote jobs
CREATE POLICY "Admins can view all remote jobs"
  ON public.remote_jobs FOR SELECT
  USING (public.is_admin());

-- Admins can insert remote jobs
CREATE POLICY "Admins can insert remote jobs"
  ON public.remote_jobs FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update remote jobs
CREATE POLICY "Admins can update remote jobs"
  ON public.remote_jobs FOR UPDATE
  USING (public.is_admin());

-- Admins can delete remote jobs
CREATE POLICY "Admins can delete remote jobs"
  ON public.remote_jobs FOR DELETE
  USING (public.is_admin());
