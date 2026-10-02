import { redis } from "../redis/connection.js";
import { AppError } from "./appError.js";
import crypto from "crypto";

// Durata dei token e intervallo minimo tra due richieste di reset
const RESET_TOKEN_TTL_SECONDS = 10 * 60; // 10 minuti
const SETUP_TOKEN_TTL_SECONDS = 24 * 60 * 60; // 24 ore
const RESET_COOLDOWN_SECONDS = 10 * 60; // 10 minuti

// Limiti per IP sulla rotta /forgot-password per ip (rate limiter)
const FORGOT_IP_MAX_REQUESTS = 20; // Numero massimo di richieste per ip
const FORGOT_IP_WINDOW_SECONDS = 15 * 60; // 15 minuti

// Generazione token password mandato per email
const generateToken = () => crypto.randomBytes(32).toString("hex");

// Hash del token
const hashValue = (value) => crypto.createHash("sha256").update(value).digest("hex");

const tokenPrefix = (type) => `pwd:token:${type}:`;
const tokenKey = (type, tokenHash) => `${tokenPrefix(type)}${tokenHash}`;

// Puntatore al token attivo di un utente per tipo, in modo da invalidare quello precedente quando se ne emette uno nuovo
const activePrefix = (type) => `pwd:active:${type}:`;
const activeKey = (type, userId) => `${activePrefix(type)}${userId}`;

// Pausa tra le due richieste di reset
const cooldownKey = (email) => `pwd:cooldown:reset:${hashValue(email)}`;

const invalidToken = () => new AppError("Invalid token", "INVALID_TOKEN", 400);

/*
    Invalida il token precedente dello stesso tipo, poi crea il nuovo e aggiorna il puntatore
    Nota: in Redis Cluster le chiavi utilizzate dallo stesso script devono appartenere allo stesso hash slot. Questa implementazione è quindi pensata per Redis singolo
    KEYS: [activeKey, nuovo tokenKey]   ARGV: [userId, tokenHash, ttl, tokenPrefix]
*/
const ISSUE_TOKEN_SCRIPT = `
local previous = redis.call('GETDEL', KEYS[1])
if previous then
    redis.call('DEL', ARGV[4] .. previous)
end
redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[3])
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
return 1
`;

/*
    Legge e cancella il token; cancella il puntatore SOLO se punta ancora a questo token (se nel frattempo ne è stato emesso uno nuovo, il puntatore non viene toccato)
    KEYS: [tokenKey]   ARGV: [tokenHash, activePrefix]
*/
const CONSUME_TOKEN_SCRIPT = `
local userId = redis.call('GETDEL', KEYS[1])
if not userId then
    return false
end
local activeKey = ARGV[2] .. userId
if redis.call('GET', activeKey) == ARGV[1] then
    redis.call('DEL', activeKey)
end
return userId
`;

/*
    Per ogni tipo legge e cancella il puntatore e cancella il token corrispondente
    KEYS: [activeKey reset, activeKey setup] ARGV: [tokenPrefix reset, tokenPrefix setup]
*/

const INVALIDATE_TOKENS_SCRIPT = `
for i = 1, 2 do
    local hash = redis.call('GETDEL', KEYS[i])
    if hash then
        redis.call('DEL', ARGV[i] .. hash)
    end
end
return 1
`;

// Crea un token, lo salva con hash + scadenza e invalida l'eventuale token precedente (dello stesso tipo)
const issuePasswordToken = async (userId, type, ttlSeconds) => {
    const token = generateToken();
    const tokenHash = hashValue(token);

    await redis.eval(ISSUE_TOKEN_SCRIPT, {
        keys: [activeKey(type, userId), tokenKey(type, tokenHash)],
        arguments: [String(userId), tokenHash, String(ttlSeconds), tokenPrefix(type)]
    });

    return token;
};

// Verifica e consuma il token in un'unica operazione in modo che non possa essere utilizzato due volte
const consumePasswordToken = async (token, type) => {
    if (typeof token !== "string" || token.length !== 64) {
        throw invalidToken();
    }

    const tokenHash = hashValue(token);

    const userId = await redis.eval(CONSUME_TOKEN_SCRIPT, {
        keys: [tokenKey(type, tokenHash)],
        arguments: [tokenHash, activePrefix(type)]
    });

    if (!userId) {
        throw invalidToken();
    }
    return Number(userId);
};

export const issuePasswordResetToken = (userId) => issuePasswordToken(userId, "reset", RESET_TOKEN_TTL_SECONDS);
export const issuePasswordSetupToken = (userId) => issuePasswordToken(userId, "setup", SETUP_TOKEN_TTL_SECONDS);

export const consumePasswordResetToken = (token) => consumePasswordToken(token, "reset");
export const consumePasswordSetupToken = (token) => consumePasswordToken(token, "setup");

// Invalida tutti i token ancora "pending" di un utente, ad esempio dopo un cambio password riuscito
export const invalidateUserPasswordTokens = async (userId) => {
    await redis.eval(INVALIDATE_TOKENS_SCRIPT, {
        keys: [activeKey("reset", userId), activeKey("setup", userId)],
        arguments: [tokenPrefix("reset"), tokenPrefix("setup")]
    });
};

// Registra una richiesta di reset password per l'email passata
export const acquirePasswordResetCooldown = async (email) => {
    const result = await redis.set(cooldownKey(email), "1", { EX: RESET_COOLDOWN_SECONDS, NX: true });
    return result !== null;
};

/*
    ===== RATE LIMITER =====
 */
// Script Lua che incrementa atomicamente il contatore e imposta la scadenza alla prima richiesta della finestra temporale
const INCREMENT_RATE_LIMIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count
`;



// Incrementa il contatore del rate limit e restituisce il numero di richieste nella finestra corrente
const incrementRateLimit = async (key, windowSeconds) =>
    Number(await redis.eval(INCREMENT_RATE_LIMIT_SCRIPT, {
        keys: [key],
        arguments: [String(windowSeconds)]
    }));

export const isPasswordResetIpLimited = async (ip) =>
    (await incrementRateLimit(
        `pwd:ratelimit:forgot:ip:${ip}`,
        FORGOT_IP_WINDOW_SECONDS
    )) > FORGOT_IP_MAX_REQUESTS;