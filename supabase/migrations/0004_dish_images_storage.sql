-- Storage for dish images.
--
-- The bucket is public so the menu can render images straight from a URL
-- without signing every request. Writing to it is another matter: only staff
-- may upload, replace or remove a file, and the policies below are what
-- enforce that. Hiding the upload form is not enough.

insert into storage.buckets (id, name, public)
values ('dish-images', 'dish-images', true)
on conflict (id) do nothing;

create policy "Anyone can view dish images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'dish-images');

create policy "Staff can upload dish images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'dish-images' and public.is_staff());

create policy "Staff can replace dish images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'dish-images' and public.is_staff())
  with check (bucket_id = 'dish-images' and public.is_staff());

create policy "Staff can remove dish images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'dish-images' and public.is_staff());
