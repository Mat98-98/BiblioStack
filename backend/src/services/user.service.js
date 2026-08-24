import { userRepository } from "../repositories/user.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { reservationService } from "./reservation.service.js";
import { passwordTokenRepository } from "../repositories/passwordToken.repository.js";
import { suspensionRepository } from "../repositories/suspension.repository.js";
import { AppError } from "../utils/appError.js";
import { DEFAULT_USER_ROLE_ID } from "../constants.js";
import { authService } from "./auth.service.js";
import { db } from "../db/connection.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import {passwordService} from "./password.service.js";



// Funzione per verificare l'esistenza di un utente, usata in getById, update e delete
const findUniqueOrThrow = async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new AppError(
            "User not found",
            "NOT_FOUND",
            404
        );
    }

    return user;
};

// Funzione per verificare l'esistenza di un ruolo, usata in setUserRole
const findRoleOrThrow = async (name) => {
    const role = await roleRepository.findByName(name)
    if (!role) throw new AppError("Role not found", "NOT_FOUND", 404)
    return role
}

export const userService = {

    getAll: async ({ page, limit }) => {
        return await userRepository.findAll({ page, limit });
    },

    getById: async (id) => {
        return await findUniqueOrThrow(id);
    },

    search: async (params) => {
        return await userRepository.search(params)
    },


    getByEmail: async (email) => {
        if (!email) throw new AppError("Email query parameter is required", "MISSING_QUERY_PARAM", 400);

        const user = await userRepository.findByEmail(email);

        if (!user) throw new AppError("Users not found", "NOT_FOUND", 404);

        return user;
    },

    getUserProfileData: async (id) => {
        const userData = await userRepository.findUserProfileDataById(id);

        if (!userData) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }

        return userData;
    },

    // Per la creazione di un account tramite pannello admin. L'account viene generato senza password, viene quindi inviata una email all'utente per sceglierne una a suo piacimento e completare la registrazione
    createByAdmin: async ({ email, firstName, lastName, phone, roleId }) => {
        const existing = await userRepository.findByEmail(email);
        if (existing) throw new AppError("Email already exists", "EMAIL_ALREADY_EXISTS", 409);

        const [user] = await userRepository.create({
            email,
            firstName,
            lastName,
            phone,
            passwordHash: null, //
            roleId: roleId ?? DEFAULT_USER_ROLE_ID
        });

        const createdUser = await userRepository.findById(user.id);

        // Invio l'email di setup password all'utente
        await passwordService.setupPassword(createdUser.id);

        return createdUser;
    },

    setUserRole: async (userId, roleName) => {
        const [role, user] = await Promise.all([
            findRoleOrThrow(roleName),
            findUniqueOrThrow(userId)
        ])

        if (user.roleId === role.id) {
            throw new AppError("User already has this role", "NO_CHANGE", 400)
        }

        await roleRepository.updateUserRole(userId, role.id)

        return userRepository.findById(userId)
    },


    update: async (id, data) => {
        await findUniqueOrThrow(id);

        const updatedUser = await userRepository.update(id, data);
        return updatedUser;
        },

    // Funzione che permette di anonimizzare l'account dell'utente al posto di cancellarlo definitivamente dal sistema, in modo da tenere lo storico e rispettare il diritto all'oblio
    softDelete: async (id) => {
        // Controllo che l'utente sia esistente nel database
        await findUniqueOrThrow(id);

        await db.transaction(async (tx) => {
            // Se l'utente ha una sospensione attiva la chiudo
            const activeSuspension = await suspensionRepository.findActiveByUserId(id, tx);
            if (activeSuspension) {
                await suspensionRepository.endById(activeSuspension.id, tx);
            }

            // Se l'utente ha prenotazioni attive le annullo
            await reservationService.cancelAllActiveByUserId(id, tx);

            // Se l'utente ha token attivi per il setup password o per il reset password li invalido
            await passwordTokenRepository.invalidateAllByUserId(id, tx);

            // Se l'utente ha refresh token attivi li revoco
            await refreshTokenRepository.revokeAllByUserId(id, tx);

            // Eseguo la anonimizzazione dell'account
            await userRepository.softDelete(id, tx);
        })
        return { message: "User anonymized successfully" };
    },

    // Eliminazione totale del profilo utente
    delete: async (id) => {
        await findUniqueOrThrow(id);

        await userRepository.delete(Number(id));
        return { message: "User deleted successfully" };
    }
};