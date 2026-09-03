import { db } from "../db/connection.js";
import { reservationRepository } from "../repositories/reservation.repository.js";
import { itemRepository } from "../repositories/item.repository.js";
import { loanRepository } from "../repositories/loan.repository.js";
import { AppError } from "../utils/appError.js";
import { RESERVATION_STATUS, EXPIRY_MS } from "../constants.js";
import { assertNotSuspended } from "../utils/suspension.util.js";
import {NotificationEvent} from "../features/notifications/notification.events.js";
import {notifier} from "../features/notifications/notification.notifier.js";

const findUniqueOrThrow = async (id) => {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) throw new AppError(
        "Reservation not found",
        "NOT_FOUND",
        404);
    return reservation;
};

// Funzione di supporto per riassegnare una copia liberata al prossimo in coda
const reassignFreedItem = async (workId, assignedItemId, tx = db) => {
    if (!assignedItemId) return;

    const nextReservation = await reservationRepository.findQueueByWorkId(workId, { onlyFirst: true }, tx);

    if (nextReservation) {
        // Se c'è qualcuno in coda, gli assegniamo direttamente la copia liberata
        await reservationRepository.assignItemToReservation(
            nextReservation.id,
            assignedItemId,
            tx
        );
    }
    // Se non c'è nessuno in coda, la copia torna semplicemente disponibile (non ha più prenotazioni ready collegate)
};

// Accorpa "cambio stato" + eventuale riassegnazione copia liberata
const closeReservation = async (reservation, closeFn, tx = db) => {
    const result = await closeFn(reservation.id, tx);
    if (reservation.status === RESERVATION_STATUS.READY) {
        await reassignFreedItem(reservation.workId, reservation.assignedItemId, tx);
    }
    return result;
};

export const reservationService = {

    getAll: ({ page, limit }) =>
        reservationRepository.findAll({ page, limit }),

    getById: (id) =>
        findUniqueOrThrow(id),

    create: async (data) => {
        // Controllo che l'utente non sia sospeso
        await assertNotSuspended(data.userId);

        const activeLoan = await loanRepository.findActiveByUserAndWork(data.userId, data.workId);
        if (activeLoan) {
            throw new AppError(
                "User already has an active loan for this work",
                "ALREADY_LOANED", 400
            );
        }

        const existingReservation = await reservationRepository.findActiveByUserAndWork(
            data.userId,
            data.workId
        );
        if (existingReservation) {
            throw new AppError("Double booking is not allowed", "ALREADY_RESERVED", 400);
        }

        const availableItem = await itemRepository.findAvailableByWorkId(data.workId);
        const status = availableItem ? RESERVATION_STATUS.READY : RESERVATION_STATUS.PENDING;

        const reservationData = {
            ...data,
            status: availableItem ? RESERVATION_STATUS.READY : RESERVATION_STATUS.PENDING,
            ...(availableItem && {
                assignedItemId: availableItem.id,
                expiresAt: new Date(Date.now() + EXPIRY_MS)
            })
        };

        // Avvio una transazione per rendere atomici inserimento e notifica in-app
        let newReservation;
        await db.transaction(async (tx) => {
            [newReservation] = await reservationRepository.create(reservationData, tx);

            const eventType = status === RESERVATION_STATUS.READY
                ? NotificationEvent.RESERVATION_READY
                : NotificationEvent.RESERVATION_CREATED;

            // Inviamo la notifica in-app legata alla transazione
            await notifier.send(eventType, {
                user: { id: data.userId },
                reservation: newReservation,
                tx
            });
        });

                return newReservation;
    },

    handleItemCheckIn: async (itemId) => {
        const item = await itemRepository.findById(itemId);
        if (!item) return null;

        const nextReservation = await reservationRepository.findQueueByWorkId(item.workId, { onlyFirst: true });
        if (!nextReservation) return null;

        const [updatedReservation] = await reservationRepository.assignItemToReservation(
            nextReservation.id,
            itemId
        );
        return updatedReservation;
    },

    processExpiredReservations: async () => {
        const expiredReservations = await reservationRepository.findExpiredReady();

        if (expiredReservations.length === 0) return { processed: 0 };

        let processed = 0;

        for (const reservation of expiredReservations) {
            // Avvio una transazione per ogni chiusura, mandando una notifica di prenotazione scaduta
            await db.transaction(async (tx) => {
                await closeReservation(reservation, reservationRepository.expire, tx);

                await notifier.send(NotificationEvent.RESERVATION_EXPIRED, {
                    user: { id: reservation.userId },
                    reservation: reservation,
                    tx
                });
            });
            processed++;
        }
        return { processed };
    },

    processExpiringSoonReservations: async () => {
        // Calcolo il range temporale
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const expiringReservations = await reservationRepository.findExpiringSoon(now, tomorrow);

        if (expiringReservations.length === 0) return { processed: 0 };

        let processed = 0;

        for (const reservation of expiringReservations) {
            await db.transaction(async (tx) => {
                await notifier.send(NotificationEvent.RESERVATION_EXPIRING_SOON, {
                    user: { id: reservation.userId },
                    reservation,
                    tx
                });
            });
            processed++;
        }
        return { processed };
    },

    update: async (id, data, requestingUser) => {
        // Controllo che la prenotazione esista
        const reservation = await findUniqueOrThrow(id);

        // Verifico che il richiedente sia il proprietario della prenotazione o un utente dello staff
        const isOwner = reservation.userId === requestingUser.id;
        const isStaff = ["admin", "librarian"].includes(requestingUser.role);
        if (!isOwner && !isStaff) {
            throw new AppError("Forbidden", "FORBIDDEN", 403);
        }

        // Se è il proprietario ma utente base e fa una richiesta diversa da cancelled blocco la modifica
        if (isOwner && !isStaff && data.status !== "cancelled") {
            throw new AppError("Users can only cancel their own reservations", "FORBIDDEN", 403);
        }

        // Se sto cancellando, uso closeReservation per gestire anche l'eventuale riassegnazione copia
        if (data.status === "cancelled") {
            const [updatedReservation] = await closeReservation(reservation, reservationRepository.cancel);
            return updatedReservation;
        }

        // Eseguo l'aggiornamento
        const [updatedReservation] = await reservationRepository.update(id, data);
        return updatedReservation;
    },

    delete: async (id) => {
        const reservation = await findUniqueOrThrow(id);

        // Se viene eliminata una prenotazione READY, liberiamo la copia per il prossimo in coda
        await closeReservation(reservation, reservationRepository.delete);

        return { message: "Reservation deleted successfully" };
    },

    // Cancella in blocco tutte le prenotazioni attive di un utente (usato dal soft-delete utente)
    cancelAllActiveByUserId: async (userId, tx = db) => {
        return await db.transaction(async (tx) => {
            const activeReservations = await reservationRepository.findActiveByUserId(userId, tx);

            if (activeReservations.length === 0) return { processed: 0 };

            for (const reservation of activeReservations) {
                // Se era READY, liberiamo la copia per il prossimo in coda, dentro la stessa transazione
                if (reservation.status === RESERVATION_STATUS.READY) {
                    await reassignFreedItem(reservation.workId, reservation.assignedItemId, tx);
                }
            }

            await reservationRepository.cancelManyByUserId(userId, tx);
            return { processed: activeReservations.length };
        });
    }
};