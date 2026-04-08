
CREATE TABLE public.talent_pool (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  industry TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  role_current TEXT,
  role_desired TEXT,
  skills TEXT,
  education_level TEXT NOT NULL,
  work_authorization TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  availability TEXT NOT NULL,
  salary_expectation TEXT,
  resume_url TEXT,
  cover_letter_url TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.talent_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit to talent pool"
ON public.talent_pool FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view talent pool"
ON public.talent_pool FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update talent pool"
ON public.talent_pool FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete talent pool"
ON public.talent_pool FOR DELETE USING (is_admin());

INSERT INTO storage.buckets (id, name, public) VALUES ('talent-pool', 'talent-pool', true);

CREATE POLICY "Anyone can upload to talent-pool"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'talent-pool');

CREATE POLICY "Anyone can view talent-pool files"
ON storage.objects FOR SELECT USING (bucket_id = 'talent-pool');
