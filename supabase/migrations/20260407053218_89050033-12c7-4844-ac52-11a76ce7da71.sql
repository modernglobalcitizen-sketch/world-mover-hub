CREATE TABLE public.remote_job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.remote_job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a remote job application"
ON public.remote_job_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all remote job applications"
ON public.remote_job_applications
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update remote job applications"
ON public.remote_job_applications
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete remote job applications"
ON public.remote_job_applications
FOR DELETE
USING (is_admin());