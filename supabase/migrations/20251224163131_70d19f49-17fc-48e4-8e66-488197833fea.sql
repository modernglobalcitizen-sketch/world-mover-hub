-- Drop the authenticated-only policy
DROP POLICY IF EXISTS "Authenticated users can view fund transactions" ON public.fund_transactions;

-- Create policy allowing anyone to view fund transactions (public transparency ledger)
CREATE POLICY "Anyone can view fund transactions"
ON public.fund_transactions
FOR SELECT
USING (true);