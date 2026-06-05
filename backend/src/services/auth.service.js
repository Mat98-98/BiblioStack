import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { subMinutes, isAfter } from "date-fns";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";
import { DEFAULT_USER_ROLE_ID, TOKEN_TYPES } from "../constants.js";
import { passwordTokenRepository } from "../repositories/passwordToken.repository.js";
import { emailService } from "../features/email/email.service.js";

// Tempo scadenza token
const TOKEN_EXPIRY_MS = 10 * 60 * 1000; //10 minuti

const SETUP_PASSWORD_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 ore

const RATE_LIMIT_MINUTES = 10;

// Funzione per generare il token per il reset e il setup della password
const generateToken = () => crypto.randomBytes(32).toString("hex")

// Controllo che il token soddisfi i requisiti necessari
const validateToken = async (token, expectedType) => {

    const record = await passwordTokenRepository.findByToken(token)

    if (!record || record.usedAt || new Date() > record.expiresAt || record.type !== expectedType) {
        throw new AppError("Invalid token", "INVALID_TOKEN", 400)
    }
    return record
}


export const authService = {

    register: async ({ email, password, firstName, lastName, phone }) => {
        // Controlla email duplicata
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw new AppError("Email already exists", "EMAIL_ALREADY_EXISTS", 409);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [user] = await userRepository.create({
            email,
            firstName,
            lastName,
            phone,
            passwordHash,
            roleId: DEFAULT_USER_ROLE_ID  // sempre student per registrazione pubblica
        });

        return userRepository.findById(user.id);
    },

    login: async ({ email, password }) => {
        const user = await userRepository.findByEmail(email);

        // Messaggio generico — non rivela se l'email esiste
        if (!user) {
            throw new AppError("Email or password incorrect", "INVALID_CREDENTIALS", 401);
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            throw new AppError("Email or password incorrect", "INVALID_CREDENTIALS", 401);
        }

        const payload = {
            userId:   user.id,
            roleId:   user.roleId,
            roleName: user.role?.name?.toLowerCase()
        };

        return {
            accessToken:  jwt.sign(payload, process.env.JWT_SECRET,  { expiresIn: "1h" }),
            refreshToken: jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: "7d" }),
            user
        };
    },

    // Funzione che invia il token e invia la email per il reset della password
    forgotPassword: async ({ email }) => {

        // Verifico l'esistenza dell'utente associato alla email
        const user = await userRepository.findByEmail(email);
        if (!user) return;

        // Imposto un limite di un token ogni 10 minuti
        const lastToken = await passwordTokenRepository.findLatestByUserIdAndType(
            user.id,
            TOKEN_TYPES.RESET
        );

        if (lastToken) {
            const limitDate = subMinutes(new Date(), RATE_LIMIT_MINUTES);
            if (isAfter(lastToken.createdAt, limitDate)) {
                throw new AppError("Too many requests", "TOO_MANY_REQUESTS", 429);
            }
        }

        const token = generateToken();

        // Aggiungo il token a db
        await passwordTokenRepository.create({
            token,
            userId: user.id,
            type: TOKEN_TYPES.RESET,
            expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
        })

        // Invio la email
        await emailService.sendPasswordReset({
            to: user.email,
            firstName: user.firstName,
            token
        })
    },

    // Funzione che reimposta la password controllando il token
    resetPassword: async ({ token, password }) => {

        // Mi assicuro che il token sia valido
        const record = await validateToken(token, TOKEN_TYPES.RESET)

        // Hash della nuova password ricevuta
        const passwordHash = await bcrypt.hash(password, 12)

        await userRepository.update(record.userId, { passwordHash })
        await passwordTokenRepository.markAsUsed(token)
    },

    // Funzione per inviare l'email con il link contenente il token per l'attivazione dell'account
    setupPassword: async (userId) => {

        // Verifico l'esistenza dell'utente associato alla email
        const user = await userRepository.findById(userId)
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404)

        const token = generateToken()
        await passwordTokenRepository.create({
            token,
            userId:    user.id,
            type:      TOKEN_TYPES.SETUP,
            expiresAt: new Date(Date.now() + SETUP_PASSWORD_TOKEN_EXPIRY_MS),
        })

        await emailService.sendAccountSetup({
            to:        user.email,
            firstName: user.firstName,
            token,
        })
    },

    setupAccount: async (token, password) => {

        // Mi assicuro che il token sia valido
        const record = await validateToken(token, TOKEN_TYPES.SETUP)
        // Hash della password ricevuta
        const passwordHash = await bcrypt.hash(password, 12)

        await userRepository.update(record.userId, { passwordHash })
        await passwordTokenRepository.markAsUsed(token)
    }
};