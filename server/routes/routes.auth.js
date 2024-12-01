import express from "express";
import {
  authedUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/verify", protectedRoute, authedUser);

export default router;
