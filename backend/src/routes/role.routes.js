import express from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";
import { getRoles } from "../controllers/role.controller.js";

const router = express.Router();

// Solo gli admin possono gestire i ruoli
// GET /roles
router.get("/", verifyUser, permit("admin"), getRoles);

export default router;