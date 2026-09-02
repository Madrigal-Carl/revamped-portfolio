-- 0010_create_problems.sql
-- Problems table: one row per problem a project addresses.

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index problems_project_id_idx on public.problems (project_id);

alter table public.problems enable row level security;

create policy "problems are publicly readable"
  on public.problems for select
  using (true);
