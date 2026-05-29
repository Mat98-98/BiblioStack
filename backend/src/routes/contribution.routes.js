import express from 'express';
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {contributionController} from "../controllers/contribution.controller.js";

const router = express.Router();

// GET /contributions?page=1&limit=20
router.get("/", paginationMiddleware, contributionController.getAll);

// GET /contributions/:id
router.get("/:id", contributionController.getById);


// POST /contributions
router.post("/", contributionController.create);


// PATCH /contributions/:id
router.patch("/:id", contributionController.update);


// DELETE /contributions/:id
router.delete("/:id", contributionController.delete);

export default router;