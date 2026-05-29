export class AppError extends Error {
    constructor(message, code = "ERROR", status = 500, details = null) {
        super(message);

        this.code = code;
        this.status = status;
        this.details = details;

        Error.captureStackTrace?.(this, this.constructor);
    }
}