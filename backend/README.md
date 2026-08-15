# Portfolio Backend

Supabase-backed backend foundation for the portfolio project
(React + Tailwind frontend).

## Purpose

This folder will eventually hold all backend-related code:

- `config/` — Supabase client setup (database access)
- `migrations/` — SQL schema + Row Level Security (RLS) policies
- `models/` — (future) domain helpers built on the client
- `routes/` — (future) API routes

> **Auth note:** This project intentionally does **not** use Supabase Auth.
> Guests are identified by a client-generated `guest_id` (a UUID stored in
> localStorage on the frontend) that is sent with every request. No auth
> logic is implemented yet.

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create your env file and fill in your Supabase project values:

   ```bash
   cp .env.example .env
   # edit .env -> SUPABASE_URL, SUPABASE_ANON_KEY
   ```

   Find these values in the Supabase dashboard under
   **Project Settings -> API**.

## Running the migrations

Run the SQL files in order against your Supabase database
(**SQL Editor** in the dashboard, or via `supabase db push` / the
Supabase CLI):

1. `migrations/0001_create_projects.sql`
2. `migrations/0002_create_comments.sql`
3. `migrations/0003_create_likes.sql`

Each file creates its table and enables Row Level Security with the
appropriate policies:

| Table      | RLS policies (client-facing)                        |
| ---------- | --------------------------------------------------- |
| `projects` | SELECT only                                          |
| `comments` | SELECT + INSERT only (no UPDATE/DELETE)              |
| `likes`    | SELECT + INSERT only (no UPDATE/DELETE), unique pair |

Comment/like moderation (UPDATE/DELETE) is intentionally **not** part of
these policies — it will be handled separately later (e.g. Supabase
dashboard using the service role key, or an admin-only route).

## Status

This is the schema/config foundation only. API routes, comment/like
logic, and frontend integration are **not** implemented yet.
