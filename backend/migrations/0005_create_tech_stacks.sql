-- 0005_create_tech_stacks.sql
-- Tech stacks table: one row per technology used by a project.

create table public.tech_stacks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index tech_stacks_project_id_idx on public.tech_stacks (project_id);

-- Tech stacks are project content and are publicly readable only. Writes (via
-- seeding/admin) use the service role key, which bypasses RLS.
alter table public.tech_stacks enable row level security;

create policy "tech_stacks are publicly readable"
  on public.tech_stacks for select
  using (true);
