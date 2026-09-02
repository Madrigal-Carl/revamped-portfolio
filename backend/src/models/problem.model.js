import { supabase } from "../config/supabase.js";

export const getProblemsForProjects = async (projectIds) => {
  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("problems")
    .select("id, project_id, name")
    .in("project_id", projectIds)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data ?? [];
};
