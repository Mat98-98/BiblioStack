import { roleService } from "../services/role.service.js";

export const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getRoles();
        res.json({ roles });
    } catch (err) {
        next(err);
    }
};