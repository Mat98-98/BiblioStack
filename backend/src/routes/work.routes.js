import express from 'express';
import { workController } from "../controllers/work.controller.js";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";

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
router.post("/from-external", workController.createFromExternal);

// POST /works/:isbn
router.post('/', workController.create);


// PATCH /works/:id
router.patch('/:id', workController.update);


// DELETE /works/:id
router.delete('/:id', workController.delete);

export default router;