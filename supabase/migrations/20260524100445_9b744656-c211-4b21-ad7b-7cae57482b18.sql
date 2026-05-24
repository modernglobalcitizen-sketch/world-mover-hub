
-- Remove permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can upload to talent-pool" ON storage.objects;

-- Restrict uploads to allowed folders + file extensions
CREATE POLICY "Talent pool uploads restricted to resume/cover-letter PDFs and DOCs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'talent-pool'
  AND (storage.foldername(name))[1] IN ('resumes', 'cover-letters')
  AND lower(name) ~ '\.(pdf|doc|docx)$'
);

-- Allow admins to update/delete files
CREATE POLICY "Admins can update talent-pool files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'talent-pool' AND public.is_admin())
WITH CHECK (bucket_id = 'talent-pool' AND public.is_admin());

CREATE POLICY "Admins can delete talent-pool files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'talent-pool' AND public.is_admin());
