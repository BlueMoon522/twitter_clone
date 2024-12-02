import express from "express";
import { protectedRoute } from "../middleware/protectedRoutes.js";
import {
  createPost,
  deletePost,
  likePost,
  commentPost,
  getPosts,
  getLiked,
  followPost,
  allPost,
} from "../controllers/posts.controllers.js";

const router = express();

router.get("/following", protectedRoute, followPost);
router.get("/user/:username", protectedRoute, allPost);
router.get("/", protectedRoute, getPosts);
router.get("/likes/:id", protectedRoute, getLiked);
router.post("/create", protectedRoute, createPost);
router.delete("/:id", protectedRoute, deletePost);
router.post("/like/:id", protectedRoute, likePost);
router.post("/comment/:id", protectedRoute, commentPost);

export default router;
