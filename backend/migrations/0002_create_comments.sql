-- 0002_create_comments.sql
-- Comments table: public comments on a project, attributed to a guest.

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  guest_id uuid not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index comments_project_id_idx on public.comments (project_id);
create index comments_guest_id_idx on public.comments (guest_id);

-- Comments are publicly readable and insertable. There are NO update or
-- delete policies for clients. Moderation/deletion is handled separately
-- later (e.g. Supabase dashboard with the service role key, or an
-- admin-only route) and is out of scope for these policies.
alter table public.comments enable row level security;

create policy "comments are publicly readable"
  on public.comments for select
  using (true);

create policy "guests can insert comments"
  on public.comments for insert
  with check (true);
