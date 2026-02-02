-- Fix Critical Security Issue 1: Restrict fund_transactions to authenticated users only
DROP POLICY IF EXISTS "Anyone can view fund transactions" ON public.fund_transactions;

CREATE POLICY "Authenticated users can view fund transactions"
ON public.fund_transactions
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix Critical Security Issue 2: Require authentication for room_messages in public rooms
DROP POLICY IF EXISTS "Users can view messages in accessible rooms" ON public.room_messages;

CREATE POLICY "Authenticated users can view messages in accessible rooms"
ON public.room_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1
    FROM breakout_rooms br
    WHERE br.id = room_messages.room_id
    AND (
      br.is_private = false
      OR br.created_by = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM room_members rm
        WHERE rm.room_id = br.id
        AND rm.user_id = auth.uid()
      )
    )
  )
);