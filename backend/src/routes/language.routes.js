import express from 'express';
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { languageController} from "../controllers/language.controller.js";

const router = express.Router();

// GET /languages?page=1&limit=20
router.get("/", paginationMiddleware, languageController.getAll);

// GET /languages/:languageCode
router.get("/:languageCode", languageController.getByLanguageCode);


// POST /languages
router.post("/", languageController.create);


// PATCH /languages/:languageCode
router.patch("/:languageCode", languageController.update);


// DELETE /languages/:languageCode
router.delete("/:languageCode", languageController.delete);

export default router;