import { authService } from "../services/auth.service.js";
import { RegisterSchema, LoginSchema, GoogleLoginSchema } from "../schemas/auth.schema.js";
import { UserAuthDTO, UserSafeDTO } from "../dto/user.dto.js";
import { setAuthCookies, clearAuthCookies } from "../utils/cookie.util.js";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../schemas/passwordToken.schema.js";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";

export const authController = {

    // La funzione register è la registrazione dell'utente tramite pagina di registrazione, per il momento bloccata
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

    googleLogin: async (req, res, next) => {
        try {
            const { idToken } = GoogleLoginSchema.parse(req.body);
            const { accessToken, refreshToken, user } = await authService.loginWithGoogle(idToken);

            setAuthCookies(res, accessToken, refreshToken);
            res.json({ user: UserSafeDTO.parse(user) });
        } catch (err) {
            next(err);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const { accessToken, refreshToken, user } = await authService.refresh(req.cookies.refreshToken);
            setAuthCookies(res, accessToken, refreshToken);
            res.json({ user: UserSafeDTO.parse(user) });
        } catch (err) {
            next(err);
        }
    },

    logout: async (req, res, next) => {
        try {
            await authService.logout(req.cookies.refreshToken);
            clearAuthCookies(res);
            res.json({ message: "Logged out" });
        } catch (err) {
            next(err);
        }
    },

    me: async (req, res, next) => {
        try {
            const user = await userRepository.findById(req.user.id);

            if (!user) {
                throw new AppError(
                    "User not found",
                    "USER_NOT_FOUND",
                    404
                );
            }

            res.json(UserAuthDTO.parse(user));
        } catch (err) {
            next(err);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            const { email } = ForgotPasswordSchema.parse(req.body)
            await authService.forgotPassword({ email })

            res.json({ message: "Password reset instructions sent"})
        } catch (err) {
            next(err)
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { token, password } = ResetPasswordSchema.parse(req.body)
            await authService.resetPassword({ token, password })
            res.json({ message: "Account setup completed" })
        } catch (err) {
            next(err)
        }
    },

    setupAccount: async (req, res, next) => {
        try {
            const { token, password } = ResetPasswordSchema.parse(req.body)
            await authService.setupAccount({ token, password })
            res.json({ message: "Password reset successful" })
        } catch (err) {
            next(err)
        }
    }
};