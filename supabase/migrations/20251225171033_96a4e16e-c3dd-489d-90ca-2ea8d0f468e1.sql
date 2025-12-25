-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  deadline DATE,
  requirements TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Opportunities policies: anyone can view active, only admins can manage
CREATE POLICY "Anyone can view active opportunities" 
ON public.opportunities FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all opportunities" 
ON public.opportunities FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert opportunities" 
ON public.opportunities FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update opportunities" 
ON public.opportunities FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete opportunities" 
ON public.opportunities FOR DELETE 
USING (public.is_admin());

-- Applications policies: users can manage their own, admins can view all
CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" 
ON public.applications FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Authenticated users can apply" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any application" 
ON public.applications FOR UPDATE 
USING (public.is_admin());

-- Triggers for updated_at
CREATE TRIGGER update_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();