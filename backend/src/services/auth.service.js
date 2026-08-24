// @TODO Verificare una volta buildato il frontend il log con access token a 1m e refresh token a 2/3 m. Provare ad abbassare anche il maxAge dei cookie per test
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db/connection.js";
import { userRepository } from "../repositories/user.repository.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { AppError } from "../utils/appError.js";
import { DEFAULT_USER_ROLE_ID, TOKEN_TYPES } from "../constants.js";
import { logger } from "../config/logger.config.js";
import { OAuth2Client } from "google-auth-library";

// Scadenze token auth
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_MS = 14 * 24 * 60 * 60 * 1000; // 14 giorni

// Lista di domini consentiti per il login google. Determina i domini che possono registrarsi attraverso google login automaticamente
const ALLOWED_GOOGLE_DOMAINS = [
    "buonarroti.tn.it"
];

// Generazione opaque refresh token
const generateRefreshToken = () => crypto.randomBytes(48).toString("hex");

// Hashing del refresh token dato che verrà salvato a db per le refresh rotation
const hashRefreshToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");


// Emette access token (JWT stateless) + refresh token (persistito come hash). Punto unico riusato da login, Google login e refresh.
const issueTokens = async (user, tx = db) => {
    const payload = {
        userId: user.id,
        roleId: user.roleId,
        roleName: user.role?.name?.toLowerCase()
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

    const refreshToken = generateRefreshToken();

    // Salvo il refresh token a database
    await refreshTokenRepository.create({
        userId: user.id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)
    }, tx);

    return { accessToken, refreshToken };
};

// Rende la prima lettera di ogni parola maiuscola e il resto minuscole
const capitalizeWords = (value) =>
    value
        ?.toLowerCase()
        .replace(/\b\p{L}/gu, (char) => char.toUpperCase());

// Per il login google
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Funzione helper per verificare che il dominio sia tra la lista dei consentiti
const isAllowedGoogleDomain = (email) => {
    const domain = email.split("@")[1]?.toLowerCase();

    return !!domain && ALLOWED_GOOGLE_DOMAINS.includes(domain);
}

// Funzione helper per il intercettare una violazione unique su postgreSQL
const isUniqueViolation = (error) =>
    error?.code === "23505";


export const authService = {

    register: async ({ email, password, firstName, lastName, phone }) => {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            logger.warn({ email }, "Registration attempt with already existing email");
            throw new AppError("Email already exists", "EMAIL_ALREADY_EXISTS", 409);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [user] = await userRepository.create({
            email, firstName, lastName, phone, passwordHash,
            roleId: DEFAULT_USER_ROLE_ID
        });

        logger.info({ userId: user.id }, "New user registered");
        return userRepository.findById(user.id);
    },

    login: async ({ email, password }) => {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            logger.warn({ email }, "Login attempt with non-existent email");
            throw new AppError("Email or password incorrect", "INVALID_CREDENTIALS", 401);
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            logger.warn({ userId: user.id }, "Login attempt with wrong password");
            throw new AppError("Email or password incorrect", "INVALID_CREDENTIALS", 401);
        }

        const { accessToken, refreshToken } = await issueTokens(user);
        return { accessToken, refreshToken, user };
    },

    loginWithGoogle: async (idToken) => {
        let payload;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            payload = ticket.getPayload();
        } catch {
            throw new AppError("Invalid Google token", "INVALID_TOKEN", 401);
        }

        if (!payload?.sub || !payload?.email) {
            throw new AppError("Invalid Google token", "INVALID_TOKEN", 401);
        }

        if (payload.email_verified !== true) {
            throw new AppError("Email not verified", "EMAIL_NOT_VERIFIED", 401);
        }


        const email = payload.email.toLowerCase();
        let user = await userRepository.findByGoogleId(payload.sub);

        if (!user) {
            const existingByEmail = await userRepository.findByEmail(email);

                if (existingByEmail) {
                    await userRepository.update(existingByEmail.id, { googleId: payload.sub });

                    user = await userRepository.findById(existingByEmail.id);
            } else {
                    if (!isAllowedGoogleDomain(email)) {
                        throw new AppError("Registration with Google is not allowed for this domain", "GOOGLE_DOMAIN_NOT_ALLOWED", 403);
                    }
                    try {
                        const [newUser] = await userRepository.create({
                            email: email,
                            firstName: capitalizeWords(payload.given_name ?? null),
                            lastName: capitalizeWords(payload.family_name ?? null),
                            passwordHash: null,
                            googleId: payload.sub,
                            roleId: DEFAULT_USER_ROLE_ID
                        });
                        user = await userRepository.findById(newUser.id);
                    } catch (error) {
                        if (isUniqueViolation(error)) {
                            user = await userRepository.findByGoogleId(payload.sub);

                            if (!user) {
                                throw new AppError("Unable to authenticate with Google", "GOOGLE_AUTH_FAILED", 500);
                            }
                        } else {
                            throw error;
                        }
                    }
            }
        }

        logger.info({ userId: user.id }, "User logged via Google");

        const { accessToken, refreshToken } = await issueTokens(user);
        return { accessToken, refreshToken, user };
    },

    // Il refresh token usato viene invalidato e sostituito da uno nuovo ad ogni chiamata /refresh
    refresh: async (refreshToken) => {
        if (!refreshToken) {
            throw new AppError("Refresh token is missing", "NO_TOKEN", 401);
        }

        const tokenHash = hashRefreshToken(refreshToken);
        const record = await refreshTokenRepository.findValidByTokenHash(tokenHash);

        if (!record || record.revokedAt || new Date() > record.expiresAt) {
            throw new AppError("Expired or invalid refresh token", "INVALID_TOKEN", 401);
        }

        const user = await userRepository.findById(record.userId);
        if (!user) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }

        return await db.transaction(async (tx) => {
            const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user, tx);
            await refreshTokenRepository.revoke(record.id, hashRefreshToken(newRefreshToken), tx);
            return { accessToken, refreshToken: newRefreshToken, user };
        });
    },

    // Revoca il refresh token lato server e i cookie lato client
    logout: async (refreshToken) => {
        if (!refreshToken) return;
        const tokenHash = hashRefreshToken(refreshToken);
        const record = await refreshTokenRepository.findValidByTokenHash(tokenHash);
        if (record) await refreshTokenRepository.revoke(record.id);
    }
};