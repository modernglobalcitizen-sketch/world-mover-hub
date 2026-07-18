
-- Reviews: force safe defaults on insert
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (is_approved = false AND verified_purchase = false);

-- Talent pool: prevent self-featuring
DROP POLICY IF EXISTS "Anyone can submit to talent pool" ON public.talent_pool;
CREATE POLICY "Anyone can submit to talent pool"
ON public.talent_pool
FOR INSERT
TO anon, authenticated
WITH CHECK (is_featured = false);

-- Affiliate sales RPC (excludes buyer_email)
CREATE OR REPLACE FUNCTION public.get_affiliate_sales()
RETURNS TABLE(
  id uuid,
  ebook_title text,
  sale_amount numeric,
  commission_amount numeric,
  status text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.ebook_title, s.sale_amount, s.commission_amount, s.status, s.created_at
  FROM public.affiliate_sales s
  JOIN public.affiliates a ON a.id = s.affiliate_id
  WHERE a.user_id = auth.uid()
  ORDER BY s.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_affiliate_sales() TO authenticated;
