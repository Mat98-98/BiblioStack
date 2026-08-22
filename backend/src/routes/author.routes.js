import express from "express";
import { authorController } from "../controllers/author.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";

const router = express.Router();

// GET /authors?page=1&limit=20
router.get("/", paginationMiddleware, authorController.getAll);

// GET /authors/search?search=...?page=1&limit=20
router.get("/search", authorController.getByName);

// GET /authors/:id
router.get("/:id", authorController.getById);


// POST /authors
router.post("/", verifyUser, permit("admin"), authorController.create);


// PATCH /authors/:id
router.patch("/:id", verifyUser, permit("admin"), authorController.update);


// DELETE /authors/:id
router.delete("/:id", verifyUser, permit("admin"), authorController.delete);

export default router;