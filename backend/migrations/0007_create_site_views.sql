-- 0007_create_site_views.sql
-- Site-wide views table: one row per unique guest who visited the website.
-- Total views = row count (guest_id is unique, so refreshes don't inflate).

create table public.site_views (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null unique,
  created_at timestamptz not null default now()
);

-- Site views are publicly countable and guests can register their visit.
-- No update/delete policies for clients.
alter table public.site_views enable row level security;

create policy "site_views are publicly readable"
  on public.site_views for select
  using (true);

create policy "guests can insert site_views"
  on public.site_views for insert
  with check (true);
