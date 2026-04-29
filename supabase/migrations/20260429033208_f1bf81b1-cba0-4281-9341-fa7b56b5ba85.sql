-- Add featured flag for public showcase
ALTER TABLE public.talent_pool ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_talent_pool_is_featured ON public.talent_pool (is_featured) WHERE is_featured = true;

-- Security-definer function returning ONLY anonymous safe fields for featured profiles.
-- Excludes name, email, phone, resume, cover letter, linkedin, salary, notes.
CREATE OR REPLACE FUNCTION public.get_featured_talent_pool()
RETURNS TABLE (
  id uuid,
  industry text,
  years_of_experience text,
  role_current text,
  role_desired text,
  skills text,
  education_level text,
  portfolio_url text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id,
    industry,
    years_of_experience,
    role_current,
    role_desired,
    skills,
    education_level,
    portfolio_url,
    created_at
  FROM public.talent_pool
  WHERE is_featured = true
  ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_featured_talent_pool() TO anon, authenticated;