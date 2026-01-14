-- Add eligibility, benefits, and about columns to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN eligibility text,
ADD COLUMN benefits text,
ADD COLUMN about text;