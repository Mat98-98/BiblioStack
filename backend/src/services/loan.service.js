import { loanRepository } from "../repositories/loan.repository.js";
import { itemRepository } from "../repositories/item.repository.js";
import { reservationRepository } from "../repositories/reservation.repository.js";
import { AppError } from "../utils/appError.js";
import { reservationService } from "./reservation.service.js";
import { RESERVATION_STATUS } from "../constants.js";

const findUniqueOrThrow = async (id) => {
    const loan = await loanRepository.findById(id);
    if (!loan) throw new AppError("Loan not found", "NOT_FOUND", 404);
    return loan;
};

export const loanService = {

    getAll: async ({ page, limit }) =>
        await loanRepository.findAll({ page, limit }),

    getById: async (id) =>
        await findUniqueOrThrow(id),

    checkOut: async (data) => {
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

        // Eseguo il prestito
        const [newLoan] = await loanRepository.create(data);

        // Se il libro era prenotato dall'utente stesso, aggiorno lo stato della prenotazione in fullfill
        if (reservation && reservation.userId === data.userId) {
            await reservationRepository.fulfill(reservation.id);
        }

        return loanRepository.findById(newLoan.id);
    },

    // Registra la riconsegna del libro, chiude il prestito e gestisce la coda prenotazioni
    checkIn: async (id) => {
        const existingLoan = await findUniqueOrThrow(id);

        if (existingLoan.returnDate) {
            throw new AppError("Loan already closed", "BAD_REQUEST", 400);
        }

        const [updatedLoan] = await loanRepository.update(id, {
            returnDate: new Date()
        });

        // Dopo il check-in, assega la copia alla prossima prenotazione in coda (se esiste)
        await reservationService.handleItemCheckIn(updatedLoan.itemId);

        return updatedLoan;
    },

    update: async (id, data) => {
        await findUniqueOrThrow(id);
        const [updatedLoan] = await loanRepository.update(id, data);
        return updatedLoan;
    },

    delete: async (id) => {
        await findUniqueOrThrow(id);
        await loanRepository.delete(id);
        return { message: "Loan successfully deleted" };
    }
};