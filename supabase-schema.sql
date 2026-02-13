-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20)
);

-- Focus sessions table (tombstones)
create table focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  intended_minutes integer not null,
  actual_seconds integer not null,
  distraction text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint intended_minutes_valid check (intended_minutes > 0 and intended_minutes <= 240),
  constraint actual_seconds_valid check (actual_seconds >= 0)
);

-- RLS Policies
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

alter table focus_sessions enable row level security;

create policy "Public sessions are viewable by everyone"
  on focus_sessions for select
  using (true);

create policy "Authenticated users can create sessions"
  on focus_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on focus_sessions for delete
  using (auth.uid() = user_id);

-- Indexes
create index focus_sessions_user_id_idx on focus_sessions(user_id);
create index focus_sessions_created_at_idx on focus_sessions(created_at desc);

-- Function to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
