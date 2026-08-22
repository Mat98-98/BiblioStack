import express from 'express';
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {noticeController} from "../controllers/notice.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router();


// GET /notices?page=1&limit=20
router.get('/', paginationMiddleware, noticeController.getAll);

// GET /notices/:id
router.get('/:id', noticeController.getById);


// POST /notices
router.post('/', verifyUser, permit("librarian", "admin"), noticeController.create);


// PATCH /notices/:id
router.patch('/:id', verifyUser, permit("librarian", "admin"), noticeController.update);


// DELETE /notices/:id
router.delete('/:id', verifyUser, permit("admin"), noticeController.delete);

export default router;