import { supabase } from "../config/supabase.js";

export const getCommentsForProjects = async (projectIds) => {
  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("id, project_id, guest_id, content, created_at")
    .in("project_id", projectIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const createComment = async ({ project_id, guest_id, content }) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({ project_id, guest_id, content })
    .select("id, project_id, guest_id, content, created_at")
    .single();

  if (error) throw error;
  return data;
};
