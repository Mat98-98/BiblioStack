import express from 'express';
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {contributionController} from "../controllers/contribution.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router();

// GET /contributions?page=1&limit=20
router.get("/", paginationMiddleware, contributionController.getAll);

// GET /contributions/:id
router.get("/:id", contributionController.getById);


// POST /contributions
router.post("/", verifyUser, permit("admin"), contributionController.create);


// PATCH /contributions/:id
router.patch("/:id", verifyUser, permit("admin"), contributionController.update);


// DELETE /contributions/:id
router.delete("/:id", verifyUser, permit("admin"), contributionController.delete);

export default router;