-- First, let's check and recreate the trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  default_name text;
begin
  -- Set a default name from email if no full_name in metadata
  default_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (
    id,
    email,
    name,
    avatar_url,
    created_at,
    updated_at
  ) values (
    new.id,
    new.email,
    default_name,
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  );
  return new;
exception
  when unique_violation then
    -- Profile already exists, ignore
    return new;
  when others then
    -- Log the error and continue
    raise warning 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$;

-- Drop the trigger if it exists and recreate it
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create profiles for existing users that don't have one
insert into public.profiles (id, email, name, created_at, updated_at)
select 
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  now(),
  now()
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
); 