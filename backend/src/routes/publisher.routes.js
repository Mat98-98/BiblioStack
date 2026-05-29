import express from "express";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { publisherController } from "../controllers/publisher.controller.js";


const router = express.Router();


// GET /publishers?page=1&limit=20
router.get("/", paginationMiddleware, publisherController.getAll);

// GET /publishers/:id
router.get("/:id", publisherController.getById);


// POST /publishers
router.post("/", publisherController.create);


// PATCH /publishers/:id
router.patch("/:id", publisherController.update);


// DELETE /publishers/:id
router.delete("/:id", publisherController.delete);

export default router;