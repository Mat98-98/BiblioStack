import express from 'express';
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {noticeController} from "../controllers/notice.controller.js";

const router = express.Router();


// GET /notices?page=1&limit=20
router.get('/', paginationMiddleware, noticeController.getAll);

// GET /notices/:id
router.get('/:id', noticeController.getById);


// POST /notices
router.post('/', noticeController.create);


// PATCH /notices/:id
router.patch('/:id', noticeController.update);


// DELETE /notices/:id
router.delete('/:id', noticeController.delete);

export default router;