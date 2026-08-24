import { z } from "zod";
import { RESERVATION_STATUS } from "../constants.js";

export const UserMiniDTO = z.object({
    id: z.number(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable()
});

export const AuthorDTO = z.object({
    id: z.number(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable()
});

export const WorkMiniDTO = z.object({
    id: z.string(),
    title: z.string()
});

export const ItemMiniDTO = z.object({
    id: z.string()
});

// Enum
export const ReservationStatusEnum = z.enum(Object.values(RESERVATION_STATUS));