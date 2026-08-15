-- 0008_create_site_likes.sql
-- Site-wide likes table: one row per unique guest who liked the website.
-- A guest can like the site at most once (unique guest_id).

create table public.site_likes (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null unique,
  created_at timestamptz not null default now()
);

-- Site likes are publicly countable and guests can add their like.
-- No update/delete policies for clients.
alter table public.site_likes enable row level security;

create policy "site_likes are publicly readable"
  on public.site_likes for select
  using (true);

create policy "guests can insert site_likes"
  on public.site_likes for insert
  with check (true);
