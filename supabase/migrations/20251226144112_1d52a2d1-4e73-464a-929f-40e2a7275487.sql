-- Add founding_member column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_founding_member boolean NOT NULL DEFAULT false;

-- Add founding_member_number to track their position (1-100)
ALTER TABLE public.profiles ADD COLUMN founding_member_number integer;

-- Create a function to automatically assign founding member status to first 100 users
CREATE OR REPLACE FUNCTION public.assign_founding_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  member_count integer;
BEGIN
  SELECT COUNT(*) INTO member_count FROM public.profiles WHERE is_founding_member = true;
  
  IF member_count < 100 THEN
    NEW.is_founding_member := true;
    NEW.founding_member_number := member_count + 1;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run before insert on profiles
CREATE TRIGGER on_profile_created_assign_founding
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_founding_member();

-- Update RLS policy to allow viewing founding members publicly
CREATE POLICY "Anyone can view founding members"
ON public.profiles
FOR SELECT
USING (is_founding_member = true);