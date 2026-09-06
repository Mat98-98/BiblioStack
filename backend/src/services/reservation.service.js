import { db } from "../db/connection.js";
import { reservationRepository } from "../repositories/reservation.repository.js";
import { itemRepository } from "../repositories/item.repository.js";
import { loanRepository } from "../repositories/loan.repository.js";
import { AppError } from "../utils/appError.js";
import { RESERVATION_STATUS, EXPIRY_MS } from "../constants.js";
import { assertNotSuspended } from "../utils/suspension.util.js";
import { NotificationEvent } from "../features/notifications/notification.events.js";
import { notifier } from "../features/notifications/notification.notifier.js";
import {isUniqueViolation} from "../utils/db.util.js";
import {workRepository} from "../repositories/work.repository.js";

const findUniqueOrThrow = async (id) => {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) throw new AppError(
        "Reservation not found",
        "NOT_FOUND",
        404);
    return reservation;
};

const noop = async () => {};

// Assegna una copia liberata alla prenotazione data in input e notifica l'utente
const assignItemAndNotify = async (nextReservation, itemId, tx) => {
    const expiresAt = new Date (Date.now() + EXPIRY_MS);
    const result = await reservationRepository.assignItemToReservation(
        nextReservation.id,
        itemId,
        expiresAt,
        tx);

    // Se il risultato è 0 (non è stata fatta alcuna modifica) un altro processo ha già modificato la prenotazione nel frattempo, quindi non ci sono notifiche da mandare
    if (result.length === 0) return null;

    const [updatedReservation] = result;

    const sendEmail = await notifier.send(NotificationEvent.RESERVATION_READY, {
        user: nextReservation.user ?? { id: nextReservation.userId },
        reservation: updatedReservation,
        tx
    });
    return { reservation: updatedReservation, sendEmail };
};

// Cerca il prossimo in coda (pending) per un'opera, se esiste gli assegna la copia appena liberata, altrimenti ritorna null
const reassignFreedItem = async (workId, assignedItemId, tx = db) => {
    if (!assignedItemId) return null;

    const nextReservation = await reservationRepository.findQueueByWorkId(workId, { onlyFirst: true }, tx);

    if (!nextReservation) return null;  // Se non c'è nessuno in coda, la copia torna semplicemente disponibile (non ha più prenotazioni ready collegate)

    // Se c'è qualcuno in coda, gli assegniamo direttamente la copia liberata
    return assignItemAndNotify(nextReservation, assignedItemId, tx);

};

// Gestisce la chiusura della prenotazione e la riassegnazione dell'eventuale copia associata (se prenotata passa al prossimo in coda)
const closeReservation = async (reservation, closeFn, tx = db) => {
    const result = await closeFn(reservation.id, tx);

    if (result.length === 0 ) {
        return { result, sendEmail: noop}
    }

    let sendEmail = noop;
    if (reservation.status === RESERVATION_STATUS.READY && reservation.assignedItemId) {
        const reassigned = await reassignFreedItem(reservation.workId, reservation.assignedItemId, tx);
        if (reassigned) sendEmail = reassigned.sendEmail;
    }
    return { result, sendEmail };
};

