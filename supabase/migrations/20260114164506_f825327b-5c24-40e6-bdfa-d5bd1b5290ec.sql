-- Copy description data to about where about is null
UPDATE public.opportunities 
SET about = description 
WHERE about IS NULL;

-- Make about not nullable (it will replace description)
ALTER TABLE public.opportunities 
ALTER COLUMN about SET NOT NULL;

-- Drop the description column
ALTER TABLE public.opportunities 
DROP COLUMN description;