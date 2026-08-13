import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "../config/logger.config.js";


export const httpLogger = pinoHttp({
    logger,

    // ID univoco per ogni richiesta
    genReqId: (req, res) => {
        const existingId = req.id ?? req.headers["x-request-id"];
        if (existingId) return existingId;
        const id = randomUUID();
        res.setHeader("X-Request-Id", id);
        return id;
    },

    // Livello del log in base all'esito della richiesta:
    // errori server -> error, errori client (4xx) -> warn, il resto -> info
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },

    // Messaggio breve e leggibile invece del default di pino-http
    customSuccessMessage: (req, res) => `${req.method} ${req.url} -> ${res.statusCode}`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.url} -> ${res.statusCode} (${err.message})`,

    // Non loggare in modo verboso le richieste di health check, se le hai (es. /health, /ping)
    autoLogging: {
        ignore: (req) => req.url === "/health",
    },
});