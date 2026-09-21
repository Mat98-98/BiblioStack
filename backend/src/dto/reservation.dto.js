import { z } from "zod";
import { ItemMiniDTO, ReservationStatusEnum, UserMiniDTO, WorkMiniDTO } from "./shared.dto.js";


const locationMiniSchema = z.object({
    id: z.number(),
    school: z.object({
        id: z.number(),
        name: z.string().nullable()
    })
});

const locationSchema = z.object({
    id: z.number(),
    shelfCode: z.string().nullable(),
    schoolId: z.number(),
    school: z.object({
        id: z.number(),
        cityId: z.number(),
        name: z.string().nullable()
    })
});

const itemMiniSchema = ItemMiniDTO.extend({
    location: locationMiniSchema.nullable()
});

const itemSchema = ItemMiniDTO.extend({
    location: locationSchema.nullable()
})
// Costruisco il core del DTO
const ReservationCore = z.object({
    id: z.number(),
    reservationDate: z.date(),
    status: ReservationStatusEnum,
    expiresAt: z.date().nullable().optional()
});

// DTO base
export const ReservationBaseDTO = ReservationCore;

export const ReservationBaseListDTO = z.array(ReservationBaseDTO);

// DTO dettagliato
export const ReservationDetailDTO = ReservationCore.extend({
    user: UserMiniDTO,
    work: WorkMiniDTO,
    assignedItem: ItemMiniDTO.optional().nullable(),
});

// DTO per la lista prenotazioni utente base
export const ReservationMineListDTO = z.array(
    ReservationCore.extend({
        work: WorkMiniDTO,
    assignedItem: itemMiniSchema.nullable()
    })
);

// DTO per la lista prenotazioni staff
export const ReservationSearchListDTO = z.array(
    ReservationCore.extend({
        user: UserMiniDTO,
        work: WorkMiniDTO,
        assignedItem: itemSchema.nullable()
    })
);