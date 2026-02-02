-- Fix Security Issue: PayPal IDs Exposure
-- Create a safe view for subscriptions that excludes sensitive PayPal identifiers
CREATE VIEW public.subscriptions_safe
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  email,
  status,
  plan_id,
  amount,
  currency,
  current_period_start,
  current_period_end,
  canceled_at,
  created_at,
  updated_at
FROM public.subscriptions;
-- Excludes: paypal_subscription_id, paypal_payer_id

-- Fix Security Issue: Admin Notes Leak
-- Create a user-facing view for fund_applications that excludes admin_notes
CREATE VIEW public.fund_applications_user
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  purpose,
  description,
  amount_requested,
  status,
  created_at,
  updated_at
FROM public.fund_applications;
-- Excludes: admin_notes (only admins should see this via base table)