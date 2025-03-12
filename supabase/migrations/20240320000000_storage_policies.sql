-- Allow public access to view avatar files
create policy "Avatar files are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatar files
create policy "Users can upload avatar files"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar files
create policy "Users can update their own avatar files"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar files
create policy "Users can delete their own avatar files"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
); 