import express from "express"
import { loanController } from "../controllers/loan.controller.js";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router()

// GET /loans/search?search=...&status=all|active|overdue|returned&sortBy=loanDate|dueDate&sortOrder=asc|desc&workId=...&userId=...&page=1&limit=20
router.get("/search", paginationMiddleware, loanController.search);

// GET /loans?page=1&limit=20
router.get("/", paginationMiddleware, loanController.getAll);

// GET /loans/:id
router.get("/:id", loanController.getById);


// POST /loans
router.post("/", verifyUser, permit("librarian", "admin"), loanController.checkOut);

// POST /loans/:id/checkIn
router.patch("/:id/checkIn", verifyUser, permit("librarian", "admin"), loanController.checkIn);


// PATCH /loans/:id
router.patch("/:id", verifyUser, permit("librarian", "admin") , loanController.update);


// DELETE /loans/:id
router.delete("/:id", verifyUser, permit("admin"), loanController.delete);

export default router
