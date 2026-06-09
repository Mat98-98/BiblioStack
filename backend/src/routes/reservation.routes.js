import express from "express"
import { reservationController } from "../controllers/reservation.controller.js";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import {verifyUser} from "../middleware/auth.middleware.js";

const router = express.Router();


// GET /reservations?page=1&limit=20
router.get("/", paginationMiddleware, reservationController.getAll);

// GET /reservations/:id
router.get("/:id", reservationController.getById);


// POST /reservations
router.post("/", verifyUser, reservationController.create);


// PATCH /reservations/:id  (body: status: "...")
router.patch("/:id", verifyUser, reservationController.update);


// DELETE /reservations/:id
router.delete("/:id", reservationController.delete);

export default router;
