-- 0004_create_features.sql
-- Features table: one row per key feature of a project.

create table public.features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index features_project_id_idx on public.features (project_id);

-- Features are project content and are publicly readable only. Writes (via
-- seeding/admin) use the service role key, which bypasses RLS.
alter table public.features enable row level security;

create policy "features are publicly readable"
  on public.features for select
  using (true);
