import { roleRepository } from "../repositories/role.repository.js";

export const roleService = {
    getRoles: async () =>
        await roleRepository.findAll()
}