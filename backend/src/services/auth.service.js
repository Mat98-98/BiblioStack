import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";
import { DEFAULT_USER_ROLE_ID } from "../constants.js";

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
    }
};