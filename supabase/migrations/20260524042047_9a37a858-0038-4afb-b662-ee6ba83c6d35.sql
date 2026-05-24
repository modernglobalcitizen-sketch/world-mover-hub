
-- Drop the helper view; we'll use column-level grants instead
DROP VIEW IF EXISTS public.reviews_public;

-- Consolidate to a single public read policy
DROP POLICY IF EXISTS "Public can view approved reviews via view" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;

CREATE POLICY "Anyone can view approved reviews"
ON public.reviews
FOR SELECT
USING (is_approved = true);

-- Revoke broad column access from anon/authenticated, then grant only safe columns
REVOKE SELECT ON public.reviews FROM anon, authenticated;

GRANT SELECT (id, reviewer_name, service, rating, review_text, verified_purchase, is_approved, created_at)
ON public.reviews TO anon, authenticated;

-- Admins still need full read; they use service-role-style is_admin() policy which already grants ALL,
-- but column grants are required too. Grant full SELECT to authenticated for the email column ONLY via
-- the existing admin policy is insufficient; instead expose reviewer_email through a definer RPC for admins.
CREATE OR REPLACE FUNCTION public.get_reviews_admin()
RETURNS TABLE (
  id uuid,
  reviewer_name text,
  reviewer_email text,
  service text,
  rating integer,
  review_text text,
  verified_purchase boolean,
  is_approved boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, reviewer_name, reviewer_email, service, rating, review_text, verified_purchase, is_approved, created_at
  FROM public.reviews
  WHERE public.is_admin()
  ORDER BY created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_reviews_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_reviews_admin() TO authenticated;
