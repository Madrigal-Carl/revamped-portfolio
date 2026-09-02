import {
  getPosts,
  getPost,
  addComment,
  likePost,
  deletePost,
} from "../services/post.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPostsHandler = asyncHandler(async (req, res) => {
  const posts = await getPosts(req.query.guest_id);

  return res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

export const getPostHandler = asyncHandler(async (req, res) => {
  const post = await getPost(req.params.id, req.query.guest_id);

  return res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
});

export const addCommentHandler = asyncHandler(async (req, res) => {
  const comment = await addComment({
    projectId: req.params.id,
    guestId: req.body.guest_id,
    content: req.body.content,
  });

  return res.status(201).json({
    message: "Comment added successfully",
    comment,
  });
});

export const likePostHandler = asyncHandler(async (req, res) => {
  const like = await likePost({
    projectId: req.params.id,
    guestId: req.body.guest_id,
  });

  return res.status(201).json({
    message: "Post liked successfully",
    like,
  });
});

export const deletePostHandler = asyncHandler(async (req, res) => {
  await deletePost(req.params.id);

  return res.status(200).json({
    message: "Post and related data deleted successfully",
  });
});
