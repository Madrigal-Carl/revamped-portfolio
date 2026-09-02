import { supabase, supabaseAdmin } from "../config/supabase.js";

export const getAllProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const deleteProjectById = async (id) => {
  await Promise.all([
    supabaseAdmin.from("comments").delete().eq("project_id", id),
    supabaseAdmin.from("likes").delete().eq("project_id", id),
    supabaseAdmin.from("features").delete().eq("project_id", id),
    supabaseAdmin.from("tech_stacks").delete().eq("project_id", id),
    supabaseAdmin.from("problems").delete().eq("project_id", id),
    supabaseAdmin.from("solutions").delete().eq("project_id", id),
    supabaseAdmin.from("images").delete().eq("project_id", id),
  ]);

  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};
