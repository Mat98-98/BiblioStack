import express from "express";
import { operatorDashboardController } from "./operator.dashboard.controller.js";
import { verifyUser } from "../../middleware/auth.middleware.js";
import { permit } from "../../middleware/role.middleware.js";

const router = express.Router();

// GET /operator-dashboard/stats
router.get("/stats", verifyUser, permit("librarian", "admin"), operatorDashboardController.getStats);

// GET /operator-dashboard/recent-notices?limit=5
router.get("/recent-notices", verifyUser, permit("librarian", "admin"), operatorDashboardController.getRecentNotices);

export default router;