import { supabase } from "../config/supabase.js";

export const getTechStacksForProjects = async (projectIds) => {
  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("tech_stacks")
    .select("id, project_id, name")
    .in("project_id", projectIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};
