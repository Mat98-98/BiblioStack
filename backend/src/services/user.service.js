import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";
import { DEFAULT_USER_ROLE_ID } from "../constants.js";
import bcrypt from "bcrypt";

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

    createByAdmin: async ({ email, password, firstName, lastName, phone, roleId }) => {
        const existing = await userRepository.findByEmail(email);
        if (existing) throw new AppError("Email already exists", "EMAIL_ALREADY_EXISTS", 409);

        const passwordHash = await bcrypt.hash(password, 12);

        const [user] = await userRepository.create({
            email,
            firstName,
            lastName,
            phone,
            passwordHash,
            roleId: roleId ?? DEFAULT_USER_ROLE_ID
        });

        return userRepository.findById(user.id);
    },


    update: async (id, data) => {
        await findUniqueOrThrow(id);

        const [updatedUser] = await userRepository.update(id, data);
        return updatedUser;
        },

    delete: async (id) => {
        await findUniqueOrThrow(id);

        await userRepository.delete(Number(id));
        return { message: "User deleted successfully" };
    }
};

/* Alternativa search
    search: async ({ name, email }) => {
        //if (!email && !name) throw new AppError("Query parameter is required", "MISSING_QUERY_PARAM", 400);
        if (email) return userService.getByEmail(email);
        if (name) return userService.getByName(name);
    },
*/