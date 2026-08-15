// Supabase client for the frontend.
// Uses the public anon key — NEVER the service role key in frontend code.
//
// Env vars (see frontend/.env.example):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. Copy frontend/.env.example to frontend/.env and fill in your values.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
