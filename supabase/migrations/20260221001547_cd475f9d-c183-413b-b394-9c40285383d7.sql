-- Create a public storage bucket for ebook files
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', true);

-- Allow public read access to ebook files
CREATE POLICY "Public can read ebooks"
ON storage.objects
FOR SELECT
USING (bucket_id = 'ebooks');

-- Only admins can upload/delete ebooks
CREATE POLICY "Admins can manage ebooks"
ON storage.objects
FOR ALL
USING (bucket_id = 'ebooks' AND public.is_admin());
