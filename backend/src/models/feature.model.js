import { supabase } from "../config/supabase.js";

export const getFeaturesForProjects = async (projectIds) => {
  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("features")
    .select("id, project_id, name")
    .in("project_id", projectIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};
