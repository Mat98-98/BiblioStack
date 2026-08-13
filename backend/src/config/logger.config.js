import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),

    // In sviluppo: output leggibile e colorato.
    // In produzione: JSON puro per lettura con log collector
    transport: isProduction
        ? undefined
        : {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname",
            },
        },

    // Qui vanno messi i campi sensibili per evitare che vengano mostrati nei log
    redact: {
        paths: [
            "password",
            "*.password",
            "passwordHash",
            "*.passwordHash",
            "token",
            "*.token",
            "req.headers.cookie",
            "req.headers.authorization",
        ],
        censor: "[REDACTED]",
    },
});