import express from 'express';
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { languageController} from "../controllers/language.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {permit} from "../middleware/role.middleware.js";

const router = express.Router();

// GET /languages?page=1&limit=20
router.get("/", paginationMiddleware, languageController.getAll);

// GET /languages/:languageCode
router.get("/:languageCode", languageController.getByLanguageCode);


// POST /languages
router.post("/", verifyUser, permit("admin"), languageController.create);


// PATCH /languages/:languageCode
router.patch("/:languageCode", verifyUser, permit("admin"), languageController.update);


// DELETE /languages/:languageCode
router.delete("/:languageCode", verifyUser, permit("admin"), languageController.delete);

export default router;