export const reservationService = {

    getAll: ({ page, limit }) =>
        reservationRepository.findAll({ page, limit }),

    getById: (id) =>
        findUniqueOrThrow(id),

    // Crea una nuova prenotazione, ready se c'è una copia libera altrimenti pending
    create: async (data) => {
        // Controllo che l'utente non sia sospeso
        await assertNotSuspended(data.userId);

        // Avvio una transazione per rendere atomici inserimento e notifica in-app
        let newReservation;
        let sendEmail = noop;

        try {
            await db.transaction(async (tx) => {
                // Controllo che l'opera esista
                const work = await workRepository.findById(data.workId, tx);
                if(!work) throw new AppError("Work not found", "NOT_FOUND", 404);

                // Controllo che l'utente non abbia prestiti attivi relativi all'opera
                const activeLoan = await loanRepository.findActiveByUserAndWork(
                    data.userId,
                    data.workId,
                    tx);
                if (activeLoan) {
                    throw new AppError(
                        "User already has an active loan for this work",
                        "ALREADY_LOANED", 400
                    );
                }

                // Controllo che l'utente non abbia prenotazioni attive per quest'opera
                const existingReservation = await reservationRepository.findActiveByUserAndWork(
                    data.userId,
                    data.workId,
                    tx
                );
                if (existingReservation) {
                    throw new AppError("Double booking is not allowed", "ALREADY_RESERVED", 400);
                }

                // Controllo se ci sono copie disponibili per l'opera
                const availableItem = await itemRepository.findAvailableByWorkId(data.workId, tx);
                const status = availableItem ? RESERVATION_STATUS.READY : RESERVATION_STATUS.PENDING;

                const reservationData = {
                    ...data,
                    status,
                    ...(availableItem && {
                        assignedItemId: availableItem.id,
                        expiresAt: new Date(Date.now() + EXPIRY_MS)
                    })
                };

                [newReservation] = await reservationRepository.create(reservationData, tx);

                const eventType = status === RESERVATION_STATUS.READY
                    ? NotificationEvent.RESERVATION_READY
                    : NotificationEvent.RESERVATION_CREATED;

                // La notifica in-app viene salvata nella stessa transazione, mentre l'email viene preparata per essere inviata dopo il commit
                sendEmail = await notifier.send(eventType, {
                    user: { id: data.userId },
                    reservation: newReservation,
                    tx
                });
            });
        } catch (error) {
            if (isUniqueViolation(error) && error.constraint === "reservations_user_work_active_unique") {
                throw new AppError(
                    "User already has an active reservation for this work",
                    "ALREADY_RESERVED",
                    400
                );
            }
            throw error;
        }
        // Email dopo il commit
        await sendEmail();
        return newReservation;
    },

    // Chiamata dal check-in di un prestito. Se qualcuno era in coda per l'opera gli assegno la copia appena rientrata
    handleItemCheckIn: async (itemId, tx = db) => {
        const item = await itemRepository.findById(itemId, tx);
        if (!item) return null;

        const nextReservation = await reservationRepository.findQueueByWorkId(item.workId, { onlyFirst: true }, tx);
        if (!nextReservation) return null;

        return assignItemAndNotify(nextReservation, itemId, tx);
    },

    // Assegna lo stato expired alle prenotazioni non ritirate e riassegna l'eventuale copia al prossimo in coda
    processExpiredReservations: async () => {
        const now = new Date();
        const expiredReservations = await reservationRepository.findExpiredReady(now);

        if (expiredReservations.length === 0) return { processed: 0 };

        let processed = 0;

        for (const reservation of expiredReservations) {
            let sendExpiredMail = noop;
            let sendReadyEmail = noop;
            let wasProcessed = false;

            // Avvio una transazione per ogni chiusura, mandando una notifica di prenotazione scaduta
            await db.transaction(async (tx) => {
                const closeResult = await closeReservation(reservation, reservationRepository.expire, tx);

                // Controllo se sono effettivamente state fatte modifiche, altrimenti un altro processo le ha già fatte e non notifico l'utente nuovamente
                if (closeResult.result.length === 0) return;

                wasProcessed = true;
                sendReadyEmail = closeResult.sendEmail;

                sendExpiredMail = await notifier.send(NotificationEvent.RESERVATION_EXPIRED, {
                    user: { id: reservation.userId },
                    reservation,
                    tx
                });
            });
            // Email dopo il commit
            await sendExpiredMail();
            await sendReadyEmail();
            if (wasProcessed) {
                processed++;
            }
        }
        return { processed };
    },

    // Avvisa chi ha una prenotazione in stato ready che sta per scadere (minimo 24 ore prima)
    processExpiringSoonReservations: async () => {
        // Calcolo il range temporale
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const expiringReservations = await reservationRepository.findExpiringSoon(now, tomorrow);

        if (expiringReservations.length === 0) return { processed: 0 };

        let processed = 0;
        for (const reservation of expiringReservations) {
            let sendEmail = noop;
            await db.transaction(async (tx) => {
                sendEmail = await notifier.send(NotificationEvent.RESERVATION_EXPIRING_SOON, {
                    user: { id: reservation.userId },
                    reservation,
                    tx
                });
            });
            // Email dopo il commit
            await sendEmail();
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
        if (isOwner && !isStaff && data.status !== RESERVATION_STATUS.CANCELLED) {
            throw new AppError("Users can only cancel their own reservations", "FORBIDDEN", 403);
        }

        // Se sto cancellando, uso closeReservation per gestire anche l'eventuale riassegnazione copia
        if (data.status === RESERVATION_STATUS.CANCELLED) {
            let updatedReservation;
            let sendEmail = noop;

            await db.transaction(async (tx) => {
                const closeResult = await closeReservation(reservation, reservationRepository.cancel, tx);
                [updatedReservation] = closeResult.result;
                sendEmail = closeResult.sendEmail;
            });
            // Email dopo il commit
            await sendEmail();
            return updatedReservation;
        }

        // Eseguo l'aggiornamento
        const [updatedReservation] = await reservationRepository.update(id, data);
        return updatedReservation;
    },

    delete: async (id) => {
        const reservation = await findUniqueOrThrow(id);

        // Se viene eliminata una prenotazione READY, liberiamo la copia per il prossimo in coda
        let sendEmail = noop;
        await db.transaction(async (tx) => {
                const closeResult = await closeReservation(reservation, reservationRepository.delete, tx);
                sendEmail = closeResult.sendEmail;
        });
        // Email dopo il commit
        await sendEmail();
        return { message: "Reservation deleted successfully" };
    },

    // Cancella in blocco tutte le prenotazioni attive di un utente (usato dal soft-delete utente)
    cancelAllActiveByUserId: async (userId, tx = db) => {
        const activeReservations = await reservationRepository.findActiveByUserId(userId, tx);
        if (activeReservations.length === 0) return { processed: 0, sendEmails: [] };

        // Cancello tutte le prenotazioni attive dell'utente dato in input, in questo modo nessuna di esse è in ready e quindi la riassegnazione successiva non trova conflitti sullo unique index
        await reservationRepository.cancelManyByUserId(userId, tx);

        // Riassegno le copie tenute da prenotazioni ready al prossimo utente in coda
        const sendEmails = [];
        for (const reservation of activeReservations) {
            if (reservation.status === RESERVATION_STATUS.READY) {
                const reassigned = await reassignFreedItem(reservation.workId, reservation.assignedItemId, tx);
                if (reassigned) sendEmails.push(reassigned.sendEmail);
            }
        }


        return { processed: activeReservations.length, sendEmails };
    }
};