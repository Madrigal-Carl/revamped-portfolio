import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getGuestId } from "../lib/guest";

// Formats a date string (YYYY-MM-DD) as "Month YYYY" (e.g. "April 2026").
export const formatMonthYear = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const groupBy = (rows, key) =>
  rows.reduce((acc, row) => {
    const id = row[key];
    (acc[id] ??= []).push(row);
    return acc;
  }, {});

// Fetches all projects (with features, tech stacks, images, comments, and
// like counts) plus which projects the current guest has liked. Exposes
// likeProject / addComment actions that persist to Supabase with the guest id.
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("projects")
        .select("*, features(name), tech_stacks(name), images(path)")
        .order("completed_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const rows = data ?? [];
      const ids = rows.map((project) => project.id);

      const [commentsRes, likesRes, myLikesRes] = await Promise.all([
        ids.length
          ? supabase
              .from("comments")
              .select("id, project_id, content, created_at")
              .in("project_id", ids)
              .order("created_at", { ascending: true })
          : { data: [], error: null },
        ids.length
          ? supabase.from("likes").select("project_id").in("project_id", ids)
          : { data: [], error: null },
        supabase.from("likes").select("project_id").eq("guest_id", getGuestId()),
      ]);

      if (cancelled) return;

      const commentsByProject = groupBy(commentsRes.data ?? [], "project_id");
      const likeCounts = (likesRes.data ?? []).reduce((acc, like) => {
        acc[like.project_id] = (acc[like.project_id] ?? 0) + 1;
        return acc;
      }, {});
      const liked = new Set((myLikesRes.data ?? []).map((like) => like.project_id));

      setProjects(
        rows.map((project) => ({
          ...project,
          features: (project.features ?? []).map((feature) => feature.name),
          tech_stack: (project.tech_stacks ?? []).map((stack) => stack.name),
          image_urls: (project.images ?? []).map((image) => image.path),
          comments: (commentsByProject[project.id] ?? []).map((comment) => ({
            id: comment.id,
            body: comment.content,
            created_at: comment.created_at,
          })),
          like_count: likeCounts[project.id] ?? 0,
        })),
      );
      setLikedIds([...liked]);
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const likeProject = async (projectId) => {
    if (likedIds.includes(projectId)) return;

    const { error } = await supabase
      .from("likes")
      .insert({ project_id: projectId, guest_id: getGuestId() });

    // Duplicate like (unique project_id + guest_id) — silently ignore.
    if (error) return;

    setLikedIds((prev) => [...prev, projectId]);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, like_count: (project.like_count ?? 0) + 1 }
          : project,
      ),
    );
  };

  const addComment = async (projectId, content) => {
    const { data, error } = await supabase
      .from("comments")
      .insert({ project_id: projectId, guest_id: getGuestId(), content })
      .select("id, content, created_at")
      .single();

    if (error) return { error };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              comments: [
                ...(project.comments ?? []),
                { id: data.id, body: data.content, created_at: data.created_at },
              ],
            }
          : project,
      ),
    );

    return { data };
  };

  return { projects, likedIds, loading, error, likeProject, addComment };
}
