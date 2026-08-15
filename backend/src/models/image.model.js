import { supabase } from "../config/supabase.js";

export const getImagesForProjects = async (projectIds) => {
  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("images")
    .select("id, project_id, path")
    .in("project_id", projectIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};
