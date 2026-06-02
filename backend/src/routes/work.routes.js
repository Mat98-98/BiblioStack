import express from 'express';
import { workController } from "../controllers/work.controller.js";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";

const router = express.Router();

// GET /works/search?search=...?page=1&limit=20
router.get('/search', workController.search);

// GET /works/newest?limit=8
router.get('/newest', workController.getNewest);

// GET /works?page=1&limit=20
router.get('/', paginationMiddleware, workController.getAll);

// GET /works/:id
router.get('/:id', workController.getById);


// POST /works/from-external/:isbn
router.post("/from-external", verifyUser, permit( "admin"), workController.createFromExternal);

// POST /works/:isbn
router.post('/',verifyUser, permit( "admin"), workController.create);


// PATCH /works/:id
router.patch('/:id',verifyUser, permit( "admin"), workController.update);


// DELETE /works/:id
router.delete('/:id',verifyUser, permit( "admin"), workController.delete);

export default router;