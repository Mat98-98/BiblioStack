import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /auth/register
router.post("/register", authController.register);

// POST /auth/login
router.post("/login", authController.login);

//POST /auth/logout
router.post("/logout", authController.logout);


// GET /auth/me
router.get("/me", verifyUser, authController.me);

export default router;