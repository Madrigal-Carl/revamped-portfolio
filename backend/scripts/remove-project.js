/**
 * Script: remove-project.js
 * 
 * Removes a project and ALL its related records across all database tables:
 * - comments
 * - likes
 * - features
 * - tech_stacks
 * - problems
 * - solutions
 * - images
 * - projects (main row)
 * 
 * Also deletes all associated screenshots/images from Supabase Storage (project-images bucket).
 * 
 * Usage:
 *   node scripts/remove-project.js <id | title | folder> [--dry-run]
 *   npm run remove-project <id | title | folder> [--dry-run]
 */

import { basename } from "node:path";
import { createServiceClient, BUCKET } from "./upload-utils.js";
import { projectData } from "./project-data.js";

const supabase = createServiceClient();

export const getStoragePathFromUrl = (url, bucket = BUCKET) => {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index !== -1) {
    return decodeURIComponent(url.slice(index + marker.length));
  }
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split(`/${bucket}/`);
    if (parts.length > 1) {
      return decodeURIComponent(parts[1]);
    }
    return basename(parsed.pathname);
  } catch {
    return basename(url);
  }
};

const findProjects = async (query) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);
  if (isUuid) {
    const { data } = await supabase.from("projects").select("*").eq("id", query).maybeSingle();
    if (data) return [data];
  }

  // Check if query matches a known folder in projectData
  const matchedProject = projectData.find(
    (p) => p.folder?.toLowerCase() === query.toLowerCase()
  );
  if (matchedProject) {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .ilike("title", matchedProject.title);
    if (data?.length) return data;
  }

  // Exact title match (case-insensitive)
  const { data: exactMatches } = await supabase
    .from("projects")
    .select("*")
    .ilike("title", query);

  if (exactMatches?.length === 1) return exactMatches;

  // Substring match on title
  const { data: partialMatches } = await supabase
    .from("projects")
    .select("*")
    .ilike("title", `%${query}%`);

  return partialMatches ?? [];
};

