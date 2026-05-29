import express from "express"
import { loanController } from "../controllers/loan.controller.js";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";

const router = express.Router()

// GET /loans?page=1&limit=20
router.get("/", paginationMiddleware, loanController.getAll);

// GET /loans/:id
router.get("/:id", loanController.getById);


// POST /loans
router.post("/", loanController.checkOut);

// POST /loans/:id/checkIn
router.patch("/:id/checkIn", loanController.checkIn);


// PATCH /loans/:id
router.patch("/:id", loanController.update);


// DELETE /loans/:id
router.delete("/:id", loanController.delete);

export default router
