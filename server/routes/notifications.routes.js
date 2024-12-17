import express from "express";
import { protectedRoute } from "../middleware/protectedRoutes.js";
import {
  getNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express();

router.delete("/", protectedRoute, deleteNotification);
router.get("/", protectedRoute, getNotification);

export default router;
