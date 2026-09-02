-- 0011_create_solutions.sql
-- Solutions table: one row per solution a project provides.

create table public.solutions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index solutions_project_id_idx on public.solutions (project_id);

alter table public.solutions enable row level security;

create policy "solutions are publicly readable"
  on public.solutions for select
  using (true);
