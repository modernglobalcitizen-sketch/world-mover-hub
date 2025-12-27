-- Create table to track saved/bookmarked opportunities
CREATE TABLE public.saved_opportunities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, opportunity_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved opportunities
CREATE POLICY "Users can view their own saved opportunities"
ON public.saved_opportunities
FOR SELECT
USING (auth.uid() = user_id);

-- Users can save opportunities
CREATE POLICY "Users can save opportunities"
ON public.saved_opportunities
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unsave opportunities
CREATE POLICY "Users can unsave opportunities"
ON public.saved_opportunities
FOR DELETE
USING (auth.uid() = user_id);