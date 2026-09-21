import { db } from "../db/connection.js";
import {reservations, works} from "../db/schema.js";
import {eq, and, inArray, gte, lte, ilike, asc, desc} from "drizzle-orm";
import { RESERVATION_STATUS } from "../constants.js";
import { userSelect } from "./presets/user.preset.js";
import { normalizeSearch } from "../utils/search.util.js";

const ACTIVE_STATUSES = [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.READY];

// Helper interno per tutti gli aggiornamenti condizionati dallo stato
const updateFields = async (id, fields, tx = db) =>
    await tx.update(reservations).set(fields).where(eq(reservations.id, id)).returning();

const transitionStatus = async (id, expectedStatus, fields, tx = db) =>
    tx.update(reservations)
        .set(fields)
        .where(and(
            eq(reservations.id, id),
            eq(reservations.status, expectedStatus)
        )).returning();

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

    assignItemToReservation: (reservationId, itemId, expiresAt, tx = db) =>
        transitionStatus(
            reservationId,
            RESERVATION_STATUS.PENDING,
            {
                    assignedItemId: itemId,
                status: RESERVATION_STATUS.READY,
                expiresAt
                },
            tx
        ),

    findExpiredReady: async (now, tx = db) =>
        await tx.query.reservations.findMany({
            where: {
                status: RESERVATION_STATUS.READY,
                expiresAt: { lt: now }
            }
        }),

    fulfill: (id, tx = db) =>
        transitionStatus(
            id, RESERVATION_STATUS.READY,
            { status: RESERVATION_STATUS.FULFILLED },
            tx
        ),

    expire: (id, tx = db) =>
        transitionStatus(
            id,
            RESERVATION_STATUS.READY,
            { status: RESERVATION_STATUS.EXPIRED },
            tx
        ),

    cancel: (id, tx = db) =>
        tx.update(reservations)
            .set({ status: RESERVATION_STATUS.CANCELLED })
            .where(and(
                eq(reservations.id, id),
                inArray(reservations.status, [
                    RESERVATION_STATUS.PENDING,
                    RESERVATION_STATUS.READY
                ])
            )).returning(),

    cancelManyByUserId: async (userId, tx = db) =>
        await tx
            .update(reservations)
            .set({ status: RESERVATION_STATUS.CANCELLED })
            .where(and(eq(reservations.userId, userId), inArray(reservations.status, ACTIVE_STATUSES)))
            .returning(),

    delete: async (id, tx = db) =>
        await tx.delete(reservations)
            .where(and(
                eq(reservations.id, id),
                inArray(reservations.status, [
                    RESERVATION_STATUS.PENDING,
                    RESERVATION_STATUS.READY,
                ])
            )).returning(),

    search: async ({ page, limit, search, status, sortOrder, userId }) => {
        const offset = (page - 1) * limit;

        // Parsing della stringa in ingresso
        const { pattern, isEmpty } = normalizeSearch(search ?? "");

        const base = db
            .select({ id: reservations.id })
            .from(reservations)
            .leftJoin(works, eq(works.id, reservations.workId))
            .$dynamic();

        const conditions = [];

        if (!isEmpty) {
            conditions.push(ilike(works.title, pattern));
        }

        if (status && status !== "all") {
            conditions.push(eq(reservations.status, status));
        }

        if (userId) {
            conditions.push(eq(reservations.userId, userId));
        }

        if (conditions.length > 0) {
            base.where(and(...conditions));
        }

        // Ordinamento dati (la whitelist dei parametri è stata fatta nello schema zod per evitare injections)
        const orderFn = sortOrder === "asc" ? asc : desc;

        base.orderBy(
            orderFn(reservations.reservationDate),
            asc(reservations.id)
        );

        const paged = await base.limit(limit).offset(offset);

        if (paged.length === 0) return [];

        const ids = paged.map(r => r.id);

        // Fetch completo con relazioni
        const full = await db.query.reservations.findMany({
            where: { id: { in: ids } },
            with: {
                user: { columns: userSelect.mini },
                work: { columns: { id: true, title:true }},
                assignedItem: {
                    columns: { id: true },
                    with: {
                        location: {
                            with: {
                                school: true
                            }
                        }
                    }
                }
            }
        });

        const map = new Map(full.map(r => [r.id, r]));
        return ids.map(id => map.get(id)).filter(Boolean);
    }
};