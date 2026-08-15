-- 0006_create_images.sql
-- Images table: one row per screenshot/path of a project.
-- `path` holds the image reference (public URL or storage object path).

create table public.images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  created_at timestamptz not null default now()
);

create index images_project_id_idx on public.images (project_id);

-- Images are project content and are publicly readable only. Writes (via
-- seeding/admin) use the service role key, which bypasses RLS.
alter table public.images enable row level security;

create policy "images are publicly readable"
  on public.images for select
  using (true);
