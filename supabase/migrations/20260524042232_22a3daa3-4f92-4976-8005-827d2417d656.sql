
-- Make the talent-pool bucket private
UPDATE storage.buckets SET public = false WHERE id = 'talent-pool';

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view talent-pool files" ON storage.objects;

-- Only admins can read/list talent-pool files
CREATE POLICY "Admins can view talent-pool files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'talent-pool' AND public.is_admin());
