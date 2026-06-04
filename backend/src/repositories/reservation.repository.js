import { db } from "../db/connection.js";
import { reservations } from "../db/schema.js";
import { eq, and, inArray, or } from "drizzle-orm";
import {EXPIRY_MS, RESERVATION_STATUS} from "../constants.js";

export const reservationRepository = {

    findAll: async ({ page, limit }) => {
        const offset = (page - 1) * limit;
        return await db.query.reservations.findMany({
            limit,
            offset,
            with: { user: true, work: true },
            orderBy: { reservationDate: "desc" }
        });
    },

    findById: async (id) =>
        await db.query.reservations.findFirst({
            where: { id },
            with: { user: true, work: true }
        }),

    findQueueByWorkId: async (workId) =>
        await db.query.reservations.findMany({
            where: { workId, status: RESERVATION_STATUS.PENDING },
            orderBy: { reservationDate: "asc" },
            with: { user: true, work: true }
        }),

    findNextPendingByWorkId: async (workId) =>
        await db.query.reservations.findFirst({
            where: { workId, status: RESERVATION_STATUS.PENDING },
            orderBy: { reservationDate: "asc" },
            with: { user: true, work: true }
        }),

    findActiveByUserAndWork: async (userId, workId) =>
        await db.query.reservations.findFirst({
            where: {
                userId,
                workId,
                OR: [
                    { status: { eq: RESERVATION_STATUS.PENDING } },
                    { status: { eq: RESERVATION_STATUS.READY } }
                ]
            }
        }),

    findReadyByItemId: async (itemId) =>
        await db.query.reservations.findFirst({
            where: {
                assignedItemId: itemId,
                status: RESERVATION_STATUS.READY
            },
            with: { user: true }
        }),

    create: async (data) =>
        await db.insert(reservations).values(data).returning(),

    update: async (id, data) =>
        await db.update(reservations).set(data).where(eq(reservations.id, id)).returning(),

    assignItemToReservation: async (reservationId, itemId) =>
        await db.update(reservations)
            .set({
                assignedItemId: itemId,
                status: RESERVATION_STATUS.READY,
                expiresAt: new Date(Date.now() + EXPIRY_MS)
            })
            .where(eq(reservations.id, reservationId))
            .returning(),

    findExpiredReady: async () =>
        await db.query.reservations.findMany({
            where: {
                status: RESERVATION_STATUS.READY,
                expiresAt: { lt: new Date() }
            }
        }),

    fulfill: async (id) =>
        await db.update(reservations).set({ status: RESERVATION_STATUS.FULFILLED }).where(eq(reservations.id, id)).returning(),

    expire: async (id) =>
        await db.update(reservations).set({ status: RESERVATION_STATUS.EXPIRED }).where(eq(reservations.id, id)).returning(),

    cancel: async (id) =>
        await db.update(reservations).set({ status: RESERVATION_STATUS.CANCELLED }).where(eq(reservations.id, id)).returning(),

    delete: async (id) =>
        await db.delete(reservations).where(eq(reservations.id, id)).returning(),
};