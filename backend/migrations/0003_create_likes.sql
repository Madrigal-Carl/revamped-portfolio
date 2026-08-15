-- 0003_create_likes.sql
-- Likes table: a guest can like a project at most once (unique pair).

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  guest_id uuid not null,
  created_at timestamptz not null default now(),
  unique (project_id, guest_id)
);

create index likes_project_id_idx on public.likes (project_id);

-- Likes are publicly readable and insertable. There are NO update or delete
-- policies for clients. Unlike/un-like or moderation is handled separately
-- later and is out of scope for these policies.
alter table public.likes enable row level security;

create policy "likes are publicly readable"
  on public.likes for select
  using (true);

create policy "guests can insert likes"
  on public.likes for insert
  with check (true);
