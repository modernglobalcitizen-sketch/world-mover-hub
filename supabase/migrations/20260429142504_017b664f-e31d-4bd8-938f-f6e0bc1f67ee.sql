CREATE TABLE public.talent_intro_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_id UUID NOT NULL REFERENCES public.talent_pool(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_company TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.talent_intro_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit intro requests"
ON public.talent_intro_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view intro requests"
ON public.talent_intro_requests
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update intro requests"
ON public.talent_intro_requests
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete intro requests"
ON public.talent_intro_requests
FOR DELETE
USING (is_admin());