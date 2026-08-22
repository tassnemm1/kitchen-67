-- Menu and orders.
--
-- Relationships
--   profiles 1 --- * orders          orders.customer_id  -> profiles.id
--   orders   1 --- * order_items     order_items.order_id -> orders.id
--   dishes   1 --- * order_items     order_items.dish_id  -> dishes.id
--
-- An order keeps its own copy of the dish name and the price that applied when
-- it was placed, so editing the menu later never rewrites history. Dishes are
-- archived rather than deleted, which the foreign key below enforces.

create type public.order_status as enum (
  'pending',    -- Obehandlad
  'preparing',  -- Tillagas
  'ready',      -- Klar för upphämtning
  'picked_up'   -- Upphämtad
);


-- Shared helper that stamps updated_at on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- Dishes ---------------------------------------------------------------------

create table public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  category text not null check (length(trim(category)) > 0),
  price numeric(10, 2) not null check (price >= 0),
  -- Path inside the storage bucket. The bucket itself is set up separately.
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index dishes_is_active_idx on public.dishes (is_active);
create index dishes_category_idx on public.dishes (category);

create trigger dishes_set_updated_at
  before update on public.dishes
  for each row
  execute function public.set_updated_at();

alter table public.dishes enable row level security;


-- Orders ---------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  -- Short human readable number shown on the confirmation.
  order_number bigint generated always as identity (start with 1000) not null unique,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  status public.order_status not null default 'pending',
  total_amount numeric(10, 2) not null default 0 check (total_amount >= 0),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_id_idx on public.orders (customer_id);
create index orders_status_idx on public.orders (status);

create trigger orders_set_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();

alter table public.orders enable row level security;


-- Order items ----------------------------------------------------------------

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  -- Restrict, not cascade: a dish that has been ordered can never be deleted,
  -- which is what keeps the order history readable.
  dish_id uuid not null references public.dishes (id) on delete restrict,
  dish_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) generated always as (unit_price * quantity) stored,
  -- The cart holds one line per dish, the amount lives in quantity.
  unique (order_id, dish_id)
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_dish_id_idx on public.order_items (dish_id);

alter table public.order_items enable row level security;


-- Server side pricing --------------------------------------------------------

-- A new order always starts empty and unhandled, whatever the client sends.
create or replace function public.prepare_new_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.status := 'pending';
  new.total_amount := 0;
  return new;
end;
$$;

create trigger orders_prepare_new
  before insert on public.orders
  for each row
  execute function public.prepare_new_order();


-- The name and the price are copied from the menu, never taken from the
-- client, so a customer cannot order a dish at a price of their own choosing.
create or replace function public.set_order_item_price()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  dish public.dishes%rowtype;
begin
  select * into dish
  from public.dishes
  where id = new.dish_id;

  if not found then
    raise exception 'Unknown dish %', new.dish_id;
  end if;

  if not dish.is_active then
    raise exception 'The dish % is archived and cannot be ordered', dish.name;
  end if;

  new.dish_name := dish.name;
  new.unit_price := dish.price;
  return new;
end;
$$;

create trigger order_items_set_price
  before insert on public.order_items
  for each row
  execute function public.set_order_item_price();


-- The total is derived from the rows, so it always matches what was ordered.
create or replace function public.recalculate_order_total()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
begin
  if tg_op = 'DELETE' then
    target := old.order_id;
  else
    target := new.order_id;
  end if;

  update public.orders
  set total_amount = coalesce(
    (select sum(line_total) from public.order_items where order_id = target),
    0
  )
  where id = target;

  return null;
end;
$$;

create trigger order_items_recalculate_total
  after insert or update or delete on public.order_items
  for each row
  execute function public.recalculate_order_total();


-- The status has to walk the whole flow, one step at a time, and only staff
-- may move it. Obehandlad -> Tillagas -> Klar för upphämtning -> Upphämtad.
create or replace function public.enforce_order_status_flow()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if not public.is_staff() then
      raise exception 'Only staff can change the status of an order';
    end if;

    if not (
      (old.status = 'pending' and new.status = 'preparing')
      or (old.status = 'preparing' and new.status = 'ready')
      or (old.status = 'ready' and new.status = 'picked_up')
    ) then
      raise exception 'An order cannot go from % to %', old.status, new.status;
    end if;
  end if;

  return new;
end;
$$;

create trigger orders_enforce_status_flow
  before update on public.orders
  for each row
  execute function public.enforce_order_status_flow();


-- Policy helpers -------------------------------------------------------------

-- Security definer so the lookups below do not run the policies of the tables
-- they read, which would recurse.

create or replace function public.owns_order(order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.orders
    where id = owns_order.order_id
      and customer_id = (select auth.uid())
  );
$$;

create or replace function public.owns_pending_order(order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.orders
    where id = owns_pending_order.order_id
      and customer_id = (select auth.uid())
      and status = 'pending'
  );
$$;

-- Lets a customer open an archived dish that appears in one of their orders.
create or replace function public.has_ordered_dish(dish_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.order_items
    join public.orders on public.orders.id = public.order_items.order_id
    where public.order_items.dish_id = has_ordered_dish.dish_id
      and public.orders.customer_id = (select auth.uid())
  );
$$;


-- Policies: dishes -----------------------------------------------------------

-- No delete policy anywhere. Dishes are archived, never removed.

create policy "Anyone can read active dishes"
  on public.dishes
  for select
  to anon, authenticated
  using (is_active);

create policy "Staff can read every dish"
  on public.dishes
  for select
  to authenticated
  using (public.is_staff());

create policy "Customers can read dishes from their own orders"
  on public.dishes
  for select
  to authenticated
  using (public.has_ordered_dish(id));

create policy "Staff can create dishes"
  on public.dishes
  for insert
  to authenticated
  with check (public.is_staff());

create policy "Staff can update dishes"
  on public.dishes
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());


-- Policies: orders -----------------------------------------------------------

create policy "Customers can read their own orders"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = customer_id);

create policy "Staff can read every order"
  on public.orders
  for select
  to authenticated
  using (public.is_staff());

create policy "Customers can place their own orders"
  on public.orders
  for insert
  to authenticated
  with check ((select auth.uid()) = customer_id);

-- Customers get no update policy at all, which is what stops them from
-- touching the status of an order.
create policy "Staff can update orders"
  on public.orders
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());


-- Policies: order items ------------------------------------------------------

create policy "Customers can read items from their own orders"
  on public.order_items
  for select
  to authenticated
  using (public.owns_order(order_id));

create policy "Staff can read every order item"
  on public.order_items
  for select
  to authenticated
  using (public.is_staff());

-- Lines can only be added while the order is still unhandled, and only to an
-- order the customer owns.
create policy "Customers can add items to their own pending orders"
  on public.order_items
  for insert
  to authenticated
  with check (public.owns_pending_order(order_id));
