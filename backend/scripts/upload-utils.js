// Shared helpers for uploading images to Supabase Storage.
// All images are uploaded flat into the bucket root — no per-project folders.

import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import "../src/config/env.js";

export const IMAGES_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "images-to-upload",
);
export const BUCKET = "project-images";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const isImage = (fileName) =>
  IMAGE_EXTENSIONS.has(extname(fileName).toLowerCase());

export const publicUrl = (remotePath) =>
  `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${remotePath}`;

export const createServiceClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to backend/.env (see .env.example).",
    );
    process.exit(1);
  }

  return createClient(process.env.SUPABASE_URL, serviceRoleKey);
};

// Recursively collects image file paths under a folder.
const collectImages = async (folder) => {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(folder, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectImages(fullPath)));
      continue;
    }

    if (!isImage(entry.name)) {
      console.warn(`[images-to-upload] Skipping non-image file: ${entry.name}`);
      continue;
    }

    files.push(fullPath);
  }

  return files;
};

// Uploads every image under a folder, flat into the bucket root (using the
// file's basename). Returns the public URLs. Never throws per-file.
const uploadFolder = async (supabase, folder, label) => {
  const filePaths = await collectImages(folder);
  const urls = [];

  for (const filePath of filePaths) {
    const remoteName = basename(filePath);
    const contentType = CONTENT_TYPES[extname(remoteName).toLowerCase()];

    try {
      const fileBytes = await readFile(filePath);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(remoteName, fileBytes, { upsert: true, contentType });

      if (error) {
        console.error(`[${label}] Failed to upload ${remoteName}: ${error.message}`);
        continue;
      }

      urls.push(publicUrl(remoteName));
      console.log(`[${label}] Uploaded ${remoteName}`);
    } catch (error) {
      console.error(`[${label}] Error reading/uploading ${remoteName}: ${error.message}`);
    }
  }

  return urls;
};

// Uploads all images found anywhere under images-to-upload/.
export const uploadAllImages = async (supabase) =>
  uploadFolder(supabase, IMAGES_DIR, "images-to-upload");

// Uploads the images of one local project folder (images-to-upload/<folder>/).
export const uploadProjectImages = async (supabase, folderName) =>
  uploadFolder(supabase, join(IMAGES_DIR, folderName), folderName);

// Prints a ready-to-paste SQL array literal.
export const printSqlArray = (label, urls) => {
  console.log(`-- ${label}`);
  console.log("array[");
  urls.forEach((url) => console.log(`  '${url}',`));
  console.log("]");
};
