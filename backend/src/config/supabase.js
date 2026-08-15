// Supabase client setup.
//
// NOTE: We are NOT using Supabase Auth.
// Guests are identified by a client-generated `guest_id` (a UUID) stored in
// localStorage on the frontend and sent with every request. No auth logic is
// required in this client config for now — it is purely a database client.
//
// Required env vars (copy `.env.example` to `.env`):
//   SUPABASE_URL
//   SUPABASE_ANON_KEY

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set. Copy backend/.env.example to backend/.env and fill in your values.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
