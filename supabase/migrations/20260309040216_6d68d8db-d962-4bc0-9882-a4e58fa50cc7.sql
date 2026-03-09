
CREATE TABLE public.saved_remote_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  remote_job_id UUID NOT NULL REFERENCES public.remote_jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, remote_job_id)
);

ALTER TABLE public.saved_remote_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved remote jobs"
  ON public.saved_remote_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save remote jobs"
  ON public.saved_remote_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave remote jobs"
  ON public.saved_remote_jobs FOR DELETE
  USING (auth.uid() = user_id);
