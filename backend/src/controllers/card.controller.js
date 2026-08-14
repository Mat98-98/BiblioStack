import { cardService } from "../services/card.service.js";
import { VerifyCardSchema } from "../schemas/card.schema.js";

export const cardController = {

    getMyCard: async (req, res, next) => {
        try {
            const token = await cardService.getMyCardToken(req.user.id);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    },

    verify: async (req, res, next) => {
        try {
            const { token } = VerifyCardSchema.parse(req.body);
            const result = await cardService.verify(token);

            // 401 generico se non valido: niente dettagli sul motivo esatto verso il client
            res.status(result.valid ? 200 : 401).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Permette allo staff di rinnovare il QR a un utente qualsiasi
    renew: async (req, res, next) => {
        try {
            const targetUserId = Number(req.params.id);
            const result = await cardService.renew(targetUserId, req.user.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // Rinnova il QR dell'utente che fa la richiesta
    renewPersonalCard: async (req, res, next) => {
        try {
            const result = await cardService.renew(req.user.id, req.user.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};