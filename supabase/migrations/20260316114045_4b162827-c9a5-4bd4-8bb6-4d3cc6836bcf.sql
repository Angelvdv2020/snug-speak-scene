
-- Add image_url column to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url text;

-- Create post-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to post-media
CREATE POLICY "Auth users can upload post media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-media');

-- Allow public read access to post-media
CREATE POLICY "Public read access for post media"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-media');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own post media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text);
