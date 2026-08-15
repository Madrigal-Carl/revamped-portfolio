import { supabase } from "../config/supabase.js";

export const getLikesForProjects = async (projectIds) => {
  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("likes")
    .select("id, project_id, guest_id, created_at")
    .in("project_id", projectIds);

  if (error) throw error;
  return data;
};

export const createLike = async ({ project_id, guest_id }) => {
  const { data, error } = await supabase
    .from("likes")
    .insert({ project_id, guest_id })
    .select("id, project_id, guest_id, created_at")
    .single();

  if (error) throw error;
  return data;
};
