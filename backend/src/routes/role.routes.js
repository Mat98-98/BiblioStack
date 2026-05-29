import express from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";
import { promoteUser, demoteUser, getRoles } from "../controllers/role.controller.js";

const router = express.Router();

// Solo gli admin possono gestire i ruoli

// GET /roles
router.get("/", verifyUser, permit("admin"), getRoles);


// POST /roles/permit
router.post("/promote", verifyUser, permit("admin"), promoteUser);

// POST /roles/demote
router.post("/demote", verifyUser, permit("admin"), demoteUser);

export default router;