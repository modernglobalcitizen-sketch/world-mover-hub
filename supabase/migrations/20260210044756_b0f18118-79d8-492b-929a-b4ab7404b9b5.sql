
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can create pending subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Recreate with proper authentication requirements
CREATE POLICY "Authenticated users can create subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) OR (status = 'pending'::text)
);

CREATE POLICY "Authenticated users can update their own subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = user_id) OR ((user_id IS NULL) AND (status = 'pending'::text))
);

CREATE POLICY "Authenticated users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
