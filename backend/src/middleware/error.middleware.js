import { AppError } from "../utils/appError.js";
import { ZodError } from "zod";

export const errorMiddleware = (err, req, res, next) => {
    req.logger.error({ err }), "Request error occurred";

    if (res.headersSent) {
        return next(err);
    }

    // Errori di validazione Zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: err.issues
        });
    }

    // Errori applicativi personalizzati
    if (err instanceof AppError) {
        return res.status(err.status).json({
            success: false,
            code: err.code,
            message: err.message,
            details: err.details || null
        });
    }

    // Fallback generico
    return res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Unexpected server error",
        details: process.env.NODE_ENV === "development"
            ? err.message
            : null
    });
};