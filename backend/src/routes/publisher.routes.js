import express from "express";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { publisherController } from "../controllers/publisher.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";


const router = express.Router();


// GET /publishers?page=1&limit=20
router.get("/", paginationMiddleware, publisherController.getAll);

// GET /publishers/:id
router.get("/:id", publisherController.getById);


// POST /publishers
router.post("/", verifyUser, permit("admin"), publisherController.create);


// PATCH /publishers/:id
router.patch("/:id", verifyUser, permit("admin"), publisherController.update);


// DELETE /publishers/:id
router.delete("/:id", verifyUser, permit("admin"), publisherController.delete);

export default router;