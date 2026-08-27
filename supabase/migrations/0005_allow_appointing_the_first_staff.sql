-- Make it possible to appoint the first staff member.
--
-- prevent_role_change refused every role change that did not come from someone
-- who was already staff. Since a brand new project has no staff at all, that
-- left no way in: the update from the SQL editor was rejected by the very rule
-- meant to protect it.
--
-- A request from the SQL editor, or from a trusted server key, carries no
-- auth.uid(). Those are let through. A signed in customer always has one, so
-- they are still blocked from making themselves staff, which is the rule that
-- actually matters.

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_staff() then
    raise exception 'Only staff can change the role of a profile';
  end if;

  return new;
end;
$$;
