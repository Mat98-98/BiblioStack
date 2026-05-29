import express from "express";
import { getAdmin, getLibrarian, getMember, getPublic } from "../controllers/access.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";

const router = express.Router();

// GET /access/public
router.get("/public", getPublic);

// GET /access/member
router.get("/member", verifyUser, permit("student", "librarian", "admin"), getMember);

// GET /access/librarian
router.get("/librarian", verifyUser, permit("librarian", "admin"), getLibrarian);

// GET /access/admin
router.get("/admin", verifyUser, permit( "admin"), getAdmin);

export default router;