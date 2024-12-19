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
router.post("/follow/:id", protectedRoute, followAndUnfollow);
router.post("/update", protectedRoute, updateProfile);
router.get("/suggested", protectedRoute, suggested);

export default router;
