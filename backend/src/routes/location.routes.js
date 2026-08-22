import express from "express";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {locationController} from "../controllers/location.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router();

// GET /locations?page=1&limit=20
router.get("/", paginationMiddleware, locationController.getAll);

// GET /locations/:id
router.get("/:id", locationController.getById);


// POST /locations
router.post("/", verifyUser, permit("admin"), locationController.create);


// PATCH /locations/:id
router.patch("/:id", verifyUser, permit("admin"), locationController.update);


// DELETE /locations/:id
router.delete("/:id", verifyUser, permit("admin"), locationController.delete);

export default router;