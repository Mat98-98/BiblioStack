import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/role.middleware.js";
import { paginationMiddleware } from "../middleware/pagination.middleware.js";

const router = express.Router();


// GET /users/search?name=marco?page=1&limit=20
router.get("/search", paginationMiddleware, verifyUser, permit( "admin"), userController.search);

// GET /users/me/dashboard -> Serve per visualizzare la dashboard personale
router.get("/me/dashboard", verifyUser, userController.getUserProfileData);

// GET /users/:id/dashboard -> Serve per visualizzare la dashboard di un utente da admin @todo Da fixare
router.get("/:id/dashboard", verifyUser, permit("admin"), userController.getUserProfileData);

// GET /users?page=1&limit=20
router.get("/", paginationMiddleware,verifyUser, permit( "admin"), userController.getAll);

// GET /users/:id
router.get("/:id", verifyUser, permit( "admin"),  userController.getById);


//POST /users
router.post("/", verifyUser, permit("admin"), userController.create);


// PATCH /users/:id
router.patch("/:id", verifyUser, permit("admin"), userController.update);

// PATCH /users/:id/role
router.patch("/:id/role", verifyUser, permit( "admin"), userController.setUserRole);

// DELETE /users/:id
router.delete("/:id", verifyUser, permit("admin"), userController.delete);

export default router;