import express from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /notifications
router.get("/", verifyUser, notificationController.getPreview);

// GET /notifications/list?page=1&limit=20       Se si vuole riattivare questa rotta basta togliere il commento, l'endpoint è completo
// router.get("/list", verifyUser, paginationMiddleware, notificationController.getList);

// GET /notifications/:id
router.get("/:id", verifyUser, notificationController.getById);

// PATCH /notifications/:id/read
router.patch("/:id/read", verifyUser, notificationController.markAsRead);

export default router;