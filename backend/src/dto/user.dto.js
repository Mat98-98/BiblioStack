import { z } from 'zod';
import {AuthorDTO, ItemMiniDTO, WorkMiniDTO} from "./shared.dto.js";
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

const ReservationDashboardSchema = z.object({
    id: z.number(),
    reservationDate: z.date(),
    expiresAt: z.date().optional().nullable(),
    status: ReservationStatusEnum,
    work: WorkMiniDTO.extend({
        authors: z.array(AuthorDTO)
    }),
    assignedItem: ItemMiniDTO.extend({
        location: z.object({
            school:z.object({
                name: z.string().nullable()
            })
        }).nullable()
    }).optional().nullable()
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
    item: ItemMiniDTO.extend({
        work: WorkMiniDTO.extend({
            authors: z.array(AuthorDTO)
        })
    })
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
// Dati visibili nella pagina del profilo dell'utente standard
export const UserDashboardDTO = z.object({
    user: UserCore.extend({
        email: z.email(),
        phone: z.string().optional().nullable(),
        role: RoleSchema,
        suspension: ActiveSuspensionSchema.default(null),
    }),
    activeLoans: z.array(LoanSchema).default([]),
    returnedLoans: z.array(LoanSchema).default([]),
    activeReservations: z.array(ReservationDashboardSchema).default([]),
});

// Dati visibili nella pagina del profilo dell'utente amministratore (admin/librarian)
export const AdminDashboardDTO = UserCore.extend({
    email: z.email(),
    phone: z.string().optional().nullable(),
    role: RoleSchema,
    suspension: ActiveSuspensionSchema.default(null),
    noticesReceived: z.array(NoticeMiniSchema).default([])
});

// DTO sicuro per la risposta dopo register/login — niente passwordHash @todo Probabilmente da rimuovere
export const UserSafeDTO = UserCore.extend({
    email:     z.email(),
    phone:     z.string().nullable().optional(),
    role:      RoleSchema,
    createdAt: z.date().nullable().optional(),
});


// DTO utilizzato per la risposta degli /me
export const UserAuthDTO = UserCore.extend({
    role:     RoleSchema
});