import { z } from "zod";
import { AppError } from "../utils/appError.js";

const IdParamSchema = z.coerce.number().int().positive("Invalid id parameter");

export const validateIdParam = (req, res, next) => {
    const result = IdParamSchema.safeParse(req.params.id);
    if (!result.success) {
        return next(new AppError("Invalid id parameter", "BAD_REQUEST", 400));
    }
    req.params.id = result.data;
    next();
};