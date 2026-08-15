/**
 * Bulk-upload images to Supabase Storage (flat — no project folders).
 *
 * PREREQUISITE: create the "project-images" bucket manually in the Supabase
 * dashboard before running this script:
 *   Storage -> New bucket -> name: project-images -> Public bucket: ON
 * Bucket creation is not scriptable via the anon/service client in a simple
 * way, so this is a manual one-time step.
 *
 * Uses the SERVICE ROLE key (SUPABASE_SERVICE_ROLE_KEY). This key bypasses
 * RLS and MUST NEVER be used in frontend code — it is backend-only.
 *
 * Usage (run from the backend/ folder):
 *   node scripts/upload-images.js
 *
 * Every image under scripts/images-to-upload/ (subfolders included) is
 * uploaded to the bucket root using its filename. Upsert is on, so re-runs
 * overwrite files with the same name. Prints a ready-to-paste SQL array of
 * public URLs. This script does NOT write to the database — only to Storage.
 */

import {
  createServiceClient,
  printSqlArray,
  uploadAllImages,
} from "./upload-utils.js";

const main = async () => {
  const supabase = createServiceClient();

  const urls = await uploadAllImages(supabase);

  if (!urls.length) {
    console.log("No images found to upload.");
    return;
  }

  printSqlArray("all images", urls);
};

main().catch((error) => {
  console.error("Upload failed:", error.message);
  process.exit(1);
});
