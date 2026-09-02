import express from "express";
import {
  getPostsHandler,
  getPostHandler,
  addCommentHandler,
  likePostHandler,
  deletePostHandler,
} from "../controllers/post.controller.js";
import {
  validateGetPostsQuery,
  validateProjectIdParam,
  validateAddComment,
  validateLike,
} from "../validators/post.validator.js";

const router = express.Router();

router.get("/", validateGetPostsQuery, getPostsHandler);
router.get("/:id", validateProjectIdParam, getPostHandler);
router.post("/:id/comments", validateProjectIdParam, validateAddComment, addCommentHandler);
router.post("/:id/likes", validateProjectIdParam, validateLike, likePostHandler);
router.delete("/:id", validateProjectIdParam, deletePostHandler);

export default router;
