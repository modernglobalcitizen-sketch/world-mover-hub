
-- 1) Reviews: hide reviewer_email from public reads via a safe view
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;

CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = off) AS
SELECT id, reviewer_name, service, rating, review_text, verified_purchase, created_at
FROM public.reviews
WHERE is_approved = true;

GRANT SELECT ON public.reviews_public TO anon, authenticated;

-- 2) Subscriptions: tighten INSERT/UPDATE to owner only (service role bypasses RLS)
DROP POLICY IF EXISTS "Authenticated users can create subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Authenticated users can update their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can create their own subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3) room_shared_opportunities: require authentication for SELECT
DROP POLICY IF EXISTS "Users can view shared opportunities in accessible rooms" ON public.room_shared_opportunities;

CREATE POLICY "Authenticated users can view shared opportunities in accessible rooms"
ON public.room_shared_opportunities
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.breakout_rooms br
    WHERE br.id = room_shared_opportunities.room_id
      AND (
        br.is_private = false
        OR br.created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = br.id AND rm.user_id = auth.uid())
      )
  )
);

-- 4) Pin search_path on queue/email helper functions and lock down EXECUTE
CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$function$;

-- Revoke EXECUTE from anon/authenticated on queue helpers (service role retains access)
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated, public;
