import express from "express";
import { protectedRoute } from "../middleware/protectedRoutes";
import {
  getNotification,
  deleteNotification,
} from "../controllers/notification.controller";

const router = express();

router.delete("/", protectedRoute, deleteNotification);
router.get("/", protectedRoute, getNotification);

export default router;
