import { z } from 'zod';
import {UserMiniDTO} from "./shared.dto.js";

// DTO di supporto

const LoanSchema = z.object({
    id: z.number()
})

const NoticeTypeSchema = z.object({
    id: z.number(),
    name: z.string()
})

// Costruisco il core del DTO
const NoticeCore = z.object({
    id: z.number(),
    type: NoticeTypeSchema,
    issuedAt: z.date()
})

// DTO base
export const NoticeBaseDTO = NoticeCore.extend({
    loan: LoanSchema,
    user: UserMiniDTO,
})

export const NoticeBaseListDTO = z.array(NoticeBaseDTO);

// DTO dettagliato
export const NoticeDetailDTO = NoticeCore.extend({
    description: z.string().nullable().optional(),
    handler: UserMiniDTO
});