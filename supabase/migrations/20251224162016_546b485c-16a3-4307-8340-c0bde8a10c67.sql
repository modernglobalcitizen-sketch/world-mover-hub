-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view fund transactions" ON public.fund_transactions;

-- Create new policy requiring authentication to view fund transactions
CREATE POLICY "Authenticated users can view fund transactions"
ON public.fund_transactions
FOR SELECT
USING (auth.uid() IS NOT NULL);