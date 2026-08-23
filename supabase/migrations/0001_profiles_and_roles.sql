-- Profiles and roles.
--
-- Every authenticated user has exactly one row in public.profiles. The row is
-- created automatically by a trigger on auth.users, which means a client can
-- never insert a profile with a role of its own choosing.

create type public.user_role as enum ('customer', 'staff');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;


-- Helper used by policies on other tables. It is security definer so it reads
-- profiles without triggering the policies on profiles itself, which would
-- otherwise recurse infinitely.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'staff'
  );
$$;


-- Create the profile row when a new user signs up. The role is never taken
-- from the client, so a customer cannot make themselves staff.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- Block role escalation. The update policy below lets a user edit their own
-- profile, so the role column needs a separate guard.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_staff() then
    raise exception 'Only staff can change the role of a profile';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row
  execute function public.prevent_role_change();


-- Policies.
--
-- There is deliberately no insert policy (profiles come from the trigger) and
-- no delete policy (profiles follow the auth user).

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Staff can read every profile"
  on public.profiles
  for select
  to authenticated
  using (public.is_staff());

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Staff can update every profile"
  on public.profiles
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());
