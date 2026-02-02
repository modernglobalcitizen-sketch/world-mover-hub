-- Enable RLS on the views to ensure they inherit base table policies
ALTER VIEW public.subscriptions_safe SET (security_invoker = on);
ALTER VIEW public.fund_applications_user SET (security_invoker = on);

-- Views with security_invoker=on will use the caller's permissions
-- The base tables already have RLS policies, so these views are protected