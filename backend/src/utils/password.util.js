import argon2 from "argon2";
import crypto from "crypto";

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
};

export const hashPassword = (plain) => argon2.hash(plain, ARGON2_OPTIONS);

// Hash di una password casuale, in modo che il tempo di risposta sia lo stesso anche quando l'utente non esiste o non ha password (previene raccolta di informazioni per gli attaccanti)
const DUMMY_HASH = await hashPassword(crypto.randomBytes(32).toString("hex"));

export const verifyPassword = async (plain, hash) => {
    try {
        const hashToVerify = hash || DUMMY_HASH;
        const ok = await argon2.verify(hashToVerify, plain);
        return Boolean(hash) && ok;
    } catch {
        return false;
    }
};

export const needsRehash = (hash) => {
    try {
        return argon2.needsRehash(hash, ARGON2_OPTIONS);
    } catch {
        return false;
    }
};