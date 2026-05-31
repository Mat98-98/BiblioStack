import { userService } from "../services/user.service.js";
import {UserDashboardDTO, AdminDashboardDTO, UserBaseListDTO, UserSafeDTO, UserBaseDTO} from "../dto/user.dto.js";
import { UpdateUserSchema, CreateUserSchema, UserSearchSchema } from "../schemas/user.schema.js";
import { AppError } from "../utils/appError.js";
import { ROLE_IDS } from "../constants.js";
import { ChangeRoleSchema } from "../schemas/role.schema.js";

export const userController = {

    getAll: async (req, res, next) => {
        try {
            const users = await userService.getAll(req.pagination);
            const data = UserBaseListDTO.parse(users)
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const user = await userService.getById(Number(req.params.id));
            res.json(AdminDashboardDTO.parse(user));
        } catch (error) {
            next(error);
        }
    },

    search: async (req, res, next) => {
        try {
            const params = UserSearchSchema.parse(req.query);
            const users = await userService.search(params);
            res.json(UserBaseListDTO.parse(users));
        } catch (error) {
            next(error);
        }
    },

    getByEmail: async (req, res, next) => {
        try {
            const user = await userService.getByEmail(req.query.email);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    getUserProfileData: async (req, res, next) => {
        try {
            const requestedId = req.params.id ? Number(req.params.id) : null;
            const userId = requestedId ?? req.user?.id;

            if (!userId || Number.isNaN(userId)) {
                throw new AppError("Invalid user id", "BAD_REQUEST", 400);
            }

            const user = await userService.getUserProfileData(userId);
            if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

            const isAdmin = req.user?.roleName === "admin" || req.user?.roleId === ROLE_IDS.ADMIN;

            res.json(isAdmin
                ? AdminDashboardDTO.parse(user)
                : UserDashboardDTO.parse(user)
            );
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateUserSchema.parse(req.body);
            const user = await userService.createByAdmin(validatedData);
            res.status(201).json(UserSafeDTO.parse(user));
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateUserSchema.parse(req.body);
            const updatedUser = await userService.update(req.params.id, validatedData);
            res.json(UserSafeDTO.parse(updatedUser));
        } catch (error) {
            next(error);
        }
    },

    setUserRole: async (req, res, next) => {
        try {
            const userId = Number(req.params.id);

            const { role } = ChangeRoleSchema.parse(req.body);

            const updatedUser = await userService.setUserRole(userId, role);

            res.json({
                code: "SUCCESS",
                user: UserBaseDTO.parse(updatedUser)
            });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await userService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};