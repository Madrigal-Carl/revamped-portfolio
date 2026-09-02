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
import { getFeaturesForProjects } from "../models/feature.model.js";
import { getTechStacksForProjects } from "../models/techStack.model.js";
import { getImagesForProjects } from "../models/image.model.js";
import { getProblemsForProjects } from "../models/problem.model.js";
import { getSolutionsForProjects } from "../models/solution.model.js";

const groupBy = (rows, key) =>
  rows.reduce((acc, row) => {
    const id = row[key];
    (acc[id] ??= []).push(row);
    return acc;
  }, {});

const DUPLICATE_LIKE_CODE = "23505";

const attachProjectChildren = (project, {
  commentsByProject,
  likesByProject,
  featuresByProject,
  techStacksByProject,
  imagesByProject,
  problemsByProject,
  solutionsByProject,
}, guestId) => {
  const projectLikes = likesByProject[project.id] ?? [];

  return {
    ...project,
    problems: (problemsByProject?.[project.id] ?? []).map((row) => row.name),
    solutions: (solutionsByProject?.[project.id] ?? []).map((row) => row.name),
    features: (featuresByProject[project.id] ?? []).map((row) => row.name),
    tech_stack: (techStacksByProject[project.id] ?? []).map((row) => row.name),
    image_urls: (imagesByProject[project.id] ?? []).map((row) => row.path),
    comments: commentsByProject[project.id] ?? [],
    like_count: projectLikes.length,
    liked_by_me: guestId
      ? projectLikes.some((like) => like.guest_id === guestId)
      : false,
  };
};

export const getPosts = async (guestId) => {
  const projects = await getAllProjects();

  if (!projects.length) return [];

  const projectIds = projects.map((project) => project.id);

  const [comments, likes, features, techStacks, images, problems, solutions] = await Promise.all([
    getCommentsForProjects(projectIds),
    getLikesForProjects(projectIds),
    getFeaturesForProjects(projectIds),
    getTechStacksForProjects(projectIds),
    getImagesForProjects(projectIds),
    getProblemsForProjects(projectIds),
    getSolutionsForProjects(projectIds),
  ]);

  const groups = {
    commentsByProject: groupBy(comments, "project_id"),
    likesByProject: groupBy(likes, "project_id"),
    featuresByProject: groupBy(features, "project_id"),
    techStacksByProject: groupBy(techStacks, "project_id"),
    imagesByProject: groupBy(images, "project_id"),
    problemsByProject: groupBy(problems, "project_id"),
    solutionsByProject: groupBy(solutions, "project_id"),
  };

  return projects.map((project) => attachProjectChildren(project, groups, guestId));
};

export const getPost = async (id, guestId) => {
  const project = await getProjectById(id);

  const [comments, likes, features, techStacks, images, problems, solutions] = await Promise.all([
    getCommentsForProjects([id]),
    getLikesForProjects([id]),
    getFeaturesForProjects([id]),
    getTechStacksForProjects([id]),
    getImagesForProjects([id]),
    getProblemsForProjects([id]),
    getSolutionsForProjects([id]),
  ]);

  return {
    ...project,
    problems: problems.map((row) => row.name),
    solutions: solutions.map((row) => row.name),
    features: features.map((row) => row.name),
    tech_stack: techStacks.map((row) => row.name),
    image_urls: images.map((row) => row.path),
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
