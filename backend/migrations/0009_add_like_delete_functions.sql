-- 0009_add_like_delete_functions.sql
-- Guests can LIKE via direct INSERT (existing RLS), but removing a like is not
-- permitted by RLS (no DELETE policy). These security-definer functions let a
-- guest remove ONLY their own like by matching guest_id. They are exposed to
-- the anon role via RPC (supabase.rpc("delete_like", ...)).

create or replace function public.delete_like(p_project_id uuid, p_guest_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.likes
  where project_id = p_project_id and guest_id = p_guest_id;
$$;

grant execute on function public.delete_like(uuid, uuid) to anon, authenticated;

create or replace function public.delete_site_like(p_guest_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.site_likes
  where guest_id = p_guest_id;
$$;

grant execute on function public.delete_site_like(uuid) to anon, authenticated;
