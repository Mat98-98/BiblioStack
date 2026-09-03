import { loanRepository } from "../repositories/loan.repository.js";
import { itemRepository } from "../repositories/item.repository.js";
import { reservationRepository } from "../repositories/reservation.repository.js";
import { AppError } from "../utils/appError.js";
import { reservationService } from "./reservation.service.js";
import { userRepository } from "../repositories/user.repository.js";
import { notifier } from "../features/notifications/notification.notifier.js";
import { NotificationEvent } from "../features/notifications/notification.events.js";
import { db } from "../db/connection.js";

const findUniqueOrThrow = async (id) => {
    const loan = await loanRepository.findById(id);
    if (!loan) throw new AppError("Loan not found", "NOT_FOUND", 404);
    return loan;
};

// Parsing della data
const toDateOnlyString = (date) => date.toISOString().split("T")[0];

export const loanService = {

    getAll: async ({ page, limit }) =>
        await loanRepository.findAll({ page, limit }),

    getById: async (id) =>
        await findUniqueOrThrow(id),

    search: async (params) =>
      await loanRepository.search(params),

    checkOut: async (data) => {
        // Verifico che la copia e l'utente esistano
        const [item, patron] = await Promise.all([
            itemRepository.findById(data.itemId),
            userRepository.findById(data.userId)
        ]);
        if (!item) throw new AppError("Item not found", "NOT_FOUND", 404);
        if (!patron) throw new AppError("User not found", "NOT_FOUND", 404);

        // Controllo se l'utente è sospeso
        if (patron.suspension) {
            throw new AppError("User is suspended and cannot perform this action", "USER_SUSPENDED", 403);
        }

        // Controllo se la copia è in prestito
        const itemOnLoan = await loanRepository.findActiveByItemId(data.itemId);
        if (itemOnLoan) {
            throw new AppError("This item is still checked out", "CONFLICT", 409);
        }

        // Controllo se la copia è stata prenotata da un'altri utenti, nel caso l'id utente corrisponda con l'utente con lo la prenotazione in stato di ready procedo
        const reservation = await reservationRepository.findReadyByItemId(data.itemId);
        if (reservation && reservation.userId !== data.userId) {
            throw new AppError("Item reserved by another user", "FORBIDDEN", 403);
        }

        // Eseguo il prestito dentro la transazione, così da assicurarmi che anche stato della prenotazione e l'invio della notifica vengano eseguiti correttamente
        let newLoan;
        await db.transaction(async (tx) => {
            [newLoan] = await loanRepository.create(data, tx);

            // Se il libro era prenotato dall'utente stesso, aggiorno lo stato della prenotazione in fullfill
            if (reservation && reservation.userId === data.userId) {
                await reservationRepository.fulfill(reservation.id, tx);
            }

            // Creo la notifica per l'utente
            await notifier.send(NotificationEvent.LOAN_CREATED, {
                user: { id: data.userId },
                loan: newLoan,
                tx
            });
        });
        return await loanRepository.findById(newLoan.id);
    },

    // Registra la riconsegna del libro, chiude il prestito e gestisce la coda prenotazioni
    checkIn: async (id) => {
        const existingLoan = await findUniqueOrThrow(id);

        if (existingLoan.returnDate) {
            throw new AppError("Loan already closed", "BAD_REQUEST", 400);
        }

        await db.transaction(async (tx) => {
            await  loanRepository.update(id, { returnDate: new Date() }, tx);

            // Dopo il check-in, assegna la copia alla prossima prenotazione in coda (se esiste)
            await reservationService.handleItemCheckIn(existingLoan.itemId, tx);
        });

        return await loanRepository.findById(id);
    },

    sendDueSoonReminders: async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dueSoonLoans = await loanRepository.findByDueDateStatus(toDateOnlyString(tomorrow), "eq");

        for (const loan of dueSoonLoans) {
            await db.transaction(async (tx) => {
                await notifier.send(NotificationEvent.LOAN_DUE_SOON, { user: { id: loan.userId }, loan, tx });
            });
        }
        return { processed: dueSoonLoans.length };
    },

    sendOverdueReminders: async () => {
        const today = new Date();

        const overdueLoans = await loanRepository.findByDueDateStatus(toDateOnlyString(today), "lt");

        for (const loan of overdueLoans) {
            await db.transaction(async (tx) => {
                await notifier.send(NotificationEvent.LOAN_OVERDUE, { user: { id: loan.userId }, loan, tx });
            })
        }
        return { processed: overdueLoans.length };
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        await loanRepository.update(id, data);
        return loanRepository.findById(id);
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await loanRepository.delete(id);
        return { message: "Loan successfully deleted" };
    }
};