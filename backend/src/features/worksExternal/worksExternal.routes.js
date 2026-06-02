import express from "express";
import { worksExternalController } from "./worksExternal.controller.js";
import {verifyUser} from "../../middleware/auth.middleware.js";
import {permit} from "../../middleware/role.middleware.js";

const router = express.Router();

// recupero dati esterni di una work tramite ISBN
router.get("/isbn/:isbn", verifyUser, permit( "admin"), worksExternalController.getByISBN);

export default router;