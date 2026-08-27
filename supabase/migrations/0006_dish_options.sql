-- Options a guest can add to or leave out of a dish.
--
-- The table was created straight in the SQL editor while the menu was being
-- built, so it never reached this folder and the schema in version control was
-- incomplete. It is written down here from the generated types, which come from
-- the live database, so the columns match what is already there.
--
-- Everything is guarded, so running this against the existing table changes no
-- data. What it does add is row level security: the table had none as far as
-- this folder can tell, which would leave the anon key free to write to it.
--
-- The columns are left nullable on purpose. That is how the table was made, and
-- tightening them here would fail on any row that already holds a null.

create table if not exists public.dish_options (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid references public.dishes (id) on delete cascade,
  name text,
  extra_price numeric(10, 2),
  can_remove boolean not null default false,
  max_extra integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.dish_options enable row level security;


-- Policies: dish_options ------------------------------------------------------
--
-- An option is only as visible as the dish it belongs to, which is why every
-- read policy asks about the dish rather than repeating its rules.

drop policy if exists "Anyone can read options for active dishes" on public.dish_options;
create policy "Anyone can read options for active dishes"
  on public.dish_options
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.dishes as dish
      where dish.id = dish_options.dish_id
        and dish.is_active
    )
  );

drop policy if exists "Staff can read every dish option" on public.dish_options;
create policy "Staff can read every dish option"
  on public.dish_options
  for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Staff can create dish options" on public.dish_options;
create policy "Staff can create dish options"
  on public.dish_options
  for insert
  to authenticated
  with check (public.is_staff());

drop policy if exists "Staff can update dish options" on public.dish_options;
create policy "Staff can update dish options"
  on public.dish_options
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Staff can remove dish options" on public.dish_options;
create policy "Staff can remove dish options"
  on public.dish_options
  for delete
  to authenticated
  using (public.is_staff());
