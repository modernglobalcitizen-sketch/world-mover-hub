-- Add external link field to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN link text;