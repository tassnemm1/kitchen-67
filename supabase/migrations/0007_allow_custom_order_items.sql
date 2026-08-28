-- The same dish can have different options in one order
alter table public.order_items
drop constraint if exists order_items_order_id_dish_id_key;
