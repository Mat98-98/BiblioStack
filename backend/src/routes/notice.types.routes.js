import express from 'express';
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { noticeTypesController } from "../controllers/notice.types.controller.js";

const router = express.Router();

// GET /notice-types?page=1&limi=20
router.get("/", paginationMiddleware, noticeTypesController.getAll);

// GET /notice-types/:id
router.get("/:id", noticeTypesController.getById);

export default router;