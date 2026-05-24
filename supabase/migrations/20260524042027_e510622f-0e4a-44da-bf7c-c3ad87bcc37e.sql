
DROP VIEW IF EXISTS public.reviews_public;

CREATE VIEW public.reviews_public
WITH (security_invoker = on) AS
SELECT id, reviewer_name, service, rating, review_text, verified_purchase, created_at
FROM public.reviews
WHERE is_approved = true;

-- Re-add a public SELECT policy limited to approved rows so the view (running as caller) can read them
CREATE POLICY "Public can view approved reviews via view"
ON public.reviews
FOR SELECT
USING (is_approved = true);

GRANT SELECT ON public.reviews_public TO anon, authenticated;
