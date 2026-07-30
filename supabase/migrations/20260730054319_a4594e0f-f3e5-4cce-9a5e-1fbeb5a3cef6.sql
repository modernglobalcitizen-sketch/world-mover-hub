CREATE TABLE public.teach_abroad_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  organization text NOT NULL,
  country text NOT NULL,
  region text NOT NULL DEFAULT 'Other',
  subject text NOT NULL DEFAULT 'English',
  contract_length text,
  salary text,
  requirements text,
  benefits text,
  description text NOT NULL DEFAULT '',
  apply_url text,
  deadline date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.teach_abroad_programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teach_abroad_programs TO authenticated;
GRANT ALL ON public.teach_abroad_programs TO service_role;

ALTER TABLE public.teach_abroad_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active teach abroad programs"
ON public.teach_abroad_programs FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert teach abroad programs"
ON public.teach_abroad_programs FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update teach abroad programs"
ON public.teach_abroad_programs FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete teach abroad programs"
ON public.teach_abroad_programs FOR DELETE TO authenticated
USING (public.is_admin());

CREATE TRIGGER update_teach_abroad_programs_updated_at
BEFORE UPDATE ON public.teach_abroad_programs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();