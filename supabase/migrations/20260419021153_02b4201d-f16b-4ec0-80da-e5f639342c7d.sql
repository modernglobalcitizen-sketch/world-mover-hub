ALTER TABLE public.remote_job_applications
  ADD COLUMN IF NOT EXISTS resume_url text;