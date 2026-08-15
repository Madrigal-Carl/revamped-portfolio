# images-to-upload

Place screenshots here before running the upload/seed scripts. Every image
found in this folder (subfolders included) is uploaded **flat** into the root
of the `project-images` bucket — there is no per-project grouping.

## Folder structure

Organization on disk is up to you. Subfolders are scanned recursively, but
files are uploaded using just their filename:

```
scripts/images-to-upload/
├── shape8.png
├── shape9.png
└── agricentral/
    └── agricentral1.png   -> uploaded as "agricentral1.png"
```

Avoid duplicate filenames across folders — uploads are `upsert`, so a
filename collision silently overwrites.

Supported extensions: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`.
Any other file is skipped with a warning.

## Running the scripts

```bash
# Upload everything to Storage only (prints a SQL URL array)
npm run upload-images

# Seed one project: upload its images AND insert/update its projects row
# (edit scripts/project-data.js first)
npm run seed-projects
```

## Git

Actual images are ignored by git (see `backend/.gitignore`). Only this README
and `.gitkeep` are tracked, so the folder structure is preserved for anyone
cloning the repo.
