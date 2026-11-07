import { redis } from "../redis/connection.js";
import { logger } from "../config/logger.config.js";

const TOKEN_PREFIX = "rt:token:";
const USER_PREFIX = "rt:user:";

const tokenKey = (hash) => `${TOKEN_PREFIX}${hash}`;
const userKey = (userId) => `${USER_PREFIX}${userId}`;

// Esegue registrazione del token e associazione all'utente senza interleaving con altre operazioni Redis.
const CREATE_LUA = `
redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[3])
redis.call('SADD', KEYS[2], ARGV[2])
redis.call('EXPIRE', KEYS[2], ARGV[3])
return 1
`;

// Cancella tutti i token di un utente e il Set stesso, in modo atomico. Ritorna quanti token ha revocato.
// KEYS: 1=user set. ARGV: 1=token prefix
const REVOKE_ALL_LUA = `
local hashes = redis.call('SMEMBERS', KEYS[1])

for _, hash in ipairs(hashes) do
    redis.call('DEL', ARGV[1] .. hash)
end

redis.call('DEL', KEYS[1])

return #hashes
`;

export const refreshTokenRepository = {

    // Crea un refresh token e lo associa all'utente
    create: async ({ userId, tokenHash, ttlSeconds }) => {
        await redis.eval(CREATE_LUA, {
            keys: [tokenKey(tokenHash), userKey(userId)],
            arguments: [String(userId), tokenHash, String(ttlSeconds)],
        });
    },

    // Consuma il token in modo atomico (GETDEL): tra due richieste concorrenti ne vince una sola.
    // Ritorna lo userId, oppure null se il token non esiste, è scaduto o è già stato usato.
    consume: async (tokenHash) => {
        const userId = await redis.getDel(tokenKey(tokenHash));
        if (!userId) return null;

        // Pulizia del Set: se fallisce non è grave e non deve far perdere il token già consumato
        try {
            await redis.sRem(userKey(userId), tokenHash);
        } catch (err) {
            logger.warn({ err, userId }, "Failed to remove refresh token hash from user set");
        }

        return Number(userId);
    },

    // Revoca un singolo refresh token (logout)
    revoke: async (tokenHash) => {
        await refreshTokenRepository.consume(tokenHash);
    },

    // Revoca tutti i refresh token dell'utente (soft-delete, reset password)
    revokeAllByUserId: async (userId) => {
        const count = await redis.eval(REVOKE_ALL_LUA, {
            keys: [userKey(userId)],
            arguments: [TOKEN_PREFIX],
        });
        return Number(count);
    },
};