-- Create function to set admin role
CREATE OR REPLACE FUNCTION set_admin_role(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', 'admin')
      ELSE 
        raw_user_meta_data || jsonb_build_object('role', 'admin')
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION set_admin_role TO authenticated;

-- Set your user as admin (replace with your user ID)
SELECT set_admin_role('a18fa4ce-c0ba-4a0b-b9ff-5f245537ab42'); 