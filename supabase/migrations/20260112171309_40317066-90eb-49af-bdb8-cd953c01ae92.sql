-- Recreate the view with SECURITY INVOKER to respect RLS of the querying user
DROP VIEW IF EXISTS public.founding_members_public;

CREATE VIEW public.founding_members_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  country,
  founding_member_number,
  display_name,
  created_at
FROM public.profiles
WHERE is_founding_member = true;