-- Sample project insert — edit the values below and run in the Supabase SQL Editor.
-- Column details:
--   title       text, required
--   description text, required
--   features    text[]  — array of key features/highlights
--   tech_stack  text[]  — array of technologies
--   image_urls  text[]  — array of image URLs (not a single image)
--   project_url text, nullable — live demo link
--   repo_url    text, nullable  — repository link
--   id and created_at are generated automatically.

insert into public.projects (
  title,
  description,
  features,
  tech_stack,
  image_urls,
  project_url,
  repo_url
)
values (
  'Your Project Name',                      -- title
  'Short description of the project.',      -- description
  array[
    'Key feature / highlight 1',
    'Key feature / highlight 2',
    'Key feature / highlight 3'
  ],                                        -- features
  array[
    'React',
    'Node.js',
    'Tailwind CSS'
  ],                                        -- tech_stack
  array[
    'https://picsum.photos/seed/sample1/800/500',
    'https://picsum.photos/seed/sample2/800/500',
    'https://picsum.photos/seed/sample3/800/500'
  ],                                        -- image_urls
  'https://your-live-demo.example.com',     -- project_url (or NULL)
  'https://github.com/you/repo'             -- repo_url (or NULL)
);

-- Optional: verify it was inserted (returns the new row).
select * from public.projects order by created_at desc limit 1;
