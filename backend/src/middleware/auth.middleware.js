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