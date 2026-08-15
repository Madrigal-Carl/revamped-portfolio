# Portfolio Backend

Express.js + Supabase backend for the portfolio project
(React + Tailwind frontend).

## Purpose

The backend serves the portfolio posts (projects) with their comments and
likes, and lets anonymous guests comment and like posts.

> **Auth note:** This project intentionally does **not** use Supabase Auth.
> Guests are identified by a client-generated `guest_id` (a UUID stored in
> localStorage on the frontend) that is sent with every request.

## Folder structure

```
backend/
├── src/
│   ├── app.js                 # Express app (middleware, routes, CORS)
│   ├── server.js              # Entry point
│   ├── config/
│   │   ├── env.js             # Loads .env
│   │   └── supabase.js        # Supabase client
│   ├── controllers/           # Request handlers
│   ├── middlewares/           # errorHandler, notFoundHandler
│   ├── models/                # Supabase data-access layer
│   ├── routes/                # Express routers
│   ├── services/              # Business logic
│   ├── validators/            # Zod request validation
│   ├── utils/                 # asyncHandler, ApiError
│   └── seeders/               # Seed script for projects
├── migrations/                # SQL schema + RLS policies
└── scripts/check-connection.js
```

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create your env file and fill in your Supabase project values:

   ```bash
   cp .env.example .env
   # edit .env -> SUPABASE_URL, SUPABASE_ANON_KEY, CLIENT_URL
   ```

   Find these values in the Supabase dashboard under
   **Project Settings -> API**.

3. Run the migrations in `migrations/` against your database
   (Supabase dashboard **SQL Editor**, in order `0001` → `0003`).

4. Seed the projects table:

   ```bash
   npm run seed
   ```

## Running the server

```bash
npm run dev    # nodemon, hot reload
npm start      # plain node
```

Server runs on `PORT` (default `5000`).

## API

| Method | Endpoint                  | Description                                    |
| ------ | ------------------------- | ---------------------------------------------- |
| GET    | `/api/health`             | Health check                                   |
| GET    | `/api/posts`              | All posts with comments + like counts          |
| GET    | `/api/posts/:id`          | Single post with comments + like counts        |
| POST   | `/api/posts/:id/comments` | Add a comment (`{ guest_id, content }`)        |
| POST   | `/api/posts/:id/likes`    | Like a post (`{ guest_id }`)                   |

- `GET /api/posts?guest_id=<uuid>` also returns `liked_by_me` for that guest.
- `like_count` is derived from the `likes` rows (RLS allows public SELECT).
- Liking twice with the same `guest_id` returns `409` (unique constraint).

## RLS policies (client-facing)

| Table        | Policies                     |
| ------------ | ---------------------------- |
| `projects`   | SELECT only                  |
| `comments`   | SELECT + INSERT only         |
| `likes`      | SELECT + INSERT only         |
| `features`   | SELECT only                  |
| `tech_stacks`| SELECT only                  |
| `images`     | SELECT only                  |
| `site_views` | SELECT + INSERT only (unique guest_id) |
| `site_likes` | SELECT + INSERT only (unique guest_id) |

Comment/like moderation (UPDATE/DELETE) is handled separately later and is
**not** part of these policies.

---

## Uploading project screenshots (Supabase Storage)

`scripts/upload-images.js` uploads local images to Supabase Storage and prints
a ready-to-paste SQL URL array. Images go **flat** into the bucket root — no
per-project folders. `scripts/seed-projects.js` uploads images and inserts the
project row in one run.

### 1. Create the bucket (manual, once)

In the Supabase dashboard:

```
Storage -> New bucket -> name: project-images -> Public bucket: ON
```

Bucket creation is a manual step (not scriptable via the client).

### 2. Set the service role key

Add to `backend/.env`:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

> The service role key bypasses RLS. **Never** use it in frontend code — it
> must stay backend-only. (Find it under Project Settings -> API -> API Keys.)

### 3. Organize local images

Put screenshots in `backend/scripts/images-to-upload/`. Subfolders are
scanned recursively but every file uploads **flat** to the bucket root using
its filename (avoid duplicate filenames — uploads are upsert). Supported:
`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`; other files are skipped with a
warning. Actual images are gitignored; the folder structure is kept via
`.gitkeep` + `README.md`.

### 4. Run the scripts

`project-data.js` holds a **list** of projects — everything in it is seeded in
one run. Fill in/remove entries there (folder, title, description, features,
tech stack, URLs, `completed_at`), place the screenshots in
`scripts/images-to-upload/<folder>/`, then run:

```bash
cd backend
npm run seed-projects            # seed every project in the list
npm run seed-projects shape      # seed only the "shape" folder
```

For each project this does:
1. uploads the project's images from `scripts/images-to-upload/<folder>/`
   (flat into the bucket root, upsert),
2. inserts (or updates, matched by title) the project row in `projects`,
3. replaces its child rows — `features`, `tech_stacks`, and `images` (the
   `path` values are the uploaded public URLs).

It uses the **service role key** because `projects` is RLS-protected (clients
are SELECT-only). `SUPABASE_SERVICE_ROLE_KEY` must be set in `backend/.env`.

If you only want Storage URLs to paste into SQL yourself, use the standalone
uploader instead (uploads every image, flat):

```bash
npm run upload-images
```

Uploads use `upsert: true`, so re-running overwrites files with the same name
instead of erroring. Output is a single SQL array literal:

```sql
-- shape
array[
  'https://xxxx.supabase.co/storage/v1/object/public/project-images/shape/shape8.png',
  'https://xxxx.supabase.co/storage/v1/object/public/project-images/shape/shape9.png'
]
```
