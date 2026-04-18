-- Add user_id and status_updated_at to talent_pool
ALTER TABLE public.talent_pool 
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamp with time zone;

-- Add user_id and status_updated_at to remote_job_applications
ALTER TABLE public.remote_job_applications 
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamp with time zone;

-- RLS: users can view their own talent pool submissions
CREATE POLICY "Users can view their own talent pool submissions"
  ON public.talent_pool
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- RLS: users can view their own remote job applications
CREATE POLICY "Users can view their own remote job applications"
  ON public.remote_job_applications
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Trigger function to set status_updated_at when status column changes
CREATE OR REPLACE FUNCTION public.set_status_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_talent_pool_status_updated ON public.talent_pool;
CREATE TRIGGER trg_talent_pool_status_updated
  BEFORE UPDATE ON public.talent_pool
  FOR EACH ROW
  EXECUTE FUNCTION public.set_status_updated_at();

DROP TRIGGER IF EXISTS trg_remote_job_apps_status_updated ON public.remote_job_applications;
CREATE TRIGGER trg_remote_job_apps_status_updated
  BEFORE UPDATE ON public.remote_job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_status_updated_at();