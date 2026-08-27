import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const verifyUser = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return next(new AppError(
            "Access token is missing",
            "NO_TOKEN",
            401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            roleId: decoded.roleId,
            role: decoded.roleName
        };

        next();
    }
    catch {
        return next(new AppError(
            "Expired or invalid token",
            "INVALID_TOKEN",
            401
        ));
    }
}

// Come verifyUser ma non blocca la richiesta se il token manca o non è valido. Serve per rotte pubbliche che però vogliono sapere chi è l'utente se loggato.
export const tryAuthenticate = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return next(); // nessun token → prosegue come anonimo

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            roleId: decoded.roleId,
            role: decoded.roleName
        };
        return next();
    } catch (error) {
        // Token scaduto. Propaga 401 così l'interceptor fa il refresh e ritenta la richiesta, se ha successo questo middleware trova un token valido e popola req.user correttamente. In caso di fallimento l'interceptor gestirà il logout forzato
        if (error.name === "TokenExpiredError") {
            return next(new AppError(
                "Expired token", "EXPIRED_TOKEN", 401
            ));
        }
    }

    next();
};

/*
// Serve a creare una rotta interna al server sicura per le automazioni
export const verifyInternalSecret = (req, res, next) => {
    // Condronta l'header inviato da
    const secret = req.headers["x-internal-secret"]
    if (secret !== process.env.INTERNAL_SECRET)
        return next(new AppError("Forbidden", "FORBIDDEN", 403))
    next()
}
*/