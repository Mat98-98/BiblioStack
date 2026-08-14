import { cardRepository } from "../repositories/card.repository.js";
import { AppError } from "../utils/appError.js";
import { signCardToken, verifyCardSignature } from "../utils/card.util.js";
import { logger } from "../config/logger.config.js";

export const cardService = {

    // Token corrente da mostrare in app (GET /cards/me)
    getMyCardToken: async (userId) => {
        const user = await cardRepository.getCardVersion(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

        return signCardToken(user.id, user.cardVersion);
    },

    // Verifica di un QR scansionato dallo staff
    verify: async (token) => {

        // Controllo se la firma è valida
        const parsed = verifyCardSignature(token);
        if (!parsed) {
            logger.warn({ reason: "invalid_signature" }, "Card verification failed");
            return { valid: false };
        }


        const user = await cardRepository.getCardVersion(parsed.userId);
        if (!user) {
            logger.warn({ reason: "unknown_user"}, "Card verification failed")
            return { valid: false };
        }

        // Controllo se la versione è valida
        if (user.cardVersion !== parsed.version) {
            logger.warn({ reason: "stale_version", targetUserId: user.userId, scannedVersion: parsed.version, currentVersion: user.cardVersion }, "Card verification failed");
            return { valid: false };
        }

        return { valid: true, userId: user.id };
    },

    // Rinnovo: incrementa card_version, il vecchio QR smette subito di essere valido
    renew: async (targetUserId, actorId) => {
        const updated = await cardRepository.incrementCardVersion(targetUserId);

        if (!updated) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }

        logger.info({ targetUserId: updated.id, actorId, newVersion: updated.cardVersion }, "Card renewed");

        return { token: signCardToken(updated.id, updated.cardVersion) };
    }
};