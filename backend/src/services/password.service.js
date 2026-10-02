import { userRepository } from "../repositories/user.repository.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { AppError } from "../utils/appError.js";
import { emailService } from "../features/email/email.service.js";
import { db } from "../db/connection.js";
import { logger } from "../config/logger.config.js";
import {
    issuePasswordResetToken,
    issuePasswordSetupToken,
    consumePasswordResetToken,
    consumePasswordSetupToken,
    invalidateUserPasswordTokens,
    acquirePasswordResetCooldown,
    isPasswordResetIpLimited
} from "../utils/passwordToken.util.js";
import bcrypt from "bcrypt";

const BCRYPT_COST = Number(process.env.BCRYPT_COST ?? 12);

export const passwordService = {
    // La email arriva già normalizzata (trim + lowercase) da ForgotPasswordSchema
    forgotPassword: async ({ email, ip }) => {
        // Limito le richieste provenienti dallo stesso IP
        if (await isPasswordResetIpLimited(ip)) {
            logger.warn({ ip }, "Password reset IP rate limit exceeded");
            throw new AppError("Too many requests", "TOO_MANY_REQUESTS", 429);
        }

        // Impedisce richieste ripetute per la stessa email finché il cooldown del token di reset è valido.
        if (!(await acquirePasswordResetCooldown(email))) return;

        logger.info({ ip }, "Password reset requested");

        const user = await userRepository.findByEmail(email);
        if (!user) return;

        const token = await issuePasswordResetToken(user.id);

        // Invio in background: il tempo di risposta non dipende dal server di posta
        void (async () => {
            try {
                await emailService.sendPasswordReset({ to: user.email, firstName: user.firstName, token });
            } catch (err) {
                logger.error({ err, userId: user.id }, "Failed to send password reset email");
            }
        })();
    },

    resetPassword: async ({ token, password }) => {
        const userId = await consumePasswordResetToken(token);
        const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

        // Transazione: cambio password e revoca di tutte le sessioni esistenti avvengono insieme
        await db.transaction(async (tx) => {
            const updated = await userRepository.updatePasswordHashIfActive(userId, passwordHash, tx);
            if (!updated) {
                throw new AppError("Invalid token", "INVALID_TOKEN", 400);
            }

            await refreshTokenRepository.revokeAllByUserId(userId, tx);
        });

        await invalidateUserPasswordTokens(userId);
        logger.info({ userId }, "Password reset completed");
    },

    setupPassword: async (userId) => {
        const user = await userRepository.findById(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

        const token = await issuePasswordSetupToken(user.id);

        await emailService.sendAccountSetup({ to: user.email, firstName: user.firstName, token });
        logger.info({ userId: user.id }, "Account setup email sent");
    },

    setupAccount: async ({ token, password }) => {
        const userId = await consumePasswordSetupToken(token);
        const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

        const updated = await userRepository.updatePasswordHashIfActive(userId, passwordHash);
        if (!updated) {
            throw new AppError("Invalid token", "INVALID_TOKEN", 400);
        }

        await invalidateUserPasswordTokens(userId);
        logger.info({ userId }, "Account setup completed successfully");
    }
};