-- 0001_create_projects.sql
-- Projects table: one row per portfolio project.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  features text[] not null default '{}',
  tech_stack text[] not null default '{}',
  image_urls text[] not null default '{}',
  project_url text,
  repo_url text,
  created_at timestamptz not null default now()
);

-- Projects are publicly readable; no client insert/update/delete policies
-- are created, so clients can only SELECT from this table.
alter table public.projects enable row level security;

create policy "projects are publicly readable"
  on public.projects for select
  using (true);
