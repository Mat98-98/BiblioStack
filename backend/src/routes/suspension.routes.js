import express from "express";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { suspensionController } from "../controllers/suspension.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router();


// GET /suspensions?page=1&limit=20
router.get("/", paginationMiddleware, verifyUser, permit("librarian", "admin"), suspensionController.getAll);

// GET /suspensions/:id
router.get("/:id", paginationMiddleware, suspensionController.getById);


// POST /suspensions
router.post("/", verifyUser, permit("librarian", "admin"), suspensionController.create);


// PATCH /suspensions/user/:userId/end
router.patch("/user/:userId/end", verifyUser, permit("admin"), suspensionController.endActiveByUserId)

// PATCH /suspensions/:id
router.patch("/:id", verifyUser, permit("admin"), suspensionController.update);


// DELETE /suspensions/:id
router.delete("/:id", suspensionController.delete);

export default router;