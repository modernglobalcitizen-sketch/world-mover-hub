-- Add questionnaire fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS field_of_work text,
ADD COLUMN IF NOT EXISTS opportunity_interests text[] DEFAULT '{}';

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.field_of_work IS 'The professional field or industry the user works in';
COMMENT ON COLUMN public.profiles.opportunity_interests IS 'Array of opportunity types the user is interested in (grant, competition, internship, training, conference, other)';