import express from 'express';
import {deweyCodeController} from "../controllers/dewey.code.controller.js";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";

const router = express.Router();

// GET /deweyCodes?page=1&limit=20
router.get('/', paginationMiddleware, deweyCodeController.getAll);

// GET /deweyCodes/:code
router.get('/:code', deweyCodeController.getByCode);


// POST /deweyCodes
router.post('/', deweyCodeController.create);


// PATCH /deweyCodes/:id
router.patch('/:code', deweyCodeController.update);


// DELETE /deweyCodes/:code
router.delete('/:code', deweyCodeController.delete);

export default router;
