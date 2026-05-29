import { loanService } from "../services/loan.service.js";
import { LoanBaseDTO, LoanBaseListDTO, LoanDetailDTO } from "../dto/loan.dto.js";
import { CreateLoanSchema, UpdateLoanSchema } from "../schemas/loan.schema.js";

export const loanController = {

    getAll: async (req, res, next) => {
        try {
            const loans = await loanService.getAll(req.pagination);
            const data = LoanBaseListDTO.parse(loans);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const loan = await loanService.getById(req.params.id);
            res.json(LoanDetailDTO.parse(loan));
        } catch (error) {
            next(error);
        }
    },

    checkOut: async (req, res, next) => {
        try {
            const validatedData = CreateLoanSchema.parse(req.body);

            const newLoan = await loanService.checkOut(validatedData);

            res.status(201).json(LoanBaseDTO.parse(newLoan));
        } catch (error) {
            next(error);
        }
    },

    checkIn: async (req, res, next) => {
        try {
            const updatedLoan = await loanService.checkIn(Number(req.params.id));
            res.json(LoanBaseDTO.parse(updatedLoan));
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            // Validazioni dati in ingresso
            const validatedData = UpdateLoanSchema.parse(req.body);

            const updatedLoan = await loanService.update(req.params.id, validatedData);

            res.json(LoanBaseDTO.parse(updatedLoan));
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await loanService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}