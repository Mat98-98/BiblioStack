import { z } from 'zod';
import {UserMiniDTO, WorkMiniDTO} from "../../dto/shared.dto.js";


export const OperatorDashboardStatsDTO = z.object({
    activeLoans: z.number(),
    overdueLoans: z.number(),
    availableItems: z.number(),
    totalItems: z.number(),
    totalUsers: z.number(),
});

const NoticeTypeSchema = z.object({ id: z.number(), name: z.string() });

export const RecentNoticeDTO = z.object({
    id: z.number(),
    description: z.string().nullable(),
    issuedAt: z.date(),
    user: UserMiniDTO,
    type: NoticeTypeSchema
});

export const RecentNoticeListDTO = z.array(RecentNoticeDTO);


export const ReadyReservationDTO = z.object({
    id: z.number(),
    expiresAt: z.date().nullable(),
    user: UserMiniDTO,
    work: z.object({ title: z.string() }),
    assignedItem: z.object({
        id: z.string(),
        location: z.object({
            shelfCode: z.string().nullable(),
            school: z.object({
                name: z.string().nullable(),
            }),
        }).nullable()
    }).nullable(),
});

export const ReadyReservationListDTO = z.array(ReadyReservationDTO);