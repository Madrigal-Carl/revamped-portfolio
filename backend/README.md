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

| Table      | Policies                     |
| ---------- | ---------------------------- |
| `projects` | SELECT only                  |
| `comments` | SELECT + INSERT only         |
| `likes`    | SELECT + INSERT only         |

Comment/like moderation (UPDATE/DELETE) is handled separately later and is
**not** part of these policies.
