import express from 'express';
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { currencyController } from "../controllers/currency.controller.js";

const router = express.Router();

// GET /currencies?page=1&limit=20
router.get("/", paginationMiddleware, currencyController.getAll);

// GET /currencies/:id
router.get("/:id", currencyController.getByCode);

export default router;