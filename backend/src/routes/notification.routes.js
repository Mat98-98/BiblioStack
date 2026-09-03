import express from "express";
import { notificationController } from "../controllers/notification.controller.js";

import {verifyUser} from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /notifications/:id
router.get("/:id", verifyUser, notificationController.getById);

// PATCH /notifications/:id/read
router.patch("/:id/read", verifyUser, notificationController.markAsRead);

export default router;