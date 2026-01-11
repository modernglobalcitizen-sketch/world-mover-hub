-- Create a security definer function to check room membership (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_room_member(_user_id uuid, _room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.room_members
    WHERE user_id = _user_id
      AND room_id = _room_id
  )
$$;

-- Create a function to check if user is room creator
CREATE OR REPLACE FUNCTION public.is_room_creator(_user_id uuid, _room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.breakout_rooms
    WHERE id = _room_id
      AND created_by = _user_id
  )
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view public rooms or rooms they are members of" ON public.breakout_rooms;
DROP POLICY IF EXISTS "Users can view members of rooms they belong to" ON public.room_members;

-- Recreate breakout_rooms SELECT policy using the function
CREATE POLICY "Users can view public rooms or rooms they are members of" 
ON public.breakout_rooms 
FOR SELECT 
USING (
  is_private = false 
  OR created_by = auth.uid() 
  OR public.is_room_member(auth.uid(), id)
);

-- Recreate room_members SELECT policy using the function (no self-reference)
CREATE POLICY "Users can view members of rooms they belong to" 
ON public.room_members 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.is_room_member(auth.uid(), room_id)
  OR public.is_room_creator(auth.uid(), room_id)
);