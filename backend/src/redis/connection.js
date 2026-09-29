import { createClient } from "redis";
import { logger } from "../config/logger.config.js";

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        connectTimeout: 5_000,
        reconnectStrategy: (retries) => Math.min(retries * 100, 5_000)
    },
    password: process.env.REDIS_PASSWORD,
    // Se Redis non è raggiungibile i comandi falliscono subito invece di restare in coda così il fail open del rate limiter scatta e il login non si blocca
    disableOfflineQueue: true
});

redis.on("error", (err) => {
    logger.error({ err }, "Redis Client Error");
});

export { redis };