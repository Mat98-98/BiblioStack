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


//POST /auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

//POST /auth/reset-password
router.post("/reset-password", authController.resetPassword);

//POST /auth/setup-account
router.post("/setup-account", authController.setupAccount);

export default router;