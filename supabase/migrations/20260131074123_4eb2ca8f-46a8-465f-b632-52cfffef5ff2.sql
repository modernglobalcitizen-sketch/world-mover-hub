-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;

-- Create more specific policies for edge function operations (using service role key)
-- The edge function will use service_role key which bypasses RLS anyway
-- So we just need policies for the specific operations users can do

-- Users can update their own subscriptions (for linking after signup)
CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id OR (user_id IS NULL AND status = 'pending'));

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());