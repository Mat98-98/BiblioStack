import { z } from 'zod';
import { UserMiniDTO } from "./shared.dto.js";

// Costruisco i DTO di supporto per la risposta
const ItemSchema = z.object({
    id: z.string(),
    work: z.object({
        title: z.string()
    })
});

const NoticeSchema = z.object({
    id: z.number(),
    description: z.string().nullable(),
    issuedAt: z.date()
});

// Costruisco il core del DTO

const LoanCore = z.object({
    id: z.number(),
    loanDate: z.date(),
    dueDate: z.date().nullable(),
    returnDate: z.date().nullable()
});

// DTO base

export const LoanBaseDTO = LoanCore.extend({
    item: ItemSchema,
    patron: UserMiniDTO,
    librarian: UserMiniDTO,
});

export const LoanBaseListDTO = z.array(LoanBaseDTO);

// DTO dettagliato

export const LoanDetailDTO = LoanCore.extend({
    item: ItemSchema,
    patron: UserMiniDTO,
    librarian: UserMiniDTO,
    notices: z.array(NoticeSchema).default([])
});