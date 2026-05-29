import { z } from "zod";
import { ItemMiniDTO, ReservationStatusEnum, UserMiniDTO, WorkMiniDTO } from "./shared.dto.js";

// Costruisco il core del DTO
const ReservationCore = z.object({
    id: z.number(),
    reservationDate: z.date(),
    status: ReservationStatusEnum
})

// DTO base
export const ReservationBaseDTO = ReservationCore;

export const ReservationBaseListDTO = z.array(ReservationBaseDTO);

// DTO dettagliato
export const ReservationDetailDTO = ReservationCore.extend({
    user: UserMiniDTO,
    work: WorkMiniDTO,
    assignedItem: ItemMiniDTO.optional().nullable(),
    expiryDate: z.date().optional().nullable()
})
