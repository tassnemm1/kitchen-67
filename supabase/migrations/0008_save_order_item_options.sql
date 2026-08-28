-- Save the selected options with every order item
alter table public.order_items
add column selected_options jsonb not null default '[]'::jsonb;

-- Calculate the dish price together with its extras
create or replace function public.set_order_item_price()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  dish public.dishes%rowtype;
  selected jsonb;
  dish_option public.dish_options%rowtype;
  extra_quantity integer;
  extras_total numeric(10, 2) := 0;
begin
  select * into dish
  from public.dishes
  where id = new.dish_id;

  if not found or not dish.is_active then
    raise exception 'This dish cannot be ordered';
  end if;

  for selected in
    select value from jsonb_array_elements(new.selected_options)
  loop
    select * into dish_option
    from public.dish_options
    where id = (selected ->> 'optionId')::uuid
      and dish_id = new.dish_id;

    if not found then
      raise exception 'Invalid dish option';
    end if;

    if coalesce((selected ->> 'removed')::boolean, false) then
      if not dish_option.can_remove then
        raise exception 'This option cannot be removed';
      end if;
    else
      extra_quantity := coalesce((selected ->> 'extraQuantity')::integer, 0);

      if extra_quantity < 0 or extra_quantity > dish_option.max_extra then
        raise exception 'Invalid extra quantity';
      end if;

      extras_total := extras_total +
        (extra_quantity * coalesce(dish_option.extra_price, 0));
    end if;
  end loop;

  new.dish_name := dish.name;
  new.unit_price := dish.price + extras_total;
  return new;
end;
$$;
