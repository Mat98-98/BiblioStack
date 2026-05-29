import { roleService } from "../services/role.service.js";
import {ChangeRoleSchema} from "../schemas/role.schema.js";
import {UserBaseDTO} from "../dto/user.dto.js";

export const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getRoles();
        res.json({ roles });
    } catch (err) {
        next(err);
    }
};

export const promoteUser = async (req, res, next) => {
    try {
        const { userId, newRole } = ChangeRoleSchema.parse(req.body)
        const updatedUser = await roleService.promoteUser(userId, newRole)
        res.json({ code: "SUCCESS", user: UserBaseDTO.parse(updatedUser) })
    } catch (err) {
        next(err)
    }
}

export const demoteUser = async (req, res, next) => {
    try {
        const { userId, newRole } = ChangeRoleSchema.parse(req.body)
        const updatedUser = await roleService.demoteUser(userId, newRole)
        res.json({ code: "SUCCESS", user: UserBaseDTO.parse(updatedUser) })
    } catch (err) {
        next(err)
    }
};