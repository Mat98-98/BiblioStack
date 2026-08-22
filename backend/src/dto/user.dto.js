import { z } from 'zod';
import { ItemMiniDTO, WorkMiniDTO } from "./shared.dto.js";
import { ReservationStatusEnum } from "./shared.dto.js";

// ======== DTO di supporto ========
const ActiveSuspensionSchema = z.object({
    reason: z.string().nullable(),
    endDate: z.date().optional().nullable(),
}).nullable();

const NoticeMiniSchema = z.object({
    id: z.number(),
    issuedAt: z.date(),
    type: z.object({
        id: z.number(),
        name: z.string(),
    })
});

const ReservationSchema = z.object({
    id: z.number(),
    reservationDate: z.date(),
    expiresAt: z.date().optional().nullable(),
    status: ReservationStatusEnum,
    work: WorkMiniDTO
});

const RoleSchema = z.object({
    id: z.number(),
    name: z.string()
});

const LoanSchema = z.object({
    id: z.number(),
    loanDate: z.date(),
    dueDate: z.date().optional().nullable(),
    returnDate: z.date().optional().nullable(),
    item: ItemMiniDTO
});

// ======== Core DTO ========
const UserCore = z.object({
    id: z.number(),
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable()
});

// ======== DTO base ========
export const UserBaseDTO = UserCore.extend({
    role: RoleSchema,
    email: z.email(),
    suspension: ActiveSuspensionSchema.default(null)
});

export const UserBaseListDTO = z.array(UserBaseDTO);

// ======== DTO dettagliati ========
// Dati visibili nella pagina del profilo dell'utente standard (student)
export const UserDashboardDTO = UserCore.extend({
    email: z.email(),
    phone: z.string().optional().nullable(),
    role: RoleSchema,
    suspension: ActiveSuspensionSchema.default(null),
    loansAsPatron: z.array(LoanSchema).default([]),
    reservations: z.array(ReservationSchema).default([])
})

// Dati visibili nella pagina del profilo dell'utente amministratore (admin/librarian)
export const AdminDashboardDTO = UserCore.extend({
    email: z.email(),
    phone: z.string().optional().nullable(),
    role: RoleSchema,
    suspension: ActiveSuspensionSchema.default(null),
    loansAsPatron: z.array(LoanSchema).default([]),
    reservations: z.array(ReservationSchema).default([]),
    noticesReceived: z.array(NoticeMiniSchema).default([]),
    noticesHandled:  z.array(NoticeMiniSchema).default([])
})

// DTO sicuro per la risposta dopo register/login — niente passwordHash @todo Probabilmente da rimuovere
export const UserSafeDTO = UserCore.extend({
    email:     z.email(),
    phone:     z.string().nullable().optional(),
    role:      RoleSchema,
    createdAt: z.date().nullable().optional(),
});