-- Supabase Storage Setup for Certificate Uploads
-- Run this in your Supabase SQL Editor

-- Create the certificates bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies for the certificates bucket

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload certificates"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

-- Policy to allow public read access to certificates (for admin verification)
CREATE POLICY "Allow public read access to certificates"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');

-- Policy to allow users to delete their own uploaded certificates
CREATE POLICY "Allow users to delete their own certificates"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- Policy to allow users to update their own uploaded certificates
CREATE POLICY "Allow users to update their own certificates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates');

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
