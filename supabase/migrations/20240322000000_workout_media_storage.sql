-- Create the workout-media storage bucket
insert into storage.buckets (id, name)
values ('workout-media', 'workout-media')
on conflict do nothing;

-- Allow authenticated users to upload files
create policy "Allow authenticated users to upload files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'workout-media' and
  (storage.foldername(name))[1] = 'covers'
);

-- Allow public access to view files
create policy "Allow public access to view files"
on storage.objects for select
to public
using (bucket_id = 'workout-media');

-- Allow authenticated users to delete their own files
create policy "Allow authenticated users to delete their own files"
on storage.objects for delete
to authenticated
using (bucket_id = 'workout-media' and auth.uid() = owner);

-- Set up CORS configuration for the bucket
update storage.buckets
set public = true
where id = 'workout-media';

-- Configure CORS for the bucket
insert into storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
values (
  'workout-media',
  'workout-media',
  true,
  false,
  5242880, -- 5MB file size limit
  array['image/jpeg', 'image/png', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  avif_autodetection = excluded.avif_autodetection,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types; 