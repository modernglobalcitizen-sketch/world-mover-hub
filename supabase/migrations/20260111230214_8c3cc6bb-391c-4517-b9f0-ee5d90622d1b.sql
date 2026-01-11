-- Create room_invitations table to track pending invitations
CREATE TABLE public.room_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.breakout_rooms(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL,
  invited_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone,
  UNIQUE(room_id, invited_user_id)
);

-- Enable RLS
ALTER TABLE public.room_invitations ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has pending invitation
CREATE OR REPLACE FUNCTION public.has_pending_invitation(_user_id uuid, _room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.room_invitations
    WHERE invited_user_id = _user_id
      AND room_id = _room_id
      AND status = 'pending'
  )
$$;

-- RLS Policies for room_invitations

-- Room creators can create invitations
CREATE POLICY "Room creators can create invitations"
ON public.room_invitations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br
    WHERE br.id = room_invitations.room_id
    AND br.created_by = auth.uid()
  )
  AND invited_by = auth.uid()
);

-- Invited users can view their invitations
CREATE POLICY "Users can view their invitations"
ON public.room_invitations
FOR SELECT
USING (
  invited_user_id = auth.uid()
  OR invited_by = auth.uid()
  OR public.is_room_creator(auth.uid(), room_id)
);

-- Invited users can update their pending invitations (accept/decline)
CREATE POLICY "Users can respond to their invitations"
ON public.room_invitations
FOR UPDATE
USING (
  invited_user_id = auth.uid()
  AND status = 'pending'
);

-- Room creators can delete invitations
CREATE POLICY "Room creators can delete invitations"
ON public.room_invitations
FOR DELETE
USING (
  public.is_room_creator(auth.uid(), room_id)
  OR (invited_user_id = auth.uid() AND status = 'pending')
);

-- Enable realtime for invitations
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_invitations;