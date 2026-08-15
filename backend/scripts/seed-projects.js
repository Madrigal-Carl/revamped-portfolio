/**
 * Seed projects: upload images AND insert/update project rows in one run.
 *
 * For every project in scripts/project-data.js:
 *   1. Uploads the images from scripts/images-to-upload/<folder>/ to the
 *      "project-images" bucket (flat — files land in the bucket root, no
 *      project folder; upsert overwrites on re-run).
 *   2. Inserts (or updates, matched by title) the project row into the
 *      `projects` table, then replaces its child rows: `features`,
 *      `tech_stacks`, and `images` (paths = the uploaded public URLs).
 *
 * PREREQUISITES:
 *   - The "project-images" bucket exists and is public (create manually in the
 *     dashboard: Storage -> New bucket -> project-images -> Public: ON).
 *   - SUPABASE_SERVICE_ROLE_KEY is set in backend/.env. The projects table is
 *     RLS-protected (SELECT only for clients), so seeding uses the service
 *     role key, which bypasses RLS. This key is backend-only — never in
 *     frontend code.
 *
 * Usage (run from the backend/ folder):
 *   node scripts/seed-projects.js            # seed every project in project-data.js
 *   node scripts/seed-projects.js shape      # seed a single project folder only
 */

import { createServiceClient, uploadProjectImages } from "./upload-utils.js";
import { projectData } from "./project-data.js";

const supabase = createServiceClient();

const upsertProject = async (data) => {
  const row = {
    title: data.title,
    description: data.description,
    project_url: data.project_url,
    repo_url: data.repo_url,
    completed_at: data.completed_at,
  };

  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("title", data.title)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("projects")
      .update(row)
      .eq("id", existing.id);

    if (error) throw error;
    console.log(`[${data.folder}] Updated project "${data.title}" (${existing.id})`);
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("projects")
    .insert(row)
    .select("id")
    .single();

  if (error) throw error;
  console.log(`[${data.folder}] Created project "${data.title}" (${inserted.id})`);
  return inserted.id;
};

// Replaces a project's features / tech_stacks / images rows.
const replaceChildren = async (projectId, { features, techStacks, images }) => {
  const deleteRows = async (table) => {
    const { error } = await supabase.from(table).delete().eq("project_id", projectId);
    if (error) throw error;
  };

  const insertRows = async (table, column, values) => {
    if (!values.length) return;
    const { error } = await supabase
      .from(table)
      .insert(values.map((value) => ({ project_id: projectId, [column]: value })));
    if (error) throw error;
  };

  await deleteRows("features");
  await deleteRows("tech_stacks");
  await deleteRows("images");

  await insertRows("features", "name", features);
  await insertRows("tech_stacks", "name", techStacks);
  await insertRows("images", "path", images);

  console.log(
    `[${projectId.slice(0, 8)}] Children set: ${features.length} features, ${techStacks.length} tech stacks, ${images.length} images.`,
  );
};

const seedProject = async (data) => {
  const imageUrls = await uploadProjectImages(supabase, data.folder);

  if (!imageUrls.length) {
    console.warn(`[${data.folder}] No images uploaded — project will be seeded with empty images.`);
  }

  const projectId = await upsertProject(data);

  await replaceChildren(projectId, {
    features: data.features ?? [],
    techStacks: data.tech_stack ?? [],
    images: imageUrls,
  });

  console.log(`[${data.folder}] Done (${imageUrls.length} image(s)).`);
};

const main = async () => {
  const arg = process.argv[2];

  const projects = arg
    ? projectData.filter((data) => data.folder === arg)
    : projectData;

  if (!projects.length) {
    console.error(arg ? `No project data found for folder "${arg}".` : "No project data found in project-data.js.");
    process.exit(1);
  }

  console.log("Seeding projects (images -> Storage, details -> projects table)...");

  for (const project of projects) {
    try {
      await seedProject(project);
    } catch (error) {
      console.error(`[${project.folder}] Failed: ${error.message}`);
    }
  }

  console.log("Seed complete.");
};

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
