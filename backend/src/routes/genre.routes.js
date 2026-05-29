import express from 'express';
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { genreController } from "../controllers/genre.controller.js";

const router = express.Router();

// GET /genres?page=1&limit=20
router.get("/", paginationMiddleware, genreController.getAll);

// GET /genres/:id
router.get("/:id", genreController.getById);


// POST /genres
router.post("/", genreController.create);


// PATCH /genres/:id
router.patch("/:id", genreController.update);


// DELETE /genres/:id
router.delete("/:id", genreController.delete);

export default router;