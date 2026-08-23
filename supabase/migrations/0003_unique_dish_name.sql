-- One dish per name.
--
-- Without this, running the seed file twice quietly fills the menu with
-- duplicates, and `on conflict do nothing` has nothing to conflict on. The
-- delete below clears any duplicates that already exist, keeping the row that
-- was created first.

delete from public.dishes d
where exists (
  select 1
  from public.dishes keep
  where keep.name = d.name
    and (keep.created_at, keep.id) < (d.created_at, d.id)
);

create unique index if not exists dishes_name_key on public.dishes (name);
