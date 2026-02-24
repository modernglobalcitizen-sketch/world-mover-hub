
-- Affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC NOT NULL DEFAULT 0.50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliate sales tracking
CREATE TABLE public.affiliate_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  ebook_title TEXT NOT NULL,
  sale_amount NUMERIC NOT NULL DEFAULT 25.00,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  buyer_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;

-- Admins can manage affiliates
CREATE POLICY "Admins can manage affiliates" ON public.affiliates FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Affiliates can view their own record
CREATE POLICY "Affiliates can view own record" ON public.affiliates FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage affiliate sales
CREATE POLICY "Admins can manage affiliate sales" ON public.affiliate_sales FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Affiliates can view their own sales
CREATE POLICY "Affiliates can view own sales" ON public.affiliate_sales FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.affiliates a WHERE a.id = affiliate_sales.affiliate_id AND a.user_id = auth.uid())
);

-- Trigger for updated_at
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow anonymous inserts for tracking referral clicks (we'll use an edge function instead, so no anon insert policy needed)
