import {userRepository} from "../repositories/user.repository.js";
import {passwordTokenRepository} from "../repositories/passwordToken.repository.js";
import {TOKEN_TYPES} from "../constants.js";
import {isAfter, subMinutes} from "date-fns";
import {AppError} from "../utils/appError.js";
import {emailService} from "../features/email/email.service.js";
import bcrypt from "bcrypt";
import {db} from "../db/connection.js";
import {refreshTokenRepository} from "../repositories/refreshToken.repository.js";
import {logger} from "../config/logger.config.js";
import crypto from "crypto";

// Costanti per il setup e il reset password
const TOKEN_EXPIRY_MS = 10 * 60 * 1000;
const SETUP_PASSWORD_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_MINUTES = 10;

// Generazione token password
const generateToken = () => crypto.randomBytes(32).toString("hex");

const validateToken = async (token, expectedType) => {
    const record = await passwordTokenRepository.findByToken(token);
    if (!record || record.usedAt || new Date() > record.expiresAt || record.type !== expectedType) {
        throw new AppError("Invalid token", "INVALID_TOKEN", 400);
    }
    return record;
};

export const passwordService = {
    forgotPassword: async ({ email }) => {
        const user = await userRepository.findByEmail(email);
        if (!user) return;

        const lastToken = await passwordTokenRepository.findLatestByUserIdAndType(user.id, TOKEN_TYPES.RESET);
        if (lastToken) {
            const limitDate = subMinutes(new Date(), RATE_LIMIT_MINUTES);
            if (isAfter(lastToken.createdAt, limitDate)) {
                throw new AppError("Too many requests", "TOO_MANY_REQUESTS", 429);
            }
        }

        const token = generateToken();
        await passwordTokenRepository.create({
            token, userId: user.id, type: TOKEN_TYPES.RESET,
            expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
        });

        await emailService.sendPasswordReset({ to: user.email, firstName: user.firstName, token });
    },

    resetPassword: async ({ token, password }) => {
        const record = await validateToken(token, TOKEN_TYPES.RESET);
        const passwordHash = await bcrypt.hash(password, 12);

        // Avvio una transazione per garantire che tutti i passaggi vengano eseguiti prima di salvare a database in caso di crash
        await db.transaction(async (tx) => {

            // Cambio la password
            await userRepository.update(record.userId, { passwordHash }, tx);

            // Metto il flag "used" al token per il cambio password
            await passwordTokenRepository.markAsUsed(token, tx);

            // Revoco tutte le sessioni esistenti per sicurezza
            await refreshTokenRepository.revokeAllByUserId(record.userId, tx);
        })
    },

    setupPassword: async (userId) => {
        logger.debug({ userId }, "setupPassword called");
        const user = await userRepository.findById(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

        const token = generateToken();
        await passwordTokenRepository.create({
            token, userId: user.id, type: TOKEN_TYPES.SETUP,
            expiresAt: new Date(Date.now() + SETUP_PASSWORD_TOKEN_EXPIRY_MS),
        });

        await emailService.sendAccountSetup({ to: user.email, firstName: user.firstName, token });
        logger.info({ userId: user.id }, "Account setup email sent");
    },

    setupAccount: async ({ token, password }) => {
        // Verifica che il token sia valido
        const record = await validateToken(token, TOKEN_TYPES.SETUP);

        // Genera l'hash della password ricevuta in chiaro dal form
        const passwordHash = await bcrypt.hash(password, 12);

        // Uso una transazione per assicurarmi che vengano eseguite tutte le modifiche oppure nessuna
        await db.transaction(async (tx) => {
            await userRepository.update(record.userId, { passwordHash }, tx);
            await passwordTokenRepository.markAsUsed(token, tx);
        })
        logger.info({ userId: record.userId }, "Account setup completed successfully");
    }
}