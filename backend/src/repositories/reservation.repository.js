import { db } from "../db/connection.js";
import { reservations } from "../db/schema.js";
import { eq, and, inArray, or, gte, lte } from "drizzle-orm";
import { EXPIRY_MS, RESERVATION_STATUS } from "../constants.js";
import { userSelect } from "./presets/user.preset.js";

const ACTIVE_STATUSES = [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.READY];

// Helper interno: tutti gli update "di stato" passano da qui (fulfill/expire/cancel/update/assignItemToReservation)
const updateFields = async (id, fields, tx = db) =>
    await tx.update(reservations).set(fields).where(eq(reservations.id, id)).returning();

export const reservationRepository = {

    findAll: async ({ page, limit }) => {
        const offset = (page - 1) * limit;
        return await db.query.reservations.findMany({
            limit,
            offset,
            with: { user: userSelect.safe, work: true },
            orderBy: { reservationDate: "desc" }
        });
    },

    findById: async (id, tx = db) =>
        await tx.query.reservations.findFirst({
            where: { id },
            with: { user: userSelect.safe, work: true }
        }),


    // tx opzionale perché usata anche dentro reassignFreedItem, che a sua volta può girare in transazione.
    findQueueByWorkId: async (workId, { onlyFirst = false } = {}, tx = db) =>
        await tx.query.reservations[onlyFirst ? "findFirst" : "findMany"]({ // Se si vuole solo il primo risultato passare onlyFirst = true
            where: { workId, status: RESERVATION_STATUS.PENDING },
            orderBy: { reservationDate: "asc" },
            with: { user: userSelect.safe, work: true }
        }),

    findActiveByUserAndWork: async (userId, workId, tx = db) =>
        await tx.query.reservations.findFirst({
            where: {
                userId,
                workId,
                OR: [
                    { status: { eq: RESERVATION_STATUS.PENDING } },
                    { status: { eq: RESERVATION_STATUS.READY } }
                ]
            }
        }),

    findActiveByUserId: async (userId, tx = db) =>
        await tx.query.reservations.findMany({
            where: {
                userId,
                status: { in: ACTIVE_STATUSES }
            }
        }),

    findReadyByItemId: async (itemId, tx = db) =>
        await tx.query.reservations.findFirst({
            where: {
                assignedItemId: itemId,
                status: RESERVATION_STATUS.READY
            },
            with: { user: userSelect.safe },
        }),

    findExpiringSoon: async (startDate, endDate, tx = db) =>
        await tx.query.reservations.findMany({
            where: {
                status: RESERVATION_STATUS.READY, expiresAt: { gte: startDate, lte: endDate },
            }
        }),

    create: async (data, tx = db) =>
        await tx.insert(reservations).values(data).returning(),

    update: (id, data, tx = db) => updateFields(id, data, tx),

    assignItemToReservation: (reservationId, itemId, tx = db) => updateFields(reservationId, {
        assignedItemId: itemId,
        status: RESERVATION_STATUS.READY,
        expiresAt: new Date(Date.now() + EXPIRY_MS)
    }, tx),

    findExpiredReady: async (tx = db) =>
        await tx.query.reservations.findMany({
            where: {
                status: RESERVATION_STATUS.READY,
                expiresAt: { lt: new Date() }
            }
        }),

    fulfill: (id, tx = db) => updateFields(id, { status: RESERVATION_STATUS.FULFILLED }, tx),

    expire: (id, tx = db) => updateFields(id, { status: RESERVATION_STATUS.EXPIRED }, tx),

    cancel: (id, tx = db) => updateFields(id, { status: RESERVATION_STATUS.CANCELLED }, tx),

    cancelManyByUserId: async (userId, tx = db) =>
        await tx
            .update(reservations)
            .set({ status: RESERVATION_STATUS.CANCELLED })
            .where(and(eq(reservations.userId, userId), inArray(reservations.status, ACTIVE_STATUSES)))
            .returning(),

    delete: async (id, tx = db) =>
        await tx.delete(reservations).where(eq(reservations.id, id)).returning(),
};