import "./config/env.js";
import { supabase } from "../src/config/supabase.js";

const { data, error } = await supabase.from("projects").select("*").limit(1);

if (error) {
  console.error("Connected to Supabase, but query failed:", error.message);
  console.error(
    "This is expected if you haven't run the migrations yet (tables don't exist).",
  );
} else {
  console.log("Connected to Supabase successfully. Projects found:", data.length);
}
