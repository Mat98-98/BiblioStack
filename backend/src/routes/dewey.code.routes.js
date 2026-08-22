import express from 'express';
import {deweyCodeController} from "../controllers/dewey.code.controller.js";
import {paginationMiddleware} from "../middleware/pagination.middleware.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router();

// GET /deweyCodes?page=1&limit=20
router.get('/', paginationMiddleware, deweyCodeController.getAll);

// GET /deweyCodes/:code
router.get('/:code', deweyCodeController.getByCode);


// POST /deweyCodes
router.post('/', verifyUser, permit("admin"), deweyCodeController.create);


// PATCH /deweyCodes/:id
router.patch('/:code', verifyUser, permit("admin"), deweyCodeController.update);


// DELETE /deweyCodes/:code
router.delete('/:code', verifyUser, permit("admin"), deweyCodeController.delete);

export default router;
