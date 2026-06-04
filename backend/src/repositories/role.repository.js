import { db } from "../db/connection.js"
import { users, roles } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const roleRepository = {
    findAll: async () =>
        await db.query.roles.findMany(),

    findByName: async (name) =>
        await db.query.roles.findFirst({
            where: {name: name.toLowerCase()}
        }),

    findUserById: async (id) =>
        await db.query.users.findFirst({
            where: {id},
            with: {role: true}
        }),

    updateUserRole: async (userId, roleId) =>
        await db.update(users)
            .set({roleId})
            .where(eq(users.id, userId))
            .returning(),
}