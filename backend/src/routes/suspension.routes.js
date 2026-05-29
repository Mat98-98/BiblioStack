import express from "express";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { suspensionController } from "../controllers/suspension.controller.js";

const router = express.Router();


// GET /suspensions?page=1&limit=20
router.get("/", paginationMiddleware, suspensionController.getAll);

// GET /suspensions/:id
router.get("/:id", paginationMiddleware, suspensionController.getById);


// POST /suspensions
router.post("/", suspensionController.create);


// PATCH /suspensions/:id
router.patch("/:id", suspensionController.update);


// DELETE /suspensions/:id
router.delete("/:id", suspensionController.delete);

export default router;