export const deleteProjectCascade = async (projectId, { dryRun = false } = {}) => {
  const { data: project, error: fetchErr } = await supabase
    .from("projects")
    .select("id, title")
    .eq("id", projectId)
    .single();

  if (fetchErr || !project) {
    throw new Error(`Project not found with ID "${projectId}".`);
  }

  // 1. Fetch images for this project
  const { data: images = [] } = await supabase
    .from("images")
    .select("id, path")
    .eq("project_id", projectId);

  // 2. Fetch counts for all related models
  const [
    { count: commentsCount },
    { count: likesCount },
    { count: featuresCount },
    { count: techStacksCount },
    { count: problemsCount },
    { count: solutionsCount },
  ] = await Promise.all([
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("likes").select("project_id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("features").select("id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("tech_stacks").select("id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("problems").select("id", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("solutions").select("id", { count: "exact", head: true }).eq("project_id", projectId),
  ]);

  const storagePaths = (images ?? [])
    .map((img) => getStoragePathFromUrl(img.path))
    .filter(Boolean);

  const stats = {
    title: project.title,
    id: project.id,
    comments: commentsCount ?? 0,
    likes: likesCount ?? 0,
    features: featuresCount ?? 0,
    techStacks: techStacksCount ?? 0,
    problems: problemsCount ?? 0,
    solutions: solutionsCount ?? 0,
    images: images?.length ?? 0,
    storageFiles: storagePaths.length,
    storagePaths,
  };

  if (dryRun) {
    return { project, stats, dryRun: true };
  }

  // 3. Delete storage files from Supabase Storage
  if (storagePaths.length > 0) {
    const { error: storageErr } = await supabase.storage
      .from(BUCKET)
      .remove(storagePaths);

    if (storageErr) {
      console.warn(`[Storage] Warning: Some storage images could not be removed: ${storageErr.message}`);
    }
  }

  // 4. Explicitly delete from all related child tables
  await Promise.all([
    supabase.from("comments").delete().eq("project_id", projectId),
    supabase.from("likes").delete().eq("project_id", projectId),
    supabase.from("features").delete().eq("project_id", projectId),
    supabase.from("tech_stacks").delete().eq("project_id", projectId),
    supabase.from("problems").delete().eq("project_id", projectId),
    supabase.from("solutions").delete().eq("project_id", projectId),
    supabase.from("images").delete().eq("project_id", projectId),
  ]);

  // 5. Delete the project row
  const { error: projectDeleteErr } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (projectDeleteErr) {
    throw new Error(`Failed to delete project row: ${projectDeleteErr.message}`);
  }

  return { project, stats, dryRun: false };
};

const listAllProjects = async () => {
  const { data: allProjects = [] } = await supabase
    .from("projects")
    .select("id, title, completed_at")
    .order("created_at", { ascending: false });

  return allProjects ?? [];
};

const main = async () => {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const queryArgs = args.filter((arg) => arg !== "--dry-run" && arg !== "--force");
  const query = queryArgs.join(" ").trim();

  if (!query) {
    console.log("\n=======================================================");
    console.log("            PROJECT REMOVAL TOOL (SUPABASE)            ");
    console.log("=======================================================\n");
    console.log("Usage:");
    console.log("  npm run remove-project <id | title | folder> [--dry-run]");
    console.log("  node scripts/remove-project.js <id | title | folder> [--dry-run]\n");
    console.log("Examples:");
    console.log("  npm run remove-project prsentry");
    console.log("  npm run remove-project \"CHL SmartSolutions\"");
    console.log("  npm run remove-project e29b41d4-...\n");

    const projects = await listAllProjects();
    if (projects.length === 0) {
      console.log("No projects found in database.");
    } else {
      console.log(`Current projects in database (${projects.length}):`);
      projects.forEach((p, idx) => {
        console.log(`  ${idx + 1}. [${p.id}]`);
        console.log(`     "${p.title}"`);
      });
      console.log("");
    }
    return;
  }

  console.log(`Searching for project matching "${query}"...`);
  const matches = await findProjects(query);

  if (matches.length === 0) {
    console.error(`\nError: No project found matching "${query}".\n`);
    const projects = await listAllProjects();
    if (projects.length > 0) {
      console.log("Available projects:");
      projects.forEach((p) => console.log(`  - [${p.id}] ${p.title}`));
    }
    process.exit(1);
  }

  if (matches.length > 1) {
    console.error(`\nMultiple projects matched "${query}". Please be more specific by passing the exact ID or full title:\n`);
    matches.forEach((p) => console.log(`  - [${p.id}] ${p.title}`));
    process.exit(1);
  }

  const target = matches[0];
  console.log(`\nFound target project:`);
  console.log(`  Title: "${target.title}"`);
  console.log(`  ID:    ${target.id}`);

  if (dryRun) {
    console.log("\n[DRY RUN MODE] Calculating records that would be removed...\n");
  } else {
    console.log("\nRemoving project and cascading through all related tables...\n");
  }

  const { stats, dryRun: isDryRun } = await deleteProjectCascade(target.id, { dryRun });

  console.log("---------------- Summary ----------------");
  console.log(`Project:        "${stats.title}" (${stats.id})`);
  console.log(`Problems:       ${stats.problems} row(s)`);
  console.log(`Solutions:      ${stats.solutions} row(s)`);
  console.log(`Features:       ${stats.features} row(s)`);
  console.log(`Tech Stacks:    ${stats.techStacks} row(s)`);
  console.log(`Comments:       ${stats.comments} row(s)`);
  console.log(`Likes:          ${stats.likes} row(s)`);
  console.log(`Images (DB):    ${stats.images} row(s)`);
  console.log(`Images (Store): ${stats.storageFiles} file(s) in "${BUCKET}" bucket`);
  console.log("-----------------------------------------");

  if (isDryRun) {
    console.log("\n[DRY RUN COMPLETE] No records or files were deleted.");
  } else {
    console.log("\nProject and all related models were successfully deleted.");

    const inProjectData = projectData.some(
      (p) => p.title.toLowerCase() === stats.title.toLowerCase()
    );
    if (inProjectData) {
      console.log("\nReminder: This project is still listed in backend/scripts/project-data.js.");
      console.log("If you run `npm run seed-projects` in the future, it will be recreated unless you remove it from project-data.js as well.");
    }
  }
};

main().catch((err) => {
  console.error("Removal failed:", err.message);
  process.exit(1);
});
