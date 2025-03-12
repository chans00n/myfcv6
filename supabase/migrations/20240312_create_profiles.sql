-- Drop existing objects
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update their own profile." on profiles;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  avatar_url text,
  bio text,
  twitter_url text,
  github_url text,
  linkedin_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint name_length check (char_length(name) >= 2 or name is null),
  constraint bio_length check (char_length(bio) <= 160)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a function to handle new user creation
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_metadata->>'full_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
exception
  when others then
    -- Log the error (in a real application, you'd want proper error logging)
    raise notice 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant usage on sequence public.profiles_id_seq to anon, authenticated; 