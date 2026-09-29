import { redis } from "../redis/connection.js";
import { logger } from "../config/logger.config.js";
import crypto from "crypto";


// @todo: da spostare in un file di configurazione
const PAIR_MAX_FAILURES = 5;
const ACCOUNT_MAX_FAILURES = 30;
const IP_MAX_FAILURES = 200;

// Finestra di conteggio dei fallimenti
const WINDOW_SECONDS = 10 * 60;
// Durata del blocco
const LOCK_SECONDS = 10 * 60;

// Hash dell'email (arriva già normalizzata dallo schema con trim + lowercase
const hashEmail = (email) =>
    crypto.createHash("sha256").update(email).digest("hex");

const keys = (email, ip) => {
    const e = hashEmail(email);
    return {
        pairFail: `login:fail:pair:${e}:${ip}`,
        pairLock: `login:lock:pair:${e}:${ip}`,
        accountFail: `login:fail:account:${e}`,
        accountLock: `login:lock:account:${e}`,
        ipFail: `login:fail:ip:${ip}`,
        ipLock: `login:lock:ip:${ip}`,
    };
};

/*
    Script Lua. Crea il lock e azzera il contatore in un'unica esecuzione atomica
    KEYS: [pairFail, pairLock, accountFail, accountLock, ipFail, ipLock]
    ARGV: [window, lockSeconds, pairMax, accountMax, ipMax]
*/
const RECORD_FAILURES_SCRIPT = `
local window = tonumber(ARGV[1])
local lockSeconds = tonumber(ARGV[2])
local result = {}
 
for i = 0, 2 do
    local counterKey = KEYS[i * 2 + 1]
    local lockKey    = KEYS[i * 2 + 2]
    local max        = tonumber(ARGV[3 + i])
 
    local count = redis.call('INCR', counterKey)
    
    if count == 1 then
        redis.call('EXPIRE', counterKey, window)
    end
 
    if count >= max then
        redis.call('SET', lockKey, '1', 'EX', lockSeconds)
        redis.call('DEL', counterKey)
    end
 
    result[i + 1] = count
end
 
return result
`;

export const loginRateLimitService = {
    isLoginBlocked: async (email, ip) => {
        const k = keys(email, ip);

        try {
            const locked = await redis.exists(k.pairLock, k.accountLock, k.ipLock);
            return locked > 0;
        } catch (err) {
            logger.error({ err }, "Login rate limiter unavailable");
            return false;
        }
    },

    recordFailure: async (email, ip) => {
        const k = keys(email, ip);

        try {
            const [pair, account, ipCount] = await redis.eval(RECORD_FAILURES_SCRIPT, {
                keys: [k.pairFail, k.pairLock, k.accountFail, k.accountLock, k.ipFail, k.ipLock],
                arguments: [
                    String(WINDOW_SECONDS),
                    String(LOCK_SECONDS),
                    String(PAIR_MAX_FAILURES),
                    String(ACCOUNT_MAX_FAILURES),
                    String(IP_MAX_FAILURES)
                ]
            });
            return { pair: Number(pair), account: Number(account), ip: Number(ipCount) };
        } catch (err) {
            logger.error({ err }, "Login rate limiter unavailable");
            return { pair: null, account: null, ip: null };
        }
    },

    // Login riuscito, azzera solo la coppia email e ip, i contatori degli account e ip scadono da soli
    resetPair: async (email, ip) => {
        const k = keys(email, ip);

        try {
            await redis.del(k.pairFail, k.pairLock);
        } catch (err) {
            logger.error({ err }, "Login rate limiter unavailable");
        }
    }
};