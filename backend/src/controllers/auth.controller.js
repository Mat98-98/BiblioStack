import { authService } from "../services/auth.service.js";
import { RegisterSchema, LoginSchema } from "../schemas/auth.schema.js";
import { UserSafeDTO } from "../dto/user.dto.js";
import { setAuthCookies, clearAuthCookies } from "../utils/cookie.util.js";

export const authController = {

    register: async (req, res, next) => {
        try {
            const validatedData = RegisterSchema.parse(req.body);
            const user = await authService.register(validatedData);
            res.status(201).json(UserSafeDTO.parse(user));
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const validatedData = LoginSchema.parse(req.body);
            const { accessToken, refreshToken, user } = await authService.login(validatedData);

            setAuthCookies(res, accessToken, refreshToken);

            res.json({ user: UserSafeDTO.parse(user) });
        } catch (err) {
            next(err);
        }
    },

    logout: (req, res) => {
        clearAuthCookies(res);
        res.json({ message: "Logged out" });
    },

    me: (req, res) => {
        res.json(req.user);
    }
};