import { createClient } from "redis";
import {logger} from "../config/logger.config.js";

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
    password: process.env.REDIS_PASSWORD,
});

redis.on("error", (err) => {
    logger.error({ err }, "Redis Client Error");
});

export { redis };