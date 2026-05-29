import express from "express";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {locationController} from "../controllers/location.controller.js";

const router = express.Router();

// GET /locations?page=1&limit=20
router.get("/", paginationMiddleware, locationController.getAll);

// GET /locations/:id
router.get("/:id", locationController.getById);


// POST /locations
router.post("/", locationController.create);


// PATCH /locations/:id
router.patch("/:id", locationController.update);


// DELETE /locations/:id
router.delete("/:id", locationController.delete);

export default router;