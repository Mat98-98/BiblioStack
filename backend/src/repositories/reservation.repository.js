import { db } from "../db/connection.js";
import { reservations } from "../db/schema.js";
import { eq, and, inArray, or } from "drizzle-orm";
import {EXPIRY_MS, RESERVATION_STATUS} from "../constants.js";

export const reservationRepository = {

    findAll: ({ page, limit }) => {
        const offset = (page - 1) * limit;
        return db.query.reservations.findMany({
            limit,
            offset,
            with: { user: true, work: true },
            orderBy: { reservationDate: "desc" }
        });
    },

    findById: (id) =>
        db.query.reservations.findFirst({
            where: { id },
            with: { user: true, work: true }
        }),

    findQueueByWorkId: (workId) =>
        db.query.reservations.findMany({
            where: { workId, status: RESERVATION_STATUS.PENDING },
            orderBy: { reservationDate: "asc" },
            with: { user: true, work: true }
        }),

    findNextPendingByWorkId: (workId) =>
        db.query.reservations.findFirst({
            where: { workId, status: RESERVATION_STATUS.PENDING },
            orderBy: { reservationDate: "asc" },
            with: { user: true, work: true }
        }),

    findActiveByUserAndWork: (userId, workId) =>
        db.query.reservations.findFirst({
            where: {
                userId,
                workId,
                OR: [
                    { status: { eq: RESERVATION_STATUS.PENDING } },
                    { status: { eq: RESERVATION_STATUS.READY } }
                ]
            }
        }),

    findReadyByItemId: (itemId) =>
        db.query.reservations.findFirst({
            where: {
                assignedItemId: itemId,
                status: RESERVATION_STATUS.READY
            },
            with: { user: true }
        }),

    create: (data) =>
        db.insert(reservations).values(data).returning(),

    update: (id, data) =>
        db.update(reservations).set(data).where(eq(reservations.id, id)).returning(),

    assignItemToReservation: (reservationId, itemId) =>
        db.update(reservations)
            .set({
                assignedItemId: itemId,
                status: RESERVATION_STATUS.READY,
                expiresAt: new Date(Date.now() + EXPIRY_MS)
            })
            .where(eq(reservations.id, reservationId))
            .returning(),

    findExpiredReady: () =>
        db.query.reservations.findMany({
            where: {
                status: RESERVATION_STATUS.READY,
                expiresAt: { lt: new Date() }
            }
        }),

    fulfill: (id) =>
        db.update(reservations).set({ status: RESERVATION_STATUS.FULFILLED }).where(eq(reservations.id, id)).returning(),

    expire: (id) =>
        db.update(reservations).set({ status: RESERVATION_STATUS.EXPIRED }).where(eq(reservations.id, id)).returning(),

    cancel: (id) =>
        db.update(reservations).set({ status: RESERVATION_STATUS.CANCELLED }).where(eq(reservations.id, id)).returning(),

    delete: (id) =>
        db.delete(reservations).where(eq(reservations.id, id)).returning(),
};