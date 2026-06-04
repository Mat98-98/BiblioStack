import { loans, items } from "../db/schema.js";
import { db } from "../db/connection.js";
import { eq, isNull, and } from "drizzle-orm";
import { userSelect } from "./presets/user.preset.js";

export const loanRepository = {

    findAll: async ({ page, limit }) => {
        const offset = (page - 1) * limit;
        return await db.query.loans.findMany({
            limit,
            offset,
            with: {
                item: true,
                patron: { columns: userSelect.safe },
                librarian: { columns: userSelect.safe }
            },
            orderBy: { loanDate: "desc" }
        });
    },

    findById: async (id) =>
        await db.query.loans.findFirst({
            where: { id },
            with: {
                item: true,
                patron: { columns: userSelect.safe },
                librarian: { columns: userSelect.safe },
                notices: true
            }
        }),

    findActiveByItemId: async (itemId) =>
        await db.query.loans.findFirst({
            where: {
                itemId,
                returnDate: { isNull: true }
            }
        }),

    findActiveByUserAndWork: async (userId, workId) => {
        const loan = await db.query.loans.findFirst({
            where: {
                userId,
                returnDate: { isNull: true }
            },
            with: { item: true }
        });
        return loan?.item?.workId === workId ? loan : null;
    },

    create: async (data) =>
        await db.insert(loans).values(data).returning(),

    update: async (id, data) =>
        await db.update(loans).set(data).where(eq(loans.id, id)).returning(),

    delete: (id) =>
        db.delete(loans).where(eq(loans.id, id)).returning(),
};