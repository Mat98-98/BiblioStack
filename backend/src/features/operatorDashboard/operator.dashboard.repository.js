import { db } from "../../db/connection.js";
import { count, isNull, and, lte } from "drizzle-orm";
import { itemAvailability, items, loans, users } from "../../db/schema.js";
import { userSelect } from "../../repositories/presets/user.preset.js";


export const operatorDashboardRepository = {
    getStats: async () => {
        const today = new Date().toISOString().split('T')[0];

        const [
            [{ value: activeLoans }],
            [{ value: overdueLoans }],
            [{ value: availableItems }],
            [{ value: totalItems }],
            [{ value: totalUsers }],
        ] = await Promise.all([
            db.select({ value: count() }).from(loans).where(isNull(loans.returnDate)),
            db.select({ value: count() }).from(loans).where(and(isNull(loans.returnDate), lte(loans.dueDate, today))),
            db.select({ value: count() }).from(itemAvailability),
            db.select({ value: count() }).from(items),
            db.select({ value: count() }).from(users).where(isNull(users.deletedAt))
        ]);

        return { activeLoans, overdueLoans, availableItems, totalItems, totalUsers };
    },

    getRecentNotices: async (limit) =>
        await db.query.notices.findMany({
            limit,
            with: {
                user: { columns: userSelect.mini },
                type: true
            },
            orderBy: { issuedAt: "desc"}
        })
};