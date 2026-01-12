-- The view needs RLS access. Create a policy allowing SELECT on founding_members_public
-- Since the view is SECURITY INVOKER, we need an RLS policy on profiles that 
-- allows viewing only non-sensitive columns. Instead, let's use a function approach.

-- Drop the view and create a function instead that returns only safe columns
DROP VIEW IF EXISTS public.founding_members_public;

-- Create a function that returns founding members without email
CREATE OR REPLACE FUNCTION public.get_founding_members_public()
RETURNS TABLE (
  id uuid,
  country text,
  founding_member_number integer,
  display_name text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    country,
    founding_member_number,
    display_name,
    created_at
  FROM public.profiles
  WHERE is_founding_member = true
  ORDER BY founding_member_number ASC;
$$;