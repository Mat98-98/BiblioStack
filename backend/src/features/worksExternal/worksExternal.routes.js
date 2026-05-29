import express from "express";
import { worksExternalController } from "./worksExternal.controller.js";

const router = express.Router();

// recupero dati esterni di una work tramite ISBN
router.get("/isbn/:isbn", worksExternalController.getByISBN);

export default router;