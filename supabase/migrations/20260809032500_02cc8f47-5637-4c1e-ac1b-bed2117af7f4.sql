CREATE TABLE public.share_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT,
  content_title TEXT,
  page_url TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.share_events TO anon;
GRANT SELECT, INSERT ON public.share_events TO authenticated;
GRANT ALL ON public.share_events TO service_role;

ALTER TABLE public.share_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a share" ON public.share_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view shares" ON public.share_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX share_events_created_at_idx ON public.share_events (created_at DESC);