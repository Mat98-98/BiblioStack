import { roleRepository } from "../repositories/role.repository.js"
import { AppError } from "../utils/appError.js"
import { ROLE_HIERARCHY } from "../constants.js"
import {userRepository} from "../repositories/user.repository.js";

const getRank = (roleName) => ROLE_HIERARCHY.indexOf(roleName)

const findRoleOrThrow = async (name) => {
    const role = await roleRepository.findByName(name)
    if (!role) throw new AppError("Role not found", "NOT_FOUND", 404)
    return role
}

const findUserOrThrow = async (id) => {
    const user = await roleRepository.findUserById(id)
    if (!user) throw new AppError("User not found", "NOT_FOUND", 404)
    return user
}

export const roleService = {
    getRoles: () =>
        roleRepository.findAll(),

    promoteUser: async (userId, newRole) => {
        const [role, user] = await Promise.all([
            findRoleOrThrow(newRole),
            findUserOrThrow(userId),
        ])

        if (getRank(role.name) <= getRank(user.role.name))
            throw new AppError("Invalid promotion", "INVALID_ACTION", 400)

        await roleRepository.updateUserRole(userId, role.id)
        return userRepository.findById(userId)
    },

    demoteUser: async (userId, newRole) => {
        const [role, user] = await Promise.all([
            findRoleOrThrow(newRole),
            findUserOrThrow(userId),
        ])

        if (getRank(role.name) >= getRank(user.role.name))
            throw new AppError("Invalid demotion", "INVALID_ACTION", 400)

        await roleRepository.updateUserRole(userId, role.id)
        return userRepository.findById(userId)
    },
}