import express from "express";
import { protectedRoute } from "../middleware/protectedRoutes.js";
import {
  followAndUnfollow,
  suggested,
  updateProfile,
  userProfiles,
} from "../controllers/user.controllers.js";

const router = express();

router.get("/profile/:username", protectedRoute, userProfiles);
router.get("/follow/:id", protectedRoute, followAndUnfollow);
router.get("/update", protectedRoute, updateProfile);
router.get("/suggested", protectedRoute, suggested);

export default router;
