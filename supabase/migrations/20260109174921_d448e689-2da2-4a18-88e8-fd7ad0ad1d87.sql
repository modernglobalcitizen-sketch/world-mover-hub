-- Add columns for private rooms
ALTER TABLE public.breakout_rooms 
ADD COLUMN is_private boolean NOT NULL DEFAULT false,
ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN max_members integer DEFAULT 10;

-- Create room_members table for private room access
CREATE TABLE public.room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.breakout_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable RLS on room_members
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for room_members
CREATE POLICY "Users can view members of rooms they belong to"
ON public.room_members
FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = room_members.room_id AND rm.user_id = auth.uid())
);

CREATE POLICY "Room creators can add members"
ON public.room_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br 
    WHERE br.id = room_id AND br.created_by = auth.uid()
  ) OR
  auth.uid() = user_id
);

CREATE POLICY "Room creators can remove members"
ON public.room_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br 
    WHERE br.id = room_id AND br.created_by = auth.uid()
  ) OR
  auth.uid() = user_id
);

-- Update breakout_rooms RLS policies
DROP POLICY IF EXISTS "Authenticated users can view rooms" ON public.breakout_rooms;

CREATE POLICY "Users can view public rooms or rooms they are members of"
ON public.breakout_rooms
FOR SELECT
USING (
  is_private = false OR
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = id AND rm.user_id = auth.uid())
);

CREATE POLICY "Authenticated users can create private rooms"
ON public.breakout_rooms
FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND is_private = true
);

CREATE POLICY "Room creators can update their rooms"
ON public.breakout_rooms
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Room creators can delete their rooms"
ON public.breakout_rooms
FOR DELETE
USING (created_by = auth.uid());

-- Update room_messages policy to check room membership for private rooms
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.room_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.room_messages;

CREATE POLICY "Users can view messages in accessible rooms"
ON public.room_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br 
    WHERE br.id = room_id AND (
      br.is_private = false OR
      br.created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = br.id AND rm.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can send messages to accessible rooms"
ON public.room_messages
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br 
    WHERE br.id = room_id AND (
      br.is_private = false OR
      br.created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = br.id AND rm.user_id = auth.uid())
    )
  )
);

-- Update room_shared_opportunities policies similarly
DROP POLICY IF EXISTS "Authenticated users can view shared opportunities" ON public.room_shared_opportunities;
DROP POLICY IF EXISTS "Users can share opportunities" ON public.room_shared_opportunities;

CREATE POLICY "Users can view shared opportunities in accessible rooms"
ON public.room_shared_opportunities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br 
    WHERE br.id = room_id AND (
      br.is_private = false OR
      br.created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = br.id AND rm.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can share opportunities to accessible rooms"
ON public.room_shared_opportunities
FOR INSERT
WITH CHECK (
  auth.uid() = shared_by AND
  EXISTS (
    SELECT 1 FROM public.breakout_rooms br 
    WHERE br.id = room_id AND (
      br.is_private = false OR
      br.created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = br.id AND rm.user_id = auth.uid())
    )
  )
);

-- Enable realtime for room_members
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_members;