import ApiError from "../utils/ApiError.js";
import {
  getAllProjects,
  getProjectById,
} from "../models/project.model.js";
import {
  getCommentsForProjects,
  createComment,
} from "../models/comment.model.js";
import {
  getLikesForProjects,
  createLike,
} from "../models/like.model.js";

const groupBy = (rows, key) =>
  rows.reduce((acc, row) => {
    const id = row[key];
    (acc[id] ??= []).push(row);
    return acc;
  }, {});

const DUPLICATE_LIKE_CODE = "23505";

export const getPosts = async (guestId) => {
  const projects = await getAllProjects();

  if (!projects.length) return [];

  const projectIds = projects.map((project) => project.id);

  const [comments, likes] = await Promise.all([
    getCommentsForProjects(projectIds),
    getLikesForProjects(projectIds),
  ]);

  const commentsByProject = groupBy(comments, "project_id");
  const likesByProject = groupBy(likes, "project_id");

  return projects.map((project) => {
    const projectLikes = likesByProject[project.id] ?? [];

    return {
      ...project,
      comments: commentsByProject[project.id] ?? [],
      like_count: projectLikes.length,
      liked_by_me: guestId
        ? projectLikes.some((like) => like.guest_id === guestId)
        : false,
    };
  });
};

export const getPost = async (id, guestId) => {
  const project = await getProjectById(id);

  const [comments, likes] = await Promise.all([
    getCommentsForProjects([id]),
    getLikesForProjects([id]),
  ]);

  return {
    ...project,
    comments,
    like_count: likes.length,
    liked_by_me: guestId
      ? likes.some((like) => like.guest_id === guestId)
      : false,
  };
};

const ensureProjectExists = async (id) => {
  try {
    await getProjectById(id);
  } catch {
    throw new ApiError("Project not found", 404);
  }
};

export const addComment = async ({ projectId, guestId, content }) => {
  await ensureProjectExists(projectId);

  return createComment({
    project_id: projectId,
    guest_id: guestId,
    content,
  });
};

export const likePost = async ({ projectId, guestId }) => {
  await ensureProjectExists(projectId);

  try {
    return await createLike({ project_id: projectId, guest_id: guestId });
  } catch (error) {
    if (error?.code === DUPLICATE_LIKE_CODE) {
      throw new ApiError("You already liked this post", 409);
    }
    throw error;
  }
};
