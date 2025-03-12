-- Direct update of user metadata to add admin role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || 
  jsonb_build_object(
    'role', 'admin'
  )::jsonb
WHERE id = 'a18fa4ce-c0ba-4a0b-b9ff-5f245537ab42';

-- Verify the update
SELECT id, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE id = 'a18fa4ce-c0ba-4a0b-b9ff-5f245537ab42'; 