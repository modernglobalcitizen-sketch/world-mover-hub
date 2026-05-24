-- Revoke public access to reviewer_email column (admins still access via get_reviews_admin RPC)
REVOKE SELECT (reviewer_email) ON public.reviews FROM anon, authenticated;

-- Allow admins to create public (non-private) breakout rooms via client
CREATE POLICY "Admins can create public rooms"
ON public.breakout_rooms
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());