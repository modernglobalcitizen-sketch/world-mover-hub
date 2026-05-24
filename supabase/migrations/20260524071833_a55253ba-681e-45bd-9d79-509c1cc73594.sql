
-- 1. Restrict reviewer_email column from anon/authenticated; admins read via SECURITY DEFINER RPC
REVOKE SELECT (reviewer_email) ON public.reviews FROM anon, authenticated;

-- 2. Subscriptions: remove user-facing write policies (service role / admin only)
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;

-- 3. Fund transactions: restrict reads to admins only
DROP POLICY IF EXISTS "Authenticated users can view fund transactions" ON public.fund_transactions;

CREATE POLICY "Admins can view fund transactions"
ON public.fund_transactions
FOR SELECT
USING (is_admin());
