import { reservationRepository } from "../repositories/reservation.repository.js";
import { itemRepository } from "../repositories/item.repository.js";
import { loanRepository } from "../repositories/loan.repository.js";
import { AppError } from "../utils/appError.js";
import { RESERVATION_STATUS, EXPIRY_MS } from "../constants.js";
import {assertNotSuspended} from "../utils/suspension.util.js";

const findUniqueOrThrow = async (id) => {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) throw new AppError(
        "Reservation not found",
        "NOT_FOUND",
        404);
    return reservation;
};

// Funzione di supporto per riassegnare una copia liberata al prossimo in coda
const reassignFreedItem = async (workId, assignedItemId) => {
    if (!assignedItemId) return;

    const nextReservation = await reservationRepository.findNextPendingByWorkId(workId);

    if (nextReservation) {
        // Se c'è qualcuno in coda, gli assegniamo direttamente la copia liberata
        await reservationRepository.assignItemToReservation(
            nextReservation.id,
            assignedItemId
        );
    }
    // Se non c'è nessuno in coda, la copia torna semplicemente disponibile (non ha più prenotazioni ready collegate)
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

        const reservationData = {
            ...data,
            status: availableItem ? RESERVATION_STATUS.READY : RESERVATION_STATUS.PENDING,
            ...(availableItem && {
                assignedItemId: availableItem.id,
                expiresAt: new Date(Date.now() + EXPIRY_MS)
            })
        };

        const [newReservation] = await reservationRepository.create(reservationData);
        return newReservation;
    },

    handleItemCheckIn: async (itemId) => {
        const item = await itemRepository.findById(itemId);
        if (!item) return null;

        const nextReservation = await reservationRepository.findNextPendingByWorkId(item.workId);
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
            await reservationRepository.expire(reservation.id);

            // Riassegna la copia liberata per scadenza al prossimo in coda
            await reassignFreedItem(reservation.workId, reservation.assignedItemId);

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

        // Eseguo l'aggiornameno
        const [updatedReservation] = await reservationRepository.update(id, data);

        // SE la prenotazione è stata appena impostata su "cancelled" ED aveva una copia assegnata (era READY)
        if (data.status === "cancelled" && reservation.status === RESERVATION_STATUS.READY) {
            await reassignFreedItem(reservation.workId, reservation.assignedItemId);
        }

        return updatedReservation;
    },

    delete: async (id) => {
        const reservation = await findUniqueOrThrow(id);
        await reservationRepository.delete(id);

        // Se veniva eliminata una prenotazione READY, liberiamo la copia per il prossimo in coda
        if (reservation.status === RESERVATION_STATUS.READY) {
            await reassignFreedItem(reservation.workId, reservation.assignedItemId);
        }

        return { message: "Reservation deleted successfully" };
    }
};
/*
import { reservationRepository } from "../repositories/reservation.repository.js";
import { itemRepository } from "../repositories/item.repository.js";
import { loanRepository } from "../repositories/loan.repository.js";
import { AppError } from "../utils/appError.js";
import { RESERVATION_STATUS, EXPIRY_MS } from "../constants.js";

const findUniqueOrThrow = async (id) => {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) throw new AppError(
        "Reservation not found",
        "NOT_FOUND",
        404);
    return reservation;
};


export const reservationService = {

    getAll: ({ page, limit }) =>
        reservationRepository.findAll({ page, limit }),

    getById: (id) =>
        findUniqueOrThrow(id),

    create: async (data) => {
        // Controllo che la l'utente non abbia già prenotato l'opera
        const activeLoan = await loanRepository.findActiveByUserAndWork(data.userId, data.workId);
        if (activeLoan) {
            throw new AppError(
                "User already has an active loan for this work",
                "ALREADY_LOANED", 400
            );
        }

        // Verifico se l'utente ha già una prenotazione pending o ready per quest'opera
        const existingReservation = await reservationRepository.findActiveByUserAndWork(
            data.userId,
            data.workId
        );
        if (existingReservation) {
            throw new AppError("Double booking is not allowed", "ALREADY_RESERVED", 400);
        }

        // Controllo se c'è una copia disponibile. Se sì → ready, altrimenti → pending
        const availableItem = await itemRepository.findAvailableByWorkId(data.workId);

        const reservationData = {
            ...data,
            status: availableItem ? RESERVATION_STATUS.READY : RESERVATION_STATUS.PENDING,
            ...(availableItem && {
                assignedItemId: availableItem.id,
                expiresAt: new Date(Date.now() + EXPIRY_MS)
            })
        };

        const [newReservation] = await reservationRepository.create(reservationData);
        return newReservation;
    },

    // Chiamato da loanService.checkIn — assegna il prossimo in coda dopo il rientro di un libro
    handleItemCheckIn: async (itemId) => {
        const item = await itemRepository.findById(itemId);
        if (!item) return null;

        const nextReservation = await reservationRepository.findNextPendingByWorkId(item.workId);
        if (!nextReservation) return null;

        const [updatedReservation] = await reservationRepository.assignItemToReservation(
            nextReservation.id,
            itemId
        );
        return updatedReservation;
    },

    // Gestisce le prenotazioni scadute utilizzando il chronJob in ../features/reservationExpiry
    processExpiredReservations: async () => {
        const expiredReservations = await reservationRepository.findExpiredReady();

        if (expiredReservations.length === 0) return { processed: 0 };

        let processed = 0;

        for (const reservation of expiredReservations) {
            await reservationRepository.expire(reservation.id);

            const nextReservation = await reservationRepository.findNextPendingByWorkId(
                reservation.workId
            );

            if (nextReservation && reservation.assignedItemId) {
                await reservationRepository.assignItemToReservation(
                    nextReservation.id,
                    reservation.assignedItemId
                );
            }

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

        // Se è il proprietario ma fa una richiesta diversa da cancelled blocco la modifica
        if (isOwner && !isStaff && data.status !== "cancelled") {
            throw new AppError("Users can only cancel their own reservations", "FORBIDDEN", 403);
        }

        // In caso sia il proprietario o utente staff procedo con l'aggiornamento
        const [updatedReservation] = await reservationRepository.update(id, data);
        return updatedReservation;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await reservationRepository.delete(id);
        return { message: "Reservation deleted successfully" };
    }
};
*/