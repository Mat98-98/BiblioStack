import { AppError } from "../utils/appError.js";

export const permit = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role?.toLowerCase();

            if (!userRole) {
                throw new AppError(
                    "Role not found",
                    "NO_ROLE",
                    403
                );
            }

            if (!allowedRoles.includes(userRole)) {
                throw new AppError(
                    "Access denied",
                    "FORBIDDEN",
                    403
                );
            }

            next();
        }
        catch (error) {
            next(error);
        }
    }
}