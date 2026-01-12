-- Create a secure view for public founding members data (excludes email)
CREATE OR REPLACE VIEW public.founding_members_public AS
SELECT 
  id,
  country,
  founding_member_number,
  display_name,
  created_at
FROM public.profiles
WHERE is_founding_member = true;

-- Grant access to the view
GRANT SELECT ON public.founding_members_public TO anon, authenticated;

-- Drop the overly permissive RLS policy that exposes email
DROP POLICY IF EXISTS "Anyone can view founding members" ON public.profiles;