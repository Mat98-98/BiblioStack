import { db } from "../db/connection.js"
import { users, roles } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const roleRepository = {
    findAll: () =>
        db.query.roles.findMany(),

    findByName: (name) =>
        db.query.roles.findFirst({
            where: {name: name.toLowerCase()}
        }),

    findUserById: (id) =>
        db.query.users.findFirst({
            where: {id},
            with: {role: true}
        }),

    updateUserRole: (userId, roleId) =>
        db.update(users)
            .set({roleId})
            .where(eq(users.id, userId))
            .returning(),
}