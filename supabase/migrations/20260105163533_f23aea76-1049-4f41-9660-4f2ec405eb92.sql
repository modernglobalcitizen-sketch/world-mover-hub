-- Create fund_applications table for community fund requests
CREATE TABLE public.fund_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_requested NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fund_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own fund applications"
ON public.fund_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create fund applications"
ON public.fund_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their pending applications
CREATE POLICY "Users can update their pending fund applications"
ON public.fund_applications
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all applications
CREATE POLICY "Admins can view all fund applications"
ON public.fund_applications
FOR SELECT
USING (public.is_admin());

-- Admins can update any application
CREATE POLICY "Admins can update fund applications"
ON public.fund_applications
FOR UPDATE
USING (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_fund_applications_updated_at
BEFORE UPDATE ON public.fund_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();