import { userRepository } from "../repositories/user.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
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

    delete: async (id) => {
        await findUniqueOrThrow(id);

        await userRepository.delete(Number(id));
        return { message: "User deleted successfully" };
    }
};