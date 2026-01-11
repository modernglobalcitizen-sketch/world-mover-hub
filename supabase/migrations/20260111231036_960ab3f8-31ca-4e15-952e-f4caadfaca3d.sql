-- Update the room_members insert policy to allow users with pending invitations to join
DROP POLICY IF EXISTS "Room creators can add members" ON public.room_members;

CREATE POLICY "Room creators can add members"
ON public.room_members
FOR INSERT
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.breakout_rooms br
    WHERE br.id = room_members.room_id
    AND br.created_by = auth.uid()
  ))
  OR (auth.uid() = user_id AND public.has_pending_invitation(auth.uid(), room_id))
);