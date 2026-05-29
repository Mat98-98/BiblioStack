import express from "express";
import { itemController } from "../controllers/item.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";

const router = express.Router();

// GET /items?page=1&limit=20
router.get("/", paginationMiddleware, itemController.getAll);

// GET /items/:workId
router.get("/:workId", itemController.getAvailable);


// POST /items
router.post("/", verifyUser, permit("admin", "librarian"), itemController.create);


// PATCH /items/:id
router.patch("/:id", verifyUser, permit("admin", "librarian"), itemController.update);


// DELETE /items/:id
router.delete("/:id", verifyUser, permit("admin"), itemController.delete);

export default router;