import crypto from "node:crypto";
import { logger } from "../config/logger.config.js";

const CARD_SECRET = process.env.CARD_SECRET;
// Controllp se è presente la chiave segreta bel file .env
if (!CARD_SECRET) {
    logger.fatal("CARD_SECRET environment variable is not set.");
    process.exit(1);
}

const SIG_BYTES = 16; // 128 bit

// Calcola la firma HMAC per userId e version
const computeSignature = (userId, version) =>
    crypto
        .createHmac("sha256", CARD_SECRET)
        .update(`${userId}.${version}`)
        .digest()
        .subarray(0, SIG_BYTES);

// Genera il testo da codificare nel QR combinando userId, versione e firma
export const signCardToken = (userId, version) => {
    const sig = computeSignature(userId, version).toString("base64url");
    return `${userId}.${version}.${sig}`;
};

// Verifica SOLO la firma crittografica del token, senza toccare il DB
export const verifyCardSignature = (token) => {
    if (typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [userIdStr, versionStr, sigStr] = parts;
    const userId = Number(userIdStr);
    const version = Number(versionStr);
    if (!Number.isInteger(userId) || !Number.isInteger(version)) return null;

    let providedSig;
    try {
        providedSig = Buffer.from(sigStr, "base64url");
    } catch {
        return null;
    }

    const expectedSig = computeSignature(userId, version);
    if (
        providedSig.length !== expectedSig.length ||
        !crypto.timingSafeEqual(providedSig, expectedSig)
    ) {
        return null;
    }

    return { userId, version };
};